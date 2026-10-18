/**
 * setup_all_jotform.js
 * --------------------
 * Runs full automated provisioning for BOTH new CelesteCon 2026 JotForm forms:
 *   1. Registration Form: 262905115844054
 *   2. Submission Form:   262904743897068
 *
 * Usage:
 *   node scripts/setup_all_jotform.js [API_KEY]
 * or
 *   $env:JOTFORM_API_KEY="your-api-key"; node scripts/setup_all_jotform.js
 */

import { runRegistrationProvisioning } from './setup_registration_jotform.js';
import { runSubmissionsProvisioning } from './setup_submissions_jotform.js';

const API_KEY = process.argv[2] || process.env.JOTFORM_API_KEY;

if (!API_KEY) {
  console.error('\x1b[31m[ERROR] JotForm API Key is required to provision forms.\x1b[0m');
  console.log('\nUsage:');
  console.log('  node scripts/setup_all_jotform.js <YOUR_JOTFORM_API_KEY>\n');
  console.log('Or set environment variable:');
  console.log('  $env:JOTFORM_API_KEY="your_api_key"; node scripts/setup_all_jotform.js\n');
  process.exit(1);
}

async function main() {
  console.log('\x1b[35m============================================================\x1b[0m');
  console.log('\x1b[35m  CELESTECON 2026 — JOTFORM AUTOMATED PROVISIONING SUITE    \x1b[0m');
  console.log('\x1b[35m============================================================\x1b[0m');

  try {
    console.log('\n[1/2] PROVISIONING REGISTRATION FORM...');
    const regMap = await runRegistrationProvisioning(API_KEY);

    console.log('\n[2/2] PROVISIONING DELIVERABLE SUBMISSION FORM...');
    const subMap = await runSubmissionsProvisioning(API_KEY);

    console.log('\n\x1b[32m============================================================\x1b[0m');
    console.log('\x1b[32m✔ SUCCESS! BOTH FORMS AND TABLES ARE FULLY PROVISIONED!      \x1b[0m');
    console.log('\x1b[32m============================================================\x1b[0m');
    console.log('\nRegistration Form Tables: https://www.jotform.com/tables/262905115844054');
    console.log('Submission Form Tables:   https://www.jotform.com/tables/262904743897068\n');
  } catch (err) {
    console.error('\n\x1b[31m[FAILED]:\x1b[0m', err.message);
    process.exit(1);
  }
}

main();
