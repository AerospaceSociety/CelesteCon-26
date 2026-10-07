"""
jotform_proxy.py
-----------------
FastAPI backend that sits between celestecon_registration.html and JotForm.
Handles validation, generates sequential UIDs (C26-<Letters>-<Serial>),
assigns team & member IDs, synchronizes the registration summary, and forwards
payloads securely to JotForm API without exposing API keys to the browser.
"""

import json
import os
import random
import re
import smtplib
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
API_BASE = os.environ.get("JOTFORM_API_BASE", "https://api.jotform.com").rstrip("/")
ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "*").split(",")

FIELD_MAP_PATH = Path(__file__).parent / "field_map.json"
FIELD_MAP = json.loads(FIELD_MAP_PATH.read_text(encoding="utf-8")) if FIELD_MAP_PATH.exists() else {}
if not FORM_ID:
    FORM_ID = FIELD_MAP.get("_form_id", "261896133006456")

# Optional email confirmation
SMTP_HOST = os.environ.get("SMTP_HOST")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587"))
SMTP_USER = os.environ.get("SMTP_USER")
SMTP_PASS = os.environ.get("SMTP_PASS")
SMTP_FROM = os.environ.get("SMTP_FROM", SMTP_USER or "")

# ---------------------------------------------------------------------------
# Competition Codes & Event Rules
# ---------------------------------------------------------------------------
EVENT_CODES = {
    "settle": "SMT",
    "volatus": "Vol",
    "dispute": "IPOD",
    "bpp": "BPP",
    "theatre": "ATh",
    "gamejam": "CJam",
    "rocketry": "Roc",
    "f1": "APrix",
}

CATEGORY_RANGES = {
    "junior": (6, 8),
    "senior": (9, 12),
    "Junior": (6, 8),
    "Senior": (9, 12),
    "Junior (Classes 6–8)": (6, 8),
    "Senior (Classes 9–12)": (9, 12),
}

EVENTS = {
    "settle": {
        "name": "Settle-Me-This (Space Settlement Design)",
        "aliases": ["Settle-Me-This", "Settle-me-this", "SMT"],
        "classMin": 6,
        "classMax": 12,
        "min": 3,
        "max": 5,
        "categories": True,
        "maxTeams": 2,
    },
    "volatus": {
        "name": "Volatus (Aviation, UAV & 3D CAD)",
        "aliases": ["Volatus", "Vol"],
        "classMin": 9,
        "classMax": 12,
        "min": 3,
        "max": 3,
        "categories": False,
        "maxTeams": 1,
    },
    "dispute": {
        "name": "In Pursuit of Dispute (Debate & Quizzitch)",
        "aliases": ["In Pursuit of Dispute", "IPOD", "Debate", "Dispute"],
        "classMin": 9,
        "classMax": 12,
        "min": 1,
        "max": 1,
        "categories": False,
        "maxTeams": 1,
    },
    "bpp": {
        "name": "Business Power Pitch",
        "aliases": ["Business Power Pitch", "BPP"],
        "classMin": 6,
        "classMax": 12,
        "min": 3,
        "max": 3,
        "categories": True,
        "maxTeams": 2,
    },
    "gamejam": {
        "name": "CelesteJam",
        "aliases": ["CelesteJam", "CJam"],
        "classMin": 6,
        "classMax": 12,
        "min": 2,
        "max": 3,
        "categories": True,
        "maxTeams": 2,
    },
    "theatre": {
        "name": "AEROSS Theatre",
        "aliases": ["AEROSS Theatre", "ATh", "Theatre"],
        "classMin": 9,
        "classMax": 12,
        "min": 3,
        "max": 5,
        "categories": False,
        "maxTeams": 1,
    },
    "rocketry": {
        "name": "Rocketry",
        "aliases": ["Rocketry", "Roc"],
        "classMin": 6,
        "classMax": 12,
        "min": 2,
        "max": 3,
        "categories": True,
        "maxTeams": 2,
    },
    "f1": {
        "name": "AEROSS Prix",
        "aliases": ["AEROSS Prix", "APrix", "F1", "Prix"],
        "classMin": 9,
        "classMax": 12,
        "min": 3,
        "max": 5,
        "categories": False,
        "maxTeams": 1,
    },
}


def get_event_rule(ev_id: str, ev_name: str) -> Optional[dict]:
    if ev_id in EVENTS:
        return EVENTS[ev_id]
    for key, rule in EVENTS.items():
        if key.lower() == (ev_id or "").lower() or rule["name"].lower() == (ev_name or "").lower():
            return rule
        for alias in rule.get("aliases", []):
            if alias.lower() in (ev_name or "").lower() or (ev_name or "").lower() in alias.lower():
                return rule
    return None


def get_random_letters() -> str:
    letters = "ABCDEFGHJKLMNPQRSTUVWXYZ"
    return "".join(random.choice(letters) for _ in range(2))


