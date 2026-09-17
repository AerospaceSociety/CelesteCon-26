import React from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import { previousSponsors2024, pastSponsors } from '../data/sponsors';

const Sponsors = () => {
  return (
    <div className="max-w-6xl">
      <SectionHeader section="04" title="Sponsors & Partners" jp="協賛企業" />

      <p className="font-label text-base md:text-lg text-bone-dim mb-10 max-w-3xl leading-relaxed">
        CelesteCon offers an unparalleled national platform connecting forward-thinking organizations with India's most promising young aerospace engineers, programmers, designers, and innovators.
      </p>

      {/* Featured Previous Sponsors from 2024 */}
      <div className="mb-16">
        <div className="flex items-center justify-between border-b-2 border-bone pb-2 mb-6">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-crimson font-bold tracking-[0.2em] uppercase">
              ◆ Previous Partners
            </span>
            <span className="font-label text-sm text-bone font-bold uppercase tracking-wider">
              CelesteCon 2024 Sponsors
            </span>
          </div>
          <span className="font-mono text-[10px] text-bone-dim uppercase tracking-widest hidden sm:inline">
            Official Archives // C24
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {previousSponsors2024.map((sponsor) => (
            <div
              key={sponsor.id}
              className={`border-2 border-bone p-6 sm:p-7 flex flex-col justify-between transition-colors ${
                sponsor.tier.includes('Title')
                  ? 'md:col-span-2 bg-bone/[0.04] border-crimson/80'
                  : 'bg-ink/60 hover:bg-bone/[0.03]'
              }`}
            >
              <div>
                {/* Header with Logo & Badges */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-5 border-b border-bone/20">
                  <div className="h-16 flex items-center bg-bone px-4 py-2 border border-bone/40 max-w-fit">
                    <img
                      src={sponsor.logo}
                      alt={`${sponsor.name} Logo`}
                      className="max-h-12 w-auto object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap sm:justify-end">
                    <span
                      className={`font-mono text-[10px] tracking-widest uppercase px-2.5 py-1 font-bold ${
                        sponsor.tier.includes('Title')
                          ? 'bg-crimson text-bone-hi border border-crimson'
                          : 'bg-bone text-ink border border-bone'
                      }`}
                    >
                      {sponsor.tier}
                    </span>
                  </div>
                </div>

                {/* Sponsor Name & Tagline */}
                <h3 className="font-display text-2xl sm:text-3xl text-bone uppercase tracking-wide mb-1">
                  {sponsor.name}
                </h3>
                <div className="font-mono text-[11px] text-crimson font-bold uppercase tracking-wider mb-4">
                  {sponsor.tagline}
                </div>

                {/* Detailed Description from PDF */}
                <p className="font-label text-sm sm:text-base text-bone-dim leading-relaxed mb-4">
                  {sponsor.description}
                </p>
              </div>

              <div className="pt-3 border-t border-bone/20 flex justify-between items-center text-[10px] font-mono text-bone-dim uppercase tracking-wider">
                <span>Domain: {sponsor.industry}</span>
                <span className="text-crimson font-bold">Partner // 2024</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Past Partners Strip */}
      <div className="mb-16 border-t-[3px] border-b-[1.5px] border-bone py-4 flex gap-3 items-baseline flex-wrap bg-bone/[0.02] px-4">
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-crimson font-bold whitespace-nowrap">
          Complete Partner Network //
        </span>
        <span className="font-label font-bold text-sm tracking-[0.12em] uppercase text-bone">
          {pastSponsors.map((sponsor, i) => (
            <React.Fragment key={i}>
              {sponsor}
              {i < pastSponsors.length - 1 && <i className="not-italic text-crimson mx-2.5">·</i>}
            </React.Fragment>
          ))}
        </span>
      </div>

      {/* Call To Action Box */}
      <div className="border-2 border-crimson p-6 sm:p-8 bg-crimson/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <span className="font-mono text-xs text-crimson font-bold uppercase tracking-widest block mb-1">
            PARTNER WITH CELESTECON 2026
          </span>
          <h3 className="font-display text-2xl text-bone uppercase tracking-wide mb-2">
            Ready to empower India's next generation of aerospace leaders?
          </h3>
          <p className="font-label text-sm text-bone-dim max-w-xl leading-relaxed">
            Custom brand integrations, stage sessions, tech booths, and campus exhibit partnerships available. Speak directly with our secretariat.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <Link
            to="/contact"
            className="px-5 py-2.5 bg-crimson text-bone font-label font-bold text-xs uppercase tracking-widest border border-crimson hover:bg-ink hover:text-crimson transition-colors whitespace-nowrap text-center"
          >
            Contact Secretariat →
          </Link>
          <a
            href="mailto:aeross@dpsrkp.net?subject=CelesteCon%202026%20Sponsorship%20Inquiry"
            className="px-5 py-2.5 border border-bone/60 text-bone font-label font-bold text-xs uppercase tracking-widest hover:bg-bone hover:text-ink transition-colors whitespace-nowrap text-center"
          >
            Email Pitch Deck
          </a>
        </div>
      </div>

    </div>
  );
};

export default Sponsors;
