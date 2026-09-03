"""
jotform_proxy.py
-----------------
A small FastAPI backend that sits between celestecon_registration.html and JotForm.

Why a proxy at all: the browser can't safely hold a JotForm API key (anyone who
views page source would get it), and JotForm submissions made via API skip
JotForm's own email notifications — so this proxy holds the key server-side,
re-validates the payload (never trust the client), forwards it to JotForm, and
can optionally send its own confirmation email.

Run it:
    pip install fastapi uvicorn requests --break-system-packages
    export JOTFORM_API_KEY="your-api-key"
    uvicorn jotform_proxy:app --reload --port 8000

The root route serves celestecon_registration.html from the same origin, so the
page's fetch('/api/submit') works without exposing the JotForm API key.
"""

import json
import os
import re
import smtplib
from datetime import datetime
from email.mime.text import MIMEText
from pathlib import Path
from typing import Optional

import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
API_KEY = os.environ.get("JOTFORM_API_KEY")
FORM_ID = os.environ.get("JOTFORM_FORM_ID")
SUBMISSION_FORM_ID = os.environ.get("JOTFORM_SUBMISSION_FORM_ID", "262451061688056")
API_BASE = os.environ.get("JOTFORM_API_BASE", "https://api.jotform.com")
ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "*").split(",")

FIELD_MAP_PATH = Path(__file__).parent / "field_map.json"
FIELD_MAP = json.loads(FIELD_MAP_PATH.read_text()) if FIELD_MAP_PATH.exists() else {}
if not FORM_ID:
    FORM_ID = FIELD_MAP.get("_form_id")

# Optional email confirmation (off unless SMTP_HOST is set) — e.g. point this at
# the Zoho Mail SMTP already configured for aeross.org / DIPST if you want a
# receipt sent without relying on JotForm's (disabled-for-API) notifications.
SMTP_HOST = os.environ.get("SMTP_HOST")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587"))
SMTP_USER = os.environ.get("SMTP_USER")
SMTP_PASS = os.environ.get("SMTP_PASS")
SMTP_FROM = os.environ.get("SMTP_FROM", SMTP_USER or "")

# ---------------------------------------------------------------------------
# Event rules — mirrors EVENTS in celestecon_registration.html.
# Kept in sync manually; if you change one, change the other.
# ---------------------------------------------------------------------------
CATEGORY_RANGES = {
    "Junior (Classes 6–8)": (6, 8),
    "Senior (Classes 9–12)": (9, 12),
}

EVENTS = {
    "In Pursuit of Dispute (Debate)": {"classMin": 9, "classMax": 12, "min": 2, "max": 2, "maxTeams": 1, "categories": False, "restricted": False},
    "Quizzitch": {"classMin": 6, "classMax": 12, "min": 2, "max": 2, "categories": False, "restricted": False},
    "Settle-me-this (Space Settlement)": {"classMin": 6, "classMax": 12, "min": 3, "max": 5, "categories": True, "restricted": False},
    "Business Power Pitch": {"classMin": 6, "classMax": 12, "min": 3, "max": 3, "categories": False, "restricted": False},
    "Volatus": {"classMin": 6, "classMax": 12, "min": 2, "max": 4, "categories": False, "restricted": False},
    "Cosmovate": {"classMin": 6, "classMax": 12, "min": 2, "max": 3, "categories": False, "restricted": False},
    "Surprise (AEROSS Theatre)": {"classMin": 6, "classMax": 12, "min": 1, "max": 3, "categories": False, "restricted": False},
    "Dimension III (3D Design & CAD)": {"classMin": 6, "classMax": 12, "min": 1, "max": 2, "categories": True, "restricted": False},
    "GameJam": {"classMin": 6, "classMax": 12, "min": 1, "max": 3, "categories": False, "restricted": False},
    "F1 (F1 in Schools)": {"classMin": 9, "classMax": 12, "min": 3, "max": 5, "categories": False, "restricted": False},
}
MAX_TEAMS_PER_EVENT = 2

