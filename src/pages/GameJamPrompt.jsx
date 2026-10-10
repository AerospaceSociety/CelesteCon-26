import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SPRINT_DEADLINE = new Date('2026-10-22T23:59:59+05:30').getTime();

export default function GameJamPrompt() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isSprintOpen: true
  });

  // Sprint countdown timer
  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const diff = Math.max(0, SPRINT_DEADLINE - now);
      const isSprintOpen = diff > 0;

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s, isSprintOpen });
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Top Breadcrumb & Status */}
      <div className="border-b-2 border-bone/30 pb-3 flex flex-wrap justify-between items-center gap-3 font-mono text-xs text-bone-dim">
        <div className="flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-crimson transition-colors">CELESTECON 2026</Link>
          <span>/</span>
          <Link to="/comps" className="hover:text-crimson transition-colors">COMPETITIONS</Link>
          <span>/</span>
          <Link to="/prompts" className="hover:text-crimson transition-colors">PROMPTS</Link>
          <span>/</span>
          <span className="text-crimson font-bold uppercase">EVENT 06 · CELESTEJAM</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/submissions" className="text-crimson hover:text-bone transition-colors font-bold uppercase tracking-widest text-[11px] flex items-center gap-1">
            <span>Submission Vault</span>
            <span>→</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-green-400 uppercase font-bold text-[10px] tracking-wider">DOSSIER UNLOCKED</span>
          </div>
        </div>
      </div>

      {/* Main Hero Banner with Brutalist Arcade Aesthetic */}
      <div className="border-2 border-bone bg-ink p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-crimson/10 rounded-full blur-3xl pointer-events-none -mr-28 -mt-28"></div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold px-2 py-0.5 bg-crimson text-bone-hi">
                EVENT 06
              </span>
              <span className="font-mono text-xs uppercase px-2 py-0.5 border border-bone/40 text-bone-dim">
                Aerospace Game Development
              </span>
              <span className="font-mono text-xs uppercase px-2 py-0.5 border border-bone/40 text-bone-dim">
                Dual Track (Jr &amp; Sr)
              </span>
              <span className="font-mono text-xs uppercase px-2.5 py-0.5 bg-green-500/10 text-green-400 border border-green-500/40 font-bold">
                ● THEME LIVE
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl text-bone uppercase tracking-wide leading-none">
              CelesteJam <span className="text-crimson">2026</span>
            </h1>

            <div className="p-3 bg-crimson/10 border-l-4 border-crimson font-mono text-xs sm:text-sm text-bone">
              <span className="text-crimson font-bold uppercase tracking-widest block mb-1">
                // OFFICIAL THEME
              </span>
              <span className="font-display text-2xl sm:text-3xl text-bone uppercase tracking-wider">
                &ldquo;RETROGRESSION&rdquo;
              </span>
            </div>

            <p className="font-label text-base sm:text-lg text-bone italic">
              &ldquo;You can discover more about a person in an hour of play than in a year of conversation.&rdquo; &mdash; Plato
            </p>

            <p className="font-label text-sm sm:text-base text-bone-dim leading-relaxed max-w-2xl">
              Design, code, and polish an original aerospace minigame built around the theme <strong className="text-bone">Retrogression</strong>. Teams build remotely during the Sprint Window, then transform their laptops into interactive arcade stations at CelesteCon for live peer playtesting and algorithmic jury defense.
            </p>
          </div>

          {/* Quick Info & Sprint Chronometer Card */}
          <div className="w-full lg:w-80 bg-ink-2 p-5 border-2 border-bone/60 space-y-4 shrink-0 shadow-xl">
            <div className="flex justify-between items-center text-xs font-mono border-b border-bone/20 pb-2">
              <span className="text-bone-dim uppercase">Remote Sprint Clock</span>
              <span className="font-bold text-green-400 uppercase">
                {timeLeft.isSprintOpen ? '● SPRINT ACTIVE' : 'SPRINT CONCLUDED'}
              </span>
            </div>

            <div className="space-y-1">
              <span className="font-mono text-[10px] text-bone-dim uppercase block">
                Deadline: 22 Oct 23:59:59 IST
              </span>
              <div className="grid grid-cols-4 gap-1 text-center font-mono">
                <div className="bg-ink p-1.5 border border-bone/20">
                  <span className="text-lg font-bold text-bone block leading-tight">{timeLeft.days}</span>
                  <span className="text-[9px] text-bone-dim uppercase">Days</span>
                </div>
                <div className="bg-ink p-1.5 border border-bone/20">
                  <span className="text-lg font-bold text-bone block leading-tight">{timeLeft.hours}</span>
                  <span className="text-[9px] text-bone-dim uppercase">Hrs</span>
                </div>
                <div className="bg-ink p-1.5 border border-bone/20">
                  <span className="text-lg font-bold text-bone block leading-tight">{timeLeft.minutes}</span>
                  <span className="text-[9px] text-bone-dim uppercase">Min</span>
                </div>
                <div className="bg-ink p-1.5 border border-bone/20">
                  <span className="text-lg font-bold text-crimson block leading-tight">{timeLeft.seconds}</span>
                  <span className="text-[9px] text-bone-dim uppercase">Sec</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 font-mono text-[11px] text-bone-dim pt-2 border-t border-bone/20">
              <div className="flex justify-between">
                <span>Eligibility:</span>
                <strong className="text-bone">Jr (6–8) · Sr (9–12)</strong>
              </div>
              <div className="flex justify-between">
                <span>Team Size:</span>
                <strong className="text-bone">2–3 Members</strong>
              </div>
              <div className="flex justify-between">
                <span>Format:</span>
                <strong className="text-bone">Remote Build → Onsite Arcade</strong>
              </div>
              <div className="flex justify-between">
                <span>Deliverable:</span>
                <strong className="text-bone">Build + Video + Code</strong>
              </div>
            </div>

            <Link
              to="/submissions"
              className="w-full py-2.5 bg-crimson text-bone-hi font-label font-bold text-xs uppercase tracking-widest text-center border border-crimson hover:bg-ink hover:text-crimson transition-colors block shadow-md"
            >
              Deposit Deliverables →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
