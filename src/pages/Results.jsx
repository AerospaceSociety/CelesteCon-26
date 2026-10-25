import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  eventResults,
  finalResultsMetadata,
  schoolMedalLeaderboard
} from '../data/finalResults';
import {
  hybridEventsResults,
  resultsMetadata as round1Metadata
} from '../data/round1Results';

const Results = () => {
  const [activeTab, setActiveTab] = useState('final'); // 'final' or 'round1'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDivision, setFilterDivision] = useState('ALL');

  // Filter Final Event Results
  const filteredFinalEvents = useMemo(() => {
    return eventResults.filter(event => {
      const matchesDivision =
        filterDivision === 'ALL' ||
        (filterDivision === 'SENIOR' && event.division.includes('Senior')) ||
        (filterDivision === 'JUNIOR' && event.division.includes('Junior')) ||
        (filterDivision === 'OPEN' && event.division.includes('Open'));

      if (!matchesDivision) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      return (
        event.name.toLowerCase().includes(q) ||
        event.discipline.toLowerCase().includes(q) ||
        event.first.toLowerCase().includes(q) ||
        event.second.toLowerCase().includes(q) ||
        event.third.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, filterDivision]);

  // Filter Round 1 Qualifiers (Archive)
  const filteredRound1Events = useMemo(() => {
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
          <span>CelesteCon 2026 // AEROSS Conclave</span>
          <span>Grand Finale Concluded: 24 Oct 2026</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-5xl text-bone uppercase tracking-wide">
              Conclave Results <span className="text-crimson">[Official]</span>
            </h1>
            <p className="font-label text-sm sm:text-base text-bone-dim mt-2 leading-relaxed max-w-3xl">
              Official podium standings declared for CelesteCon 2026. Held at Delhi Public School, R.K. Puram, uniting over 180 schools and 1,500+ participants nationwide.
            </p>
          </div>

          <div className="shrink-0">
            <span className="font-jp text-xs sm:text-sm text-crimson font-bold tracking-[0.2em] block">
              大会結果発表
            </span>
            <span className="font-mono text-[10px] text-bone-dim tracking-widest uppercase">
              STATUS: ADJUDICATED
            </span>
          </div>
        </div>

        {/* Tab Switcher: Final Winners vs Round 1 Qualifiers Archive */}
        <div className="flex items-center gap-2 mt-6 border-b-2 border-bone/30">
          <button
            type="button"
            onClick={() => setActiveTab('final')}
            className={`px-4 sm:px-6 py-2.5 font-label text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors border-b-4 -mb-[2px] cursor-pointer ${
              activeTab === 'final'
                ? 'border-crimson text-crimson bg-crimson/10 font-black'
                : 'border-transparent text-bone-dim hover:text-bone hover:border-bone/40'
            }`}
          >
            <span>★ Final Results (Winners &amp; Podiums)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('round1')}
            className={`px-4 sm:px-6 py-2.5 font-label text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors border-b-4 -mb-[2px] cursor-pointer ${
              activeTab === 'round1'
                ? 'border-crimson text-crimson bg-crimson/10 font-black'
                : 'border-transparent text-bone-dim hover:text-bone hover:border-bone/40'
            }`}
          >
            <span>Round 1 Qualifiers Archive</span>
          </button>
        </div>
      </header>

      {/* ========================================================
          TAB 1: FINAL RESULTS (WINNERS, OVERALL CHAMPION, 2027)
      ======================================================== */}
      {activeTab === 'final' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* OVERALL CHAMPIONS HERO BANNER */}
          <section className="border-4 border-crimson bg-gradient-to-br from-crimson/20 via-ink to-ink p-6 sm:p-8 relative overflow-hidden shadow-2xl">
            {/* Background Aesthetic Watermark */}
            <div className="absolute -right-6 -bottom-10 select-none pointer-events-none opacity-10">
              <span className="font-display text-[160px] leading-none text-crimson font-black">
                DPS
              </span>
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-crimson/40 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-crimson text-bone-hi font-mono text-[10px] font-bold uppercase tracking-widest animate-pulse">
                    🏆 OVERALL WINNER
                  </span>
                  <span className="font-mono text-xs text-bone-dim uppercase tracking-wider">
                    CelesteCon 2026 Rolling Trophy
                  </span>
                </div>
                <span className="font-jp text-xs text-crimson font-bold tracking-widest">
                  総合優勝校
                </span>
              </div>

              <div>
                <span className="font-mono text-xs sm:text-sm text-crimson font-bold tracking-[0.2em] uppercase block mb-1">
                  OVERALL CONCLAVE CHAMPIONS
                </span>
                <h2 className="font-display text-3xl sm:text-5xl md:text-6xl text-bone uppercase tracking-wide leading-tight">
                  DPS Noida
                </h2>
                <p className="font-label text-base sm:text-lg text-bone-dim mt-2 max-w-3xl leading-relaxed">
                  Delhi Public School, Noida claims the prestigious CelesteCon 2026 Overall Champions Rolling Trophy with an extraordinary display of aerospace excellence across both junior and senior divisions.
                </p>
              </div>

              {/* Medals Breakdown Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-ink/80 border-2 border-bone/30 p-3">
                  <div className="font-mono text-[10px] text-bone-dim uppercase tracking-wider">Total Podiums</div>
                  <div className="font-display text-2xl sm:text-3xl text-bone font-bold">7</div>
                </div>
                <div className="bg-ink/80 border-2 border-amber-500/50 p-3">
                  <div className="font-mono text-[10px] text-amber-400 uppercase tracking-wider">1st Positions (Gold)</div>
                  <div className="font-display text-2xl sm:text-3xl text-amber-400 font-bold">4</div>
                </div>
                <div className="bg-ink/80 border-2 border-slate-300/50 p-3">
                  <div className="font-mono text-[10px] text-slate-300 uppercase tracking-wider">2nd Positions (Silver)</div>
                  <div className="font-display text-2xl sm:text-3xl text-slate-300 font-bold">2</div>
                </div>
                <div className="bg-ink/80 border-2 border-amber-700/50 p-3">
                  <div className="font-mono text-[10px] text-amber-600 uppercase tracking-wider">3rd Positions (Bronze)</div>
                  <div className="font-display text-2xl sm:text-3xl text-amber-600 font-bold">1</div>
                </div>
              </div>
            </div>
          </section>

          {/* CELESTECON WILL BE BACK IN 2027 BANNER */}
          <section className="border-2 border-bone bg-bone text-ink p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] uppercase px-2 py-0.5 bg-crimson text-bone-hi font-bold">
                  NEXT RENDEZVOUS // 次回予告
                </span>
                <span className="font-mono text-xs text-ink-3 font-bold uppercase tracking-wider">
                  Edition VII
                </span>
              </div>
              <h3 className="font-display text-2xl sm:text-4xl uppercase tracking-tight text-ink">
                CelesteCon will be back in 2027
              </h3>
              <p className="font-label text-sm sm:text-base text-ink-2 leading-relaxed">
                Thank you to all 180+ participating schools, jury adjudicators, mentors, and the organizing secretariat of AEROSS. We look forward to welcoming the next generation of aerospace innovators back to campus in Autumn 2027.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 w-full md:w-auto">
              <Link
                to="/glimpses"
                className="px-5 py-2.5 bg-crimson text-bone-hi hover:bg-ink hover:text-crimson font-label text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors text-center"
              >
                View Glimpses &rarr;
              </Link>
              <Link
                to="/comps"
                className="px-5 py-2.5 bg-ink text-bone hover:bg-crimson hover:text-bone-hi font-label text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors text-center"
              >
                Explore The Comps &rarr;
              </Link>
            </div>
          </section>

          {/* Controls: Search & Division Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-2">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by school (e.g., DPS Noida, Tagore, BBPS) or event..."
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

            {/* Division Filters */}
            <div className="flex gap-1.5 shrink-0">
              {['ALL', 'SENIOR', 'JUNIOR', 'OPEN'].map((div) => (
                <button
                  key={div}
                  type="button"
                  onClick={() => setFilterDivision(div)}
                  className={`px-3 py-2 font-mono text-xs font-bold uppercase tracking-wider border transition-colors ${
                    filterDivision === div
                      ? 'bg-crimson text-bone-hi border-crimson'
                      : 'bg-ink text-bone-dim border-bone/40 hover:border-bone hover:text-bone'
                  }`}
                >
                  {div}
                </button>
              ))}
            </div>
          </div>

          {/* EVENT-BY-EVENT RESULTS GRID */}
          <section className="space-y-4">
            <div className="flex justify-between items-baseline border-b-2 border-bone pb-2 font-mono text-xs uppercase tracking-widest text-bone-dim">
              <span className="text-crimson font-bold">Podium Standings // All 12 Divisions</span>
              <span>Showing {filteredFinalEvents.length} Events</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {filteredFinalEvents.map((event) => (
                <div
                  key={event.id}
                  className="border-2 border-bone/60 bg-ink-2/40 hover:border-crimson transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-lg"
                >
                  {/* Event Header */}
                  <div className="p-3.5 sm:p-4 bg-bone/5 border-b border-bone/20 flex justify-between items-start gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-crimson font-bold">
                          EVENT {event.eventNumber}
                        </span>
                        <span className="text-bone-dim/40">•</span>
                        <span className="font-mono text-[10px] text-bone-dim uppercase tracking-wider">
                          {event.division}
                        </span>
                      </div>
                      <h3 className="font-display text-lg sm:text-xl text-bone uppercase tracking-wide mt-0.5">
                        {event.name}
                      </h3>
                      <p className="font-mono text-[11px] text-bone-dim mt-0.5">
                        {event.discipline}
                      </p>
                    </div>

                    <span className="px-2 py-0.5 border border-bone/30 font-mono text-[9px] uppercase tracking-wider text-bone-dim shrink-0">
                      {event.eligibility}
                    </span>
                  </div>

                  {/* Podium Standings (1st, 2nd, 3rd) */}
                  <div className="p-4 space-y-2.5">
                    {/* 1st Position */}
                    <div className="p-2.5 bg-amber-500/10 border-l-4 border-amber-500 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-amber-500 text-ink font-mono font-bold text-xs flex items-center justify-center shrink-0">
                          1
                        </div>
                        <div className="min-w-0">
                          <span className="font-mono text-[9px] text-amber-400 uppercase tracking-widest font-bold block">
                            1st Position // First Place
                          </span>
                          <span className="font-label font-bold text-sm sm:text-base text-bone tracking-wide block truncate">
                            {event.first}
                          </span>
                        </div>
                      </div>
                      <span className="text-amber-400 font-mono text-sm shrink-0">★</span>
                    </div>

                    {/* 2nd Position */}
                    <div className={`p-2.5 border-l-4 flex items-start justify-between gap-3 ${
                      event.second === '—'
                        ? 'bg-bone/5 border-bone/20 opacity-60'
                        : 'bg-slate-300/10 border-slate-300'
                    }`}>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-slate-300 text-ink font-mono font-bold text-xs flex items-center justify-center shrink-0">
                          2
                        </div>
                        <div className="min-w-0">
                          <span className="font-mono text-[9px] text-slate-300 uppercase tracking-widest font-bold block">
                            2nd Position // Second Place
                          </span>
                          <span className="font-label font-bold text-sm sm:text-base text-bone tracking-wide block truncate">
                            {event.second === '—' ? 'Not Awarded' : event.second}
                          </span>
                        </div>
                      </div>
                      {event.second !== '—' && (
                        <span className="text-slate-300 font-mono text-sm shrink-0">★</span>
                      )}
                    </div>

                    {/* 3rd Position */}
                    <div className={`p-2.5 border-l-4 flex items-start justify-between gap-3 ${
                      event.third === '—'
                        ? 'bg-bone/5 border-bone/20 opacity-60'
                        : 'bg-amber-700/10 border-amber-600'
                    }`}>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-amber-700 text-bone-hi font-mono font-bold text-xs flex items-center justify-center shrink-0">
                          3
                        </div>
                        <div className="min-w-0">
                          <span className="font-mono text-[9px] text-amber-600 uppercase tracking-widest font-bold block">
                            3rd Position // Third Place
                          </span>
                          <span className="font-label font-bold text-sm sm:text-base text-bone tracking-wide block truncate">
                            {event.third === '—' ? 'Not Awarded' : event.third}
                          </span>
                        </div>
                      </div>
                      {event.third !== '—' && (
                        <span className="text-amber-600 font-mono text-sm shrink-0">★</span>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom Technical Tag */}
                  <div className="px-4 py-2 border-t border-bone/10 bg-bone/[0.02] flex justify-between items-center font-mono text-[9px] text-bone-dim">
                    <span>RECORD VERIFIED // AEROSS JURY</span>
                    <span className="text-crimson">OFFICIAL PODIUM</span>
                  </div>
                </div>
              ))}
            </div>

            {filteredFinalEvents.length === 0 && (
              <div className="p-12 text-center border-2 border-bone/40 font-mono text-bone-dim">
                No events or schools found matching "{searchQuery}". Try searching for another school name or clearing filters.
              </div>
            )}
          </section>

          {/* LEADERBOARD & MEDAL TALLY TABLE */}
          <section className="border-2 border-bone p-4 sm:p-6 bg-ink-2/30 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-2 border-b-2 border-bone pb-2">
              <div>
                <span className="font-mono text-[10px] text-crimson font-bold uppercase tracking-widest block">
                  LEADERBOARD // 集計表
                </span>
                <h3 className="font-display text-xl sm:text-2xl text-bone uppercase tracking-wide">
                  Conclave Delegation Medal Summary
                </h3>
              </div>
              <span className="font-mono text-xs text-bone-dim">
                DPS Noida: 2026 Conclave Champions
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b-2 border-bone/40 text-bone-dim uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">School Delegation</th>
                    <th className="py-2.5 px-3 text-center text-amber-400">1st (Gold)</th>
                    <th className="py-2.5 px-3 text-center text-slate-300">2nd (Silver)</th>
                    <th className="py-2.5 px-3 text-center text-amber-600">3rd (Bronze)</th>
                    <th className="py-2.5 px-3 text-center font-bold text-bone">Total Podiums</th>
                    <th className="py-2.5 px-3 text-right">Standing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bone/10">
                  {schoolMedalLeaderboard.map((row, idx) => (
                    <tr
                      key={row.school}
                      className={
                        idx === 0
                          ? 'bg-crimson/15 font-bold text-bone'
                          : 'hover:bg-bone/5 text-bone-dim hover:text-bone transition-colors'
                      }
                    >
                      <td className="py-2.5 px-3 font-label text-sm uppercase tracking-wide">
                        <span className="font-mono text-crimson text-xs mr-2">0{idx + 1}.</span>
                        {row.school}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-amber-400">
                        {row.first}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-300">
                        {row.second}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-amber-600">
                        {row.third}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-bone">
                        {row.total}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-[10px] uppercase tracking-wider text-crimson">
                        {row.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* CELESTECON 2027 DETAILED NOTICE */}
          <div className="border-2 border-crimson/80 bg-crimson/10 p-6 sm:p-8 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-crimson inline-block animate-pulse"></span>
              <span className="font-mono text-xs uppercase tracking-widest text-crimson font-bold">
                COMMUNIQUÉ // CELESTECON 2027
              </span>
            </div>
            <h4 className="font-display text-2xl sm:text-3xl text-bone uppercase">
              CelesteCon will be back in 2027.
            </h4>
            <p className="font-label text-sm sm:text-base text-bone-dim leading-relaxed max-w-3xl">
              The seventh edition of CelesteCon will launch in Autumn 2027 with new aerospace briefs, expanded simulator runs, and high-altitude flight trials. Directives, rules, and school invitation dispatches will be circulated to affiliated institutions in mid-2027.
            </p>
            <div className="pt-2 font-mono text-xs text-bone-dim">
              For inquiries regarding conclave archives, certificates, or participation records, contact{' '}
              <a href="mailto:aeross@dpsrkp.net" className="text-crimson hover:underline font-bold">
                aeross@dpsrkp.net
              </a>.
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: ROUND 1 QUALIFIERS ARCHIVE (HISTORICAL)
      ======================================================== */}
      {activeTab === 'round1' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="p-4 bg-bone/5 border-l-4 border-bone font-mono text-xs text-bone-dim">
            <span className="text-bone font-bold block mb-1 uppercase tracking-wider">
              Historical Record // Round 1 Qualifiers
            </span>
            <span>
              This archive records all non-ranked delegations who cleared the Round 1 proposal scrutiny to compete in the Round 2 Grand Finale.
            </span>
          </div>

          {/* Search Bar for Round 1 Archive */}
          <div className="relative max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search school name, UID, or team in Round 1..."
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

          <div className="space-y-8">
            {filteredRound1Events.map((event) => (
              <section key={event.eventId} className="border-2 border-bone/70 bg-ink-2/20">
                <div className="bg-bone text-ink p-3 sm:p-4 flex flex-wrap justify-between items-center gap-2 border-b-2 border-bone">
                  <div>
                    <span className="font-mono text-[10px] tracking-widest uppercase text-crimson font-bold block">
                      EVENT {event.eventId} · {event.code}
                    </span>
                    <h3 className="font-display text-lg sm:text-xl uppercase tracking-wide">
                      {event.name}
                    </h3>
                  </div>
                  <span className="font-mono text-xs font-bold uppercase tracking-widest bg-ink text-bone px-2.5 py-1">
                    {event.qualifiers.length} Qualified Teams
                  </span>
                </div>

                <div className="divide-y divide-bone/20">
                  {event.qualifiers.map((q, idx) => (
                    <div
                      key={q.id}
                      className="p-3 sm:p-4 hover:bg-bone/5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="flex items-start sm:items-center gap-3">
                        <span className="font-mono text-xs text-crimson font-bold shrink-0 w-6">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <div className="font-label font-bold text-sm sm:text-base text-bone tracking-wide uppercase">
                            {q.schoolName}
                          </div>
                          <div className="font-mono text-[11px] text-bone-dim flex items-center gap-2 flex-wrap">
                            <span>UID: <strong className="text-bone">{q.schoolUID}</strong></span>
                            <span>•</span>
                            <span>Team: {q.teamName}</span>
                          </div>
                        </div>
                      </div>

                      {q.category && (
                        <span className="font-mono text-[10px] text-bone-dim uppercase border border-bone/30 px-2 py-0.5 self-start sm:self-auto shrink-0">
                          {q.category}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;
