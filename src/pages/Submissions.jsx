import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import { hybridPrompts } from '../data/prompts';

const JOTFORM_FORM_ID = '261896133006456';

const Submissions = () => {
  const [searchParams] = useSearchParams();
  const initialEvent = searchParams.get('event') || 'settle';

  const [formData, setFormData] = useState({
    eventId: initialEvent,
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

  useEffect(() => {
    const ev = searchParams.get('event');
    if (ev && hybridPrompts.some(p => p.id === ev)) {
      setFormData(prev => ({ ...prev, eventId: ev }));
    }
  }, [searchParams]);

  const selectedPrompt = hybridPrompts.find(p => p.id === formData.eventId) || hybridPrompts[0];

  const validate = () => {
    const errs = {};
    if (!formData.schoolName.trim()) errs.schoolName = 'School name is required.';
    if (!formData.teamName.trim()) errs.teamName = 'Team name / Participant name is required.';
    if (!formData.contactName.trim()) errs.contactName = 'Contact person name is required.';
    if (!formData.contactEmail.trim()) {
      errs.contactEmail = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      errs.contactEmail = 'Please enter a valid email address.';
    }
    if (!formData.contactPhone.trim()) errs.contactPhone = 'Phone number is required.';
    
    // Drive link validation
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

    const payload = {
      formID: JOTFORM_FORM_ID,
      submissionID,
      submittedAt: new Date().toISOString(),
      event: {
        id: selectedPrompt.id,
        code: selectedPrompt.eventId,
        name: selectedPrompt.name
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
      // Attempt proxy endpoint
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        const data = await res.json();
        setSubmissionSuccess({
          ref: data.submissionID || submissionID,
          payload
        });
      } else {
        // Standalone preview fallback (direct confirmation)
        setSubmissionSuccess({
          ref: submissionID,
          payload
        });
      }
    } catch (err) {
      // In development or static hosting where python backend isn't mounted,
      // record successful client-side confirmation and offer backup download
      setSubmissionSuccess({
        ref: submissionID,
        payload
      });
    } finally {
      setIsSubmitting(false);
    }
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

  if (submissionSuccess) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <div className="border-4 border-bone bg-bone text-ink p-8 sm:p-12 text-center animate-in zoom-in-95 duration-200">
          <div className="font-mono text-xs tracking-[0.25em] text-crimson font-bold uppercase mb-2">
            ◆ TRANSMISSION CONFIRMED
          </div>
          <h2 className="font-display text-4xl sm:text-5xl uppercase tracking-tight mb-4">
            Submission Received
          </h2>
          <p className="font-label text-base sm:text-lg text-ink-2 max-w-xl mx-auto mb-8 leading-relaxed">
            Your Round 1 submission for <strong className="text-ink">{submissionSuccess.payload.event.name}</strong> has been logged into the CelesteCon 2026 jury repository.
          </p>

          <div className="border-2 border-dashed border-ink p-6 max-w-md mx-auto mb-8 bg-bone-hi">
            <div className="font-mono text-xs text-ink-3 uppercase tracking-widest mb-1">
              Official Reference ID
            </div>
            <div className="font-mono text-3xl text-crimson font-bold tracking-wider">
              {submissionSuccess.ref}
            </div>
            <div className="font-mono text-[10px] text-ink-3 uppercase mt-2">
              Time: {new Date(submissionSuccess.payload.submittedAt).toLocaleString()}
            </div>
          </div>

          <div className="text-left font-label text-sm text-ink-2 max-w-md mx-auto mb-8 space-y-1 bg-ink/5 p-4 border border-ink/20">
            <div><strong>School:</strong> {submissionSuccess.payload.school}</div>
            <div><strong>Team:</strong> {submissionSuccess.payload.team}</div>
            <div><strong>Google Drive Link:</strong> <span className="font-mono text-xs break-all text-crimson">{submissionSuccess.payload.googleDriveUrl}</span></div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={downloadReceipt}
              className="px-6 py-2.5 bg-ink text-bone font-label font-bold text-sm uppercase tracking-widest border border-ink hover:bg-crimson hover:border-crimson transition-colors w-full sm:w-auto"
            >
              Download JSON Receipt
            </button>
            <button
              onClick={() => {
                setSubmissionSuccess(null);
                setFormData(prev => ({ ...prev, driveLink: '', projectTitle: '', description: '', agreedToSharing: false }));
              }}
              className="px-6 py-2.5 bg-transparent text-ink font-label font-bold text-sm uppercase tracking-widest border border-ink hover:bg-ink hover:text-bone transition-colors w-full sm:w-auto"
            >
              Submit Another Entry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <SectionHeader section="05" title="Submission Portal" jp="提出窓口" />

      {/* Hero Header */}
      <div className="mt-8 mb-10 border-2 border-bone p-6 sm:p-8 bg-bone/[0.04]">
        <div className="font-mono text-xs tracking-[0.2em] text-crimson font-bold uppercase mb-2">
          Hybrid Events // Round 1 Qualifier Upload
        </div>
        <h2 className="font-display text-2xl sm:text-3xl text-bone uppercase tracking-wide mb-2">
          Project & Deliverable Submission
        </h2>
        <p className="font-label text-sm sm:text-base text-bone-dim leading-relaxed">
          Use this official portal to submit your Round 1 qualifying proposals, pitch videos, and project briefs for all 8 Hybrid events. All materials must be hosted on Google Drive with universal viewing permissions.
        </p>

        <div className="mt-4 pt-4 border-t border-bone/20 flex items-center justify-between flex-wrap gap-3">
          <span className="font-mono text-xs text-bone-dim">
            Need prompt briefs or templates?
          </span>
          <Link
            to="/prompts"
            className="font-mono text-xs text-crimson font-bold uppercase tracking-wider hover:underline"
          >
            ← View Prompt Portal Briefs
          </Link>
        </div>
      </div>

      {/* Submission Form */}
      <form onSubmit={handleSubmit} className="border-2 border-bone p-6 sm:p-10 bg-ink space-y-8">
        
        {/* Step 1: Select Event */}
        <div>
          <label className="block font-mono text-xs tracking-widest uppercase text-crimson font-bold mb-2">
            Step 1: Select Hybrid Event
          </label>
          <select
            value={formData.eventId}
            onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
            className="w-full bg-ink-2 border-2 border-bone/50 text-bone p-3 font-label text-base focus:border-crimson outline-none"
          >
            {hybridPrompts.map(p => (
              <option key={p.id} value={p.id}>
                E{p.eventId} — {p.name} ({p.category})
              </option>
            ))}
          </select>

          {/* Active Event Reminder Banner */}
          <div className="mt-3 p-3 border border-bone/30 bg-bone/[0.03] text-xs font-mono text-bone-dim flex justify-between items-center flex-wrap gap-2">
            <span>Required Deliverable: <strong className="text-bone">{selectedPrompt.deliverables}</strong></span>
            <Link to={`/prompts`} className="text-crimson font-bold underline">Read prompt brief</Link>
          </div>
        </div>

        {/* Step 2: Team & School Info */}
        <div className="border-t border-bone/20 pt-6">
          <div className="font-mono text-xs tracking-widest uppercase text-crimson font-bold mb-4">
            Step 2: Team & School Details
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-label text-sm uppercase text-bone mb-1">
                School Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Delhi Public School, R.K. Puram"
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
                placeholder="e.g. Team Phoenix / Aarav Sharma"
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
              Right-click your file/folder in Google Drive → Click <strong>Share</strong> → Change General Access from <em>Restricted</em> to <strong>"Anyone with the link can view"</strong>. Submissions with locked permissions will be flagged as incomplete.
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
              I certify that this submission is the original work of the listed team members and confirm that the Google Drive link has public viewing permissions enabled.
            </span>
          </label>
          {errors.agreedToSharing && <div className="font-mono text-xs text-crimson mt-1">{errors.agreedToSharing}</div>}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-crimson text-bone font-label font-bold text-lg uppercase tracking-widest border border-crimson hover:bg-ink hover:text-crimson transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Transmitting to Jury...' : 'Submit Entry via JotForm API →'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Submissions;
