import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { events } from '../data/events';

const COMP_CODES = {
  '01': 'SMT',
  '02': 'Vol',
  '03': 'IPOD',
  '04': 'BPP',
  '05': 'ATh',
  '06': 'CJam',
  '07': 'Roc',
  '08': 'APrix',
  settle: 'SMT',
  volatus: 'Vol',
  dispute: 'IPOD',
  bpp: 'BPP',
  theatre: 'ATh',
  gamejam: 'CJam',
  rocketry: 'Roc',
  f1: 'APrix'
};
const DELIVERABLE_INFO = {
  '01': {
    format: 'PDF Proposal (Max 25 pages Jr / 35 pages Sr)',
    submissionMode: 'Online Upload',
    details: 'Engineering proposal for a habitable free-space settlement. Six RFPs across Junior & Senior divisions (Earth orbit, asteroids, Ceres, Saturn, Pluto, Tara system). Top 5 teams per division advance to onsite oral defense.',
    portalUrl: '/prompts/settlement',
    isLive: true,
    submissionClosed: true,
    portalLabel: 'Settle-Me-This'
  },
  '02': {
    format: 'Technical Dossier PDF (Max 25 pages) + 3D CAD (.step / .stl / .f3d / .blend)',
    submissionMode: 'Online Upload',
    details: 'Aeronautical design & 3D digital prototyping. Two mission RFPs in the Senior division: Thin Air & Flockmate. Top teams exhibit on campus.',
    portalUrl: '/prompts/volatus',
    isLive: true,
    submissionClosed: true,
    portalLabel: 'Volatus'
  },
  '03': {
    format: 'Round 1 Quiz (16 Oct) · Round 2 Debate',
    submissionMode: 'Online Screening + Onsite Chambers',
    details: 'Round 1 Quiz on 16th October on Quizzitch platform (details shared on registered email and updated on website). Round 2 debate motions released 21st October. Top 10 advance to debate chambers on campus.',
    portalUrl: '/prompts/ipod',
    isLive: true,
    submissionClosed: true,
    portalLabel: 'In Pursuit of Dispute (IPoD)'
  },
  '04': {
    format: 'Proposal PDF (Max 25 pp Jr / 30 pp Sr) + 12-Slide Pitch Deck',
    submissionMode: 'Online Upload',
    details: 'Commercial aerospace venture pitch across atmospheric layers (troposphere through exosphere). Eight prompts across Junior & Senior divisions. Top teams advance to live investor pitch at CelesteCon.',
    portalUrl: '/prompts/bpp',
    isLive: true,
    submissionClosed: true,
    portalLabel: 'Business Power Pitch'
  },
  '05': {
    format: 'Audition Video (3–5 Mins, MP4 / Unlisted Link)',
    submissionMode: 'Online Upload + Onsite Finale at AVH',
    details: 'Round 1 Theme: "No theme, Open Stage" (Video audition). Round 2 Theme: "Past, Present and the Future" (Live showcase at AVH + on-the-spot improv). Open stage talent showcase.',
    portalUrl: '/prompts/theatre',
    isLive: true,
    submissionClosed: true,
    portalLabel: 'AEROSS Theatre'
  },
  '06': {
    format: 'Playable Build (Windows/Web ZIP) + Gameplay Video',
    submissionMode: 'Online Upload',
    details: 'Theme: "Retrogression". Develop an aerospace minigame in any engine (Godot, Unity, Unreal, WebGL). Onsite peer review & jury evaluation.',
    portalUrl: '/prompts/gamejam',
    isLive: true,
    submissionClosed: false,
    portalLabel: 'CelesteJam (Game Jam)'
  },
  '07': {
    format: 'Technical Report + OpenRocket Simulation (.ork)',
    submissionMode: 'Online Upload & Onsite Scrutineering',
    details: 'Design proposal & OpenRocket simulation around supplied motor specifications (no motor installed). Bring physical model for digital measurement & simulation flight.',
    portalUrl: '/prompts/rocketry',
    isLive: true,
    submissionClosed: false,
    portalLabel: 'Rocketry'
  },
  '08': {
    format: 'Design Documentation (Max 30 pgs) + CAD Files & Livery',
    submissionMode: 'Online Upload & Onsite Sprint Races',
    details: 'Scale CO2-powered F1 aerodynamic racecar constructor challenge. Submit 30-pg dossier, CAD, 3-view drawings & livery. Onsite technical scrutineering & 20m high-speed sprint races.',
    portalUrl: '/prompts/prix',
    isLive: true,
    submissionClosed: false,
    portalLabel: 'AEROSS Prix'
  }
};

