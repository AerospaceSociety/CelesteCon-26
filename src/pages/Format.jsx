import React from 'react';
import SectionHeader from '../components/SectionHeader';
import { masterMilestones } from '../data/events';

const Format = () => {
  const itinerary = [
    {
      time: '07:45 – 08:45 A.M.',
      programme: 'Reporting Time, Delegate Registration & Kit Issuance',
      venue: 'Main Welcome Foyer',
      attending: 'All registered schools & independent cadets'
    },
    {
      time: '09:00 A.M.',
      programme: 'Competitions Start (Parallel Arenas & Preliminary Rounds Commence)',
      venue: 'Respective Arenas, Labs & Debate Chambers',
      attending: 'All participating contingents'
    },
    {
      time: '10:30 – 11:00 A.M.',
      programme: 'Break & Refreshments',
      venue: 'Central Courtyard & Lawns',
      attending: 'All delegates, escort teachers & guests'
    },
    {
      time: '11:00 A.M. – 12:00 P.M.',
      programme: 'Competitions Final Phase & Evaluations (Competitions Ending: 12:00 P.M.)',
      venue: 'Respective Competition Arenas',
      attending: 'Finalists & competitors'
    },
    {
      time: '12:00 – 12:30 P.M.',
      programme: 'Enjoy / Free Exploration, Networking & Open Showcase',
      venue: 'Campus Grounds & Open Arena',
      attending: 'Open to all delegates & participants'
    },
    {
      time: '12:30 – 1:00 P.M.',
      programme: 'Awards Ceremony & Valedictory Speech',
      venue: 'Main Auditorium',
      attending: 'All participants, faculty & distinguished guests'
    },
    {
      time: '1:00 P.M. onwards',
      programme: 'Departure & Convention Dispersal',
      venue: 'Main Departure Gates',
      attending: 'All delegations'
    }
  ];

  const directives = [
    {
      num: '01',
      title: 'Reporting & Accreditation',
      desc: 'Report to the DPS R.K. Puram Welcome Foyer strictly between 07:45 and 08:45 A.M. on event day (24 Oct). Late arrivals forfeit preliminary heats. Official ID badges and delegate kits are issued on arrival.'
    },
    {
      num: '02',
      title: 'Uniform & Attire',
      desc: 'Students can wear their school uniform. No restrictions are applied on outfits as long as the attire is dignified and appropriate for a school setting.'
    },
    {
      num: '03',
      title: 'Hardware & Internet Connection',
      desc: 'Bring your own Wi-Fi / mobile internet connection (personal hotspot). Participants must carry their own laptops, chargers, adapters, CAD files, and hardware fully charged. Dedicated power outlets will be accessible at competition workstations, but campus Wi-Fi will NOT be provided for participant devices; the host accepts no liability for personal hardware.'
    },
    {
      num: '04',
      title: 'Schedule Overlaps',
      desc: 'Students are permitted to enter multiple competitions, but on-campus rounds may clash. Managing attendance across concurrent events is the sole responsibility of the student and teacher coordinator.'
    },
    {
      num: '05',
      title: 'Host School Status',
      desc: 'DPS R.K. Puram delegations compete strictly on a non-competitive basis: they are evaluated for academic benchmarking but remain ineligible for rankings, podium trophies, or the Overall Champions Rolling Trophy.'
    },
    {
      num: '06',
      title: 'Jury Sovereignty',
      desc: 'Scores, verdicts, and adjudications of the juries, industry specialists, and faculty observers are final and binding. Any disrespect or misconduct toward arbiters or marshals results in immediate disqualification.'
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
                <dd className="text-bone border-b border-dotted border-bone/40 pb-1 font-bold">10 Oct · 11:59 PM IST</dd>
                <span className="text-bone-dim/70 text-[9.5px] block mt-0.5">Portal locks; no on-spot additions.</span>
              </div>
              <div>
                <dt className="text-crimson font-bold uppercase mb-0.5">Round 1 Commences</dt>
                <dd className="text-bone border-b border-dotted border-bone/40 pb-1">11 Oct 2026</dd>
                <span className="text-bone-dim/70 text-[9.5px] block mt-0.5">Prompts & deliverables released via portal.</span>
              </div>
              <div>
                <dt className="text-crimson font-bold uppercase mb-0.5">Rocketry / Prix / Jam Deadline</dt>
                <dd className="text-bone border-b border-dotted border-bone/40 pb-1 font-bold">20 Oct · 11:59 PM IST</dd>
                <span className="text-bone-dim/70 text-[9.5px] block mt-0.5">Technical specifications released beforehand.</span>
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
          <div className="flex items-baseline gap-3">
            <h3 className="font-display text-2xl sm:text-3xl text-bone uppercase tracking-wide leading-none">Event-Day Itinerary</h3>
            <span className="font-jp font-bold text-xs sm:text-sm tracking-[0.25em] text-crimson">当日進行</span>
          </div>
          <span className="font-mono text-[9.5px] tracking-[0.14em] uppercase text-bone-dim font-bold">24 OCT 2026 // DPS R.K. PURAM</span>
        </div>

        <div className="border-2 border-bone overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bone text-ink font-mono text-[10.5px] tracking-widest uppercase border-b-2 border-bone font-bold">
                <th className="py-2.5 px-3 sm:px-4 w-32 sm:w-40 border-r border-ink/20">Time</th>
                <th className="py-2.5 px-3 sm:px-4 border-r border-ink/20">Programme</th>
                <th className="py-2.5 px-3 sm:px-4 w-44 sm:w-56 border-r border-ink/20">Venue</th>
                <th className="py-2.5 px-3 sm:px-4 w-36 sm:w-48 hidden md:table-cell">Attending</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs divide-y divide-bone/20 text-bone-dim">
              {itinerary.map((item, idx) => (
                <tr key={idx} className="hover:bg-bone/[0.04] transition-colors">
                  <td className="py-3 px-3 sm:px-4 font-bold text-crimson border-r border-bone/20 whitespace-nowrap align-top">
                    {item.time}
                  </td>
                  <td className="py-3 px-3 sm:px-4 font-label font-medium text-bone border-r border-bone/20 align-top">
                    {item.programme}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-bone-dim text-[11px] border-r border-bone/20 align-top">
                    {item.venue}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-bone-dim/70 text-[10.5px] hidden md:table-cell align-top">
                    {item.attending}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 p-3 border border-bone/30 bg-bone/[0.02] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 font-mono text-[10px] text-bone-dim">
          <span>☕ Bring Your Own Internet Connection (Hotspot) • Escort Teacher Lounge &amp; dedicated workstations available throughout the day.</span>
          <span className="text-crimson font-bold uppercase">* Itinerary indicative; final room allocations confirmed on delegate ID badge.</span>
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

        {/* Rolling Trophy Box */}
        <div className="mt-6 border-2 border-crimson p-5 sm:p-6 bg-crimson/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="font-mono text-[10px] tracking-[0.2em] text-crimson uppercase font-bold mb-1">
              Institutional Recognition // 最高栄誉
            </div>
            <h4 className="font-display text-xl sm:text-2xl text-bone uppercase tracking-wider">
              Overall Champions Rolling Trophy
            </h4>
            <p className="font-label text-xs sm:text-sm text-bone-dim max-w-2xl mt-1 leading-relaxed">
              Awarded to the school delegation achieving the highest cumulative aggregate across all 8 competitions. Host school teams compete for academic benchmarking only and are excluded from the rolling trophy calculations.
            </p>
          </div>
          <div className="shrink-0 flex gap-2">
            <a
              href="/celestecon_registration.html"
              className="px-4 py-2 bg-crimson text-bone font-label font-bold text-xs uppercase tracking-widest border border-crimson hover:bg-ink hover:text-crimson transition-colors"
            >
              School Portal ↗
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Format;
