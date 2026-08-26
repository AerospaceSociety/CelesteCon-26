import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import { awards } from '../data/awards';

const About = () => {
  const [showFullAwards, setShowFullAwards] = useState(false);

  return (
    <div className="max-w-4xl">
      <SectionHeader section="01" title="About AEROSS" jp="アエロスについて" />
      
      <div className="grid grid-cols-1 md:grid-cols-[1fr_250px] gap-10 mt-8">
        <div>
          <h3 className="font-display text-[clamp(24px,4vw,40px)] text-bone uppercase leading-[1.1] mb-6">
            Mankind was born on Earth. <span className="text-crimson">It was never meant to die here.</span>
          </h3>
          
          <div className="space-y-6 font-label text-base md:text-lg text-bone-dim leading-relaxed tracking-wide">
            <p>
              The <strong className="text-bone font-bold">Aerospace Society (AEROSS)</strong> of Delhi Public School, R.K. Puram was founded in 2009 by a group of passionate students under the guidance of our physics faculty. 
            </p>
            <p>
              What started as an amateur rocketry club has evolved into a premier STEM organization. Over the past 15 years, AEROSS has consistently dominated international aerospace engineering and space settlement design competitions. 
            </p>
            <p className="border-l-4 border-crimson pl-4 text-bone font-medium italic">
              "Build rather than watch."
            </p>
            <p>
              Our members don't just study physics—they apply it to aerodynamic simulations, structural design, orbital mechanics, and resource management. We've brought home top honors from NASA, the National Space Society, the Conrad Challenge, and the International Science and Engineering Fair (ISEF).
            </p>
          </div>
        </div>

        {/* Fact Card */}
        <div>
          <div className="border-2 border-bone">
            <div className="bg-bone text-ink font-mono text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 flex justify-between font-bold">
              <span>Quick Facts</span>
            </div>
            <dl className="p-3 grid grid-cols-1 gap-y-2 font-mono text-[10.5px] tracking-[0.03em]">
              <div>
                <dt className="text-crimson font-bold uppercase mb-0.5">Established</dt>
                <dd className="text-bone border-b border-dotted border-bone/40 pb-1">2009</dd>
              </div>
              <div>
                <dt className="text-crimson font-bold uppercase mb-0.5">Faculty In-Charge</dt>
                <dd className="text-bone border-b border-dotted border-bone/40 pb-1">Ms. Vibha Arora<br/>Mr. Sanchit Chauhan</dd>
              </div>
              <div>
                <dt className="text-crimson font-bold uppercase mb-0.5">Core Team</dt>
                <dd className="text-bone border-b border-dotted border-bone/40 pb-1">~30 Active Members</dd>
              </div>
              <div>
                <dt className="text-crimson font-bold uppercase mb-0.5">Alumni Network</dt>
                <dd className="text-bone border-b border-dotted border-bone/40 pb-1">100+ across global tier-1 universities</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Awards Section */}
      <div className="mt-16">
        <h3 className="font-display text-2xl text-bone uppercase tracking-widest mb-4">Track Record</h3>
        
        {/* Top Awards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {awards.filter(a => a.featured).map(award => (
            <div key={award.id} className="border-2 border-bone/50 p-4 hover:border-crimson transition-colors">
              <div className="font-mono text-xs text-crimson font-bold mb-1 uppercase">{award.year}</div>
              <h4 className="font-label font-bold text-lg text-bone uppercase tracking-wide leading-tight mb-2">{award.title}</h4>
              <p className="font-label text-sm text-bone-dim">{award.desc}</p>
            </div>
          ))}
        </div>

        {/* Full Record Toggle */}
        <div className="border-t-2 border-bone/30 pt-4">
          <button 
            onClick={() => setShowFullAwards(!showFullAwards)}
            className="flex items-center justify-between w-full text-left font-mono text-[11px] font-bold text-bone uppercase tracking-[0.15em] hover:text-crimson transition-colors py-2"
          >
            <span>{showFullAwards ? '[-]' : '[+]'} View Complete Record Archive (2010 - Present)</span>
            <span>{showFullAwards ? 'COLLAPSE' : 'EXPAND'}</span>
          </button>
          
          {showFullAwards && (
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 font-label text-sm text-bone-dim">
              {awards.filter(a => !a.featured).map(award => (
                <div key={award.id} className="flex gap-4 border-b border-bone/20 pb-2">
                  <span className="font-mono text-xs text-crimson font-bold shrink-0">{award.year}</span>
                  <div>
                    <span className="text-bone font-bold block">{award.title}</span>
                    <span>{award.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default About;
