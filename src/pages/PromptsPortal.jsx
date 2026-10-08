import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { events } from '../data/events';

const TARGET_DATE_IST = new Date('2026-10-13T00:00:00+05:30').getTime();

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
    details: 'Engineering proposal for a habitable free-space settlement. Case prompts release 13 Oct. Top 5 teams per division advance to onsite oral defense.',
    portalUrl: '/prompts/settlement',
    portalLabel: 'SMT Prompt Dossier'
  },
  '02': {
    format: 'Online Proposal + 3D CAD (.step / .stl / .f3d)',
    submissionMode: 'Online Upload',
    details: 'Choose 1 of 3 case prompts released 13 Oct. Submit aerodynamic sizing, weight & balance study, and digital 3D model. Top teams exhibit on campus.',
    portalUrl: '/prompts/volatus',
    portalLabel: 'Volatus Prompt Dossier'
  },
  '03': {
    format: 'Quizzitch Online Screening Quiz',
    submissionMode: 'Online Portal',
    details: 'Online aerospace quiz on portal. Exactly 1 representative student per school attempts the 45-minute quiz. Top 10 qualifiers advance to parliamentary debate rounds on campus.',
    portalUrl: '/prompts/dispute',
    portalLabel: 'IPOD Prompt Dossier'
  },
  '04': {
    format: 'Pitch Deck (PDF) + 5-Min Video Pitch (MP4 / Drive)',
    submissionMode: 'Online Upload',
    details: 'Commercial space venture pitch addressing the release theme. Top 6 teams per division advance to live investor pitch at CelesteCon.',
    portalUrl: '/prompts/bpp',
    portalLabel: 'BPP Prompt Dossier'
  },
  '05': {
    format: 'Audition Video (3–5 Mins, MP4 / Unlisted Link)',
    submissionMode: 'Online Upload',
    details: 'Creative aerospace-themed theatrical performance (stand-up, skits, monologue, music, dance). Shortlisted entries perform live at the AVH.',
    portalUrl: '/prompts/theatre',
    portalLabel: 'AeroTheatre Prompt Dossier'
  },
  '06': {
    format: 'Playable Build (Windows/Web ZIP) + Gameplay Video',
    submissionMode: 'Online Upload',
    details: 'Theme released on portal. Develop an aerospace minigame in any engine (Godot, Unity, Unreal, WebGL). Onsite peer review & jury evaluation.',
    portalUrl: '/prompts/gamejam',
    portalLabel: 'CelesteJam Prompt Dossier'
  },
  '07': {
    format: 'Technical Report + OpenRocket Simulation (.ork)',
    submissionMode: 'Online Upload & Onsite Scrutineering',
    details: 'Design proposal & OpenRocket simulation around supplied motor specifications (no motor installed). Bring physical model for digital measurement & simulation flight.',
    portalUrl: '/prompts/rocketry',
    isLive: true,
    portalLabel: 'Rocketry'
  },
  '08': {
    format: 'Design Documentation (Max 30 pgs) + CAD Files & Livery',
    submissionMode: 'Online Upload & Onsite Sprint Races',
    details: 'Scale CO2-powered F1 aerodynamic racecar constructor challenge. Submit 30-pg dossier, CAD, 3-view drawings & livery. Onsite technical scrutineering & 20m high-speed sprint races.',
    portalUrl: '/prompts/prix',
    isLive: true,
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

const FLIPDOWN_STYLES = `
.c26-flip-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.c26-rotor-pair {
  display: flex;
  gap: 3px;
  background: #0b0907;
  padding: 4px;
  border: 1.5px solid #2b2520;
  border-radius: 4px;
  box-shadow: inset 0 2px 6px rgba(0,0,0,0.9), 0 6px 14px rgba(0,0,0,0.6);
}

.c26-rotor {
  position: relative;
  width: 32px;
  height: 54px;
  background: #14110e;
  border: 1.5px solid #3c342b;
  border-radius: 3px;
  overflow: hidden;
  perspective: 350px;
  user-select: none;
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.04), 0 3px 6px rgba(0,0,0,0.6);
}

@media (min-width: 640px) {
  .c26-rotor {
    width: 44px;
    height: 70px;
  }
}

@media (min-width: 1024px) {
  .c26-rotor {
    width: 52px;
    height: 80px;
  }
}

.c26-rotor.crimson {
  border-color: #C23A1E;
}

/* Static Halves */
.c26-rotor-half {
  position: absolute;
  left: 0;
  right: 0;
  height: 50%;
  overflow: hidden;
}

.c26-rotor-half.top {
  top: 0;
  background: linear-gradient(180deg, #25201b 0%, #171411 100%);
  border-bottom: 1px solid #000;
}

.c26-rotor-half.bottom {
  bottom: 0;
  background: linear-gradient(180deg, #13100e 0%, #1e1915 100%);
}

/* Inner Container for centering glyphs */
.c26-rotor-num-inner {
  width: 100%;
  height: 200%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.c26-rotor-num-inner.bottom-shift {
  transform: translateY(-50%);
}

.c26-rotor-glyph {
  font-family: 'Space Grotesk', var(--font-mono, monospace);
  font-weight: 700;
  font-size: 32px;
  line-height: 1;
  color: #F5EFE0;
  letter-spacing: -0.02em;
}

@media (min-width: 640px) {
  .c26-rotor-glyph {
    font-size: 42px;
  }
}

@media (min-width: 1024px) {
  .c26-rotor-glyph {
    font-size: 48px;
  }
}

.c26-rotor-glyph.crimson {
  color: #C23A1E;
}

/* Flipping Leaf Top (folds down 0deg -> -90deg displaying previous digit top half) */
.c26-rotor-leaf-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  overflow: hidden;
  background: linear-gradient(180deg, #28221d 0%, #191512 100%);
  border-bottom: 1px solid #000;
  transform-origin: center bottom;
  animation: rotorFlipTop 0.24s cubic-bezier(0.4, 0, 0.7, 1) forwards;
  z-index: 20;
}

/* Flipping Leaf Bottom (opens down 90deg -> 0deg displaying new digit bottom half) */
.c26-rotor-leaf-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  overflow: hidden;
  background: linear-gradient(180deg, #13100e 0%, #1f1a16 100%);
  transform-origin: center top;
  animation: rotorFlipBottom 0.24s cubic-bezier(0.15, 0.6, 0.4, 1) 0.20s both;
  z-index: 30;
}

@keyframes rotorFlipTop {
  0% {
    transform: perspective(350px) rotateX(0deg);
    filter: brightness(1);
  }
  100% {
    transform: perspective(350px) rotateX(-90deg);
    filter: brightness(0.6);
  }
}

@keyframes rotorFlipBottom {
  0% {
    transform: perspective(350px) rotateX(90deg);
    filter: brightness(0.7);
  }
  100% {
    transform: perspective(350px) rotateX(0deg);
    filter: brightness(1);
  }
}

/* Center Horizontal Axle Seam */
.c26-rotor-seam {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1.5px;
  background: #000000;
  box-shadow: 0 1px 1px rgba(255, 255, 255, 0.08);
  z-index: 40;
  pointer-events: none;
}

/* Metal Side Hinge Pins */
.c26-rotor-hinge {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 2.5px;
  height: 6px;
  background: #DDD4BC;
  z-index: 45;
  pointer-events: none;
}

.c26-rotor-hinge.left { left: 0; }
.c26-rotor-hinge.right { right: 0; }
.c26-rotor-hinge.crimson { background: #C23A1E; }
`;

const FlipDigit = ({ digit, isCrimson = false }) => {
  const [curr, setCurr] = useState(digit);
  const [prev, setPrev] = useState(digit);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (digit !== curr) {
      setPrev(curr);
      setCurr(digit);
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setIsFlipping(false);
      }, 480);
      return () => clearTimeout(timer);
    }
  }, [digit, curr]);

  return (
    <div className={`c26-rotor ${isCrimson ? 'crimson' : ''}`}>
      {/* 1. Upper Static Half (shows current/new digit) */}
      <div className="c26-rotor-half top">
        <div className="c26-rotor-num-inner">
          <span className={`c26-rotor-glyph ${isCrimson ? 'crimson' : ''}`}>{curr}</span>
        </div>
      </div>

      {/* 2. Lower Static Half (shows current/new digit) */}
      <div className="c26-rotor-half bottom">
        <div className="c26-rotor-num-inner bottom-shift">
          <span className={`c26-rotor-glyph ${isCrimson ? 'crimson' : ''}`}>{curr}</span>
        </div>
      </div>

      {/* 3. Flipping Top Leaf (folds DOWN displaying OLD digit) */}
      {isFlipping && (
        <div className="c26-rotor-leaf-top">
          <div className="c26-rotor-num-inner">
            <span className={`c26-rotor-glyph ${isCrimson ? 'crimson' : ''}`}>{prev}</span>
          </div>
        </div>
      )}

      {/* 4. Flipping Bottom Leaf (opens DOWN displaying NEW digit) */}
      {isFlipping && (
        <div className="c26-rotor-leaf-bottom">
          <div className="c26-rotor-num-inner bottom-shift">
            <span className={`c26-rotor-glyph ${isCrimson ? 'crimson' : ''}`}>{curr}</span>
          </div>
        </div>
      )}

      {/* Center axle seam line */}
      <div className="c26-rotor-seam"></div>
      {/* Metallic axle hinge pins */}
      <div className={`c26-rotor-hinge left ${isCrimson ? 'crimson' : ''}`}></div>
      <div className={`c26-rotor-hinge right ${isCrimson ? 'crimson' : ''}`}></div>
    </div>
  );
};

