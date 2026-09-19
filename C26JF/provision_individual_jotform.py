"""
provision_individual_jotform.py
--------------------------------
Provisions or syncs the CelesteCon 2026 Individual Registration form on JotForm
Target Form ID: 262603349948063 (https://www.jotform.com/build/262603349948063)

Usage:
    pip install requests
    export JOTFORM_API_KEY="your-api-key"
    python provision_individual_jotform.py

This script:
  1. Inspects form 262603349948063 via JotForm API
  2. Creates the necessary fields (Registrant Name, Email, Phone, School, Class,
     Events Selected, Summary, JSON data, UID)
  3. Writes field_map_individual.json for the backend proxy
"""

import json
import os
import sys
import requests

API_KEY = os.environ.get("JOTFORM_API_KEY")
API_BASE = os.environ.get("JOTFORM_API_BASE", "https://api.jotform.com")
FORM_ID = os.environ.get("JOTFORM_INDIVIDUAL_FORM_ID", "262603349948063")

EVENT_NAMES = [
    "In Pursuit of Dispute",
    "Quizzitch",
    "Settle-me-this",
    "Business Power Pitch",
    "Volatus",
    "Cosmovate",
    "AEROSS Theatre",
    "Dimension III",
    "GameJam",
    "F1 in Schools"
]

QUESTIONS = [
    ("control_head", "CelesteCon 2026 Individual Registration", "form_header", {}),
    ("control_textbox", "Student / Registrant Full Name", "registrant_name", {"required": "Yes"}),
    ("control_email", "Student Email Address", "contact_email", {"required": "Yes"}),
    ("control_phone", "Contact Phone / WhatsApp", "contact_phone", {"required": "Yes"}),
    ("control_textbox", "School / Institution Name", "school_name", {"required": "Yes"}),
    ("control_textbox", "Class (6-12)", "student_class", {"required": "Yes"}),
    ("control_checkbox", "Competitions Entered (1 team limit)", "events_selected", {
        "options": "|".join(EVENT_NAMES),
    }),
    ("control_textarea", "Registration Summary", "registration_summary", {}),
    ("control_textarea", "Registration Data (JSON)", "registration_json", {}),
    ("control_textbox", "Total Competitions / Teams", "total_teams", {}),
    ("control_textbox", "Total Participants", "total_participants", {}),
    ("control_textbox", "Individual Registration UID", "uid", {}),
]


def update_form_properties():
    data = {
        "properties[title]": "CelesteCon 2026 Individual Registration",
        "properties[description]": "Official registration form for individual and independent entries (limit 1 team per competition)."
    }
    resp = requests.post(f"{API_BASE}/form/{FORM_ID}/properties", params={"apiKey": API_KEY}, data=data, timeout=30)
    return resp.json()


def add_question(q_type, label, name, order, extra_params):
    data = {
        "question[type]": q_type,
        "question[text]": label,
        "question[name]": name,
        "question[order]": str(order),
    }
    for k, v in extra_params.items():
        data[f"question[{k}]"] = v

    resp = requests.post(f"{API_BASE}/form/{FORM_ID}/questions", params={"apiKey": API_KEY}, data=data, timeout=30)
    return resp.json()


def fetch_qid_map():
    resp = requests.get(f"{API_BASE}/form/{FORM_ID}/questions", params={"apiKey": API_KEY}, timeout=30)
    resp.raise_for_status()
    body = resp.json()
    questions = body.get("content", {})
    name_to_qid = {}
    for qid, q in questions.items():
        name = q.get("name")
        if name:
            name_to_qid[name] = qid
        # Map common text labels as fallbacks
        text = q.get("text", "").lower()
        if "name" in text and "registrant_name" not in name_to_qid:
            name_to_qid["registrant_name"] = qid
        if "email" in text and "contact_email" not in name_to_qid:
            name_to_qid["contact_email"] = qid
        if "phone" in text and "contact_phone" not in name_to_qid:
            name_to_qid["contact_phone"] = qid
        if "school" in text and "school_name" not in name_to_qid:
            name_to_qid["school_name"] = qid
    return name_to_qid


def main():
    if not API_KEY:
        print("WARNING: JOTFORM_API_KEY environment variable is not set.")
        print(f"Creating offline default field_map_individual.json for Form #{FORM_ID}...")
        default_map = {
            "form_header": "1",
            "registrant_name": "2",
            "contact_email": "3",
            "contact_phone": "4",
            "school_name": "5",
            "student_class": "6",
            "events_selected": "7",
            "registration_summary": "8",
            "registration_json": "9",
            "total_teams": "10",
            "total_participants": "11",
            "uid": "12",
            "_form_id": FORM_ID,
            "_form_url": f"https://form.jotform.com/{FORM_ID}",
            "_build_url": f"https://www.jotform.com/build/{FORM_ID}"
        }
        with open("field_map_individual.json", "w") as f:
            json.dump(default_map, f, indent=2)
        print("Wrote C26JF/field_map_individual.json.")
        print("To provision directly on JotForm, run with JOTFORM_API_KEY set.")
        return

    print(f"Configuring JotForm #{FORM_ID}...")
    try:
        update_form_properties()
    except Exception as e:
        print(f"Warning: Could not update form properties: {e}")

    print("Adding form questions...")
    for idx, (q_type, label, name, extra) in enumerate(QUESTIONS, start=3):
        try:
            print(f"  Adding field: {label} ({name})...")
            add_question(q_type, label, name, idx, extra)
        except Exception as e:
            print(f"  Error adding {name}: {e}")

    print("Fetching question ID mapping...")
    field_map = fetch_qid_map()
    field_map["_form_id"] = FORM_ID
    field_map["_form_url"] = f"https://form.jotform.com/{FORM_ID}"
    field_map["_build_url"] = f"https://www.jotform.com/build/{FORM_ID}"

    with open("field_map_individual.json", "w") as f:
        json.dump(field_map, f, indent=2)

    print("\nWrote field_map_individual.json:")
    print(json.dumps(field_map, indent=2))
    print(f"\nCompleted! View your form at: https://www.jotform.com/build/{FORM_ID}")


if __name__ == "__main__":
    main()
