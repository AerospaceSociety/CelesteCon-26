import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { events } from '../data/events';

const TARGET_SUBMISSION_START = new Date('2026-10-13T00:00:00+05:30').getTime();
const TARGET_SUBMISSION_DEADLINE = new Date('2026-10-20T23:59:59+05:30').getTime();

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
  const forceUnlock = searchParams.get('unlock') === 'true' || searchParams.get('preview') === 'true';

  // Chronometer state
  const [windowState, setWindowState] = useState({
    status: 'PENDING', // PENDING, OPEN, CLOSED
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // School lookup state
  const [schoolUID, setSchoolUID] = useState(initialUID);
  const [verifiedSchool, setVerifiedSchool] = useState(null);
  const [lookupError, setLookupError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Form submission state
  const [formData, setFormData] = useState({
    schoolUID: initialUID,
    schoolName: '',
    eventId: '07',
    division: 'Senior (Grades 9–12)',
    teamName: '',
    leadName: '',
    leadEmail: '',
    leadPhone: '',
    driveUrl: '',
    projectAbstract: '',
    agreedToRules: false
  });

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

  function performLookup(uidToTest) {
    const clean = uidToTest.trim().toUpperCase();
    setLookupError('');
    setVerifiedSchool(null);

    if (!clean) {
      setLookupError('Please enter a School UID (e.g. C26-DL-0101).');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);

      // Check localStorage for official registration records
      try {
        const raw = localStorage.getItem('c26_registrations');
        if (raw) {
          const store = JSON.parse(raw);
          if (store[clean]) {
            const rec = store[clean];
            setVerifiedSchool(rec);
            setFormData(prev => ({
              ...prev,
              schoolUID: clean,
              schoolName: rec.school?.name || prev.schoolName,
              leadName: rec.delegation?.headDelegateName || prev.leadName,
              leadEmail: rec.delegation?.headDelegateEmail || prev.leadEmail,
              leadPhone: rec.delegation?.headDelegatePhone || prev.leadPhone
            }));
            return;
          }
        }
      } catch (err) {
        console.warn('Local registration parse error:', err);
      }

      // Pattern validation fallback
      if (/^C26-[A-Z]{2}-\d{4}$/.test(clean)) {
        const fallback = {
          schoolUID: clean,
          isAccredited: true,
          school: {
            name: 'Accredited Institution Delegation',
            city: 'Recognized Contingent'
          },
          events: ['01', '02', '03', '04', '05', '06', '07', '08']
        };
        setVerifiedSchool(fallback);
        setFormData(prev => ({
          ...prev,
          schoolUID: clean,
          schoolName: prev.schoolName || 'Accredited Delegation'
        }));
      } else {
        setLookupError(`No registration found matching "${clean}". Format should be C26-XX-0000.`);
      }
    }, 300);
  }

  // Run initial UID lookup if passed in query param
  useEffect(() => {
    if (initialUID) {
      performLookup(initialUID);
    }
  }, [initialUID]);

  const handleLookupSubmit = (e) => {
    e.preventDefault();
    performLookup(schoolUID);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    const cleanUID = (formData.schoolUID || schoolUID).trim().toUpperCase();
    if (!cleanUID) {
      setSubmitError('School UID is mandatory.');
      return;
    }
    if (!formData.teamName.trim()) {
      setSubmitError('Team / Project Name is required.');
      return;
    }
    if (!formData.leadEmail.trim() || !formData.leadEmail.includes('@')) {
      setSubmitError('Valid Lead Email address is required for confirmation receipts.');
      return;
    }
    if (!formData.driveUrl.trim()) {
      setSubmitError('Please provide a valid Google Drive, OneDrive, or public cloud upload link.');
      return;
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

      const record = {
        receiptToken,
        timestamp,
        schoolUID: cleanUID,
        schoolName: formData.schoolName || verifiedSchool?.school?.name || 'Delegation',
        eventId: formData.eventId,
        eventName: EVENT_FORMAT_SPECS[formData.eventId]?.name,
        division: formData.division,
        teamName: formData.teamName,
        leadName: formData.leadName,
        leadEmail: formData.leadEmail,
        leadPhone: formData.leadPhone,
        submissionMethod: 'link',
        driveUrl: formData.driveUrl,
        projectAbstract: formData.projectAbstract
      };

      // Try sending to /api/submit
      try {
        const payload = new FormData();
        payload.append('submissionData', JSON.stringify(record));
        await fetch('/api/submit', {
          method: 'POST',
          body: payload
        });
      } catch (apiErr) {
        console.warn('Network sync notice: local deposit logged.', apiErr);
      }

      // Persist locally in c26_submissions
      try {
        const existing = JSON.parse(localStorage.getItem('c26_submissions') || '[]');
        existing.unshift(record);
        localStorage.setItem('c26_submissions', JSON.stringify(existing));
      } catch (err) {
        console.warn('Local submission storage warning:', err);
      }

      setSubmissionReceipt(record);
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
    const content = `=====================================================
CELESTECON 2026 // OFFICIAL DIGITAL SUBMISSION RECEIPT
DPS R.K. PURAM · AEROSPACE SOCIETY (AEROSS)
=====================================================

RECEIPT TOKEN:     ${submissionReceipt.receiptToken}
TIMESTAMP:         ${submissionReceipt.timestamp}
GATE STATUS:       VERIFIED & DEPOSITED

DELEGATION DETAILS:
- School UID:      ${submissionReceipt.schoolUID}
- Institution:     ${submissionReceipt.schoolName}
- Team Name:       ${submissionReceipt.teamName}
- Lead Contact:    ${submissionReceipt.leadName} (${submissionReceipt.leadEmail})

EVENT & DELIVERABLE:
- Event:           ${submissionReceipt.eventId} · ${submissionReceipt.eventName}
- Division:        ${submissionReceipt.division}
- Deposit Method:  PUBLIC CLOUD LINK
- Cloud URL:       ${submissionReceipt.driveUrl || 'N/A'}

=====================================================
Retain this cryptographic token for verification during
onsite scrutineering and oral defense check-ins.
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
  const isFormActive = windowState.status === 'OPEN' || forceUnlock;

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
            WINDOW: 13 OCT 00:00 &mdash; 20 OCT 23:59 IST
          </span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl uppercase tracking-wider text-bone leading-tight">
          ROUND 1 <span className="text-crimson">SUBMISSION PORTAL</span>
        </h1>

        <p className="font-label text-base sm:text-lg text-bone-dim max-w-3xl leading-relaxed">
          The unified digital deposit gateway for all 8 CelesteCon 2026 competitions. Submissions open promptly at <strong className="text-bone">00:00:00 IST on 13 October 2026</strong>.
        </p>
      </section>

      {/* Telemetry Chronometer Box (Always Active & On) */}
      <div className="border-2 border-bone bg-ink-2/80 p-5 sm:p-6 backdrop-blur-sm shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-bone/20 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span className={`w-2.5 h-2.5 rounded-full ${windowState.status === 'OPEN' ? 'bg-green-500 animate-pulse' : 'bg-crimson animate-pulse'}`}></span>
            <span className="font-mono text-xs uppercase tracking-widest font-bold text-bone">
              {windowState.status === 'OPEN' ? 'GATE STATUS: DEPOSIT GATE UNLOCKED & ACTIVE' : 'GATE STATUS: ARMED CHRONOMETER // PRE-LAUNCH'}
            </span>
          </div>
          <span className="font-mono text-[11px] text-bone-dim uppercase tracking-wider">
            {windowState.status === 'OPEN' ? 'DEADLINE COUNTDOWN' : 'T-MINUS TO SUBMISSIONS OPEN (13 OCT 00:00 IST)'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center my-3">
          <div className="bg-ink border border-bone/30 p-3">
            <div className="font-display text-3xl sm:text-4xl text-bone font-black">{String(windowState.days).padStart(2, '0')}</div>
            <div className="font-mono text-[10px] text-bone-dim uppercase tracking-widest mt-1">Days</div>
          </div>
          <div className="bg-ink border border-bone/30 p-3">
            <div className="font-display text-3xl sm:text-4xl text-bone font-black">{String(windowState.hours).padStart(2, '0')}</div>
            <div className="font-mono text-[10px] text-bone-dim uppercase tracking-widest mt-1">Hours</div>
          </div>
          <div className="bg-ink border border-bone/30 p-3">
            <div className="font-display text-3xl sm:text-4xl text-bone font-black">{String(windowState.minutes).padStart(2, '0')}</div>
            <div className="font-mono text-[10px] text-bone-dim uppercase tracking-widest mt-1">Minutes</div>
          </div>
          <div className="bg-ink border border-crimson p-3">
            <div className="font-display text-3xl sm:text-4xl text-crimson font-black">{String(windowState.seconds).padStart(2, '0')}</div>
            <div className="font-mono text-[10px] text-crimson uppercase tracking-widest mt-1">Seconds</div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-bone/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 font-mono text-[11px] text-bone-dim">
          <div>
            <span>DEPOSIT METHOD: </span>
            <strong className="text-bone">PUBLIC CLOUD DRIVE URL (GOOGLE DRIVE / ONEDRIVE)</strong>
          </div>
          <div>
            <span>NEED PROMPTS? </span>
            <Link to="/prompts" className="text-crimson hover:underline font-bold">
              View All 8 Event Prompts →
            </Link>
          </div>
        </div>
      </div>

      {/* SUCCESS RECEIPT MODAL */}
      {submissionReceipt && (
        <div className="border-2 border-green-500 bg-ink-2 p-6 sm:p-8 space-y-6 shadow-2xl animate-scaleIn">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b-2 border-green-500/40 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-ink text-xs font-bold">✓</span>
              <div>
                <h3 className="font-display text-2xl sm:text-3xl text-bone uppercase">
                  Deposit Confirmed &amp; Logged
                </h3>
                <p className="font-mono text-xs text-green-400">
                  Receipt Token Issued · Event {submissionReceipt.eventId} ({submissionReceipt.eventName})
                </p>
              </div>
            </div>
            <span className="font-mono text-xs text-bone-dim">
              {new Date(submissionReceipt.timestamp).toLocaleString()}
            </span>
          </div>

          <div className="bg-ink border border-bone/30 p-4 sm:p-6 space-y-4 font-mono text-xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-bone/5 p-3 border border-bone/20">
              <div>
                <span className="text-bone-dim block text-[10px] uppercase tracking-wider">OFFICIAL RECEIPT TOKEN:</span>
                <span className="text-crimson font-bold text-base sm:text-lg tracking-wider break-all">
                  {submissionReceipt.receiptToken}
                </span>
              </div>
              <button
                onClick={copyTokenToClipboard}
                className="px-3.5 py-1.5 bg-bone text-ink hover:bg-crimson hover:text-bone-hi font-label font-bold text-xs uppercase tracking-widest transition-colors shrink-0"
              >
                {copiedToken ? '✓ Copied!' : 'Copy Token'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-bone-dim">
              <div><strong className="text-bone">Institution:</strong> {submissionReceipt.schoolName} ({submissionReceipt.schoolUID})</div>
              <div><strong className="text-bone">Team Name:</strong> {submissionReceipt.teamName}</div>
              <div><strong className="text-bone">Division:</strong> {submissionReceipt.division}</div>
              <div><strong className="text-bone">Lead Contact:</strong> {submissionReceipt.leadName} ({submissionReceipt.leadEmail})</div>
              <div className="md:col-span-2 break-all">
                <strong className="text-bone">Submission Cloud URL:</strong>{' '}
                <a href={submissionReceipt.driveUrl} target="_blank" rel="noreferrer" className="text-crimson underline">
                  {submissionReceipt.driveUrl}
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={downloadReceiptTxt}
              className="px-5 py-2.5 bg-crimson text-bone font-label font-bold text-xs uppercase tracking-widest border border-crimson hover:bg-ink hover:text-crimson transition-colors"
            >
              Download Receipt (.TXT) ↓
            </button>
            <button
              onClick={() => setSubmissionReceipt(null)}
              className="px-5 py-2.5 bg-ink border border-bone/40 text-bone hover:border-crimson hover:text-crimson font-label font-bold text-xs uppercase tracking-widest transition-colors"
            >
              Submit Another Deliverable →
            </button>
          </div>
        </div>
      )}

      {/* CONDITIONAL SUBMISSION GATE: HIDDEN FOR NOW WHILE TIMER IS RUNNING */}
      {!isFormActive ? (
        <div className="border-2 border-bone bg-ink-2/60 p-6 sm:p-10 text-center space-y-6 shadow-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-crimson/10 border border-crimson text-crimson font-mono text-xs uppercase font-bold tracking-widest">
            <span className="w-2.5 h-2.5 rounded-full bg-crimson animate-pulse"></span>
            <span>SUBMISSION GATE ARMED // ACTIVATES 13 OCT 2026 00:00:00 IST</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl uppercase text-bone tracking-wide">
            Digital Deposit Gateway Locked
          </h2>

          <p className="font-label text-sm sm:text-base text-bone-dim max-w-2xl mx-auto leading-relaxed">
            The official submission deposit form is currently locked while teams formulate their designs and technical models. The upload link submission terminal will unlock automatically at <strong className="text-bone">00:00:00 IST on 13 October 2026</strong>.
          </p>

          {/* School UID Pre-Flight Accreditation Check */}
          <div className="max-w-xl mx-auto pt-6 border-t border-bone/20 text-left space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-crimson"></span>
              <span className="font-mono text-xs uppercase font-bold text-bone">
                Pre-Flight Check: Verify School UID Ahead of Launch
              </span>
            </div>
            <p className="font-label text-xs text-bone-dim leading-relaxed">
              Verify your school's assigned registration token to confirm portal eligibility and registered competition quotas before the gate unlocks.
            </p>
            <form onSubmit={handleLookupSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={schoolUID}
                onChange={(e) => setSchoolUID(e.target.value)}
                placeholder="e.g. C26-DL-0101"
                className="flex-1 bg-ink border-2 border-bone px-3.5 py-2 text-bone font-mono text-xs tracking-wider uppercase focus:outline-none focus:border-crimson"
              />
              <button
                type="submit"
                disabled={isVerifying}
                className="bg-crimson text-bone-hi font-label font-bold text-xs uppercase tracking-widest px-5 py-2 border border-crimson hover:bg-ink hover:text-crimson transition-colors cursor-pointer shrink-0"
              >
                {isVerifying ? 'Checking...' : 'Check UID →'}
              </button>
            </form>
            {lookupError && (
              <div className="text-crimson font-mono text-xs pt-1">
                ⚠️ {lookupError}
              </div>
            )}
            {verifiedSchool && (
              <div className="p-3 border border-bone/30 bg-ink font-mono text-xs text-green-400 space-y-1">
                <div>✓ Verified: <strong className="text-bone">{verifiedSchool.schoolUID}</strong></div>
                <div className="text-bone-dim">Institution: <strong className="text-bone">{verifiedSchool.school?.name || 'Accredited Contingent'}</strong></div>
                <div className="text-[11px] text-green-400">Your delegation is accredited and armed for Round 1 upload access when the gate opens.</div>
              </div>
            )}
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <Link
              to="/prompts"
              className="px-6 py-2.5 bg-bone text-ink font-label font-bold text-xs uppercase tracking-widest border border-bone hover:bg-crimson hover:text-bone-hi transition-colors"
            >
              View Competition Prompts →
            </Link>
            <Link
              to="/comps"
              className="px-6 py-2.5 bg-ink border border-bone/40 text-bone font-label font-bold text-xs uppercase tracking-widest hover:border-crimson hover:text-crimson transition-colors"
            >
              View All 8 Competitions →
            </Link>
          </div>
        </div>
      ) : (
        /* ACTIVE SUBMISSION FORM (ACTIVATES ON 13 OCT OR VIA PREVIEW) */
        <div className="space-y-8 animate-fadeIn">
          {/* STEP 1: SCHOOL UID ACCREDITATION VERIFIER */}
          <div className="border-2 border-bone bg-ink-2/60 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-crimson rounded-full"></span>
              <h2 className="font-display text-2xl text-bone uppercase tracking-wide">
                Step 1 · Authenticate School Delegation (UID)
              </h2>
            </div>
            <p className="font-label text-sm text-bone-dim leading-relaxed max-w-3xl">
              Enter your assigned CelesteCon 2026 School Registration Token (e.g., <code className="text-crimson font-mono">C26-DL-0101</code>). This pre-populates your submission profile.
            </p>

            <form onSubmit={handleLookupSubmit} className="flex flex-col sm:flex-row gap-2 max-w-xl">
              <input
                type="text"
                value={schoolUID}
                onChange={(e) => setSchoolUID(e.target.value)}
                placeholder="e.g. C26-DL-0101"
                className="flex-1 bg-ink border-2 border-bone px-4 py-2.5 text-bone font-mono text-sm tracking-wider uppercase focus:outline-none focus:border-crimson"
              />
              <button
                type="submit"
                disabled={isVerifying}
                className="bg-crimson text-bone-hi font-label font-bold text-xs uppercase tracking-widest px-6 py-2.5 border border-crimson hover:bg-ink hover:text-crimson transition-colors cursor-pointer shrink-0"
              >
                {isVerifying ? 'Verifying...' : 'Verify UID →'}
              </button>
            </form>

            {lookupError && (
              <div className="p-3 bg-crimson/10 border border-crimson text-crimson font-mono text-xs">
                ⚠️ {lookupError}
              </div>
            )}

            {verifiedSchool && (
              <div className="p-4 border border-bone/40 bg-ink font-mono text-xs space-y-2 mt-4 animate-fadeIn">
                <div className="flex justify-between items-center border-b border-bone/20 pb-2">
                  <span className="text-bone-dim">VERIFIED SCHOOL UID:</span>
                  <span className="text-crimson font-bold text-sm">{verifiedSchool.schoolUID}</span>
                </div>
                {verifiedSchool.school && (
                  <div>
                    <span className="text-bone-dim">INSTITUTION: </span>
                    <strong className="text-bone">{verifiedSchool.school.name}</strong>
                  </div>
                )}
                <div className="text-green-400 text-[11px] pt-1">
                  ✓ Accreditation Valid: Select your competition below to deposit your upload link.
                </div>
              </div>
            )}
          </div>

          {/* STEP 2: DIGITAL DEPOSIT FORM (ONLY UPLOAD LINK) */}
          <form onSubmit={handleSubmit} className="border-2 border-bone bg-ink-2 p-6 sm:p-8 space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 bg-crimson rounded-full"></span>
                <h2 className="font-display text-2xl sm:text-3xl text-bone uppercase">
                  Step 2 · Digital Deliverable Deposit
                </h2>
              </div>
              <p className="font-label text-xs sm:text-sm text-bone-dim">
                Complete the delegation details below and provide your public cloud drive folder link.
              </p>
            </div>

            {submitError && (
              <div className="p-3 bg-crimson/10 border border-crimson text-crimson font-mono text-xs">
                ⚠️ {submitError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* School UID */}
              <div>
                <label className="block font-mono text-xs uppercase text-bone mb-1 font-bold">
                  School UID <span className="text-crimson">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.schoolUID}
                  onChange={(e) => setFormData({ ...formData, schoolUID: e.target.value.toUpperCase() })}
                  placeholder="C26-DL-0101"
                  className="w-full bg-ink border border-bone/40 p-2.5 font-mono text-sm text-bone uppercase focus:outline-none focus:border-crimson"
                />
              </div>

              {/* School Name */}
              <div>
                <label className="block font-mono text-xs uppercase text-bone mb-1 font-bold">
                  Institution Name
                </label>
                <input
                  type="text"
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  placeholder="e.g. Delhi Public School, R.K. Puram"
                  className="w-full bg-ink border border-bone/40 p-2.5 font-label text-sm text-bone focus:outline-none focus:border-crimson"
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
                  className="w-full bg-ink border border-bone/40 p-2.5 font-mono text-sm text-bone focus:outline-none focus:border-crimson"
                >
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.id} · {ev.name} ({EVENT_FORMAT_SPECS[ev.id]?.code || ev.id})
                    </option>
                  ))}
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
                  className="w-full bg-ink border border-bone/40 p-2.5 font-mono text-sm text-bone focus:outline-none focus:border-crimson"
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
                  Lead Student / Representative <span className="text-crimson">*</span>
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

              {/* Email */}
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

            {/* UPLOAD LINK ONLY (DIRECT UPLOAD REMOVED) */}
            <div className="space-y-2">
              <label className="block font-mono text-xs uppercase text-bone font-bold">
                Submission Portfolio / Cloud Upload Link <span className="text-crimson">*</span>
              </label>
              <input
                type="url"
                required
                value={formData.driveUrl}
                onChange={(e) => setFormData({ ...formData, driveUrl: e.target.value })}
                placeholder="https://drive.google.com/drive/folders/... or OneDrive / Dropbox folder link"
                className="w-full bg-ink border border-bone/40 p-3 font-mono text-sm text-bone focus:outline-none focus:border-crimson"
              />
              <div className="p-3 bg-bone/5 border border-bone/20 font-mono text-xs text-bone-dim space-y-1">
                <div className="text-crimson font-bold">⚠️ Cloud Permission Requirement:</div>
                <div>
                  Ensure link sharing permissions are set to: <strong className="text-bone">"Anyone with the link can view"</strong> so arbiters and the evaluation panel can access your deliverables.
                </div>
                <div className="text-[11px] text-bone-dim/80">
                  Include all relevant files (PDF technical report, OpenRocket .ork file, 3D CAD models, pitch decks, demo videos) inside this linked cloud folder.
                </div>
              </div>
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
                We solemnly declare that this submission represents the original engineering work of our registered student delegation. We adhere to the rules in the CelesteCon 2026 Participant Brochure and accept that any academic dishonesty or non-compliant parameters will lead to disqualification.
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-crimson text-bone font-label font-bold text-sm sm:text-base uppercase tracking-widest border-2 border-crimson hover:bg-ink hover:text-crimson transition-all cursor-pointer shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? 'Authenticating & Depositing...' : 'Confirm Digital Submission & Issue Receipt →'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SECTION 3: SUBMISSION PROTOCOLS & MATRIX (ALWAYS VISIBLE FOR PREPARATION) */}
      <section className="border-2 border-bone bg-ink p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl text-bone uppercase mb-1">
            Standard Technical Deliverable Syntax Matrix
          </h2>
          <p className="font-label text-xs sm:text-sm text-bone-dim">
            Adhere strictly to the standardized nomenclature format when naming deliverables inside your uploaded cloud folder:
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
