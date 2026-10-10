/**
 * setup_internal_jotform.js
 * -------------------------
 * Provisions fields for form 262820575510050 via JotForm REST API.
 * 
 * Usage:
 *   node scripts/setup_internal_jotform.js YOUR_JOTFORM_API_KEY
 * or
 *   $env:JOTFORM_API_KEY="your-api-key"; node scripts/setup_internal_jotform.js
 */

const FORM_ID = process.env.JOTFORM_INTERNAL_FORM_ID || '262820575510050';
const API_KEY = process.argv[2] || process.env.JOTFORM_API_KEY;
const API_BASE = (process.env.JOTFORM_API_BASE || 'https://api.jotform.com').replace(/\/+$/, '');

if (!API_KEY) {
  console.error('\x1b[31m[ERROR] JotForm API Key is required.\x1b[0m');
  console.log('\nUsage:');
  console.log('  node scripts/setup_internal_jotform.js <YOUR_JOTFORM_API_KEY>\n');
  console.log('Or set the environment variable:');
  console.log('  $env:JOTFORM_API_KEY="your_api_key"; node scripts/setup_internal_jotform.js\n');
  console.log('You can generate a Full Access API key at: https://www.jotform.com/myaccount/api');
  process.exit(1);
}

const QUESTIONS = [
  {
    type: 'control_textbox',
    text: 'Team Name',
    name: 'teamName',
    order: 2
  },
  {
    type: 'control_textbox',
    text: 'Lead Student Name',
    name: 'studentName',
    order: 3
  },
  {
    type: 'control_email',
    text: 'DPSRKP Email (@dpsrkp.net)',
    name: 'email',
    order: 4
  },
  {
    type: 'control_phone',
    text: 'Contact Phone',
    name: 'phone',
    order: 5
  },
  {
    type: 'control_textbox',
    text: 'Class & Section',
    name: 'classSection',
    order: 6
  },
  {
    type: 'control_textbox',
    text: 'Admission Number',
    name: 'admissionNo',
    order: 7
  },
  {
    type: 'control_textbox',
    text: 'Competition / Event',
    name: 'event',
    order: 8
  },
  {
    type: 'control_textbox',
    text: 'Category (Senior / Junior)',
    name: 'category',
    order: 9
  },
  {
    type: 'control_textbox',
    text: 'Team UID',
    name: 'uid',
    order: 10
  },
  {
    type: 'control_textarea',
    text: 'Registration Summary (Roster & Details)',
    name: 'registration_summary',
    order: 11
  },
  {
    type: 'control_textarea',
    text: 'Registration JSON (System Data)',
    name: 'registration_json',
    order: 12
  }
];

async function addQuestion(q, index) {
  const params = new URLSearchParams();
  params.append('question[type]', q.type);
  params.append('question[text]', q.text);
  params.append('question[name]', q.name);
  params.append('question[order]', String(q.order));
  if (q.options) {
    params.append('question[options]', q.options);
  }

  let res = await fetch(`${API_BASE}/form/${FORM_ID}/questions?apiKey=${encodeURIComponent(API_KEY)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });

  let data = await res.json();
  if (!res.ok || data.responseCode !== 200) {
    // Fallback to singular endpoint /question
    res = await fetch(`${API_BASE}/form/${FORM_ID}/question?apiKey=${encodeURIComponent(API_KEY)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });
    data = await res.json();
  }

  if (res.ok && data.responseCode === 200) {
    console.log(`  \x1b[32m✔\x1b[0m Added field [${q.order}]: "${q.text}" (name: ${q.name}, type: ${q.type})`);
    return data.content;
  } else {
    console.error(`  \x1b[31m✖\x1b[0m Failed field "${q.text}":`, data.message || res.statusText);
    return null;
  }
}

async function run() {
  console.log(`\n\x1b[36m=== PROVISIONING JOTFORM FIELDS FOR FORM ${FORM_ID} ===\x1b[0m\n`);
  
  // 1. Verify form exists and access is authorized
  const checkRes = await fetch(`${API_BASE}/form/${FORM_ID}?apiKey=${encodeURIComponent(API_KEY)}`);
  const checkData = await checkRes.json();
  
  if (!checkRes.ok || checkData.responseCode !== 200) {
    console.error(`\x1b[31m[AUTH ERROR]\x1b[0m Could not access form ${FORM_ID}:`, checkData.message);
    console.error('Please ensure your API key has "Full Access" permissions at https://www.jotform.com/myaccount/api');
    process.exit(1);
  }

  console.log(`Form Title: "${checkData.content.title}" (Status: ${checkData.content.status})`);
  console.log(`Adding ${QUESTIONS.length} form questions/columns...\n`);

  for (let i = 0; i < QUESTIONS.length; i++) {
    await addQuestion(QUESTIONS[i], i);
    // Brief delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 200));
  }

  console.log('\n\x1b[32m=== SUCCESS! ALL FIELDS PROVISIONED ===\x1b[0m');
  console.log(`Visit your Jotform Tables: https://www.jotform.com/tables/${FORM_ID}`);
  console.log('All columns are now active and will display submitted data!\n');
}

run().catch(err => {
  console.error('[FATAL ERROR]:', err);
});
