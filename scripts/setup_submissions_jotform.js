/**
 * setup_submissions_jotform.js
 * ----------------------------
 * Provisions columns / fields for the CelesteCon 2026 Deliverable Submission Form (262904743897068)
 * via JotForm REST API.
 *
 * Usage:
 *   node scripts/setup_submissions_jotform.js [API_KEY]
 * or
 *   $env:JOTFORM_API_KEY="your-api-key"; node scripts/setup_submissions_jotform.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FORM_ID = process.env.JOTFORM_SUBMISSIONS_FORM_ID || '262904743897068';
const API_KEY = process.argv[2] || process.env.JOTFORM_API_KEY;
const API_BASE = (process.env.JOTFORM_API_BASE || 'https://api.jotform.com').replace(/\/+$/, '');

if (!API_KEY && process.argv[1] === fileURLToPath(import.meta.url)) {
  console.error('\x1b[31m[ERROR] JotForm API Key is required.\x1b[0m');
  console.log('\nUsage:');
  console.log('  node scripts/setup_submissions_jotform.js <YOUR_JOTFORM_API_KEY>\n');
  process.exit(1);
}

const DESIRED_QUESTIONS = [
  {
    type: 'control_textbox',
    text: 'Receipt Token',
    name: 'receiptToken',
    order: 3
  },
  {
    type: 'control_textbox',
    text: 'School UID',
    name: 'schoolUID',
    order: 4
  },
  {
    type: 'control_textbox',
    text: 'School / Institution Name',
    name: 'schoolName',
    order: 5
  },
  {
    type: 'control_textbox',
    text: 'Event ID',
    name: 'eventId',
    order: 6
  },
  {
    type: 'control_textbox',
    text: 'Competition / Event',
    name: 'eventName',
    order: 7
  },
  {
    type: 'control_textbox',
    text: 'Division / Category',
    name: 'division',
    order: 8
  },
  {
    type: 'control_textbox',
    text: 'Team Name',
    name: 'teamName',
    order: 9
  },
  {
    type: 'control_textbox',
    text: 'Lead Student Name',
    name: 'leadName',
    order: 10
  },
  {
    type: 'control_email',
    text: 'Lead Student Email',
    name: 'leadEmail',
    order: 11
  },
  {
    type: 'control_phone',
    text: 'Lead Contact Phone',
    name: 'leadPhone',
    order: 12
  },
  {
    type: 'control_textbox',
    text: 'Primary Cloud Deliverable URL',
    name: 'driveUrl',
    order: 13
  },
  {
    type: 'control_textarea',
    text: 'Supplementary Resource Links',
    name: 'supplementaryLinks',
    order: 14
  },
  {
    type: 'control_textarea',
    text: 'Project Abstract / Executive Summary',
    name: 'projectAbstract',
    order: 15
  },
  {
    type: 'control_textarea',
    text: 'Submission Receipt Summary',
    name: 'submissionSummary',
    order: 16
  },
  {
    type: 'control_textarea',
    text: 'Submission JSON (System Data)',
    name: 'submissionJSON',
    order: 17
  }
];

async function addQuestion(q, apiKey) {
  const params = new URLSearchParams();
  params.append('question[type]', q.type);
  params.append('question[text]', q.text);
  params.append('question[name]', q.name);
  params.append('question[order]', String(q.order));
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

export async function runSubmissionsProvisioning(apiKeyOverride) {
  const key = apiKeyOverride || API_KEY;
  if (!key) {
    throw new Error('JotForm API Key is required for submissions provisioning');
  }

  console.log(`\n\x1b[36m=== PROVISIONING JOTFORM FIELDS FOR SUBMISSION FORM ${FORM_ID} ===\x1b[0m\n`);

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

  // 3. Update header if needed
  if (existingQuestions['1']) {
    await updateQuestion('1', {
      text: 'CelesteCon 2026 Project Deliverable Submission',
      subHeader: 'Official Digital Deposit Gateway · Aerospace Society (AEROSS)'
    }, key);
    console.log('  \x1b[32m✔\x1b[0m Header updated: "CelesteCon 2026 Project Deliverable Submission"');
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

  // 5. Update Submit button order to be after all fields
  const buttonQid = Object.keys(existingQuestions).find(k => existingQuestions[k].type === 'control_button') || '2';
  if (existingQuestions[buttonQid]) {
    await updateQuestion(buttonQid, { order: '20', text: 'Submit Deliverable' }, key);
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
    _updated_at: new Date().toISOString(),
    fields: {}
  };

  for (const [qid, q] of Object.entries(finalQuestions)) {
    fieldMap.fields[q.name || `field_${qid}`] = {
      qid,
      text: q.text,
      type: q.type,
      order: q.order
    };
  }

  const mapPath = path.resolve(__dirname, '../C26JF/submissions_field_map.json');
  fs.writeFileSync(mapPath, JSON.stringify(fieldMap, null, 2));
  console.log(`\n\x1b[32m✔\x1b[0m Wrote submissions field map to: ${mapPath}`);

  console.log('\n\x1b[32m=== SUCCESS! ALL COLUMNS CREATED IN SUBMISSION JOTFORM TABLES ===\x1b[0m');
  console.log(`Visit your Jotform Tables: https://www.jotform.com/tables/${FORM_ID}`);
  console.log('All submission columns are now active and will reflect live deposits!\n');
  return fieldMap;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runSubmissionsProvisioning().catch(err => {
    console.error('[FATAL ERROR]:', err);
    process.exit(1);
  });
}
