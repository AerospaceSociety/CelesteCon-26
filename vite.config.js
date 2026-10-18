import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Seed delegations for local dev simulation
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
      { id: 'bpp', name: 'Business Power Pitch (BPP)', category: 'Senior', teams: [{ teamId: 'C26-DL-0101-BPP-T1', teamName: 'Project Astraea', members: [{ name: 'Aryan Sharma', email: 'aryan@dpsrkp.net', class: '11', gender: 'M' }] }] },
      { id: 'rocketry', name: 'Rocketry (Model & Flight)', category: 'Senior', teams: [{ teamId: 'C26-DL-0101-ROC-T1', teamName: 'Apex Flight Lab', members: [{ name: 'Siddharth Srivastava', email: 'siddharth@dpsrkp.net', class: '11', gender: 'M' }] }] },
      { id: 'f1', name: 'AEROSS Prix (CO2 Constructor Challenge)', category: 'Senior', teams: [{ teamId: 'C26-DL-0101-F1-T1', teamName: 'Redshift Racing', members: [{ name: 'Anant Jha', email: 'anant@dpsrkp.net', class: '11', gender: 'M' }] }] },
      { id: 'settle', name: 'Settle-Me-This (Space Settlement)', category: 'Senior', teams: [{ teamId: 'C26-DL-0101-SMT-T1', teamName: 'Elysium Biosphere', members: [{ name: 'Arshia Barsain', email: 'arshia@dpsrkp.net', class: '11', gender: 'F' }] }] },
      { id: 'volatus', name: 'Volatus (Aviation & 3D CAD)', category: 'Senior', teams: [{ teamId: 'C26-DL-0101-VOL-T1', teamName: 'Vayu Aero Studio', members: [{ name: 'Tarushi Tomar', email: 'tarushi@dpsrkp.net', class: '11', gender: 'F' }] }] }
    ],
    totals: { totalTeams: 5, totalParticipants: 15 },
    isBenchmark: true
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
      { id: 'rocketry', name: 'Rocketry (Model & Flight)', category: 'Senior', teams: [{ teamId: 'C26-HR-0102-ROC-T1', teamName: 'Stellar Velocity', members: [{ name: 'Rohan Mehra', email: 'rohan@dpssl.net', class: '12', gender: 'M' }] }] },
      { id: 'bpp', name: 'Business Power Pitch (BPP)', category: 'Senior', teams: [{ teamId: 'C26-HR-0102-BPP-T1', teamName: 'Helios Venture Group', members: [{ name: 'Kavya Singh', email: 'kavya@dpssl.net', class: '11', gender: 'F' }] }] }
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
      { id: 'gamejam', name: 'CelesteJam', category: 'Junior', teams: [{ teamId: 'C26-UP-0103-CJM-T1', teamName: 'RetroPixel Orbit', members: [{ name: 'Ishaan Verma', email: 'ishaan@dpsnoida.edu', class: '8', gender: 'M' }] }] },
      { id: 'settle', name: 'Settle-Me-This', category: 'Junior', teams: [{ teamId: 'C26-UP-0103-SMT-T1', teamName: 'Lagrange Architects', members: [{ name: 'Ananya Roy', email: 'ananya@dpsnoida.edu', class: '8', gender: 'F' }] }] }
    ],
    totals: { totalTeams: 2, totalParticipants: 5 }
  }
};

/**
 * Local development middleware for /api/verify-uid and /api/deposit
 * to ensure testing during `npm run dev` functions reliably with or without Cloudflare workers.
 */
