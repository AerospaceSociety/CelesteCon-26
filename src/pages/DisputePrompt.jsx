import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const QUIZ_DATE = new Date('2026-10-16T18:00:00+05:30').getTime();

export default function DisputePrompt() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isQuizPending: true
  });

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const diff = Math.max(0, QUIZ_DATE - now);
      const isQuizPending = diff > 0;

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s, isQuizPending });
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
          <span className="text-crimson font-bold uppercase">EVENT 03 · IN PURSUIT OF DISPUTE (IPOD)</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/submissions" className="text-crimson hover:text-bone transition-colors font-bold uppercase tracking-widest text-[11px] flex items-center gap-1">
            <span>Submission Vault</span>
            <span>→</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-amber-400 uppercase font-bold text-[10px] tracking-wider">ROUND 1 SCHEDULED</span>
          </div>
        </div>
      </div>

      {/* Main Hero Banner with Brutalist Debate & Radar Aesthetic */}
      <div className="border-2 border-bone bg-ink p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-crimson/10 rounded-full blur-3xl pointer-events-none -mr-28 -mt-28"></div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 relative z-10">
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold px-2 py-0.5 bg-crimson text-bone-hi">
                EVENT 03
              </span>
              <span className="font-mono text-xs uppercase px-2 py-0.5 border border-bone/40 text-bone-dim">
                Quiz (Quizzitch) &amp; Debate
              </span>
              <span className="font-mono text-xs uppercase px-2 py-0.5 border border-bone/40 text-bone-dim">
                Grades 9–12 · 2 Students / Team
              </span>
              <span className="font-mono text-xs uppercase px-2.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/40 font-bold">
                ● 16 OCT QUIZ WINDOW
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl text-bone uppercase tracking-wide leading-none">
              In Pursuit of Dispute <span className="text-crimson">(IPoD)</span>
            </h1>

            {/* Official Round Announcement Callout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 bg-crimson/10 border-l-4 border-crimson font-mono text-xs text-bone space-y-1">
                <span className="text-crimson font-bold uppercase tracking-widest block text-[11px]">
                  // ROUND 1 · ONLINE QUIZZITCH SCREENING
                </span>
                <span className="font-display text-xl sm:text-2xl text-bone uppercase tracking-wider block">
                  16TH OCTOBER 2026
                </span>
                <p className="text-[11px] text-bone-dim leading-relaxed font-sans normal-case">
                  45-minute timed online quiz. Details, access links, and portal instructions will be shared on registered email and updated here on the website.
                </p>
              </div>

              <div className="p-3.5 bg-bone/5 border-l-4 border-bone/70 font-mono text-xs text-bone space-y-1">
                <span className="text-bone-dim font-bold uppercase tracking-widest block text-[11px]">
                  // ROUND 2 · DEBATE
                </span>
                <span className="font-display text-xl sm:text-2xl text-bone uppercase tracking-wider block">
                  MOTIONS RELEASED 21ST OCT
                </span>
                <p className="text-[11px] text-bone-dim leading-relaxed font-sans normal-case">
                  Motions would be released on 21st October (3 days prior). The Top 10 qualifying delegations battle onsite on 24 October at CelesteCon.
                </p>
              </div>
            </div>

            <p className="font-label text-base sm:text-lg text-bone italic">
              &ldquo;It’s better to debate a question without settling it than to settle a question without debating it.&rdquo; &mdash; Joseph Joubert
            </p>

            <p className="font-label text-sm sm:text-base text-bone-dim leading-relaxed max-w-2xl">
              In Pursuit of Dispute (IPoD) is CelesteCon’s premier intellectual clash combining lightning-speed aerospace knowledge with rigorous cross-examination. Exactly 2 students represent each school. Battle through the digital Quizzitch crucible on 16th October, then ascend to the onsite chambers on 24 October to defend complex motions released on 21st October.
            </p>
          </div>

          {/* Quick Info & Screening Quiz Countdown Card */}
          <div className="w-full lg:w-80 bg-ink-2 p-5 border-2 border-bone/60 space-y-4 shrink-0 shadow-xl">
            <div className="flex justify-between items-center text-xs font-mono border-b border-bone/20 pb-2">
              <span className="text-bone-dim uppercase">Round 1 Screening Clock</span>
              <span className="font-bold text-amber-400 uppercase">
                {timeLeft.isQuizPending ? '● COUNTDOWN TO 16 OCT' : 'QUIZ WINDOW LIVE'}
              </span>
            </div>

            <div className="space-y-1">
              <span className="font-mono text-[10px] text-bone-dim uppercase block">
                Quiz Date: 16 October 2026
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
                <strong className="text-bone">Grades 9–12</strong>
              </div>
              <div className="flex justify-between">
                <span>Team Size:</span>
                <strong className="text-bone">2 Students / Team</strong>
              </div>
              <div className="flex justify-between">
                <span>School Quota:</span>
                <strong className="text-bone">1 Team per School</strong>
              </div>
              <div className="flex justify-between">
                <span>Format:</span>
                <strong className="text-bone">Quizzitch → Debate Chambers</strong>
              </div>
              <div className="flex justify-between">
                <span>Motions Live:</span>
                <strong className="text-crimson font-bold">21 October 2026</strong>
              </div>
            </div>

            <Link
              to="/submissions"
              className="w-full py-2.5 bg-crimson text-bone-hi font-label font-bold text-xs uppercase tracking-widest text-center border border-crimson hover:bg-ink hover:text-crimson transition-colors block shadow-md"
            >
              Registered Teams Portal →
            </Link>
          </div>
        </div>
      </div>
    </div >
  );
}