// Aliases
DELIVERABLE_INFO.settle = DELIVERABLE_INFO['01'];
DELIVERABLE_INFO.volatus = DELIVERABLE_INFO['02'];
DELIVERABLE_INFO.dispute = DELIVERABLE_INFO['03'];
DELIVERABLE_INFO.bpp = DELIVERABLE_INFO['04'];
DELIVERABLE_INFO.theatre = DELIVERABLE_INFO['05'];
DELIVERABLE_INFO.gamejam = DELIVERABLE_INFO['06'];
DELIVERABLE_INFO.rocketry = DELIVERABLE_INFO['07'];
DELIVERABLE_INFO.f1 = DELIVERABLE_INFO['08'];

const PromptsPortal = () => {
  // Position live prompt dossiers (all 8 events) at the top of the prompts roster
  const sortedEvents = useMemo(() => {
    const liveIds = ['01', '02', '03', '04', '05', '06', '07', '08'];
    const liveEvents = liveIds.map(id => events.find(e => e.id === id)).filter(Boolean);
    const otherEvents = events.filter(e => !liveIds.includes(e.id));
    return [...liveEvents, ...otherEvents];
  }, []);

  return (
    <div className="relative">
      {/* Top Breadcrumb & Metadata */}
      <div className="flex flex-wrap justify-between items-center gap-2 border-b-2 border-bone pb-2 mb-6 font-mono text-[9.5px] tracking-[0.14em] uppercase text-bone-dim">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-crimson transition-colors">CELESTECON 2026</Link>
          <span>//</span>
          <Link to="/comps" className="hover:text-crimson transition-colors">THE COMPS</Link>
          <span>//</span>
          <span className="text-crimson font-bold">PORTAL TELEMETRY</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-jp text-[10px] text-bone">第六回航空宇宙大会</span>
          <span>GATE: CC-R1-2026</span>
        </div>
      </div>

      {/* Main Masthead */}
      <section className="mb-8 sm:mb-10">
        <div className="flex items-baseline gap-3 mb-2 flex-wrap">
          <span className="font-mono text-xs text-green-400 font-bold uppercase tracking-[0.2em] px-2 py-0.5 border border-green-500/40 bg-green-500/10">
            ● ALL 8 PROMPT DOSSIERS UNLOCKED // LIVE
          </span>
          <span className="font-mono text-xs text-bone-dim tracking-wider uppercase">
            ROUND 1 ACTIVE · 2026
          </span>
        </div>

        <h1 className="font-display text-[clamp(32px,7.5vw,92px)] leading-[0.9] tracking-[-0.01em] uppercase text-bone text-balance mb-4">
          Round 1 Prompts &amp; Challenges
        </h1>

        <p className="font-label font-medium text-sm sm:text-base tracking-[0.06em] text-bone-dim max-w-3xl leading-relaxed">
          The official central transmission terminal for all 8 CelesteCon 2026 competitions. All problem statements, engineering briefs, mission RFPs, and case dossiers are live. Review all deliverable specifications below and proceed to the digital deposit vault to submit entries.
        </p>
      </section>

      {/* Round 1 Results Communiqué Banner */}
      <div className="border-2 border-crimson p-4 sm:p-5 bg-crimson/15 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 shadow-lg">
        <div className="flex items-start gap-3">
          <span className="font-mono text-[9px] uppercase px-2 py-0.5 bg-crimson text-bone-hi font-bold shrink-0 mt-0.5">
            RESULTS
          </span>
          <div>
            <div className="font-label font-bold text-sm sm:text-base text-bone uppercase tracking-wider flex items-center gap-2 flex-wrap">
              <span>Round 1 Qualifiers Declared for 5 Hybrid Events</span>
              <span className="text-crimson font-mono text-xs">[Non-Ranked]</span>
            </div>
            <p className="font-label text-xs sm:text-sm text-bone-dim mt-0.5 leading-relaxed">
              Preliminary screening evaluations have concluded for Settle-Me-This, Volatus, IPoD, Business Power Pitch, and AEROSS Theatre. All qualified schools &amp; teams advance to the 24 Oct Grand Finale.
            </p>
          </div>
        </div>
        <Link
          to="/results"
          className="px-5 py-2.5 bg-crimson text-bone-hi hover:bg-ink hover:text-crimson font-label font-bold text-xs uppercase tracking-widest border border-crimson transition-all shrink-0 flex items-center gap-2 shadow-md hover:shadow-crimson/20"
        >
          <span>View Round 1 Results</span>
          <span>&rarr;</span>
        </Link>
      </div>

      {/* Submission Portal Dedicated Link Banner */}
      <div className="border-2 border-bone/60 p-4 sm:p-5 bg-ink flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-crimson animate-pulse"></span>
            <span className="font-mono text-xs uppercase font-bold text-bone tracking-widest">
              OFFICIAL DIGITAL SUBMISSION GATEWAY
            </span>
          </div>
          <p className="font-label text-xs sm:text-sm text-bone-dim max-w-2xl leading-relaxed">
            Ready to deposit your team&apos;s active deliverables (CelesteJam game builds, OpenRocket simulations, and AEROSS Prix CAD packages)? Visit the dedicated Submission Portal to authenticate with your School UID and deposit entries. Submissions for SMT, Volatus, IPoD, BPP, and AEROSS Theatre are now closed.
          </p>
        </div>
        <Link
          to="/submissions"
          className="px-5 py-2.5 border-2 border-bone text-bone hover:border-crimson hover:text-crimson font-label font-bold text-xs uppercase tracking-widest transition-all shrink-0 flex items-center gap-2"
        >
          <span>Go to Submission Portal</span>
          <span>&rarr;</span>
        </Link>
      </div>

      {/* Prompts Overview */}
      <div className="space-y-8 mb-12">
        {/* All 8 Events Roster (Live prompts prioritized at top) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedEvents.map((ev) => {
            const code = COMP_CODES[ev.id] || ev.id;
            const deliv = DELIVERABLE_INFO[ev.id] || {};
            const isDual = ev.categories && ev.categories.length > 0;

            return (
              <div key={ev.id} className="border-2 border-bone bg-ink p-5 flex flex-col justify-between group hover:border-crimson transition-colors">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 bg-crimson text-bone-hi">
                        {code}
                      </span>
                      <span className="font-mono text-[10px] text-bone-dim uppercase tracking-wider">
                        {isDual ? 'Dual Track (Jr & Sr)' : 'Senior Track'}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-bone/40 text-bone-dim">
                      {ev.mode}
                    </span>
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl text-bone uppercase mb-1">
                    {ev.name}
                  </h3>
                  <p className="font-label text-xs sm:text-sm text-bone-dim mb-3">
                    {ev.tagline || ev.overview}
                  </p>

                  <div className="border-t border-bone/20 pt-2.5 mt-2 space-y-1.5 font-mono text-[11px]">
                    <div>
                      <span className="text-crimson font-bold uppercase">Deliverable: </span>
                      <span className="text-bone">{deliv.format}</span>
                    </div>
                    <div>
                      <span className="text-bone-dim uppercase">Details: </span>
                      <span className="text-bone-dim/90">{deliv.details}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-bone/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs font-mono">
                  <span className="text-bone-dim flex items-center gap-1.5">
                    {deliv.submissionClosed ? (
                      <strong className="text-amber-400">Submissions Closed</strong>
                    ) : deliv.isLive ? (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                        <strong className="text-green-400">Active Track</strong>
                      </>
                    ) : (
                      <>
                        Status: <strong className="text-amber-500">Unlocks 13 Oct 18:00</strong>
                      </>
                    )}
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {deliv.submissionClosed && (
                      <Link
                        to={`/results?event=${ev.id}`}
                        className="px-2.5 py-1 bg-bone text-ink hover:bg-crimson hover:text-white font-label font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1 border border-bone"
                      >
                        <span>R1 Results ★</span>
                      </Link>
                    )}
                    {deliv.portalUrl ? (
                      deliv.portalUrl.endsWith('.html') ? (
                        <a
                          href={deliv.portalUrl}
                          className="px-3 py-1 bg-crimson text-bone-hi font-label font-bold text-xs uppercase tracking-wider border border-crimson hover:bg-ink hover:text-crimson transition-colors flex items-center gap-1"
                        >
                          <span>Open {deliv.portalLabel || ev.name}</span>
                          <span>&rarr;</span>
                        </a>
                      ) : (
                        <Link
                          to={deliv.portalUrl}
                          className="px-3 py-1 bg-crimson text-bone-hi font-label font-bold text-xs uppercase tracking-wider border border-crimson hover:bg-ink hover:text-crimson transition-colors flex items-center gap-1"
                        >
                          <span>Open {deliv.portalLabel || ev.name}</span>
                          <span>&rarr;</span>
                        </Link>
                      )
                    ) : (
                      <span className="text-bone-dim/60 uppercase">
                        Vault ID: {code}-R1
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Navigation Bar */}
      <div className="border-t-2 border-bone pt-6 mt-12 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap gap-2">
          <Link
            to="/format"
            className="font-mono text-xs uppercase tracking-wider px-3.5 py-1.5 border border-bone text-bone hover:bg-bone hover:text-ink transition-colors"
          >
            &larr; View Schedule &amp; Format
          </Link>
          <a
            href="/celestecon_registration.html"
            className="font-mono text-xs uppercase tracking-wider px-3.5 py-1.5 border border-crimson bg-crimson text-bone-hi hover:bg-ink hover:text-crimson transition-colors"
          >
            School Registration Portal &rarr;
          </a>
        </div>
        <span className="font-mono text-[10px] text-bone-dim tracking-widest uppercase">
          AEROSS // CELESTECON 2026
        </span>
      </div>
    </div>
  );
};

export default PromptsPortal;