function apiDevPlugin() {
  return {
    name: 'api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/')) return next();

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, APIKEY');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }

        const url = new URL(req.url, 'http://localhost');

        // /api/verify-uid handler
        if (url.pathname === '/api/verify-uid') {
          const rawUID = (url.searchParams.get('uid') || '').trim().toUpperCase();
          const primaryVerifyFormId = process.env.JOTFORM_VERIFY_FORM_ID || '261896133006456';
          const newRegFormId = process.env.JOTFORM_FORM_ID || '262905115844054';
          const formsToSearch = Array.from(new Set([primaryVerifyFormId, newRegFormId]));

          // Try live JotForm if key is available in environment
          if (apiKey && rawUID) {
            for (const formId of formsToSearch) {
              try {
                const jotResp = await fetch(
                  `https://api.jotform.com/form/${formId}/submissions?limit=1000&orderby=created_at`,
                  { headers: { 'APIKEY': apiKey, 'Accept': 'application/json' } }
                );
              if (jotResp.ok) {
                const jotData = await jotResp.json();
                const submissions = jotData?.content || [];
                for (const sub of submissions) {
                  const answers = sub.answers || {};
                  let regJson = null;

                  for (const [qid, qAns] of Object.entries(answers)) {
                    if (qAns.name === 'registration_json' || (qAns.text && qAns.text.includes('Registration Data')) || qid === '8') {
                      const rawJson = qAns.answer;
                      if (rawJson) {
                        try { regJson = typeof rawJson === 'string' ? JSON.parse(rawJson) : rawJson; break; } catch {}
                      }
                    }
                  }

                  const subUID = (regJson?.schoolUID || '').toUpperCase();
                  const summary = (Object.values(answers).find(a => a.name === 'registration_summary')?.answer || answers['7']?.answer || '').toUpperCase();
                  if (subUID === rawUID || summary.includes(rawUID) || JSON.stringify(answers).toUpperCase().includes(rawUID)) {
                    const getAns = (name, fallbackQid) => {
                      const byName = Object.values(answers).find(a => a.name === name)?.answer;
                      return byName !== undefined ? byName : answers[fallbackQid]?.answer || '';
                    };

                    res.statusCode = 200;
                    res.end(JSON.stringify({
                      verified: true,
                      source: 'jotform',
                      registration: {
                        schoolUID: rawUID,
                        school: {
                          name: regJson?.school?.name || getAns('school_name', '2') || 'Accredited Delegation',
                          contact: regJson?.school?.contact || getAns('contact_name', '3') || 'Authorized Delegate',
                          email: regJson?.school?.email || getAns('contact_email', '4') || '',
                          phone: regJson?.school?.phone || getAns('contact_phone', '5') || ''
                        },
                        events: regJson?.events || [],
                        totals: regJson?.totals || {}
                      }
                    }));
                    return;
                  }
                }
              }
              } catch (e) {
                console.warn('[Vite Dev] Jotform lookup error:', e.message);
              }
            }
          }

          // Check seed delegations
          if (SEED_DELEGATIONS[rawUID]) {
            res.statusCode = 200;
            res.end(JSON.stringify({
              verified: true,
              source: 'benchmark',
              registration: SEED_DELEGATIONS[rawUID]
            }));
            return;
          }

          // Not found
          res.statusCode = 404;
          res.end(JSON.stringify({
            verified: false,
            error: `No accredited registration record found for UID "${rawUID}".`
          }));
          return;
        }

        // /api/deposit handler
        if (url.pathname === '/api/deposit' && req.method === 'POST') {
          let bodyData = '';
          req.on('data', chunk => { bodyData += chunk; });
          req.on('end', async () => {
            try {
              const body = JSON.parse(bodyData || '{}');
              const cleanUID = (body.schoolUID || 'C26-DL-0101').toUpperCase();
              const eventId = String(body.eventId || '04').padStart(2, '0');

              if (eventId === '03') {
                res.statusCode = 400;
                res.end(JSON.stringify({
                  error: 'No preliminary portal submission is required for In Pursuit of Dispute (IPOD). Round 1 qualification is conducted via the online Quizzitch quiz platform.'
                }));
                return;
              }

              // Event-specific mandatory deliverable rules
              const EVENT_REQUIREMENTS = {
                '01': ['proposalUrl'],
                '02': ['proposalUrl', 'cadPackageUrl'],
                '04': ['proposalUrl', 'videoUrl'],
                '05': ['videoUrl'],
                '06': ['buildUrl', 'videoUrl'],
                '07': ['orkUrl', 'reportUrl'],
                '08': ['dossierUrl', 'cadPackageUrl']
              };

              const requiredKeys = EVENT_REQUIREMENTS[eventId] || ['proposalUrl'];
              const deliverables = body.deliverables || {};

              for (const reqKey of requiredKeys) {
                if (!deliverables[reqKey] || !deliverables[reqKey].trim()) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({
                    error: `Mandatory deliverable missing: "${reqKey}" is required for Event ${eventId}.`
                  }));
                  return;
                }
              }

              const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
              const receiptToken = `C26-DEP-${eventId}-${cleanUID.replace(/[^A-Z0-9]/g, '')}-${randomSuffix}`;
              const timestamp = new Date().toISOString();

              let syncedJotform = false;
              const apiKey = process.env.JOTFORM_API_KEY;
              const formId = process.env.JOTFORM_SUBMISSIONS_FORM_ID || '262904743897068';

              const formattedSupplementary = (body.supplementaryLinks || [])
                .map((l, i) => `${i + 1}. [${l.label}] ${l.url}`)
                .join('\n');
              const primaryUrl = body.driveUrl || (body.deliverables ? Object.values(body.deliverables)[0] : '');

              const summaryText = [
                `CELESTECON 2026 // OFFICIAL DELIVERABLE DEPOSIT`,
                `===============================================`,
                `RECEIPT TOKEN:     ${receiptToken}`,
                `TIMESTAMP:         ${timestamp}`,
                `SCHOOL UID:        ${cleanUID}`,
                `INSTITUTION:       ${body.schoolName || 'Accredited Institution'}`,
                `EVENT:             [${eventId}] ${body.eventName || 'Event ' + eventId}`,
                `DIVISION:          ${body.division || 'Senior'}`,
                `TEAM NAME:         ${body.teamName || 'Delegation Team'}`,
                `LEAD CONTACT:      ${body.leadName || ''} (${body.leadEmail || ''})`,
                `PHONE:             ${body.leadPhone || 'N/A'}`,
                `PRIMARY DRIVE URL: ${primaryUrl}`,
                `SUPPLEMENTARY:     ${formattedSupplementary || 'None declared'}`,
                `ABSTRACT:          ${body.projectAbstract || 'None provided.'}`,
                `===============================================`
              ].join('\n');

              if (apiKey) {
                try {
                  const params = new URLSearchParams();
                  params.append('submission[3]', receiptToken);
                  params.append('submission[4]', cleanUID);
                  params.append('submission[5]', body.schoolName || 'Accredited Institution');
                  params.append('submission[6]', eventId);
                  params.append('submission[7]', body.eventName || `Event ${eventId}`);
                  params.append('submission[8]', body.division || 'Senior');
                  params.append('submission[9]', body.teamName || 'Delegation Team');
                  params.append('submission[10]', body.leadName || '');
                  params.append('submission[11]', body.leadEmail || '');
                  params.append('submission[12]', body.leadPhone || '');
                  params.append('submission[13]', primaryUrl);
                  params.append('submission[14]', formattedSupplementary || 'None declared');
                  params.append('submission[15]', body.projectAbstract || '');
                  params.append('submission[16]', summaryText);
                  params.append('submission[17]', JSON.stringify({ ...body, receiptToken, timestamp }));

                  params.append('receiptToken', receiptToken);
                  params.append('schoolUID', cleanUID);
                  params.append('schoolName', body.schoolName || 'Accredited Institution');
                  params.append('eventId', eventId);
                  params.append('eventName', body.eventName || `Event ${eventId}`);
                  params.append('division', body.division || 'Senior');
                  params.append('teamName', body.teamName || 'Delegation Team');
                  params.append('leadName', body.leadName || '');
                  params.append('leadEmail', body.leadEmail || '');
                  params.append('leadPhone', body.leadPhone || '');
                  params.append('driveUrl', primaryUrl);
                  params.append('supplementaryLinks', formattedSupplementary || 'None declared');
                  params.append('projectAbstract', body.projectAbstract || '');
                  params.append('submissionSummary', summaryText);
                  params.append('submissionJSON', JSON.stringify({ ...body, receiptToken, timestamp }));

                  const jotResp = await fetch(`https://api.jotform.com/form/${formId}/submissions`, {
                    method: 'POST',
                    headers: { 'APIKEY': apiKey, 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: params.toString()
                  });
                  if (jotResp.ok) syncedJotform = true;
                } catch (jErr) {
                  console.warn('[Vite Dev] Jotform deposit warning:', jErr.message);
                }
              } else {
                try {
                  const directParams = new URLSearchParams();
                  directParams.append('formID', formId);
                  directParams.append('simple_spc', `${formId}-${formId}`);
                  directParams.append('q3', receiptToken);
                  directParams.append('q4', cleanUID);
                  directParams.append('q5', body.schoolName || 'Accredited Institution');
                  directParams.append('q6', eventId);
                  directParams.append('q7', body.eventName || `Event ${eventId}`);
                  directParams.append('q8', body.division || 'Senior');
                  directParams.append('q9', body.teamName || 'Delegation Team');
                  directParams.append('q10', body.leadName || '');
                  directParams.append('q11', body.leadEmail || '');
                  directParams.append('q12', body.leadPhone || '');
                  directParams.append('q13', primaryUrl);
                  directParams.append('q14', formattedSupplementary || 'None declared');
                  directParams.append('q15', body.projectAbstract || '');
                  directParams.append('q16', summaryText);
                  directParams.append('q17', JSON.stringify({ ...body, receiptToken, timestamp }));

                  directParams.append('submission[3]', receiptToken);
                  directParams.append('submission[4]', cleanUID);
                  directParams.append('submission[5]', body.schoolName || 'Accredited Institution');
                  directParams.append('submission[6]', eventId);
                  directParams.append('submission[7]', body.eventName || `Event ${eventId}`);
                  directParams.append('submission[8]', body.division || 'Senior');
                  directParams.append('submission[9]', body.teamName || 'Delegation Team');
                  directParams.append('submission[10]', body.leadName || '');
                  directParams.append('submission[11]', body.leadEmail || '');
                  directParams.append('submission[12]', body.leadPhone || '');
                  directParams.append('submission[13]', primaryUrl);
                  directParams.append('submission[14]', formattedSupplementary || 'None declared');
                  directParams.append('submission[15]', body.projectAbstract || '');
                  directParams.append('submission[16]', summaryText);
                  directParams.append('submission[17]', JSON.stringify({ ...body, receiptToken, timestamp }));

                  const jotResp = await fetch(`https://submit.jotform.com/submit/${encodeURIComponent(formId)}`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded',
                      'Origin': 'https://form.jotform.com',
                      'Referer': `https://form.jotform.com/${encodeURIComponent(formId)}`
                    },
                    body: directParams.toString()
                  });
                  if (jotResp.ok) syncedJotform = true;
                } catch (jErr) {
                  console.warn('[Vite Dev] Jotform direct deposit warning:', jErr.message);
                }
              }

              res.statusCode = 200;
              res.end(JSON.stringify({
                success: true,
                receiptToken,
                timestamp,
                schoolUID: cleanUID,
                eventName: body.eventName,
                deliverables: body.deliverables,
                syncedTo: {
                  jotform: syncedJotform,
                  firebase: false,
                  localVault: true
                }
              }));
            } catch (err) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiDevPlugin()],
  build: {
    sourcemap: false,
    minify: true,
    cssMinify: true
  },
  server: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  }
});
