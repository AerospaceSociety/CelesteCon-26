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

from collections import OrderedDict
import json
import os
import re
import smtplib
from datetime import datetime
from email.mime.text import MIMEText
from pathlib import Path
from typing import Optional

import requests
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
API_KEY = os.environ.get("JOTFORM_API_KEY")
FORM_ID = os.environ.get("JOTFORM_FORM_ID")
SUBMISSION_FORM_ID = os.environ.get("JOTFORM_SUBMISSION_FORM_ID", "262451061688056")
INDIVIDUAL_FORM_ID = os.environ.get("JOTFORM_INDIVIDUAL_FORM_ID", "262603349948063")
API_BASE = os.environ.get("JOTFORM_API_BASE", "https://api.jotform.com")
ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "*").split(",")

FIELD_MAP_PATH = Path(__file__).parent / "field_map.json"
FIELD_MAP = json.loads(FIELD_MAP_PATH.read_text()) if FIELD_MAP_PATH.exists() else {}
if not FORM_ID:
    FORM_ID = FIELD_MAP.get("_form_id")

INDIVIDUAL_FIELD_MAP_PATH = Path(__file__).parent / "field_map_individual.json"
INDIVIDUAL_FIELD_MAP = json.loads(INDIVIDUAL_FIELD_MAP_PATH.read_text()) if INDIVIDUAL_FIELD_MAP_PATH.exists() else {}

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
    "In Pursuit of Dispute": {"classMin": 9, "classMax": 12, "min": 3, "max": 3, "maxTeams": 3, "categories": False, "restricted": False},
    "In Pursuit of Dispute (Debate)": {"classMin": 9, "classMax": 12, "min": 3, "max": 3, "maxTeams": 3, "categories": False, "restricted": False},
    "Quizzitch": {"classMin": 6, "classMax": 12, "min": 2, "max": 2, "maxTeams": 2, "categories": False, "restricted": False},
    "Settle-me-this (Space Settlement)": {"classMin": 6, "classMax": 12, "min": 3, "max": 5, "maxTeams": 3, "categories": True, "restricted": False},
    "Business Power Pitch": {"classMin": 6, "classMax": 12, "min": 3, "max": 3, "maxTeams": 3, "categories": False, "restricted": False},
    "Volatus": {"classMin": 6, "classMax": 12, "min": 2, "max": 4, "maxTeams": 3, "categories": False, "restricted": False},
    "Cosmovate": {"classMin": 6, "classMax": 12, "min": 2, "max": 4, "maxTeams": 3, "categories": False, "restricted": False},
    "AEROSS Theatre (Surprise)": {"classMin": 6, "classMax": 12, "min": 1, "max": 3, "maxTeams": 3, "categories": False, "restricted": False},
    "Surprise (AEROSS Theatre)": {"classMin": 6, "classMax": 12, "min": 1, "max": 3, "maxTeams": 3, "categories": False, "restricted": False},
    "Dimension III (3D Design & CAD)": {"classMin": 6, "classMax": 12, "min": 1, "max": 3, "maxTeams": 3, "categories": True, "restricted": False},
    "GameJam": {"classMin": 6, "classMax": 12, "min": 1, "max": 3, "maxTeams": 3, "categories": False, "restricted": False},
    "F1 (F1 in Schools)": {"classMin": 9, "classMax": 12, "min": 3, "max": 5, "maxTeams": 3, "categories": False, "restricted": False},
}
MAX_TEAMS_PER_EVENT = 3

# ---------------------------------------------------------------------------
# Payload schema (must match the JSON built by celestecon_registration.html)
# ---------------------------------------------------------------------------
class Member(BaseModel):
    name: str
    cls: str = Field(alias="class")
    gender: str
    email: Optional[str] = None
    memberId: Optional[str] = None
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
    contact: Optional[str] = ""
    phone: Optional[str] = ""
    email: Optional[str] = ""


class Registration(BaseModel):
    school: School
    submittedAt: str
    events: list[EventEntry]
    totals: dict
    summary: str
    uid: Optional[str] = None
    schoolUID: Optional[str] = None
    isIndividual: Optional[bool] = False
    formID: Optional[str] = None
    registrant: Optional[dict] = None


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
    source: Optional[str] = None


