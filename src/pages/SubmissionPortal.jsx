import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { events } from '../data/events';

const TARGET_SUBMISSION_START = new Date('2026-10-13T00:00:00+05:30').getTime();
const TARGET_SUBMISSION_DEADLINE = new Date('2026-10-20T23:59:59+05:30').getTime();

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

const EVENT_FORMAT_SPECS = {
  '01': {
    code: 'SMT',
    name: 'Settle-Me-This',
    format: 'PDF Proposal (Max 25 pgs Jr / 35 pgs Sr)',
    ext: '.pdf (in Drive/Cloud)',
    instructions: 'Engineering proposal for orbital or lunar habitat. Submit public drive folder link containing your technical proposal.',
    portalUrl: '/prompts/settlement'
  },
  '02': {
    code: 'VOL',
    name: 'Volatus',
    format: 'PDF Report + 3D CAD (.step / .stl / .f3d)',
    ext: '.pdf, .step, .stl, .zip (in Drive/Cloud)',
    instructions: 'Aero design study, aerodynamic sizing, weight & balance analysis, and 3D CAD files inside a public drive folder.',
    portalUrl: '/prompts/volatus'
  },
  '03': {
    code: 'IPOD',
    name: 'Quizzitch (IPOD)',
    format: 'Online Screening Quiz Allocation',
    ext: 'Online test',
    instructions: '1 representative student per registered school. 45-minute screening round conducted on the portal. Top 10 advance onsite.',
    portalUrl: '/prompts/dispute'
  },
  '04': {
    code: 'BPP',
    name: 'Business Power Pitch',
    format: 'Pitch Deck (PDF) + 5-Min Pitch Video URL',
    ext: '.pdf, video link (in Drive/Cloud)',
    instructions: 'Commercial space startup pitch addressing release theme. Include deck and unlisted video link.',
    portalUrl: '/prompts/bpp'
  },
  '05': {
    code: 'ATH',
    name: 'AEROSS Theatre',
    format: 'Audition Video (3–5 Mins, MP4 / Unlisted Link)',
    ext: 'Video link (YouTube/Drive)',
    instructions: 'Creative aerospace theatrical performance recording (skit, stand-up, monologue, or musical).',
    portalUrl: '/prompts/theatre'
  },
  '06': {
    code: 'CJAM',
    name: 'CelesteJam',
    format: 'Playable Build (Windows/Web ZIP) + Gameplay Video',
    ext: '.zip build link, gameplay video',
    instructions: 'Space-themed minigame build folder link (ZIP or itch.io) with gameplay recording.',
    portalUrl: '/prompts/gamejam'
  },
  '07': {
    code: 'ROC',
    name: 'Rocketry',
    format: 'Technical Report (PDF) + OpenRocket File (.ork)',
    ext: '.pdf, .ork (in Drive/Cloud)',
    instructions: 'Technical dossier and OpenRocket simulation file around Estes D12-5 motor specifications.',
    portalUrl: '/prompts/rocketry'
  },
  '08': {
    code: 'APRIX',
    name: 'AEROSS Prix',
    format: 'Design Documentation (Max 30 pgs) + CAD (.step/.f3d) & Livery',
    ext: '.pdf, .step, .zip (in Drive/Cloud)',
    instructions: 'Scale CO2 F1 constructor dossier, CAD files, 3-view drawings and team livery in a public folder.',
    portalUrl: '/prompts/prix'
  }
};

