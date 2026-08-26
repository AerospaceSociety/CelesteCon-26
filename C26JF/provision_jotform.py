"""
provision_jotform.py
---------------------
Run this ONCE to create the destination JotForm form via the JotForm API.
It creates a form with the fields the registration page + proxy expect, then
writes field_map.json mapping logical field names -> JotForm question IDs (qid).

Usage:
    pip install requests
    export JOTFORM_API_KEY="your-api-key"
    python3 provision_jotform.py

After it runs:
    1. Open the printed form URL and sanity-check the fields in JotForm's builder
       (checkbox options, required flags, textarea sizing) — API-created forms are
       functional but you may want to reorder/style them in the builder.
    2. Copy the printed FORM_ID into jotform_proxy.py (or set JOTFORM_FORM_ID env var).
    3. field_map.json is read by jotform_proxy.py — keep it next to that file.

Docs referenced: https://api.jotform.com/docs/#post-form
"""

import json
import os
import sys

import requests

API_KEY = os.environ.get("JOTFORM_API_KEY")
API_BASE = os.environ.get("JOTFORM_API_BASE", "https://api.jotform.com")  # use eu-api.jotform.com / hipaa-api.jotform.com if applicable

if not API_KEY:
    sys.exit("Set JOTFORM_API_KEY before running this script.")

EVENT_NAMES = [
    "Volatus", "Dimension III", "Quizzitch", "Settle-me-this",
    "Business Power Pitch", "Cosmovate", "In Pursuit of Dispute", "Surprise Event",
]

# Each entry: (type, label, logical_name, extra_params)
QUESTIONS = [
    ("control_head", "CelesteCon 2026 Registration", "form_header", {}),
    ("control_textbox", "School Name", "school_name", {"required": "Yes"}),
    ("control_textbox", "Contact Person", "contact_name", {"required": "Yes"}),
    ("control_email", "Contact Email", "contact_email", {"required": "Yes"}),
    ("control_phone", "Contact Phone", "contact_phone", {"required": "Yes"}),
    ("control_checkbox", "Events Registered", "events_selected", {
        "options": "|".join(EVENT_NAMES),
    }),
    ("control_textarea", "Registration Summary (auto-generated)", "registration_summary", {}),
    ("control_textarea", "Registration Data (JSON — do not edit)", "registration_json", {}),
    ("control_textbox", "Total Teams / Entries", "total_teams", {}),
    ("control_textbox", "Total Participants", "total_participants", {}),
]


def create_form():
    data = {"questions[%d][type]" % i: q[0] for i, q in enumerate(QUESTIONS)}
    for i, (_, label, name, extra) in enumerate(QUESTIONS):
        data[f"questions[{i}][text]"] = label
        data[f"questions[{i}][name]"] = name
        data[f"questions[{i}][order]"] = str(i + 1)
        for k, v in extra.items():
            data[f"questions[{i}][{k}]"] = v
    data["properties[title]"] = "CelesteCon 2026 Registration"

    resp = requests.post(f"{API_BASE}/form", params={"apiKey": API_KEY}, data=data, timeout=30)
    resp.raise_for_status()
    body = resp.json()
    if body.get("responseCode") != 200:
        sys.exit(f"JotForm rejected the form creation request: {body}")
    return body["content"]


def fetch_qid_map(form_id):
    resp = requests.get(f"{API_BASE}/form/{form_id}/questions", params={"apiKey": API_KEY}, timeout=30)
    resp.raise_for_status()
    body = resp.json()
    questions = body.get("content", {})
    name_to_qid = {}
    for qid, q in questions.items():
        name = q.get("name")
        if name:
            name_to_qid[name] = qid
    return name_to_qid


def main():
    print("Creating form on JotForm...")
    form = create_form()
    form_id = form["id"]
    form_url = form.get("url", f"https://www.jotform.com/{form_id}")
    print(f"Form created: {form_url}  (id={form_id})")

    print("Fetching question IDs...")
    field_map = fetch_qid_map(form_id)
    field_map["_form_id"] = form_id
    field_map["_form_url"] = form_url

    with open("field_map.json", "w") as f:
        json.dump(field_map, f, indent=2)

    print("\nWrote field_map.json:")
    print(json.dumps(field_map, indent=2))
    print(
        "\nNext: open the form URL above, review it in JotForm's builder "
        "(checkbox options, required toggles), then point jotform_proxy.py at "
        "this folder's field_map.json and set JOTFORM_FORM_ID="
        f"{form_id}."
    )


if __name__ == "__main__":
    main()
