/**
 * Cloudflare Pages Function: /api/submit
 * Handles school registration submissions, assigns sequential unique UIDs,
 * and proxies registrations securely to JotForm.
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

const EVENT_CODES = {
  settle: "SMT",
  volatus: "Vol",
  dispute: "IPOD",
  bpp: "BPP",
  theatre: "ATh",
  gamejam: "CJam",
  rocketry: "Roc",
  f1: "APrix"
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

function getRandomLetters() {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const c1 = letters.charAt(Math.floor(Math.random() * letters.length));
  const c2 = letters.charAt(Math.floor(Math.random() * letters.length));
  return `${c1}${c2}`;
}

function generateSummary(events, schoolUID, multiEventStudents) {
  if (!events || events.length === 0) return '(no events selected yet)';
  let headerNote = 'School ID (UID): ' + (schoolUID || 'PENDING SUBMISSION') + '\n\n';
  if (multiEventStudents && multiEventStudents.length > 0) {
    headerNote += '[SCHEDULE ADVISORY — MULTI-COMPETITION STUDENTS]\n';
    multiEventStudents.forEach(s => {
      headerNote += '• ' + s.name + ' (' + s.email + ') → ' + (s.events || []).join(', ') + '\n  *Timing for offline rounds on campus may clash; student/school responsibility.\n';
    });
    headerNote += '\n';
  }
  const eventLines = events.map(e => {
    const teamLines = (e.teams || []).map((t, i) => {
      const header = '  [' + (t.teamId || ('Team ' + (i + 1))) + '] Team: ' + (t.teamName || ('Team ' + (i + 1))) + (t.category ? ' / Track: ' + t.category : (e.trackLabel ? ' / ' + e.trackLabel : ''));
      const members = (t.members || []).map((m, j) => '    ' + (j + 1) + '. ' + (m.name || '-') + ' [ID: ' + (m.memberId || 'ID Pending') + '] (' + (m.email || 'No email') + ', Class ' + (m.class || '-') + ', ' + (m.gender || '-') + ')').join('\n');
      return header + '\n' + members;
    }).join('\n');
    return e.name + (e.trackLabel ? ' [' + e.trackLabel + ']' : '') + '\n' + teamLines;
  }).join('\n\n');
  return headerNote + eventLines;
}

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

    // Determine unique serial starting from 0101 based on JotForm total submission count
    let serverSerialStr = null;
    try {
      const countResp = await fetch(`${apiBase}/form/${encodeURIComponent(formId)}?apiKey=${encodeURIComponent(apiKey)}`);
      if (countResp.ok) {
        const formInfo = await countResp.json();
        const totalCount = parseInt(formInfo?.content?.count || '0', 10);
        // e.g. 0 submissions -> 0101, 1 submission -> 0102
        const serialNum = 101 + totalCount;
        serverSerialStr = String(serialNum).padStart(4, '0');
      }
    } catch (e) {
      console.warn("Could not query JotForm submission count:", e);
    }

    // Format School UID: C26-<Random_2_Letters>-<Serial>
    let officialSchoolUID = reg.schoolUID;
    const clientLettersMatch = (reg.schoolUID || "").match(/^C26-([A-Za-z]{2})-/);
    const letters = clientLettersMatch ? clientLettersMatch[1].toUpperCase() : getRandomLetters();

    if (serverSerialStr) {
      officialSchoolUID = `C26-${letters}-${serverSerialStr}`;
    } else if (!officialSchoolUID || !officialSchoolUID.startsWith("C26-")) {
      officialSchoolUID = `C26-${letters}-0101`;
    }

    reg.schoolUID = officialSchoolUID;

    // Resync teamId and memberId format: SchoolID-CompID-Sr/Jr-M1/2/3... or SchoolID-CompID-M1/2/3...
    if (Array.isArray(reg.events)) {
      reg.events.forEach(ev => {
        const code = EVENT_CODES[ev.id] || ev.id;
        const isDual = ['settle', 'bpp', 'gamejam', 'rocketry'].includes(ev.id) || ev.trackType === 'dual';
        const categoryCounts = {};

        if (Array.isArray(ev.teams)) {
          ev.teams.forEach((t, tIdx) => {
            let catTag = '';
            if (isDual) {
              const isSenior = t.rawCategory === 'senior' || t.category === 'senior' || String(t.category || '').toLowerCase().includes('senior');
              const cat = isSenior ? 'Sr' : 'Jr';
              categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
              const count = categoryCounts[cat];
              catTag = `-${cat}${count > 1 ? count : ''}`;
            } else {
              categoryCounts['single'] = (categoryCounts['single'] || 0) + 1;
              const count = categoryCounts['single'];
              catTag = count > 1 ? `-T${count}` : '';
            }

            t.teamId = `${officialSchoolUID}-${code}${catTag}`;
            if (Array.isArray(t.members)) {
              t.members.forEach((m, mIdx) => {
                m.memberId = `${t.teamId}-M${mIdx + 1}`;
              });
            }
          });
        }
      });

      // Synchronize summary text with officialSchoolUID and resynced IDs
      reg.summary = generateSummary(reg.events, officialSchoolUID, reg.multiEventStudents);
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
        schoolUID: officialSchoolUID,
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