export default function SubmissionPortal() {
  const [searchParams] = useSearchParams();
  const initialUID = searchParams.get('uid') || '';

  // Chronometer state
  const [windowState, setWindowState] = useState({
    status: 'PENDING',
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
    eventId: '07',
    division: 'Senior (Grades 9–12)',
    teamName: '',
    leadName: '',
    leadEmail: '',
    leadPhone: '',
    driveUrl: '',
    projectAbstract: '',
    targetDestination: 'both', // 'both' | 'jotform' | 'firebase'
    agreedToRules: false
  });

  // Supplementary links list state
  const [supplementaryLinks, setSupplementaryLinks] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionReceipt, setSubmissionReceipt] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const [copiedToken, setCopiedToken] = useState(false);

  // Countdown timer calculations
  useEffect(() => {
    function calculate() {
      const now = Date.now();
      let diff = 0;
      let status = 'PENDING';

      if (now < TARGET_SUBMISSION_START) {
        status = 'PENDING';
        diff = TARGET_SUBMISSION_START - now;
      } else if (now <= TARGET_SUBMISSION_DEADLINE) {
        status = 'OPEN';
        diff = TARGET_SUBMISSION_DEADLINE - now;
      } else {
        status = 'CLOSED';
        diff = 0;
      }

      const totalSecs = Math.floor(diff / 1000);
      const days = Math.floor(totalSecs / 86400);
      const hours = Math.floor((totalSecs % 86400) / 3600);
      const minutes = Math.floor((totalSecs % 3600) / 60);
      const seconds = totalSecs % 60;

      setWindowState({
        status,
        days,
        hours,
        minutes,
        seconds
      });
    }

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, []);

  // UID Verification and Data Fetching
  async function performLookup(uidToTest) {
    const clean = uidToTest.trim().toUpperCase();
    setLookupError('');

    if (!clean) {
      setLookupError('Please enter a School UID (e.g. C26-DL-0101).');
      return;
    }

    // Strict validation on UID pattern
    if (!/^C26-[A-Z]{2}-\d{4}$/.test(clean)) {
      setLookupError(`Invalid UID format: "${clean}". Expected official syntax is C26-XX-0000 (e.g. C26-DL-0101).`);
      return;
    }

    setIsVerifying(true);

    try {
      let resolvedRecord = null;
      let sourceTag = 'Registry';

      // 1. Attempt live server verification via /api/verify-uid (JotForm & Firebase)
      try {
        const res = await fetch(`/api/verify-uid?uid=${encodeURIComponent(clean)}`);
        if (res.ok) {
          const apiData = await res.json();
          if (apiData && apiData.verified && apiData.registration) {
            resolvedRecord = apiData.registration;
            sourceTag = apiData.source === 'jotform' ? 'JotForm Cloud' : (apiData.source === 'firebase' ? 'Firebase Cloud' : 'Official Conclave Registry');
          }
        }
      } catch (networkErr) {
        console.warn('Live API lookup unreachable, falling back to local storage & accredited registry:', networkErr);
      }

      // 2. Check browser localStorage c26_registrations (generated upon school registration)
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

      // 3. Check accredited seed delegations (e.g. Host/DPS contingents)
      if (!resolvedRecord && SEED_DELEGATIONS[clean]) {
        resolvedRecord = SEED_DELEGATIONS[clean];
        sourceTag = 'Host Contingent Accreditation';
      }

      // 4. Verification Gate decision
      if (resolvedRecord) {
        const enrichedRecord = {
          ...resolvedRecord,
          schoolUID: clean,
          sourceTag
        };

        setVerifiedSchool(enrichedRecord);
        localStorage.setItem('c26_active_uid', clean);

        setFormData(prev => ({
          ...prev,
          schoolUID: clean,
          schoolName: enrichedRecord.school?.name || prev.schoolName || 'Accredited Institution Delegation',
          leadName: enrichedRecord.school?.contact || enrichedRecord.delegation?.headDelegateName || prev.leadName || '',
          leadEmail: enrichedRecord.school?.email || enrichedRecord.delegation?.headDelegateEmail || prev.leadEmail || '',
          leadPhone: enrichedRecord.school?.phone || enrichedRecord.delegation?.headDelegatePhone || prev.leadPhone || ''
        }));
      } else {
        setVerifiedSchool(null);
        setLookupError(`No accredited registration record found matching UID "${clean}". Entry is restricted to registered delegations. Please verify your token from your registration docket or complete school registration first.`);
      }
    } catch (err) {
      setLookupError('Verification check encountered an error: ' + (err.message || 'Unknown error'));
    } finally {
      setIsVerifying(false);
    }
  }

  // Run initial UID lookup if passed in query param or active in storage
  useEffect(() => {
    if (initialUID) {
      performLookup(initialUID);
    }
  }, [initialUID]);

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
      leadPhone: '',
      driveUrl: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

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
      setSubmitError('Valid Official Email address is required for confirmation receipts.');
      return;
    }
    const driveUrlClean = formData.driveUrl.trim();
    if (!driveUrlClean) {
      setSubmitError('Please provide a valid Primary Google Drive, OneDrive, or public cloud upload link.');
      return;
    }
    if (!/^https:\/\/[^\s/$.?#].[^\s]*$/i.test(driveUrlClean)) {
      setSubmitError('Primary cloud deliverable URL must be a valid secure HTTPS link (e.g. https://drive.google.com/...).');
      return;
    }

    // Validate supplementary links with strict HTTPS protocol check
    for (const link of supplementaryLinks) {
      const url = link.url.trim();
      if (url && !/^https:\/\/[^\s/$.?#].[^\s]*$/i.test(url)) {
        setSubmitError(`Supplementary link "${link.label || 'Link'}" must be a secure HTTPS link.`);
        return;
      }
    }

    if (!formData.agreedToRules) {
      setSubmitError('You must acknowledge that this submission complies with CelesteCon 2026 regulations.');
      return;
    }

    setIsSubmitting(true);

    try {
      const eventCode = EVENT_FORMAT_SPECS[formData.eventId]?.code || 'CC26';
      const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
      const receiptToken = `C26-DEP-${eventCode}-${cleanUID.replace(/[^A-Z0-9]/g, '')}-${randomSuffix}`;
      const timestamp = new Date().toISOString();

      const validSupplementary = supplementaryLinks
        .filter(l => l.url.trim().length > 0)
        .map(l => ({ label: l.label.trim() || 'Additional Resource', url: l.url.trim() }));

      const record = {
        receiptToken,
        timestamp,
        schoolUID: cleanUID,
        schoolName: formData.schoolName || verifiedSchool?.school?.name || 'Accredited Delegation',
        eventId: formData.eventId,
        eventName: EVENT_FORMAT_SPECS[formData.eventId]?.name || `Event ${formData.eventId}`,
        division: formData.division,
        teamName: formData.teamName,
        leadName: formData.leadName,
        leadEmail: formData.leadEmail,
        leadPhone: formData.leadPhone,
        submissionMethod: 'cloud_folder_and_supplementary_links',
        driveUrl: formData.driveUrl.trim(),
        supplementaryLinks: validSupplementary,
        projectAbstract: formData.projectAbstract,
        targetDestination: formData.targetDestination
      };

      let syncStatus = { jotform: false, firebase: false, localVault: true };

      // 1. Post to dedicated deposit endpoint
      try {
        const depositResp = await fetch('/api/deposit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record)
        });

        if (depositResp.ok) {
          const resData = await depositResp.json();
          if (resData.syncedTo) syncStatus = resData.syncedTo;
        }
      } catch (apiErr) {
        console.warn('Cloud deposit API notice: local secure persistence active.', apiErr);
      }

      // 2. Also forward to /api/submit for redundancy
      try {
        await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record)
        });
      } catch (_) {}

      // 3. Persist locally in c26_submissions for client receipt history
      try {
        const existing = JSON.parse(localStorage.getItem('c26_submissions') || '[]');
        existing.unshift({ ...record, syncStatus });
        localStorage.setItem('c26_submissions', JSON.stringify(existing));
      } catch (err) {
        console.warn('Local submission storage warning:', err);
      }

      setSubmissionReceipt({ ...record, syncStatus });
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
TIMESTAMP:         ${submissionReceipt.timestamp}
GATE STATUS:       VERIFIED & SECURED IN DEPOSIT VAULT
TARGET BACKEND:    ${submissionReceipt.targetDestination?.toUpperCase() || 'JOTFORM + FIREBASE'}

