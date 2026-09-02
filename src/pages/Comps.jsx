import React, { useState, useMemo } from 'react';
import SectionHeader from '../components/SectionHeader';
import { events, eventOutline } from '../data/events';

const EventCard = ({ event, index, defaultExpanded = false }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="border-b-2 border-bone/30 last:border-b-0 py-6 transition-colors">
      {/* Header Row */}
      <div
        className="cursor-pointer group select-none"
        onClick={() => setExpanded(!expanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setExpanded(!expanded);
          }
        }}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-3 mb-2">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-sm sm:text-base text-crimson font-bold tracking-wider">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="font-display text-2xl sm:text-3xl text-bone uppercase tracking-wide group-hover:text-crimson transition-colors">
              {event.name}
            </h3>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`font-mono text-[10px] tracking-widest uppercase border px-2.5 py-0.5 font-bold ${
                event.mode === 'Onsite'
                  ? 'bg-bone text-ink border-bone'
                  : 'bg-ink text-bone border-bone'
              }`}
            >
              {event.mode}
            </span>
            {event.eligibility && (
              <span className="font-mono text-[10px] tracking-widest uppercase border border-bone/40 text-bone-dim px-2 py-0.5">
                {event.eligibility}
              </span>
            )}
            {event.team && (
              <span className="font-mono text-[10px] tracking-widest uppercase border border-crimson/60 text-crimson px-2 py-0.5 font-bold">
                {event.team}
              </span>
            )}
            <span className="font-mono text-xs text-bone-dim group-hover:text-crimson transition-colors ml-1">
              {expanded ? '▲ [COLLAPSE]' : '▼ [DETAILS]'}
            </span>
          </div>
        </div>

        {/* Quote if present */}
        {event.quote && (
          <p className="font-label italic text-sm text-crimson font-medium mb-2 pl-3 border-l-2 border-crimson">
            {event.quote}
          </p>
        )}

        {/* Overview summary */}
        <p className="font-label text-sm sm:text-base text-bone-dim leading-relaxed max-w-4xl">
          {event.overview}
        </p>
      </div>

      {/* Expanded Detailed Breakdown */}
      {expanded && (
        <div className="mt-6 border-2 border-bone/40 bg-bone/[0.04] p-5 sm:p-7 space-y-6 animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Categories / Tracks if applicable */}
          {event.categories && event.categories.length > 0 && (
            <div>
              <h4 className="font-mono text-xs tracking-[0.2em] text-crimson uppercase font-bold mb-3 border-b border-bone/20 pb-1 flex items-center gap-2">
                <span>◆ Category & Track Breakdown</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.categories.map((cat, i) => (
                  <div key={i} className="border border-bone/30 p-3.5 bg-ink/40">
                    <div className="font-label font-bold text-bone uppercase tracking-wider text-sm mb-1.5 text-crimson">
                      {cat.name}
                    </div>
                    <p className="font-label text-xs sm:text-sm text-bone-dim leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rounds & Guidelines */}
          {event.rounds && event.rounds.length > 0 && (
            <div>
              <h4 className="font-mono text-xs tracking-[0.2em] text-crimson uppercase font-bold mb-3 border-b border-bone/20 pb-1 flex items-center gap-2">
                <span>◆ Structure & Guidelines</span>
              </h4>
              <div className="space-y-4 font-label text-sm text-bone-dim">
                {event.rounds.map((round, i) => (
                  <div key={i} className="border-l-2 border-bone/60 pl-4 py-1">
                    <div className="font-label font-bold text-bone uppercase tracking-wider text-sm sm:text-base mb-1">
                      {round.title}
                    </div>
                    <p className="leading-relaxed text-bone-dim">
                      {round.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Software Requirements if applicable */}
          {event.software && (
            <div className="pt-2">
              <h4 className="font-mono text-[11px] tracking-[0.15em] text-bone uppercase font-bold mb-2">
                Approved 3D / CAD Software:
              </h4>
              <div className="flex flex-wrap gap-2">
                {event.software.map((sw, i) => (
                  <span
                    key={i}
                    className="font-mono text-[10px] tracking-wider uppercase border border-bone/50 text-bone px-2 py-0.5 bg-bone/10 font-bold"
                  >
                    {sw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Template Link if applicable */}
          {event.templateUrl && (
            <div className="p-3 border border-crimson/50 bg-crimson/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-crimson font-bold block">Resource Document</span>
                <span className="font-label text-sm text-bone font-bold">{event.templateLabel || 'Submission Template'}</span>
              </div>
              <a
                href={event.templateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-1.5 bg-crimson text-bone font-label font-bold text-xs uppercase tracking-widest border border-crimson hover:bg-ink hover:text-crimson transition-colors whitespace-nowrap self-start sm:self-auto"
              >
                Open Template ↗
              </a>
            </div>
          )}

          {/* Safety Rules if applicable */}
          {event.safetyRules && (
            <div className="border border-crimson/60 bg-ink/60 p-4">
              <h4 className="font-mono text-xs tracking-[0.2em] text-crimson uppercase font-bold mb-2 flex items-center gap-1.5">
                <span>⚠ Mandatory Safety Protocol</span>
              </h4>
              <ul className="list-disc pl-5 space-y-1 font-label text-xs sm:text-sm text-bone-dim marker:text-crimson">
                {event.safetyRules.map((rule, i) => (
                  <li key={i}>{rule}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Two Columns: Judgement Criteria & Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-bone/20">
            {/* Criteria */}
            {event.criteria && event.criteria.length > 0 && (
              <div>
                <h4 className="font-mono text-xs tracking-[0.2em] text-crimson uppercase font-bold mb-3">
                  Judgement Criteria
                </h4>
                <ul className="space-y-1.5 font-label text-sm text-bone-dim list-disc pl-4 marker:text-crimson">
                  {event.criteria.map((c, i) => (
                    <li key={i} className="leading-snug">{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Timeline */}
            {event.timeline && event.timeline.length > 0 && (
              <div>
                <h4 className="font-mono text-xs tracking-[0.2em] text-crimson uppercase font-bold mb-3">
                  Timeline & Key Dates
                </h4>
                <dl className="space-y-2 font-mono text-xs">
                  {event.timeline.map((item, i) => (
                    <div key={i} className="flex justify-between border-b border-bone/20 pb-1 gap-2">
                      <dt className="text-bone-dim uppercase">{item.label}</dt>
                      <dd className="text-crimson font-bold text-right">{item.date}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>

          {/* Registration CTA Footer inside card */}
          <div className="pt-3 border-t border-bone/20 flex justify-between items-center flex-wrap gap-3">
            <span className="font-mono text-[10px] tracking-widest uppercase text-bone-dim">
              Event ID: CC26-E{event.id}
            </span>
            <a
              href="/celestecon_registration.html"
              className="px-4 py-1.5 bg-bone text-ink font-label font-bold text-xs uppercase tracking-widest border border-bone hover:bg-crimson hover:text-bone hover:border-crimson transition-colors"
            >
              Register For Event ↗
            </a>
          </div>

        </div>
      )}
    </div>
  );
};

const Comps = () => {
  const [filterMode, setFilterMode] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandAll, setExpandAll] = useState(false);

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchesMode =
        filterMode === 'ALL' || e.mode.toLowerCase() === filterMode.toLowerCase();
      const matchesSearch =
        searchQuery === '' ||
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.eligibility.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesMode && matchesSearch;
    });
  }, [filterMode, searchQuery]);

  return (
    <div className="max-w-5xl">
      <SectionHeader section="03" title="The Comps" jp="競技一覧" />

      {/* Event Outline Masthead */}
      <div className="mt-8 mb-10 border-2 border-bone p-6 sm:p-8 bg-bone/[0.03]">
        <div className="font-mono text-xs tracking-[0.2em] text-crimson font-bold uppercase mb-2">
          {eventOutline.title}
        </div>
        <p className="font-label text-base sm:text-lg text-bone leading-relaxed">
          {eventOutline.description}
        </p>
      </div>

      {/* Controls & Filter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        {/* Mode Filters */}
        <div className="flex gap-2 flex-wrap">
          {['ALL', 'HYBRID', 'ONSITE'].map((mode) => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              className={`px-3 py-1 font-mono text-xs uppercase tracking-widest font-bold border transition-colors ${
                filterMode === mode
                  ? 'bg-crimson text-bone border-crimson'
                  : 'bg-ink text-bone-dim border-bone/40 hover:border-bone hover:text-bone'
              }`}
            >
              {mode} ({mode === 'ALL' ? events.length : events.filter(e => e.mode.toUpperCase() === mode).length})
            </button>
          ))}
        </div>

        {/* Search and Expand All Toggle */}
        <div className="flex gap-3 items-center">
          <input
            type="text"
            placeholder="Filter competitions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-ink border-2 border-bone/40 px-3 py-1 text-sm font-label text-bone placeholder:text-bone-dim/50 focus:border-crimson outline-none w-full sm:w-48"
          />
          <button
            onClick={() => setExpandAll(!expandAll)}
            className="px-3 py-1 font-mono text-xs uppercase tracking-widest font-bold border border-bone/60 text-bone hover:bg-bone hover:text-ink transition-colors whitespace-nowrap"
          >
            {expandAll ? 'Collapse All' : 'Expand All'}
          </button>
        </div>
      </div>

      {/* Events Roster */}
      <div className="border-t-2 border-bone">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => (
            <EventCard
              key={`${event.id}-${expandAll}`}
              event={event}
              index={events.findIndex(e => e.id === event.id)}
              defaultExpanded={expandAll}
            />
          ))
        ) : (
          <div className="py-12 text-center font-mono text-bone-dim uppercase tracking-wider">
            No events found matching "{searchQuery}".
          </div>
        )}
      </div>

      {/* Open Arena Exhibit Notice */}
      <div className="mt-16 border-2 border-bone p-6 bg-bone/5">
        <div className="font-mono text-[10px] tracking-[0.2em] text-crimson font-bold uppercase mb-2">
          Exhibit // On-Campus Only
        </div>
        <h3 className="font-display text-2xl text-bone uppercase tracking-wide mb-2">
          The Open Arena
        </h3>
        <p className="font-label text-sm text-bone-dim max-w-2xl leading-relaxed">
          Throughout the Round 2 on-campus finale, the central courtyard hosts the Open Arena. Features Aeromodelling flight tests, PlaneRush, SpaceDunk, and branded minigames for all-day engagement.
        </p>
      </div>
    </div>
  );
};

export default Comps;
