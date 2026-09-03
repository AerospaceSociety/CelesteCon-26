import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import { hybridPrompts } from '../data/prompts';
import {
  lookupRegistration,
  getActiveUID,
  setActiveUID,
  isEventRegistered,
  DEMO_REGISTRATION
} from '../utils/registrationLookup';

const PromptCard = ({ item, activeUid, registeredEventData }) => {
  const [expanded, setExpanded] = useState(false);
  const teamCount = registeredEventData?.teams?.length || 1;

  return (
    <div className="border-2 border-bone/40 p-6 bg-ink transition-all hover:border-crimson group">
      {/* Header Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="font-mono text-xs text-crimson font-bold border border-crimson/50 px-2 py-0.5 uppercase tracking-widest bg-crimson/10">
            EVENT {item.eventId}
          </span>
          <span className="font-mono text-xs text-emerald-400 font-bold border border-emerald-500/50 px-2 py-0.5 uppercase tracking-wider bg-emerald-950/30">
            ✓ REGISTERED ({teamCount} {teamCount === 1 ? 'TEAM' : 'TEAMS'})
          </span>
          <span className="font-mono text-xs text-bone-dim border border-bone/20 px-2 py-0.5 uppercase tracking-wider hidden sm:inline-block">
            {item.mode}
          </span>
          <span className="font-mono text-xs text-bone-dim border border-bone/20 px-2 py-0.5 uppercase tracking-wider hidden sm:inline-block">
            {item.eligibility}
          </span>
        </div>

        <span className="font-mono text-xs uppercase tracking-widest px-2 py-0.5 bg-bone/10 text-bone border border-bone/30">
          {item.status}
        </span>
      </div>

      {/* Main Title & Hook */}
      <h3 className="font-display text-xl sm:text-2xl text-bone uppercase tracking-wide group-hover:text-crimson transition-colors mb-2">
        {item.name}
      </h3>
      <p className="font-label text-sm sm:text-base text-bone-dim mb-4 leading-relaxed">
        {item.hook}
      </p>

      {/* Round 1 Active Qualifier Brief */}
      <div className="border-t border-bone/20 pt-4 pb-3">
        <div className="font-mono text-xs tracking-widest uppercase text-crimson font-bold mb-1.5 flex items-center gap-2">
          <span>▶</span>
          <span>{item.round1Prompt.title}</span>
        </div>

        <div className="font-serif italic text-sm sm:text-base text-bone mb-3 pl-4 border-l-2 border-crimson">
          {item.round1Prompt.topic}
        </div>

        {item.round1Prompt.instructions && (
          <ul className="list-disc pl-5 space-y-1.5 font-label text-xs sm:text-sm text-bone-dim marker:text-crimson">
            {item.round1Prompt.instructions.map((inst, i) => (
              <li key={i}>{inst}</li>
            ))}
          </ul>
        )}

        {item.round1Prompt.requirements && (
          <ul className="list-disc pl-5 mt-2 space-y-1.5 font-label text-xs sm:text-sm text-bone-dim marker:text-crimson">
            {item.round1Prompt.requirements.map((req, i) => (
              <li key={i}>{req}</li>
            ))}
          </ul>
        )}

        {item.round1Prompt.tracks && (
          <div className="mt-2 space-y-1">
            <span className="font-mono text-xs text-bone font-bold uppercase tracking-wider">Tracks Available:</span>
            <ul className="list-disc pl-5 space-y-1 font-label text-xs sm:text-sm text-bone-dim marker:text-crimson">
              {item.round1Prompt.tracks.map((tr, i) => (
                <li key={i}>{tr}</li>
              ))}
            </ul>
          </div>
        )}

        {item.round1Prompt.cases && (
          <div className="mt-3 space-y-2">
            <span className="font-mono text-xs text-bone font-bold uppercase tracking-wider">Choose One Engineering Case:</span>
            <div className="grid grid-cols-1 gap-2">
              {item.round1Prompt.cases.map((cs, i) => (
                <div key={i} className="p-2.5 bg-ink-2 border border-bone/20 text-xs">
                  <span className="font-mono font-bold text-crimson mr-2">{cs.code}:</span>
                  <span className="font-label font-bold text-bone">{cs.title}</span>
                  <p className="font-label text-bone-dim mt-1">{cs.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {item.templateUrl && (
          <div className="mt-3">
            <a
              href={item.templateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 font-mono text-xs uppercase tracking-wider text-bone border border-crimson bg-crimson/20 hover:bg-crimson hover:text-bone transition-colors"
            >
              <span>Download Official Proposal Template</span>
              <span>↗</span>
            </a>
          </div>
        )}
      </div>

      {/* Accordion for Round 2 & Criteria */}
      <div className="pt-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="font-mono text-xs uppercase tracking-widest text-bone-dim hover:text-crimson transition-colors flex items-center gap-2 mb-3 cursor-pointer"
        >
          <span>{expanded ? '▲ Hide Round 2 Finals & Rubric' : '▼ View Round 2 Onsite Finals & Evaluation Rubric'}</span>
        </button>

        {expanded && (
          <div className="border-t border-bone/20 pt-4 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-150">
            <div>
              <h4 className="font-mono text-xs tracking-widest uppercase text-crimson font-bold mb-2">
                {item.round2Prompt.title}
              </h4>
              <ul className="space-y-1.5 font-label text-xs sm:text-sm text-bone-dim list-disc pl-4 marker:text-crimson">
                {item.round2Prompt.details.map((d, i) => (
                  <li key={i} className="leading-relaxed">{d}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-mono text-xs tracking-widest uppercase text-crimson font-bold mb-2">
                Evaluation Rubric
              </h4>
              <ul className="space-y-1.5 font-label text-xs sm:text-sm text-bone-dim list-disc pl-4 marker:text-crimson">
                {item.evaluationCriteria.map((crit, i) => (
                  <li key={i} className="leading-relaxed">{crit}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Deliverable & Action Footer */}
      <div className="mt-4 pt-4 border-t border-bone/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="font-mono text-xs text-bone-dim">
          <span className="text-crimson font-bold uppercase">Required Format: </span>
          <span>{item.deliverables}</span>
        </div>

        <Link
          to={`/submissions?event=${item.id}${activeUid ? `&uid=${encodeURIComponent(activeUid)}` : ''}`}
          className="px-5 py-2 bg-crimson text-bone font-label font-bold text-xs sm:text-sm uppercase tracking-widest border border-crimson hover:bg-ink hover:text-crimson transition-colors whitespace-nowrap self-stretch sm:self-auto text-center"
        >
          Submit Entry on Portal →
        </Link>
      </div>
    </div>
  );
};

const Prompts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [uidInput, setUidInput] = useState('');
  const [activeRegistration, setActiveRegistration] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchFilter, setSearchFilter] = useState('');

  // Initial load: check query param or local storage
  useEffect(() => {
    const paramUid = searchParams.get('uid');
    const storedUid = getActiveUID();
    const candidateUid = paramUid || storedUid;
    if (candidateUid) {
      setUidInput(candidateUid);
      handleVerify(candidateUid);
    }
  }, []);

  const handleVerify = async (uidToVerify = null) => {
    const targetUid = (uidToVerify || uidInput).trim();
    if (!targetUid) {
      setErrorMessage('Please enter your Registration UID (e.g. CLT-2026-00042).');
      return;
    }
    setIsVerifying(true);
    setErrorMessage('');
    try {
      const reg = await lookupRegistration(targetUid);
      if (reg) {
        setActiveRegistration(reg);
        setActiveUID(reg.uid || targetUid);
        setErrorMessage('');
      } else {
        setActiveRegistration(null);
        setErrorMessage(`No registration found for UID "${targetUid}". Please check your UID format or complete school registration.`);
      }
    } catch (e) {
      setErrorMessage('Verification failed. Please check connection and try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClearUid = () => {
    setActiveRegistration(null);
    setActiveUID('');
    setUidInput('');
    setErrorMessage('');
  };

  const handleUseDemo = () => {
    setUidInput('CLT-2026-DEMO');
    handleVerify('CLT-2026-DEMO');
  };

  // Filter prompts according to registration UID: ONLY display registered competitions!
  const filtered = hybridPrompts.filter((item) => {
    // 1. Mandatory UID registration check: Must be registered for this event
    if (!activeRegistration || !isEventRegistered(activeRegistration, item.id)) {
      return false;
    }

    // 2. Category filter
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;

    // 3. Search text filter
    const matchesSearch =
      searchFilter === '' ||
      item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.hook.toLowerCase().includes(searchFilter.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Find registered event object helper
  const getRegEventData = (promptId) => {
    if (!activeRegistration || !activeRegistration.events) return null;
    return activeRegistration.events.find((ev) => isEventRegistered({ events: [ev] }, promptId));
  };

  return (
    <div className="max-w-5xl">
      <SectionHeader section="04" title="Prompt Portal" jp="問題ポータル" />

      {/* Sub-masthead Banner */}
      <div className="mt-8 mb-8 border-2 border-bone p-6 sm:p-8 bg-bone/[0.04]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="font-mono text-xs tracking-[0.2em] text-crimson font-bold uppercase mb-2">
              Official Round 1 Qualifier Briefs // Gated by Registration UID
            </div>
            <h2 className="font-display text-2xl sm:text-3xl text-bone uppercase tracking-wide mb-2">
              Official Hybrid Event Prompts
            </h2>
            <p className="font-label text-sm sm:text-base text-bone-dim max-w-2xl leading-relaxed">
              Enter your official Registration UID below. The portal will look up all competitions your school registered for and display <strong>only</strong> the problem statements and submission briefs for those events.
            </p>
          </div>

          <Link
            to={`/submissions${activeRegistration ? `?uid=${encodeURIComponent(activeRegistration.uid)}` : ''}`}
            className="px-6 py-3 bg-bone text-ink font-label font-bold text-sm uppercase tracking-widest border border-bone hover:bg-crimson hover:text-bone hover:border-crimson transition-colors whitespace-nowrap text-center shrink-0"
          >
            Go To Submission Portal →
          </Link>
        </div>
      </div>

      {/* UID Access & Verification Gate */}
      <div className="mb-10 border-2 border-bone/60 bg-ink-2 p-6 transition-all">
        {activeRegistration ? (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-mono text-xs tracking-[0.2em] text-emerald-400 font-bold uppercase">
                  VERIFIED CANDIDATE REGISTRATION // ACCESS GRANTED
                </span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl text-bone uppercase tracking-wide">
                {activeRegistration.school?.name || 'Registered Institution'}
              </h3>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-bone-dim mt-1">
                <span>UID: <strong className="text-crimson font-bold text-sm">{activeRegistration.uid}</strong></span>
                <span>•</span>
                <span>Contact: <strong className="text-bone">{activeRegistration.school?.contact || 'Candidate'}</strong></span>
                <span>•</span>
                <span>Registered Events: <strong className="text-emerald-400">{activeRegistration.events?.length || 0}</strong></span>
                <span>•</span>
                <span>Total Teams: <strong className="text-bone">{activeRegistration.totals?.totalTeams || 0}</strong></span>
              </div>
              <div className="mt-2 text-xs font-label text-emerald-400/90 flex items-center gap-1.5">
                <span>🔒</span>
                <span>Filtered strictly to your {activeRegistration.events?.length || 0} registered competition briefs. Unregistered events are hidden.</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to={`/submissions?uid=${encodeURIComponent(activeRegistration.uid)}`}
                className="px-4 py-2 font-mono text-xs uppercase tracking-wider bg-crimson text-bone border border-crimson hover:bg-ink hover:text-crimson transition-colors"
              >
                Submit Entries →
              </Link>
              <button
                onClick={handleClearUid}
                className="px-3 py-2 font-mono text-xs uppercase tracking-wider border border-crimson/50 text-crimson hover:bg-crimson hover:text-bone transition-colors cursor-pointer"
              >
                Switch UID
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="font-mono text-xs tracking-[0.2em] text-crimson font-bold uppercase mb-2">
              Authentication Required // Step 1
            </div>
            <h3 className="font-display text-xl sm:text-2xl text-bone uppercase tracking-wide mb-2">
              Enter Registration UID
            </h3>
            <p className="font-label text-xs sm:text-sm text-bone-dim mb-4 leading-relaxed max-w-2xl">
              To ensure academic confidentiality and competition security, enter your school&apos;s Registration UID (e.g. <span className="font-mono text-bone">CLT-2026-00042</span>). Only the briefs for your registered competitions will be displayed.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-xl">
              <input
                type="text"
                placeholder="e.g. CLT-2026-00042"
                value={uidInput}
                onChange={(e) => setUidInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                className="flex-grow bg-ink border-2 border-bone/40 px-4 py-2.5 font-mono text-sm text-bone placeholder:text-bone-dim/40 focus:border-crimson outline-none tracking-wider"
              />
              <button
                onClick={() => handleVerify()}
                disabled={isVerifying}
                className="px-6 py-2.5 bg-crimson text-bone font-label font-bold text-xs uppercase tracking-widest border border-crimson hover:bg-ink hover:text-crimson transition-colors disabled:opacity-50 whitespace-nowrap cursor-pointer"
              >
                {isVerifying ? 'Verifying UID...' : 'Unlock My Prompts →'}
              </button>
            </div>

            {errorMessage && (
              <div className="mt-3 font-mono text-xs text-crimson">
                {errorMessage}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-bone/10 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono text-bone-dim">
              <span>Quick Test? <button onClick={handleUseDemo} className="text-crimson underline hover:text-bone cursor-pointer">Use Demo UID (1 Debate team, 2 Settlement teams)</button></span>
              <span>•</span>
              <a href="/celestecon_registration.html" target="_blank" rel="noopener noreferrer" className="hover:text-bone underline">
                Not registered yet? Register here ↗
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Prompts Content Section */}
      {activeRegistration ? (
        <>
          {/* Filter and Search Bar for Registered Comps */}
          <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-bone-dim uppercase tracking-wider">
                Showing <strong className="text-bone">{filtered.length}</strong> registered competition brief(s)
              </span>
            </div>

            <input
              type="text"
              placeholder="Search within your briefs..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="bg-ink border-2 border-bone/40 px-3 py-1.5 text-sm font-label text-bone placeholder:text-bone-dim/50 focus:border-crimson outline-none w-full md:w-64"
            />
          </div>

          {/* Prompts List — ONLY registered competitions are rendered */}
          <div className="space-y-6">
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <PromptCard
                  key={item.id}
                  item={item}
                  activeUid={activeRegistration?.uid}
                  registeredEventData={getRegEventData(item.id)}
                />
              ))
            ) : (
              <div className="border-2 border-dashed border-bone/30 p-10 text-center bg-bone/[0.02]">
                <div className="font-mono text-xs uppercase tracking-widest text-crimson font-bold mb-2">
                  No Matching Prompts
                </div>
                <p className="font-label text-sm text-bone-dim max-w-md mx-auto mb-4">
                  {searchFilter
                    ? `No registered prompts match "${searchFilter}". Try clearing your search keyword.`
                    : `No active hybrid prompts found for your registered events.`}
                </p>
                {searchFilter && (
                  <button
                    onClick={() => setSearchFilter('')}
                    className="px-4 py-2 border border-bone font-mono text-xs uppercase tracking-wider text-bone hover:bg-bone hover:text-ink transition-colors cursor-pointer"
                  >
                    Clear Search Filter
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        /* Locked Gate Placeholder when UID is not yet entered */
        <div className="border-2 border-dashed border-bone/40 p-12 text-center bg-ink-2">
          <div className="text-3xl mb-3">🔒</div>
          <div className="font-mono text-xs tracking-[0.25em] text-crimson font-bold uppercase mb-2">
            PROMPT BRIEFS LOCKED
          </div>
          <h3 className="font-display text-2xl text-bone uppercase tracking-wide mb-3">
            Enter Your Registration UID Above
          </h3>
          <p className="font-label text-sm text-bone-dim max-w-lg mx-auto mb-6 leading-relaxed">
            Competition briefs, challenge cases, and official proposal templates are locked to verified participants. Please enter your registration UID above or test with the demo UID to unlock only your school&apos;s registered events.
          </p>
          <button
            onClick={handleUseDemo}
            className="px-6 py-2.5 bg-crimson text-bone font-label font-bold text-xs uppercase tracking-widest border border-crimson hover:bg-ink hover:text-crimson transition-colors cursor-pointer"
          >
            Load Demo UID (CLT-2026-DEMO) →
          </button>
        </div>
      )}

      {/* Submission Guidance Note */}
      <div className="mt-14 border-2 border-dashed border-bone/50 p-6 bg-bone/[0.02]">
        <div className="font-mono text-xs tracking-widest uppercase text-crimson font-bold mb-2">
          Submission Protocol Notice
        </div>
        <p className="font-label text-sm text-bone-dim leading-relaxed">
          All Round 1 deliverables must be submitted via Google Drive shareable links on the official <strong className="text-bone">Submission Portal</strong>. Submissions are single-entry per registered team slot and are tracked directly against your school&apos;s UID.
        </p>
      </div>
    </div>
  );
};

export default Prompts;