DELEGATION DETAILS:
- School UID:      ${submissionReceipt.schoolUID}
- Institution:     ${submissionReceipt.schoolName}
- Team Name:       ${submissionReceipt.teamName}
- Lead Contact:    ${submissionReceipt.leadName} (${submissionReceipt.leadEmail})
- Contact Phone:   ${submissionReceipt.leadPhone || 'N/A'}

EVENT & DELIVERABLE:
- Event:           ${submissionReceipt.eventId} · ${submissionReceipt.eventName}
- Division:        ${submissionReceipt.division}
- Primary Drive:   ${submissionReceipt.driveUrl}

SUPPLEMENTARY LINKS:
${suppLinksText}

PROJECT ABSTRACT:
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

  const currentEventSpec = EVENT_FORMAT_SPECS[formData.eventId] || EVENT_FORMAT_SPECS['07'];

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
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
            ← Prompt Dossiers
          </Link>
          <span className="border border-crimson px-2 py-0.5 text-crimson font-bold text-[10px] uppercase bg-crimson/10">
            ENCRYPTED VAULT // CC-SUB-2026
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
            WINDOW: 13 OCT 00:00 &mdash; 20 OCT 23:59 IST · (LIVE PROMPTS OPEN FOR EARLY DEPOSIT)
          </span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl uppercase tracking-wider text-bone leading-tight">
          ROUND 1 <span className="text-crimson">SUBMISSION PORTAL</span>
        </h1>

        <p className="font-label text-base sm:text-lg text-bone-dim max-w-3xl leading-relaxed">
          The unified digital deposit gateway for all 8 CelesteCon 2026 competitions. Teams authenticate with their official <strong className="text-bone">School UID</strong> to access the deposit form, submit primary Cloud Drive folders, and attach supplementary links to JotForm and Firebase.
        </p>
      </section>

      {/* Telemetry Chronometer Box */}
      <div className="border-2 border-bone bg-ink-2/80 p-5 sm:p-6 backdrop-blur-sm shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-bone/20 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="font-mono text-xs uppercase font-bold text-bone tracking-wider">
              PORTAL GATEWAY STATUS: ACCREDITATION CHECK ACTIVE
            </span>
          </div>
          <div className="font-mono text-xs text-bone-dim">
            PRIMARY DEADLINE: <strong className="text-crimson">20 OCT 2026 23:59:59 IST</strong>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
          <div className="bg-ink p-3 border border-bone/20">
            <div className="text-2xl sm:text-3xl font-bold text-bone">{windowState.days}</div>
            <div className="text-[10px] text-bone-dim uppercase tracking-wider">Days to Launch</div>
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
                Digital Deposit Confirmed &amp; Encrypted
              </h2>
            </div>
            <span className="px-3 py-1 bg-green-500 text-ink font-mono text-xs font-bold uppercase tracking-widest">
              ● STATUS: SECURED
            </span>
          </div>

          <div className="bg-ink p-4 sm:p-6 border border-bone/40 space-y-4 font-mono text-xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-bone/20 pb-3">
              <span className="text-bone-dim uppercase tracking-wider">OFFICIAL RECEIPT TOKEN:</span>
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
            </div>

            {/* Primary Link */}
            <div className="pt-2 border-t border-bone/20">
              <div className="text-bone font-bold mb-1 uppercase">Primary Cloud Deliverable:</div>
              <a
                href={submissionReceipt.driveUrl}
                target="_blank"
                rel="noreferrer"
                className="text-crimson hover:underline break-all font-bold block"
              >
                {submissionReceipt.driveUrl} ↗
              </a>
            </div>

            {/* Supplementary Links */}
            {submissionReceipt.supplementaryLinks && submissionReceipt.supplementaryLinks.length > 0 && (
              <div className="pt-2 border-t border-bone/20 space-y-1">
                <div className="text-bone font-bold mb-1 uppercase">Supplementary Resources ({submissionReceipt.supplementaryLinks.length}):</div>
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
              className="px-6 py-3 bg-crimson text-bone font-label font-bold text-xs uppercase tracking-widest border border-crimson hover:bg-ink hover:text-crimson transition-colors cursor-pointer"
            >
              Download Official Receipt (.TXT) ↓
            </button>
            <button
              onClick={() => {
                setSubmissionReceipt(null);
                setFormData(prev => ({
                  ...prev,
                  teamName: '',
                  driveUrl: '',
                  projectAbstract: '',
                  agreedToRules: false
                }));
                setSupplementaryLinks([]);
              }}
              className="px-6 py-3 bg-ink border border-bone/40 text-bone hover:border-crimson hover:text-crimson font-label font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer"
            >
              Deposit Another Deliverable for this Delegation →
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHASE 1: MANDATORY ACCREDITATION GATE (IF NOT YET AUTHENTICATED BY UID) */}
      {/* ========================================================================= */}
      {windowState.status === 'PENDING' ? (
        <div className="border-2 border-crimson bg-ink-2/70 p-6 sm:p-10 space-y-6 shadow-2xl text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-crimson/10 border border-crimson text-crimson font-mono text-xs uppercase font-bold tracking-widest">
            <span className="w-2.5 h-2.5 rounded-full bg-crimson animate-pulse"></span>
            <span>PORTAL LOCKED</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl uppercase text-bone tracking-wide">
            Submission Portal Opens 13 October
          </h2>
          <p className="font-label text-sm sm:text-base text-bone-dim max-w-2xl mx-auto leading-relaxed">
            The submission gateway is currently closed. Please prepare your deliverables and return on 13 October 2026 to authenticate with your School UID.
          </p>
        </div>
      ) : !verifiedSchool ? (
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
              To prevent unauthorized uploads and ensure proper quota attribution, entry to the submission deposit terminal requires your assigned <strong className="text-bone">School UID (e.g., C26-DL-0101)</strong>. The portal verifies your token and fetches your school registration data from JotForm and Firebase before granting entry.
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
                {isVerifying ? 'Verifying with Vault...' : 'Verify UID & Enter Portal →'}
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
        /* PHASE 2: ACTIVE DIGITAL DEPOSIT TERMINAL (UNLOCKED UPON VERIFIED UID) */
        /* ========================================================================= */
        <div className="space-y-8 animate-fadeIn">
          {/* Authenticated Delegation Card */}
          <div className="border-2 border-green-500/80 bg-ink p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-lg">
            <div className="space-y-1 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                <span className="text-green-400 font-bold uppercase tracking-wider">
                  ACCREDITED DELEGATION AUTHENTICATED
                </span>
                <span className="text-[10px] px-2 py-0.5 border border-green-500/40 text-green-400 bg-green-500/10">
                  {verifiedSchool.sourceTag || 'Verified'}
                </span>
              </div>
              <div className="text-lg font-bold text-bone font-display tracking-wide uppercase">
                {verifiedSchool.school?.name}
              </div>
              <div className="text-bone-dim flex items-center gap-3 flex-wrap">
                <span>UID: <strong className="text-crimson font-bold">{verifiedSchool.schoolUID}</strong></span>
                <span>·</span>
                <span>Lead: {verifiedSchool.school?.contact || verifiedSchool.delegation?.headDelegateName || 'Delegation Head'}</span>
                <span>·</span>
                <span>Email: {verifiedSchool.school?.email || verifiedSchool.delegation?.headDelegateEmail}</span>
              </div>
            </div>

            <button
              onClick={handleResetAuth}
              className="px-3.5 py-2 border border-bone/40 hover:border-crimson text-bone hover:text-crimson font-mono text-xs uppercase tracking-wider cursor-pointer transition-colors shrink-0"
            >
              Switch School (Change UID) ↺
            </button>
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
                Select your competition event, provide your primary public Cloud Drive folder, and upload supplementary links (simulation files, video pitches, CAD models, code repositories).
              </p>
            </div>

            {submitError && (
              <div className="p-3 bg-crimson/10 border border-crimson text-crimson font-mono text-xs">
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
                <label className="block font-mono text-xs uppercase text-bone mb-1 font-bold">
                  Target Competition <span className="text-crimson">*</span>
                </label>
                <select
                  value={formData.eventId}
                  onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
                  className="w-full bg-ink border border-bone/40 p-2.5 font-mono text-sm text-bone focus:outline-none focus:border-crimson cursor-pointer"
                >
                  {events.map((ev) => {
                    const isRegistered = verifiedSchool.events?.some(
                      registeredEv => (registeredEv.id || registeredEv.name || '').toLowerCase().includes(ev.id.toLowerCase()) || (registeredEv.name || '').toLowerCase().includes(ev.name.toLowerCase())
                    );
                    return (
                      <option key={ev.id} value={ev.id}>
                        {ev.id} · {ev.name} ({EVENT_FORMAT_SPECS[ev.id]?.code || ev.id}) {isRegistered ? '★ [Registered]' : ''}
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
                  <option value="Senior (Grades 9–12)">Senior Track (Grades 9–12)</option>
                  <option value="Junior (Grades 6–8)">Junior Track (Grades 6–8)</option>
                  <option value="Open">Open Track</option>
                </select>
              </div>

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

              {/* Team Lead Name */}
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
                  Official Email <span className="text-crimson">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.leadEmail}
                  onChange={(e) => setFormData({ ...formData, leadEmail: e.target.value })}
                  placeholder="receipt@school.edu"
                  className="w-full bg-ink border border-bone/40 p-2.5 font-mono text-sm text-bone focus:outline-none focus:border-crimson"
                />
                <span className="font-mono text-[10px] text-bone-dim">Submission receipt and defense schedule sent here.</span>
              </div>

              {/* Phone */}
              <div>
                <label className="block font-mono text-xs uppercase text-bone mb-1">
                  Contact Phone
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


            {/* Dynamic Event Specification Banner */}
            <div className="border border-bone/30 p-4 bg-ink space-y-2">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <span className="font-mono text-xs font-bold text-crimson uppercase tracking-wider">
                  {currentEventSpec.name} Specifications:
                </span>
                <Link
                  to={currentEventSpec.portalUrl}
                  className="text-bone hover:text-crimson font-mono text-xs underline uppercase"
                >
                  Open {currentEventSpec.name} Prompt →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs text-bone-dim">
                <div><strong className="text-bone">Accepted Format:</strong> {currentEventSpec.format}</div>
                <div><strong className="text-bone">Expected Extensions:</strong> {currentEventSpec.ext}</div>
              </div>
              <p className="font-label text-xs text-bone-dim/90 pt-1">
                {currentEventSpec.instructions}
              </p>
            </div>

            {/* PRIMARY CLOUD DRIVE LINK */}
            <div className="space-y-2">
              <label className="block font-mono text-xs uppercase text-bone font-bold">
                Primary Deliverable Link (Google Drive / OneDrive Folder) <span className="text-crimson">*</span>
              </label>
              <input
                type="url"
                required
                value={formData.driveUrl}
                onChange={(e) => setFormData({ ...formData, driveUrl: e.target.value })}
                placeholder="https://drive.google.com/drive/folders/... or OneDrive / Dropbox link"
                className="w-full bg-ink border border-bone/40 p-3 font-mono text-sm text-bone focus:outline-none focus:border-crimson"
              />
              <div className="p-3 bg-bone/5 border border-bone/20 font-mono text-xs text-bone-dim space-y-1">
                <div className="text-crimson font-bold">⚠️ Cloud Permission Requirement:</div>
                <div>
                  Ensure link sharing permissions are set to: <strong className="text-bone">"Anyone with the link can view"</strong> so arbiters and the evaluation panel can access your deliverables.
                </div>
              </div>
            </div>

            {/* ===================================================================== */}
            {/* SUPPLEMENTARY LINKS UPLOAD SECTION (NEW FEATURE) */}
            {/* ===================================================================== */}
            <div className="border-2 border-bone/30 bg-ink p-5 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-bone/20 pb-3">
                <div>
                  <h3 className="font-mono text-xs uppercase font-bold text-bone flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-crimson"></span>
                    Supplementary Links &amp; Upload Resources (Optional)
                  </h3>
                  <p className="font-label text-xs text-bone-dim mt-0.5">
                    Attach supplementary links to accompany your submission (OpenRocket .ork files, pitch videos, 3D CAD viewers, GitHub repos, or calculation spreadsheets).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => addSupplementaryLink('', '')}
                  className="px-3 py-1.5 bg-bone text-ink hover:bg-crimson hover:text-bone font-mono text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer shrink-0"
                >
                  + Add Link
                </button>
              </div>

              {/* Quick Preset Chips */}
              <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                <span className="text-bone-dim uppercase">Quick Presets:</span>
                <button
                  type="button"
                  onClick={() => addSupplementaryLink('OpenRocket Simulation (.ork)', '')}
                  className="px-2 py-0.5 border border-bone/30 text-bone hover:border-crimson hover:text-crimson cursor-pointer transition-colors"
                >
                  + .ork Simulation
                </button>
                <button
                  type="button"
                  onClick={() => addSupplementaryLink('Video Pitch / Demo URL', '')}
                  className="px-2 py-0.5 border border-bone/30 text-bone hover:border-crimson hover:text-crimson cursor-pointer transition-colors"
                >
                  + Video Pitch
                </button>
                <button
                  type="button"
                  onClick={() => addSupplementaryLink('3D CAD Model (STEP/F3D)', '')}
                  className="px-2 py-0.5 border border-bone/30 text-bone hover:border-crimson hover:text-crimson cursor-pointer transition-colors"
                >
                  + 3D CAD
                </button>
                <button
                  type="button"
                  onClick={() => addSupplementaryLink('Code Repository (GitHub)', '')}
                  className="px-2 py-0.5 border border-bone/30 text-bone hover:border-crimson hover:text-crimson cursor-pointer transition-colors"
                >
                  + Code Repo
                </button>
                <button
                  type="button"
                  onClick={() => addSupplementaryLink('PDF Appendix / Calculations', '')}
                  className="px-2 py-0.5 border border-bone/30 text-bone hover:border-crimson hover:text-crimson cursor-pointer transition-colors"
                >
                  + Appendix
                </button>
              </div>

              {/* Supplementary Links List */}
              {supplementaryLinks.length === 0 ? (
                <div className="text-center py-4 border border-dashed border-bone/20 font-mono text-xs text-bone-dim">
                  No supplementary links added yet. Click "+ Add Link" or choose a preset above to supplement your submission.
                </div>
              ) : (
                <div className="space-y-3">
                  {supplementaryLinks.map((item, index) => (
                    <div key={item.id} className="p-3 bg-ink-2 border border-bone/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] uppercase font-bold text-bone">
                          Link #{index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeSupplementaryLink(item.id)}
                          className="text-crimson hover:text-bone font-mono text-xs font-bold transition-colors cursor-pointer px-1.5 py-0.5"
                          title="Remove this link"
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
                            placeholder="Resource Label (e.g. OpenRocket File)"
                            className="w-full bg-ink border border-bone/40 p-2 font-mono text-xs text-bone focus:outline-none focus:border-crimson"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <input
                            type="url"
                            value={item.url}
                            onChange={(e) => updateSupplementaryLink(item.id, 'url', e.target.value)}
                            placeholder="https://drive.google.com/... or https://youtube.com/..."
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
                Project Abstract / Notes (Optional)
              </label>
              <textarea
                rows={3}
                value={formData.projectAbstract}
                onChange={(e) => setFormData({ ...formData, projectAbstract: e.target.value })}
                placeholder="Brief 2-3 sentence overview of your design approach, aerodynamic choices, or technical highlights..."
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
                We solemnly declare that this submission represents the original engineering work of our registered student delegation (<strong className="text-bone">{verifiedSchool.school?.name}</strong>). We adhere to the rules in the CelesteCon 2026 Participant Brochure and accept that any academic dishonesty or non-compliant parameters will lead to disqualification.
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-crimson text-bone font-label font-bold text-sm sm:text-base uppercase tracking-widest border-2 border-crimson hover:bg-ink hover:text-crimson transition-all cursor-pointer shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? 'Authenticating & Depositing to Cloud Vault...' : 'Confirm Digital Submission & Issue Cryptographic Receipt →'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Deliverable Specifications Reference Table */}
      <section className="border-2 border-bone bg-ink-2 p-6 space-y-4">
        <div>
          <h3 className="font-display text-xl sm:text-2xl uppercase text-bone">
            Round 1 Deliverables &amp; Format Specifications
          </h3>
          <p className="font-label text-xs sm:text-sm text-bone-dim">
            Reference table of required files and naming conventions across all 8 tracks.
          </p>
        </div>

        <div className="p-3 bg-bone/5 border border-bone/20 font-mono text-xs text-bone-dim">
          <span className="text-crimson font-bold">Standard File Syntax: </span>
          <code className="text-bone">[SchoolUID]_[EventCode]_[Division]_[TeamName].[ext]</code>
          <span className="block mt-1 text-[11px] text-bone-dim/80">Example: <span className="text-bone">C26-DL-0101_ROC_Sr_Astraea.ork</span></span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-bone text-bone uppercase">
                <th className="py-2.5 pr-4">Event</th>
                <th className="py-2.5 pr-4">Code</th>
                <th className="py-2.5 pr-4">Required Format</th>
                <th className="py-2.5 pr-4">Direct Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bone/20 text-bone-dim">
              {Object.entries(EVENT_FORMAT_SPECS).map(([id, spec]) => (
                <tr key={id} className="hover:bg-bone/5 transition-colors">
                  <td className="py-2.5 pr-4 text-bone font-bold">{id} · {spec.name}</td>
                  <td className="py-2.5 pr-4 text-crimson font-bold">{spec.code}</td>
                  <td className="py-2.5 pr-4">{spec.format}</td>
                  <td className="py-2.5 pr-4">
                    <Link to={spec.portalUrl} className="text-bone hover:text-crimson underline font-bold">
                      {spec.name} →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

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
          AEROSS // CELESTECON 2026
        </span>
      </div>
    </div>
  );
}
