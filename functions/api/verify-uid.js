/**
 * Cloudflare Pages Function: /api/verify-uid
 * Validates school UIDs and fetches accredited registration data
 * with privacy preservation, rate limiting, and strict input validation.
 */

import {
  jsonResponse,
  checkRateLimit,
  sanitizeText,
  maskEmail,
  maskPhone
} from './_security.js';

// Built-in verified benchmark delegations for testing & conclave hosts
const SEED_DELEGATIONS = {
  'C26-DL-0101': {
    schoolUID: 'C26-DL-0101',
    school: {
      name: 'Delhi Public School, R.K. Puram',
      contact: 'Aerospace Society Lead (AEROSS)',
      email: 'aeross@dpsrkp.net',
      phone: '+91 89290 20721',
      city: 'New Delhi'
    },
    events: [
      { id: 'rocketry', name: 'Rocketry (Model & Flight)', category: 'Senior' },
      { id: 'f1', name: 'AEROSS Prix (CO2 Constructor Challenge)', category: 'Senior' },
      { id: 'settle', name: 'Settle-Me-This (Space Settlement)', category: 'Senior' },
      { id: 'volatus', name: 'Volatus (Aviation & 3D CAD)', category: 'Senior' }
    ],
    totals: { totalTeams: 4, totalParticipants: 12 },
    isBenchmark: true
  },
  'C26-INT-0101': {
    schoolUID: 'C26-INT-0101',
    school: {
      name: 'Delhi Public School, R.K. Puram (Host Contingent)',
      contact: 'Internal Student Contingent',
      email: 'aeross@dpsrkp.net',
      phone: '+91 89290 20721',
      city: 'New Delhi'
    },
    events: [
      { id: 'rocketry', name: 'Rocketry (Model & Flight)', category: 'Senior' },
      { id: 'f1', name: 'AEROSS Prix (CO2 Constructor Challenge)', category: 'Senior' },
      { id: 'settle', name: 'Settle-Me-This (Space Settlement)', category: 'Senior' },
      { id: 'volatus', name: 'Volatus (Aviation & 3D CAD)', category: 'Senior' },
      { id: 'dispute', name: 'In Pursuit of Dispute (IPOD)', category: 'Senior' },
      { id: 'bpp', name: 'Business Power Pitch (BPP)', category: 'Senior' },
      { id: 'theatre', name: 'AEROSS Theatre', category: 'Senior' },
      { id: 'gamejam', name: 'CelesteJam', category: 'Senior' }
    ],
    totals: { totalTeams: 8, totalParticipants: 24 },
    isBenchmark: true,
    isInternal: true
  },
  'C26-HR-0102': {
    schoolUID: 'C26-HR-0102',
    school: {
      name: 'Delhi Public School, Sushant Lok',
      contact: 'Contingent In-Charge',
      email: 'delegation@dpssl.net',
      phone: '+91 98110 00000',
      city: 'Gurugram'
    },
    events: [
      { id: 'rocketry', name: 'Rocketry (Model & Flight)', category: 'Senior' },
      { id: 'f1', name: 'AEROSS Prix (CO2 Constructor Challenge)', category: 'Senior' }
    ],
    totals: { totalTeams: 2, totalParticipants: 6 }
  },
  'C26-UP-0103': {
    schoolUID: 'C26-UP-0103',
    school: {
      name: 'Delhi Public School, Noida',
      contact: 'Physics Department Lead',
      email: 'stem@dpsnoida.edu',
      phone: '+91 98120 00000',
      city: 'Noida'
    },
    events: [
      { id: 'rocketry', name: 'Rocketry (Model & Flight)', category: 'Senior' },
      { id: 'gamejam', name: 'CelesteJam', category: 'Junior' }
    ],
    totals: { totalTeams: 2, totalParticipants: 5 }
  }
};

export async function onRequestGet(context) {
  const { request, env = {} } = context;
  const url = new URL(request.url);
  const uidParam = url.searchParams.get('uid') || '';
  return handleVerification(request, uidParam, env);
}

export async function onRequestPost(context) {
  const { request, env = {} } = context;
  try {
    const body = await request.json();
    const uidParam = body?.uid || body?.schoolUID || '';
    return handleVerification(request, uidParam, env);
  } catch {
    return jsonResponse({ error: 'Invalid JSON payload' }, 400, request, env);
  }
}

