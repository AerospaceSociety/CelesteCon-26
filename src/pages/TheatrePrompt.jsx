import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AUDITION_DEADLINE = new Date('2026-10-18T23:59:59+05:30').getTime();

export default function TheatrePrompt() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isAuditionOpen: true
  });

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const diff = Math.max(0, AUDITION_DEADLINE - now);
      const isAuditionOpen = diff > 0;

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s, isAuditionOpen });
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
          <span className="text-crimson font-bold uppercase">EVENT 05 · AEROSS THEATRE</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/submissions" className="text-crimson hover:text-bone transition-colors font-bold uppercase tracking-widest text-[11px] flex items-center gap-1">
            <span>Submission Vault</span>
            <span>→</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-green-400 uppercase font-bold text-[10px] tracking-wider">THEMES UNLOCKED</span>
          </div>
        </div>
      </div>

      {/* Main Hero Banner with Brutalist Stage Aesthetic */}
      <div className="border-2 border-bone bg-ink p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-crimson/10 rounded-full blur-3xl pointer-events-none -mr-28 -mt-28"></div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 relative z-10">
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold px-2 py-0.5 bg-crimson text-bone-hi">
                EVENT 05
              </span>
              <span className="font-mono text-xs uppercase px-2 py-0.5 border border-bone/40 text-bone-dim">
                Open Stage &amp; Talent Showcase
              </span>
              <span className="font-mono text-xs uppercase px-2 py-0.5 border border-bone/40 text-bone-dim">
                Grades 9–12 Only
              </span>
              <span className="font-mono text-xs uppercase px-2.5 py-0.5 bg-green-500/10 text-green-400 border border-green-500/40 font-bold">
                ● THEMES RELEASED
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl text-bone uppercase tracking-wide leading-none">
              AEROSS Theatre <span className="text-crimson">2026</span>
            </h1>

            {/* Dual Theme Announcement Callout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 bg-crimson/10 border-l-4 border-crimson font-mono text-xs text-bone space-y-1">
                <span className="text-crimson font-bold uppercase tracking-widest block text-[11px]">
                  // ROUND 1 · VIDEO AUDITION THEME
                </span>
                <span className="font-display text-xl sm:text-2xl text-bone uppercase tracking-wider block">
                  NO THEME · OPEN STAGE
                </span>
                <p className="text-[11px] text-bone-dim leading-relaxed font-sans normal-case">
                  Total creative liberty: stand-up comedy, dramatic skits, music, singing, dance, poetry, mimicry, or stage magic.
                </p>
              </div>

              <div className="p-3.5 bg-bone/5 border-l-4 border-bone/70 font-mono text-xs text-bone space-y-1">
                <span className="text-bone-dim font-bold uppercase tracking-widest block text-[11px]">
                  // ROUND 2 · ONSITE FINALE THEME
                </span>
                <span className="font-display text-xl sm:text-2xl text-bone uppercase tracking-wider block">
                  &ldquo;PAST, PRESENT AND THE FUTURE&rdquo;
                </span>
                <p className="text-[11px] text-bone-dim leading-relaxed font-sans normal-case">
                  Live on-stage showcase on 24 October, paired with high-energy impromptu improv on the spot.
                </p>
              </div>
            </div>

            <p className="font-label text-base sm:text-lg text-bone italic">
              &ldquo;All the world’s a stage, and all the men and women merely players.&rdquo; &mdash; William Shakespeare
            </p>

            <p className="font-label text-sm sm:text-base text-bone-dim leading-relaxed max-w-2xl">
              AEROSS Theatre removes the conventional thematic boundaries of aerospace conferences and celebrates unconstrained performance art. Showcase your talent on video for Round 1 with completely open artistic freedom, then qualify for the grand stage at DPS R.K. Puram to explore the generational arc of time in Round 2.
            </p>
          </div>

          {/* Quick Info & Audition Countdown Card */}
          <div className="w-full lg:w-80 bg-ink-2 p-5 border-2 border-bone/60 space-y-4 shrink-0 shadow-xl">
            <div className="flex justify-between items-center text-xs font-mono border-b border-bone/20 pb-2">
              <span className="text-bone-dim uppercase">Audition Window</span>
              <span className="font-bold text-green-400 uppercase">
                {timeLeft.isAuditionOpen ? '● SUBMISSIONS OPEN' : 'AUDITIONS CLOSED'}
              </span>
            </div>

            <div className="space-y-1">
              <span className="font-mono text-[10px] text-bone-dim uppercase block">
                Deadline: 18 Oct 23:59:59 IST
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
                <strong className="text-bone">Grades 9–12 Only</strong>
              </div>
              <div className="flex justify-between">
                <span>Team Size:</span>
                <strong className="text-bone">3–5 Members</strong>
              </div>
              <div className="flex justify-between">
                <span>Format:</span>
                <strong className="text-bone">Video Audition → Stage</strong>
              </div>
              <div className="flex justify-between">
                <span>Deliverable:</span>
                <strong className="text-bone">3–5 Min Video (Drive Link)</strong>
              </div>
            </div>

            <Link
              to="/submissions"
              className="w-full py-2.5 bg-crimson text-bone-hi font-label font-bold text-xs uppercase tracking-widest text-center border border-crimson hover:bg-ink hover:text-crimson transition-colors block shadow-md"
            >
              Deposit Audition Video →
            </Link>
          </div>
        </div>
      </div>

      {/* Structured Round Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Round 1 Card */}
        <div className="border-2 border-bone/40 bg-ink p-6 space-y-4 hover:border-crimson transition-colors">
          <div className="flex justify-between items-center border-b border-bone/20 pb-3">
            <span className="font-mono text-xs font-bold px-2 py-0.5 bg-crimson text-bone-hi">
              ROUND 1 · ONLINE AUDITION
            </span>
            <span className="font-mono text-[11px] text-green-400 font-bold">
              OPEN STAGE (NO THEME)
            </span>
          </div>

          <h2 className="font-display text-2xl text-bone uppercase tracking-wide">
            Video Audition Performance
          </h2>

          <p className="font-label text-sm text-bone-dim leading-relaxed">
            Record and submit a 3–5 minute video demonstrating your performance. There is strictly <strong className="text-bone">no theme</strong> for Round 1: choose any discipline or combination of talents that best represents your ensemble.
          </p>

          <div className="space-y-2 font-mono text-xs text-bone-dim">
            <div className="flex items-start gap-2">
              <span className="text-crimson font-bold">▶</span>
              <span><strong className="text-bone">Permitted Genres:</strong> Stand-up comedy, theatrical skit, instrumental music, vocal performance, solo/group dance, spoken word poetry, mimicry, illusions &amp; magic, or monologues.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-crimson font-bold">▶</span>
              <span><strong className="text-bone">Duration:</strong> Strictly 3 to 5 minutes. Videos shorter than 3 minutes or exceeding 5 minutes incur time penalties.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-crimson font-bold">▶</span>
              <span><strong className="text-bone">Format &amp; Submission:</strong> Submit via Google Drive link (access permissions set to &ldquo;Anyone with link can view&rdquo;) or unlisted YouTube link in the CelesteCon Submission Vault before 18 October 23:59:59 IST.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-crimson font-bold">▶</span>
              <span><strong className="text-bone">Audio/Visual Clarity:</strong> Ensure vocals and dialogue are distinct without clipping. Good lighting and stable camera placement are required.</span>
            </div>
          </div>
        </div>

        {/* Round 2 Card */}
        <div className="border-2 border-bone/40 bg-ink p-6 space-y-4 hover:border-bone transition-colors">
          <div className="flex justify-between items-center border-b border-bone/20 pb-3">
            <span className="font-mono text-xs font-bold px-2 py-0.5 border border-bone text-bone">
              ROUND 2 · ONSITE FINALE
            </span>
            <span className="font-mono text-[11px] text-bone font-bold">
              24 OCT 2026 · DPS RKP
            </span>
          </div>

          <h2 className="font-display text-2xl text-bone uppercase tracking-wide">
            Live Showcase &amp; Improv
          </h2>

          <p className="font-label text-sm text-bone-dim leading-relaxed">
            Top qualifying teams perform live on event day at DPS R.K. Puram under the official finale theme: <strong className="text-bone">&ldquo;Past, Present and the Future&rdquo;</strong>.
          </p>

          <div className="space-y-2 font-mono text-xs text-bone-dim">
            <div className="flex items-start gap-2">
              <span className="text-crimson font-bold">▶</span>
              <span><strong className="text-bone">Thematic Focus:</strong> Interpret &ldquo;Past, Present and the Future&rdquo; through history, contemporary dilemmas, speculative horizons, or generational commentary.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-crimson font-bold">▶</span>
              <span><strong className="text-bone">Live Improv Challenge:</strong> Following the prepared performance, the jury will issue a surprise on-the-spot prompt testing spontaneous wit, presence of mind, and adaptability under pressure.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-crimson font-bold">▶</span>
              <span><strong className="text-bone">Stage Equipment Provided:</strong> Standard stage lighting, handheld vocal microphones, lapel mics, and 3.5mm / Bluetooth audio PA playback.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-crimson font-bold">▶</span>
              <span><strong className="text-bone">Props &amp; Costumes:</strong> Teams are welcome to bring self-managed costumes and safe hand props. Dangerous items (open flames, liquids, powders) are strictly banned.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Evaluation Rubric & Contact Info */}
      <div className="border-2 border-bone bg-ink-2 p-6 sm:p-8 space-y-6">
        <div className="border-b border-bone/20 pb-3 flex flex-wrap justify-between items-center gap-2">
          <h3 className="font-display text-2xl text-bone uppercase tracking-wider">
            Evaluation Matrix &amp; Stage Conduct
          </h3>
          <span className="font-mono text-xs text-bone-dim">
            Point of Contact: Siddharth Srivastava (r24998siddharth@dpsrkp.net)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
          <div className="border border-bone/20 bg-ink p-4 space-y-1">
            <span className="text-crimson font-bold text-xs uppercase block">// CRITERION 01 (35%)</span>
            <div className="font-display text-lg text-bone uppercase">Humour &amp; Engagement</div>
            <p className="text-[11px] text-bone-dim font-sans normal-case">
              Audience connection, comic timing, thematic resonance, emotional delivery, and sustained crowd engagement throughout the set.
            </p>
          </div>

          <div className="border border-bone/20 bg-ink p-4 space-y-1">
            <span className="text-crimson font-bold text-xs uppercase block">// CRITERION 02 (35%)</span>
            <div className="font-display text-lg text-bone uppercase">Creativity &amp; Originality</div>
            <p className="text-[11px] text-bone-dim font-sans normal-case">
              Fresh concepts, clever subversion of tropes, unique stylistic fusion, and ingenious interpretation of &ldquo;Past, Present and the Future&rdquo;.
            </p>
          </div>

          <div className="border border-bone/20 bg-ink p-4 space-y-1">
            <span className="text-crimson font-bold text-xs uppercase block">// CRITERION 03 (30%)</span>
            <div className="font-display text-lg text-bone uppercase">Stage Presence &amp; Improv</div>
            <p className="text-[11px] text-bone-dim font-sans normal-case">
              Confidence, vocal projection, body language, synchronization among ensemble members, and rapid-fire response during the live improv round.
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap justify-between items-center gap-4">
          <p className="font-mono text-xs text-bone-dim max-w-xl">
            Questions regarding performance requirements or audio-visual setups? Reach out directly to the event lead or post in the official delegate communication channels.
          </p>
          <div className="flex gap-3">
            <Link
              to="/comps"
              className="px-4 py-2 border border-bone/40 hover:border-bone text-bone font-mono text-xs uppercase transition-colors"
            >
              ← Back to Competitions
            </Link>
            <Link
              to="/submissions"
              className="px-5 py-2 bg-crimson text-bone-hi font-mono text-xs font-bold uppercase tracking-wider hover:bg-ink hover:text-crimson border border-crimson transition-colors"
            >
              Deposit Audition →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
