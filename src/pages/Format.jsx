import React from 'react';
import SectionHeader from '../components/SectionHeader';

const Format = () => {
  const itinerary = [
    {
      time: '07:45 – 08:45 A.M.',
      programme: 'Reporting Time — Delegate registration, kit issuance & ID badging'
    },
    {
      time: '09:00 A.M. – 11:30 AM',
      programme: 'Competitions Start for all the events in Parallel arenas'
    },
    {
      time: '11:30 – 12:15 P.M.',
      programme: 'Break — Refreshments, institutional networking & delegate hospitality and Enjoy — Open showcase, minigame arcade expo, engineering exhibits & social interaction'
    },
    {
      time: '12:15 – 01:00 P.M.',
      programme: 'Awards Ceremony, Keynote & Valedictory Speech'
    },
    {
      time: '01:00 P.M. onwards',
      programme: 'Departure & delegation dispersal'
    }
  ];

  const directives = [
    {
      num: '01',
      title: 'Reporting & Accreditation',
      desc: 'Report to the DPS R.K. Puram Welcome Foyer strictly between 07:45 and 08:45 A.M. on event day. Late arrivals forfeit preliminary heats. IDs are issued on arrival.'
    },
    {
      num: '02',
      title: 'Uniform & Attire',
      desc: 'Students can wear school uniform. No restrictions are applied on the outfits as long as the outfit is appropriate for a school setting.'
    },
    {
      num: '03',
      title: 'Hardware & Internet',
      desc: 'Bring your own laptops, chargers, adapters and hardware, fully charged. Power outlets would be provided; host accepts no liability for personal hardware. It is advised to bring your own Wi-Fi / mobile internet connection.'
    },
    {
      num: '04',
      title: 'Host School Status',
      desc: 'DPS R.K. Puram teams participate on a non-competitive basis: they are judged for benchmarking but are ineligible for rankings, podium trophies or the Overall trophy.'
    },
    {
      num: '05',
      title: 'Jury Sovereignty',
      desc: 'Scores and verdicts of juries, industry adjudicators and faculty observers are final and binding. Disrespect toward arbiters or marshals means immediate disqualification.'
    },
    {
      num: '06',
      title: 'Overall Champions Rolling Trophy',
      desc: 'Awarded to the top institution with maximum cumulative points across the conclave. Eligibility requires official school entries in at least 5 of the 8 competitions.'
    }
  ];

  return (
    <div className="max-w-5xl">
      <SectionHeader section="05" title="Format & Timelines" jp="大会日程" />

      {/* Hero Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 md:gap-12 mt-6 sm:mt-8">
        <div>
          <h3 className="font-display text-[clamp(24px,4vw,40px)] text-bone uppercase leading-[1.1] mb-6">
            A two-stage crucible. <span className="text-crimson">One national stage.</span>
          </h3>
          <p className="font-label text-base md:text-lg text-bone-dim mb-8 leading-relaxed max-w-2xl">
            CelesteCon 2026 operates on a hybrid model designed to combine nationwide accessibility with the rigor and pressure of an on-campus finale at DPS R.K. Puram.
          </p>

          <div className="relative border-l-2 border-bone/30 ml-3 pl-8 pb-10">
            <div className="absolute w-4 h-4 bg-ink border-2 border-crimson -left-[9px] top-0 rounded-full"></div>
            <div className="font-mono text-xs text-crimson tracking-[0.15em] font-bold uppercase mb-1">Phase 01 // Nationwide Remote</div>
            <h4 className="font-display text-2xl text-bone uppercase tracking-wide mb-2">Online Prelims</h4>
            <p className="font-label text-sm text-bone-dim max-w-xl leading-relaxed">
              Teams compete remotely from anywhere across India. Design proposals, CAD assemblies, and business pitch decks are uploaded directly to the portal. The Quizzitch aerospace screening runs synchronously on our custom platform.
            </p>
          </div>

          <div className="relative border-l-2 border-transparent ml-3 pl-8">
            <div className="absolute w-4 h-4 bg-crimson border-2 border-crimson -left-[9px] top-0 rounded-full"></div>
            <div className="font-mono text-xs text-crimson tracking-[0.15em] font-bold uppercase mb-1">Phase 02 // New Delhi Campus</div>
            <h4 className="font-display text-2xl text-bone uppercase tracking-wide mb-2">On-Campus Finale</h4>
            <p className="font-label text-sm text-bone-dim max-w-xl leading-relaxed mb-4">
              Top qualifying teams from Round 1 report to DPS R.K. Puram for live defense presentations, parliamentary debate chambers, science-fair exhibits, peer-reviewed minigame playtesting, bench simulation tests, and high-speed CO₂ track sprints.
            </p>
            <div className="border border-bone/40 bg-bone/5 p-3.5 inline-block">
              <span className="font-mono text-[9.5px] tracking-widest text-crimson font-bold uppercase block">Official Venue</span>
              <div className="font-label font-bold text-bone uppercase tracking-wider text-sm mt-0.5">Delhi Public School, Sector 12, R.K. Puram, New Delhi — 110022</div>
            </div>
          </div>
        </div>

        {/* Master Milestones Box */}
        <div className="lg:border-l-2 border-bone lg:pl-8">
          <div className="border-2 border-bone sticky top-24 bg-ink/70">
            <div className="bg-bone text-ink font-mono text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 flex justify-between font-bold">
              <span>Milestone Timetable</span>
              <span className="font-jp text-ink-3">期日</span>
            </div>
            <dl className="p-4 grid grid-cols-1 gap-y-3 font-mono text-[11px] tracking-[0.03em]">
              <div>
                <dt className="text-crimson font-bold uppercase mb-0.5">Registration Opens</dt>
                <dd className="text-bone border-b border-dotted border-bone/40 pb-1">01 Oct 2026</dd>
              </div>
              <div>
                <dt className="text-crimson font-bold uppercase mb-0.5">Regular Registration Deadline</dt>
                <dd className="text-bone border-b border-dotted border-bone/40 pb-1 font-bold">12 Oct · 11:59 PM IST</dd>
                <span className="text-bone-dim/70 text-[9.5px] block mt-0.5">Portal locks; no on-spot additions.</span>
              </div>
              <div>
                <dt className="text-crimson font-bold uppercase mb-0.5">Round 1 Commences</dt>
                <dd className="text-bone border-b border-dotted border-bone/40 pb-1">13 Oct 2026</dd>
                <span className="text-bone-dim/70 text-[9.5px] block mt-0.5">Prompts, themes & deliverables announced via portal.</span>
              </div>
              <div>
                <dt className="text-crimson font-bold uppercase mb-0.5">Round 1 Submission Deadline</dt>
                <dd className="text-bone border-b border-dotted border-bone/40 pb-1 font-bold">18 Oct · 11:59 PM IST</dd>
                <span className="text-bone-dim/70 text-[9.5px] block mt-0.5">Online proposals, decks, CAD & videos due.</span>
              </div>
              <div>
                <dt className="text-crimson font-bold uppercase mb-0.5">Round 1 Results (Finalists)</dt>
                <dd className="text-bone border-b border-dotted border-bone/40 pb-1">20 Oct 2026</dd>
                <span className="text-bone-dim/70 text-[9.5px] block mt-0.5">Finalists announced for online preliminary rounds.</span>
              </div>
              <div>
                <dt className="text-crimson font-bold uppercase mb-0.5">Rocketry / Prix / Jam Deadline</dt>
                <dd className="text-bone border-b border-dotted border-bone/40 pb-1 font-bold">20 Oct · 11:59 PM IST</dd>
                <span className="text-bone-dim/70 text-[9.5px] block mt-0.5">Technical specifications released beforehand. Portal locks.</span>
              </div>
              <div>
                <dt className="text-crimson font-bold uppercase mb-0.5">Onsite Grand Finale</dt>
                <dd className="text-bone border-b border-dotted border-bone/40 pb-1 text-crimson font-bold">24 Oct · 07:45 AM</dd>
                <span className="text-bone-dim/70 text-[9.5px] block mt-0.5">DPS R.K. Puram Welcome Foyer (07:45 – 08:45 AM).</span>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Event Day Schedule / Operational Itinerary */}
      <section className="mt-16 sm:mt-20">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 pb-2 border-b-4 border-bone mb-6">
          <div className="flex items-center gap-3">
            <span className="w-3.5 h-3.5 bg-crimson shrink-0 inline-block"></span>
            <h3 className="font-display text-2xl sm:text-3xl text-bone uppercase tracking-wide leading-none">Event-Day Itinerary</h3>
            <span className="font-jp font-bold text-xs sm:text-sm tracking-[0.25em] text-crimson ml-2">当日進行</span>
          </div>
          <span className="font-mono text-[9.5px] tracking-[0.14em] uppercase text-bone-dim font-bold">24 OCT 2026 // DPS R.K. PURAM</span>
        </div>

        <div className="border border-bone/30 overflow-x-auto bg-ink/40">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bone text-ink font-mono text-[11px] tracking-widest uppercase border-b border-bone/30 font-bold">
                <th className="py-3 px-4 sm:px-6 w-48 sm:w-64 border-r border-bone/20">Time</th>
                <th className="py-3 px-4 sm:px-6">Programme</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs sm:text-sm divide-y divide-bone/20 text-bone-dim">
              {itinerary.map((item, idx) => (
                <tr key={idx} className="hover:bg-bone/[0.04] transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-bone border-r border-bone/20 whitespace-nowrap align-top font-mono">
                    {item.time}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-bone font-sans text-xs sm:text-sm leading-relaxed align-top">
                    {item.programme}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-x-8 gap-y-2 font-mono text-[11px] text-bone-dim">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-crimson shrink-0 inline-block"></span>
            <span>Escort Teacher Lounge: refreshments &amp; workstations</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-crimson shrink-0 inline-block"></span>
            <span>Bring your own Wi-Fi / internet connection</span>
          </div>
          <div className="flex items-center gap-2 w-full">
            <span className="w-2 h-2 bg-crimson shrink-0 inline-block"></span>
            <span>Itinerary indicative; final times on the portal</span>
          </div>
        </div>
      </section>

      {/* General Directives & Code of Conduct */}
      <section className="mt-16 sm:mt-20">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 pb-2 border-b-4 border-bone mb-6">
          <div className="flex items-baseline gap-3">
            <h3 className="font-display text-2xl sm:text-3xl text-bone uppercase tracking-wide leading-none">General Directives</h3>
            <span className="font-jp font-bold text-xs sm:text-sm tracking-[0.25em] text-crimson">一般規範</span>
          </div>
          <span className="font-mono text-[9.5px] tracking-[0.14em] uppercase text-bone-dim font-bold">SEC. 05 // PARTICIPANT CODE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {directives.map((dir) => (
            <div key={dir.num} className="border-2 border-bone/40 p-4 sm:p-5 bg-bone/[0.02] hover:border-crimson transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs text-crimson font-bold">DIR // {dir.num}</span>
                <h4 className="font-display text-lg text-bone uppercase tracking-wide">{dir.title}</h4>
              </div>
              <p className="font-label text-xs sm:text-sm text-bone-dim leading-relaxed">
                {dir.desc}
              </p>
            </div>
          ))}
        </div>


      </section>
    </div>
  );
};

export default Format;
