import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { events } from '../../data/events';

const TARGET_RELEASE_IST = new Date('2026-10-13T00:00:00+05:30').getTime();

export default function GenericPromptPortal({ eventId: propEventId }) {
  const params = useParams();
  const slugOrId = propEventId || params.eventId || params.compSlug || '01';

  // Find corresponding event
  const event = useMemo(() => {
    // Map slugs to IDs
    const SLUG_MAP = {
      '01': '01',
      settle: '01',
      settlement: '01',
      smt: '01',
      '02': '02',
      volatus: '02',
      vol: '02',
      '03': '03',
      dispute: '03',
      ipod: '03',
      debate: '03',
      '04': '04',
      bpp: '04',
      pitch: '04',
      business: '04',
      '05': '05',
      theatre: '05',
      ath: '05',
      '06': '06',
      gamejam: '06',
      celestejam: '06',
      cosmojam: '06',
      cjam: '06',
      '07': '07',
      rocketry: '07',
      roc: '07',
      '08': '08',
      prix: '08',
      f1: '08',
      aprix: '08'
    };

    const targetId = SLUG_MAP[slugOrId.toLowerCase()] || slugOrId;
    return events.find(e => e.id === targetId) || events[0];
  }, [slugOrId]);

  if (event.id === '06') {
    return <Navigate to="/prompts/gamejam" replace />;
  }
  if (event.id === '07') {
    return <Navigate to="/prompts/rocketry" replace />;
  }
  if (event.id === '08') {
    return <Navigate to="/prompts/prix" replace />;
  }

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    unlocked: false
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const diff = TARGET_RELEASE_IST - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, unlocked: true });
      } else {
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const s = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days: d, hours: h, minutes: m, seconds: s, unlocked: false });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Top Breadcrumb & Status */}
      <div className="border-b-2 border-bone/30 pb-3 flex flex-wrap justify-between items-center gap-3 font-mono text-xs text-bone-dim">
        <div className="flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-crimson transition-colors">CELESTECON 2026</Link>
          <span>/</span>
          <Link to="/comps" className="hover:text-crimson transition-colors">COMPETITIONS</Link>
          <span>/</span>
          <Link to="/prompts" className="hover:text-crimson transition-colors">PROMPTS</Link>
          <span>/</span>
          <span className="text-crimson font-bold uppercase">EVENT {event.id} · {event.name}</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/submissions" className="text-crimson hover:text-bone transition-colors font-bold uppercase tracking-widest text-[11px]">
            Submission Portal →
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-bone uppercase font-bold text-[10px]">DOSSIER № CC26-E{event.id}</span>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <div className="border-2 border-bone bg-ink p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold px-2 py-0.5 bg-crimson text-bone-hi">
                EVENT {event.id}
              </span>
              <span className="font-mono text-xs uppercase px-2 py-0.5 border border-bone/40 text-bone-dim">
                {event.discipline}
              </span>
              <span className="font-mono text-xs uppercase px-2 py-0.5 border border-bone/40 text-bone-dim">
                {event.mode} Track
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl text-bone uppercase tracking-wide leading-none">
              {event.name}
            </h1>

            <p className="font-label text-base sm:text-lg text-crimson font-bold uppercase tracking-wider">
              {event.quote || event.hook}
            </p>

            <p className="font-label text-sm sm:text-base text-bone-dim leading-relaxed">
              {event.overview}
            </p>
          </div>

          {/* Quick Info Box / Countdown Card */}
          <div className="w-full lg:w-80 bg-ink-2 p-5 border-2 border-bone/60 space-y-3 shrink-0">
            <div className="flex justify-between items-center text-xs font-mono border-b border-bone/20 pb-2">
              <span className="text-bone-dim uppercase">Prompt Status</span>
              <span className={`font-bold ${timeLeft.unlocked ? 'text-green-400' : 'text-amber-400'}`}>
                {timeLeft.unlocked ? '● RELEASED' : 'PROMPT RELEASES 13 OCT'}
              </span>
            </div>

            {!timeLeft.unlocked ? (
              <div className="space-y-1">
                <span className="font-mono text-[10px] text-bone-dim uppercase block">Release Clock (IST)</span>
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
            ) : (
              <div className="p-2.5 bg-green-950/30 border border-green-500/40 text-center font-mono text-xs text-green-400 font-bold">
                PROMPT CASE DOSSIER LIVE
              </div>
            )}

            <div className="space-y-1 font-mono text-[11px] text-bone-dim pt-1 border-t border-bone/20">
              <div className="flex justify-between">
                <span>Eligibility:</span>
                <strong className="text-bone">{event.eligibility}</strong>
              </div>
              <div className="flex justify-between">
                <span>Team Size:</span>
                <strong className="text-bone">{event.team}</strong>
              </div>
              <div className="flex justify-between">
                <span>School Quota:</span>
                <strong className="text-bone">{event.schoolCap}</strong>
              </div>
            </div>

            <Link
              to="/submissions"
              className="w-full py-2 bg-crimson text-bone-hi font-label font-bold text-xs uppercase tracking-widest text-center border border-crimson hover:bg-ink hover:text-crimson transition-colors block"
            >
              Go to Submission Vault →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
