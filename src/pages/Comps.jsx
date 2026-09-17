import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import { events } from '../data/events';

const EventCard = ({ event, index, defaultExpanded = false }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [activeTab, setActiveTab] = useState('rounds'); // 'rounds' | 'tracks' | 'criteria' | 'resources'

  const hasTracks = (event.categories && event.categories.length > 0) || (event.software && event.software.length > 0);
  const hasResources = event.templateUrl || event.safetyRules;
  const hasCriteria = (event.criteria && event.criteria.length > 0) || (event.timeline && event.timeline.length > 0);

  return (
    <div className={`border-2 transition-all duration-200 mb-5 ${
      expanded ? 'border-bone bg-bone/[0.03] shadow-lg' : 'border-bone/40 bg-ink/70 hover:border-bone hover:bg-bone/[0.02]'
    }`}>
      {/* Clickable Header Bar */}
      <div
        className="p-5 sm:p-6 cursor-pointer select-none group"
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
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 mb-2.5">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-sm sm:text-base text-crimson font-bold tracking-wider">
              № {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="font-display text-2xl sm:text-3xl text-bone uppercase tracking-wide group-hover:text-crimson transition-colors">
              {event.name}
            </h3>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`font-mono text-[10px] tracking-widest uppercase px-2.5 py-0.5 font-bold border ${
                event.mode === 'Onsite'
                  ? 'bg-bone text-ink border-bone'
                  : 'bg-crimson/20 text-bone-hi border-crimson/60'
              }`}
            >
              {event.mode}
            </span>
            {event.eligibility && (
              <span className="font-mono text-[10px] tracking-widest uppercase border border-bone/30 text-bone-dim px-2 py-0.5">
                {event.eligibility}
              </span>
            )}
            {event.team && (
              <span className="font-mono text-[10px] tracking-widest uppercase border border-bone/50 text-bone px-2 py-0.5 font-bold">
                {event.team}
              </span>
            )}
            <span className="font-mono text-xs text-bone-dim group-hover:text-crimson transition-colors ml-1 font-bold">
              {expanded ? '▲ Hide Details' : '▼ View Details'}
            </span>
          </div>
        </div>

        {/* Short Hook / Tagline */}
        <p className="font-label text-sm sm:text-base text-bone-dim leading-relaxed max-w-4xl">
          {event.hook || event.overview}
        </p>
      </div>

      {/* Structured Expanded Drawer */}
      {expanded && (
        <div className="border-t-2 border-bone/30 p-5 sm:p-7 bg-ink/90 space-y-6 animate-in fade-in duration-200">
          
          {/* Quote if present */}
          {event.quote && (
            <div className="font-label italic text-xs sm:text-sm text-bone pl-3 border-l-2 border-crimson py-0.5 bg-crimson/5">
              {event.quote}
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 border-b border-bone/20 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab('rounds')}
              className={`px-3 py-1 font-mono text-xs uppercase tracking-wider font-bold transition-colors ${
                activeTab === 'rounds'
                  ? 'bg-crimson text-bone-hi'
                  : 'text-bone-dim hover:text-bone hover:bg-bone/10'
              }`}
            >
              Format &amp; Rounds
            </button>
            {hasTracks && (
              <button
                type="button"
                onClick={() => setActiveTab('tracks')}
                className={`px-3 py-1 font-mono text-xs uppercase tracking-wider font-bold transition-colors ${
                  activeTab === 'tracks'
                    ? 'bg-crimson text-bone-hi'
                    : 'text-bone-dim hover:text-bone hover:bg-bone/10'
                }`}
              >
                Tracks &amp; Requirements
              </button>
            )}
            {hasCriteria && (
              <button
                type="button"
                onClick={() => setActiveTab('criteria')}
                className={`px-3 py-1 font-mono text-xs uppercase tracking-wider font-bold transition-colors ${
                  activeTab === 'criteria'
                    ? 'bg-crimson text-bone-hi'
                    : 'text-bone-dim hover:text-bone hover:bg-bone/10'
                }`}
              >
                Criteria &amp; Dates
              </button>
            )}
            {hasResources && (
              <button
                type="button"
                onClick={() => setActiveTab('resources')}
                className={`px-3 py-1 font-mono text-xs uppercase tracking-wider font-bold transition-colors ${
                  activeTab === 'resources'
                    ? 'bg-crimson text-bone-hi'
                    : 'text-bone-dim hover:text-bone hover:bg-bone/10'
                }`}
              >
                Templates &amp; Safety
              </button>
            )}
          </div>

          {/* Tab Content: Format & Rounds */}
          {activeTab === 'rounds' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <p className="font-label text-sm text-bone-dim leading-relaxed">
                {event.overview}
              </p>
              {event.rounds && event.rounds.length > 0 && (
                <div className="space-y-3 pt-2">
                  {event.rounds.map((round, i) => (
                    <div key={i} className="border-l-2 border-bone/60 pl-4 py-1 bg-bone/[0.02]">
                      <div className="font-label font-bold text-bone uppercase tracking-wider text-sm mb-1">
                        {round.title}
                      </div>
                      <p className="font-label text-xs sm:text-sm text-bone-dim leading-relaxed">
                        {round.desc}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab Content: Tracks & Requirements */}
          {activeTab === 'tracks' && hasTracks && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {event.categories && event.categories.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.categories.map((cat, i) => (
                    <div key={i} className="border border-bone/30 p-4 bg-ink">
                      <div className="font-label font-bold text-crimson uppercase tracking-wider text-sm mb-1.5">
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
                <div className="pt-2">
                  <div className="font-mono text-xs text-bone uppercase tracking-wider font-bold mb-2">
                    Approved 3D / CAD Software:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {event.software.map((sw, i) => (
                      <span
                        key={i}
                        className="font-mono text-[10.5px] tracking-wider uppercase border border-bone/40 text-bone px-2.5 py-1 bg-bone/10 font-bold"
                      >
                        {sw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab Content: Criteria & Dates */}
          {activeTab === 'criteria' && hasCriteria && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-150">
              {event.criteria && event.criteria.length > 0 && (
                <div>
                  <h4 className="font-mono text-xs tracking-[0.2em] text-crimson uppercase font-bold mb-3">
                    Evaluation Criteria
                  </h4>
                  <ul className="space-y-1.5 font-label text-sm text-bone-dim list-disc pl-4 marker:text-crimson">
                    {event.criteria.map((c, i) => (
                      <li key={i} className="leading-snug">{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {event.timeline && event.timeline.length > 0 && (
                <div>
                  <h4 className="font-mono text-xs tracking-[0.2em] text-crimson uppercase font-bold mb-3">
                    Key Dates
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
          )}

          {/* Tab Content: Resources & Safety */}
          {activeTab === 'resources' && hasResources && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {event.templateUrl && (
                <div className="p-4 border border-crimson/50 bg-crimson/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-crimson font-bold block">
                      Official Resource File
                    </span>
                    <span className="font-label text-sm text-bone font-bold">
                      {event.templateLabel || 'Submission Template'}
                    </span>
                  </div>
                  <a
                    href={event.templateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-crimson text-bone font-label font-bold text-xs uppercase tracking-widest hover:bg-ink hover:text-crimson transition-colors whitespace-nowrap self-start sm:self-auto border border-crimson"
                  >
                    Open Template ↗
                  </a>
                </div>
              )}

              {event.safetyRules && (
                <div className="border border-crimson/60 bg-ink p-4">
                  <h4 className="font-mono text-xs tracking-[0.2em] text-crimson uppercase font-bold mb-2 flex items-center gap-1.5">
                    <span>⚠ Mandatory Safety Protocol</span>
                  </h4>
                  <ul className="list-disc pl-5 space-y-1.5 font-label text-xs sm:text-sm text-bone-dim marker:text-crimson">
                    {event.safetyRules.map((rule, i) => (
                      <li key={i}>{rule}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Card Footer Actions */}
          <div className="pt-4 border-t border-bone/20 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <span className="font-mono text-[10px] tracking-widest uppercase text-bone-dim">
              ID: CC26-E{event.id}
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {event.mode === 'Hybrid' && (
                <>
                  <Link
                    to="/prompts"
                    className="px-3 py-1.5 border border-bone/40 text-bone font-label font-bold text-xs uppercase tracking-widest hover:border-crimson hover:text-crimson transition-colors"
                  >
                    View Prompt Brief
                  </Link>
                  <Link
                    to="/submissions"
                    className="px-3 py-1.5 border border-crimson text-crimson font-label font-bold text-xs uppercase tracking-widest hover:bg-crimson hover:text-bone transition-colors"
                  >
                    Submit Entry
                  </Link>
                </>
              )}
              <a
                href="/celestecon_registration.html"
                className="px-4 py-1.5 bg-bone text-ink font-label font-bold text-xs uppercase tracking-widest border border-bone hover:bg-crimson hover:text-bone hover:border-crimson transition-colors"
              >
                Register For Event ↗
              </a>
            </div>
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

      {/* Clean Intro Strip */}
      <p className="font-label text-base md:text-lg text-bone-dim mt-4 mb-6 max-w-3xl leading-relaxed">
        Explore the full roster of CelesteCon 2026 competitions spanning aerospace engineering, orbital habitability, rocketry, commercial venture pitches, robotics, gaming, and space theatre.
      </p>

      {/* Offline Schedule Responsibility Advisory Notice */}
      <div className="mb-8 p-4 border border-crimson/80 bg-crimson/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <span className="font-mono text-xs text-crimson font-bold uppercase tracking-widest block mb-0.5">
            ◆ Multi-Competition &amp; Schedule Advisory
          </span>
          <span className="font-label text-xs sm:text-sm text-bone-dim leading-relaxed block">
            Students are permitted to participate in multiple competitions. However, onsite timings during the offline finals may clash; coordinating attendance across events is the responsibility of the student and school coordinator.
          </span>
        </div>
        <a
          href="/celestecon_registration.html"
          className="px-4 py-1.5 bg-crimson text-bone font-mono text-xs uppercase tracking-wider hover:bg-ink hover:text-crimson transition-colors whitespace-nowrap shrink-0 border border-crimson font-bold"
        >
          Register Teams ↗
        </a>
      </div>

      {/* Quick Portals Strip */}
      <div className="mb-6 flex flex-wrap gap-3 items-center justify-between border-b-2 border-bone pb-4">
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

        <div className="flex gap-3 items-center w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search competitions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-ink border border-bone/50 px-3 py-1 text-xs sm:text-sm font-label text-bone placeholder:text-bone-dim/40 focus:border-crimson outline-none w-full sm:w-52"
          />
          <button
            onClick={() => setExpandAll(!expandAll)}
            className="px-3 py-1 font-mono text-xs uppercase tracking-widest font-bold border border-bone/60 text-bone hover:bg-bone hover:text-ink transition-colors whitespace-nowrap"
          >
            {expandAll ? 'Collapse All' : 'Expand All'}
          </button>
        </div>
      </div>

      {/* Event Cards List */}
      <div className="space-y-4">
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
          <div className="py-12 text-center font-mono text-bone-dim uppercase tracking-wider border border-dashed border-bone/30 p-8">
            No competitions found matching "{searchQuery}".
          </div>
        )}
      </div>

      {/* Open Arena Banner */}
      <div className="mt-14 border-2 border-bone p-6 bg-bone/[0.03]">
        <div className="font-mono text-[10px] tracking-[0.2em] text-crimson font-bold uppercase mb-1">
          Open Arena Exhibition // On-Campus
        </div>
        <h3 className="font-display text-2xl text-bone uppercase tracking-wide mb-2">
          The Open Arena
        </h3>
        <p className="font-label text-sm text-bone-dim max-w-2xl leading-relaxed">
          Throughout the Round 2 on-campus finale at DPS R.K. Puram, the central courtyard hosts the Open Arena, featuring aeromodelling flight trials, drone obstacle courses, and hands-on demonstrations for all visiting schools and students.
        </p>
      </div>

    </div>
  );
};

export default Comps;
