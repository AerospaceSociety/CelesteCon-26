import React from 'react';
import { Link } from 'react-router-dom';
import HeroSignature from '../components/HeroSignature';
import { events } from '../data/events';

const Home = () => {
  return (
    <div className="relative">

      {/* Hero Section / Masthead */}
      <section className="mt-2 sm:mt-4 md:mt-8 mb-8 sm:mb-12">
        <h1 className="font-display text-[clamp(38px,10vw,120px)] leading-[0.88] tracking-[-0.01em] uppercase text-bone text-balance mb-3 sm:mb-4">
          Celestecon
        </h1>

        <div className="flex flex-col sm:flex-row items-start sm:items-stretch gap-4 sm:gap-[clamp(10px,2vw,22px)]">
          <div className="flex items-center gap-3 sm:gap-0 sm:flex-col justify-start shrink-0">
            <div className="font-display text-[clamp(44px,9vw,108px)] leading-[0.9] text-crimson">
              2026
            </div>
            <div className="sm:hidden border-l-2 border-bone pl-2.5 py-0.5">
              <span className="font-jp font-black text-xs leading-tight text-bone block">
                第六回航空宇宙大会
              </span>
              <span className="font-mono text-[9px] text-bone-dim tracking-wider uppercase block">
                AEROSS CONCLAVE
              </span>
            </div>
          </div>

          {/* Desktop Japanese Pillar */}
          <div className="hidden sm:flex border-x-2 border-bone px-2 py-1 items-center justify-center shrink-0">
            <span className="font-jp font-black text-xs md:text-sm leading-relaxed w-[1.15em] break-all text-center text-bone">
              第六回航空宇宙大会
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-between min-w-0 gap-3">
            <div className="flex justify-between gap-2 flex-wrap text-bone">
              <span className="font-label font-semibold text-[clamp(11px,1.5vw,15px)] tracking-[0.12em] uppercase">Mankind was born on Earth.</span>
              <span className="font-jp font-bold text-[clamp(9px,1.2vw,12px)] tracking-[0.14em]">宇宙は待っている。</span>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-2">
              <span className="border-2 border-bone px-2 py-0.5 font-label font-semibold text-[clamp(11px,1.5vw,15px)] tracking-[0.12em] uppercase text-bone self-start">
                It was never meant to die here.
              </span>
              <span className="font-label font-semibold text-[clamp(11px,1.5vw,15px)] tracking-[0.12em] uppercase text-crimson self-start sm:self-center">
                Beyond school. Beyond sky.
              </span>
            </div>

            <p className="font-label font-medium text-[clamp(11px,1.25vw,13px)] tracking-[0.06em] leading-relaxed max-w-[64ch] text-bone-dim">
              The sixth-edition flagship aerospace & STEM conclave of <strong className="text-bone">AEROSS</strong> — the Aerospace Society of Delhi Public School, R.K. Puram — returns to campus at full scale. This sheet is the official field guide.
            </p>

            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 items-stretch sm:items-center mt-auto pt-2">
              <a
                href="/CelesteCon_2026_Brochure.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[9px] sm:text-[10px] tracking-[0.14em] uppercase border-2 border-bone bg-bone text-ink px-2 sm:px-2.5 py-1 font-bold text-center sm:text-left whitespace-nowrap hover:bg-crimson hover:text-white transition-colors"
              >
                Brochure (PDF) ↗
              </a>
              <Link
                to="/format"
                className="font-mono text-[9px] sm:text-[10px] tracking-[0.14em] uppercase border-2 border-bone text-bone px-2 sm:px-2.5 py-1 font-bold text-center sm:text-left whitespace-nowrap hover:bg-bone hover:text-ink transition-colors cursor-pointer"
              >
                R1 Online // 11 Oct
              </Link>
              <Link
                to="/format"
                className="font-mono text-[9px] sm:text-[10px] tracking-[0.14em] uppercase border-2 border-bone text-bone px-2 sm:px-2.5 py-1 font-bold text-center sm:text-left whitespace-nowrap hover:bg-bone hover:text-ink transition-colors cursor-pointer"
              >
                R2 Finale // 24 Oct
              </Link>
              <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.14em] uppercase border-2 border-crimson bg-crimson text-bone-hi px-2 sm:px-2.5 py-1 font-bold text-center sm:text-left whitespace-nowrap">
                Est. 2009 // AEROSS
              </span>
            </div>
          </div>
        </div>
      </section>

      <HeroSignature />

      <div className="flex justify-between gap-2 items-baseline font-mono text-[8px] sm:text-[9.5px] tracking-[0.12em] sm:tracking-[0.14em] uppercase mt-3 mb-6 sm:mb-10 text-bone-dim flex-wrap">
        <span>OBJECT: EVENT HORIZON</span>
        <span>PLATE PRINTED IN BONE / INK / SOLAR CRIMSON</span>
        <span>SCALE: NOT TO SCALE</span>
      </div>

      <div className="flex justify-between items-end h-[9px] border-b-2 border-bone opacity-50 mb-8 sm:mb-12 overflow-hidden" aria-hidden="true">
        {Array.from({ length: 32 }).map((_, i) => (
          <i key={i} className={`w-[1.5px] bg-bone ${i % 5 === 0 ? 'h-[9px]' : 'h-[5px]'}`}></i>
        ))}
      </div>

      {/* Data Band */}
      <section className="grid grid-cols-1 md:grid-cols-[minmax(240px,300px)_1fr] gap-[clamp(14px,2.4vw,26px)] mb-12 sm:mb-16">
        <div className="border-2 border-bone">
          <div className="bg-bone text-ink font-mono text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 flex justify-between font-bold">
            <span>Event Data</span>
            <span className="font-jp text-ink-3">大会データ</span>
          </div>
          <dl className="p-3 grid grid-cols-[72px_1fr] sm:grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 font-mono text-[10px] sm:text-[10.5px] tracking-[0.03em]">
            <dt className="text-crimson font-bold uppercase whitespace-nowrap">Event</dt>
            <dd className="text-bone border-b border-dotted border-bone/40 pb-0.5">CelesteCon 2026 — 6th Edition</dd>
            <dt className="text-crimson font-bold uppercase whitespace-nowrap">Host</dt>
            <dd className="text-bone border-b border-dotted border-bone/40 pb-0.5">AEROSS, DPS R.K. Puram</dd>
            <dt className="text-crimson font-bold uppercase whitespace-nowrap">Venue</dt>
            <dd className="text-bone border-b border-dotted border-bone/40 pb-0.5">Sector 12, R.K. Puram, New Delhi</dd>
            <dt className="text-crimson font-bold uppercase whitespace-nowrap">Dates</dt>
            <dd className="text-bone border-b border-dotted border-bone/40 pb-0.5 font-bold text-crimson">Event Date: 24 Oct · Reg: 10 Oct</dd>
            <dt className="text-crimson font-bold uppercase whitespace-nowrap">Format</dt>
            <dd className="text-bone border-b border-dotted border-bone/40 pb-0.5">R1 online → R2 campus finale</dd>
            <dt className="text-crimson font-bold uppercase whitespace-nowrap">Comps</dt>
            <dd className="text-bone border-b border-dotted border-bone/40 pb-0.5">8 events · junior & senior tracks</dd>
            <dt className="text-crimson font-bold uppercase whitespace-nowrap">Cohort</dt>
            <dd className="text-bone border-b border-dotted border-bone/40 pb-0.5">Grades 6–12, schools & independents</dd>
            <dt className="text-crimson font-bold uppercase whitespace-nowrap">Faculty</dt>
            <dd className="text-bone border-b border-dotted border-bone/40 pb-0.5">Ms. Vibha Arora · Mr. Sanchit Chauhan</dd>
            <dt className="text-crimson font-bold uppercase whitespace-nowrap">Society</dt>
            <dd className="text-bone border-b border-dotted border-bone/40 pb-0.5">Est. 2009 · 100+ global alumni</dd>
          </dl>
        </div>

        <div>
          <h3 className="font-label font-bold text-[clamp(15px,2.1vw,21px)] tracking-[0.05em] uppercase text-balance">
            A national stage where India's sharpest school engineers <span className="text-crimson">design, build & defend</span>.
          </h3>
          <p className="font-label text-[clamp(11.5px,1.45vw,14px)] leading-relaxed text-bone-dim mt-3 max-w-[64ch]">
            CelesteCon gathers the country's strongest student aerospace talent to engineer space settlements, fly UAV concepts, model in CAD, pitch ventures and battle through debates and buzzer finals.
          </p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 font-mono text-[10px] tracking-[0.1em] uppercase">
            <span className="border-l-[3px] border-crimson pl-2 leading-relaxed font-bold">Direct pipeline to ranked STEM talent</span>
            <span className="border-l-[3px] border-crimson pl-2 leading-relaxed font-bold">Stage, arena & trophy branding</span>
            <span className="border-l-[3px] border-crimson pl-2 leading-relaxed font-bold">Kit & software integration in play</span>
            <span className="border-l-[3px] border-crimson pl-2 leading-relaxed font-bold">CSR-ready school-outreach property</span>
          </div>

          <div className="mt-4 border-[1.5px] border-dashed border-bone p-3 font-mono text-[9px] sm:text-[9.5px] tracking-[0.1em] sm:tracking-[0.12em] uppercase text-bone-dim leading-relaxed">
            Delegations formally received & commended by the <b className="text-bone">Hon'ble Prime Minister</b>, <b className="text-bone">Vice-President</b> & <b className="text-bone">External Affairs Minister</b> of India · ISDC interactions with <b className="text-bone">Dr. A.P.J. Abdul Kalam</b> & NASA astronaut <b className="text-bone">Christopher Ferguson</b>
          </div>
        </div>
      </section>

      {/* Stat Matrix */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-0 border-2 border-bone mb-3" aria-label="Key Statistics">
        <div className="bg-bone text-ink p-3 sm:p-[clamp(12px,1.8vw,20px)] relative border-r-2 border-b-2 md:border-b-0 border-ink min-w-0">
          <span className="absolute top-1.5 right-2 font-mono text-[8px] sm:text-[8.5px] text-ink-3 tracking-[0.15em] font-bold">A/01</span>
          <div className="font-display text-3xl sm:text-4xl md:text-5xl leading-[0.95] tracking-wide text-ink">28<em className="not-italic text-crimson">+</em></div>
          <div className="font-label font-bold text-[10px] sm:text-[11px] tracking-[0.14em] uppercase mt-2 leading-tight">NASA Ames / NSS Awards</div>
          <div className="font-jp font-black text-[8.5px] sm:text-[9px] tracking-[0.16em] text-ink-3 mt-1 truncate">受賞歴・二〇一〇年以降</div>
        </div>
        <div className="bg-bone text-ink p-3 sm:p-[clamp(12px,1.8vw,20px)] relative border-b-2 md:border-b-0 md:border-r-2 border-ink min-w-0">
          <span className="absolute top-1.5 right-2 font-mono text-[8px] sm:text-[8.5px] text-ink-3 tracking-[0.15em] font-bold">A/02</span>
          <div className="font-display text-3xl sm:text-4xl md:text-5xl leading-[0.95] tracking-wide text-ink">6<em className="not-italic text-crimson">×</em></div>
          <div className="font-label font-bold text-[10px] sm:text-[11px] tracking-[0.14em] uppercase mt-2 leading-tight">RWDC Champions</div>
          <div className="font-jp font-black text-[8.5px] sm:text-[9px] tracking-[0.16em] text-ink-3 mt-1 truncate">世界設計選手権</div>
        </div>
        <div className="bg-bone text-ink p-3 sm:p-[clamp(12px,1.8vw,20px)] relative border-r-2 border-ink min-w-0">
          <span className="absolute top-1.5 right-2 font-mono text-[8px] sm:text-[8.5px] text-ink-3 tracking-[0.15em] font-bold">A/03</span>
          <div className="font-display text-3xl sm:text-4xl md:text-5xl leading-[0.95] tracking-wide text-ink">1,500<em className="not-italic text-crimson">+</em></div>
          <div className="font-label font-bold text-[10px] sm:text-[11px] tracking-[0.14em] uppercase mt-2 leading-tight">Student Participants</div>
          <div className="font-jp font-black text-[8.5px] sm:text-[9px] tracking-[0.16em] text-ink-3 mt-1 truncate">参加者・全国から</div>
        </div>
        <div className="bg-bone text-ink p-3 sm:p-[clamp(12px,1.8vw,20px)] relative min-w-0">
          <span className="absolute top-1.5 right-2 font-mono text-[8px] sm:text-[8.5px] text-ink-3 tracking-[0.15em] font-bold">A/04</span>
          <div className="font-display text-3xl sm:text-4xl md:text-5xl leading-[0.95] tracking-wide text-ink">180<em className="not-italic text-crimson">+</em></div>
          <div className="font-label font-bold text-[10px] sm:text-[11px] tracking-[0.14em] uppercase mt-2 leading-tight">Schools Represented</div>
          <div className="font-jp font-black text-[8.5px] sm:text-[9px] tracking-[0.16em] text-ink-3 mt-1 truncate">参加校・インド全土</div>
        </div>
      </section>

      <div className="grid grid-cols-2 sm:flex sm:justify-between gap-2 font-mono text-[8.5px] sm:text-[9px] tracking-[0.1em] sm:tracking-[0.13em] uppercase text-bone-dim mb-12 sm:mb-16 font-bold">
        <span>+ 25× settlement titles</span>
        <span>+ 12× Conrad Challenge</span>
        <span>+ IRIS grand · ISEF 2nd</span>
        <span>+ $50K ERAU scholarship</span>
      </div>

      {/* Competitions Teaser */}
      <section className="mb-16 sm:mb-24">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 pb-2 border-b-4 border-bone mt-6 mb-4">
          <div className="flex items-baseline gap-3">
            <h2 className="font-display text-2xl sm:text-3xl text-bone uppercase tracking-wide leading-none">The Competitions</h2>
            <span className="font-jp font-bold text-xs sm:text-sm tracking-[0.25em] text-crimson">全八種目</span>
          </div>
          <span className="font-mono text-[9px] sm:text-[9.5px] tracking-[0.14em] uppercase text-bone-dim font-bold">SEC. 03 // FIELD ROSTER (8 EVENTS)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[clamp(18px,3vw,34px)] gap-y-0">
          {events.map((event, i) => (
            <Link
              key={event.id}
              to="/comps"
              className="flex flex-col py-3 border-b-[1.5px] border-bone/40 hover:border-crimson group transition-colors"
            >
              <div className="flex items-baseline justify-between gap-2">
                <div className="flex items-baseline gap-2.5 min-w-0">
                  <span className="font-mono text-xs text-crimson tracking-[0.05em] font-bold group-hover:text-bone transition-colors shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-label font-bold text-sm sm:text-base tracking-[0.06em] uppercase text-bone group-hover:text-crimson transition-colors truncate">
                    {event.name}
                  </span>
                </div>
                <span className={`font-mono text-[8.5px] tracking-[0.12em] px-1.5 py-0.5 uppercase whitespace-nowrap font-bold border shrink-0 ${event.mode === 'Onsite' ? 'bg-bone text-ink border-bone' : 'bg-ink text-bone border-bone'}`}>
                  {event.mode}
                </span>
              </div>
              <p className="font-label font-medium text-xs text-bone-dim tracking-[0.02em] opacity-80 mt-1 pl-6 line-clamp-1">
                {event.hook || event.overview}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-6 flex justify-center sm:justify-end">
          <Link
            to="/comps"
            className="inline-flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-wider text-crimson font-bold border-b border-crimson hover:text-bone hover:border-bone transition-colors py-1 text-center"
          >
            <span>Explore Full Guidelines & Round Structures for All 8 Events</span>
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* Value Band / CTA */}
      <section className="bg-bone text-ink -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8 sm:py-10 mt-6 sm:mt-10 mb-8 sm:mb-12 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between gap-2.5 font-mono text-[9px] sm:text-[9.5px] tracking-[0.18em] uppercase text-ink-3 font-bold flex-wrap">
            <span>◆ ACTION REQUIRED</span>
            <span>SEC. 00 // REGISTRATION</span>
          </div>
          <h2 className="font-display uppercase text-2xl sm:text-4xl md:text-5xl leading-[1.02] tracking-[0.01em] mt-3 text-ink text-balance">
            The grid is open. <span className="text-crimson [-webkit-text-stroke:0]">Assemble your team.</span>
          </h2>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-start items-stretch sm:items-center flex-wrap">
            <a
              href="/celestecon_registration.html"
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-crimson text-bone-hi font-label font-bold text-base md:text-lg uppercase tracking-widest border border-crimson hover:bg-ink hover:text-crimson transition-colors text-center"
            >
              School Contingent &rarr;
            </a>
            <a
              href="/celestecon_individual_registration.html"
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-ink text-bone font-label font-bold text-base md:text-lg uppercase tracking-widest border border-ink hover:bg-crimson hover:text-bone hover:border-crimson transition-colors text-center"
            >
              Individual Entry &rarr;
            </a>
            <a
              href="/CelesteCon_2026_Brochure.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-transparent text-ink font-label font-bold text-base md:text-lg uppercase tracking-widest border-2 border-ink hover:bg-ink hover:text-bone transition-colors text-center"
            >
              Brochure (PDF) ↗
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