# ---------------------------------------------------------------------------
# Server-side re-validation — never trust client-side checks alone
# ---------------------------------------------------------------------------
def validate_registration(reg: Registration) -> list[str]:
    errors = []
    if not reg.events:
        errors.append("No events selected.")

    max_teams = 1 if reg.isIndividual else MAX_TEAMS_PER_EVENT
    for ev in reg.events:
        rules = EVENTS.get(ev.name)
        if not rules:
            errors.append(f"Unknown event: {ev.name}")
            continue
        if len(ev.teams) > max_teams:
            if reg.isIndividual:
                errors.append(f"{ev.name}: Individual registration is strictly limited to 1 team per competition.")
            else:
                errors.append(f"{ev.name}: more than {MAX_TEAMS_PER_EVENT} teams in a single form.")
        for i, team in enumerate(ev.teams):
            label = f"{ev.name} Entry" if reg.isIndividual else f"{ev.name} Team {i + 1}"
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
    is_ind = bool(reg.isIndividual or reg.formID == INDIVIDUAL_FORM_ID)
    target_form_id = INDIVIDUAL_FORM_ID if is_ind else FORM_ID
    field_map_to_use = INDIVIDUAL_FIELD_MAP if is_ind else FIELD_MAP

    if not API_KEY or not target_form_id:
        return {"submissionID": reg.uid or f"{'IND' if is_ind else 'LOCAL'}-{int(datetime.now().timestamp())}"}
    if not field_map_to_use:
        field_map_to_use = FIELD_MAP

    params = {}

    def qid(name):
        return field_map_to_use.get(name)

    contact_name = reg.registrant.get("name") if (reg.registrant and reg.registrant.get("name")) else reg.school.contact
    contact_email = reg.registrant.get("email") if (reg.registrant and reg.registrant.get("email")) else reg.school.email
    contact_phone = reg.registrant.get("phone") if (reg.registrant and reg.registrant.get("phone")) else reg.school.phone

    if qid("registrant_name"):
        params[f"submission[{qid('registrant_name')}]"] = contact_name
    elif qid("contact_name"):
        params[f"submission[{qid('contact_name')}]"] = contact_name

    if qid("school_name"):
        params[f"submission[{qid('school_name')}]"] = reg.school.name
    if qid("contact_email"):
        params[f"submission[{qid('contact_email')}]"] = contact_email
    if qid("contact_phone"):
        params[f"submission[{qid('contact_phone')}]"] = contact_phone
    if qid("registration_summary"):
        params[f"submission[{qid('registration_summary')}]"] = reg.summary
    if qid("registration_json"):
        params[f"submission[{qid('registration_json')}]"] = reg.model_dump_json()
    if qid("total_teams"):
        params[f"submission[{qid('total_teams')}]"] = str(reg.totals.get("totalTeams", ""))
    if qid("total_participants"):
        params[f"submission[{qid('total_participants')}]"] = str(reg.totals.get("totalParticipants", ""))
    if qid("uid"):
        params[f"submission[{qid('uid')}]"] = str(reg.uid or "")
    if qid("events_selected"):
        # JotForm checkbox fields accept repeated submission[qid][]=value entries
        events_qid = qid("events_selected")
        params_list = [(f"submission[{events_qid}][]", ev.name) for ev in reg.events]
    else:
        params_list = []

    resp = requests.post(
        f"{API_BASE}/form/{target_form_id}/submissions",
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
def _get_db_file(filename: str) -> Path:
    # If running on Vercel or other serverless environment where current dir is read-only
    if os.environ.get("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME"):
        return Path("/tmp") / filename
    local = Path(__file__).parent / filename
    try:
        if not local.exists():
            local.touch()
        return local
    except (OSError, PermissionError):
        return Path("/tmp") / filename

REG_DB_FILE = _get_db_file("registrations_db.json")
SUB_DB_FILE = _get_db_file("submissions_db.json")

# Server-side JotForm API caching layer to protect daily 10,000 call limit
_JOTFORM_CACHE = {
    "last_fetched": 0.0,
    "submissions": [],
}
CACHE_TTL_SECONDS = 300.0  # 5 minutes: max 12 queries per hour = max 288 calls/day (< 3% of 10,000 limit)

def _fetch_jotform_submissions_cached() -> list[dict]:
    import time
    now = time.time()
    if now - _JOTFORM_CACHE["last_fetched"] < CACHE_TTL_SECONDS and _JOTFORM_CACHE["submissions"]:
        return _JOTFORM_CACHE["submissions"]

    if not API_KEY:
        return _JOTFORM_CACHE["submissions"]

    all_subs = []
    target_forms = list(dict.fromkeys(filter(None, [FORM_ID, INDIVIDUAL_FORM_ID])))
    for fid in target_forms:
        try:
            resp = requests.get(
                f"{API_BASE}/form/{fid}/submissions",
                params={"apiKey": API_KEY, "limit": 100, "orderby": "created_at"},
                timeout=10,
            )
            if resp.status_code == 200:
                body = resp.json()
                content = body.get("content", [])
                if isinstance(content, list):
                    all_subs.extend(content)
        except Exception as e:
            print(f"[JotForm Cache] Error querying form {fid}: {e}")

    _JOTFORM_CACHE["last_fetched"] = now
    _JOTFORM_CACHE["submissions"] = all_subs
    return all_subs

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
    prefix = "IND" if getattr(reg, "isIndividual", False) else "SCH"
    uid = reg.uid or f"CLT-2026-{prefix}-{digits}"
    record = {
        "uid": uid,
        "isIndividual": getattr(reg, "isIndividual", False),
        "submissionID": submission_id,
        "school": reg.school.model_dump(),
        "registrant": reg.registrant,
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

# Server-side bounded LRU dictionary to prevent memory leaks under high volume
class BoundedLRUDict(OrderedDict):
    """Memory-safe LRU dictionary that evicts oldest entries when maxsize is exceeded."""
    def __init__(self, maxsize=500, *args, **kwargs):
        self.maxsize = maxsize
        super().__init__(*args, **kwargs)

    def __setitem__(self, key, value):
        if key in self:
            self.move_to_end(key)
        super().__setitem__(key, value)
        if len(self) > self.maxsize:
            self.popitem(last=False)

_LRU_LOOKUP_CACHE = BoundedLRUDict(maxsize=500)

def get_registration_by_uid(uid: str, force_refresh: bool = False) -> Optional[dict]:
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

    # 1. Check in-memory bounded LRU cache (fastest, 0 IO, 0 network)
    if not force_refresh and clean in _LRU_LOOKUP_CACHE:
        return _LRU_LOOKUP_CACHE[clean]

    # 2. Check local / tmp DB
    db = _load_json(REG_DB_FILE)
    if not force_refresh and clean in db:
        _LRU_LOOKUP_CACHE[clean] = db[clean]
        return db[clean]
    digits = re.sub(r"\D", "", clean)
    if not force_refresh:
        for k, v in db.items():
            if clean in k or (len(digits) >= 4 and digits in k):
                _LRU_LOOKUP_CACHE[clean] = v
                return v

    # 3. Check cached JotForm submissions (uses 5-min TTL to strictly minimize API calls)
    cached_subs = _fetch_jotform_submissions_cached()
    for sub in cached_subs:
        sub_id = str(sub.get("id") or "")
        answers = sub.get("answers") or {}
        # Check if sub_id or any answer matches the searched UID
        found_match = clean in sub_id or (len(digits) >= 4 and digits in sub_id)
        raw_json_str = None
        for qid, qdata in answers.items():
            ans_val = str(qdata.get("answer") or "")
            if clean in ans_val.upper() or (len(digits) >= 4 and digits in ans_val):
                found_match = True
            if "registration_json" in str(qdata.get("text") or "").lower() or ans_val.startswith("{"):
                try:
                    json.loads(ans_val)
                    raw_json_str = ans_val
                except Exception:
                    pass

        if found_match and raw_json_str:
            try:
                parsed = json.loads(raw_json_str)
                record = {
                    "uid": parsed.get("uid") or f"CLT-2026-REG-{sub_id[-5:]}",
                    "isIndividual": parsed.get("isIndividual", False),
                    "submissionID": sub_id,
                    "school": parsed.get("school") or {},
                    "registrant": parsed.get("registrant"),
                    "events": parsed.get("events") or [],
                    "totals": parsed.get("totals") or {},
                    "summary": parsed.get("summary") or "",
                    "submittedAt": sub.get("created_at") or datetime.now().isoformat(),
                }
                db[record["uid"].upper()] = record
                db[sub_id] = record
                _save_json(REG_DB_FILE, db)
                _LRU_LOOKUP_CACHE[clean] = record
                return record
            except Exception:
                pass

    # 4. Targeted Single-Submission fallback: if UID contains numeric submission ID >= 5 digits,
    # perform a single direct fetch instead of paginating (only when not found above)
    if API_KEY and len(digits) >= 5:
        try:
            resp = requests.get(f"{API_BASE}/submission/{digits}", params={"apiKey": API_KEY}, timeout=8)
            if resp.status_code == 200:
                sub = resp.json().get("content", {})
                answers = sub.get("answers") or {}
                raw_json_str = None
                for qid, qdata in answers.items():
                    ans_val = str(qdata.get("answer") or "")
                    if "registration_json" in str(qdata.get("text") or "").lower() or ans_val.startswith("{"):
                        try:
                            json.loads(ans_val)
                            raw_json_str = ans_val
                            break
                        except Exception:
                            pass
                if raw_json_str:
                    parsed = json.loads(raw_json_str)
                    record = {
                        "uid": parsed.get("uid") or f"CLT-2026-REG-{digits[-5:]}",
                        "isIndividual": parsed.get("isIndividual", False),
                        "submissionID": digits,
                        "school": parsed.get("school") or {},
                        "registrant": parsed.get("registrant"),
                        "events": parsed.get("events") or [],
                        "totals": parsed.get("totals") or {},
                        "summary": parsed.get("summary") or "",
                        "submittedAt": sub.get("created_at") or datetime.now().isoformat(),
                    }
                    db[record["uid"].upper()] = record
                    _save_json(REG_DB_FILE, db)
                    _LRU_LOOKUP_CACHE[clean] = record
                    return record
        except Exception as e:
            print(f"[Targeted Lookup] Error querying submission {digits}: {e}")

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
    # If client already dispatched via native iframe to submit.jotform.com,
    # skip the redundant REST API call to preserve API quota and prevent duplicates!
    if getattr(sub, "source", None) == "iframe_sync":
        save_submission_record(sub.model_dump(), "")
        return {"submissionID": sub.submissionID or "SUB-SYNC", "status": "recorded_via_web_sync"}

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
        page = Path(__file__).parent.parent / "public" / "celestecon_registration.html"
    if not page.exists():
        raise HTTPException(404, "celestecon_registration.html not found.")
    return FileResponse(page)


@app.get("/individual")
def individual_registration_page():
    page = Path(__file__).parent / "celestecon_individual_registration.html"
    if not page.exists():
        page = Path(__file__).parent.parent / "public" / "celestecon_individual_registration.html"
    if not page.exists():
        raise HTTPException(404, "celestecon_individual_registration.html not found.")
    return FileResponse(page)


@app.get("/api/registration/{uid}")
def lookup_reg(uid: str, force_refresh: bool = False):
    reg = get_registration_by_uid(uid, force_refresh=force_refresh)
    if not reg:
        raise HTTPException(404, "Registration UID not found.")
    return reg

@app.get("/api/submissions/{uid}")
def list_submissions(uid: str):
    return get_submissions_for_uid(uid)

@app.post("/api/webhook/jotform")
async def jotform_webhook(request: Request):
    """
    Event-driven JotForm webhook listener.
    Fires instantly on form submission or edit (0 API call quota consumed).
    Immediately updates local/tmp persistence and invalidates stale caches.
    """
    try:
        content_type = request.headers.get("content-type", "")
        if "application/json" in content_type:
            payload = await request.json()
        else:
            form_data = await request.form()
            payload = dict(form_data)
            if "rawRequest" in payload and isinstance(payload["rawRequest"], str):
                try:
                    payload["rawRequest"] = json.loads(payload["rawRequest"])
                except Exception:
                    pass

        sub_id = str(payload.get("submissionID") or payload.get("id") or "")
        raw_req = payload.get("rawRequest") if isinstance(payload.get("rawRequest"), dict) else payload

        reg_json_str = None
        for k, v in raw_req.items():
            if isinstance(v, str) and ("events" in v or "schoolUID" in v) and v.strip().startswith("{"):
                reg_json_str = v
                break

        if reg_json_str:
            try:
                reg_data = json.loads(reg_json_str)
                uid = reg_data.get("uid") or reg_data.get("schoolUID") or f"CLT-2026-REG-{sub_id[-5:]}"
                db = _load_json(REG_DB_FILE)
                record = {
                    "uid": uid,
                    "isIndividual": reg_data.get("isIndividual", False),
                    "submissionID": sub_id,
                    "school": reg_data.get("school") or {},
                    "registrant": reg_data.get("registrant"),
                    "events": reg_data.get("events") or [],
                    "totals": reg_data.get("totals") or {},
                    "summary": reg_data.get("summary") or "",
                    "submittedAt": datetime.now().isoformat(),
                }
                db[uid.upper()] = record
                if sub_id:
                    db[str(sub_id).upper()] = record
                _save_json(REG_DB_FILE, db)
                _LRU_LOOKUP_CACHE[uid.upper()] = record
                _JOTFORM_CACHE["last_fetched"] = 0.0  # invalidate bulk cache
                return {"status": "ok", "uid": uid, "source": "webhook"}
            except Exception as e:
                print(f"[Webhook] Error parsing registration_json: {e}")

        if "drive_link" in str(raw_req) or "googleDriveUrl" in str(raw_req):
            save_submission_record(raw_req, raw_req.get("uid") or "")
            return {"status": "ok", "type": "submission", "source": "webhook"}

        return {"status": "received", "submissionID": sub_id}
    except Exception as err:
        return {"status": "error", "detail": str(err)}
