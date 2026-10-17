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
          const apiKey = process.env.JOTFORM_API_KEY;
          const formId = process.env.JOTFORM_FORM_ID || '261896133006456';

          // Try live JotForm if key is available in environment
          if (apiKey && rawUID) {
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
                  const rawJson = answers['8']?.answer;
                  if (rawJson) {
                    try { regJson = typeof rawJson === 'string' ? JSON.parse(rawJson) : rawJson; } catch {}
                  }
                  const subUID = (regJson?.schoolUID || '').toUpperCase();
                  const summary = (answers['7']?.answer || '').toUpperCase();
                  if (subUID === rawUID || summary.includes(rawUID) || JSON.stringify(answers).toUpperCase().includes(rawUID)) {
                    res.statusCode = 200;
                    res.end(JSON.stringify({
                      verified: true,
                      source: 'jotform',
                      registration: {
                        schoolUID: rawUID,
                        school: {
                          name: regJson?.school?.name || answers['2']?.answer || 'Accredited Delegation',
                          contact: regJson?.school?.contact || answers['3']?.answer || 'Authorized Delegate',
                          email: regJson?.school?.email || answers['4']?.answer || '',
                          phone: regJson?.school?.phone || answers['5']?.answer || ''
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
              const formId = process.env.JOTFORM_SUBMISSIONS_FORM_ID || process.env.JOTFORM_FORM_ID || '261896133006456';

              if (apiKey) {
                try {
                  const params = new URLSearchParams();
                  params.append('submission[1]', `SUBMISSION: Event ${eventId} - ${body.schoolName} (${cleanUID})`);
                  params.append('submission[2]', body.schoolName || 'Accredited Institution');
                  params.append('submission[3]', body.leadName || '');
                  params.append('submission[4]', body.leadEmail || '');
                  params.append('submission[5]', body.leadPhone || '');
                  params.append('submission[6]', body.eventName || `Event ${eventId}`);
                  params.append('submission[7]', JSON.stringify(body.deliverables, null, 2));
                  params.append('submission[8]', JSON.stringify({ ...body, receiptToken, timestamp }));

                  const jotResp = await fetch(`https://api.jotform.com/form/${formId}/submissions`, {
                    method: 'POST',
                    headers: { 'APIKEY': apiKey, 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: params.toString()
                  });
                  if (jotResp.ok) syncedJotform = true;
                } catch (jErr) {
                  console.warn('[Vite Dev] Jotform deposit warning:', jErr.message);
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
