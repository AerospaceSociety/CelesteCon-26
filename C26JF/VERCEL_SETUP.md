# Vercel Setup Guide

This project deploys to Vercel as a FastAPI app. The HTML page is served from
`/`, and submissions go through `/api/submit` so the JotForm API key stays on
the server.

## 1. Confirm These Files Are Present

Vercel uses these files during deployment:

- `pyproject.toml` tells Vercel to load `api.index:app`.
- `api/index.py` re-exports the FastAPI app from `jotform_proxy.py`.
- `vercel.json` rewrites all routes to the Python FastAPI function.
- `requirements.txt` gives Vercel an explicit dependency list.
- `.python-version` pins Python to `3.12`.
- `field_map.json` contains the JotForm form ID and question IDs.
- `celestecon_registration.html` is served by the FastAPI root route.

## 2. Add Environment Variables

In Vercel, open the project and go to:

`Settings` -> `Environment Variables`

Add these variables for Production, Preview, and Development unless you want
different values per environment:

```text
JOTFORM_API_KEY=your_jotform_api_key
```

Optional variables:

```text
JOTFORM_FORM_ID=261896133006456
JOTFORM_API_BASE=https://api.jotform.com
ALLOWED_ORIGINS=*
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
```

`JOTFORM_FORM_ID` is optional because the proxy reads it from `field_map.json`
when the environment variable is not set.

## 3. Deploy From GitHub

1. Go to the Vercel dashboard.
2. Click `Add New` -> `Project`.
3. Import `FarzooqueHasan/C26JF`.
4. Keep the framework preset as `Other` or let Vercel detect Python.
5. Leave Build Command empty.
6. Leave Output Directory empty.
7. Add the environment variables above before the first production deploy.
8. Click `Deploy`.

## 4. Deploy With Vercel CLI

Install and log in:

```powershell
npm i -g vercel
vercel login
```

Link the project:

```powershell
vercel link
```

Add the required secret:

```powershell
vercel env add JOTFORM_API_KEY production
vercel env add JOTFORM_API_KEY preview
vercel env add JOTFORM_API_KEY development
```

Deploy:

```powershell
vercel --prod
```

## 5. Verify Deployment

After deployment, open:

```text
https://your-vercel-domain.vercel.app/
```

Then check the health endpoint:

```text
https://your-vercel-domain.vercel.app/api/health
```

Expected response:

```json
{
  "jotform_configured": true,
  "email_configured": false
}
```

Submit a test registration from the web page and confirm it appears in the
JotForm form:

```text
https://form.jotform.com/261896133006456
```

## Notes

- Do not commit `.env` files or API keys.
- Changing Vercel environment variables only affects new deployments.
- If `jotform_configured` is `false`, check `JOTFORM_API_KEY` and make sure
  `field_map.json` is included in the deployment.
- Email receipts require SMTP variables. JotForm API submissions do not trigger
  JotForm's built-in email notifications automatically.