# ---------------------------------------------------------------------------
# Payload schema (must match the JSON built by celestecon_registration.html)
# ---------------------------------------------------------------------------
class Member(BaseModel):
    name: str
    cls: str = Field(alias="class")
    gender: str
    model_config = {"populate_by_name": True}


class Team(BaseModel):
    teamName: Optional[str] = None
    category: Optional[str] = None
    cosmovateConfirmed: Optional[bool] = None
    members: list[Member]


class EventEntry(BaseModel):
    id: str
    name: str
    teams: list[Team]


class School(BaseModel):
    name: str
    contact: str
    phone: str
    email: str


class Registration(BaseModel):
    school: School
    submittedAt: str
    events: list[EventEntry]
    totals: dict
    summary: str


class DeliverableContact(BaseModel):
    name: str
    email: str
    phone: str


class EventPrompt(BaseModel):
    id: str
    code: str
    name: str


class DeliverableSubmission(BaseModel):
    formID: Optional[str] = None
    submissionID: Optional[str] = None
    submittedAt: str
    event: EventPrompt
    school: str
    team: str
    contact: DeliverableContact
    category: Optional[str] = None
    projectTitle: Optional[str] = None
    googleDriveUrl: str
    notes: Optional[str] = None


# ---------------------------------------------------------------------------
# Server-side re-validation — never trust client-side checks alone
# ---------------------------------------------------------------------------
def validate_registration(reg: Registration) -> list[str]:
    errors = []
    if not reg.events:
        errors.append("No events selected.")

    for ev in reg.events:
        rules = EVENTS.get(ev.name)
        if not rules:
            errors.append(f"Unknown event: {ev.name}")
            continue
        if len(ev.teams) > MAX_TEAMS_PER_EVENT:
            errors.append(f"{ev.name}: more than {MAX_TEAMS_PER_EVENT} teams in a single form.")
        for i, team in enumerate(ev.teams):
            label = f"{ev.name} Team {i + 1}"
            if rules["restricted"] and not team.cosmovateConfirmed:
                errors.append(f"{label}: DPS R.K. Puram confirmation missing.")
            if not (rules["min"] <= len(team.members) <= rules["max"]):
                errors.append(f"{label}: member count {len(team.members)} outside {rules['min']}-{rules['max']}.")
            cls_min, cls_max = rules["classMin"], rules["classMax"]
            if rules["categories"]:
                if not team.category or team.category not in CATEGORY_RANGES:
                    errors.append(f"{label}: missing/invalid category.")
                else:
                    cls_min, cls_max = CATEGORY_RANGES[team.category]
            for j, m in enumerate(team.members):
                if not m.name.strip():
                    errors.append(f"{label} Member {j + 1}: name missing.")
                if not m.cls.strip().isdigit() or not (cls_min <= int(m.cls) <= cls_max):
                    errors.append(f"{label} Member {j + 1}: class {m.cls!r} outside {cls_min}-{cls_max}.")
    return errors


# ---------------------------------------------------------------------------
# JotForm submission
# ---------------------------------------------------------------------------
def submit_to_jotform(reg: Registration) -> dict:
    if not API_KEY or not FORM_ID:
        raise HTTPException(500, "JOTFORM_API_KEY / JOTFORM_FORM_ID not configured on the server.")
    if not FIELD_MAP:
        raise HTTPException(500, "field_map.json not found — run provision_jotform.py first.")

    params = {}

    def qid(name):
        return FIELD_MAP.get(name)

    if qid("school_name"):
        params[f"submission[{qid('school_name')}]"] = reg.school.name
    if qid("contact_name"):
        params[f"submission[{qid('contact_name')}]"] = reg.school.contact
    if qid("contact_email"):
        params[f"submission[{qid('contact_email')}]"] = reg.school.email
    if qid("contact_phone"):
        params[f"submission[{qid('contact_phone')}]"] = reg.school.phone
    if qid("registration_summary"):
        params[f"submission[{qid('registration_summary')}]"] = reg.summary
    if qid("registration_json"):
        params[f"submission[{qid('registration_json')}]"] = reg.model_dump_json()
    if qid("total_teams"):
        params[f"submission[{qid('total_teams')}]"] = str(reg.totals.get("totalTeams", ""))
    if qid("total_participants"):
        params[f"submission[{qid('total_participants')}]"] = str(reg.totals.get("totalParticipants", ""))
    if qid("events_selected"):
        # JotForm checkbox fields accept repeated submission[qid][]=value entries
        events_qid = qid("events_selected")
        params_list = [(f"submission[{events_qid}][]", ev.name) for ev in reg.events]
    else:
        params_list = []

    resp = requests.post(
        f"{API_BASE}/form/{FORM_ID}/submissions",
        params={"apiKey": API_KEY},
        data=list(params.items()) + params_list,
        timeout=30,
    )
    try:
        body = resp.json()
    except ValueError:
        raise HTTPException(502, f"JotForm returned a non-JSON response (status {resp.status_code}).")

    if body.get("responseCode") not in (200, 201):
        raise HTTPException(502, f"JotForm rejected the submission: {body}")

    return body["content"]


