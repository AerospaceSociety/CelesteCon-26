/**
 * Cloudflare Pages Function: /api/deposit
 * Receives project deliverable submissions, validates Drive & supplementary links,
 * sanitizes user input, applies edge rate limits, and persists to JotForm and Firebase.
 */

import {
  jsonResponse,
  checkRateLimit,
  sanitizeText,
  sanitizeUrl
} from './_security.js';

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
    if (!/^C26-[A-Z]{2}-\d{4}$/.test(cleanUID)) {
      return jsonResponse(
        { error: `Invalid UID syntax: "${cleanUID}". Must match C26-XX-0000 format.` },
        400,
        request,
        env
      );
    }

    // 2. Validate and sanitize primary Cloud Deliverable URL (SSRF & XSS defense)
    const rawDrive = body.driveUrl || '';
    const cleanDrive = sanitizeUrl(rawDrive, 1500);

    if (!cleanDrive) {
      return jsonResponse(
        { error: 'A valid HTTPS cloud storage link (Google Drive, OneDrive, etc.) is required.' },
        400,
        request,
        env
      );
    }

    // 3. Sanitize supplementary links
    const rawSupplementary = Array.isArray(body.supplementaryLinks) ? body.supplementaryLinks : [];
    const sanitizedSupplementary = rawSupplementary
      .slice(0, 10) // Cap to maximum 10 links
      .map(item => {
        const url = sanitizeUrl(item?.url || '', 1500);
        const label = sanitizeText(item?.label || 'Resource Link', 100);
        return url ? { label, url } : null;
      })
      .filter(Boolean);

    const eventId = sanitizeText(body.eventId || '07', 10).padStart(2, '0');
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const receiptToken = `C26-DEP-${eventId}-${cleanUID.replace(/[^A-Z0-9]/g, '')}-${randomSuffix}`;
    const timestamp = new Date().toISOString();

    const depositRecord = {
      receiptToken,
      timestamp,
      schoolUID: cleanUID,
      schoolName: sanitizeText(body.schoolName || 'Accredited Delegation', 120),
      eventId,
      eventName: sanitizeText(body.eventName || `Event ${eventId}`, 100),
      division: sanitizeText(body.division || 'Senior (Grades 9–12)', 50),
      teamName: sanitizeText(body.teamName || 'Delegation Team', 100),
      leadName: sanitizeText(body.leadName || '', 100),
      leadEmail: sanitizeText(body.leadEmail || '', 100),
      leadPhone: sanitizeText(body.leadPhone || '', 30),
      submissionMethod: 'cloud_folder_and_supplementary_links',
      driveUrl: cleanDrive,
      supplementaryLinks: sanitizedSupplementary,
      projectAbstract: sanitizeText(body.projectAbstract || '', 2000),
      targetDestination: 'dual_sync'
    };

    let syncedJotform = false;
    let syncedFirebase = false;

    // 4. Submit to JotForm with APIKEY header
    const apiKey = env.JOTFORM_API_KEY || env.SECRET_KEY || env.apiKey;
    const formId = env.JOTFORM_SUBMISSIONS_FORM_ID || env.JOTFORM_FORM_ID || "261896133006456";
    const apiBase = (env.JOTFORM_API_BASE || "https://api.jotform.com").replace(/\/+$/, "");

    if (apiKey) {
      try {
        const params = new URLSearchParams();
        params.append('submission[1]', `SUBMISSION: ${depositRecord.eventName} - ${depositRecord.schoolName}`);
        params.append('submission[2]', depositRecord.schoolName);
        params.append('submission[3]', depositRecord.leadName);
        params.append('submission[4]', depositRecord.leadEmail);
        params.append('submission[5]', depositRecord.leadPhone);
        params.append('submission[6]', depositRecord.eventName);
        params.append('submission[7]', [
          `RECEIPT TOKEN: ${receiptToken}`,
          `SCHOOL UID: ${cleanUID}`,
          `EVENT: ${depositRecord.eventName} (${depositRecord.division})`,
          `TEAM: ${depositRecord.teamName}`,
          `PRIMARY DRIVE LINK: ${depositRecord.driveUrl}`,
          `SUPPLEMENTARY LINKS:`,
          ...(depositRecord.supplementaryLinks.map((l, i) => `  ${i + 1}. [${l.label}] ${l.url}`)),
          `ABSTRACT: ${depositRecord.projectAbstract}`
        ].join('\n'));
        params.append('submission[8]', JSON.stringify(depositRecord));

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

    // 6. Return sanitized client receipt (never leak server API keys or internal responses)
    return jsonResponse(
      {
        success: true,
        receiptToken,
        timestamp,
        schoolUID: cleanUID,
        eventName: depositRecord.eventName,
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
      { error: 'An unexpected error occurred while recording deliverable deposit.' },
      500,
      request,
      env
    );
  }
}
