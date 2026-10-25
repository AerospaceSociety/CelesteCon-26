import React from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';

const Glimpses = () => {
  const glimpsePlaceholders = [
    {
      id: '01',
      tag: 'ARCHIVE // REEL 01',
      title: 'Open Arena Flight Trials',
      category: 'UAV Aeromodelling & Open Arena',
      aspect: 'aspect-[16/10]',
      span: 'col-span-1 md:col-span-2'
    },
    {
      id: '02',
      tag: 'ARCHIVE // REEL 02',
      title: 'On-Stage Defense & Technical Jury',
      category: 'Settlement CAD & Venture Pitches',
      aspect: 'aspect-[4/3]',
      span: 'col-span-1'
    },
    {
      id: '03',
      tag: 'ARCHIVE // REEL 03',
      title: 'Quizzitch & Parliamentary Debate',
      category: 'In Pursuit of Dispute',
      aspect: 'aspect-[4/3]',
      span: 'col-span-1'
    },
    {
      id: '04',
      tag: 'ARCHIVE // REEL 04',
      title: 'CelesteJam Lab Workstations',
      category: 'Game Build Sprinters',
      aspect: 'aspect-[16/9]',
      span: 'col-span-1 md:col-span-2'
    },
    {
      id: '05',
      tag: 'ARCHIVE // REEL 05',
      title: 'Rocketry Simulators & Trajectory Tracing',
      category: 'Model Rocketry Division',
      aspect: 'aspect-[16/9]',
      span: 'col-span-1 md:col-span-2'
    },
    {
      id: '06',
      tag: 'ARCHIVE // REEL 06',
      title: 'AEROSS Prix Wind Tunnel & Sprints',
      category: 'Aerodynamic RC Engineering',
      aspect: 'aspect-[4/3]',
      span: 'col-span-1'
    },
    {
      id: '07',
      tag: 'ARCHIVE // REEL 07',
      title: 'Valedictory Award Ceremony',
      category: 'Podium Presentations & Rolling Trophy',
      aspect: 'aspect-[4/3]',
      span: 'col-span-1'
    },
    {
      id: '08',
      tag: 'ARCHIVE // REEL 08',
      title: 'Delegation Assemblies & Campus Atmosphere',
      category: '180+ Schools · DPS R.K. Puram Campus',
      aspect: 'aspect-[21/9]',
      span: 'col-span-1 md:col-span-2 lg:col-span-4'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <SectionHeader section="05" title="Conclave Glimpses" jp="大会視覚記録" />

      {/* Main Announcement Box */}
      <div className="border-2 border-crimson bg-crimson/10 p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-6 select-none pointer-events-none opacity-10">
          <span className="font-display text-9xl text-crimson font-black">2026</span>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-crimson text-bone-hi font-mono text-[10px] font-bold uppercase tracking-widest">
                MEDIA ARCHIVE // STATUS
              </span>
              <span className="font-mono text-xs text-crimson font-bold uppercase tracking-wider">
                ● Ingesting Master Film Rolls
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-4xl text-bone uppercase tracking-wide">
              Glimpses of CelesteCon 2026 will be updated soon.
            </h2>

            <p className="font-label text-sm sm:text-base text-bone-dim leading-relaxed">
              Our media cell is currently sorting and curating the official high-resolution photographs, flight drone footage from the central Open Arena, jury defense sessions, and the grand valedictory ceremony. Check back soon for the complete gallery drop.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 w-full md:w-auto">
            <Link
              to="/results"
              className="px-5 py-2.5 bg-crimson text-bone-hi hover:bg-ink hover:text-crimson border-2 border-crimson font-label text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors text-center"
            >
              View 2026 Results &rarr;
            </Link>
            <Link
              to="/comps"
              className="px-5 py-2.5 bg-bone text-ink hover:bg-crimson hover:text-bone-hi border-2 border-bone hover:border-crimson font-label text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors text-center"
            >
              Explore The Comps &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Camera Roll Reel Cards Grid */}
      <section className="space-y-4">
        <div className="flex justify-between items-baseline border-b-2 border-bone pb-2 font-mono text-xs text-bone-dim uppercase tracking-widest">
          <span className="text-crimson font-bold">Plate Catalogue // Visual Ingestion</span>
          <span>Camera Rolls 01–08 [Standby]</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {glimpsePlaceholders.map((item) => (
            <div
              key={item.id}
              className={`${item.span} relative group border-2 border-bone/30 bg-bone/[0.03] hover:border-crimson transition-all duration-300 flex flex-col justify-between overflow-hidden ${item.aspect}`}
            >
              {/* Technical Reticles */}
              <span className="absolute top-2 left-2 font-mono text-[10px] text-bone-dim/40 select-none z-10">+</span>
              <span className="absolute top-2 right-2 font-mono text-[10px] text-bone-dim/40 select-none z-10">+</span>
              <span className="absolute bottom-2 left-2 font-mono text-[10px] text-bone-dim/40 select-none z-10">+</span>
              <span className="absolute bottom-2 right-2 font-mono text-[10px] text-bone-dim/40 select-none z-10">+</span>

              {/* Film / Aperture Graphic Skeleton Placeholder */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-ink via-ink-2/60 to-ink">
                <div className="w-12 h-12 rounded-full border border-bone/20 flex items-center justify-center mb-3 group-hover:border-crimson group-hover:scale-110 transition-all duration-300">
                  <svg
                    className="w-5 h-5 text-bone-dim group-hover:text-crimson transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-crimson font-bold">
                  MEDIA SKELETON // STANDBY
                </span>
                <span className="font-mono text-xs text-bone-dim mt-1 font-bold">
                  Updating Soon
                </span>
              </div>

              {/* Bottom Caption Overlay */}
              <div className="relative z-10 mt-auto p-3.5 bg-ink/90 border-t border-bone/20 backdrop-blur-sm">
                <div className="flex justify-between items-baseline gap-2">
                  <span className="font-mono text-[9px] text-crimson font-bold tracking-widest">
                    {item.tag}
                  </span>
                  <span className="font-mono text-[9px] text-bone-dim tracking-wider uppercase">
                    IMG_{item.id}
                  </span>
                </div>
                <h3 className="font-label font-bold text-xs sm:text-sm text-bone uppercase tracking-wider mt-0.5 truncate">
                  {item.title}
                </h3>
                <p className="font-mono text-[10px] text-bone-dim truncate mt-0.5">
                  {item.category}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Return to Conclave Teaser */}
      <div className="border-2 border-bone p-6 sm:p-8 bg-bone/[0.03] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="font-mono text-[10px] text-crimson font-bold uppercase tracking-widest block mb-1">
            ANNALS // DPS R.K. PURAM
          </span>
          <h4 className="font-display text-xl sm:text-2xl text-bone uppercase">
            Captured a memorable frame during the conclave?
          </h4>
          <p className="font-label text-xs sm:text-sm text-bone-dim max-w-xl mt-1">
            Student delegations and photographers can submit high-res captures directly to the AEROSS Secretariat for inclusion in the official aftermovie and yearbook.
          </p>
        </div>
        <a
          href="mailto:aeross@dpsrkp.net?subject=CelesteCon%202026%20Photo%20Submission"
          className="px-5 py-2.5 bg-bone text-ink hover:bg-crimson hover:text-bone-hi font-label font-bold text-xs uppercase tracking-widest transition-colors whitespace-nowrap text-center self-stretch sm:self-auto"
        >
          Submit Media ↗
        </a>
      </div>
    </div>
  );
};

export default Glimpses;