def get_next_server_serial() -> Optional[str]:
    if not API_KEY or not FORM_ID:
        return None
    try:
        resp = requests.get(f"{API_BASE}/form/{FORM_ID}", params={"apiKey": API_KEY}, timeout=5)
        if resp.status_code == 200:
            count = int(resp.json().get("content", {}).get("count", 0))
            return f"{101 + count:04d}"
    except Exception:
        pass
    return None


# ---------------------------------------------------------------------------
# Payload schema
# ---------------------------------------------------------------------------
class Member(BaseModel):
    name: str
    email: Optional[str] = None
    cls: str = Field(alias="class")
    gender: str
    memberId: Optional[str] = None
    model_config = {"populate_by_name": True, "extra": "allow"}


class Team(BaseModel):
    teamId: Optional[str] = None
    teamName: Optional[str] = None
    rawCategory: Optional[str] = None
    category: Optional[str] = None
    cosmovateConfirmed: Optional[bool] = None
    restrictedConfirmed: Optional[bool] = None
    members: list[Member]
    model_config = {"extra": "allow"}


class EventEntry(BaseModel):
    id: str
    name: str
    trackType: Optional[str] = None
    trackLabel: Optional[str] = None
    teams: list[Team]
    model_config = {"extra": "allow"}


class School(BaseModel):
    name: str
    contact: str
    phone: str
    email: str
    model_config = {"extra": "allow"}


class Registration(BaseModel):
    school: School
    submittedAt: str
    events: list[EventEntry]
    totals: dict
    summary: str
    schoolUID: Optional[str] = None
    multiEventStudents: Optional[list] = None
    model_config = {"extra": "allow"}


# ---------------------------------------------------------------------------
# UID & Summary Synchronization
# ---------------------------------------------------------------------------
def generate_summary(events: list[EventEntry], school_uid: str, multi_event_students: Optional[list] = None) -> str:
    if not events:
        return "(no events selected yet)"

    header_note = f"School ID (UID): {school_uid or 'PENDING SUBMISSION'}\n\n"
    if multi_event_students:
        header_note += "[SCHEDULE ADVISORY — MULTI-COMPETITION STUDENTS]\n"
        for s in multi_event_students:
            s_name = s.get("name") if isinstance(s, dict) else getattr(s, "name", "-")
            s_email = s.get("email") if isinstance(s, dict) else getattr(s, "email", "-")
            s_evs = s.get("events", []) if isinstance(s, dict) else getattr(s, "events", [])
            header_note += f"• {s_name} ({s_email}) ➔ {', '.join(s_evs)}\n  *Timing for offline rounds on campus may clash; student/school responsibility.\n"
        header_note += "\n"

    event_lines = []
    for e in events:
        team_lines = []
        for i, t in enumerate(e.teams or []):
            t_id = t.teamId or f"Team {i + 1}"
            t_name = t.teamName or f"Team {i + 1}"
            track_part = f" / Track: {t.category}" if t.category else (f" / {e.trackLabel}" if e.trackLabel else "")
            header = f"  [{t_id}] Team: {t_name}{track_part}"
            members_lines = []
            for j, m in enumerate(t.members or []):
                m_id = m.memberId or "ID Pending"
                m_email = m.email or "No email"
                m_cls = m.cls or "-"
                m_gender = m.gender or "-"
                members_lines.append(f"    {j + 1}. {m.name or '-'} [ID: {m_id}] ({m_email}, Class {m_cls}, {m_gender})")
            team_lines.append(header + ("\n" + "\n".join(members_lines) if members_lines else ""))
        track_hdr = f" [{e.trackLabel}]" if e.trackLabel else ""
        event_lines.append(f"{e.name}{track_hdr}\n" + "\n".join(team_lines))

    return header_note + "\n\n".join(event_lines)


def sync_registration_uids(reg: Registration) -> str:
    server_serial = get_next_server_serial()
    match = re.match(r"^C26-([A-Za-z]{2})-", reg.schoolUID or "")
    letters = match.group(1).upper() if match else get_random_letters()

    if server_serial:
        official_uid = f"C26-{letters}-{server_serial}"
    elif reg.schoolUID and reg.schoolUID.startswith("C26-"):
        official_uid = reg.schoolUID
    else:
        official_uid = f"C26-{letters}-0101"

    reg.schoolUID = official_uid

    if reg.events:
        for ev in reg.events:
            code = EVENT_CODES.get(ev.id, ev.id)
            is_dual = ev.id in ("settle", "bpp", "gamejam", "rocketry") or (ev.trackType or "").lower() == "dual"
            category_counts = {}

            for t in (ev.teams or []):
                if is_dual:
                    cat_str = str(t.rawCategory or t.category or "").lower()
                    is_senior = "senior" in cat_str
                    cat = "Sr" if is_senior else "Jr"
                    category_counts[cat] = category_counts.get(cat, 0) + 1
                    count = category_counts[cat]
                    cat_tag = f"-{cat}{count if count > 1 else ''}"
                else:
                    category_counts["single"] = category_counts.get("single", 0) + 1
                    count = category_counts["single"]
                    cat_tag = f"-T{count}" if count > 1 else ""

                t.teamId = f"{official_uid}-{code}{cat_tag}"
                for m_idx, m in enumerate(t.members or []):
                    m.memberId = f"{t.teamId}-M{m_idx + 1}"

        reg.summary = generate_summary(reg.events, official_uid, reg.multiEventStudents)

    return official_uid


