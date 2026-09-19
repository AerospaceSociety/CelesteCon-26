import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import { events } from '../data/events';
import {
  Search,
  X,
  LayoutGrid,
  List,
  ShieldAlert,
  Calendar,
  Award,
  ChevronRight,
  Info,
  Layers,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

// Tag events with disciplines for intuitive filtering
const EVENT_DISCIPLINES = {
  '01': 'Debate & Strategy',
  '02': 'Knowledge & STEM',
  '03': 'Space Habitability',
  '04': 'Venture & Pitch',
  '05': 'Aerospace Engineering',
  '06': 'Innovation & Design',
  '07': 'Theatre & Improv',
  '08': '3D CAD & Modeling',
  '09': 'Game Development',
  '10': 'Rocketry & Fabrication',
  '11': 'F1 & Automotive'
};

const DISCIPLINES = [
  'ALL',
  'Engineering & CAD',
  'Habitability & Venture',
  'Debate & Knowledge',
  'Creative & Media'
];

const getDisciplineGroup = (id) => {
  if (['05', '08', '10', '11'].includes(id)) return 'Engineering & CAD';
  if (['03', '04', '06'].includes(id)) return 'Habitability & Venture';
  if (['01', '02'].includes(id)) return 'Debate & Knowledge';
  if (['07', '09'].includes(id)) return 'Creative & Media';
  return 'Other';
};

// --- Full Mission Dossier Modal ---
const MissionDossierModal = ({ event, onClose }) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    // Prevent body scrolling while modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  if (!event) return null;

  const hasTracks = (event.categories && event.categories.length > 0) || (event.software && event.software.length > 0);
  const hasResources = event.templateUrl || event.safetyRules;
  const hasCriteria = (event.criteria && event.criteria.length > 0) || (event.timeline && event.timeline.length > 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-ink/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dossier-title"
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-ink border-2 border-bone shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Technical Header Bar */}
        <div className="bg-bone text-ink px-4 sm:px-6 py-2.5 flex items-center justify-between font-mono text-xs uppercase tracking-widest font-bold border-b border-bone shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="bg-crimson text-bone-hi px-2 py-0.5 font-bold">
              DOSSIER // CC26-E{event.id}
            </span>
            <span className="hidden sm:inline text-ink-3">
              {EVENT_DISCIPLINES[event.id] || 'COMPETITION SPEC'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-1 hover:text-crimson transition-colors cursor-pointer text-xs font-bold uppercase tracking-wider"
            aria-label="Close dossier"
          >
            <span>Close</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Dossier Content */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-6 text-bone">
          {/* Mission Identity Header */}
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="font-mono text-sm text-crimson font-bold">
                № {event.id}
              </span>
              <span
                className={`font-mono text-[10px] tracking-widest uppercase px-2.5 py-0.5 font-bold border ${
                  event.mode === 'Onsite'
                    ? 'bg-bone text-ink border-bone'
                    : 'bg-crimson/20 text-bone-hi border-crimson/60'
                }`}
              >
                {event.mode} Mode
              </span>
              <span className="font-mono text-[10px] tracking-widest uppercase border border-bone/30 text-bone-dim px-2 py-0.5">
                {event.eligibility}
              </span>
              <span className="font-mono text-[10px] tracking-widest uppercase border border-bone/50 text-bone px-2 py-0.5 font-semibold">
                {event.team}
              </span>
            </div>

            <h2 id="dossier-title" className="font-display text-3xl sm:text-4xl text-bone uppercase tracking-wide mt-1 mb-3">
              {event.name}
            </h2>

            {event.quote && (
              <blockquote className="font-label italic text-sm text-bone-dim pl-4 border-l-2 border-crimson py-1 my-3 bg-crimson/5">
                {event.quote}
              </blockquote>
            )}

            <p className="font-label text-base text-bone-dim leading-relaxed mt-3">
              {event.overview}
            </p>
          </div>

          {/* Section: Competition Format & Rounds */}
          {event.rounds && event.rounds.length > 0 && (
            <div className="border-t border-bone/20 pt-5">
              <div className="font-mono text-xs text-crimson font-bold uppercase tracking-[0.16em] mb-4 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5" />
                <span>Format &amp; Competition Progression</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.rounds.map((round, idx) => (
                  <div
                    key={idx}
                    className="border border-bone/30 bg-bone/[0.02] p-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-bone/20">
                        <span className="font-label font-bold text-bone uppercase text-sm tracking-wider">
                          {round.title}
                        </span>
                        <span className="font-mono text-[10px] text-crimson font-bold uppercase">
                          PHASE 0{idx + 1}
                        </span>
                      </div>
                      <p className="font-label text-xs sm:text-sm text-bone-dim leading-relaxed">
                        {round.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Tracks / Categories & Software */}
          {hasTracks && (
            <div className="border-t border-bone/20 pt-5">
              <div className="font-mono text-xs text-crimson font-bold uppercase tracking-[0.16em] mb-4 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tracks, Categories &amp; Requirements</span>
              </div>

              {event.categories && event.categories.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {event.categories.map((cat, idx) => (
                    <div key={idx} className="border border-bone/30 p-4 bg-bone/[0.02]">
                      <div className="font-label font-bold text-crimson uppercase text-sm tracking-wide mb-1.5">
                        {cat.name}
                      </div>
                      <p className="font-label text-xs sm:text-sm text-bone-dim leading-relaxed">
                        {cat.desc}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {event.software && (
                <div className="p-3.5 border border-bone/30 bg-bone/[0.03]">
                  <span className="font-mono text-[11px] text-bone uppercase tracking-wider font-bold block mb-2">
                    Approved 3D / CAD Software Platforms:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {event.software.map((sw, idx) => (
                      <span
                        key={idx}
                        className="font-mono text-[10px] tracking-wider uppercase border border-bone/40 text-bone px-2 py-0.5 bg-bone/10 font-bold"
                      >
                        {sw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Section: Criteria & Key Dates */}
          {hasCriteria && (
            <div className="border-t border-bone/20 pt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
              {event.criteria && event.criteria.length > 0 && (
                <div>
                  <div className="font-mono text-xs text-crimson font-bold uppercase tracking-[0.16em] mb-3 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>Evaluation Matrix</span>
                  </div>
                  <ul className="space-y-1.5 font-label text-xs sm:text-sm text-bone-dim list-disc pl-4 marker:text-crimson">
                    {event.criteria.map((crit, idx) => (
                      <li key={idx} className="leading-snug">
                        {crit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {event.timeline && event.timeline.length > 0 && (
                <div>
                  <div className="font-mono text-xs text-crimson font-bold uppercase tracking-[0.16em] mb-3 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Key Deadlines &amp; Dates</span>
                  </div>
                  <dl className="space-y-2 font-mono text-xs">
                    {event.timeline.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between border-b border-bone/20 pb-1 gap-2"
                      >
                        <dt className="text-bone-dim uppercase">{item.label}</dt>
                        <dd className="text-crimson font-bold text-right">{item.date}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          )}

          {/* Section: Resources & Safety Protocols */}
          {hasResources && (
            <div className="border-t border-bone/20 pt-5 space-y-3">
              {event.templateUrl && (
                <div className="p-4 border border-crimson/50 bg-crimson/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-crimson font-bold block">
                      Official Document Template
                    </span>
                    <span className="font-label text-sm text-bone font-bold">
                      {event.templateLabel || 'Submission Template'}
                    </span>
                  </div>
                  <a
                    href={event.templateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-crimson text-bone font-label font-bold text-xs uppercase tracking-widest hover:bg-ink hover:text-crimson transition-colors whitespace-nowrap self-start sm:self-auto border border-crimson flex items-center gap-1.5"
                  >
                    <span>Open Template</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {event.safetyRules && (
                <div className="border border-crimson/60 bg-crimson/5 p-4">
                  <div className="font-mono text-xs tracking-[0.16em] text-crimson uppercase font-bold mb-2 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-crimson" />
                    <span>Mandatory Flight &amp; Workshop Safety Rules</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 font-label text-xs sm:text-sm text-bone-dim marker:text-crimson">
                    {event.safetyRules.map((rule, idx) => (
                      <li key={idx}>{rule}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-4 sm:p-5 bg-ink border-t-2 border-bone flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-bone-dim font-mono text-xs">
            <span className="text-crimson font-bold">AEROSS</span>
            <span>//</span>
            <span>DPS R.K. PURAM</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-1.5 border border-bone/60 text-bone font-label font-bold text-xs uppercase tracking-widest hover:bg-bone hover:text-ink transition-colors cursor-pointer"
            >
              Back to Catalog
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Single Grid Mission Card ---
const MissionGridCard = ({ event, onOpenDossier }) => {
  const discipline = EVENT_DISCIPLINES[event.id] || 'AEROSPACE';

  return (
    <div className="border-2 border-bone/40 bg-ink/70 hover:border-crimson hover:bg-bone/[0.02] transition-all duration-200 flex flex-col justify-between group relative">
      {/* Top Header Strip */}
      <div className="bg-bone/5 border-b border-bone/20 p-3 sm:p-3.5 flex items-center justify-between gap-2 flex-wrap font-mono text-[10px] tracking-wider uppercase">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-crimson">
            № {event.id}
          </span>
          <span className="text-bone-dim/60 font-mono">/</span>
          <span className="text-bone-dim truncate max-w-[140px]">
            {discipline}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className={`font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 font-bold border ${
              event.mode === 'Onsite'
                ? 'bg-bone text-ink border-bone'
                : 'bg-crimson/20 text-bone-hi border-crimson/60'
            }`}
          >
            {event.mode}
          </span>
        </div>
      </div>

      {/* Main Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Eligibility & Team Badges */}
          <div className="flex items-center gap-2 flex-wrap mb-2.5">
            <span className="font-mono text-[9.5px] uppercase tracking-wider text-bone-dim border border-bone/20 px-1.5 py-0.5">
              {event.eligibility.split('(')[0].trim()}
            </span>
            <span className="font-mono text-[9.5px] uppercase tracking-wider text-bone-dim border border-bone/20 px-1.5 py-0.5">
              {event.team.split('(')[0].trim()}
            </span>
          </div>

          {/* Title - Clickable to open dossier */}
          <h3
            onClick={() => onOpenDossier(event)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onOpenDossier(event);
              }
            }}
            tabIndex={0}
            role="button"
            className="font-display text-2xl text-bone uppercase tracking-wide group-hover:text-crimson transition-colors mb-2 cursor-pointer outline-none focus:text-crimson"
            title="Click to view full dossier"
          >
            {event.name}
          </h3>

          {/* Tagline / Hook */}
          <p className="font-label text-xs sm:text-sm text-bone-dim leading-relaxed line-clamp-3 mb-4">
            {event.hook || event.overview}
          </p>
        </div>

        {/* Progression Hint */}
        {event.rounds && event.rounds.length > 0 && (
          <div className="pt-3 border-t border-bone/15 mb-4 flex items-center justify-between font-mono text-[10px] text-bone-dim">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-crimson"></span>
              {event.rounds.length} Competition {event.rounds.length === 1 ? 'Round' : 'Rounds'}
            </span>
            <span className="text-bone-dim/70">
              {event.mode === 'Hybrid' ? 'Online + Onsite' : 'Onsite Finale'}
            </span>
          </div>
        )}

        {/* Action Bar - Single Button Only */}
        <div className="pt-2 border-t border-bone/15">
          <button
            onClick={() => onOpenDossier(event)}
            className="w-full sm:w-auto px-3.5 py-1.5 bg-bone text-ink font-label font-bold text-xs uppercase tracking-widest hover:bg-crimson hover:text-bone hover:border-crimson transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>View Dossier</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Single List Mission Row ---
const MissionListRow = ({ event, onOpenDossier }) => {
  return (
    <div className="border border-bone/30 bg-ink/70 hover:border-crimson hover:bg-bone/[0.02] p-4 transition-all duration-150 flex flex-col md:flex-row md:items-center justify-between gap-4 group">
      <div className="flex items-start md:items-center gap-3 md:gap-4 min-w-0">
        <span className="font-mono text-sm font-bold text-crimson shrink-0">
          № {event.id}
        </span>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3
              onClick={() => onOpenDossier(event)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onOpenDossier(event);
                }
              }}
              tabIndex={0}
              role="button"
              className="font-display text-xl text-bone uppercase tracking-wide group-hover:text-crimson transition-colors cursor-pointer outline-none focus:text-crimson"
              title="Click to view full dossier"
            >
              {event.name}
            </h3>
            <span
              className={`font-mono text-[9px] tracking-widest uppercase px-2 py-0.2 font-bold border ${
                event.mode === 'Onsite'
                  ? 'bg-bone text-ink border-bone'
                  : 'bg-crimson/20 text-bone-hi border-crimson/60'
              }`}
            >
              {event.mode}
            </span>
          </div>
          <p className="font-label text-xs sm:text-sm text-bone-dim truncate max-w-2xl">
            {event.hook || event.overview}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
        <div className="hidden lg:flex flex-col text-right font-mono text-[10px] text-bone-dim">
          <span>{event.eligibility.split('(')[0].trim()}</span>
          <span className="text-bone-dim/70">{event.team.split('(')[0].trim()}</span>
        </div>

        <button
          onClick={() => onOpenDossier(event)}
          className="px-3.5 py-1.5 bg-bone text-ink font-label font-bold text-xs uppercase tracking-widest hover:bg-crimson hover:text-bone hover:border-crimson transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>Dossier</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

// --- Main Comps Page ---
const Comps = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterMode, setFilterMode] = useState('ALL');
  const [filterDiscipline, setFilterDiscipline] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [advisoryCollapsed, setAdvisoryCollapsed] = useState(false);

  // Auto-open dossier if ?event=XX is present in URL
  useEffect(() => {
    const eventParam = searchParams.get('event') || searchParams.get('id');
    if (eventParam) {
      const match = events.find(
        (e) => e.id === eventParam || e.id === eventParam.padStart(2, '0')
      );
      if (match) {
        setSelectedEvent(match);
      }
    }
  }, [searchParams]);

  // Handle opening dossier and updating URL gracefully
  const handleOpenDossier = (event) => {
    setSelectedEvent(event);
    setSearchParams({ event: event.id }, { replace: true });
  };

  const handleCloseDossier = () => {
    setSelectedEvent(null);
    setSearchParams({}, { replace: true });
  };

  // Filter logic
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchesMode =
        filterMode === 'ALL' || e.mode.toLowerCase() === filterMode.toLowerCase();

      const matchesDiscipline =
        filterDiscipline === 'ALL' || getDisciplineGroup(e.id) === filterDiscipline;

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        query === '' ||
        e.name.toLowerCase().includes(query) ||
        e.overview.toLowerCase().includes(query) ||
        e.eligibility.toLowerCase().includes(query) ||
        (e.hook && e.hook.toLowerCase().includes(query)) ||
        (EVENT_DISCIPLINES[e.id] && EVENT_DISCIPLINES[e.id].toLowerCase().includes(query));

      return matchesMode && matchesDiscipline && matchesSearch;
    });
  }, [filterMode, filterDiscipline, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Section Header */}
      <SectionHeader section="03" title="The Comps" jp="競技一覧" />

      {/* Briefing Intro & Stats Band */}
      <div className="mt-4 mb-6 flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b-2 border-bone/30 pb-4">
        <p className="font-label text-base md:text-lg text-bone-dim max-w-3xl leading-relaxed">
          The official competition catalog of CelesteCon 2026. 11 challenges spanning aerospace engineering, orbital habitat design, rocketry, commercial venture, robotics, gaming, and space theatre.
        </p>

        <div className="flex items-center gap-3 text-bone font-mono text-xs shrink-0 flex-wrap">
          <span className="px-2.5 py-1 bg-bone text-ink font-bold">
            11 CHALLENGES
          </span>
          <span className="px-2 py-0.5 border border-bone/40 text-bone-dim">
            8 HYBRID
          </span>
          <span className="px-2 py-0.5 border border-bone/40 text-bone-dim">
            3 ONSITE
          </span>
        </div>
      </div>

      {/* Streamlined Mission Directive Advisory */}
      <div className="mb-6 border border-crimson/50 bg-crimson/5 transition-all">
        <div className="p-3 sm:p-4 flex items-start sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-2.5">
            <Info className="w-4 h-4 text-crimson shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <span className="font-mono text-xs text-crimson font-bold uppercase tracking-wider block sm:inline mr-2">
                Mission Directive // Overlaps &amp; Schedule:
              </span>
              <span className="font-label text-xs sm:text-sm text-bone-dim leading-snug">
                Participants are permitted to enter multiple events. However, on-campus finals at DPS R.K. Puram may overlap; coordinating schedule clashes is the student's responsibility.
              </span>
            </div>
          </div>
          <button
            onClick={() => setAdvisoryCollapsed(!advisoryCollapsed)}
            className="font-mono text-[10px] text-bone-dim hover:text-crimson uppercase tracking-widest whitespace-nowrap cursor-pointer shrink-0"
          >
            {advisoryCollapsed ? 'Show Details' : 'Hide'}
          </button>
        </div>

        {!advisoryCollapsed && (
          <div className="px-4 pb-3 pt-1 border-t border-crimson/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 font-mono text-[10.5px] text-bone-dim">
            <span>
              School contingent registrations allow up to 3 teams per event. Individual registrations are strictly limited to 1 team per competition.
            </span>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href="/celestecon_registration.html"
                className="text-bone hover:text-crimson font-bold uppercase tracking-wider underline underline-offset-2"
              >
                School Portal ↗
              </a>
              <span>·</span>
              <a
                href="/celestecon_individual_registration.html"
                className="text-crimson hover:underline font-bold uppercase tracking-wider"
              >
                Individual Portal ↗
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Control Strip: Filters, Search & View Switcher */}
      <div className="mb-6 space-y-3">
        {/* Row 1: Mode Tabs + View Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Mode Tabs */}
          <div className="flex gap-1.5 flex-wrap">
            {['ALL', 'HYBRID', 'ONSITE'].map((mode) => {
              const count =
                mode === 'ALL'
                  ? events.length
                  : events.filter((e) => e.mode.toUpperCase() === mode).length;
              const isActive = filterMode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => setFilterMode(mode)}
                  className={`px-3 py-1 font-mono text-xs uppercase tracking-widest font-bold border transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-crimson text-bone border-crimson'
                      : 'bg-ink text-bone-dim border-bone/30 hover:border-bone hover:text-bone'
                  }`}
                >
                  {mode} <span className="opacity-75 text-[10px]">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Search Box & View Mode Toggle */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-bone-dim/50" />
              <input
                type="text"
                placeholder="Search comps, CAD, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-ink border border-bone/40 pl-8 pr-7 py-1 text-xs font-label text-bone placeholder:text-bone-dim/40 focus:border-crimson outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-bone-dim hover:text-crimson cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* View Mode Toggle Buttons */}
            <div className="flex items-center border border-bone/40 shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-bone text-ink'
                    : 'text-bone-dim hover:text-bone'
                }`}
                title="Grid View"
                aria-label="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 transition-colors cursor-pointer border-l border-bone/40 ${
                  viewMode === 'list'
                    ? 'bg-bone text-ink'
                    : 'text-bone-dim hover:text-bone'
                }`}
                title="Compact List View"
                aria-label="Compact List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Discipline Filter Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="font-mono text-[10px] uppercase text-bone-dim/60 tracking-wider whitespace-nowrap">
            Domain:
          </span>
          <div className="flex gap-1.5">
            {DISCIPLINES.map((disc) => (
              <button
                key={disc}
                onClick={() => setFilterDiscipline(disc)}
                className={`px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer border ${
                  filterDiscipline === disc
                    ? 'border-bone bg-bone/15 text-bone font-bold'
                    : 'border-transparent text-bone-dim hover:border-bone/30 hover:text-bone'
                }`}
              >
                {disc}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count Strip (when filtering or searching) */}
      {(searchQuery || filterMode !== 'ALL' || filterDiscipline !== 'ALL') && (
        <div className="mb-4 flex items-center justify-between text-xs font-mono text-bone-dim border-b border-bone/20 pb-2">
          <span>
            Showing <strong className="text-crimson">{filteredEvents.length}</strong> of {events.length} competitions
          </span>
          {(searchQuery || filterMode !== 'ALL' || filterDiscipline !== 'ALL') && (
            <button
              onClick={() => {
                setFilterMode('ALL');
                setFilterDiscipline('ALL');
                setSearchQuery('');
              }}
              className="text-crimson hover:underline cursor-pointer uppercase text-[10.5px] font-bold"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {/* Competition Items Showcase */}
      {filteredEvents.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredEvents.map((event) => (
              <MissionGridCard
                key={event.id}
                event={event}
                onOpenDossier={handleOpenDossier}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredEvents.map((event) => (
              <MissionListRow
                key={event.id}
                event={event}
                onOpenDossier={handleOpenDossier}
              />
            ))}
          </div>
        )
      ) : (
        <div className="py-16 text-center font-mono text-bone-dim uppercase tracking-wider border border-dashed border-bone/30 p-8 space-y-3">
          <p className="text-base text-bone">No competitions found matching your filters.</p>
          <button
            onClick={() => {
              setFilterMode('ALL');
              setFilterDiscipline('ALL');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-bone text-ink font-label font-bold text-xs uppercase tracking-widest hover:bg-crimson hover:text-bone transition-colors cursor-pointer"
          >
            Clear Search &amp; Show All
          </button>
        </div>
      )}

      {/* Open Arena Briefing Banner */}
      <div className="mt-14 border-2 border-bone p-6 bg-bone/[0.03] relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] tracking-[0.2em] text-crimson font-bold uppercase mb-1">
              Campus Showcase // Central Courtyard
            </div>
            <h3 className="font-display text-2xl sm:text-3xl text-bone uppercase tracking-wide mb-2">
              The Open Arena
            </h3>
            <p className="font-label text-sm text-bone-dim max-w-2xl leading-relaxed">
              Throughout the Round 2 on-campus finale at DPS R.K. Puram, the central courtyard hosts the Open Arena, featuring aeromodelling flight trials, drone obstacle courses, and hands-on demonstrations for all visiting schools and students.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <Link
              to="/format"
              className="px-4 py-2 bg-bone text-ink font-label font-bold text-xs uppercase tracking-widest border border-bone hover:bg-crimson hover:text-bone hover:border-crimson transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <span>Venue &amp; Dates</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Dedicated Full Mission Dossier Modal */}
      {selectedEvent && (
        <MissionDossierModal
          event={selectedEvent}
          onClose={handleCloseDossier}
        />
      )}
    </div>
  );
};

export default Comps;
