import React from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import { currentSponsors, pastSponsorsDetailed, completePartnerNetwork } from '../data/sponsors';

const Sponsors = () => {
  return (
    <div className="max-w-6xl">
      <SectionHeader section="04" title="Sponsors & Partners" jp="協賛企業" />

      <p className="font-label text-base md:text-lg text-bone-dim mb-10 max-w-3xl leading-relaxed">
        CelesteCon offers an unparalleled national platform connecting forward-thinking organizations with India's most promising young aerospace engineers, programmers, designers, and innovators.
      </p>

      {/* =========================================================
          CURRENT CONCLAVE SPONSOR (2026 ACTIVE)
      ========================================================= */}
      {currentSponsors && currentSponsors.length > 0 && (
        <section className="mb-14">
          <div className="flex items-center justify-between border-b-2 border-bone pb-2 mb-6">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 bg-crimson inline-block"></span>
              <h2 className="font-display text-xl sm:text-2xl uppercase tracking-wider text-bone">
                Official Conclave Sponsor // 現在協賛
              </h2>
            </div>
            <span className="font-mono text-[10px] text-crimson font-bold uppercase tracking-widest hidden sm:inline-block">
              Edition 2026 Active Partner
            </span>
          </div>

          {currentSponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="border-2 border-bone bg-ink text-bone mb-8 shadow-xl overflow-hidden"
            >
              {/* Top Status Header */}
              <div className="bg-bone text-ink px-4 py-2 flex flex-wrap justify-between items-center gap-2 border-b-2 border-bone">
                <div className="flex items-center gap-2">
                  <span className="bg-crimson text-bone-hi font-mono text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest">
                    {sponsor.tier} Tier
                  </span>
                  <span className="font-label font-bold text-sm tracking-wider uppercase">
                    {sponsor.tierTitle}
                  </span>
                </div>
                <span className="font-jp text-xs font-bold text-ink-3">
                  {sponsor.tierJp}
                </span>
              </div>

              {/* Main Content Grid */}
              <div className="p-4 sm:p-6 md:p-8 grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 md:gap-8 items-start">
                {/* Left Column: Visual Plate & Brand Card */}
                <div className="flex flex-col items-center sm:items-start w-full">
                  <div className="w-full bg-bone/5 border-2 border-bone/40 p-3 sm:p-4 flex flex-col items-center justify-center relative group">
                    {/* Dark Theme Logo */}
                    <img
                      src={sponsor.logoDark}
                      alt={`${sponsor.name} Logo`}
                      className="sponsor-logo-dark w-full max-w-[320px] h-auto object-contain border border-bone/20 transition-transform duration-200 group-hover:scale-[1.02]"
                    />
                    {/* Light Theme Logo */}
                    <img
                      src={sponsor.logoLight}
                      alt={`${sponsor.name} Logo`}
                      className="sponsor-logo-light w-full max-w-[320px] h-auto object-contain border border-bone/20 transition-transform duration-200 group-hover:scale-[1.02]"
                    />

                    {/* Technical Coordinates Stamp */}
                    <div className="w-full mt-3 pt-2 border-t border-dotted border-bone/30 flex justify-between items-center font-mono text-[9px] text-bone-dim uppercase tracking-wider">
                      <span>PARTNER // 01</span>
                      <span>ONLINE GRID</span>
                    </div>
                  </div>

                  {/* Direct Action Link */}
                  <a
                    href={sponsor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 w-full px-4 py-2.5 bg-crimson text-bone-hi font-label font-bold text-sm uppercase tracking-widest border border-crimson hover:bg-bone hover:text-ink hover:border-bone transition-colors flex items-center justify-between text-center"
                  >
                    <span>Visit {sponsor.name}</span>
                    <span className="text-base leading-none">↗</span>
                  </a>

                  {/* Tagline Box */}
                  <div className="w-full mt-2 p-2.5 border border-bone/20 bg-bone/5 text-center">
                    <p className="font-mono text-xs text-crimson font-bold tracking-wider uppercase">
                      "{sponsor.tagline}"
                    </p>
                  </div>
                </div>

                {/* Right Column: Narrative Dossier & Endorsement */}
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {sponsor.badges.map((badge, idx) => (
                        <span
                          key={idx}
                          className="font-mono text-[9.5px] uppercase font-bold tracking-wider px-2 py-0.5 border border-bone/30 text-bone-dim bg-bone/5"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>

                    <h3 className="font-display text-2xl sm:text-3xl text-bone uppercase tracking-wider mb-3">
                      {sponsor.name}
                    </h3>

                    <div className="space-y-3 font-label text-sm sm:text-base text-bone-dim leading-relaxed">
                      <p>{sponsor.summary}</p>
                      <p>{sponsor.philosophy}</p>
                    </div>
                  </div>

                  {/* Official Conclave Endorsement Box */}
                  <div className="mt-6 border-l-4 border-crimson bg-bone/10 p-3.5 sm:p-4 text-left">
                    <div className="flex items-center gap-2 mb-1.5 font-mono text-[10px] text-crimson uppercase tracking-[0.16em] font-bold">
                      <span>◆ Official Conclave Endorsement</span>
                      <span className="font-jp text-bone-dim/70">公式声明</span>
                    </div>
                    <p className="font-label text-xs sm:text-sm text-bone leading-relaxed italic">
                      "{sponsor.endorsement}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* =========================================================
          PREVIOUS PARTNERS (CELESTECON 2024 SPONSORS - PREVIEW STYLE)
      ========================================================= */}
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
          {pastSponsorsDetailed.map((e) => (
            <div
              key={e.id}
              className={`border-2 border-bone p-6 sm:p-7 flex flex-col justify-between transition-colors ${
                e.tier.includes('Title')
                  ? 'md:col-span-2 bg-bone/[0.04] border-crimson/80'
                  : 'bg-ink/60 hover:bg-bone/[0.03]'
              }`}
            >
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-5 border-b border-bone/20">
                  <div className="h-16 flex items-center bg-[#ECE5D6] px-4 py-2 border border-bone/40 max-w-fit">
                    <img
                      src={e.logo}
                      alt={`${e.name} Logo`}
                      className="max-h-12 w-auto object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap sm:justify-end">
                    <span
                      className={`font-mono text-[10px] tracking-widest uppercase px-2.5 py-1 font-bold ${
                        e.tier.includes('Title')
                          ? 'bg-crimson text-bone-hi border border-crimson'
                          : 'bg-bone text-ink border border-bone'
                      }`}
                    >
                      {e.tier}
                    </span>
                  </div>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl text-bone uppercase tracking-wide mb-1">
                  {e.name}
                </h3>
                <div className="font-mono text-[11px] text-crimson font-bold uppercase tracking-wider mb-4">
                  {e.tagline}
                </div>
                <p className="font-label text-sm sm:text-base text-bone-dim leading-relaxed mb-4">
                  {e.description}
                </p>
              </div>

              <div className="pt-3 border-t border-bone/20 flex justify-between items-center text-[10px] font-mono text-bone-dim uppercase tracking-wider">
                <span>Domain: {e.industry}</span>
                <span className="text-crimson font-bold">Partner // 2024</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================
          COMPLETE PARTNER NETWORK TICKER (PREVIEW STYLE)
      ========================================================= */}
      <div className="mb-16 border-t-[3px] border-b-[1.5px] border-bone py-4 flex gap-3 items-baseline flex-wrap bg-bone/[0.02] px-4">
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-crimson font-bold whitespace-nowrap">
          Complete Partner Network //
        </span>
        <span className="font-label font-bold text-sm tracking-[0.12em] uppercase text-bone">
          {completePartnerNetwork.map((e, t) => (
            <React.Fragment key={t}>
              {e}
              {t < completePartnerNetwork.length - 1 && (
                <i className="not-italic text-crimson mx-2.5">·</i>
              )}
            </React.Fragment>
          ))}
        </span>
      </div>

      {/* =========================================================
          PARTNER WITH CELESTECON 2026 CALLOUT (PREVIEW STYLE)
      ========================================================= */}
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
            Email Inquiries
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sponsors;
