/**
 * Cloudflare Pages Function: /api/deposit
 * Receives project deliverable submissions, validates event-specific mandatory & optional links,
 * sanitizes user input, applies edge rate limits, and persists to JotForm and Firebase.
 */

import {
  jsonResponse,
  checkRateLimit,
  sanitizeText,
  sanitizeUrl
} from './_security.js';

// Event-specific required deliverable rules
const EVENT_REQUIREMENTS = {
  '01': {
    code: 'SMT',
    name: 'Settle-Me-This',
    requiredKeys: ['proposalUrl'],
    keyLabels: {
      proposalUrl: 'Written Engineering Proposal (PDF Link)',
      slideDeckUrl: 'Presentation Slide Deck (Optional)',
      cadModelsUrl: '3D CAD Models & Architectural Renders (Optional)',
      supplementaryUrl: 'Supplementary Calculations & Appendices (Optional)'
    }
  },
  '02': {
    code: 'VOL',
    name: 'Volatus',
    requiredKeys: ['proposalUrl', 'cadPackageUrl'],
    keyLabels: {
      proposalUrl: 'Technical Proposal & Sizing Dossier (PDF Link)',
      cadPackageUrl: '3D CAD Package / Model Link (STEP/STL/F3D/Blend/Cloud CAD)',
      blueprintUrl: '3-View Orthographic Blueprint (Optional)',
      calculationsUrl: 'Aerodynamic Calculations Ledger (Optional)',
      supplementaryUrl: 'Prototype Photos / Media (Optional)'
    }
  },
  // Note: Event 03 (In Pursuit of Dispute) does not accept preliminary file submissions (conducted via Quizzitch quiz platform).
  '03': {
    code: 'IPOD',
    name: 'In Pursuit of Dispute',
    noSubmissionRequired: true,
    requiredKeys: [],
    keyLabels: {}
  },
  '04': {
    code: 'BPP',
    name: 'Business Power Pitch',
    requiredKeys: ['proposalUrl', 'videoUrl'],
    keyLabels: {
      proposalUrl: 'Business Proposal / Executive Dossier (PDF Link)',
      videoUrl: '5-Minute Elevator Pitch Video Link',
      slideDeckUrl: 'Investor Pitch Deck (Optional)',
      financialModelUrl: 'Financial Model / Spreadsheets (Optional)',
      supplementaryUrl: 'Supplementary Appendix / Prototype Link (Optional)'
    }
  },
  '05': {
    code: 'ATH',
    name: 'AEROSS Theatre',
    requiredKeys: ['videoUrl'],
    keyLabels: {
      videoUrl: 'Audition Video Performance Link (3–5 Mins)',
      scriptUrl: 'Performance Script / Dramatic Treatment (Optional)',
      audioTrackUrl: 'Soundtrack / Backing Audio Track Link (Optional)',
      supplementaryUrl: 'Stagecraft & Props Portfolio (Optional)'
    }
  },
  '06': {
    code: 'CJAM',
    name: 'CelesteJam',
    requiredKeys: ['buildUrl', 'videoUrl'],
    keyLabels: {
      buildUrl: 'Playable Game Build Link (.ZIP or WebGL Link)',
      videoUrl: 'Gameplay Traversal Video Link (60–90 Secs)',
      sourceCodeUrl: 'Source Code Repository Link (Optional)',
      gddUrl: 'Game Design Document (GDD) / Readme (Optional)',
      supplementaryUrl: 'Asset Credits & OST Audio Link (Optional)'
    }
  },
  '07': {
    code: 'ROC',
    name: 'Rocketry',
    requiredKeys: ['orkUrl', 'reportUrl'],
    keyLabels: {
      orkUrl: 'OpenRocket Simulation File (.ork Link)',
      reportUrl: 'Rocketry Technical Dossier / Design Report (PDF Link)',
      simulationPlotsUrl: 'Simulation Flight Plots & Barrowman Data (Optional)',
      cadPhotosUrl: 'CAD Models / Workshop Build Photos (Optional)',
      supplementaryUrl: 'Supplementary Materials (Optional)'
    }
  },
  '08': {
    code: 'APRIX',
    name: 'AEROSS Prix',
    requiredKeys: ['dossierUrl', 'cadPackageUrl'],
    keyLabels: {
      dossierUrl: 'DOC 01: Technical Dossier & Engineering Report (PDF Link)',
      cadPackageUrl: 'DOC 02: 3D CAD Package & Model Link (STEP/STL/F3D/Cloud CAD)',
      identityDeckUrl: 'DOC 03: Team Identity, Livery & Sponsor Return Deck (Optional)',
      blueprintUrl: '3-View General Arrangement Blueprint (F1-CD-1) (Optional)',
      supplementaryUrl: 'CFD Telemetry & Aerodynamic Simulation Folder (Optional)'
    }
  }
};

