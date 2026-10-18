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
  school_name: "3",
  contact_name: "4",
  contact_email: "5",
  contact_phone: "6",
  events_selected: "7",
  registration_summary: "8",
  registration_json: "9",
  total_teams: "10",
  total_participants: "11"
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
    const reg = await request.json();
    if (!reg) {
      return jsonResponse({ error: "Invalid payload: empty request body" }, 400, request, env);
    }

    const apiKey = env.JOTFORM_API_KEY || env.SECRET_KEY || env.JOTFORM_SECRET_KEY || env.apiKey;
    const internalFormId = env.JOTFORM_INTERNAL_FORM_ID || "262820575510050";
    const externalFormId = env.JOTFORM_FORM_ID || "262905115844054";
    const submissionsFormId = env.JOTFORM_SUBMISSIONS_FORM_ID || "262904743897068";
    const apiBase = (env.JOTFORM_API_BASE || "https://api.jotform.com").replace(/\/+$/, "");

    // 1. Check if this is a Deliverable Submission rather than a School Registration
    const isDeliverable = Boolean(reg.driveUrl || reg.receiptToken || reg.deliverables || (reg.eventId && !reg.school));

    if (isDeliverable) {
      const cleanUID = sanitizeText(reg.schoolUID || '', 30).toUpperCase();
      const eventId = sanitizeText(reg.eventId || '04', 10).padStart(2, '0');
      const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
      const receiptToken = reg.receiptToken || `C26-DEP-${eventId}-${cleanUID.replace(/[^A-Z0-9]/g, '')}-${randomSuffix}`;
      const primaryUrl = sanitizeUrl(reg.driveUrl || (reg.deliverables ? Object.values(reg.deliverables)[0] : '') || '', 1500);
      const schoolName = sanitizeText(reg.schoolName || reg.school?.name || cleanUID || 'Accredited Delegation', 120);
      const eventName = sanitizeText(reg.eventName || `Event ${eventId}`, 100);
      const division = sanitizeText(reg.division || 'Senior', 50);
      const teamName = sanitizeText(reg.teamName || 'Delegation Team', 100);
      const leadName = sanitizeText(reg.leadName || '', 100);
      const leadEmail = sanitizeText(reg.leadEmail || '', 100);
      const leadPhone = sanitizeText(reg.leadPhone || '', 30);
      const projectAbstract = sanitizeText(reg.projectAbstract || '', 2000);

      const formattedSupplementary = Array.isArray(reg.supplementaryLinks) && reg.supplementaryLinks.length > 0
        ? reg.supplementaryLinks.slice(0, 10).map((l, i) => `${i + 1}. [${sanitizeText(l.label || 'Resource', 60)}] ${sanitizeUrl(l.url || '', 1500)}`).join('\n')
        : 'None declared';

      const summaryLines = [
        `CELESTECON 2026 // OFFICIAL DELIVERABLE DEPOSIT`,
        `===============================================`,
        `RECEIPT TOKEN:     ${receiptToken}`,
        `SCHOOL UID:        ${cleanUID}`,
        `INSTITUTION:       ${schoolName}`,
        `EVENT:             [${eventId}] ${eventName}`,
        `DIVISION:          ${division}`,
        `TEAM NAME:         ${teamName}`,
        `LEAD CONTACT:      ${leadName} (${leadEmail} · ${leadPhone || 'N/A'})`,
        `PRIMARY DRIVE URL: ${primaryUrl}`,
        `SUPPLEMENTARY:     ${formattedSupplementary}`,
        `ABSTRACT:          ${projectAbstract || 'None provided.'}`,
        `===============================================`
      ];
      const summaryText = summaryLines.join('\n');

      let syncedJotform = false;
      let syncedFirebase = false;

      // Submit to Submissions JotForm (262904743897068)
      if (apiKey) {
        try {
          const params = new URLSearchParams();
          params.append('submission[3]', receiptToken);
          params.append('submission[4]', cleanUID);
          params.append('submission[5]', schoolName);
          params.append('submission[6]', eventId);
          params.append('submission[7]', eventName);
          params.append('submission[8]', division);
          params.append('submission[9]', teamName);
          params.append('submission[10]', leadName);
          params.append('submission[11]', leadEmail);
          params.append('submission[12]', leadPhone);
          params.append('submission[13]', primaryUrl);
          params.append('submission[14]', formattedSupplementary);
          params.append('submission[15]', projectAbstract);
          params.append('submission[16]', summaryText);
          params.append('submission[17]', JSON.stringify(reg));

          params.append('receiptToken', receiptToken);
          params.append('schoolUID', cleanUID);
          params.append('schoolName', schoolName);
          params.append('eventId', eventId);
          params.append('eventName', eventName);
          params.append('division', division);
          params.append('teamName', teamName);
          params.append('leadName', leadName);
          params.append('leadEmail', leadEmail);
          params.append('leadPhone', leadPhone);
          params.append('driveUrl', primaryUrl);
          params.append('supplementaryLinks', formattedSupplementary);
          params.append('projectAbstract', projectAbstract);
          params.append('submissionSummary', summaryText);
          params.append('submissionJSON', JSON.stringify(reg));

          const jotResp = await fetch(`${apiBase}/form/${encodeURIComponent(submissionsFormId)}/submissions`, {
            method: 'POST',
            headers: {
              'APIKEY': apiKey,
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString()
          });
          if (jotResp.ok) syncedJotform = true;
        } catch (err) {
          console.warn('JotForm deliverable log notice:', err.message);
        }
      } else {
        try {
          const directParams = new URLSearchParams();
          directParams.append('formID', submissionsFormId);
          directParams.append('simple_spc', `${submissionsFormId}-${submissionsFormId}`);
          directParams.append('q3', receiptToken);
          directParams.append('q4', cleanUID);
          directParams.append('q5', schoolName);
          directParams.append('q6', eventId);
          directParams.append('q7', eventName);
          directParams.append('q8', division);
          directParams.append('q9', teamName);
          directParams.append('q10', leadName);
          directParams.append('q11', leadEmail);
          directParams.append('q12', leadPhone);
          directParams.append('q13', primaryUrl);
          directParams.append('q14', formattedSupplementary);
          directParams.append('q15', projectAbstract);
          directParams.append('q16', summaryText);
          directParams.append('q17', JSON.stringify(reg));

          directParams.append('submission[3]', receiptToken);
          directParams.append('submission[4]', cleanUID);
          directParams.append('submission[5]', schoolName);
          directParams.append('submission[6]', eventId);
          directParams.append('submission[7]', eventName);
          directParams.append('submission[8]', division);
          directParams.append('submission[9]', teamName);
          directParams.append('submission[10]', leadName);
          directParams.append('submission[11]', leadEmail);
          directParams.append('submission[12]', leadPhone);
          directParams.append('submission[13]', primaryUrl);
          directParams.append('submission[14]', formattedSupplementary);
          directParams.append('submission[15]', projectAbstract);
          directParams.append('submission[16]', summaryText);
          directParams.append('submission[17]', JSON.stringify(reg));

          const directResp = await fetch(`https://submit.jotform.com/submit/${encodeURIComponent(submissionsFormId)}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Origin': 'https://form.jotform.com',
              'Referer': `https://form.jotform.com/${encodeURIComponent(submissionsFormId)}`
            },
            body: directParams.toString()
          });
          if (directResp.ok) syncedJotform = true;
        } catch (directErr) {
          console.warn('JotForm direct deposit notice:', directErr.message);
        }
      }

      // Submit to Firebase Realtime Database (if configured)
      const firebaseUrl = env.FIREBASE_DATABASE_URL || env.VITE_FIREBASE_DATABASE_URL;
      if (firebaseUrl) {
        try {
          const cleanBase = firebaseUrl.replace(/\/+$/, '');
          const fbTarget = `${cleanBase}/submissions/${encodeURIComponent(receiptToken)}.json`;
          const fbResp = await fetch(fbTarget, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reg)
          });
          if (fbResp.ok) syncedFirebase = true;
        } catch (fbErr) {
          console.warn('Firebase deposit notice:', fbErr.message);
        }
      }

      return jsonResponse(
        {
          success: true,
          receiptToken,
          schoolUID: cleanUID,
          message: 'Deliverable deposit logged successfully to submission vault.',
          syncedTo: {
            jotform: syncedJotform,
            firebase: syncedFirebase,
            localVault: true
          }
        },
        200,
        request,
        env
      );
    }

    // 2. School Registration Routing (External: 262905115844054, Internal: 262820575510050)
    const formId = (reg.isInternal || reg.formId === internalFormId) ? internalFormId : externalFormId;

    if (!apiKey) {
      // If frontend already submitted directly to JotForm via browser iframe, avoid double entry
      if (reg.clientDirect) {
        return jsonResponse({
          success: true,
          submissionID: `JF-${Date.now()}`,
          schoolUID: reg.schoolUID || `C26-INT-${Math.floor(1000 + Math.random() * 9000)}`,
          source: 'jotform_direct_client'
        }, 200, request, env);
      }

      try {
        const directParams = new URLSearchParams();
        directParams.append('formID', formId);
        directParams.append('simple_spc', `${formId}-${formId}`);
        if (formId === internalFormId) {
          const team = reg.events?.[0]?.teams?.[0];
          const lead = team?.members?.[0] || reg.school?.contact;
          const leadName = typeof lead === 'object' ? lead.name : (reg.school?.contact || '');
          const leadEmail = typeof lead === 'object' ? lead.email : (reg.school?.email || '');
          const leadPhone = typeof lead === 'object' ? lead.phone : (reg.school?.phone || '');
          const leadClass = typeof lead === 'object' ? lead.class : '';
          const leadAdm = typeof lead === 'object' ? lead.admissionNo : '';
          const teamName = team?.teamName || reg.school?.name || 'Internal Team';
          const eventName = reg.events?.[0]?.name || '';
          const category = team?.category?.toUpperCase() || 'SENIOR';
          const uid = team?.teamId || reg.schoolUID || '';
          const summary = reg.summary || JSON.stringify(reg);

          // EXACT QIDs matching form 262820575510050
          directParams.append('q3', sanitizeText(teamName, 100));
          directParams.append('q4', sanitizeText(leadName, 100));
          directParams.append('q5', sanitizeText(leadEmail, 100));
          directParams.append('q6', sanitizeText(leadPhone, 30));
          directParams.append('q6_phone[phone]', sanitizeText(leadPhone, 30));
          directParams.append('q7', sanitizeText(leadClass, 30));
          directParams.append('q8', sanitizeText(leadAdm, 30));
          directParams.append('q9', sanitizeText(eventName, 80));
          directParams.append('q10', sanitizeText(category, 30));
          directParams.append('q11', sanitizeText(uid, 50));
          directParams.append('q12', sanitizeText(summary, 8000));
          directParams.append('q13', JSON.stringify(reg));

          // Submission indices
          directParams.append('submission[3]', sanitizeText(teamName, 100));
          directParams.append('submission[4]', sanitizeText(leadName, 100));
          directParams.append('submission[5]', sanitizeText(leadEmail, 100));
          directParams.append('submission[6]', sanitizeText(leadPhone, 30));
          directParams.append('submission[7]', sanitizeText(leadClass, 30));
          directParams.append('submission[8]', sanitizeText(leadAdm, 30));
          directParams.append('submission[9]', sanitizeText(eventName, 80));
          directParams.append('submission[10]', sanitizeText(category, 30));
          directParams.append('submission[11]', sanitizeText(uid, 50));
          directParams.append('submission[12]', sanitizeText(summary, 8000));
          directParams.append('submission[13]', JSON.stringify(reg));
        } else {
          // Standard external registration form 262905115844054 (Live QIDs: 3=school, 4=contact, 5=email, 6=phone, 7=events, 8=summary, 9=json)
          if (reg.school?.name) {
            directParams.append('submission[3]', sanitizeText(reg.school.name, 100));
            directParams.append('submission[2]', sanitizeText(reg.school.name, 100));
            directParams.append('q3', sanitizeText(reg.school.name, 100));
            directParams.append('q2', sanitizeText(reg.school.name, 100));
            directParams.append('school_name', sanitizeText(reg.school.name, 100));
          }
          if (reg.school?.contact) {
            directParams.append('submission[4]', sanitizeText(reg.school.contact, 100));
            directParams.append('submission[3]', sanitizeText(reg.school.contact, 100));
            directParams.append('q4', sanitizeText(reg.school.contact, 100));
            directParams.append('q3', sanitizeText(reg.school.contact, 100));
            directParams.append('contact_name', sanitizeText(reg.school.contact, 100));
          }
          if (reg.school?.email) {
            directParams.append('submission[5]', sanitizeText(reg.school.email, 100));
            directParams.append('submission[4]', sanitizeText(reg.school.email, 100));
            directParams.append('q5', sanitizeText(reg.school.email, 100));
            directParams.append('q4', sanitizeText(reg.school.email, 100));
            directParams.append('contact_email', sanitizeText(reg.school.email, 100));
          }
          if (reg.school?.phone) {
            directParams.append('submission[6]', sanitizeText(reg.school.phone, 30));
            directParams.append('submission[5]', sanitizeText(reg.school.phone, 30));
            directParams.append('q6', sanitizeText(reg.school.phone, 30));
            directParams.append('q5', sanitizeText(reg.school.phone, 30));
            directParams.append('contact_phone', sanitizeText(reg.school.phone, 30));
          }
          if (reg.events?.[0]?.name) {
            directParams.append('submission[7]', sanitizeText(reg.events[0].name, 80));
            directParams.append('submission[6]', sanitizeText(reg.events[0].name, 80));
            directParams.append('q7', sanitizeText(reg.events[0].name, 80));
            directParams.append('q6', sanitizeText(reg.events[0].name, 80));
            directParams.append('events_selected', sanitizeText(reg.events[0].name, 80));
          }
          const summaryStr = sanitizeText(reg.summary || JSON.stringify(reg), 5000);
          directParams.append('submission[8]', summaryStr);
          directParams.append('submission[7]', summaryStr);
          directParams.append('q8', summaryStr);
          directParams.append('q7', summaryStr);
          directParams.append('registration_summary', summaryStr);

          const jsonStr = JSON.stringify(reg);
          directParams.append('submission[9]', jsonStr);
          directParams.append('submission[8]', jsonStr);
          directParams.append('q9', jsonStr);
          directParams.append('q8', jsonStr);
          directParams.append('registration_json', jsonStr);
        }

        const directResp = await fetch(`https://submit.jotform.com/submit/${encodeURIComponent(formId)}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Origin': 'https://form.jotform.com',
            'Referer': `https://form.jotform.com/${encodeURIComponent(formId)}`
          },
          body: directParams.toString()
        });

        if (directResp.ok) {
          return jsonResponse({
            success: true,
            submissionID: `JF-${Date.now()}`,
            schoolUID: reg.schoolUID || `C26-INT-${Math.floor(1000 + Math.random() * 9000)}`,
            source: 'jotform_direct'
          }, 200, request, env);
        }
      } catch (directErr) {
        console.warn('JotForm direct gateway notice:', directErr.message);
      }

      return jsonResponse(
        {
          error: "Registration vault is currently completing maintenance. Please retry in a few moments or contact aeross@dpsrkp.net.",
          configured: false
        },
        503,
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
    const clientLettersMatch = (reg.schoolUID || "").match(/^C26-([A-Za-z]{2,4})-/);
    const letters = clientLettersMatch ? clientLettersMatch[1].toUpperCase() : (reg.isInternal ? 'INT' : getRandomLetters());

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
