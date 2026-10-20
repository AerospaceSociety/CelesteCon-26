import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  resultsMetadata,
  hybridEventsResults
} from '../data/round1Results';

const Results = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Jump smoothly to a specific event section
  const handleJumpToEvent = (eventId) => {
    setDropdownOpen(false);
    const target = document.getElementById(`event-${eventId}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Filter qualifiers by search query across events
  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return hybridEventsResults;

    const query = searchQuery.toLowerCase().trim();
    return hybridEventsResults
      .map(event => ({
        ...event,
        qualifiers: event.qualifiers.filter(q =>
          q.schoolName.toLowerCase().includes(query) ||
          q.schoolUID.toLowerCase().includes(query) ||
          q.teamName.toLowerCase().includes(query) ||
          (q.category && q.category.toLowerCase().includes(query))
        )
      }))
      .filter(event => event.qualifiers.length > 0);
  }, [searchQuery]);

  return (
    <div className="py-4 sm:py-6 max-w-5xl mx-auto space-y-8">
      {/* Page Header */}
      <header className="border-b-2 border-bone pb-4 sm:pb-6">
        <div className="flex flex-wrap justify-between items-baseline gap-2 mb-2 font-mono text-xs uppercase tracking-widest text-bone-dim">
          <span>CelesteCon 2026 // AEROSS</span>
          <span>Published: {resultsMetadata.publicationDate}</span>
        </div>

        <h1 className="font-display text-3xl sm:text-5xl text-bone uppercase tracking-wide">
          Round 1 Results <span className="text-crimson">(Finalists)</span>
        </h1>

        <p className="font-label text-sm sm:text-base text-bone-dim mt-2 leading-relaxed">
          Official list of qualified schools and teams advancing to the Round 2 Grand Finale on <strong className="text-bone">24 October 2026</strong> at Delhi Public School, R.K. Puram.
        </p>

        {/* Clear Unranked Order Notice */}
        <div className="mt-4 p-3 bg-crimson/10 border-l-4 border-crimson font-mono text-xs text-bone">
          <strong className="text-crimson uppercase tracking-wider block mb-0.5">
            Important Notice // No Ranked Order
          </strong>
          <span>
            All qualifying delegations below are listed in <strong>no ranked order</strong>. S.No. is solely for indexing. Preliminary scores carry zero rank bias into Round 2.
          </span>
        </div>
      </header>

      {/* Control Strip: Search Bar + Jump to Event/Venue Dropdown */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search school name, UID, or team..."
            className="w-full px-3 py-2.5 bg-ink-2/60 border-2 border-bone text-bone font-mono text-xs placeholder:text-bone-dim/50 focus:outline-none focus:border-crimson"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-bone-dim hover:text-crimson text-xs font-mono"
            >
              ✕ Clear
            </button>
          )}
        </div>

        {/* PROPER DROPDOWN BUTTON: Choose Event / Venue to Jump */}
        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full sm:w-auto px-4 py-2.5 bg-crimson hover:bg-ink text-bone-hi hover:text-crimson border-2 border-crimson font-label text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-between sm:justify-start gap-2.5 shadow-md cursor-pointer"
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Jump to Event / Venue</span>
            </div>
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu Popover */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-full sm:w-80 bg-ink border-2 border-bone shadow-2xl z-50 p-1.5 animate-in fade-in duration-150">
              <div className="px-3 py-1.5 font-mono text-[10px] text-bone-dim uppercase tracking-[0.16em] border-b border-bone/20 font-bold flex justify-between">
                <span>Select Event Arena</span>
                <span className="text-crimson">会場選択</span>
              </div>

              <div className="py-1 space-y-1">
                {hybridEventsResults.map(ev => (
                  <button
                    key={ev.eventId}
                    type="button"
                    onClick={() => handleJumpToEvent(ev.eventId)}
                    className="w-full text-left p-2.5 hover:bg-bone/10 border border-transparent hover:border-bone/30 transition-colors cursor-pointer group flex flex-col"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-label font-bold text-xs uppercase tracking-wider text-bone group-hover:text-crimson">
                        Event {ev.eventId} · {ev.name} ({ev.code})
                      </span>
                      <span className="font-mono text-[10px] text-crimson font-bold">
                        &darr;
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-bone-dim mt-0.5 flex items-center gap-1">
                      <span className="text-crimson">Venue:</span> {ev.venue}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Event Results Tables */}
      {filteredEvents.length === 0 ? (
        <div className="border border-dashed border-bone/40 p-8 text-center text-bone-dim font-mono text-xs">
          No matching schools or teams found for "{searchQuery}".
          <div className="mt-2">
            <button
              onClick={() => setSearchQuery('')}
              className="text-crimson underline uppercase font-bold"
            >
              Clear search filter
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {filteredEvents.map(event => {
            const hasDivisions = event.hasCategories;
            const juniorQualifiers = hasDivisions
              ? event.qualifiers.filter(q => q.category && q.category.toLowerCase().includes('junior'))
              : [];
            const seniorQualifiers = hasDivisions
              ? event.qualifiers.filter(q => q.category && q.category.toLowerCase().includes('senior'))
              : event.qualifiers;

            return (
              <section
                key={event.eventId}
                id={`event-${event.eventId}`}
                className="border-2 border-bone bg-ink-2/20 p-4 sm:p-6 scroll-mt-20"
              >
                {/* Event Heading & Venue Badge */}
                <div className="border-b-2 border-bone pb-3 mb-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 bg-crimson text-bone-hi uppercase">
                        Event {event.eventId} · {event.code}
                      </span>
                      <span className="font-mono text-[11px] text-bone-dim border border-bone/40 px-2 py-0.5 uppercase flex items-center gap-1">
                        <strong className="text-crimson">Venue:</strong> {event.venue}
                      </span>
                    </div>

                    <h2 className="font-display text-2xl sm:text-3xl text-bone uppercase tracking-wide inline-block">
                      {event.name}
                    </h2>
                    <span className="font-label text-xs sm:text-sm text-bone-dim ml-2 uppercase">
                      ({event.discipline})
                    </span>
                  </div>

                  <span className="font-mono text-xs text-bone-dim uppercase">
                    {event.qualifiers.length} Qualified Teams
                  </span>
                </div>

                {hasDivisions ? (
                  /* Two Tables for Junior & Senior Divisions */
                  <div className="space-y-6">
                    {/* Junior Division Table */}
                    {juniorQualifiers.length > 0 && (
                      <div>
                        <h3 className="font-label font-bold text-sm uppercase tracking-wider text-crimson mb-2 flex items-center justify-between">
                          <span>Junior Division (Grades 6–8)</span>
                          <span className="font-mono text-xs text-bone-dim font-normal">
                            {juniorQualifiers.length} Teams
                          </span>
                        </h3>
                        <ResultTable qualifiers={juniorQualifiers} />
                      </div>
                    )}

                    {/* Senior Division Table */}
                    {seniorQualifiers.length > 0 && (
                      <div>
                        <h3 className="font-label font-bold text-sm uppercase tracking-wider text-crimson mb-2 flex items-center justify-between">
                          <span>Senior Division (Grades 9–12)</span>
                          <span className="font-mono text-xs text-bone-dim font-normal">
                            {seniorQualifiers.length} Teams
                          </span>
                        </h3>
                        <ResultTable qualifiers={seniorQualifiers} />
                      </div>
                    )}
                  </div>
                ) : (
                  /* Single Table for Events without Division Split */
                  <ResultTable qualifiers={event.qualifiers} />
                )}
              </section>
            );
          })}
        </div>
      )}

      {/* Onsite Grand Finale Guidelines & Regulations */}
      <footer className="border-2 border-bone bg-ink p-5 sm:p-6 font-mono text-xs text-bone-dim space-y-4">
        <div className="border-b border-bone/30 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="text-bone font-bold uppercase tracking-wider text-base flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-crimson rounded-full animate-pulse"></span>
            <span>Round 2 Grand Finale Guidelines // 会場規程</span>
          </div>
          <span className="text-[11px] text-crimson font-bold uppercase tracking-wider">
            DPS R.K. Puram · 24 Oct 2026
          </span>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed">
          <li className="border border-bone/20 p-3 bg-bone/5 flex items-start gap-2.5">
            <span className="text-crimson font-bold shrink-0">01.</span>
            <div>
              <strong className="text-bone uppercase block mb-0.5">Event Date &amp; Registration</strong>
              <span>Event DATE: <strong className="text-bone">24th Oct</strong>. Registration starts at <strong className="text-bone">07:45 AM</strong> at Delhi Public School, Sector 12, R.K. Puram, New Delhi — 110022.</span>
            </div>
          </li>

          <li className="border border-bone/20 p-3 bg-bone/5 flex items-start gap-2.5">
            <span className="text-crimson font-bold shrink-0">02.</span>
            <div>
              <strong className="text-bone uppercase block mb-0.5">Uniform</strong>
              <span><strong className="text-bone">School uniform</strong> is mandatory for all participating students.</span>
            </div>
          </li>

          <li className="border border-bone/20 p-3 bg-bone/5 flex items-start gap-2.5">
            <span className="text-crimson font-bold shrink-0">03.</span>
            <div>
              <strong className="text-bone uppercase block mb-0.5">Mobile Phones &amp; Laptops Policy</strong>
              <span>Students are <strong className="text-bone">not allowed to bring their mobile phone</strong>. They may bring their <strong className="text-bone">Laptop</strong> if their event requires it.</span>
            </div>
          </li>

          <li className="border border-bone/20 p-3 bg-bone/5 flex items-start gap-2.5">
            <span className="text-crimson font-bold shrink-0">04.</span>
            <div>
              <strong className="text-bone uppercase block mb-0.5">Teacher In-Charge</strong>
              <span>The School should send <strong className="text-bone">only one teacher in charge</strong> for all the competitions.</span>
            </div>
          </li>

          <li className="border border-bone/20 p-3 bg-bone/5 flex items-start gap-2.5">
            <span className="text-crimson font-bold shrink-0">05.</span>
            <div>
              <strong className="text-bone uppercase block mb-0.5">Refreshments</strong>
              <span><strong className="text-bone">Refreshment would be provided by the school</strong> for delegates and accompanying faculty.</span>
            </div>
          </li>

          <li className="border border-bone/20 p-3 bg-bone/5 flex items-start gap-2.5">
            <span className="text-crimson font-bold shrink-0">06.</span>
            <div>
              <strong className="text-bone uppercase block mb-0.5">Valedictory Ceremony &amp; Dispersal</strong>
              <span>The valedictory ceremony ends at <strong className="text-bone">01:00 PM</strong>, after which students are free to leave. Detailed timeline is available at{' '}
                <a
                  href="https://celestecon.aeross.org/format"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-crimson underline font-bold hover:text-bone"
                >
                  https://celestecon.aeross.org/format
                </a>.
              </span>
            </div>
          </li>
        </ul>

        <div className="pt-3 border-t border-bone/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[11px]">
          <span>
            For queries, join the official{' '}
            <a
              href={resultsMetadata.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-crimson underline hover:text-bone font-bold"
            >
              Discord Server
            </a>{' '}
            or email{' '}
            <a
              href={`mailto:${resultsMetadata.supportEmail}`}
              className="text-crimson underline hover:text-bone font-bold"
            >
              {resultsMetadata.supportEmail}
            </a>.
          </span>
          <span className="text-bone-dim/60 uppercase">
            AEROSS // DPS R.K. PURAM
          </span>
        </div>
      </footer>
    </div>
  );
};

// Simple, Clean Result Table Component strictly with the 4 columns requested
const ResultTable = ({ qualifiers }) => {
  return (
    <div className="overflow-x-auto border border-bone/60">
      <table className="w-full text-left font-mono text-xs">
        <thead className="bg-bone text-ink font-bold uppercase text-[11px] border-b-2 border-bone">
          <tr>
            <th className="p-2.5 w-16 text-center">S.No.</th>
            <th className="p-2.5">Name of the School</th>
            <th className="p-2.5 w-36 whitespace-nowrap">School UID</th>
            <th className="p-2.5 w-48 sm:w-64">Team Name</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-bone/20 bg-ink">
          {qualifiers.map((item, index) => (
            <tr
              key={item.id || index}
              className="hover:bg-bone/10 transition-colors"
            >
              <td className="p-2.5 text-center text-bone-dim font-bold">
                {index + 1}
              </td>
              <td className="p-2.5">
                <span className="font-label font-bold text-sm text-bone uppercase tracking-wide block">
                  {item.schoolName}
                </span>
              </td>
              <td className="p-2.5 font-bold text-crimson whitespace-nowrap">
                {item.schoolUID}
              </td>
              <td className="p-2.5 font-bold text-bone">
                {item.teamName}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Results;
