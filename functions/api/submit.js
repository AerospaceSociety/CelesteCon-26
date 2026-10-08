/**
 * Cloudflare Pages Function: /api/submit
 * Handles school registration submissions, assigns sequential unique UIDs,
 * sanitizes input fields, enforces rate limiting, and proxies registrations securely to JotForm.
 */

import {
  jsonResponse,
  checkRateLimit,
  sanitizeText,
  sanitizeUrl
} from './_security.js';

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
      headerNote += '• ' + sanitizeText(s.name, 80) + ' (' + sanitizeText(s.email, 80) + ') → ' + (s.events || []).map(e => sanitizeText(e, 40)).join(', ') + '\n  *Timing for offline rounds on campus may clash; student/school responsibility.\n';
    });
    headerNote += '\n';
  }
  const eventLines = events.map(e => {
    const teamLines = (e.teams || []).map((t, i) => {
      const header = '  [' + sanitizeText(t.teamId || ('Team ' + (i + 1)), 40) + '] Team: ' + sanitizeText(t.teamName || ('Team ' + (i + 1)), 60) + (t.category ? ' / Track: ' + sanitizeText(t.category, 30) : (e.trackLabel ? ' / ' + sanitizeText(e.trackLabel, 30) : ''));
      const members = (t.members || []).map((m, j) => '    ' + (j + 1) + '. ' + sanitizeText(m.name || '-', 80) + ' [ID: ' + sanitizeText(m.memberId || 'ID Pending', 40) + '] (' + sanitizeText(m.email || 'No email', 80) + ', Class ' + sanitizeText(m.class || '-', 10) + ', ' + sanitizeText(m.gender || '-', 10) + ')').join('\n');
      return header + '\n' + members;
    }).join('\n');
    return sanitizeText(e.name, 60) + (e.trackLabel ? ' [' + sanitizeText(e.trackLabel, 30) + ']' : '') + '\n' + teamLines;
  }).join('\n\n');
  return headerNote + eventLines;
}

