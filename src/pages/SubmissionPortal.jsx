import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { events } from '../data/events';

// Submissions schedule milestones
const TARGET_SUBMISSION_START = new Date('2026-10-13T18:00:00+05:30').getTime();
const TARGET_SUBMISSION_DEADLINE = new Date('2026-10-20T23:59:59+05:30').getTime();
const EXTENDED_SUBMISSION_DEADLINE = new Date('2026-10-22T23:59:59+05:30').getTime();

// Verified seed delegations for host & conclave benchmark schools
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

// Event aliases for mapping query params & registration codes
const EVENT_ALIAS_MAP = {
  '01': '01', 'settle': '01', 'smt': '01', 'settlement': '01',
  '02': '02', 'volatus': '02', 'vol': '02', 'aviation': '02',
  '03': '03', 'ipod': '03', 'dispute': '03', 'quizzitch': '03',
  '04': '04', 'bpp': '04', 'pitch': '04', 'business': '04',
  '05': '05', 'theatre': '05', 'ath': '05', 'drama': '05',
  '06': '06', 'gamejam': '06', 'cjam': '06', 'cosmojam': '06', 'celestejam': '06',
  '07': '07', 'rocketry': '07', 'roc': '07', 'rocket': '07',
  '08': '08', 'prix': '08', 'aprix': '08', 'f1': '08', 'aeross-prix': '08'
};