export async function onRequestPost(context) {
  const { request, env = {} } = context;

  // 1. Rate Limiting: Max 10 deposits per minute per IP
  const rateLimit = checkRateLimit(request, { limit: 10, windowSeconds: 60, prefix: 'deposit' });
  if (!rateLimit.allowed) {
    return jsonResponse(
      {
        error: 'Too Many Requests',
        message: 'Deposit submission rate limit reached. Please wait a moment before trying again.'
      },
      429,
      request,
      env
    );
  }

  try {
    const body = await request.json();

    if (!body || !body.schoolUID) {
      return jsonResponse(
        { error: 'School UID is required for deliverable deposit validation.' },
        400,
        request,
        env
      );
    }

    const cleanUID = sanitizeText(body.schoolUID, 30).toUpperCase();
    if (!/^C26-[A-Z]{2,4}-\d{4}$/.test(cleanUID)) {
      return jsonResponse(
        { error: `Invalid UID syntax: "${cleanUID}". Must match C26-XX-0000 format.` },
        400,
        request,
        env
      );
    }

    const eventId = sanitizeText(body.eventId || '04', 10).padStart(2, '0');

    if (eventId === '03') {
      return jsonResponse(
        {
          error: 'No preliminary portal submission is required for In Pursuit of Dispute (IPOD). Round 1 qualification is conducted via the online Quizzitch quiz platform. Teams qualify directly to live debate rounds on Conclave Day.'
        },
        400,
        request,
        env
      );
    }

    const spec = EVENT_REQUIREMENTS[eventId] || EVENT_REQUIREMENTS['04'];

    // 2. Extract and sanitize structured deliverables
    const rawDeliverables = body.deliverables || {};
    const sanitizedDeliverables = {};

    // Also support fallback `driveUrl` if sent directly
    if (body.driveUrl && !rawDeliverables.proposalUrl && !rawDeliverables.dossierUrl && !rawDeliverables.reportUrl && !rawDeliverables.buildUrl && !rawDeliverables.videoUrl) {
      const primaryKey = spec.requiredKeys[0] || 'proposalUrl';
      rawDeliverables[primaryKey] = body.driveUrl;
    }

    // Sanitize each deliverable link
    for (const [key, val] of Object.entries(rawDeliverables)) {
      if (typeof val === 'string' && val.trim().length > 0) {
        const cleaned = sanitizeUrl(val.trim(), 1500);
        if (!cleaned) {
          const label = spec.keyLabels[key] || key;
          return jsonResponse(
            { error: `The link provided for "${label}" must be a secure HTTPS link.` },
            400,
            request,
            env
          );
        }
        sanitizedDeliverables[key] = cleaned;
      }
    }

    // Verify all mandatory keys for this event are supplied
    for (const reqKey of spec.requiredKeys) {
      if (!sanitizedDeliverables[reqKey]) {
        const label = spec.keyLabels[reqKey] || reqKey;
        return jsonResponse(
          { error: `Mandatory deliverable missing: "${label}" is required for ${spec.name}.` },
          400,
          request,
          env
        );
      }
    }

    // 3. Sanitize supplementary links
    const rawSupplementary = Array.isArray(body.supplementaryLinks) ? body.supplementaryLinks : [];
    const sanitizedSupplementary = rawSupplementary
      .slice(0, 10)
      .map(item => {
        const url = sanitizeUrl(item?.url || '', 1500);
        const label = sanitizeText(item?.label || 'Resource Link', 100);
        return url ? { label, url } : null;
      })
      .filter(Boolean);

    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const receiptToken = `C26-DEP-${spec.code}-${cleanUID.replace(/[^A-Z0-9]/g, '')}-${randomSuffix}`;
    const timestamp = new Date().toISOString();

    // Primary representative URL (for backward compatibility)
    const primaryUrl = sanitizedDeliverables[spec.requiredKeys[0]] || Object.values(sanitizedDeliverables)[0] || '';

    const depositRecord = {
      receiptToken,
      timestamp,
      schoolUID: cleanUID,
      schoolName: sanitizeText(body.schoolName || 'Accredited Delegation', 120),
      eventId,
      eventName: spec.name,
      division: sanitizeText(body.division || 'Senior Track (Grades 9–12)', 50),
      teamName: sanitizeText(body.teamName || 'Delegation Team', 100),
      leadName: sanitizeText(body.leadName || '', 100),
      leadEmail: sanitizeText(body.leadEmail || '', 100),
      leadPhone: sanitizeText(body.leadPhone || '', 30),
      deliverables: sanitizedDeliverables,
      driveUrl: primaryUrl,
      supplementaryLinks: sanitizedSupplementary,
      projectAbstract: sanitizeText(body.projectAbstract || '', 2000),
      targetDestination: 'dual_sync'
    };

    let syncedJotform = false;
    let syncedFirebase = false;

    // 4. Submit to JotForm with APIKEY header
    const apiKey = env.JOTFORM_API_KEY || env.SECRET_KEY || env.apiKey;
    const formId = env.JOTFORM_SUBMISSIONS_FORM_ID || "262451061688056";
    const apiBase = (env.JOTFORM_API_BASE || "https://api.jotform.com").replace(/\/+$/, "");

    if (apiKey) {
      try {
        const formattedSupplementary = depositRecord.supplementaryLinks.length > 0
          ? depositRecord.supplementaryLinks.map((l, i) => `${i + 1}. [${l.label}] ${l.url}`).join('\n')
          : 'None declared';

        const params = new URLSearchParams();
        const summaryLines = [
          `CELESTECON 2026 DIGITAL DELIVERABLE DEPOSIT`,
          `=========================================`,
          `RECEIPT TOKEN: ${receiptToken}`,
          `TIMESTAMP:     ${new Date(timestamp).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })} IST`,
          `SCHOOL UID:    ${cleanUID}`,
          `INSTITUTION:   ${depositRecord.schoolName}`,
          `EVENT:         ${spec.code} · ${depositRecord.eventName} (${depositRecord.division})`,
          `TEAM:          ${depositRecord.teamName}`,
          `LEAD:          ${depositRecord.leadName} (${depositRecord.leadEmail} · ${depositRecord.leadPhone || 'N/A'})`,
          `PRIMARY LINK:  ${primaryUrl || depositRecord.driveUrl}`,
          ``,
          `--- DELIVERABLES SUBMITTED ---`
        ];

        for (const [key, val] of Object.entries(sanitizedDeliverables)) {
          const isReq = spec.requiredKeys.includes(key);
          const label = spec.keyLabels[key] || key;
          summaryLines.push(`• [${isReq ? 'MANDATORY' : 'OPTIONAL'}] ${label}:`);
          summaryLines.push(`  ${val}`);
        }

        if (depositRecord.supplementaryLinks.length > 0) {
          summaryLines.push(``);
          summaryLines.push(`--- SUPPLEMENTARY LINKS (${depositRecord.supplementaryLinks.length}) ---`);
          depositRecord.supplementaryLinks.forEach((l, i) => {
            summaryLines.push(`  ${i + 1}. [${l.label}] ${l.url}`);
          });
        }

        if (depositRecord.projectAbstract) {
          summaryLines.push(``);
          summaryLines.push(`--- PROJECT ABSTRACT / NOTES ---`);
          summaryLines.push(depositRecord.projectAbstract);
        }
        summaryLines.push(`=========================================`);

        const summaryText = summaryLines.join('\n');

        // Exact Question IDs matching live Form 262451061688056
        params.append('submission[3]', receiptToken);
        params.append('submission[4]', cleanUID);
        params.append('submission[5]', depositRecord.schoolName);
        params.append('submission[6]', depositRecord.eventId);
        params.append('submission[7]', depositRecord.eventName);
        params.append('submission[8]', depositRecord.division);
        params.append('submission[9]', depositRecord.teamName);
        params.append('submission[10]', depositRecord.leadName);
        params.append('submission[11]', depositRecord.leadEmail);
        params.append('submission[12]', depositRecord.leadPhone);
        params.append('submission[13]', primaryUrl || depositRecord.driveUrl);
        params.append('submission[14]', formattedSupplementary);
        params.append('submission[15]', depositRecord.projectAbstract || '');
        params.append('submission[16]', summaryText);
        params.append('submission[17]', JSON.stringify(depositRecord));

        // Also append by unique question name
        params.append('receiptToken', receiptToken);
        params.append('schoolUID', cleanUID);
        params.append('schoolName', depositRecord.schoolName);
        params.append('eventId', depositRecord.eventId);
        params.append('eventName', depositRecord.eventName);
        params.append('division', depositRecord.division);
        params.append('teamName', depositRecord.teamName);
        params.append('leadName', depositRecord.leadName);
        params.append('leadEmail', depositRecord.leadEmail);
        params.append('leadPhone', depositRecord.leadPhone);
        params.append('driveUrl', primaryUrl || depositRecord.driveUrl);
        params.append('supplementaryLinks', formattedSupplementary);
        params.append('projectAbstract', depositRecord.projectAbstract || '');
        params.append('submissionSummary', summaryText);
        params.append('submissionJSON', JSON.stringify(depositRecord));

        const jotResp = await fetch(
          `${apiBase}/form/${encodeURIComponent(formId)}/submissions`,
          {
            method: 'POST',
            headers: {
              'APIKEY': apiKey,
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString()
          }
        );

        if (jotResp.ok) {
          syncedJotform = true;
        }
      } catch (jErr) {
        console.warn('JotForm deposit submission notice:', jErr.message);
      }
    }

    // 5. Submit to Firebase Realtime Database
    const firebaseUrl = env.FIREBASE_DATABASE_URL || env.VITE_FIREBASE_DATABASE_URL;
    if (firebaseUrl) {
      try {
        const cleanBase = firebaseUrl.replace(/\/+$/, '');
        const fbTarget = `${cleanBase}/submissions/${encodeURIComponent(receiptToken)}.json`;
        const fbResp = await fetch(fbTarget, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(depositRecord)
        });

        if (fbResp.ok) {
          syncedFirebase = true;
        }
      } catch (fbErr) {
        console.warn('Firebase deposit submission notice:', fbErr.message);
      }
    }

    // 6. Return sanitized client receipt
    return jsonResponse(
      {
        success: true,
        receiptToken,
        timestamp,
        schoolUID: cleanUID,
        eventName: depositRecord.eventName,
        deliverables: depositRecord.deliverables,
        record: depositRecord,
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
  } catch (err) {
    console.error('Deposit recording failure:', err);
    return jsonResponse(
      { error: 'An unexpected error occurred while recording deliverable deposit: ' + err.message },
      500,
      request,
      env
    );
  }
}