export async function onRequestPost(context) {
  const { request, env = {} } = context;

  // 1. Rate Limiting: Max 10 registration/submission requests per minute per IP
  const rateLimit = checkRateLimit(request, { limit: 10, windowSeconds: 60, prefix: 'submit' });
  if (!rateLimit.allowed) {
    return jsonResponse(
      {
        error: 'Too Many Requests',
        message: 'Registration submission rate limit exceeded. Please wait a minute.'
      },
      429,
      request,
      env
    );
  }

  try {
    const apiKey = env.JOTFORM_API_KEY || env.SECRET_KEY || env.JOTFORM_SECRET_KEY || env.apiKey;
    const formId = env.JOTFORM_FORM_ID || "261896133006456";
    const apiBase = (env.JOTFORM_API_BASE || "https://api.jotform.com").replace(/\/+$/, "");

    if (!apiKey) {
      return jsonResponse(
        {
          error: "Submission vault is currently completing maintenance. Please retry in a few moments or contact aeross@dpsrkp.net.",
          configured: false
        },
        503,
        request,
        env
      );
    }

    const reg = await request.json();
    if (!reg) {
      return jsonResponse({ error: "Invalid payload: empty request body" }, 400, request, env);
    }

    // 2. Deliverable submission forwarding
    if (reg.driveUrl || reg.receiptToken || (reg.eventId && !reg.school)) {
      const cleanUID = sanitizeText(reg.schoolUID || '', 30).toUpperCase();
      const eventId = sanitizeText(reg.eventId || '07', 10).padStart(2, '0');
      const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
      const receiptToken = reg.receiptToken || `C26-DEP-${eventId}-${cleanUID.replace(/[^A-Z0-9]/g, '')}-${randomSuffix}`;
      const cleanDrive = sanitizeUrl(reg.driveUrl || '', 1500);

      try {
        const params = new URLSearchParams();
        params.append('submission[1]', `SUBMISSION: ${sanitizeText(reg.eventName || 'Event ' + eventId, 100)} - ${sanitizeText(reg.schoolName || cleanUID, 100)}`);
        params.append('submission[2]', sanitizeText(reg.schoolName || cleanUID, 100));
        params.append('submission[3]', sanitizeText(reg.leadName || '', 100));
        params.append('submission[4]', sanitizeText(reg.leadEmail || '', 100));
        params.append('submission[5]', sanitizeText(reg.leadPhone || '', 30));
        params.append('submission[6]', sanitizeText(reg.eventName || ('Event ' + eventId), 100));
        params.append('submission[7]', [
          `TOKEN: ${receiptToken}`,
          `UID: ${cleanUID}`,
          `EVENT: ${sanitizeText(reg.eventName || eventId, 80)} (${sanitizeText(reg.division || 'Senior', 30)})`,
          `TEAM: ${sanitizeText(reg.teamName || 'Team', 80)}`,
          `PRIMARY DRIVE: ${cleanDrive}`,
          `SUPPLEMENTARY LINKS: ${JSON.stringify(Array.isArray(reg.supplementaryLinks) ? reg.supplementaryLinks.slice(0, 10) : [])}`,
          `ABSTRACT: ${sanitizeText(reg.projectAbstract || '', 2000)}`
        ].join('\n'));
        params.append('submission[8]', JSON.stringify(reg));

        await fetch(`${apiBase}/form/${encodeURIComponent(formId)}/submissions`, {
          method: 'POST',
          headers: {
            'APIKEY': apiKey,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: params.toString()
        });
      } catch (err) {
        console.warn('JotForm deliverable log notice:', err.message);
      }

      return jsonResponse(
        {
          success: true,
          receiptToken,
          schoolUID: cleanUID,
          message: 'Deliverable deposit logged successfully.'
        },
        200,
        request,
        env
      );
    }

    if (!reg.school) {
      return jsonResponse({ error: "Invalid registration payload: missing school data" }, 400, request, env);
    }

    // 3. Sanitized School Data
    reg.school.name = sanitizeText(reg.school.name || '', 150);
    reg.school.contact = sanitizeText(reg.school.contact || '', 100);
    reg.school.email = sanitizeText(reg.school.email || '', 100);
    reg.school.phone = sanitizeText(reg.school.phone || '', 30);
    reg.school.city = sanitizeText(reg.school.city || '', 80);

    // 4. Determine unique serial starting from 0101
    let serverSerialStr = null;
    try {
      const countResp = await fetch(`${apiBase}/form/${encodeURIComponent(formId)}`, {
        headers: { 'APIKEY': apiKey }
      });
      if (countResp.ok) {
        const formInfo = await countResp.json();
        const totalCount = parseInt(formInfo?.content?.count || '0', 10);
        const serialNum = 101 + totalCount;
        serverSerialStr = String(serialNum).padStart(4, '0');
      }
    } catch (e) {
      console.warn("Could not query JotForm submission count:", e.message);
    }

    // 5. Format School UID: C26-<Letters>-<Serial>
    let officialSchoolUID = reg.schoolUID;
    const clientLettersMatch = (reg.schoolUID || "").match(/^C26-([A-Za-z]{2})-/);
    const letters = clientLettersMatch ? clientLettersMatch[1].toUpperCase() : getRandomLetters();

    if (serverSerialStr) {
      officialSchoolUID = `C26-${letters}-${serverSerialStr}`;
    } else if (!officialSchoolUID || !officialSchoolUID.startsWith("C26-")) {
      officialSchoolUID = `C26-${letters}-0101`;
    }

    reg.schoolUID = officialSchoolUID;

    // 6. Resync teamId and memberId format
    if (Array.isArray(reg.events)) {
      reg.events.forEach(ev => {
        const code = EVENT_CODES[ev.id] || ev.id;
        const isDual = ['settle', 'bpp', 'gamejam', 'rocketry'].includes(ev.id) || ev.trackType === 'dual';
        const categoryCounts = {};

        if (Array.isArray(ev.teams)) {
          ev.teams.forEach((t) => {
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

      reg.summary = generateSummary(reg.events, officialSchoolUID, reg.multiEventStudents);
    }

    let fieldMap = DEFAULT_FIELD_MAP;
    if (env.JOTFORM_FIELD_MAP) {
      try {
        fieldMap = typeof env.JOTFORM_FIELD_MAP === 'string'
          ? JSON.parse(env.JOTFORM_FIELD_MAP)
          : env.JOTFORM_FIELD_MAP;
      } catch {}
    }

    const params = new URLSearchParams();
    if (fieldMap.school_name) params.append(`submission[${fieldMap.school_name}]`, reg.school.name);
    if (fieldMap.contact_name) params.append(`submission[${fieldMap.contact_name}]`, reg.school.contact);
    if (fieldMap.contact_email) params.append(`submission[${fieldMap.contact_email}]`, reg.school.email);
    if (fieldMap.contact_phone) params.append(`submission[${fieldMap.contact_phone}]`, reg.school.phone);
    if (fieldMap.registration_summary) params.append(`submission[${fieldMap.registration_summary}]`, reg.summary || "");
    if (fieldMap.registration_json) params.append(`submission[${fieldMap.registration_json}]`, JSON.stringify(reg));
    if (fieldMap.total_teams) params.append(`submission[${fieldMap.total_teams}]`, String(reg.totals?.totalTeams ?? ""));
    if (fieldMap.total_participants) params.append(`submission[${fieldMap.total_participants}]`, String(reg.totals?.totalParticipants ?? ""));

    const eventsQid = fieldMap.events_selected;
    if (eventsQid && Array.isArray(reg.events)) {
      for (const ev of reg.events) {
        if (ev && ev.name) {
          params.append(`submission[${eventsQid}][]`, sanitizeText(ev.name, 60));
        }
      }
    }

    const jotformResp = await fetch(`${apiBase}/form/${encodeURIComponent(formId)}/submissions`, {
      method: "POST",
      headers: {
        "APIKEY": apiKey,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    });

    let body;
    try {
      body = await jotformResp.json();
    } catch {
      return jsonResponse({ error: "Registration vault returned unexpected gateway response" }, 502, request, env);
    }

    if (!jotformResp.ok || (body.responseCode && body.responseCode !== 200 && body.responseCode !== 201)) {
      return jsonResponse({ error: "Registration could not be accepted by vault. Please verify fields and retry." }, 502, request, env);
    }

    const submissionID = body.content?.submissionID || body.content?.id || (typeof body.content === 'string' ? body.content : null);

    return jsonResponse(
      {
        success: true,
        submissionID,
        schoolUID: officialSchoolUID
      },
      200,
      request,
      env
    );
  } catch (err) {
    console.error('Registration processing error:', err);
    return jsonResponse({ error: "Internal server error occurred while processing registration." }, 500, request, env);
  }
}