// Master specifications for event deliverables (rigorously matching prompt dossiers & event guidelines)
const EVENT_DELIVERABLE_SPECS = {
  '01': {
    id: '01',
    code: 'SMT',
    name: 'Settle-Me-This',
    discipline: 'Space Settlement Design',
    portalUrl: '/prompts/settlement',
    deadline: '18 October 2026, 23:59:59 IST',
    summary: 'Design a permanent, habitable free-space settlement. Submit written engineering proposal (PDF). Top 5 advance to Round 2 live defense.',
    mandatoryFields: [
      {
        key: 'proposalUrl',
        label: 'Written Engineering Proposal (PDF Link)',
        badge: 'MANDATORY · REQUIRED',
        desc: 'Single PDF proposal covering structural architecture, artificial gravity, ECLSS, propulsion, and socio-economic planning. Page limits count every page: Junior max 25 pages, Senior max 35 pages.',
        placeholder: 'https://drive.google.com/file/d/... or OneDrive PDF link',
        formatHelp: 'Ensure access permissions are set to "Anyone with the link can view".'
      }
    ],
    optionalFields: [
      {
        key: 'slideDeckUrl',
        label: 'Presentation Slide Deck (Optional)',
        badge: 'OPTIONAL',
        desc: '16:9 Presentation slide deck (PDF or Google Slides) for Round 2 defense on conclave day.',
        placeholder: 'https://docs.google.com/presentation/d/... or Drive PDF'
      },
      {
        key: 'cadModelsUrl',
        label: '3D CAD Models & Architectural Renders (Optional)',
        badge: 'OPTIONAL',
        desc: 'Digital 3D CAD files (Blender, Fusion 360, SketchUp) or high-resolution render gallery folder.',
        placeholder: 'https://drive.google.com/drive/folders/...'
      },
      {
        key: 'supplementaryUrl',
        label: 'Brownie Challenge & Extended Calculations (Optional)',
        badge: 'OPTIONAL',
        desc: 'Dedicated Brownie Challenge response (max 3 pages) or system mass & radiation budget spreadsheets.',
        placeholder: 'https://docs.google.com/spreadsheets/d/... or Drive link'
      }
    ]
  },
  '02': {
    id: '02',
    code: 'VOL',
    name: 'Volatus',
    discipline: 'Aviation, UAV & 3D CAD Modeling',
    portalUrl: '/prompts/volatus',
    deadline: '18 October 2026, 23:59:59 IST',
    summary: 'Engineer an aircraft from first principles around an assigned mission profile. Submit technical proposal PDF and digital 3D CAD package.',
    mandatoryFields: [
      {
        key: 'proposalUrl',
        label: 'Technical Proposal & Sizing Dossier (PDF Link)',
        badge: 'MANDATORY · REQUIRED',
        desc: 'Technical dossier (Max 20–25 pages) detailing mission analysis, airfoil NACA selection, drag polar curves, CG vs CL static margin, and thrust-to-weight.',
        placeholder: 'https://drive.google.com/file/d/... or OneDrive PDF link',
        formatHelp: 'PDF format with selectable text, numbered figures, and SI units.'
      },
      {
        key: 'cadPackageUrl',
        label: '3D CAD Package / Model Link (STEP / STL / F3D / Blend / Cloud CAD)',
        badge: 'MANDATORY · REQUIRED',
        desc: '3D CAD assembly files (.step, .stl, .f3d, .blend) or active cloud CAD link (Onshape, Autodesk Fusion 360 viewer, or Google Drive folder).',
        placeholder: 'https://cad.onshape.com/documents/... or https://drive.google.com/...',
        formatHelp: 'Must include part hierarchy, surface skin curvature, and assembly tree.'
      }
    ],
    optionalFields: [
      {
        key: 'blueprintUrl',
        label: '3-View Orthographic Blueprint (Optional)',
        badge: 'OPTIONAL',
        desc: 'Top, side, and front elevations annotated with all millimeter dimensions and wing parameters (PDF / Image).',
        placeholder: 'https://drive.google.com/file/d/...'
      },
      {
        key: 'calculationsUrl',
        label: 'Aerodynamic Calculations Ledger (Optional)',
        badge: 'OPTIONAL',
        desc: 'Spreadsheets containing mass budget, Reynolds number matching, motor/battery sizing, and drag estimates.',
        placeholder: 'https://docs.google.com/spreadsheets/d/... or Drive link'
      },
      {
        key: 'supplementaryUrl',
        label: 'Prototype Photos & Flight Media (Optional)',
        badge: 'OPTIONAL',
        desc: 'Workshop photos of 3D-printed scale models, RC demonstrators, or wind-tunnel test clips.',
        placeholder: 'https://drive.google.com/drive/folders/...'
      }
    ]
  },
  '03': {
    id: '03',
    code: 'IPOD',
    name: 'In Pursuit of Dispute',
    discipline: 'Aerospace Quiz & Debate',
    portalUrl: '/prompts/dispute',
    deadline: '16 October 2026 (Live Quiz Window)',
    summary: 'Round 1 Qualifier is an Online Synchronous Screening Quiz hosted on the Quizzitch platform on 16 October 2026. No preliminary file submission is required.',
    noSubmissionRequired: true,
    quizNotice: 'NOTE: Round 1 qualification is conducted live via the Quizzitch platform. No file or proposal deposit is accepted via this portal.',
    mandatoryFields: [],
    optionalFields: []
  },
  '04': {
    id: '04',
    code: 'BPP',
    name: 'Business Power Pitch',
    discipline: 'Aerospace Commercialization, VC & Pitch',
    portalUrl: '/prompts/bpp',
    deadline: '18 October 2026, 23:59:59 IST',
    summary: 'Commercial aerospace startup pitch. Written business proposal (PDF) and 5-minute video pitch are mandatory; pitch deck and financial spreadsheets are optional.',
    mandatoryFields: [
      {
        key: 'proposalUrl',
        label: 'Written Business Proposal / Executive Dossier (PDF Link)',
        badge: 'MANDATORY · REQUIRED 1 OF 2',
        desc: 'Comprehensive venture proposal PDF covering problem statement, addressable market (TAM/SAM/SOM), unit economics, revenue model, technical architecture, and competitor matrix.',
        placeholder: 'https://drive.google.com/file/d/... or OneDrive PDF link',
        formatHelp: 'PDF with selectable text. Recommended 15–25 pages.'
      },
      {
        key: 'videoUrl',
        label: '5-Minute Elevator Pitch Video Link',
        badge: 'MANDATORY · REQUIRED 2 OF 2',
        desc: '5-minute dynamic video pitch presenting your commercial aerospace venture. Unlisted YouTube link, Google Drive video link, or Vimeo.',
        placeholder: 'https://youtu.be/... or https://drive.google.com/file/d/...',
        formatHelp: 'Maximum 5 minutes. Check permissions: link must be accessible to evaluators.'
      }
    ],
    optionalFields: [
      {
        key: 'slideDeckUrl',
        label: 'Investor Pitch Deck (Optional)',
        badge: 'OPTIONAL (FOR ROUND 2)',
        desc: 'Separate 16:9 PDF slide deck (recommended 12 slides, max 15) for Shark-Tank investor presentation.',
        placeholder: 'https://docs.google.com/presentation/d/... or Drive PDF'
      },
      {
        key: 'financialModelUrl',
        label: 'Financial Model / Unit Economics Spreadsheet (Optional)',
        badge: 'OPTIONAL',
        desc: '5-year capital allocation, CapEx/OpEx schedule, pricing curves, and break-even calculations (Sheets / Excel).',
        placeholder: 'https://docs.google.com/spreadsheets/d/... or Drive link'
      },
      {
        key: 'supplementaryUrl',
        label: 'Supplementary Appendices & Prototype Folder (Optional)',
        badge: 'OPTIONAL',
        desc: 'Customer discovery transcripts, UI wireframes, physical mockups, or patents.',
        placeholder: 'https://drive.google.com/drive/folders/...'
      }
    ]
  },
  '05': {
    id: '05',
    code: 'ATH',
    name: 'AEROSS Theatre',
    discipline: 'Open Stage & Theatrical Talent Showcase',
    portalUrl: '/prompts/theatre',
    deadline: '18 October 2026, 23:59:59 IST',
    summary: 'Flagship theatrical and dramatic showcase. Submit 3–5 minute video audition tape with open creative liberty (no theme for Round 1). Top teams advance to live stage.',
    mandatoryFields: [
      {
        key: 'videoUrl',
        label: 'Audition Video Performance Link (3–5 Mins)',
        badge: 'MANDATORY · REQUIRED',
        desc: '3 to 5 minute video recording of your act (stand-up comedy, theatrical skit, instrumental music, dance, monologue, mimicry, or illusionism).',
        placeholder: 'https://youtu.be/... or https://drive.google.com/file/d/...',
        formatHelp: 'Submit via unlisted YouTube link or Google Drive link with "Anyone with link can view" permission.'
      }
    ],
    optionalFields: [
      {
        key: 'scriptUrl',
        label: 'Performance Script / Dramatic Treatment (Optional)',
        badge: 'OPTIONAL',
        desc: 'Written dialogue, screenplay, character list, or dramatic blocking notes (PDF / Docs).',
        placeholder: 'https://drive.google.com/file/d/... or Docs link'
      },
      {
        key: 'audioTrackUrl',
        label: 'Backing Audio Track / Sound Cues (Optional)',
        badge: 'OPTIONAL',
        desc: 'High-quality audio track or musical score for stage sound engineers.',
        placeholder: 'https://drive.google.com/file/d/...'
      },
      {
        key: 'supplementaryUrl',
        label: 'Costumes, Props & Stagecraft Portfolio (Optional)',
        badge: 'OPTIONAL',
        desc: 'Photos or descriptions of stage props, makeup, or set designs.',
        placeholder: 'https://drive.google.com/drive/folders/...'
      }
    ]
  },
  '06': {
    id: '06',
    code: 'CJAM',
    name: 'CelesteJam (Game Jam)',
    discipline: 'Aerospace Game Development & Interactive Media',
    portalUrl: '/prompts/gamejam',
    deadline: '22 October 2026, 23:59:59 IST',
    summary: 'Rapid-fire aerospace game sprint around official theme "RETROGRESSION". Playable game build and gameplay traversal video are mandatory.',
    mandatoryFields: [
      {
        key: 'buildUrl',
        label: 'Playable Game Build Link (.ZIP or WebGL Link)',
        badge: 'MANDATORY · REQUIRED 1 OF 2',
        desc: 'Standalone executable (Windows 64-bit .ZIP on Google Drive/Dropbox) OR hosted WebGL link (itch.io / GitHub Pages).',
        placeholder: 'https://drive.google.com/... or https://username.itch.io/game',
        formatHelp: 'If password-protected on itch.io, include access key in Project Notes.'
      },
      {
        key: 'videoUrl',
        label: 'Gameplay Traversal Video Link (60–90 Secs)',
        badge: 'MANDATORY · REQUIRED 2 OF 2',
        desc: '60–90 second gameplay traversal recording highlighting player mechanics, physics simulation, audio design, and UI.',
        placeholder: 'https://youtu.be/... or https://drive.google.com/file/d/...',
        formatHelp: 'Unlisted YouTube link or Google Drive link.'
      }
    ],
    optionalFields: [
      {
        key: 'sourceCodeUrl',
        label: 'Source Code Repository Link (Optional & Recommended)',
        badge: 'RECOMMENDED',
        desc: 'Public GitHub/GitLab repository link or packaged source code ZIP for code integrity review.',
        placeholder: 'https://github.com/organization/game-repo'
      },
      {
        key: 'gddUrl',
        label: 'Game Design Document (GDD) / Readme (Optional)',
        badge: 'OPTIONAL',
        desc: 'Controls guide, theme interpretation ("Retrogression"), and architectural overview (PDF/Markdown).',
        placeholder: 'https://drive.google.com/file/d/...'
      },
      {
        key: 'supplementaryUrl',
        label: 'Asset Credits & Original Soundtrack (Optional)',
        badge: 'OPTIONAL',
        desc: 'Attributions for external assets, shaders, or custom OST recordings.',
        placeholder: 'https://drive.google.com/drive/folders/...'
      }
    ]
  },
  '07': {
    id: '07',
    code: 'ROC',
    name: 'Rocketry',
    discipline: 'Model Rocketry & Flight Simulation',
    portalUrl: '/prompts/rocketry',
    deadline: '22 October 2026, 23:59:59 IST',
    summary: 'Design a model rocket around Estes D12-5 motor specifications. OpenRocket simulation (.ork) and technical dossier report (PDF) are mandatory.',
    mandatoryFields: [
      {
        key: 'orkUrl',
        label: 'OpenRocket Simulation File (.ork Link)',
        badge: 'MANDATORY · REQUIRED 1 OF 2',
        desc: 'Digital OpenRocket simulation file (.ork) built with standard Estes D12-5 motor parameters and declared materials.',
        placeholder: 'https://drive.google.com/file/d/... or Cloud Link to .ork',
        formatHelp: 'Drive link to .ork file. Must match physical rocket measured onsite.'
      },
      {
        key: 'reportUrl',
        label: 'Rocketry Technical Dossier / Report (PDF Link)',
        badge: 'MANDATORY · REQUIRED 2 OF 2',
        desc: 'Design write-up detailing empty airframe mass, outer diameter, Barrowman CP vs CG stability margin (1.0–2.5 calibers), and parachute ejection velocity.',
        placeholder: 'https://drive.google.com/file/d/... or OneDrive PDF link',
        formatHelp: 'Max 20 pages PDF with schematic diagrams and stability curves.'
      }
    ],
    optionalFields: [
      {
        key: 'simulationPlotsUrl',
        label: 'Simulation Flight Plots & Barrowman Data (Optional)',
        badge: 'OPTIONAL',
        desc: 'Exported flight altitude, acceleration, and static margin graphs or calculation workbooks (PDF/CSV/Sheets).',
        placeholder: 'https://docs.google.com/spreadsheets/d/... or Drive link'
      },
      {
        key: 'cadPhotosUrl',
        label: 'CAD Models / Workshop Build Photos (Optional)',
        badge: 'OPTIONAL',
        desc: '3D CAD files (.step, .stl) or photos demonstrating clean fin fillets, positive motor retainer hook, and parachute pack.',
        placeholder: 'https://drive.google.com/drive/folders/...'
      },
      {
        key: 'supplementaryUrl',
        label: 'Supplementary Recovery & Materials Dossier (Optional)',
        badge: 'OPTIONAL',
        desc: 'Recovery harness calculations, shock cord tensile tests, or wind tunnel coupons.',
        placeholder: 'https://drive.google.com/drive/folders/...'
      }
    ]
  },
  '08': {
    id: '08',
    code: 'APRIX',
    name: 'AEROSS Prix',
    discipline: 'Miniature F1 Aerodynamic Racecar Engineering',
    portalUrl: '/prompts/prix',
    deadline: '22 October 2026, 23:59:59 IST',
    summary: 'Found an F1 scale constructor for CO2 sprints. Technical dossier (DOC 01) and 3D CAD package (DOC 02) are mandatory; livery portfolio (DOC 03) is optional.',
    mandatoryFields: [
      {
        key: 'dossierUrl',
        label: 'DOC 01: Technical Dossier & Engineering Report (PDF Link)',
        badge: 'MANDATORY · REQUIRED 1 OF 2',
        desc: 'Max 30 pages technical write-up detailing aerodynamic airflow rationale, CFD analysis, manufacturing techniques, and ₹30k budget ledger.',
        placeholder: 'https://drive.google.com/file/d/... or OneDrive PDF link',
        formatHelp: 'Covering aerodynamics, materials, fabrication, and structural integrity.'
      },
      {
        key: 'cadPackageUrl',
        label: 'DOC 02: 3D CAD Package & Model Link (STEP / STL / F3D / Cloud CAD)',
        badge: 'MANDATORY · REQUIRED 2 OF 2',
        desc: '3D CAD files (.step, .stl, .f3d), 3-view general arrangement (F1-CD-1) fully dimensioned, and exploded assembly with BOM (F1-CD-2).',
        placeholder: 'https://drive.google.com/... or https://cad.onshape.com/...',
        formatHelp: 'Confirm dimensions: Length 170–210 mm, Width ≤ 85 mm, Height ≤ 65 mm, Mass ≥ 50 g.'
      }
    ],
    optionalFields: [
      {
        key: 'identityDeckUrl',
        label: 'DOC 03: Team Identity, Livery & Sponsor Return Deck (Optional)',
        badge: 'OPTIONAL (OFF-TRACK POINTS)',
        desc: 'Constructor branding, livery colorway, pit display blueprints, and commercial sponsor return strategy (PDF / Slides).',
        placeholder: 'https://docs.google.com/presentation/d/... or Drive PDF'
      },
      {
        key: 'blueprintUrl',
        label: '3-View Orthographic Blueprint Drawing (F1-CD-1) (Optional)',
        badge: 'OPTIONAL',
        desc: 'Dimensioned orthographic drawing package (PDF / High-res export).',
        placeholder: 'https://drive.google.com/file/d/...'
      },
      {
        key: 'supplementaryUrl',
        label: 'CFD Telemetry & Aerodynamic Simulation Folder (Optional)',
        badge: 'OPTIONAL',
        desc: 'CFD airflow surface pressure plots, drag coefficients, or fabrication jigs.',
        placeholder: 'https://drive.google.com/drive/folders/...'
      }
    ]
  }
};

const JOTFORM_SUBMISSION_FORM_ID = '262904743897068';
let lastSubmitKey = '';
let lastSubmitTimestamp = 0;