# ---------------------------------------------------------------------------
# Server-side validation
# ---------------------------------------------------------------------------
def validate_registration(reg: Registration) -> list[str]:
    errors = []
    if not reg.events:
        errors.append("No events selected.")

    for ev in reg.events:
        rules = get_event_rule(ev.id, ev.name)
        if not rules:
            errors.append(f"Unknown event: {ev.name} (id: {ev.id})")
            continue
        max_teams = rules.get("maxTeams", 1)
        if len(ev.teams) > max_teams:
            errors.append(f"{ev.name}: more than {max_teams} teams in a single form (submitted {len(ev.teams)}).")

        if rules["categories"]:
            seen_categories = set()
            for team in ev.teams:
                cat = team.rawCategory or team.category or ""
                normalized_cat = "junior" if "junior" in cat.lower() else ("senior" if "senior" in cat.lower() else cat)
                if not normalized_cat:
                    errors.append(f"{ev.name}: team is missing category selection.")
                elif normalized_cat in seen_categories:
                    errors.append(f"{ev.name}: duplicate team entered for category {cat}. Only 1 team per category allowed.")
                else:
                    seen_categories.add(normalized_cat)

        for i, team in enumerate(ev.teams):
            label = f"{ev.name} Entry {i + 1}" if rules["min"] == rules["max"] == 1 else f"{ev.name} Team {i + 1}"
            if not (rules["min"] <= len(team.members) <= rules["max"]):
                req_str = f"exactly {rules['min']}" if rules["min"] == rules["max"] else f"{rules['min']}–{rules['max']}"
                errors.append(f"{label}: member count {len(team.members)} outside allowed range ({req_str}).")
            cls_min, cls_max = rules["classMin"], rules["classMax"]
            if rules["categories"]:
                cat = team.rawCategory or team.category or ""
                if "junior" in cat.lower():
                    cls_min, cls_max = 6, 8
                elif "senior" in cat.lower():
                    cls_min, cls_max = 9, 12
                elif cat in CATEGORY_RANGES:
                    cls_min, cls_max = CATEGORY_RANGES[cat]

            for j, m in enumerate(team.members):
                if not m.name.strip():
                    errors.append(f"{label} Member {j + 1}: name missing.")
                cls_clean = str(m.cls).strip()
                if not cls_clean.isdigit() or not (cls_min <= int(cls_clean) <= cls_max):
                    errors.append(f"{label} Member {j + 1}: class {cls_clean!r} outside eligible range {cls_min}–{cls_max}.")
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

    return body.get("content") or body


def send_confirmation_email(reg: Registration):
    if not SMTP_HOST:
        return
    msg = MIMEText(
        f"Registration received for {reg.school.name} (UID: {reg.schoolUID}).\n\n{reg.summary}"
    )
    msg["Subject"] = f"CelesteCon 2026 - Registration received: {reg.school.name} [{reg.schoolUID}]"
    msg["From"] = SMTP_FROM
    msg["To"] = reg.school.email
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASS)
        server.sendmail(SMTP_FROM, [reg.school.email], msg.as_string())


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(title="CelesteCon 2026 Registration Proxy")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


@app.post("/api/submit")
def submit(reg: Registration):
    errors = validate_registration(reg)
    if errors:
        raise HTTPException(422, {"errors": errors})

    official_school_uid = sync_registration_uids(reg)
    result = submit_to_jotform(reg)

    try:
        send_confirmation_email(reg)
    except Exception:
        pass

    submission_id = result.get("submissionID") if isinstance(result, dict) else None
    return {
        "success": True,
        "submissionID": submission_id,
        "schoolUID": official_school_uid,
        "jotform": result,
    }


@app.get("/api/health")
def health():
    return {
        "jotform_configured": bool(API_KEY and FORM_ID and FIELD_MAP),
        "email_configured": bool(SMTP_HOST),
    }


@app.get("/")
def registration_page():
    local_page = Path(__file__).parent / "celestecon_registration.html"
    if local_page.exists():
        return FileResponse(local_page)
    parent_page = Path(__file__).parent.parent / "public" / "celestecon_registration.html"
    if parent_page.exists():
        return FileResponse(parent_page)
    raise HTTPException(404, "celestecon_registration.html not found.")
