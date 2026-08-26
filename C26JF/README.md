# CelesteCon 2026 Registration - Rebuild Spec

Rebuild of the Tally form (`tally.so/r/lbAebW`) with event-aware team logic and a
path to JotForm as the storage backend. Three files, tested end-to-end (see
`test/` — jsdom smoke test for the form, pytest-style script for the proxy).

## What changed vs. the Tally form

| Tally form | This rebuild |
|---|---|
| One free-text "Members Detail" box, hand-formatted per person | Structured Name / Class / Gender rows, added one at a time |
| No link between chosen event and team size | Each event carries its own min/max; the **Add Member** button disables itself the moment the cap is hit |
| One event, one team, per submission | Check as many events as you like; each gets its own team builder |
| No way to register a second team for the same event | **Add another team** button, hard-capped at 2 — a third attempt is told to submit a new form |
| No eligibility check | Class-range validation per event, and per Junior/Senior category where the brochure splits one |
| Cosmovate had no school gate | Selecting Cosmovate requires an explicit "DPS R.K. Puram" confirmation per team |
| Submits into Tally's own store | Submits into **your** JotForm account via API, so JotForm Tables / Sheets export / Inbox still work |

Assumption I made: swapped the original **Age** field for **Class (6–12)**, since
every eligibility rule in the brochure is written in terms of class, not age.
Flag it if you want Age back alongside Class.

## Event rules (as coded in both the form and the proxy)

| Event | Classes | Team size | Categories | Notes |
|---|---|---|---|---|
| Volatus | 9–12 | 2–6 | — | |
| Dimension III | 6–12 | 1–3 | — | |
| Quizzitch | 6–12 | 1 (individual) | Junior 6–8 / Senior 9–12 | up to 2 individual entries per form |
| Settle-me-this | 6–12 | 2–5 | Junior 6–8 / Senior 9–12 | |
| Business Power Pitch | 9–12 | 1–4 | — | |
| Cosmovate | 6–12 | 1–4 | Junior 6–8 / Senior 9–12 | DPS R.K. Puram only — confirmation checkbox |
| In Pursuit of Dispute | 6–12 | 1–2 | Junior 6–8 / Senior 9–12 | |
| Surprise Event | 6–12 | exactly 2 | — | |

All of it lives in one `EVENTS` object at the top of the `<script>` in
`celestecon_registration.html` — change a cap or add an event there and the
whole UI (badges, add-member limits, validation) follows automatically. The
same rules are mirrored in `jotform_proxy.py`'s `EVENTS` dict for server-side
re-validation; if you edit one, edit the other.

## Files

- **`celestecon_registration.html`** — the actual registration page. Fully
  client-side (vanilla JS, no build step). Renders 8 event cards → dynamic team
  blocks → a live JSON review → Submit. Works standalone (Download/Copy JSON
  buttons) even before the backend exists.
- **`jotform_proxy.py`** — FastAPI backend. Holds the JotForm API key
  server-side (never expose it in the HTML — anyone can view source), re-runs
  every validation rule against the payload, forwards it to JotForm, and can
  optionally send its own confirmation email since **JotForm does not fire its
  built-in notifications for API-created submissions**.
- **`provision_jotform.py`** — one-time script that creates the destination
  JotForm form via API and writes `field_map.json` (question-ID lookup) for the
  proxy to use.

## Setup

1. Get a JotForm API key: Account Settings → API → Create New Key (Full Access).
2. `pip install requests && export JOTFORM_API_KEY=... && python3 provision_jotform.py`
   → creates the form, prints its URL, writes `field_map.json`. Skim the form in
   JotForm's builder once — API-created checkbox/textarea fields are functional
   but worth a visual check.
3. `pip install fastapi uvicorn requests`
   `export JOTFORM_API_KEY=...`
   `uvicorn jotform_proxy:app --port 8000`
   The proxy reads `JOTFORM_FORM_ID` from `field_map.json` when the env var is
   not set.
4. Put `celestecon_registration.html` in the same folder as `jotform_proxy.py` —
   it gets served automatically at `/`, so the page's `fetch('/api/submit')` just
   works with zero CORS setup. Deploying the HTML somewhere else instead? Set
   `ALLOWED_ORIGINS` on the proxy to that origin.
5. Optional email receipt: set `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` /
   `SMTP_FROM` on the proxy (e.g. the Zoho SMTP already set up for aeross.org).

## Deploy to Vercel

See [`VERCEL_SETUP.md`](VERCEL_SETUP.md). In short, Vercel loads
`api.index:app` from `pyproject.toml`; add `JOTFORM_API_KEY` in Vercel
Project Settings and deploy from the GitHub repo.

## Known limitations

- `provision_jotform.py` builds a reasonably-shaped form, but JotForm's API
  sometimes needs field tweaks (checkbox rendering, textarea height) done once
  by hand in the builder — I flagged this rather than assume a first-try
  perfect form, since I can't hit the live JotForm API from this sandbox to
  confirm the exact response shape.
- The "no more than 2 teams per event" and eligibility rules are enforced in
  both the page and the proxy, but if you ever accept submissions through any
  *other* path (e.g. someone edits a submission directly in JotForm), those
  edits bypass both layers — JotForm has no native way to re-run custom logic
  on manual edits.
- Cosmovate's "DPS R.K. Puram only" rule is enforced by an honor-system
  confirmation checkbox.
