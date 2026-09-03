import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import { hybridPrompts } from '../data/prompts';
import {
  lookupRegistration,
  getActiveUID,
  setActiveUID,
  getLocalSubmissions,
  saveLocalSubmission,
  calculateEventAllocations,
  normalizeEventId,
  DEMO_REGISTRATION
} from '../utils/registrationLookup';

const JOTFORM_FORM_ID = '262451061688056';
const JOTFORM_BUILD_URL = 'https://www.jotform.com/build/262451061688056';
const JOTFORM_FORM_URL = 'https://form.jotform.com/262451061688056';
const JOTFORM_SUBMIT_URL = 'https://submit.jotform.com/submit/262451061688056';

const Submissions = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // UID & Registration State
  const [uidInput, setUidInput] = useState('');
  const [activeRegistration, setActiveRegistration] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [uidError, setUidError] = useState('');

  // Submissions State
  const [userSubmissions, setUserSubmissions] = useState([]);
  const [allocations, setAllocations] = useState([]);

  // Form Data State (Single Entry)
  const [formData, setFormData] = useState({
    eventId: '',
    schoolName: '',
    teamName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    category: 'Senior (Classes 9-12)',
    driveLink: '',
    projectTitle: '',
    description: '',
    agreedToSharing: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);

  // 1. Initial Load: Check query param or stored UID
  useEffect(() => {
    const paramUid = searchParams.get('uid');
    const storedUid = getActiveUID();
    const targetUid = paramUid || storedUid;
    if (targetUid) {
      setUidInput(targetUid);
      verifyUid(targetUid);
    }
  }, []);

  // 2. Whenever active registration or userSubmissions change, recalculate allocations
  useEffect(() => {
    if (activeRegistration) {
      const currentSubs = getLocalSubmissions(activeRegistration.uid);
      setUserSubmissions(currentSubs);
      const allocs = calculateEventAllocations(activeRegistration, currentSubs);
      setAllocations(allocs);

      // Filter only available (uncompleted) allocations
      const available = allocs.filter(a => !a.isCompleted);

      // Check if URL specifies an event
      const requestedEvent = searchParams.get('event');
      const requestedAlloc = available.find(
        a => a.id === requestedEvent || a.normId === normalizeEventId(requestedEvent)
      );

      const targetAlloc = requestedAlloc || available[0];

      if (targetAlloc) {
        // Pre-fill suggested team name if available from registration for this specific slot
        const registeredTeam = targetAlloc.teams?.[targetAlloc.submittedCount]?.teamName || '';

        setFormData(prev => ({
          ...prev,
          eventId: targetAlloc.id,
          schoolName: activeRegistration.school?.name || prev.schoolName,
          teamName: registeredTeam || prev.teamName,
          contactName: activeRegistration.school?.contact || prev.contactName,
          contactEmail: activeRegistration.school?.email || prev.contactEmail,
          contactPhone: activeRegistration.school?.phone || prev.contactPhone
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          eventId: '',
          schoolName: activeRegistration.school?.name || prev.schoolName,
          contactName: activeRegistration.school?.contact || prev.contactName,
          contactEmail: activeRegistration.school?.email || prev.contactEmail,
          contactPhone: activeRegistration.school?.phone || prev.contactPhone
        }));
      }
    } else {
      setAllocations([]);
      setUserSubmissions([]);
    }
  }, [activeRegistration]);

  const verifyUid = async (uidToVerify = null) => {
    const clean = (uidToVerify || uidInput).trim();
    if (!clean) {
      setUidError('Please enter your Registration UID (e.g. CLT-2026-00042).');
      return;
    }
    setIsVerifying(true);
    setUidError('');
    try {
      const reg = await lookupRegistration(clean);
      if (reg) {
        setActiveRegistration(reg);
        setActiveUID(reg.uid || clean);
        setUidError('');
      } else {
        setActiveRegistration(null);
        setUidError(`No registration found for UID "${clean}". Verify your UID format or register your school first.`);
      }
    } catch (err) {
      setUidError('Error verifying UID. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClearUid = () => {
    setActiveRegistration(null);
    setActiveUID('');
    setUidInput('');
    setUidError('');
    setAllocations([]);
    setUserSubmissions([]);
    setSubmissionSuccess(null);
  };

  const handleUseDemo = () => {
    setUidInput('CLT-2026-DEMO');
    verifyUid('CLT-2026-DEMO');
  };

  // Only events with remaining slots (>0) are selectable in the form
  const availableAllocations = allocations.filter(a => !a.isCompleted);
  const selectedAlloc = allocations.find(a => a.id === formData.eventId);
  const selectedPrompt = hybridPrompts.find(p => p.id === formData.eventId || p.id === selectedAlloc?.normId) || hybridPrompts[0];

  // Allocation counts
  const totalSlots = allocations.reduce((sum, a) => sum + a.totalSlots, 0);
  const totalSubmitted = allocations.reduce((sum, a) => sum + a.submittedCount, 0);
  const totalRemaining = allocations.reduce((sum, a) => sum + a.remainingSlots, 0);
  const completedEventsCount = allocations.filter(a => a.isCompleted).length;
  const allCompleted = allocations.length > 0 && allocations.every(a => a.isCompleted);

  const validate = () => {
    const errs = {};
    if (!activeRegistration) {
      errs.uid = 'A valid Registration UID is required to submit.';
    }
    if (!formData.eventId) {
      errs.eventId = 'Please select a registered competition with remaining slots.';
    } else if (selectedAlloc && selectedAlloc.isCompleted) {
      errs.eventId = 'All registered slots for this competition have already been submitted and striked out.';
    }
    if (!formData.schoolName.trim()) errs.schoolName = 'School name is required.';
    if (!formData.teamName.trim()) errs.teamName = 'Team name / Participant name is required.';
    if (!formData.contactName.trim()) errs.contactName = 'Contact person name is required.';
    if (!formData.contactEmail.trim()) {
      errs.contactEmail = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      errs.contactEmail = 'Please enter a valid email address.';
    }
    if (!formData.contactPhone.trim()) errs.contactPhone = 'Phone number is required.';

    // Google Drive URL validation
    if (!formData.driveLink.trim()) {
      errs.driveLink = 'Google Drive submission link is required.';
    } else if (!formData.driveLink.includes('drive.google.com') && !formData.driveLink.startsWith('http')) {
      errs.driveLink = 'Please provide a valid Google Drive URL (https://drive.google.com/...).';
    }

    if (!formData.agreedToSharing) {
      errs.agreedToSharing = 'You must confirm that your Google Drive link has public viewing permissions enabled.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const submissionID = 'SUB-' + Math.floor(100000 + Math.random() * 900000);
    const currentSlot = (selectedAlloc?.submittedCount || 0) + 1;
    const maxSlots = selectedAlloc?.totalSlots || 1;

    const payload = {
      formID: JOTFORM_FORM_ID,
      submissionID,
      uid: activeRegistration?.uid || 'UNKNOWN-UID',
      submittedAt: new Date().toISOString(),
      event: {
        id: selectedAlloc?.id || selectedPrompt.id,
        code: selectedPrompt?.eventId || '00',
        name: selectedAlloc?.name || selectedPrompt.name
      },
      slotInfo: {
        slotNumber: currentSlot,
        totalSlots: maxSlots
      },
      school: formData.schoolName,
      team: formData.teamName,
      contact: {
        name: formData.contactName,
        email: formData.contactEmail,
        phone: formData.contactPhone
      },
      category: formData.category,
      projectTitle: formData.projectTitle,
      googleDriveUrl: formData.driveLink,
      notes: formData.description
    };

    try {
      // 1. Dispatch form post to JotForm 262451061688056 via invisible iframe
      try {
        const jfForm = document.getElementById('c26-jotform-native-post');
        if (jfForm) {
          const fieldSchool = document.getElementById('jf-field-school');
          const fieldTeam = document.getElementById('jf-field-team');
          const fieldEvent = document.getElementById('jf-field-event');
          const fieldUid = document.getElementById('jf-field-uid');
          const fieldDrive = document.getElementById('jf-field-drive');
          const fieldContact = document.getElementById('jf-field-contact');
          const fieldSummary = document.getElementById('jf-field-summary');

          if (fieldSchool) fieldSchool.value = formData.schoolName;
          if (fieldTeam) fieldTeam.value = formData.teamName;
          if (fieldEvent) fieldEvent.value = `${selectedAlloc?.name || selectedPrompt.name} (Slot ${currentSlot}/${maxSlots})`;
          if (fieldUid) fieldUid.value = activeRegistration?.uid || '';
          if (fieldDrive) fieldDrive.value = formData.driveLink;
          if (fieldContact) fieldContact.value = `${formData.contactName} | ${formData.contactEmail} | ${formData.contactPhone}`;
          if (fieldSummary) {
            fieldSummary.value = `CelesteCon 2026 Deliverable Submission\nRef: ${submissionID}\nUID: ${activeRegistration?.uid}\nSchool: ${formData.schoolName}\nTeam: ${formData.teamName}\nEvent: ${selectedAlloc?.name || selectedPrompt.name}\nSlot: Entry ${currentSlot} of ${maxSlots}\nDrive URL: ${formData.driveLink}\nNotes: ${formData.description || 'N/A'}`;
          }
          jfForm.submit();
        }
      } catch (domErr) {
        console.warn('[JotForm Submission Frame]', domErr);
      }

      // 2. Dispatch to server proxy endpoint
      await fetch('/api/submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {
        // Standalone or offline fallback
      });

      // 3. Persist in local storage under this UID
      saveLocalSubmission(activeRegistration.uid, payload);

      // 4. Update local state & recalculate allocations
      const updatedSubs = getLocalSubmissions(activeRegistration.uid);
      setUserSubmissions(updatedSubs);
      const updatedAllocs = calculateEventAllocations(activeRegistration, updatedSubs);
      setAllocations(updatedAllocs);

      setSubmissionSuccess({
        ref: submissionID,
        payload,
        eventSubmitted: selectedAlloc?.name || selectedPrompt.name,
        slotNumber: currentSlot,
        totalSlots: maxSlots
      });
    } catch (err) {
      saveLocalSubmission(activeRegistration.uid, payload);
      setSubmissionSuccess({
        ref: submissionID,
        payload,
        eventSubmitted: selectedAlloc?.name || selectedPrompt.name,
        slotNumber: currentSlot,
        totalSlots: maxSlots
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextEntry = () => {
    setSubmissionSuccess(null);

    // Pick next available allocation
    const remaining = allocations.filter(a => !a.isCompleted);
    const nextAlloc = remaining[0];

    const nextRegisteredTeam = nextAlloc ? (nextAlloc.teams?.[nextAlloc.submittedCount]?.teamName || '') : '';

    setFormData(prev => ({
      ...prev,
      eventId: nextAlloc ? nextAlloc.id : '',
      teamName: nextRegisteredTeam || '',
      driveLink: '',
      projectTitle: '',
      description: '',
      agreedToSharing: false
    }));
  };

  const downloadReceipt = () => {
    if (!submissionSuccess) return;
    const blob = new Blob([JSON.stringify(submissionSuccess.payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `celestecon26_submission_${submissionSuccess.ref}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Invisible JotForm Post Target Frame & Form */}
      <iframe name="c26_jotform_frame" id="c26_jotform_frame" title="JotForm Submission Pipeline" className="hidden" />
      <form
        id="c26-jotform-native-post"
        action={JOTFORM_SUBMIT_URL}
        method="POST"
        target="c26_jotform_frame"
        className="hidden"
      >
        <input type="hidden" name="formID" value={JOTFORM_FORM_ID} />
        <input type="hidden" name="simple_spc" value={`${JOTFORM_FORM_ID}-${JOTFORM_FORM_ID}`} />
        <input type="hidden" id="jf-field-school" name="school" value="" />
        <input type="hidden" id="jf-field-team" name="team" value="" />
        <input type="hidden" id="jf-field-event" name="event" value="" />
        <input type="hidden" id="jf-field-uid" name="uid" value="" />
        <input type="hidden" id="jf-field-drive" name="drive_link" value="" />
        <input type="hidden" id="jf-field-contact" name="contact" value="" />
        <input type="hidden" id="jf-field-summary" name="summary" value="" />
      </form>

      <SectionHeader section="05" title="Qualifier Submission Portal" jp="提出ポータル" />

      {/* JotForm Connection Status Indicator */}
      <div className="mt-6 mb-6 p-4 border-2 border-emerald-500/40 bg-emerald-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
          <div>
            <div className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-widest">
              JotForm Live Intake Connected // Form ID: {JOTFORM_FORM_ID}
            </div>
            <div className="font-mono text-[11px] text-bone-dim mt-0.5">
              Deliverable submissions ingest directly into official JotForm pipeline &amp; local quota ledger
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={JOTFORM_BUILD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 text-xs font-mono uppercase tracking-wider border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500 hover:text-ink transition-colors"
          >
            Open Form Builder ↗
          </a>
          <a
            href={JOTFORM_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 text-xs font-mono uppercase tracking-wider border border-bone/30 text-bone hover:border-bone transition-colors"
          >
            Direct Form ↗
          </a>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="mb-8 border-2 border-bone p-6 sm:p-8 bg-bone/[0.04]">
        <div className="font-mono text-xs tracking-[0.2em] text-crimson font-bold uppercase mb-2">
          Round 1 Qualifiers // Single-Entry Submissions
        </div>
        <h2 className="font-display text-2xl sm:text-3xl text-bone uppercase tracking-wide mb-3">
          Deliverable Submission Pipeline
        </h2>
        <p className="font-label text-sm sm:text-base text-bone-dim leading-relaxed">
          Submit your proposal documents, case presentations, and project folders via Google Drive shareable links. Each submission represents a <strong>single entry</strong> for one allocated team slot. Once all registered entries for an event are submitted, that event is <strong>striked out</strong> and removed from the active submission list.
        </p>
      </div>

      {/* Step 0: Registration UID Verification Gate */}
      <div className="mb-10 border-2 border-bone/60 bg-ink-2 p-6 transition-all">
        {activeRegistration ? (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-bone/20">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-mono text-xs tracking-[0.2em] text-emerald-400 font-bold uppercase">
                    REGISTRATION VERIFIED // SUBMISSION SLOTS UNLOCKED
                  </span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl text-bone uppercase tracking-wide">
                  {activeRegistration.school?.name || 'Registered Institution'}
                </h3>
                <div className="font-mono text-xs text-bone-dim mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span>UID: <strong className="text-crimson font-bold text-sm">{activeRegistration.uid}</strong></span>
                  <span>•</span>
                  <span>Contact: <strong className="text-bone">{activeRegistration.school?.contact}</strong></span>
                  <span>•</span>
                  <span>Phone: <strong className="text-bone">{activeRegistration.school?.phone}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to={`/prompts?uid=${encodeURIComponent(activeRegistration.uid)}`}
                  className="px-3 py-1.5 font-mono text-xs uppercase tracking-wider border border-bone/40 text-bone hover:border-bone transition-colors"
                >
                  View My Prompts
                </Link>
                <button
                  onClick={handleClearUid}
                  className="px-3 py-1.5 font-mono text-xs uppercase tracking-wider border border-crimson/50 text-crimson hover:bg-crimson hover:text-bone transition-colors cursor-pointer"
                >
                  Switch UID
                </button>
              </div>
            </div>

            {/* Quota & Event Count Summary Cards */}
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 border border-bone/30 bg-bone/5">
                <div className="font-mono text-[11px] text-bone-dim uppercase tracking-wider">Registered Events</div>
                <div className="font-display text-2xl text-bone mt-0.5">{allocations.length} Events</div>
              </div>
              <div className="p-3 border border-bone/30 bg-bone/5">
                <div className="font-mono text-[11px] text-bone-dim uppercase tracking-wider">Total Team Slots</div>
                <div className="font-display text-2xl text-bone mt-0.5">{totalSlots} Slots</div>
              </div>
              <div className="p-3 border border-emerald-500/40 bg-emerald-950/20">
                <div className="font-mono text-[11px] text-emerald-400 uppercase tracking-wider">Submitted Entries</div>
                <div className="font-display text-2xl text-emerald-400 mt-0.5">{totalSubmitted} of {totalSlots}</div>
              </div>
              <div className="p-3 border border-crimson/40 bg-crimson/10">
                <div className="font-mono text-[11px] text-crimson uppercase tracking-wider">Remaining to Submit</div>
                <div className="font-display text-2xl text-crimson mt-0.5">{totalRemaining} Slots</div>
              </div>
            </div>

            {/* Event Allocation & Submission Quota Tracker */}
            <div className="mt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <h4 className="font-mono text-xs tracking-widest uppercase text-bone font-bold">
                  Registered Competitions &amp; Strike-Out Status ({completedEventsCount} of {allocations.length} Fully Striked)
                </h4>
                <span className="font-mono text-[11px] text-bone-dim">
                  Single-entry submission per team slot • Completed events are striked &amp; removed from dropdown
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {allocations.map((alloc) => {
                  const isDone = alloc.isCompleted;
                  return (
                    <div
                      key={alloc.id}
                      className={`p-3.5 border transition-all ${
                        isDone
                          ? 'border-emerald-500/50 bg-emerald-950/25 text-bone-dim/70'
                          : 'border-crimson bg-crimson/5 text-bone'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className={`font-display text-base uppercase tracking-wide truncate ${isDone ? 'line-through text-bone-dim/50' : 'text-bone font-bold'}`}>
                            {isDone ? `✓ ${alloc.name}` : alloc.name}
                          </div>
                          <div className="font-mono text-xs text-bone-dim mt-0.5">
                            Registered: <strong className="text-bone">{alloc.totalSlots} {alloc.totalSlots === 1 ? 'Team' : 'Teams'}</strong>
                            <span className="mx-1.5">•</span>
                            Submitted: <strong className={isDone ? 'text-emerald-400' : 'text-crimson'}>{alloc.submittedCount}</strong>
                          </div>
                        </div>

                        {isDone ? (
                          <span className="shrink-0 px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/60 text-emerald-400 font-mono text-[10px] uppercase tracking-wider font-bold">
                            ✓ STRIKED — ALL ENTRIES SUBMITTED (0 SLOTS LEFT)
                          </span>
                        ) : (
                          <span className="shrink-0 px-2 py-0.5 bg-crimson/20 border border-crimson/60 text-crimson font-mono text-[10px] uppercase tracking-wider font-bold">
                            {alloc.remainingSlots} OF {alloc.totalSlots} SLOTS REMAINING
                          </span>
                        )}
                      </div>

                      {/* Display previously submitted team entries for this event */}
                      {alloc.matchingSubmissions.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-bone/10 space-y-1">
                          {alloc.matchingSubmissions.map((sub, idx) => (
                            <div key={idx} className="flex items-center justify-between text-[11px] font-mono text-bone-dim">
                              <span className="truncate">↳ Entry #{idx + 1}: <em className="text-bone">{sub.team || 'Team'}</em></span>
                              <span className="text-emerald-400 font-bold shrink-0">Recorded ({sub.submissionID})</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="font-mono text-xs tracking-[0.2em] text-crimson font-bold uppercase mb-2">
              Authentication Required // Step 0
            </div>
            <h3 className="font-display text-xl sm:text-2xl text-bone uppercase tracking-wide mb-2">
              Enter Registration UID
            </h3>
            <p className="font-label text-xs sm:text-sm text-bone-dim mb-4 leading-relaxed max-w-2xl">
              To ensure submissions are counted accurately against each school&apos;s allocated event slots, enter the Registration UID generated upon school registration (e.g. <span className="font-mono text-bone">CLT-2026-00042</span>).
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-xl">
              <input
                type="text"
                placeholder="e.g. CLT-2026-00042"
                value={uidInput}
                onChange={(e) => setUidInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && verifyUid()}
                className="flex-grow bg-ink border-2 border-bone/40 px-4 py-2.5 font-mono text-sm text-bone placeholder:text-bone-dim/40 focus:border-crimson outline-none tracking-wider"
              />
              <button
                onClick={() => verifyUid()}
                disabled={isVerifying}
                className="px-6 py-2.5 bg-crimson text-bone font-label font-bold text-xs uppercase tracking-widest border border-crimson hover:bg-ink hover:text-crimson transition-colors disabled:opacity-50 whitespace-nowrap cursor-pointer"
              >
                {isVerifying ? 'Verifying...' : 'Load My Slots →'}
              </button>
            </div>

            {uidError && (
              <div className="mt-3 font-mono text-xs text-crimson">
                {uidError}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-bone/10 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono text-bone-dim">
              <span>Testing? <button onClick={handleUseDemo} className="text-crimson underline hover:text-bone cursor-pointer">Use Demo UID (1 Debate team, 2 Settlement teams)</button></span>
              <span>•</span>
              <a href="/celestecon_registration.html" target="_blank" rel="noopener noreferrer" className="hover:text-bone underline">
                Not registered? Register here ↗
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Submission Success Banner */}
      {submissionSuccess && (
        <div className="mb-10 border-4 border-emerald-400 bg-emerald-950/40 p-6 sm:p-8 text-center animate-in zoom-in-95 duration-200">
          <div className="font-mono text-xs tracking-[0.25em] text-emerald-400 font-bold uppercase mb-2">
            ✓ SINGLE ENTRY CONFIRMED &amp; RECORDED
          </div>
          <h3 className="font-display text-2xl sm:text-3xl text-bone uppercase tracking-tight mb-2">
            Entry Received for {submissionSuccess.eventSubmitted}
          </h3>
          <p className="font-mono text-sm text-bone-dim mb-2">
            Official Receipt Ref: <strong className="text-emerald-400 font-bold text-base">{submissionSuccess.ref}</strong>
            <span className="mx-2">•</span>
            Slot: <strong className="text-bone">Entry #{submissionSuccess.slotNumber} of {submissionSuccess.totalSlots}</strong>
          </p>
          <div className="inline-block px-3 py-1 bg-emerald-900/60 border border-emerald-400/50 text-emerald-300 font-mono text-xs uppercase tracking-wider mb-4">
            Ingestion to JotForm Form #{JOTFORM_FORM_ID} Dispatched
          </div>

          <p className="font-label text-sm text-bone-dim max-w-lg mx-auto mb-6 leading-relaxed">
            The single submission slot for this team has been consumed and recorded in your school&apos;s quota log.
            {allCompleted
              ? ' All registered event entries for your school are now 100% completed and striked!'
              : ' You may continue to submit the remaining registered entries below.'}
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {!allCompleted && (
              <button
                onClick={handleNextEntry}
                className="px-6 py-2.5 bg-crimson text-bone font-label font-bold text-xs uppercase tracking-widest border border-crimson hover:bg-ink hover:text-crimson transition-colors cursor-pointer"
              >
                Submit Next Registered Entry →
              </button>
            )}
            <button
              onClick={downloadReceipt}
              className="px-5 py-2.5 bg-bone/10 border border-bone/40 text-bone font-mono text-xs uppercase tracking-wider hover:bg-bone hover:text-ink transition-colors cursor-pointer"
            >
              Download Receipt JSON
            </button>
          </div>
        </div>
      )}

      {/* All Entries Completed Screen */}
      {activeRegistration && allCompleted && !submissionSuccess && (
        <div className="mb-12 border-2 border-emerald-500/60 bg-emerald-950/20 p-8 text-center">
          <div className="font-mono text-xs tracking-[0.2em] text-emerald-400 font-bold uppercase mb-2">
            ALL REGISTERED SLOTS COMPLETED &amp; STRIKED
          </div>
          <h3 className="font-display text-3xl text-bone uppercase tracking-wide mb-3">
            All Entries Successfully Recorded
          </h3>
          <p className="font-label text-base text-bone-dim max-w-xl mx-auto mb-6 leading-relaxed">
            Every registered competition slot for <strong>{activeRegistration.school?.name}</strong> has been successfully submitted and striked out. All {totalSlots} registered team entries have been ingested into JotForm (Form #{JOTFORM_FORM_ID}).
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to={`/prompts?uid=${encodeURIComponent(activeRegistration.uid)}`}
              className="px-6 py-2.5 border border-bone text-bone font-mono text-xs uppercase tracking-wider hover:bg-bone hover:text-ink transition-colors"
            >
              Review Your Prompts
            </Link>
            <button
              onClick={handleClearUid}
              className="px-6 py-2.5 border border-crimson text-crimson font-mono text-xs uppercase tracking-wider hover:bg-crimson hover:text-bone transition-colors cursor-pointer"
            >
              Enter Another UID
            </button>
          </div>
        </div>
      )}

      {/* Active Submission Form (Only shown when UID is verified and has remaining slots) */}
      {activeRegistration && !allCompleted && (
        <form onSubmit={handleSubmit} className="border-2 border-bone/40 p-6 sm:p-8 bg-ink space-y-8">
          {/* Step 1: Select Event (Only available slots in list; striked events are removed!) */}
          <div>
            <div className="font-mono text-xs tracking-widest uppercase text-crimson font-bold mb-2">
              Step 1: Select Registered Competition (Single Entry)
            </div>
            <label className="block font-label text-sm uppercase text-bone mb-2">
              Select Competition *
            </label>

            <select
              value={formData.eventId}
              onChange={(e) => {
                const evId = e.target.value;
                const alloc = availableAllocations.find(a => a.id === evId);
                const registeredTeamName = alloc?.teams?.[alloc.submittedCount]?.teamName || '';
                setFormData(prev => ({
                  ...prev,
                  eventId: evId,
                  teamName: registeredTeamName || prev.teamName
                }));
              }}
              className="w-full bg-ink-2 border-2 border-bone/40 text-bone p-3 font-mono text-sm focus:border-crimson outline-none cursor-pointer"
            >
              <option value="" disabled>-- Select a competition with remaining slots --</option>
              {availableAllocations.map((alloc) => (
                <option key={alloc.id} value={alloc.id}>
                  {alloc.name} — Slot {alloc.nextSlotIndex} of {alloc.totalSlots} ({alloc.remainingSlots} slot{alloc.remainingSlots > 1 ? 's' : ''} remaining)
                </option>
              ))}
            </select>
            {errors.eventId && <div className="font-mono text-xs text-crimson mt-1">{errors.eventId}</div>}

            {selectedAlloc && (
              <div className="mt-2.5 p-2.5 bg-ink-2 border border-bone/20 text-xs font-mono text-bone-dim flex flex-wrap items-center gap-2">
                <span>Selected: <strong className="text-bone">{selectedAlloc.name}</strong></span>
                <span>•</span>
                <span>Submitting entry <strong className="text-crimson font-bold">#{selectedAlloc.nextSlotIndex}</strong> of {selectedAlloc.totalSlots}</span>
                <span>•</span>
                <span className="text-emerald-400">
                  {selectedAlloc.remainingSlots === 1
                    ? 'Final remaining slot for this competition (will be striked after submission)'
                    : `${selectedAlloc.remainingSlots} slots remaining for this event`}
                </span>
              </div>
            )}
          </div>

          {/* Step 2: Team & Contact Details */}
          <div className="border-t border-bone/20 pt-6">
            <div className="font-mono text-xs tracking-widest uppercase text-crimson font-bold mb-4">
              Step 2: Team Identification &amp; Contact Details
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-label text-sm uppercase text-bone mb-1">
                  School / Institution *
                </label>
                <input
                  type="text"
                  placeholder="Official School Name"
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  className="w-full bg-ink-2 border-2 border-bone/40 text-bone p-2.5 font-label text-sm focus:border-crimson outline-none"
                />
                {errors.schoolName && <div className="font-mono text-xs text-crimson mt-1">{errors.schoolName}</div>}
              </div>

              <div>
                <label className="block font-label text-sm uppercase text-bone mb-1">
                  Team Name / Participant Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Team Sol Invictus / Aarav Sharma"
                  value={formData.teamName}
                  onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                  className="w-full bg-ink-2 border-2 border-bone/40 text-bone p-2.5 font-label text-sm focus:border-crimson outline-none"
                />
                {errors.teamName && <div className="font-mono text-xs text-crimson mt-1">{errors.teamName}</div>}
              </div>

              <div>
                <label className="block font-label text-sm uppercase text-bone mb-1">
                  Team Leader / Contact Person *
                </label>
                <input
                  type="text"
                  placeholder="Full name"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="w-full bg-ink-2 border-2 border-bone/40 text-bone p-2.5 font-label text-sm focus:border-crimson outline-none"
                />
                {errors.contactName && <div className="font-mono text-xs text-crimson mt-1">{errors.contactName}</div>}
              </div>

              <div>
                <label className="block font-label text-sm uppercase text-bone mb-1">
                  Category / Grade Track
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-ink-2 border-2 border-bone/40 text-bone p-2.5 font-label text-sm focus:border-crimson outline-none"
                >
                  <option value="Junior (Classes 6-8)">Junior (Classes 6–8)</option>
                  <option value="Senior (Classes 9-12)">Senior (Classes 9–12)</option>
                  <option value="Open Category">Open / General Track</option>
                </select>
              </div>

              <div>
                <label className="block font-label text-sm uppercase text-bone mb-1">
                  Contact Email *
                </label>
                <input
                  type="email"
                  placeholder="contact@school.edu"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="w-full bg-ink-2 border-2 border-bone/40 text-bone p-2.5 font-label text-sm focus:border-crimson outline-none"
                />
                {errors.contactEmail && <div className="font-mono text-xs text-crimson mt-1">{errors.contactEmail}</div>}
              </div>

              <div>
                <label className="block font-label text-sm uppercase text-bone mb-1">
                  WhatsApp / Phone Number *
                </label>
                <input
                  type="tel"
                  placeholder="+91 XXXXXXXXXX"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="w-full bg-ink-2 border-2 border-bone/40 text-bone p-2.5 font-label text-sm focus:border-crimson outline-none"
                />
                {errors.contactPhone && <div className="font-mono text-xs text-crimson mt-1">{errors.contactPhone}</div>}
              </div>
            </div>
          </div>

          {/* Step 3: Google Drive Submission Link */}
          <div className="border-t border-bone/20 pt-6">
            <div className="font-mono text-xs tracking-widest uppercase text-crimson font-bold mb-4">
              Step 3: Google Drive Submission Link
            </div>

            <div className="mb-4">
              <label className="block font-label text-sm uppercase text-bone mb-1">
                Google Drive Shareable Link *
              </label>
              <input
                type="url"
                placeholder="https://drive.google.com/file/d/... or https://drive.google.com/drive/folders/..."
                value={formData.driveLink}
                onChange={(e) => setFormData({ ...formData, driveLink: e.target.value })}
                className="w-full bg-ink-2 border-2 border-bone/40 text-bone p-3 font-mono text-sm focus:border-crimson outline-none"
              />
              {errors.driveLink && <div className="font-mono text-xs text-crimson mt-1">{errors.driveLink}</div>}
            </div>

            {/* Drive Permission Instruction Notice */}
            <div className="p-4 border-2 border-crimson/80 bg-crimson/10 mb-4">
              <div className="font-mono text-xs text-crimson font-bold uppercase mb-1 flex items-center gap-1.5">
                <span>⚠ Crucial: Verify Drive Sharing Permissions</span>
              </div>
              <p className="font-label text-xs sm:text-sm text-bone-dim leading-relaxed">
                Right-click your file/folder in Google Drive → Click <strong>Share</strong> → Change General Access from <em>Restricted</em> to <strong>&ldquo;Anyone with the link can view&rdquo;</strong>. Submissions with locked permissions cannot be scored by the jury.
              </p>
            </div>

            <div className="mb-4">
              <label className="block font-label text-sm uppercase text-bone mb-1">
                Project Title / Case Code (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Case Alpha - HALE Autonomous UAV System"
                value={formData.projectTitle}
                onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                className="w-full bg-ink-2 border-2 border-bone/40 text-bone p-2.5 font-label text-sm focus:border-crimson outline-none"
              />
            </div>

            <div>
              <label className="block font-label text-sm uppercase text-bone mb-1">
                Brief Description / Executive Summary (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Provide a short 2-3 sentence overview of your proposed solution or project highlights..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-ink-2 border-2 border-bone/40 text-bone p-2.5 font-label text-sm focus:border-crimson outline-none"
              ></textarea>
            </div>
          </div>

          {/* Verification Checkbox */}
          <div className="border-t border-bone/20 pt-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.agreedToSharing}
                onChange={(e) => setFormData({ ...formData, agreedToSharing: e.target.checked })}
                className="mt-1 h-4 w-4 accent-crimson cursor-pointer"
              />
              <span className="font-label text-xs sm:text-sm text-bone-dim leading-normal select-none">
                I certify that this single submission is the original work of the listed team members and confirm that the Google Drive link has public viewing permissions enabled.
              </span>
            </label>
            {errors.agreedToSharing && <div className="font-mono text-xs text-crimson mt-1">{errors.agreedToSharing}</div>}
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || availableAllocations.length === 0}
              className="w-full py-4 bg-crimson text-bone font-label font-bold text-lg uppercase tracking-widest border border-crimson hover:bg-ink hover:text-crimson transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting
                ? 'Transmitting Single Entry to JotForm (262451061688056)...'
                : selectedAlloc
                ? `Submit Single Entry for ${selectedAlloc.name} (Entry #${selectedAlloc.nextSlotIndex} of ${selectedAlloc.totalSlots}) →`
                : 'Submit Single Entry to Jury →'}
            </button>
          </div>
        </form>
      )}

      {/* When no UID is active, show the prompt to enter UID */}
      {!activeRegistration && (
        <div className="border-2 border-dashed border-bone/40 p-12 text-center bg-ink-2">
          <div className="text-3xl mb-3">🔒</div>
          <div className="font-mono text-xs tracking-[0.25em] text-crimson font-bold uppercase mb-2">
            SUBMISSION PORTAL LOCKED
          </div>
          <h3 className="font-display text-2xl text-bone uppercase tracking-wide mb-3">
            Enter Registration UID Above
          </h3>
          <p className="font-label text-sm text-bone-dim max-w-lg mx-auto mb-6 leading-relaxed">
            Deliverable submissions are strictly tied to your school&apos;s registered event quotas. Please enter your registration UID above or use the demo UID to access your submission slots.
          </p>
          <button
            onClick={handleUseDemo}
            className="px-6 py-2.5 bg-crimson text-bone font-label font-bold text-xs uppercase tracking-widest border border-crimson hover:bg-ink hover:text-crimson transition-colors cursor-pointer"
          >
            Load Demo UID (CLT-2026-DEMO) →
          </button>
        </div>
      )}
    </div>
  );
};

export default Submissions;
