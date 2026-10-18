/**
 * setup_registration_jotform.js
 * -----------------------------
 * Provisions columns / fields for the CelesteCon 2026 School Delegation Registration Form (262905115844054)
 * via JotForm REST API.
 *
 * Usage:
 *   node scripts/setup_registration_jotform.js [API_KEY]
 * or
 *   $env:JOTFORM_API_KEY="your-api-key"; node scripts/setup_registration_jotform.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FORM_ID = process.env.JOTFORM_FORM_ID || '262905115844054';
const API_KEY = process.argv[2] || process.env.JOTFORM_API_KEY;
const API_BASE = (process.env.JOTFORM_API_BASE || 'https://api.jotform.com').replace(/\/+$/, '');

if (!API_KEY && process.argv[1] === fileURLToPath(import.meta.url)) {
  console.error('\x1b[31m[ERROR] JotForm API Key is required.\x1b[0m');
  console.log('\nUsage:');
  console.log('  node scripts/setup_registration_jotform.js <YOUR_JOTFORM_API_KEY>\n');
  console.log('Or set environment variable:');
  console.log('  $env:JOTFORM_API_KEY="your_api_key"; node scripts/setup_registration_jotform.js\n');
  process.exit(1);
}

const EVENT_NAMES = [
  'Volatus',
  'Dimension III',
  'Quizzitch',
  'Settle-me-this',
  'Business Power Pitch',
  'Cosmovate',
  'In Pursuit of Dispute',
  'Surprise Event',
  'AEROSS Theatre',
  'CelesteJam',
  'Rocketry',
  'AEROSS Prix'
];

const DESIRED_QUESTIONS = [
  {
    type: 'control_textbox',
    text: 'School Name',
    name: 'school_name',
    order: 2,
    required: 'Yes'
  },
  {
    type: 'control_textbox',
    text: 'Contact Person',
    name: 'contact_name',
    order: 3,
    required: 'Yes'
  },
  {
    type: 'control_email',
    text: 'Contact Email',
    name: 'contact_email',
    order: 4,
    required: 'Yes'
  },
  {
    type: 'control_phone',
    text: 'Contact Phone',
    name: 'contact_phone',
    order: 5,
    required: 'Yes'
  },
  {
    type: 'control_checkbox',
    text: 'Events Registered',
    name: 'events_selected',
    order: 6,
    options: EVENT_NAMES.join('|')
  },
  {
    type: 'control_textarea',
    text: 'Registration Summary (auto-generated)',
    name: 'registration_summary',
    order: 7
  },
  {
    type: 'control_textarea',
    text: 'Registration Data (JSON — do not edit)',
    name: 'registration_json',
    order: 8
  },
  {
    type: 'control_textbox',
    text: 'Total Teams / Entries',
    name: 'total_teams',
    order: 9
  },
  {
    type: 'control_textbox',
    text: 'Total Participants',
    name: 'total_participants',
    order: 10
  }
];

async function addQuestion(q, apiKey) {
  const params = new URLSearchParams();
  params.append('question[type]', q.type);
  params.append('question[text]', q.text);
  params.append('question[name]', q.name);
  params.append('question[order]', String(q.order));
  if (q.required) {
    params.append('question[required]', q.required);
  }
  if (q.options) {
    params.append('question[options]', q.options);
  }

  let res = await fetch(`${API_BASE}/form/${FORM_ID}/questions?apiKey=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });

  let data = await res.json();
  if (res.ok && (data.responseCode === 200 || data.responseCode === 201)) {
    console.log(`  \x1b[32m✔\x1b[0m Added field [${q.order}]: "${q.text}" (qid: ${data.content?.qid}, name: ${q.name})`);
    return data.content;
  } else {
    // Retry with singular endpoint
    res = await fetch(`${API_BASE}/form/${FORM_ID}/question?apiKey=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });
    data = await res.json();
    if (res.ok && (data.responseCode === 200 || data.responseCode === 201)) {
      console.log(`  \x1b[32m✔\x1b[0m Added field [${q.order}]: "${q.text}" (qid: ${data.content?.qid}, name: ${q.name})`);
      return data.content;
    }
    console.error(`  \x1b[31m✖\x1b[0m Failed field "${q.text}":`, data.message || res.statusText);
    return null;
  }
}

async function updateQuestion(qid, updates, apiKey) {
  const params = new URLSearchParams();
  for (const [key, val] of Object.entries(updates)) {
    params.append(`question[${key}]`, val);
  }

  const res = await fetch(`${API_BASE}/form/${FORM_ID}/question/${qid}?apiKey=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });

  const data = await res.json();
  return res.ok && data.responseCode === 200;
}

export async function runRegistrationProvisioning(apiKeyOverride) {
  const key = apiKeyOverride || API_KEY;
  if (!key) {
    throw new Error('JotForm API Key is required for registration provisioning');
  }

  console.log(`\n\x1b[36m=== PROVISIONING JOTFORM FIELDS FOR REGISTRATION FORM ${FORM_ID} ===\x1b[0m\n`);

  // 1. Verify access
  const formRes = await fetch(`${API_BASE}/form/${FORM_ID}?apiKey=${encodeURIComponent(key)}`);
  const formData = await formRes.json();

  if (!formRes.ok || formData.responseCode !== 200) {
    console.error(`\x1b[31m[ERROR]\x1b[0m Could not access form ${FORM_ID}:`, formData.message);
    throw new Error(`Could not access form ${FORM_ID}: ${formData.message}`);
  }

  console.log(`Form Title: "${formData.content.title}" (Status: ${formData.content.status})`);

  // 2. Fetch existing questions
  const qRes = await fetch(`${API_BASE}/form/${FORM_ID}/questions?apiKey=${encodeURIComponent(key)}`);
  const qData = await qRes.json();
  const existingQuestions = qData.content || {};

  const existingByName = {};
  for (const [qid, q] of Object.entries(existingQuestions)) {
    if (q.name) existingByName[q.name] = { qid, ...q };
  }

  // 3. Update header if exists
  if (existingQuestions['1']) {
    await updateQuestion('1', {
      text: 'CelesteCon 2026 Registration',
      subHeader: 'Official School Delegation & Team Portal · Aerospace Society (AEROSS)'
    }, key);
    console.log('  \x1b[32m✔\x1b[0m Header updated: "CelesteCon 2026 Registration"');
  }

  // 4. Add missing questions
  for (const q of DESIRED_QUESTIONS) {
    if (existingByName[q.name]) {
      console.log(`  \x1b[33mℹ\x1b[0m Field "${q.text}" already exists (qid: ${existingByName[q.name].qid}, name: ${q.name})`);
    } else {
      await addQuestion(q, key);
      await new Promise(r => setTimeout(r, 250)); // rate limit protection
    }
  }

  // 5. Update Submit button order if exists at qid 2
  const buttonQid = Object.keys(existingQuestions).find(k => existingQuestions[k].type === 'control_button');
  if (buttonQid) {
    await updateQuestion(buttonQid, { order: '20', text: 'Submit Registration' }, key);
    console.log(`  \x1b[32m✔\x1b[0m Submit button order updated to 20 (qid: ${buttonQid})`);
  }

  // 6. Fetch final questions and save field map
  const finalQRes = await fetch(`${API_BASE}/form/${FORM_ID}/questions?apiKey=${encodeURIComponent(key)}`);
  const finalQData = await finalQRes.json();
  const finalQuestions = finalQData.content || {};

  const fieldMap = {
    _form_id: FORM_ID,
    _form_url: `https://form.jotform.com/${FORM_ID}`,
    _tables_url: `https://www.jotform.com/tables/${FORM_ID}`,
    _updated_at: new Date().toISOString()
  };

  for (const [qid, q] of Object.entries(finalQuestions)) {
    if (q.name) {
      fieldMap[q.name] = qid;
    }
  }

  const mapPath = path.resolve(__dirname, '../C26JF/field_map.json');
  fs.writeFileSync(mapPath, JSON.stringify(fieldMap, null, 2));
  console.log(`\n\x1b[32m✔\x1b[0m Wrote registration field map to: ${mapPath}`);

  console.log('\n\x1b[32m=== SUCCESS! ALL COLUMNS CREATED IN REGISTRATION JOTFORM TABLES ===\x1b[0m');
  console.log(`Visit your Jotform Tables: https://www.jotform.com/tables/${FORM_ID}`);
  return fieldMap;
}

// Direct execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runRegistrationProvisioning().catch(err => {
    console.error('[FATAL ERROR]:', err);
    process.exit(1);
  });
}
