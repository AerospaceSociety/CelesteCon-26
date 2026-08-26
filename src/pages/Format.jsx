import React from 'react';
import SectionHeader from '../components/SectionHeader';

const Format = () => {
  return (
    <div className="max-w-4xl">
      <SectionHeader section="05" title="Format & Logistics" jp="大会形式" />
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 mt-8">
        <div>
          <h3 className="font-display text-[clamp(24px,4vw,40px)] text-bone uppercase leading-[1.1] mb-6">
            A two-stage crucible.
          </h3>
          <p className="font-label text-base md:text-lg text-bone-dim mb-10 leading-relaxed max-w-2xl">
            CelesteCon VI operates on a hybrid model to ensure nationwide accessibility while maintaining the high-stakes pressure of an on-campus finale.
          </p>

          <div className="relative border-l-2 border-bone/30 ml-3 pl-8 pb-12">
            <div className="absolute w-4 h-4 bg-ink border-2 border-crimson -left-[9px] top-0 rounded-full"></div>
            <div className="font-mono text-xs text-crimson tracking-[0.15em] font-bold uppercase mb-1">Phase 01 // Nationwide</div>
            <h4 className="font-display text-2xl text-bone uppercase tracking-wide mb-3">Online Prelims</h4>
            <p className="font-label text-sm text-bone-dim max-w-xl leading-relaxed">
              Teams from across the country will compete remotely in the first round. Submissions for design, CAD, and business pitches will be uploaded to the portal, while quizzes and debates will be conducted via live virtual lobbies.
            </p>
          </div>

          <div className="relative border-l-2 border-transparent ml-3 pl-8">
            <div className="absolute w-4 h-4 bg-crimson border-2 border-crimson -left-[9px] top-0 rounded-full"></div>
            <div className="font-mono text-xs text-crimson tracking-[0.15em] font-bold uppercase mb-1">Phase 02 // New Delhi</div>
            <h4 className="font-display text-2xl text-bone uppercase tracking-wide mb-3">On-Campus Finale</h4>
            <p className="font-label text-sm text-bone-dim max-w-xl leading-relaxed mb-4">
              The top-performing teams from Round 1 will be invited to Delhi Public School, R.K. Puram for the grand finale. 
              This stage involves live presentations, on-the-spot physical builds, buzzer rounds, and the Open Arena.
            </p>
            <div className="border border-bone/30 bg-bone/5 p-4 inline-block">
              <span className="font-mono text-[10px] tracking-widest text-bone uppercase">Venue</span>
              <div className="font-label font-bold text-bone uppercase tracking-widest mt-1">Delhi Public School, R.K. Puram</div>
            </div>
          </div>
        </div>

        {/* Schedule / Logistics Card */}
        <div className="lg:border-l-2 border-bone lg:pl-10">
          <div className="border-2 border-bone sticky top-24">
            <div className="bg-bone text-ink font-mono text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 flex justify-between font-bold">
              <span>Logistics</span>
              <span className="font-jp text-ink-3">日程</span>
            </div>
            <dl className="p-4 grid grid-cols-1 gap-y-3 font-mono text-[10.5px] tracking-[0.03em]">
              <div>
                <dt className="text-crimson font-bold uppercase mb-0.5">Eligibility</dt>
                <dd className="text-bone border-b border-dotted border-bone/40 pb-1">Grades 6–12 (Junior/Senior)</dd>
              </div>
              <div>
                <dt className="text-crimson font-bold uppercase mb-0.5">Registration Deadline</dt>
                <dd className="text-bone border-b border-dotted border-bone/40 pb-1">TBA</dd>
              </div>
              <div>
                <dt className="text-crimson font-bold uppercase mb-0.5">Round 1 Commences</dt>
                <dd className="text-bone border-b border-dotted border-bone/40 pb-1">TBA</dd>
              </div>
              <div>
                <dt className="text-crimson font-bold uppercase mb-0.5">Finale Weekend</dt>
                <dd className="text-bone border-b border-dotted border-bone/40 pb-1">TBA</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Format;
