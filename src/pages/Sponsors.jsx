import React from 'react';
import SectionHeader from '../components/SectionHeader';
import { sponsorTiers, pastSponsors } from '../data/sponsors';

const Sponsors = () => {
  return (
    <div className="max-w-6xl">
      <SectionHeader section="04" title="Partnership Tiers" jp="協賛階層" />
      
      <p className="font-label text-base md:text-lg text-bone-dim mb-8 max-w-3xl leading-relaxed">
        CelesteCon offers an unparalleled platform for brands to engage directly with India's top STEM talent, educators, and parents.
      </p>

      {/* Tiers Table */}
      <div className="overflow-x-auto mt-2 border-2 border-bone">
        <table className="w-full min-w-[800px] border-collapse bg-ink text-left">
          <thead>
            <tr>
              <th className="bg-bone text-ink font-mono text-[9.5px] tracking-[0.16em] uppercase font-bold p-3 border-r border-ink/20">Tier</th>
              <th className="bg-bone text-ink font-mono text-[9.5px] tracking-[0.16em] uppercase font-bold p-3 border-r border-ink/20">Investment</th>
              <th className="bg-bone text-ink font-mono text-[9.5px] tracking-[0.16em] uppercase font-bold p-3 border-r border-ink/20">Naming Rights</th>
              <th className="bg-bone text-ink font-mono text-[9.5px] tracking-[0.16em] uppercase font-bold p-3 border-r border-ink/20">On-Campus</th>
              <th className="bg-bone text-ink font-mono text-[9.5px] tracking-[0.16em] uppercase font-bold p-3 border-r border-ink/20">Stage Time</th>
              <th className="bg-bone text-ink font-mono text-[9.5px] tracking-[0.16em] uppercase font-bold p-3">National Invite</th>
            </tr>
          </thead>
          <tbody>
            {sponsorTiers.map((tier, index) => (
              <tr key={index} className={tier.name.includes('Diamond') ? 'bg-crimson text-bone-hi border-t-[1.5px] border-bone' : 'border-t-[1.5px] border-bone text-bone-dim'}>
                <td className={`p-3 align-top whitespace-nowrap border-r ${tier.name.includes('Diamond') ? 'border-bone/40' : 'border-bone/30'}`}>
                  <span className={`block font-label font-bold text-[13.5px] tracking-[0.1em] uppercase ${tier.name.includes('Diamond') ? 'text-bone-hi' : 'text-bone'}`}>{tier.name}</span>
                  <span className={`block font-mono text-[10px] tracking-[0.06em] uppercase mt-1 ${tier.name.includes('Diamond') ? 'text-[#F3D9C8]' : 'text-bone-dim/70'}`}>{tier.sub}</span>
                </td>
                <td className={`p-3 align-top border-r ${tier.name.includes('Diamond') ? 'border-bone/40' : 'border-bone/30'}`}>
                  <span className={`font-mono font-bold text-[11.5px] whitespace-nowrap ${tier.name.includes('Diamond') ? 'text-bone-hi' : 'text-bone'}`}>{tier.price}</span>
                </td>
                <td className={`p-3 align-top font-label text-xs tracking-[0.02em] border-r ${tier.name.includes('Diamond') ? 'border-bone/40' : 'border-bone/30'}`}>{tier.rights}</td>
                <td className={`p-3 align-top font-label text-xs tracking-[0.02em] border-r ${tier.name.includes('Diamond') ? 'border-bone/40' : 'border-bone/30'}`}>{tier.campus}</td>
                <td className={`p-3 align-top font-label text-xs tracking-[0.02em] border-r ${tier.name.includes('Diamond') ? 'border-bone/40' : 'border-bone/30'}`}>{tier.stage}</td>
                <td className="p-3 align-top font-label text-xs tracking-[0.02em]">{tier.invite}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-4 flex-wrap mt-3 font-mono text-[9px] tracking-[0.1em] uppercase text-bone-dim font-bold">
        <span><span className="text-crimson">◆</span> One Title sponsor only — exclusivity is absolute</span>
        <span><span className="text-crimson">◆</span> All tiers: social promotion + event-site logo</span>
        <span><span className="text-crimson">◆</span> Trophy & certificate logos scale by tier</span>
        <span><span className="text-crimson">◆</span> In-kind: software, kits, F&B welcome</span>
      </div>

      {/* Past Partners */}
      <div className="mt-[clamp(18px,2.6vw,28px)] border-t-[4px] border-b-[1.5px] border-bone py-3 flex gap-2.5 items-baseline flex-wrap">
        <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-crimson font-bold whitespace-nowrap">
          Previously backed by //
        </span>
        <span className="font-label font-bold text-[clamp(11px,1.5vw,14px)] tracking-[0.14em] uppercase text-bone">
          {pastSponsors.map((sponsor, i) => (
            <React.Fragment key={i}>
              {sponsor}
              {i < pastSponsors.length - 1 && <i className="not-italic text-crimson mx-2">·</i>}
            </React.Fragment>
          ))}
        </span>
      </div>

    </div>
  );
};

export default Sponsors;