const FlipUnit = ({ value, label, code, isCrimson = false }) => {
  const str = String(value).padStart(2, '0');
  return (
    <div className="c26-flip-unit">
      <span className={`font-mono text-[9px] sm:text-xs font-bold tracking-wider uppercase mb-1.5 ${isCrimson ? 'text-crimson' : 'text-bone-dim'}`}>
        {code}
      </span>
      <div className="c26-rotor-pair">
        <FlipDigit digit={str[0]} isCrimson={isCrimson} />
        <FlipDigit digit={str[1]} isCrimson={isCrimson} />
      </div>
      <span className={`font-label text-[9px] sm:text-xs font-semibold tracking-widest uppercase mt-2 ${isCrimson ? 'text-crimson' : 'text-bone'}`}>
        {label}
      </span>
    </div>
  );
};

const MechColon = () => (
  <div className="flex flex-col justify-center items-center gap-1.5 sm:gap-2.5 py-4 select-none opacity-80 self-center">
    <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-bone shadow-[0_0_8px_rgba(232,225,206,0.6)]"></span>
    <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-bone shadow-[0_0_8px_rgba(232,225,206,0.6)]"></span>
  </div>
);

const PromptsPortal = () => {
  const [timeLeft, setTimeLeft] = useState({
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
    isLive: false
  });

  // Position live prompt dossiers (Rocketry & AEROSS Prix) at the top of the prompts roster
  const sortedEvents = useMemo(() => {
    const rocketry = events.find((e) => e.id === '07' || e.id === 'rocketry');
    const prix = events.find((e) => e.id === '08' || e.id === 'f1');
    const others = events.filter(
      (e) => e.id !== '07' && e.id !== 'rocketry' && e.id !== '08' && e.id !== 'f1'
    );
    return [rocketry, prix, ...others].filter(Boolean);
  }, []);

  useEffect(() => {
    function calculate() {
      const now = Date.now();
      const diff = Math.max(0, TARGET_DATE_IST - now);

      const totalSecs = Math.floor(diff / 1000);
      const totalDays = Math.floor(totalSecs / 86400);
      const hours = Math.floor((totalSecs % 86400) / 3600);
      const minutes = Math.floor((totalSecs % 3600) / 60);
      const seconds = totalSecs % 60;

      const months = Math.floor(totalDays / 30);
      const days = totalDays % 30;

      setTimeLeft({
        months,
        days,
        hours,
        minutes,
        seconds,
        totalSeconds: totalSecs,
        isLive: diff === 0
      });
    }

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
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
      <section className="mb-8 sm:mb-12">
        <div className="flex items-baseline gap-3 mb-2 flex-wrap">
          <span className="font-mono text-xs text-crimson font-bold uppercase tracking-[0.2em] px-2 py-0.5 border border-crimson bg-crimson/10">
            {timeLeft.isLive ? 'GATE UNLOCKED // LIVE' : 'ARMED CHRONOMETER // T-MINUS'}
          </span>
          <span className="font-mono text-xs text-bone-dim tracking-wider uppercase">
            TARGET: 13 OCT 2026 00:00:00 IST
          </span>
        </div>

        <h1 className="font-display text-[clamp(32px,7.5vw,92px)] leading-[0.9] tracking-[-0.01em] uppercase text-bone text-balance mb-4">
          Round 1 Prompts &amp; Challenges
        </h1>

        <p className="font-label font-medium text-sm sm:text-base tracking-[0.06em] text-bone-dim max-w-3xl leading-relaxed">
          The official central transmission terminal for all 8 CelesteCon 2026 competitions. Problem statements, engineering briefs, and digital deposit vaults unlock automatically according to the mission chronometer below.
        </p>
      </section>

      {/* ========================================================================= */}
      {/* LIVE PROMPTS ANNOUNCEMENT BULLETIN (ABOVE TIMER) */}
      {/* ========================================================================= */}
      <section className="mb-8 border-2 border-crimson bg-ink p-5 sm:p-7 shadow-2xl relative overflow-hidden animate-fadeIn">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-crimson/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-crimson/30 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="font-mono text-xs uppercase tracking-[0.2em] font-bold text-bone">
                OFFICIAL TRANSMISSION // LIVE PROMPTS BROADCAST
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] tracking-widest text-green-400 font-bold border border-green-500/40 px-2.5 py-0.5 bg-green-500/10 uppercase">
                ● 2 PROMPT DOSSIERS UNLOCKED
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-2">
              <h2 className="font-display text-2xl sm:text-3xl uppercase text-bone tracking-wide leading-tight">
                Rocketry &amp; AEROSS Prix Prompts Are <span className="text-crimson">Now Live</span>
              </h2>
              <p className="font-label text-xs sm:text-sm text-bone-dim leading-relaxed">
                Ahead of the automated 13 October countdown for remaining tracks, the full interactive problem dossiers, dimensional constraints, and engineering regulations for <strong className="text-bone">Event 07 (Rocketry)</strong> and <strong className="text-bone">Event 08 (AEROSS Prix)</strong> are armed and open for team formulation.
              </p>
            </div>

            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Event 07 Rocketry Mini-Card */}
              <Link
                to="/prompts/rocketry"
                className="group border border-bone/40 hover:border-crimson bg-ink-2 p-3.5 transition-all flex flex-col justify-between shadow-md hover:bg-crimson/5"
              >
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 bg-crimson text-bone-hi">
                      07 · ROC
                    </span>
                    <span className="font-mono text-[9px] text-green-400 font-bold uppercase tracking-wider">
                      ● LIVE
                    </span>
                  </div>
                  <div className="font-display text-base text-bone uppercase group-hover:text-crimson transition-colors leading-tight">
                    Rocketry Model &amp; Flight
                  </div>
                  <p className="font-mono text-[10px] text-bone-dim mt-1 line-clamp-2">
                    Estes D12-5 motor rules &amp; OpenRocket .ork specs.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-bone/20 flex items-center justify-between text-[11px] font-label font-bold text-crimson group-hover:text-bone transition-colors uppercase tracking-wider">
                  <span>View Brief</span>
                  <span>→</span>
                </div>
              </Link>

              {/* Event 08 AEROSS Prix Mini-Card */}
              <Link
                to="/prompts/prix"
                className="group border border-bone/40 hover:border-crimson bg-ink-2 p-3.5 transition-all flex flex-col justify-between shadow-md hover:bg-crimson/5"
              >
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 bg-crimson text-bone-hi">
                      08 · APRIX
                    </span>
                    <span className="font-mono text-[9px] text-green-400 font-bold uppercase tracking-wider">
                      ● LIVE
                    </span>
                  </div>
                  <div className="font-display text-base text-bone uppercase group-hover:text-crimson transition-colors leading-tight">
                    AEROSS Prix
                  </div>
                  <p className="font-mono text-[10px] text-bone-dim mt-1 line-clamp-2">
                    CO2 sprint track rules, 30-pg dossier &amp; ₹30k budget cap.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-bone/20 flex items-center justify-between text-[11px] font-label font-bold text-crimson group-hover:text-bone transition-colors uppercase tracking-wider">
                  <span>View Brief</span>
                  <span>→</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MECHANICAL CHRONOMETER TERMINAL */}
      {/* ========================================================================= */}
      <div className="relative border-2 border-bone bg-ink-2/60 p-4 sm:p-8 mb-12 shadow-2xl backdrop-blur-sm overflow-hidden">
        {/* Corner Rivet Screws */}
        <span className="absolute top-2 left-2 font-mono text-xs text-bone/40 select-none">+</span>
        <span className="absolute top-2 right-2 font-mono text-xs text-bone/40 select-none">+</span>
        <span className="absolute bottom-2 left-2 font-mono text-xs text-bone/40 select-none">+</span>
        <span className="absolute bottom-2 right-2 font-mono text-xs text-bone/40 select-none">+</span>

        {/* Chassis Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-bone/30 pb-3 mb-6 font-mono text-xs uppercase">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-crimson animate-pulse"></span>
            <span className="font-bold tracking-widest text-bone">
              LAUNCH CHRONOMETER // T-MINUS TO PROMPT TRANSMISSION
            </span>
          </div>
          <div className="font-mono text-[10px] tracking-widest text-crimson font-bold border border-crimson/50 px-2 py-0.5 bg-crimson/10">
            CLOCK FORMAT: MM : DD : HH : MM : SS
          </div>
        </div>

        {/* Inject mechanical flipdown styles */}
        <style dangerouslySetInnerHTML={{ __html: FLIPDOWN_STYLES }} />

        {/* The 5 Mechanical FlipDown Rotor Units with Authentic Split-Flap Animation */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 md:gap-3.5 flex-wrap my-3 sm:my-5">
          <FlipUnit value={timeLeft.months} label="Months" code="MM" />
          <MechColon />
          <FlipUnit value={timeLeft.days} label="Days" code="DD" />
          <MechColon />
          <FlipUnit value={timeLeft.hours} label="Hours" code="HH" />
          <MechColon />
          <FlipUnit value={timeLeft.minutes} label="Minutes" code="MM" />
          <MechColon />
          <FlipUnit value={timeLeft.seconds} label="Seconds" code="SS" isCrimson={true} />
        </div>

        {/* Chassis Footer Telemetry Bar */}
        <div className="mt-6 pt-4 border-t border-bone/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 font-mono text-[10px] sm:text-[11px] tracking-wider uppercase text-bone-dim">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
            <span>ENCRYPTION: AES-256 ACTIVE // AUTOMATED RELEASE PROTOCOL</span>
          </div>
          <div>
            SUBMISSION WINDOW: <strong>13 OCT 00:00 &mdash; 20 OCT 23:59 IST</strong>
          </div>
        </div>
      </div>

      {/* Submission Portal Dedicated Link Banner */}
      <div className="border-2 border-crimson p-5 sm:p-6 bg-crimson/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-crimson animate-pulse"></span>
            <span className="font-mono text-xs uppercase font-bold text-bone tracking-widest">
              OFFICIAL DIGITAL SUBMISSION GATEWAY
            </span>
          </div>
          <p className="font-label text-xs sm:text-sm text-bone-dim max-w-2xl leading-relaxed">
            Ready to deposit your team's engineering proposals, OpenRocket files, CAD models, or pitch decks? Visit the dedicated Submission Portal to authenticate with your School UID and deposit deliverables.
          </p>
        </div>
        <Link
          to="/submissions"
          className="px-6 py-3 bg-crimson text-bone-hi hover:bg-ink hover:text-crimson font-label font-bold text-xs uppercase tracking-widest border border-crimson transition-all shrink-0 flex items-center gap-2 shadow-md hover:shadow-crimson/20"
        >
          <span>Go to Submission Portal</span>
          <span>&rarr;</span>
        </Link>
      </div>

      {/* Prompts Overview */}
      <div className="space-y-8 mb-12">

        {/* Release Schedule Notice */}
        <div className="border border-bone/30 p-4 bg-ink/40 font-mono text-xs text-bone-dim leading-relaxed flex items-start gap-3">
          <span className="text-crimson font-bold text-base">ℹ</span>
          <div>
            <strong className="text-bone uppercase">Remaining Competitions Release Schedule:</strong> Problem statements, engineering prompts, CAD references, and case themes for Settle-Me-This, Volatus, Quizzitch, Business Power Pitch, AEROSS Theatre, and CelesteJam will unlock automatically directly on this page at <strong>00:00:00 IST on 13 October 2026</strong>.
          </div>
        </div>

        {/* All 8 Events Roster (Rocketry & AEROSS Prix prioritized at top) */}
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
                    {deliv.isLive ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <strong className="text-green-400">Live</strong>
                      </>
                    ) : (
                      <>
                        Status: <strong className="text-amber-500">Unlocks 13 Oct</strong>
                      </>
                    )}
                  </span>
                  {deliv.portalUrl ? (
                    <Link
                      to={deliv.portalUrl}
                      className="px-3 py-1 bg-crimson text-bone-hi font-label font-bold text-xs uppercase tracking-wider border border-crimson hover:bg-ink hover:text-crimson transition-colors flex items-center gap-1"
                    >
                      <span>Open {deliv.portalLabel || ev.name}</span>
                      <span>&rarr;</span>
                    </Link>
                  ) : (
                    <span className="text-bone-dim/60 uppercase">
                      Vault ID: {code}-R1
                    </span>
                  )}
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