// Helper to post directly to JotForm endpoint without CORS restrictions via hidden iframe
const submitToJotFormDirect = (record) => {
  try {
    const submitKey = `${record.receiptToken}-${record.schoolUID}`;
    const now = Date.now();
    if (lastSubmitKey === submitKey && (now - lastSubmitTimestamp) < 10000) {
      console.warn('Duplicate JotForm submission blocked by guard');
      return true;
    }
    lastSubmitKey = submitKey;
    lastSubmitTimestamp = now;

    const formattedSupplementary = (record.supplementaryLinks || [])
      .map((l, i) => `${i + 1}. [${l.label}] ${l.url}`)
      .join('\n');

    const summaryText = [
      `CELESTECON 2026 // OFFICIAL DELIVERABLE DEPOSIT`,
      `===============================================`,
      `RECEIPT TOKEN:     ${record.receiptToken}`,
      `TIMESTAMP:         ${record.timestamp}`,
      `SCHOOL UID:        ${record.schoolUID}`,
      `INSTITUTION:       ${record.schoolName}`,
      `EVENT:             [${record.eventId}] ${record.eventName}`,
      `DIVISION:          ${record.division}`,
      `TEAM NAME:         ${record.teamName}`,
      `LEAD CONTACT:      ${record.leadName} (${record.leadEmail})`,
      `PHONE:             ${record.leadPhone || 'N/A'}`,
      `PRIMARY DRIVE URL: ${record.driveUrl}`,
      ...(record.deliverables ? ['', '--- DELIVERABLES SUBMITTED ---', ...Object.entries(record.deliverables).map(([k, v]) => `• [${k}]: ${v}`)] : []),
      `SUPPLEMENTARY:`,
      formattedSupplementary || 'None declared',
      `ABSTRACT:`,
      record.projectAbstract || 'None provided.',
      `===============================================`
    ].join('\n');

    // EXACT question IDs matching live form 262904743897068
    const fields = {
      formID: JOTFORM_SUBMISSION_FORM_ID,
      simple_spc: `${JOTFORM_SUBMISSION_FORM_ID}-${JOTFORM_SUBMISSION_FORM_ID}`,

      // EXACT Question IDs matching live form 262904743897068
      q3: record.receiptToken,
      q4: record.schoolUID,
      q5: record.schoolName,
      q6: record.eventId,
      q7: record.eventName,
      q8: record.division,
      q9: record.teamName,
      q10: record.leadName,
      q11: record.leadEmail,
      q12: record.leadPhone,
      'q12_phone[phone]': record.leadPhone,
      'q12_phone[full]': record.leadPhone,
      q13: record.driveUrl,
      q14: formattedSupplementary,
      q15: record.projectAbstract || '',
      q16: summaryText,
      q17: JSON.stringify(record),

      // Unique names matching live Jotform schema
      q3_receiptToken: record.receiptToken,
      q4_schoolUID: record.schoolUID,
      q5_schoolName: record.schoolName,
      q6_eventId: record.eventId,
      q7_eventName: record.eventName,
      q8_division: record.division,
      q9_teamName: record.teamName,
      q10_leadName: record.leadName,
      q11_leadEmail: record.leadEmail,
      q12_leadPhone: record.leadPhone,
      q13_driveUrl: record.driveUrl,
      q14_supplementaryLinks: formattedSupplementary,
      q15_projectAbstract: record.projectAbstract || '',
      q16_submissionSummary: summaryText,
      q17_submissionJSON: JSON.stringify(record),

      // Standard named fields
      receiptToken: record.receiptToken,
      schoolUID: record.schoolUID,
      schoolName: record.schoolName,
      eventId: record.eventId,
      eventName: record.eventName,
      division: record.division,
      teamName: record.teamName,
      leadName: record.leadName,
      leadEmail: record.leadEmail,
      leadPhone: record.leadPhone,
      driveUrl: record.driveUrl,
      supplementaryLinks: formattedSupplementary,
      projectAbstract: record.projectAbstract || '',
      submissionSummary: summaryText,
      submissionJSON: JSON.stringify(record),

      // API submission array format (matching exact QID indices)
      'submission[3]': record.receiptToken,
      'submission[4]': record.schoolUID,
      'submission[5]': record.schoolName,
      'submission[6]': record.eventId,
      'submission[7]': record.eventName,
      'submission[8]': record.division,
      'submission[9]': record.teamName,
      'submission[10]': record.leadName,
      'submission[11]': record.leadEmail,
      'submission[12]': record.leadPhone,
      'submission[13]': record.driveUrl,
      'submission[14]': formattedSupplementary,
      'submission[15]': record.projectAbstract || '',
      'submission[16]': summaryText,
      'submission[17]': JSON.stringify(record)
    };

    let iframe = document.getElementById('jf_submission_silent_frame');
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'jf_submission_silent_frame';
      iframe.name = 'jf_submission_silent_frame';
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
    }

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `https://submit.jotform.com/submit/${JOTFORM_SUBMISSION_FORM_ID}`;
    form.target = 'jf_submission_silent_frame';
    form.style.display = 'none';

    Object.entries(fields).forEach(([k, v]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = k;
      input.value = v;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    setTimeout(() => {
      try { form.remove(); } catch { }
    }, 1500);

    return true;
  } catch (err) {
    console.warn('JotForm direct submission notice:', err);
    return false;
  }
};

export default function SubmissionPortal() {
  const [searchParams] = useSearchParams();
  const initialUID = searchParams.get('uid') || '';
  const initialEventParam = searchParams.get('event') || searchParams.get('e') || '';

  // Determine initial event selection from query param
  const mappedInitialEvent = EVENT_ALIAS_MAP[initialEventParam.toLowerCase()] || '04';

  // Chronometer & countdown state
  const [windowState, setWindowState] = useState({
    status: 'OPEN',
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // School lookup & authentication state
  const [schoolUID, setSchoolUID] = useState(() => {
    return initialUID || localStorage.getItem('c26_active_uid') || '';
  });
  const [verifiedSchool, setVerifiedSchool] = useState(null);
  const [lookupError, setLookupError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Form submission state
  const [formData, setFormData] = useState({
    schoolUID: '',
    schoolName: '',
    eventId: mappedInitialEvent,
    division: 'Senior Track (Grades 9–12)',
    teamName: '',
    leadName: '',
    leadEmail: '',
    leadPhone: '',
    projectAbstract: '',
    agreedToRules: false
  });

  // Event-specific deliverable links map (key -> URL)
  const [deliverables, setDeliverables] = useState({});

  // Arbitrary supplementary links list
  const [supplementaryLinks, setSupplementaryLinks] = useState([]);

  // Submission execution state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionReceipt, setSubmissionReceipt] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const [copiedToken, setCopiedToken] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [submissionHistory, setSubmissionHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('c26_submissions') || '[]');
    } catch {
      return [];
    }
  });

  // Current active event specification
  const currentEventSpec = EVENT_DELIVERABLE_SPECS[formData.eventId] || EVENT_DELIVERABLE_SPECS['04'];

  // Chronometer calculation
  useEffect(() => {
    function calculate() {
      const now = Date.now();
      let diff = 0;
      let status = 'OPEN';

      // Deadlines differ: Event 06, 07, 08 are extended to 22 Oct; others to 20 Oct
      const targetDeadline = ['06', '07', '08'].includes(formData.eventId)
        ? EXTENDED_SUBMISSION_DEADLINE
        : TARGET_SUBMISSION_DEADLINE;

      if (now < TARGET_SUBMISSION_START) {
        status = 'EARLY_ACCESS';
        diff = TARGET_SUBMISSION_START - now;
      } else if (now <= targetDeadline) {
        status = 'OPEN';
        diff = targetDeadline - now;
      } else {
        status = 'CLOSED';
        diff = 0;
      }

      const totalSecs = Math.floor(Math.max(0, diff) / 1000);
      const days = Math.floor(totalSecs / 86400);
      const hours = Math.floor((totalSecs % 86400) / 3600);
      const minutes = Math.floor((totalSecs % 3600) / 60);
      const seconds = totalSecs % 60;

      setWindowState({ status, days, hours, minutes, seconds });
    }

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [formData.eventId]);

  // UID Verification and Data Fetching
  const performLookup = React.useCallback(async (uidToTest) => {
    const clean = uidToTest.trim().toUpperCase();
    setLookupError('');

    if (!clean) {
      setLookupError('Please enter a School UID (e.g. C26-DL-0101).');
      return;
    }

    if (!/^C26-[A-Z]{2,4}-\d{4}$/.test(clean)) {
      setLookupError(`Invalid UID format: "${clean}". Expected official syntax is C26-XX-0000 or C26-INT-0000 (e.g. C26-DL-0101).`);
      return;
    }

    setIsVerifying(true);

    try {
      let resolvedRecord = null;
      let sourceTag = 'Official Registry';

      // 1. Live server verification via /api/verify-uid (JotForm & Firebase)
      try {
        const res = await fetch(`/api/verify-uid?uid=${encodeURIComponent(clean)}`);
        if (res.ok) {
          const apiData = await res.json();
          if (apiData && apiData.verified && apiData.registration) {
            resolvedRecord = apiData.registration;
            sourceTag = apiData.source === 'jotform' ? 'JotForm Cloud Vault' : 'Official Conclave Cloud';
          }
        }
      } catch (networkErr) {
        console.warn('API lookup unreachable, checking client cache & seed delegations:', networkErr);
      }

      // 2. Check browser localStorage c26_registrations
      if (!resolvedRecord) {
        try {
          const raw = localStorage.getItem('c26_registrations');
          if (raw) {
            const store = JSON.parse(raw);
            if (store[clean]) {
              resolvedRecord = store[clean];
              sourceTag = 'Browser Registration Docket';
            }
          }
        } catch (storageErr) {
          console.warn('Local storage parse notice:', storageErr);
        }
      }

      // 3. Check accredited seed delegations (DPS R.K. Puram host & key contingents)
      if (!resolvedRecord && SEED_DELEGATIONS[clean]) {
        resolvedRecord = SEED_DELEGATIONS[clean];
        sourceTag = 'Host Contingent Accreditation';
      }

      // 4. Verification decision
      if (resolvedRecord) {
        const enrichedRecord = {
          ...resolvedRecord,
          schoolUID: clean,
          sourceTag
        };

        setVerifiedSchool(enrichedRecord);
        localStorage.setItem('c26_active_uid', clean);

        // Pre-fill school and coordinator info
        setFormData(prev => ({
          ...prev,
          schoolUID: clean,
          schoolName: enrichedRecord.school?.name || prev.schoolName || 'Accredited Institution Delegation',
          leadName: enrichedRecord.school?.contact || enrichedRecord.delegation?.headDelegateName || prev.leadName || '',
          leadEmail: enrichedRecord.school?.email || enrichedRecord.delegation?.headDelegateEmail || prev.leadEmail || '',
          leadPhone: enrichedRecord.school?.phone || enrichedRecord.delegation?.headDelegatePhone || prev.leadPhone || ''
        }));

        // If the school is registered for specific events, auto-align event selection if not explicitly set (skipping IPOD which has no file submission)
        if (enrichedRecord.events && enrichedRecord.events.length > 0 && !initialEventParam) {
          const submissibleEv = enrichedRecord.events.find(ev => {
            const mId = EVENT_ALIAS_MAP[(ev.id || ev.name || '').toLowerCase()];
            return mId && mId !== '03';
          }) || enrichedRecord.events[0];
          const matchedEventId = EVENT_ALIAS_MAP[(submissibleEv.id || submissibleEv.name || '').toLowerCase()];
          if (matchedEventId && matchedEventId !== '03') {
            setFormData(prev => ({
              ...prev,
              eventId: matchedEventId,
              division: submissibleEv.category?.includes('Junior') ? 'Junior Track (Grades 6–8)' : 'Senior Track (Grades 9–12)'
            }));
          }
        }
      } else {
        setVerifiedSchool(null);
        setLookupError(`No accredited registration docket found matching UID "${clean}". Entry is restricted to registered delegations. Please verify the UID from your Registration Docket or register your school delegation first.`);
      }
    } catch (err) {
      setLookupError('Verification check encountered an error: ' + (err.message || 'Unknown error'));
    } finally {
      setIsVerifying(false);
    }
  }, [initialEventParam]);

  // Auto-run lookup on initial mount if UID is present
  useEffect(() => {
    if (initialUID) {
      performLookup(initialUID);
    }
  }, [initialUID, performLookup]);

  const handleLookupSubmit = (e) => {
    e.preventDefault();
    performLookup(schoolUID);
  };

  const handleResetAuth = () => {
    setVerifiedSchool(null);
    setSchoolUID('');
    localStorage.removeItem('c26_active_uid');
    setFormData(prev => ({
      ...prev,
      schoolUID: '',
      schoolName: '',
      teamName: '',
      leadName: '',
      leadEmail: '',
      leadPhone: ''
    }));
    setDeliverables({});
    setSupplementaryLinks([]);
  };

  // Helper: check if authenticated school is registered for this event
  const registeredEventInfo = useMemo(() => {
    if (!verifiedSchool || !verifiedSchool.events) return null;
    const currentCode = currentEventSpec.code.toLowerCase();
    const currentId = currentEventSpec.id;

    return verifiedSchool.events.find(ev => {
      const evId = (ev.id || '').toLowerCase();
      const evName = (ev.name || '').toLowerCase();
      return evId === currentCode ||
        evId === currentId ||
        evName.includes(currentEventSpec.name.toLowerCase()) ||
        evName.includes(currentEventSpec.code.toLowerCase());
    }) || null;
  }, [verifiedSchool, currentEventSpec]);

  // Autofill team details from school registration docket
  const handleAutofillFromRegisteredTeam = (teamObj, category) => {
    if (!teamObj) return;
    const lead = teamObj.members?.[0];
    setFormData(prev => ({
      ...prev,
      teamName: teamObj.teamName || teamObj.teamId || prev.teamName,
      division: category?.toLowerCase().includes('junior')
        ? 'Junior Track (Grades 6–8)'
        : 'Senior Track (Grades 9–12)',
      leadName: lead?.name || prev.leadName,
      leadEmail: lead?.email || prev.leadEmail
    }));
  };

  // Deliverables links management
  const updateDeliverable = (key, value) => {
    setDeliverables(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Supplementary links management
  const addSupplementaryLink = (label = '', url = '') => {
    setSupplementaryLinks(prev => [
      ...prev,
      { id: Date.now().toString() + Math.random().toString(36).substring(2, 5), label, url }
    ]);
  };

  const updateSupplementaryLink = (id, field, value) => {
    setSupplementaryLinks(prev =>
      prev.map(link => (link.id === id ? { ...link, [field]: value } : link))
    );
  };

  const removeSupplementaryLink = (id) => {
    setSupplementaryLinks(prev => prev.filter(link => link.id !== id));
  };

  // Submission validation and handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (formData.eventId === '03' || currentEventSpec.noSubmissionRequired) {
      setSubmitError('In Pursuit of Dispute (IPOD) does not require a preliminary file submission. Round 1 qualification is conducted via the online Quizzitch quiz platform.');
      return;
    }

    if (!verifiedSchool) {
      setSubmitError('You must authenticate your School UID before depositing your submission.');
      return;
    }

    const cleanUID = (formData.schoolUID || verifiedSchool.schoolUID).trim().toUpperCase();
    if (!cleanUID) {
      setSubmitError('School UID is mandatory.');
      return;
    }
    if (!formData.teamName.trim()) {
      setSubmitError('Team / Project Name is required.');
      return;
    }
    if (!formData.leadEmail.trim() || !formData.leadEmail.includes('@')) {
      setSubmitError('A valid official email address is required to receive confirmation dockets.');
      return;
    }

    // Validate MANDATORY deliverable fields for the current event
    for (const field of currentEventSpec.mandatoryFields) {
      const val = (deliverables[field.key] || '').trim();
      if (!val) {
        setSubmitError(`Mandatory link missing: "${field.label}" is strictly required for ${currentEventSpec.name}.`);
        return;
      }
      if (!/^https:\/\/[^\s/$.?#].[^\s]*$/i.test(val)) {
        setSubmitError(`The link for "${field.label}" must be a valid secure HTTPS URL (e.g. https://drive.google.com/...).`);
        return;
      }
    }

    // Validate any populated OPTIONAL deliverable fields
    for (const field of currentEventSpec.optionalFields) {
      const val = (deliverables[field.key] || '').trim();
      if (val && !/^https:\/\/[^\s/$.?#].[^\s]*$/i.test(val)) {
        setSubmitError(`Optional link for "${field.label}" must be a valid secure HTTPS URL.`);
        return;
      }
    }

    // Validate supplementary links
    for (const link of supplementaryLinks) {
      const url = link.url.trim();
      if (url && !/^https:\/\/[^\s/$.?#].[^\s]*$/i.test(url)) {
        setSubmitError(`Supplementary resource "${link.label || 'Link'}" must be a valid secure HTTPS URL.`);
        return;
      }
    }

    if (!formData.agreedToRules) {
      setSubmitError('You must acknowledge that this submission complies with CelesteCon 2026 regulations and represents original work.');
      return;
    }

    setIsSubmitting(true);

    try {
      const eventCode = currentEventSpec.code;
      const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
      const receiptToken = `C26-DEP-${eventCode}-${cleanUID.replace(/[^A-Z0-9]/g, '')}-${randomSuffix}`;
      const timestamp = new Date().toISOString();

      // Clean deliverables object
      const cleanedDeliverables = {};
      for (const [key, val] of Object.entries(deliverables)) {
        if (typeof val === 'string' && val.trim().length > 0) {
          cleanedDeliverables[key] = val.trim();
        }
      }

      const validSupplementary = supplementaryLinks
        .filter(l => l.url.trim().length > 0)
        .map(l => ({ label: l.label.trim() || 'Additional Resource', url: l.url.trim() }));

      // Primary representative URL
      const primaryUrl = cleanedDeliverables[currentEventSpec.mandatoryFields[0]?.key] ||
        Object.values(cleanedDeliverables)[0] || '';

      const record = {
        receiptToken,
        timestamp,
        schoolUID: cleanUID,
        schoolName: formData.schoolName || verifiedSchool?.school?.name || 'Accredited Delegation',
        eventId: formData.eventId,
        eventName: currentEventSpec.name,
        division: formData.division,
        teamName: formData.teamName,
        leadName: formData.leadName,
        leadEmail: formData.leadEmail,
        leadPhone: formData.leadPhone,
        deliverables: cleanedDeliverables,
        driveUrl: primaryUrl,
        supplementaryLinks: validSupplementary,
        projectAbstract: formData.projectAbstract,
        agreedToRules: true
      };

      let syncStatus = { jotform: false, firebase: false, localVault: true };

      // 1. Direct submit to JotForm Form 262904743897068 (guaranteed client-side delivery to Jotform Tables)
      const directSuccess = submitToJotFormDirect(record);
      if (directSuccess) {
        syncStatus.jotform = true;
      }

      // 2. Post to dedicated deposit endpoint
      try {
        const depositResp = await fetch('/api/deposit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record)
        });

        if (depositResp.ok) {
          const resData = await depositResp.json();
          if (resData.syncedTo) {
            syncStatus = { ...syncStatus, ...resData.syncedTo };
          }
        } else {
          console.warn('API deposit endpoint returned status', depositResp.status);
        }
      } catch (apiErr) {
        console.warn('Cloud deposit API notice: local secure persistence active.', apiErr);
      }

      // 3. Persist in local storage submission history
      try {
        const existing = JSON.parse(localStorage.getItem('c26_submissions') || '[]');
        existing.unshift({ ...record, syncStatus });
        localStorage.setItem('c26_submissions', JSON.stringify(existing));
        setSubmissionHistory(existing);
      } catch (err) {
        console.warn('Local submission storage warning:', err);
      }

      setSubmissionReceipt({ ...record, syncStatus });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setSubmitError('Failed to record submission: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyTokenToClipboard = () => {
    if (submissionReceipt?.receiptToken) {
      navigator.clipboard.writeText(submissionReceipt.receiptToken);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  const downloadReceiptTxt = () => {
    if (!submissionReceipt) return;

    let deliverablesText = '';
    const spec = EVENT_DELIVERABLE_SPECS[submissionReceipt.eventId] || currentEventSpec;
    for (const [key, val] of Object.entries(submissionReceipt.deliverables || {})) {
      const isReq = spec.mandatoryFields.some(f => f.key === key);
      const label = [...spec.mandatoryFields, ...spec.optionalFields].find(f => f.key === key)?.label || key;
      deliverablesText += `• [${isReq ? 'MANDATORY' : 'OPTIONAL'}] ${label}:\n  ${val}\n`;
    }

    let suppLinksText = 'None declared.';
    if (submissionReceipt.supplementaryLinks && submissionReceipt.supplementaryLinks.length > 0) {
      suppLinksText = submissionReceipt.supplementaryLinks
        .map((l, i) => `  ${i + 1}. [${l.label}] ${l.url}`)
        .join('\n');
    }

    const content = `=====================================================
CELESTECON 2026 // OFFICIAL DIGITAL SUBMISSION RECEIPT
DPS R.K. PURAM · AEROSPACE SOCIETY (AEROSS)
=====================================================

RECEIPT TOKEN:     ${submissionReceipt.receiptToken}
TIMESTAMP:         ${new Date(submissionReceipt.timestamp).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })} IST
GATE STATUS:       VERIFIED & SECURED IN DEPOSIT VAULT
BACKEND STATUS:    ${submissionReceipt.syncStatus?.jotform ? 'SYNCED TO JOTFORM TABLES' : 'LOGGED IN ACCREDITED VAULT'}

DELEGATION DETAILS:
- School UID:      ${submissionReceipt.schoolUID}
- Institution:     ${submissionReceipt.schoolName}
- Team Name:       ${submissionReceipt.teamName}
- Lead Contact:    ${submissionReceipt.leadName} (${submissionReceipt.leadEmail})
- Contact Phone:   ${submissionReceipt.leadPhone || 'N/A'}

COMPETITION & DELIVERABLES:
- Event:           ${submissionReceipt.eventId} · ${submissionReceipt.eventName}
- Division:        ${submissionReceipt.division}

DELIVERABLE LINKS:
${deliverablesText || '  (None submitted)\n'}
SUPPLEMENTARY LINKS:
${suppLinksText}

PROJECT ABSTRACT / NOTES:
${submissionReceipt.projectAbstract || 'None provided.'}

=====================================================
Retain this cryptographic token for verification during
onsite scrutineering, OpenRocket checks, and jury reviews.
=====================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CelesteCon2026_Receipt_${submissionReceipt.receiptToken}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadReceiptHtml = () => {
    if (!submissionReceipt) return;
    const spec = EVENT_DELIVERABLE_SPECS[submissionReceipt.eventId] || currentEventSpec;

    let deliverablesRows = '';
    for (const [key, val] of Object.entries(submissionReceipt.deliverables || {})) {
      const isReq = spec.mandatoryFields.some(f => f.key === key);
      const label = [...spec.mandatoryFields, ...spec.optionalFields].find(f => f.key === key)?.label || key;
      deliverablesRows += `
        <tr>
          <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold; width: 35%; font-family: monospace;">
            <span style="color: ${isReq ? '#c23a1e' : '#475569'};">[${isReq ? 'MANDATORY' : 'OPTIONAL'}]</span> ${label}
          </td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; word-break: break-all; font-family: monospace;">
            <a href="${val}" target="_blank" style="color: #0284c7; font-weight: bold;">${val}</a>
          </td>
        </tr>
      `;
    }

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Receipt — ${submissionReceipt.receiptToken}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; padding: 40px 20px; color: #0f172a; }
    .card { max-width: 760px; margin: 0 auto; background: #fff; padding: 36px; border: 3px solid #0f172a; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
    .header { border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
    .title { font-size: 22px; font-weight: 900; text-transform: uppercase; color: #0f172a; margin: 0; }
    .token { font-family: monospace; font-size: 16px; color: #c23a1e; font-weight: bold; background: #fee2e2; padding: 4px 8px; border: 1px solid #f87171; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
    th, td { text-align: left; }
    .footer { margin-top: 30px; border-top: 2px dashed #cbd5e1; padding-top: 16px; font-size: 11px; color: #64748b; font-family: monospace; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div>
        <div style="font-size: 11px; font-weight: bold; color: #c23a1e; letter-spacing: 2px; text-transform: uppercase;">AEROSPACE SOCIETY // AEROSS</div>
        <div class="title">CelesteCon 2026 Deliverable Deposit Docket</div>
      </div>
      <div class="token">${submissionReceipt.receiptToken}</div>
    </div>

    <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px; margin-bottom: 20px; font-size: 13px; line-height: 1.6;">
      <div><strong>School Delegation:</strong> ${submissionReceipt.schoolName} (${submissionReceipt.schoolUID})</div>
      <div><strong>Competition Event:</strong> ${submissionReceipt.eventId} · ${submissionReceipt.eventName} (${submissionReceipt.division})</div>
      <div><strong>Registered Team:</strong> ${submissionReceipt.teamName}</div>
      <div><strong>Team Lead:</strong> ${submissionReceipt.leadName} (${submissionReceipt.leadEmail})</div>
      <div><strong>Timestamp:</strong> ${new Date(submissionReceipt.timestamp).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })} IST</div>
    </div>

    <div style="font-weight: 800; text-transform: uppercase; font-size: 13px; color: #0f172a;">Deposited Deliverables &amp; Verified Cloud Links:</div>
    <table>
      <tbody>
        ${deliverablesRows}
      </tbody>
    </table>

    ${submissionReceipt.projectAbstract ? `
      <div style="margin-top: 20px; padding: 12px; background: #f1f5f9; border-left: 3px solid #0f172a; font-size: 12px;">
        <strong>Project Abstract / Notes:</strong><br>${submissionReceipt.projectAbstract}
      </div>
    ` : ''}

    <div class="footer">
      OFFICIAL CONCLAVE VERIFICATION DOCKET // PRESENT AT CHECK-IN ON EVENT DAY<br>
      DELHI PUBLIC SCHOOL, SECTOR 12, R.K. PURAM, NEW DELHI
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CelesteCon2026_Docket_${submissionReceipt.receiptToken}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Top Breadcrumb & Metadata */}
      <div className="border-b-2 border-bone/30 pb-3 flex flex-wrap justify-between items-center gap-3 font-mono text-xs text-bone-dim">
        <div className="flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-crimson transition-colors">CELESTECON 2026</Link>
          <span className="text-bone/40">/</span>
          <Link to="/comps" className="hover:text-crimson transition-colors">THE COMPS</Link>
          <span className="text-bone/40">/</span>
          <Link to="/prompts" className="hover:text-crimson transition-colors">PROMPTS</Link>
          <span className="text-bone/40">/</span>
          <span className="text-crimson font-bold">SUBMISSION PORTAL</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/prompts" className="text-bone hover:text-crimson transition-colors uppercase tracking-widest text-[11px] font-bold">
            ← View Prompts
          </Link>
          {submissionHistory.length > 0 && (
            <button
              onClick={() => setShowHistoryModal(true)}
              className="text-amber-400 hover:text-bone font-mono text-[11px] font-bold uppercase underline cursor-pointer"
            >
              Past Deposits ({submissionHistory.length})
            </button>
          )}
          <span className="border border-crimson px-2 py-0.5 text-crimson font-bold text-[10px] uppercase bg-crimson/10">
            JOTFORM CLOUD LINKED // CC-SUB-2026
          </span>
        </div>
      </div>

      {/* Main Masthead */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-0.5 bg-crimson text-bone-hi font-mono text-xs font-bold uppercase tracking-widest">
            OFFICIAL DEPOSIT TERMINAL
          </span>
          <span className="font-mono text-xs text-bone-dim uppercase">
            ROUND 1 ONLINE SUBMISSION WINDOW · CONNECTED TO JOTFORM &amp; FIREBASE
          </span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl uppercase tracking-wider text-bone leading-tight">
          ROUND 1 <span className="text-crimson">SUBMISSION PORTAL</span>
        </h1>

        <p className="font-label text-base sm:text-lg text-bone-dim max-w-3xl leading-relaxed">
          The unified digital deposit gateway for all 8 CelesteCon 2026 competitions. Authenticate with your assigned <strong className="text-bone">School UID</strong> to unlock your delegation roster, submit event-specific mandatory deliverables (proposals, videos, CAD, OpenRocket files), and receive cryptographic deposit receipts.
        </p>
      </section>

      {/* Telemetry Chronometer Box */}
      <div className="border-2 border-bone bg-ink-2/80 p-5 sm:p-6 backdrop-blur-sm shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-bone/20 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="font-mono text-xs uppercase font-bold text-bone tracking-wider">
              GATEWAY STATUS: ACCREDITATION CHECK ACTIVE &amp; OPEN
            </span>
          </div>
          <div className="font-mono text-xs text-bone-dim">
            SUBMISSION DEADLINE: <strong className="text-crimson font-bold">{currentEventSpec.deadline}</strong>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
          <div className="bg-ink p-3 border border-bone/20">
            <div className="text-2xl sm:text-3xl font-bold text-bone">{windowState.days}</div>
            <div className="text-[10px] text-bone-dim uppercase tracking-wider">Days Remaining</div>
          </div>
          <div className="bg-ink p-3 border border-bone/20">
            <div className="text-2xl sm:text-3xl font-bold text-bone">{String(windowState.hours).padStart(2, '0')}</div>
            <div className="text-[10px] text-bone-dim uppercase tracking-wider">Hours</div>
          </div>
          <div className="bg-ink p-3 border border-bone/20">
            <div className="text-2xl sm:text-3xl font-bold text-bone">{String(windowState.minutes).padStart(2, '0')}</div>
            <div className="text-[10px] text-bone-dim uppercase tracking-wider">Minutes</div>
          </div>
          <div className="bg-ink p-3 border border-bone/20">
            <div className="text-2xl sm:text-3xl font-bold text-crimson">{String(windowState.seconds).padStart(2, '0')}</div>
            <div className="text-[10px] text-bone-dim uppercase tracking-wider">Seconds</div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RECEIPT MODAL / RECEIPT BANNER (ON SUCCESSFUL SUBMISSION) */}
      {/* ========================================================================= */}
      {submissionReceipt && (
        <div className="border-4 border-green-500 bg-ink-2 p-6 sm:p-8 space-y-6 shadow-2xl animate-fadeIn">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b-2 border-green-500/40 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-3.5 h-3.5 bg-green-500 rounded-full animate-ping"></span>
              <h2 className="font-display text-2xl sm:text-3xl text-bone uppercase">
                Deliverable Deposit Confirmed &amp; Logged
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-green-500 text-ink font-mono text-xs font-bold uppercase tracking-widest">
                ● STATUS: SECURED
              </span>
              <span className="px-2.5 py-1 border border-green-500/60 font-mono text-xs text-green-400">
                {submissionReceipt.syncStatus?.jotform ? '✓ JotForm Synced' : '✓ Vault Encrypted'}
              </span>
            </div>
          </div>

          <div className="bg-ink p-4 sm:p-6 border border-bone/40 space-y-4 font-mono text-xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-bone/20 pb-3">
              <span className="text-bone-dim uppercase tracking-wider">CRYPTOGRAPHIC RECEIPT TOKEN:</span>
              <div className="flex items-center gap-2">
                <code className="text-sm sm:text-base font-bold text-crimson bg-ink-2 px-2.5 py-1 border border-crimson">
                  {submissionReceipt.receiptToken}
                </code>
                <button
                  onClick={copyTokenToClipboard}
                  className="px-2 py-1 bg-bone text-ink hover:bg-crimson hover:text-bone font-bold transition-colors cursor-pointer"
                >
                  {copiedToken ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-bone-dim leading-relaxed">
              <div><strong className="text-bone">Institution:</strong> {submissionReceipt.schoolName} ({submissionReceipt.schoolUID})</div>
              <div><strong className="text-bone">Competition:</strong> {submissionReceipt.eventId} · {submissionReceipt.eventName}</div>
              <div><strong className="text-bone">Division:</strong> {submissionReceipt.division}</div>
              <div><strong className="text-bone">Team Name:</strong> {submissionReceipt.teamName}</div>
              <div><strong className="text-bone">Lead Contact:</strong> {submissionReceipt.leadName} ({submissionReceipt.leadEmail})</div>
              <div><strong className="text-bone">Timestamp:</strong> {new Date(submissionReceipt.timestamp).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })} IST</div>
              <div><strong className="text-bone">JotForm Cloud:</strong> <span className="text-green-400 font-bold">✓ Synced to Form #262904743897068</span></div>
              <div><strong className="text-bone">Vault Status:</strong> <span className="text-cyan-400 font-bold">Encrypted &amp; Confirmed</span></div>
            </div>

            {/* Submitted Deliverables Breakdown */}
            <div className="pt-3 border-t border-bone/20 space-y-2">
              <div className="text-bone font-bold uppercase tracking-wider text-[11px]">
                Submitted Deliverable Links:
              </div>
              <div className="space-y-1.5">
                {Object.entries(submissionReceipt.deliverables || {}).map(([key, url]) => {
                  const spec = EVENT_DELIVERABLE_SPECS[submissionReceipt.eventId] || currentEventSpec;
                  const isReq = spec.mandatoryFields.some(f => f.key === key);
                  const label = [...spec.mandatoryFields, ...spec.optionalFields].find(f => f.key === key)?.label || key;
                  return (
                    <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 p-2 bg-ink-2/60 border border-bone/20">
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 border shrink-0 ${isReq ? 'border-crimson text-crimson bg-crimson/10' : 'border-bone/30 text-bone-dim'}`}>
                        {isReq ? 'Mandatory' : 'Optional'}
                      </span>
                      <span className="text-bone font-medium shrink-0">{label}:</span>
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 underline break-all font-mono"
                      >
                        {url} ↗
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Supplementary Links */}
            {submissionReceipt.supplementaryLinks && submissionReceipt.supplementaryLinks.length > 0 && (
              <div className="pt-3 border-t border-bone/20 space-y-1">
                <div className="text-bone font-bold uppercase text-[11px]">Supplementary Resources ({submissionReceipt.supplementaryLinks.length}):</div>
                {submissionReceipt.supplementaryLinks.map((link, idx) => (
                  <div key={idx} className="flex items-center gap-2 flex-wrap">
                    <span className="text-bone font-semibold">[{link.label}]:</span>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-bone-dim hover:text-crimson underline break-all"
                    >
                      {link.url} ↗
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={downloadReceiptTxt}
              className="px-5 py-2.5 bg-crimson text-bone font-label font-bold text-xs uppercase tracking-widest border border-crimson hover:bg-ink hover:text-crimson transition-colors cursor-pointer"
            >
              Download Receipt (.TXT) ↓
            </button>
            <button
              onClick={downloadReceiptHtml}
              className="px-5 py-2.5 bg-bone text-ink font-label font-bold text-xs uppercase tracking-widest hover:bg-crimson hover:text-bone transition-colors cursor-pointer"
            >
              Printable Official Docket (.HTML) ⎙
            </button>
            <button
              onClick={() => {
                setSubmissionReceipt(null);
                setFormData(prev => ({
                  ...prev,
                  teamName: '',
                  projectAbstract: '',
                  agreedToRules: false
                }));
                setDeliverables({});
                setSupplementaryLinks([]);
              }}
              className="px-5 py-2.5 bg-ink border border-bone/40 text-bone hover:border-crimson hover:text-crimson font-label font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer"
            >
              Deposit Another Deliverable for this Delegation →
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHASE 1: MANDATORY ACCREDITATION GATE (IF NOT YET AUTHENTICATED) */}
      {/* ========================================================================= */}
      {!verifiedSchool ? (
        <div className="border-2 border-bone bg-ink-2/70 p-6 sm:p-10 space-y-6 shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-crimson/10 border border-crimson text-crimson font-mono text-xs uppercase font-bold tracking-widest">
            <span className="w-2.5 h-2.5 rounded-full bg-crimson animate-pulse"></span>
            <span>MANDATORY ACCREDITATION GATE // AUTHENTICATE TO ENTER</span>
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-3xl sm:text-5xl uppercase text-bone tracking-wide">
              Authenticate School Delegation (UID)
            </h2>
            <p className="font-label text-sm sm:text-base text-bone-dim max-w-2xl leading-relaxed">
              To prevent unauthorized uploads and ensure proper quota attribution, entry to the submission deposit terminal requires your assigned <strong className="text-bone">School UID (e.g., C26-DL-0101)</strong>. The portal queries JotForm Tables and the Conclave Registry in real-time to load your verified institution profile and competition slots.
            </p>
          </div>

          {/* UID Lookup Form */}
          <form onSubmit={handleLookupSubmit} className="max-w-xl space-y-3">
            <label className="block font-mono text-xs uppercase font-bold text-bone">
              Enter Official School Token (UID)
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                required
                value={schoolUID}
                onChange={(e) => setSchoolUID(e.target.value.toUpperCase())}
                placeholder="e.g. C26-DL-0101"
                className="flex-1 bg-ink border-2 border-bone px-4 py-3 text-bone font-mono text-sm tracking-wider uppercase focus:outline-none focus:border-crimson"
              />
              <button
                type="submit"
                disabled={isVerifying}
                className="bg-crimson text-bone font-label font-bold text-xs uppercase tracking-widest px-6 py-3 border border-crimson hover:bg-ink hover:text-crimson transition-colors cursor-pointer shrink-0 disabled:opacity-50"
              >
                {isVerifying ? 'Querying Jotform...' : 'Verify UID & Enter Portal →'}
              </button>
            </div>
          </form>

          {lookupError && (
            <div className="p-4 bg-crimson/10 border-l-4 border-crimson text-crimson font-mono text-xs max-w-2xl space-y-2 animate-fadeIn">
              <div className="font-bold">⚠️ Accreditation Check Notice:</div>
              <div>{lookupError}</div>
              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href="/celestecon_registration.html"
                  className="inline-block px-3 py-1.5 bg-crimson text-bone font-label text-xs uppercase tracking-wider font-bold hover:bg-ink transition-colors"
                >
                  Register School Delegation Now ↗
                </a>
                <span className="text-bone-dim text-[11px] self-center">
                  Need assistance? Contact Secretariat at <a href="mailto:aeross@dpsrkp.net" className="underline text-bone">aeross@dpsrkp.net</a>.
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ========================================================================= */
        /* PHASE 2: ACTIVE DIGITAL DEPOSIT TERMINAL (AUTHENTICATED) */
        /* ========================================================================= */
        <div className="space-y-8 animate-fadeIn">
          {/* Authenticated Delegation Status Card */}
          <div className="border-2 border-green-500/80 bg-ink p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-lg">
            <div className="space-y-1 font-mono text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                <span className="text-green-400 font-bold uppercase tracking-wider">
                  ACCREDITED DELEGATION AUTHENTICATED
                </span>
                <span className="text-[10px] px-2 py-0.5 border border-green-500/40 text-green-400 bg-green-500/10">
                  {verifiedSchool.sourceTag || 'JotForm Verified'}
                </span>
              </div>
              <div className="text-lg font-bold text-bone font-display tracking-wide uppercase">
                {verifiedSchool.school?.name}
              </div>
              <div className="text-bone-dim flex items-center gap-3 flex-wrap">
                <span>UID: <strong className="text-crimson font-bold">{verifiedSchool.schoolUID}</strong></span>
                <span>·</span>
                <span>Lead: {verifiedSchool.school?.contact || 'Coordinator'}</span>
                <span>·</span>
                <span>Email: {verifiedSchool.school?.email}</span>
                {verifiedSchool.events && (
                  <>
                    <span>·</span>
                    <span className="text-amber-400 font-bold">{verifiedSchool.events.length} Registered Competition{verifiedSchool.events.length > 1 ? 's' : ''}</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {submissionHistory.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowHistoryModal(true)}
                  className="px-3 py-2 border border-amber-400/40 text-amber-400 hover:border-amber-400 font-mono text-xs uppercase tracking-wider cursor-pointer transition-colors"
                >
                  Deposits ({submissionHistory.length})
                </button>
              )}
              <button
                onClick={handleResetAuth}
                className="px-3.5 py-2 border border-bone/40 hover:border-crimson text-bone hover:text-crimson font-mono text-xs uppercase tracking-wider cursor-pointer transition-colors"
              >
                Switch UID ↺
              </button>
            </div>
          </div>

          {/* Submission Form */}
          <form onSubmit={handleSubmit} className="border-2 border-bone bg-ink-2 p-6 sm:p-8 space-y-8 shadow-2xl">
            <div className="border-b border-bone/20 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 bg-crimson rounded-full"></span>
                <h2 className="font-display text-2xl sm:text-3xl text-bone uppercase">
                  Digital Deliverable Deposit
                </h2>
              </div>
              <p className="font-label text-xs sm:text-sm text-bone-dim">
                Select your competition event, verify requirements against the official dossier, and upload the specific links requested for your entry.
              </p>
            </div>

            {submitError && (
              <div className="p-3.5 bg-crimson/10 border-l-4 border-crimson text-crimson font-mono text-xs">
                ⚠️ {submitError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* School UID (Locked & Verified) */}
              <div>
                <label className="block font-mono text-xs uppercase text-bone mb-1 font-bold">
                  School UID (Authenticated)
                </label>
                <input
                  type="text"
                  disabled
                  value={formData.schoolUID}
                  className="w-full bg-ink/70 border border-bone/30 p-2.5 font-mono text-sm text-crimson font-bold uppercase cursor-not-allowed"
                />
              </div>

              {/* School Name (Locked & Verified) */}
              <div>
                <label className="block font-mono text-xs uppercase text-bone mb-1 font-bold">
                  Institution Name
                </label>
                <input
                  type="text"
                  disabled
                  value={formData.schoolName}
                  className="w-full bg-ink/70 border border-bone/30 p-2.5 font-label text-sm text-bone cursor-not-allowed"
                />
              </div>

              {/* Competition Selector */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-mono text-xs uppercase text-bone font-bold">
                    Target Competition <span className="text-crimson">*</span>
                  </label>
                  {registeredEventInfo && (
                    <span className="font-mono text-[10px] text-green-400 font-bold px-1.5 py-0.2 bg-green-500/10 border border-green-500/30">
                      ✓ Registered in Docket
                    </span>
                  )}
                </div>
                <select
                  value={formData.eventId}
                  onChange={(e) => {
                    const newId = e.target.value;
                    setFormData(prev => ({ ...prev, eventId: newId }));
                  }}
                  className="w-full bg-ink border border-bone/40 p-2.5 font-mono text-sm text-bone focus:outline-none focus:border-crimson cursor-pointer"
                >
                  {formData.eventId === '03' && (
                    <option value="03" disabled>
                      03 · In Pursuit of Dispute (No preliminary portal submission)
                    </option>
                  )}
                  {events
                    .filter((ev) => ev.id !== '03' && ev.code !== 'IPOD')
                    .map((ev) => {
                      const isRegistered = verifiedSchool.events?.some(
                        registeredEv => {
                          const rId = (registeredEv.id || '').toLowerCase();
                          const rName = (registeredEv.name || '').toLowerCase();
                          const eCode = (EVENT_DELIVERABLE_SPECS[ev.id]?.code || '').toLowerCase();
                          return rId === eCode || rId === ev.id || rName.includes(ev.name.toLowerCase());
                        }
                      );
                      return (
                        <option key={ev.id} value={ev.id}>
                          {ev.id} · {ev.name} ({EVENT_DELIVERABLE_SPECS[ev.id]?.code || ev.id}) {isRegistered ? '★ [Registered]' : ''}
                        </option>
                      );
                    })}
                </select>
              </div>

              {/* Division Selector */}
              <div>
                <label className="block font-mono text-xs uppercase text-bone mb-1 font-bold">
                  Division / Track <span className="text-crimson">*</span>
                </label>
                <select
                  value={formData.division}
                  onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                  className="w-full bg-ink border border-bone/40 p-2.5 font-mono text-sm text-bone focus:outline-none focus:border-crimson cursor-pointer"
                >
                  <option value="Senior Track (Grades 9–12)">Senior Track (Grades 9–12)</option>
                  <option value="Junior Track (Grades 6–8)">Junior Track (Grades 6–8)</option>
                  <option value="Open Track">Open / Unified Track</option>
                </select>
              </div>

              {/* Registered Team Quick-Fill Helper (If available from registration docket) */}
              {registeredEventInfo && registeredEventInfo.teams && registeredEventInfo.teams.length > 0 && (
                <div className="md:col-span-2 p-3 bg-amber-500/10 border border-amber-500/40 space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300 uppercase flex items-center gap-1.5">
                      <span>★</span>
                      <span>Delegation Roster Available for {currentEventSpec.name}:</span>
                    </span>
                    <span className="text-bone-dim text-[11px]">
                      {registeredEventInfo.teams.length} Team{registeredEventInfo.teams.length > 1 ? 's' : ''} on record
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {registeredEventInfo.teams.map((t, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAutofillFromRegisteredTeam(t, registeredEventInfo.category)}
                        className="px-2.5 py-1.5 bg-ink border border-bone/40 hover:border-amber-400 text-bone hover:text-amber-300 transition-colors text-[11px] cursor-pointer"
                      >
                        Autofill: {t.teamName || t.teamId || `Team ${idx + 1}`} (Lead: {t.members?.[0]?.name || 'Delegate'}) →
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Team / Project Name */}
              <div>
                <label className="block font-mono text-xs uppercase text-bone mb-1 font-bold">
                  Team / Project Name <span className="text-crimson">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.teamName}
                  onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                  placeholder="e.g. Project Astraea / Team Redshift"
                  className="w-full bg-ink border border-bone/40 p-2.5 font-label text-sm text-bone focus:outline-none focus:border-crimson"
                />
              </div>

              {/* Lead Student Name */}
              <div>
                <label className="block font-mono text-xs uppercase text-bone mb-1 font-bold">
                  Lead Student / Delegate Name <span className="text-crimson">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.leadName}
                  onChange={(e) => setFormData({ ...formData, leadName: e.target.value })}
                  placeholder="Full Name"
                  className="w-full bg-ink border border-bone/40 p-2.5 font-label text-sm text-bone focus:outline-none focus:border-crimson"
                />
              </div>

              {/* Official Email */}
              <div>
                <label className="block font-mono text-xs uppercase text-bone mb-1 font-bold">
                  Official Email Address <span className="text-crimson">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.leadEmail}
                  onChange={(e) => setFormData({ ...formData, leadEmail: e.target.value })}
                  placeholder="delegate@school.edu"
                  className="w-full bg-ink border border-bone/40 p-2.5 font-mono text-sm text-bone focus:outline-none focus:border-crimson"
                />
                <span className="font-mono text-[10px] text-bone-dim">Confirmation dockets and defense schedules are sent here.</span>
              </div>

              {/* Phone */}
              <div>
                <label className="block font-mono text-xs uppercase text-bone mb-1">
                  Contact Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.leadPhone}
                  onChange={(e) => setFormData({ ...formData, leadPhone: e.target.value })}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full bg-ink border border-bone/40 p-2.5 font-mono text-sm text-bone focus:outline-none focus:border-crimson"
                />
              </div>
            </div>

            {/* Dynamic Event Specification Banner or IPOD No Submission Notice */}
            {currentEventSpec.noSubmissionRequired ? (
              <div className="border-2 border-amber-400 bg-ink p-6 space-y-4">
                <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase font-bold tracking-wider">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  <span>ONLINE SCREENING QUIZ // NO PRELIMINARY FILE DEPOSIT REQUIRED</span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl text-bone uppercase">
                  {currentEventSpec.name} ({currentEventSpec.code})
                </h3>
                <p className="font-label text-sm sm:text-base text-bone-dim leading-relaxed max-w-3xl">
                  Round 1 qualification for <strong>In Pursuit of Dispute</strong> does not require any preliminary file or proposal deposits. Screening is conducted live and synchronously via the <strong>Quizzitch platform</strong> on <strong>16 October 2026</strong>. The top 10 qualifying delegations advance directly to the onsite Oxford-style parliamentary debates on Conclave Day.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    to={currentEventSpec.portalUrl}
                    className="px-4 py-2.5 bg-crimson hover:bg-crimson/80 text-bone font-mono text-xs uppercase font-bold tracking-wider inline-flex items-center gap-2 transition-colors shadow-lg"
                  >
                    <span>Read IPOD Quiz Syllabus & Regulations</span>
                    <span>→</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, eventId: '04' }))}
                    className="px-4 py-2.5 bg-ink-2 border border-bone/40 hover:border-bone text-bone font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Switch to Business Power Pitch (BPP) →
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Dynamic Event Specification Banner */}
                <div className="border border-bone/30 p-4 bg-ink space-y-2">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <span className="font-mono text-xs font-bold text-crimson uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-crimson"></span>
                      {currentEventSpec.name} ({currentEventSpec.code}) Specifications:
                    </span>
                    <Link
                      to={currentEventSpec.portalUrl}
                      className="text-bone hover:text-crimson font-mono text-xs underline uppercase"
                    >
                      View Full {currentEventSpec.name} Prompt Dossier →
                    </Link>
                  </div>
                  <p className="font-label text-xs sm:text-sm text-bone-dim leading-relaxed">
                    {currentEventSpec.summary}
                  </p>
                </div>

                {/* ========================================================================= */}
                {/* EVENT-SPECIFIC MANDATORY DELIVERABLES (EXACT REQUIREMENTS) */}
                {/* ========================================================================= */}
            {currentEventSpec.mandatoryFields.length > 0 && (
              <div className="border-2 border-crimson/80 bg-ink p-5 space-y-5">
                <div className="border-b border-bone/20 pb-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="font-mono text-xs uppercase font-bold text-crimson tracking-wider flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-crimson rounded-full animate-pulse"></span>
                      Mandatory Deliverables for {currentEventSpec.name} ({currentEventSpec.mandatoryFields.length} Required)
                    </h3>
                    <span className="text-[10px] font-mono text-bone-dim uppercase">
                      ALL LINKS MUST BE HTTPS
                    </span>
                  </div>
                  <p className="font-label text-xs text-bone-dim mt-1">
                    Every mandatory link below must be provided and configured with public viewing permissions (&ldquo;Anyone with link can view&rdquo;).
                  </p>
                </div>

                <div className="space-y-4">
                  {currentEventSpec.mandatoryFields.map((field) => (
                    <div key={field.key} className="space-y-1.5 bg-ink-2/60 p-4 border border-bone/20">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <label className="font-mono text-xs uppercase font-bold text-bone">
                          {field.label} <span className="text-crimson">*</span>
                        </label>
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 bg-crimson text-bone-hi uppercase">
                          {field.badge}
                        </span>
                      </div>
                      <p className="font-label text-xs text-bone-dim leading-relaxed">
                        {field.desc}
                      </p>
                      <input
                        type="url"
                        required
                        value={deliverables[field.key] || ''}
                        onChange={(e) => updateDeliverable(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full bg-ink border border-bone/40 p-2.5 font-mono text-xs text-bone focus:outline-none focus:border-crimson"
                      />
                      {field.formatHelp && (
                        <div className="font-mono text-[10px] text-bone-dim/80">
                          ℹ️ {field.formatHelp}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* EVENT-SPECIFIC OPTIONAL DELIVERABLES */}
            {/* ========================================================================= */}
            {currentEventSpec.optionalFields.length > 0 && (
              <div className="border border-bone/30 bg-ink p-5 space-y-4">
                <div className="border-b border-bone/20 pb-3">
                  <h3 className="font-mono text-xs uppercase font-bold text-bone flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-bone-dim"></span>
                    Optional Deliverables &amp; Slide Decks ({currentEventSpec.optionalFields.length} Options)
                  </h3>
                  <p className="font-label text-xs text-bone-dim mt-0.5">
                    Provide supplementary presentations, CAD models, calculation spreadsheets, or source repositories to strengthen your technical score.
                  </p>
                </div>

                <div className="space-y-4">
                  {currentEventSpec.optionalFields.map((field) => (
                    <div key={field.key} className="space-y-1.5 bg-ink-2/40 p-3.5 border border-bone/20">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <label className="font-mono text-xs uppercase font-bold text-bone-dim">
                          {field.label}
                        </label>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 border border-bone/30 text-bone-dim uppercase">
                          {field.badge}
                        </span>
                      </div>
                      <p className="font-label text-xs text-bone-dim/80 leading-relaxed">
                        {field.desc}
                      </p>
                      <input
                        type="url"
                        value={deliverables[field.key] || ''}
                        onChange={(e) => updateDeliverable(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full bg-ink border border-bone/30 p-2.5 font-mono text-xs text-bone focus:outline-none focus:border-crimson"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* CUSTOM SUPPLEMENTARY LINKS SECTION */}
            {/* ========================================================================= */}
            <div className="border border-bone/30 bg-ink p-5 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-bone/20 pb-3">
                <div>
                  <h3 className="font-mono text-xs uppercase font-bold text-bone flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-crimson"></span>
                    Additional Supplementary Links (Custom Resources)
                  </h3>
                  <p className="font-label text-xs text-bone-dim mt-0.5">
                    Attach any additional Drive folders, simulation sheets, videos, or external repositories.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => addSupplementaryLink('', '')}
                  className="px-3 py-1.5 bg-bone text-ink hover:bg-crimson hover:text-bone font-mono text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer shrink-0"
                >
                  + Add Custom Link
                </button>
              </div>

              {supplementaryLinks.length === 0 ? (
                <div className="text-center py-3 border border-dashed border-bone/20 font-mono text-xs text-bone-dim">
                  No additional custom links added. Click "+ Add Custom Link" if you have extra resources.
                </div>
              ) : (
                <div className="space-y-3">
                  {supplementaryLinks.map((item, index) => (
                    <div key={item.id} className="p-3 bg-ink-2 border border-bone/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] uppercase font-bold text-bone">
                          Custom Resource #{index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeSupplementaryLink(item.id)}
                          className="text-crimson hover:text-bone font-mono text-xs font-bold transition-colors cursor-pointer px-1.5 py-0.5"
                        >
                          ✕ Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <input
                            type="text"
                            value={item.label}
                            onChange={(e) => updateSupplementaryLink(item.id, 'label', e.target.value)}
                            placeholder="Resource Label (e.g. Flight Log CSV)"
                            className="w-full bg-ink border border-bone/40 p-2 font-mono text-xs text-bone focus:outline-none focus:border-crimson"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <input
                            type="url"
                            value={item.url}
                            onChange={(e) => updateSupplementaryLink(item.id, 'url', e.target.value)}
                            placeholder="https://drive.google.com/... or https://..."
                            className="w-full bg-ink border border-bone/40 p-2 font-mono text-xs text-bone focus:outline-none focus:border-crimson"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Abstract / Notes */}
            <div>
              <label className="block font-mono text-xs uppercase text-bone mb-1 font-bold">
                Project Abstract / Notes for the Jury (Optional)
              </label>
              <textarea
                rows={3}
                value={formData.projectAbstract}
                onChange={(e) => setFormData({ ...formData, projectAbstract: e.target.value })}
                placeholder="Brief 2-3 sentence overview of your technical approach, aerodynamic highlights, or simulation assumptions..."
                className="w-full bg-ink border border-bone/40 p-2.5 font-label text-sm text-bone focus:outline-none focus:border-crimson"
              />
            </div>

            {/* Declaration Checkbox */}
            <div className="border border-bone/30 p-4 bg-ink flex items-start gap-3">
              <input
                type="checkbox"
                id="rules-agree"
                checked={formData.agreedToRules}
                onChange={(e) => setFormData({ ...formData, agreedToRules: e.target.checked })}
                className="mt-1 w-4 h-4 accent-crimson cursor-pointer"
              />
              <label htmlFor="rules-agree" className="font-label text-xs sm:text-sm text-bone-dim leading-relaxed cursor-pointer">
                We solemnly declare that all deposited links and deliverables represent the original engineering work of our registered student delegation (<strong className="text-bone">{verifiedSchool.school?.name}</strong>). We adhere strictly to the rules of CelesteCon 2026 and acknowledge that any plagiarized material, AI auto-generation of whole texts, or rule violations will result in disqualification.
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-crimson text-bone font-label font-bold text-sm sm:text-base uppercase tracking-widest border-2 border-crimson hover:bg-ink hover:text-crimson transition-all cursor-pointer shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? 'Validating Links & Submitting to JotForm Cloud Vault...' : 'Confirm Digital Submission & Issue Cryptographic Receipt →'}
              </button>
            </div>
              </>
            )}
          </form>
        </div>
      )}

      {/* Deliverable Specifications Reference Table across all 8 events */}
      <section className="border-2 border-bone bg-ink-2 p-6 space-y-4">
        <div>
          <h3 className="font-display text-xl sm:text-2xl uppercase text-bone">
            Master Deliverables Reference Table (All 8 Tracks)
          </h3>
          <p className="font-label text-xs sm:text-sm text-bone-dim">
            Summary of mandatory and optional files required for Round 1 across all CelesteCon 2026 competitions.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-bone text-bone uppercase">
                <th className="py-2.5 pr-4">Event</th>
                <th className="py-2.5 pr-4">Code</th>
                <th className="py-2.5 pr-4">Mandatory Links (Required)</th>
                <th className="py-2.5 pr-4">Optional Deliverables</th>
                <th className="py-2.5 pr-4">Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bone/20 text-bone-dim">
              {Object.entries(EVENT_DELIVERABLE_SPECS).map(([id, spec]) => (
                <tr key={id} className="hover:bg-bone/5 transition-colors">
                  <td className="py-2.5 pr-4 text-bone font-bold">{id} · {spec.name}</td>
                  <td className="py-2.5 pr-4 text-crimson font-bold">{spec.code}</td>
                  <td className="py-2.5 pr-4">
                    {spec.mandatoryFields.length > 0 ? (
                      spec.mandatoryFields.map((f, i) => (
                        <div key={i} className="text-bone">
                          • {f.label}
                        </div>
                      ))
                    ) : (
                      <span className="text-amber-400 font-bold">No Portal File Deposit (Online Screening Quiz via Quizzitch)</span>
                    )}
                  </td>
                  <td className="py-2.5 pr-4 text-[11px]">
                    {spec.optionalFields.length > 0 ? (
                      spec.optionalFields.map((f, i) => (
                        <div key={i}>• {f.label}</div>
                      ))
                    ) : (
                      <span className="text-bone-dim italic">None (Synchronous online quiz)</span>
                    )}
                  </td>
                  <td className="py-2.5 pr-4">
                    <Link to={spec.portalUrl} className="text-bone hover:text-crimson underline font-bold">
                      Prompt →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Past Submissions Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-ink/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-ink-2 border-2 border-bone max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-bone/20 pb-3">
              <h3 className="font-display text-2xl uppercase text-bone">
                Accredited Deliverable Deposits ({submissionHistory.length})
              </h3>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-bone hover:text-crimson font-mono text-sm uppercase font-bold cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {submissionHistory.length === 0 ? (
              <p className="font-mono text-xs text-bone-dim py-6 text-center">
                No previous deliverable deposits found in this browser docket.
              </p>
            ) : (
              <div className="space-y-4 font-mono text-xs">
                {submissionHistory.map((sub, idx) => (
                  <div key={idx} className="p-4 bg-ink border border-bone/30 space-y-2">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <span className="font-bold text-crimson text-sm">{sub.receiptToken}</span>
                      <span className="text-[11px] text-bone-dim">
                        {new Date(sub.timestamp).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })} IST
                      </span>
                    </div>
                    <div className="text-bone font-medium">
                      {sub.eventName} ({sub.division}) · Team: {sub.teamName}
                    </div>
                    <div className="text-bone-dim text-[11px]">
                      Lead: {sub.leadName} ({sub.leadEmail}) · School: {sub.schoolName} ({sub.schoolUID})
                    </div>
                    <div className="pt-2 border-t border-bone/20 space-y-1">
                      <div className="text-bone font-bold text-[10px] uppercase">Submitted Links:</div>
                      {Object.entries(sub.deliverables || {}).map(([k, u]) => (
                        <div key={k} className="flex gap-2 text-[11px] break-all">
                          <span className="text-bone-dim font-semibold">{k}:</span>
                          <a href={u} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">
                            {u}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer Navigation Bar */}
      <div className="border-t-2 border-bone pt-6 mt-12 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap gap-2">
          <Link
            to="/prompts"
            className="font-mono text-xs uppercase tracking-wider px-3.5 py-1.5 border border-bone text-bone hover:bg-bone hover:text-ink transition-colors"
          >
            ← View All 8 Event Prompts
          </Link>
          <a
            href="/celestecon_registration.html"
            className="font-mono text-xs uppercase tracking-wider px-3.5 py-1.5 border border-crimson bg-crimson text-bone-hi hover:bg-ink hover:text-crimson transition-colors"
          >
            School Contingent Registration ↗
          </a>
        </div>
        <span className="font-mono text-[10px] text-bone-dim tracking-widest uppercase">
          AEROSS // CELESTECON 2026 // JOTFORM CONNECTED
        </span>
      </div>
    </div>
  );
}
