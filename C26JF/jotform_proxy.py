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
        "aliases": ["Settle-Me-This", "Settle-me-this"],
        "classMin": 6,
        "classMax": 12,
        "min": 3,
        "max": 5,
        "categories": True,
        "maxTeams": 2,
    },
    "volatus": {
        "name": "Volatus (Aviation, UAV & 3D CAD)",
        "aliases": ["Volatus"],
        "classMin": 9,
        "classMax": 12,
        "min": 3,
        "max": 3,
        "categories": False,
        "maxTeams": 1,
    },
    "dispute": {
        "name": "In Pursuit of Dispute (Debate & Quizzitch)",
        "aliases": ["In Pursuit of Dispute"],
        "classMin": 9,
        "classMax": 12,
        "min": 2,
        "max": 2,
        "categories": False,
        "maxTeams": 1,
    },
    "bpp": {
        "name": "Business Power Pitch",
        "aliases": ["Business Power Pitch"],
        "classMin": 6,
        "classMax": 12,
        "min": 3,
        "max": 3,
        "categories": True,
        "maxTeams": 2,
    },
    "gamejam": {
        "name": "CelesteJam",
        "aliases": ["CelesteJam"],
        "classMin": 6,
        "classMax": 12,
        "min": 2,
        "max": 3,
        "categories": True,
        "maxTeams": 2,
    },
    "theatre": {
        "name": "AEROSS Theatre",
        "aliases": ["AEROSS Theatre"],
        "classMin": 9,
        "classMax": 12,
        "min": 3,
        "max": 5,
        "categories": False,
        "maxTeams": 1,
    },
    "rocketry": {
        "name": "Rocketry",
        "aliases": ["Rocketry"],
        "classMin": 6,
        "classMax": 12,
        "min": 2,
        "max": 3,
        "categories": True,
        "maxTeams": 2,
    },
    "f1": {
        "name": "AEROSS Prix",
        "aliases": ["AEROSS Prix", "F1", "Prix"],
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

# ---------------------------------------------------------------------------
# Payload schema (must match the JSON built by celestecon_registration.html)
# ---------------------------------------------------------------------------
class Member(BaseModel):
    name: str
    email: Optional[str] = None
    cls: str = Field(alias="class")
    gender: str
    memberId: Optional[str] = None
    model_config = {"populate_by_name": True}


class Team(BaseModel):
    teamId: Optional[str] = None
    teamName: Optional[str] = None
    category: Optional[str] = None
    cosmovateConfirmed: Optional[bool] = None
    restrictedConfirmed: Optional[bool] = None
    members: list[Member]


class EventEntry(BaseModel):
    id: str
    name: str
    trackType: Optional[str] = None
    trackLabel: Optional[str] = None
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


# ---------------------------------------------------------------------------
# Server-side re-validation — never trust client-side checks alone
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

        # For dual-category events (settle, bpp, gamejam, rocketry), max 1 team per category
        if rules["categories"]:
            seen_categories = set()
            for team in ev.teams:
                cat = team.category or ""
                normalized_cat = "junior" if "junior" in cat.lower() else ("senior" if "senior" in cat.lower() else cat)
                if not normalized_cat:
                    errors.append(f"{ev.name}: team is missing category selection.")
                elif normalized_cat in seen_categories:
                    errors.append(f"{ev.name}: duplicate team entered for category {cat}. Only 1 team per category allowed.")
                else:
                    seen_categories.add(normalized_cat)

        for i, team in enumerate(ev.teams):
            label = f"{ev.name} Team {i + 1}"
            if not (rules["min"] <= len(team.members) <= rules["max"]):
                errors.append(f"{label}: member count {len(team.members)} outside allowed range {rules['min']}–{rules['max']}.")
            cls_min, cls_max = rules["classMin"], rules["classMax"]
            if rules["categories"]:
                cat = team.category or ""
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

    result = submit_to_jotform(reg)

    try:
        send_confirmation_email(reg)
    except Exception:
        pass  # never fail the registration just because the receipt email failed

    return {"submissionID": result.get("submissionID"), "jotform": result}


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