def submit_deliverable_to_jotform(sub: DeliverableSubmission) -> dict:
    target_form_id = sub.formID or SUBMISSION_FORM_ID
    if not API_KEY:
        return {"submissionID": sub.submissionID or "SUB-LOCAL"}

    params = {
        "submission[school]": sub.school,
        "submission[team]": sub.team,
        "submission[contact_name]": sub.contact.name,
        "submission[contact_email]": sub.contact.email,
        "submission[contact_phone]": sub.contact.phone,
        "submission[event]": f"{sub.event.name} ({sub.event.code})",
        "submission[category]": sub.category or "",
        "submission[project_title]": sub.projectTitle or "",
        "submission[drive_link]": sub.googleDriveUrl,
        "submission[notes]": sub.notes or "",
    }
    resp = requests.post(
        f"{API_BASE}/form/{target_form_id}/submissions",
        params={"apiKey": API_KEY},
        data=list(params.items()),
        timeout=30,
    )
    try:
        body = resp.json()
        if body.get("responseCode") in (200, 201):
            return body.get("content", {})
    except Exception:
        pass
    return {"submissionID": sub.submissionID}


def send_confirmation_email(reg: Registration):
    if not SMTP_HOST:
        return  # email confirmation not configured — skip silently
    msg = MIMEText(
        f"Registration received for {reg.school.name}.\n\n{reg.summary}"
    )
    msg["Subject"] = f"CelesteCon 2026 - Registration received: {reg.school.name}"
    msg["From"] = SMTP_FROM
    msg["To"] = reg.school.email
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASS)
        server.sendmail(SMTP_FROM, [reg.school.email], msg.as_string())


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(title="CelesteCon 2026 Registration & Submissions Proxy")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)



# ---------------------------------------------------------------------------
# Local Registration & Submission Persistence
# ---------------------------------------------------------------------------
REG_DB_FILE = Path(__file__).parent / "registrations_db.json"
SUB_DB_FILE = Path(__file__).parent / "submissions_db.json"

def _load_json(path: Path) -> dict:
    if not path.exists():
        return {}
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}

def _save_json(path: Path, data: dict):
    try:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        print(f"[DB] Error saving {path}: {e}")

def save_registration_record(reg: Registration, submission_id: str) -> str:
    db = _load_json(REG_DB_FILE)
    digits = re.sub(r"\D", "", str(submission_id))[-5:].zfill(5)
    uid = f"CLT-2026-{digits}"
    record = {
        "uid": uid,
        "submissionID": submission_id,
        "school": reg.school.model_dump(),
        "events": [ev.model_dump() for ev in reg.events],
        "totals": reg.totals,
        "summary": reg.summary,
        "submittedAt": datetime.now().isoformat(),
    }
    db[uid.upper()] = record
    if submission_id:
        db[str(submission_id).upper()] = record
    _save_json(REG_DB_FILE, db)
    return uid