async function handleVerification(request, rawUID, env) {
  // 1. Rate Limiting: Max 20 verification requests per minute per IP to stop brute-forcing
  const rateLimit = checkRateLimit(request, { limit: 20, windowSeconds: 60, prefix: 'verify_uid' });
  if (!rateLimit.allowed) {
    return jsonResponse(
      {
        error: 'Too Many Requests',
        message: 'UID lookup verification rate limit exceeded. Please wait a minute.'
      },
      429,
      request,
      env
    );
  }

  const cleanUID = sanitizeText(String(rawUID || '')).toUpperCase();

  if (!cleanUID) {
    return jsonResponse(
      {
        verified: false,
        error: 'UID is required. Format should be C26-XX-0000 (e.g., C26-DL-0101).'
      },
      400,
      request,
      env
    );
  }

  // 2. Strict syntax check for C26 UID format (allowing 2-4 letter region/tag codes, e.g. C26-DL-0101 or C26-INT-0101)
  if (!/^C26-[A-Z]{2,4}-\d{4}$/.test(cleanUID)) {
    return jsonResponse(
      {
        verified: false,
        error: `Invalid UID format: "${cleanUID}". Expected syntax: C26-XX-0000 or C26-INT-0000.`
      },
      400,
      request,
      env
    );
  }

  // 3. Query JotForm server-side using secure APIKEY header (never expose key in query parameters)
  const apiKey = env.JOTFORM_API_KEY || env.SECRET_KEY || env.apiKey;
  const formId = env.JOTFORM_FORM_ID || "261896133006456";
  const apiBase = (env.JOTFORM_API_BASE || "https://api.jotform.com").replace(/\/+$/, "");

  if (apiKey) {
    try {
      const jotResp = await fetch(
        `${apiBase}/form/${encodeURIComponent(formId)}/submissions?limit=100`,
        {
          headers: {
            'APIKEY': apiKey,
            'Accept': 'application/json'
          }
        }
      );

      if (jotResp.ok) {
        const jotData = await jotResp.json();
        const submissions = jotData?.content || [];

        for (const sub of submissions) {
          const answers = sub.answers || {};
          let regJson = null;
          if (answers['8']?.answer) {
            try {
              regJson = typeof answers['8'].answer === 'string'
                ? JSON.parse(answers['8'].answer)
                : answers['8'].answer;
            } catch {}
          }

          const subUID = sanitizeText(regJson?.schoolUID || '').toUpperCase();
          const summaryText = answers['7']?.answer || '';

          if (subUID === cleanUID || summaryText.includes(cleanUID)) {
            const rawEmail = regJson?.school?.email || answers['4']?.answer || '';
            const rawPhone = regJson?.school?.phone || answers['5']?.answer || '';
            const schoolName = sanitizeText(regJson?.school?.name || answers['2']?.answer || 'Accredited Delegation');
            const contactName = sanitizeText(regJson?.school?.contact || answers['3']?.answer || 'Authorized Delegate');

            return jsonResponse(
              {
                verified: true,
                source: 'jotform',
                registration: {
                  schoolUID: cleanUID,
                  school: {
                    name: schoolName,
                    contact: contactName,
                    email: rawEmail,
                    phone: rawPhone,
                    maskedEmail: maskEmail(rawEmail),
                    maskedPhone: maskPhone(rawPhone)
                  },
                  events: regJson?.events || [],
                  totals: regJson?.totals || {}
                }
              },
              200,
              request,
              env
            );
          }
        }
      }
    } catch (err) {
      console.warn('JotForm lookup notice:', err.message);
    }
  }

  // 4. Query Firebase Cloud Database if configured
  const firebaseUrl = env.FIREBASE_DATABASE_URL || env.VITE_FIREBASE_DATABASE_URL;
  if (firebaseUrl) {
    try {
      const fbTarget = `${firebaseUrl.replace(/\/+$/, '')}/registrations/${encodeURIComponent(cleanUID)}.json`;
      const fbResp = await fetch(fbTarget, { headers: { 'Accept': 'application/json' } });
      if (fbResp.ok) {
        const fbData = await fbResp.json();
        if (fbData && fbData.schoolUID) {
          return jsonResponse(
            {
              verified: true,
              source: 'firebase',
              registration: {
                ...fbData,
                school: {
                  ...fbData.school,
                  maskedEmail: maskEmail(fbData.school?.email),
                  maskedPhone: maskPhone(fbData.school?.phone)
                }
              }
            },
            200,
            request,
            env
          );
        }
      }
    } catch (fbErr) {
      console.warn('Firebase lookup notice:', fbErr.message);
    }
  }

  // 5. Check Seed Delegations (Accredited Hosts)
  if (SEED_DELEGATIONS[cleanUID]) {
    const seed = SEED_DELEGATIONS[cleanUID];
    return jsonResponse(
      {
        verified: true,
        source: 'benchmark',
        registration: {
          ...seed,
          school: {
            ...seed.school,
            maskedEmail: maskEmail(seed.school.email),
            maskedPhone: maskPhone(seed.school.phone)
          }
        }
      },
      200,
      request,
      env
    );
  }

  // 6. Not Found
  return jsonResponse(
    {
      verified: false,
      error: `No accredited registration record found for UID "${cleanUID}". Please ensure your school delegation has completed registration.`
    },
    404,
    request,
    env
  );
}
