import React from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';

const Glimpses = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 py-4">
      <SectionHeader section="05" title="Conclave Glimpses" jp="大会視覚記録" />

      {/* Main Announcement Box */}
      <div className="border-2 border-crimson bg-crimson/10 p-6 sm:p-10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-6 select-none pointer-events-none opacity-10">
          <span className="font-display text-9xl text-crimson font-black">2026</span>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-crimson text-bone-hi font-mono text-[10px] font-bold uppercase tracking-widest">
              MEDIA CELL // STATUS
            </span>
            <span className="font-mono text-xs text-crimson font-bold uppercase tracking-wider">
              ● Updating Soon
            </span>
          </div>

          <div>
            <h2 className="font-display text-3xl sm:text-5xl text-bone uppercase tracking-wide leading-tight">
              Glimpses of CelesteCon 2026 will be updated soon.
            </h2>
            <p className="font-label text-base sm:text-lg text-bone-dim mt-4 leading-relaxed max-w-2xl">
              Photographs, aerial footage from the Open Arena, stage presentations, and the valedictory award distribution ceremony are currently being curated by the AEROSS Media Cell and will be published here.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link
              to="/results"
              className="px-6 py-3 bg-crimson text-bone-hi hover:bg-ink hover:text-crimson border-2 border-crimson font-label text-sm font-bold uppercase tracking-wider transition-colors text-center"
            >
              View 2026 Results &rarr;
            </Link>
            <Link
              to="/comps"
              className="px-6 py-3 bg-bone text-ink hover:bg-crimson hover:text-bone-hi border-2 border-bone hover:border-crimson font-label text-sm font-bold uppercase tracking-wider transition-colors text-center"
            >
              Explore The Comps &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Submissions / Contact Note */}
      <div className="border-2 border-bone p-6 sm:p-8 bg-bone/[0.03] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="font-mono text-[10px] text-crimson font-bold uppercase tracking-widest block mb-1">
            ANNALS // ARCHIVE INGESTION
          </span>
          <h4 className="font-display text-xl sm:text-2xl text-bone uppercase">
            Delegation Media Inquiries
          </h4>
          <p className="font-label text-xs sm:text-sm text-bone-dim max-w-xl mt-1">
            For questions regarding event captures, certificate issuance, or official press dispatches, contact the AEROSS Secretariat.
          </p>
        </div>
        <a
          href="mailto:aeross@dpsrkp.net?subject=CelesteCon%202026%20Media%20Inquiry"
          className="px-5 py-2.5 bg-bone text-ink hover:bg-crimson hover:text-bone-hi font-label font-bold text-xs uppercase tracking-widest transition-colors whitespace-nowrap text-center self-stretch sm:self-auto"
        >
          Contact Secretariat ↗
        </a>
      </div>
    </div>
  );
};

export default Glimpses;