def get_registration_by_uid(uid: str) -> Optional[dict]:
    clean = uid.strip().upper()
    if clean in ("CLT-2026-DEMO", "DEMO"):
        return {
            "uid": "CLT-2026-DEMO",
            "submissionID": "DEMO-98765",
            "school": {
                "name": "Delhi Public School, R.K. Puram",
                "contact": "Aditya Mathur",
                "email": "celestecon@dpsrkp.net",
                "phone": "+91 98100 12345"
            },
            "events": [
                {
                    "id": "dispute",
                    "name": "In Pursuit of Dispute (Debate)",
                    "teams": [{"teamName": "Team Veritas", "category": "Senior (Classes 9-12)", "members": []}]
                },
                {
                    "id": "settle",
                    "name": "Settle-me-this (Space Settlement)",
                    "teams": [
                        {"teamName": "Habitat Sol Invictus", "category": "Senior (Classes 9-12)", "members": []},
                        {"teamName": "Lunar Pioneer Alpha", "category": "Junior (Classes 6-8)", "members": []}
                    ]
                }
            ],
            "totals": {"totalEvents": 2, "totalTeams": 3, "totalParticipants": 8}
        }
    db = _load_json(REG_DB_FILE)
    if clean in db:
        return db[clean]
    digits = re.sub(r"\D", "", clean)
    for k, v in db.items():
        if clean in k or (len(digits) >= 4 and digits in k):
            return v
    return None

def save_submission_record(sub_data: dict, uid: str = ""):
    db = _load_json(SUB_DB_FILE)
    clean_uid = (uid or sub_data.get("uid") or "UNKNOWN").strip().upper()
    if clean_uid not in db:
        db[clean_uid] = []
    db[clean_uid].append({
        **sub_data,
        "savedAt": datetime.now().isoformat()
    })
    _save_json(SUB_DB_FILE, db)

def get_submissions_for_uid(uid: str) -> list[dict]:
    clean = uid.strip().upper()
    db = _load_json(SUB_DB_FILE)
    return db.get(clean, [])

@app.post("/api/submission")
def submit_deliverable(sub: DeliverableSubmission):
    result = submit_deliverable_to_jotform(sub)
    save_submission_record(sub.model_dump(), "")
    return {"submissionID": result.get("submissionID") or sub.submissionID, "jotform": result}


@app.post("/api/submit")
def submit(payload: dict):
    # Route deliverable submissions (from /submissions)
    if "googleDriveUrl" in payload or payload.get("formID") == SUBMISSION_FORM_ID:
        try:
            sub = DeliverableSubmission.model_validate(payload)
            result = submit_deliverable_to_jotform(sub)
            return {"submissionID": result.get("submissionID") or sub.submissionID, "jotform": result}
        except Exception as err:
            raise HTTPException(422, {"detail": str(err)})

    # Otherwise route general school registrations
    try:
        reg = Registration.model_validate(payload)
    except Exception as err:
        raise HTTPException(422, {"detail": str(err)})

    errors = validate_registration(reg)
    if errors:
        raise HTTPException(422, {"errors": errors})

    result = submit_to_jotform(reg)
    sub_id = result.get("submissionID") or f"LOCAL-{int(datetime.now().timestamp())}"
    uid = save_registration_record(reg, sub_id)

    try:
        send_confirmation_email(reg)
    except Exception:
        pass  # never fail the registration just because the receipt email failed

    return {"submissionID": result.get("submissionID") or sub_id, "uid": uid, "jotform": result}


@app.get("/api/health")
def health():
    return {
        "jotform_configured": bool(API_KEY and FORM_ID and FIELD_MAP),
        "email_configured": bool(SMTP_HOST),
    }


@app.get("/")
def registration_page():
    page = Path(__file__).parent / "celestecon_registration.html"
    if not page.exists():
        raise HTTPException(404, "celestecon_registration.html not found.")
    return FileResponse(page)


@app.get("/api/registration/{uid}")
def lookup_reg(uid: str):
    reg = get_registration_by_uid(uid)
    if not reg:
        raise HTTPException(404, "Registration UID not found.")
    return reg

@app.get("/api/submissions/{uid}")
def list_submissions(uid: str):
    return get_submissions_for_uid(uid)
