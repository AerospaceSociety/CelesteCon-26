/**
 * Cloudflare Pages Function: /api/submit
 * Handles school registration submissions and proxies them securely to JotForm.
 */

const DEFAULT_FIELD_MAP = {
  form_header: "1",
  school_name: "2",
  contact_name: "3",
  contact_email: "4",
  contact_phone: "5",
  events_selected: "6",
  registration_summary: "7",
  registration_json: "8",
  total_teams: "9",
  total_participants: "10"
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS
  });
}

export async function onRequestPost(context) {
  try {
    const env = context.env || {};
    const apiKey = env.JOTFORM_API_KEY || env.SECRET_KEY || env.JOTFORM_SECRET_KEY || env.apiKey;
    const formId = env.JOTFORM_FORM_ID || "261896133006456";
    const apiBase = (env.JOTFORM_API_BASE || "https://api.jotform.com").replace(/\/+$/, "");

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "JOTFORM_API_KEY is not configured on Cloudflare. Please add JOTFORM_API_KEY in Cloudflare Pages Environment Variables.",
          configured: false
        }),
        {
          status: 500,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
        }
      );
    }

    const reg = await context.request.json();
    if (!reg || !reg.school) {
      return new Response(
        JSON.stringify({ error: "Invalid registration payload: missing school data" }),
        {
          status: 400,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
        }
      );
    }

    let fieldMap = DEFAULT_FIELD_MAP;
    if (env.JOTFORM_FIELD_MAP) {
      try {
        fieldMap = typeof env.JOTFORM_FIELD_MAP === 'string'
          ? JSON.parse(env.JOTFORM_FIELD_MAP)
          : env.JOTFORM_FIELD_MAP;
      } catch (_) {}
    }

    const params = new URLSearchParams();

    if (fieldMap.school_name) {
      params.append(`submission[${fieldMap.school_name}]`, reg.school?.name || "");
    }
    if (fieldMap.contact_name) {
      params.append(`submission[${fieldMap.contact_name}]`, reg.school?.contact || "");
    }
    if (fieldMap.contact_email) {
      params.append(`submission[${fieldMap.contact_email}]`, reg.school?.email || "");
    }
    if (fieldMap.contact_phone) {
      params.append(`submission[${fieldMap.contact_phone}]`, reg.school?.phone || "");
    }
    if (fieldMap.registration_summary) {
      params.append(`submission[${fieldMap.registration_summary}]`, reg.summary || "");
    }
    if (fieldMap.registration_json) {
      params.append(`submission[${fieldMap.registration_json}]`, JSON.stringify(reg));
    }
    if (fieldMap.total_teams) {
      params.append(`submission[${fieldMap.total_teams}]`, String(reg.totals?.totalTeams ?? ""));
    }
    if (fieldMap.total_participants) {
      params.append(`submission[${fieldMap.total_participants}]`, String(reg.totals?.totalParticipants ?? ""));
    }

    const eventsQid = fieldMap.events_selected;
    if (eventsQid && Array.isArray(reg.events)) {
      for (const ev of reg.events) {
        if (ev && ev.name) {
          params.append(`submission[${eventsQid}][]`, ev.name);
        }
      }
    }

    const targetUrl = `${apiBase}/form/${encodeURIComponent(formId)}/submissions?apiKey=${encodeURIComponent(apiKey)}`;

    const jotformResp = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    });

    let body;
    try {
      body = await jotformResp.json();
    } catch (_) {
      return new Response(
        JSON.stringify({
          error: `JotForm returned a non-JSON response (HTTP status ${jotformResp.status})`
        }),
        {
          status: 502,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
        }
      );
    }

    if (!jotformResp.ok || (body.responseCode && body.responseCode !== 200 && body.responseCode !== 201)) {
      return new Response(
        JSON.stringify({
          error: body.message || "JotForm rejected the submission",
          details: body
        }),
        {
          status: 502,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
        }
      );
    }

    const submissionID = body.content?.submissionID || body.content?.id || (typeof body.content === 'string' ? body.content : null);

    return new Response(
      JSON.stringify({
        success: true,
        submissionID: submissionID,
        jotform: body
      }),
      {
        status: 200,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err.message || "Internal server error during JotForm submission"
      }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
      }
    );
  }
}
