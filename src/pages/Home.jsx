import React from 'react';
import { Link } from 'react-router-dom';
import HeroSignature from '../components/HeroSignature';
import { events } from '../data/events';

const Home = () => {
  return (
    <div className="relative">
      
      {/* Hero Section / Masthead */}
      <section className="mt-2 sm:mt-4 md:mt-8 mb-6 sm:mb-12">
        <h1 className="font-display text-[clamp(42px,10vw,120px)] leading-[0.88] tracking-[-0.01em] uppercase text-bone text-balance mb-4">
          Celestecon
        </h1>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-stretch gap-4 sm:gap-[clamp(10px,2vw,22px)]">
          {/* Year & Japanese Badge / Strip */}
          <div className="flex items-center sm:items-stretch gap-3 sm:gap-4 shrink-0">
            <div className="font-display text-5xl sm:text-[clamp(44px,9vw,108px)] leading-none sm:leading-[0.9] text-crimson">
              2026
            </div>
            
            <div className="border-x-2 border-bone px-2.5 sm:px-2 py-1 flex items-center justify-center shrink-0 self-stretch">
              <span className="font-jp font-bold sm:font-black text-xs sm:text-sm tracking-widest sm:tracking-normal sm:leading-relaxed sm:w-[1.15em] sm:break-all text-center text-bone">
                第六回航空宇宙大会
              </span>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-between min-w-0 gap-3 w-full">
            <div className="flex justify-between items-baseline gap-2 flex-wrap text-bone">
              <span className="font-label font-semibold text-[clamp(11px,1.5vw,15px)] tracking-[0.12em] uppercase">Mankind was born on Earth.</span>
              <span className="font-jp font-bold text-[clamp(9px,1.2vw,12px)] tracking-[0.14em]">宇宙は待っている。</span>
            </div>
            
            <div className="flex justify-between items-center gap-2 flex-wrap">
              <span className="border-2 border-bone px-2 py-0.5 font-label font-semibold text-[clamp(11px,1.5vw,15px)] tracking-[0.12em] uppercase text-bone">
                It was never meant to die here.
              </span>
              <span className="font-label font-semibold text-[clamp(11px,1.5vw,15px)] tracking-[0.12em] uppercase text-crimson">
                Beyond school. Beyond sky.
              </span>
            </div>
            
            <p className="font-label font-medium text-[clamp(10px,1.25vw,13px)] tracking-[0.06em] leading-relaxed max-w-[64ch] text-bone-dim">
              The sixth-edition flagship aerospace & STEM conclave of <strong className="text-bone">AEROSS</strong> — the Aerospace Society of Delhi Public School, R.K. Puram — returns to campus at full scale. This sheet is the official field guide.
            </p>
            
            <div className="flex gap-2 flex-wrap items-center mt-auto pt-2">
              <span className="font-mono text-[clamp(8px,1vw,10px)] tracking-[0.16em] uppercase border-2 border-bone bg-bone text-ink px-2.5 py-1 font-bold whitespace-nowrap">
                Official Dossier
              </span>
              <span className="font-mono text-[clamp(8px,1vw,10px)] tracking-[0.16em] uppercase border-2 border-bone text-bone px-2.5 py-1 font-bold whitespace-nowrap hover:bg-bone hover:text-ink transition-colors cursor-pointer">
                Round 1 — Online
              </span>
              <span className="font-mono text-[clamp(8px,1vw,10px)] tracking-[0.16em] uppercase border-2 border-bone text-bone px-2.5 py-1 font-bold whitespace-nowrap hover:bg-bone hover:text-ink transition-colors cursor-pointer">
                Round 2 — Campus
              </span>
              <span className="font-mono text-[clamp(8px,1vw,10px)] tracking-[0.16em] uppercase border-2 border-crimson bg-crimson text-bone-hi px-2.5 py-1 font-bold whitespace-nowrap">
                Est. 2009 // AEROSS
              </span>
            </div>
          </div>
        </div>
      </section>

      <HeroSignature />

      <div className="flex justify-between gap-2.5 items-baseline font-mono text-[clamp(8px,1vw,9.5px)] tracking-[0.14em] uppercase mt-2 sm:mt-3 mb-6 sm:mb-10 text-bone-dim flex-wrap">
        <span>OBJECT: EVENT HORIZON — THE POINT OF NO RETURN</span>
        <span>PLATE PRINTED IN BONE / INK / SOLAR CRIMSON</span>
        <span>SCALE: NOT TO SCALE</span>
      </div>

      <div className="flex justify-between items-end h-[9px] border-b-2 border-bone opacity-50 mb-6 sm:mb-12" aria-hidden="true">
        {Array.from({ length: 40 }).map((_, i) => (
          <i key={i} className={`w-[1.5px] bg-bone ${i % 5 === 0 ? 'h-[9px]' : 'h-[5px]'}`}></i>
        ))}
      </div>

      {/* Data Band */}
      <section className="grid grid-cols-1 md:grid-cols-[minmax(240px,300px)_1fr] gap-[clamp(14px,2.4vw,26px)] mb-8 sm:mb-16">
        <div className="border-2 border-bone">
          <div className="bg-bone text-ink font-mono text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 flex justify-between font-bold">
            <span>Event Data</span>
            <span className="font-jp text-ink-3">大会データ</span>
          </div>
          <dl className="p-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 font-mono text-[10.5px] tracking-[0.03em]">
            <dt className="text-crimson font-bold uppercase whitespace-nowrap">Event</dt>
            <dd className="text-bone border-b border-dotted border-bone/40 pb-0.5">CelesteCon 2026 — 6th Edition</dd>
            <dt className="text-crimson font-bold uppercase whitespace-nowrap">Host</dt>
            <dd className="text-bone border-b border-dotted border-bone/40 pb-0.5">AEROSS · Aerospace Society, DPS R.K. Puram</dd>
            <dt className="text-crimson font-bold uppercase whitespace-nowrap">Format</dt>
            <dd className="text-bone border-b border-dotted border-bone/40 pb-0.5">R1 online qualifiers → R2 campus finale</dd>
            <dt className="text-crimson font-bold uppercase whitespace-nowrap">Comps</dt>
            <dd className="text-bone border-b border-dotted border-bone/40 pb-0.5">11 events · junior & senior tracks</dd>
            <dt className="text-crimson font-bold uppercase whitespace-nowrap">Cohort</dt>
            <dd className="text-bone border-b border-dotted border-bone/40 pb-0.5">Grades 6–12, nationwide</dd>
            <dt className="text-crimson font-bold uppercase whitespace-nowrap">Faculty</dt>
            <dd className="text-bone border-b border-dotted border-bone/40 pb-0.5">Ms. Vibha Arora · Mr. Sanchit Chauhan</dd>
            <dt className="text-crimson font-bold uppercase whitespace-nowrap">Society</dt>
            <dd className="text-bone border-b border-dotted border-bone/40 pb-0.5">Est. 2009 · 30+ core · 100+ global alumni</dd>
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
          
          <div className="mt-4 border-[1.5px] border-dashed border-bone p-3 font-mono text-[9.5px] tracking-[0.12em] uppercase text-bone-dim leading-relaxed">
            Delegations formally received & commended by the <b className="text-bone">Hon'ble Prime Minister</b>, <b className="text-bone">Vice-President</b> & <b className="text-bone">External Affairs Minister</b> of India · ISDC interactions with <b className="text-bone">Dr. A.P.J. Abdul Kalam</b> & NASA astronaut <b className="text-bone">Christopher Ferguson</b>
          </div>
        </div>
      </section>

      {/* Stat Matrix */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-0 border-2 border-bone mb-3" aria-label="Key Statistics">
        <div className="bg-bone text-ink p-[clamp(12px,1.8vw,20px)] relative border-r-2 border-b-2 md:border-b-0 border-ink min-w-0">
          <span className="absolute top-2 right-2.5 font-mono text-[8.5px] text-ink-3 tracking-[0.15em] font-bold">A/01</span>
          <div className="font-display text-[clamp(30px,5.2vw,58px)] leading-[0.95] tracking-wide text-ink">28<em className="not-italic text-crimson">+</em></div>
          <div className="font-label font-bold text-[clamp(9px,1.15vw,12px)] tracking-[0.16em] uppercase mt-2">NASA Ames / NSS Awards</div>
          <div className="font-jp font-black text-[9px] tracking-[0.2em] text-ink-3 mt-1">受賞歴・二〇一〇年以降</div>
        </div>
        <div className="bg-bone text-ink p-[clamp(12px,1.8vw,20px)] relative border-r-0 md:border-r-2 border-b-2 md:border-b-0 border-ink min-w-0">
          <span className="absolute top-2 right-2.5 font-mono text-[8.5px] text-ink-3 tracking-[0.15em] font-bold">A/02</span>
          <div className="font-display text-[clamp(30px,5.2vw,58px)] leading-[0.95] tracking-wide text-ink">6<em className="not-italic text-crimson">×</em></div>
          <div className="font-label font-bold text-[clamp(9px,1.15vw,12px)] tracking-[0.16em] uppercase mt-2">RWDC Champions</div>
          <div className="font-jp font-black text-[9px] tracking-[0.2em] text-ink-3 mt-1">世界設計選手権</div>
        </div>
        <div className="bg-bone text-ink p-[clamp(12px,1.8vw,20px)] relative border-r-2 border-ink min-w-0">
          <span className="absolute top-2 right-2.5 font-mono text-[8.5px] text-ink-3 tracking-[0.15em] font-bold">A/03</span>
          <div className="font-display text-[clamp(30px,5.2vw,58px)] leading-[0.95] tracking-wide text-ink">1,500<em className="not-italic text-crimson">+</em></div>
          <div className="font-label font-bold text-[clamp(9px,1.15vw,12px)] tracking-[0.16em] uppercase mt-2">Student Participants</div>
          <div className="font-jp font-black text-[9px] tracking-[0.2em] text-ink-3 mt-1">参加者・全国から</div>
        </div>
        <div className="bg-bone text-ink p-[clamp(12px,1.8vw,20px)] relative min-w-0">
          <span className="absolute top-2 right-2.5 font-mono text-[8.5px] text-ink-3 tracking-[0.15em] font-bold">A/04</span>
          <div className="font-display text-[clamp(30px,5.2vw,58px)] leading-[0.95] tracking-wide text-ink">180<em className="not-italic text-crimson">+</em></div>
          <div className="font-label font-bold text-[clamp(9px,1.15vw,12px)] tracking-[0.16em] uppercase mt-2">Schools Represented</div>
          <div className="font-jp font-black text-[9px] tracking-[0.2em] text-ink-3 mt-1">参加校・インド全土</div>
        </div>
      </section>
      
      <div className="flex justify-between gap-2.5 flex-wrap font-mono text-[9px] tracking-[0.13em] uppercase text-bone-dim mb-16 font-bold">
        <span>+ 25× space settlement design titles</span>
        <span>+ 12× Conrad Challenge wins</span>
        <span>+ IRIS grand prize · ISEF 2nd</span>
        <span>+ $50K ERAU scholarship</span>
      </div>

      {/* Competitions Teaser */}
      <section className="mb-24">
        <div className="flex items-baseline gap-3 mt-8 mb-2 pb-1.5 border-b-4 border-bone flex-wrap">
          <h2 className="font-display text-[clamp(20px,3.4vw,34px)] text-bone uppercase tracking-wide leading-none">The Competitions</h2>
          <span className="font-jp font-bold text-[clamp(10px,1.3vw,13px)] tracking-[0.25em] text-crimson">全十一種目</span>
          <span className="flex-1 min-w-[20px]"></span>
          <span className="font-mono text-[9.5px] tracking-[0.16em] uppercase text-bone-dim font-bold">SEC. 03 // FIELD ROSTER (11 EVENTS)</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[clamp(18px,3vw,34px)] gap-y-0">
          {events.map((event, i) => (
            <Link 
              key={event.id} 
              to="/comps" 
              className="grid grid-cols-[auto_1fr_auto] gap-x-3 gap-y-1 items-baseline py-2.5 border-b-[1.5px] border-bone/40 hover:border-crimson group transition-colors"
            >
              <span className="font-mono text-[11px] text-crimson tracking-[0.05em] font-bold group-hover:text-bone transition-colors">{String(i+1).padStart(2, '0')}</span>
              <span className="font-label font-bold text-[clamp(12px,1.5vw,14.5px)] tracking-[0.08em] uppercase text-bone group-hover:text-crimson transition-colors">{event.name}</span>
              <span className={`font-mono text-[8.5px] tracking-[0.12em] px-1.5 py-0.5 uppercase whitespace-nowrap font-bold border ${event.mode === 'Onsite' ? 'bg-bone text-ink border-bone' : 'bg-ink text-bone border-bone'}`}>
                {event.mode}
              </span>
              <span className="col-start-2 col-end-4 font-label font-medium text-[12px] text-bone-dim tracking-[0.02em] opacity-80 mt-1 line-clamp-1">
                {event.hook || event.overview}
              </span>
            </Link>
          ))}
        </div>
        
        <div className="mt-6 flex justify-end">
          <Link
            to="/comps"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-crimson font-bold border-b border-crimson hover:text-bone hover:border-bone transition-colors py-1"
          >
            <span>Explore Full Guidelines & Round Structures for All 11 Events</span>
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* Value Band / CTA */}
      <section className="bg-bone text-ink -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-[clamp(20px,3.2vw,36px)] mt-[clamp(20px,3vw,34px)] mb-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between gap-2.5 font-mono text-[9.5px] tracking-[0.2em] uppercase text-ink-3 font-bold flex-wrap">
            <span>◆ ACTION REQUIRED</span>
            <span>SEC. 00 // REGISTRATION</span>
          </div>
          <h2 className="font-display uppercase text-[clamp(26px,5vw,56px)] leading-[1.02] tracking-[0.01em] mt-3 text-ink text-balance">
            The grid is open. <span className="text-crimson [-webkit-text-stroke:0]">Assemble your team.</span>
          </h2>
          <div className="mt-8">
            <a 
              href="/celestecon_registration.html" 
              className="inline-block px-10 py-4 bg-crimson text-bone-hi font-label font-bold text-lg uppercase tracking-widest border border-crimson hover:bg-ink hover:text-crimson transition-colors"
            >
              Initialize Registration
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
