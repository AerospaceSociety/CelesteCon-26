import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import { EXECUTIVES } from '../data/executives';
import { Phone, Mail, Copy, Check, ExternalLink, AlertTriangle } from 'lucide-react';

const ExecCard = ({ exec, index }) => {
  const [imgSrc, setImgSrc] = useState(exec.image || exec.placeholder);
  const [hasError, setHasError] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleImageError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(exec.placeholder);
    }
  };

  const handleCopyPhone = (e) => {
    e.preventDefault();
    if (exec.phone) {
      navigator.clipboard.writeText(exec.phone);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const isCustomPhoto = !!exec.image && !hasError;

  return (
    <div className="relative border-2 border-[#161310]/70 bg-[#ECE5D6] text-[#161310] flex flex-col justify-between hover:border-crimson hover:shadow-2xl transition-all duration-300 group hover:z-30">
      <div>
        {/* Top Header Tag */}
        <div className="border-b border-[#161310]/20 px-3.5 py-1.5 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest bg-[#E3DCC9]/70 z-10 relative">
          <span className="text-crimson font-bold">EXEC // 0{index + 1}</span>
          <span className="text-[#161310]/80 font-bold tracking-wider truncate max-w-[110px]">{exec.division.split(' ')[0]}</span>
        </div>

        {/* Photo Container with Out-of-Frame Pop Effect on Desktop Hover Only */}
        <div className="relative h-72 sm:h-72 w-full border-b border-[#161310]/20 bg-[#ECE5D6] flex items-end justify-center overflow-hidden md:overflow-hidden md:group-hover:overflow-visible transition-all duration-300">
          {/* Corner Technical Reticles (+) */}
          <span className="absolute top-2 left-2 font-mono text-[10px] text-[#161310]/35 select-none leading-none z-0">+</span>
          <span className="absolute top-2 right-2 font-mono text-[10px] text-[#161310]/35 select-none leading-none z-0">+</span>
          <span className="absolute bottom-2 left-2 font-mono text-[10px] text-[#161310]/35 select-none leading-none z-0">+</span>
          <span className="absolute bottom-2 right-2 font-mono text-[10px] text-[#161310]/35 select-none leading-none z-0">+</span>

          {/* Warm Ambient Halo Glow behind person */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-48 sm:h-48 rounded-full bg-gradient-to-br from-crimson/25 via-crimson/10 to-transparent blur-xl pointer-events-none transition-all duration-500 group-hover:scale-125 group-hover:opacity-100 opacity-75 z-0" />

          {/* Cutout Subject - cleanly contained on mobile, subtle lift on desktop hover */}
          <div className="absolute inset-0 flex items-end justify-center pointer-events-none z-20">
            <img
              src={imgSrc}
              alt={exec.name}
              onError={handleImageError}
              className={`transition-all duration-300 ease-out pointer-events-none ${isCustomPhoto
                  ? 'h-full w-auto max-w-full bottom-0 object-contain object-bottom origin-bottom ' +
                  'scale-100 translate-y-0 drop-shadow-[0_4px_10px_rgba(0,0,0,0.15)] ' +
                  'md:max-w-none md:left-1/2 md:-translate-x-1/2 md:absolute md:origin-center md:scale-95 ' +
                  'md:group-hover:scale-110 md:group-hover:translate-y-4 md:group-hover:drop-shadow-[0_16px_30px_rgba(194,58,30,0.5)]'
                  : 'w-full h-full object-contain object-bottom invert opacity-75 p-3 group-hover:scale-105 transition-transform'
                }`}
            />
          </div>
        </div>

        {/* Executive Info */}
        <div className="p-4 space-y-2 relative z-10">
          <div className="font-mono text-[9.5px] text-crimson font-bold uppercase tracking-[0.16em]">
            {exec.role}
          </div>
          <h4 className="font-display text-xl sm:text-[22px] text-[#161310] uppercase font-bold leading-none tracking-wide group-hover:text-crimson transition-colors">
            {exec.name}
          </h4>
          <div className="font-mono text-[10.5px] text-[#161310]/75 tracking-wide font-medium">
            {exec.division}
          </div>
          <div className="border-b border-dotted border-[#161310]/25 my-2" />
          <p className="font-label text-[11px] text-[#161310]/80 leading-relaxed">
            {exec.focus}
          </p>
        </div>
      </div>

      {/* Action / Contact Footer */}
      <div className="p-4 pt-0 space-y-2 font-mono text-[10.5px]">
        {exec.phone && (
          <div className="flex items-center gap-1.5">
            <a
              href={`tel:${exec.phoneRaw}`}
              className="flex-1 flex items-center justify-center gap-1.5 border border-crimson bg-crimson/10 hover:bg-crimson hover:text-white text-crimson py-2 px-2 font-bold transition-colors"
              title={`Call ${exec.name}`}
            >
              <Phone size={11} />
              <span>{exec.phone}</span>
            </a>
            <button
              onClick={handleCopyPhone}
              className="p-2 border border-[#161310]/30 text-[#161310] hover:border-crimson hover:text-crimson transition-colors bg-[#E3DCC9]/40"
              title="Copy phone number"
            >
              {copiedPhone ? <Check size={12} className="text-emerald-700" /> : <Copy size={12} />}
            </button>
          </div>
        )}

        <a
          href={`mailto:${exec.email}?subject=%5BCelesteCon%2026%5D%20Attn:%20${encodeURIComponent(exec.name)}`}
          className={`w-full flex items-center justify-center gap-1.5 border py-2 px-2 font-bold transition-colors ${exec.phone
              ? 'border-[#161310]/30 text-[#161310] hover:border-[#161310] hover:bg-[#161310] hover:text-white bg-[#E3DCC9]/40'
              : 'border-crimson bg-crimson/10 hover:bg-crimson hover:text-white text-crimson'
            }`}
        >
          <Mail size={11} />
          <span>Email {exec.name.split(' ')[0]}</span>
        </a>
      </div>
    </div>
  );
};

const Contact = () => {
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="max-w-6xl w-full space-y-12">
      <SectionHeader section="07" title="Communications" jp="お問い合わせ" />

      {/* Executive Leadership Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-bone/40 pb-4 gap-4">
          <div>
            <div className="font-mono text-xs text-crimson font-bold tracking-[0.2em] uppercase mb-1">
              Core Secretariat // 幹部名簿
            </div>
            <h3 className="font-display text-3xl md:text-4xl text-bone uppercase leading-none">
              Executive Leadership
            </h3>
          </div>
          <p className="font-mono text-xs text-bone-dim max-w-md text-justify">
            Direct coordination desk for competition scrutiny, institutional delegations, event schedule synchronization, and emergency logistics.
          </p>
        </div>

        {/* 5 Exec Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 sm:gap-6 pt-3 px-1 sm:px-2">
          {EXECUTIVES.map((exec, idx) => (
            <ExecCard key={exec.id} exec={exec} index={idx} />
          ))}
        </div>
      </div>

      {/* Teacher In-Charges Section - Positioned Directly After Secretariat */}
      <div className="space-y-6 pt-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-bone/40 pb-4 gap-4">
          <div>
            <div className="font-mono text-xs text-crimson font-bold tracking-[0.2em] uppercase mb-1">
              Faculty Administration // 顧問教諭
            </div>
            <h3 className="font-display text-3xl md:text-4xl text-bone uppercase leading-none">
              Teacher In-Charges
            </h3>
          </div>
          <p className="font-mono text-xs text-bone-dim max-w-md text-left md:text-right">
            Department of Physics, Delhi Public School, R.K. Puram. Direct faculty oversight for school delegations, teacher escorts, and institutional clearances.
          </p>
        </div>

        {/* Two-Column Structured Table for Teacher In-Charges */}
        <div className="border-2 border-bone bg-ink/80 overflow-hidden shadow-2xl">
          <div className="bg-bone text-ink font-mono text-[10.5px] tracking-[0.2em] uppercase px-4 py-2 flex flex-wrap justify-between items-center font-bold border-b-2 border-bone">
            <span>Faculty Oversight Roster // DPS R.K. Puram</span>
            <span>Department of Physics</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#191512] text-bone font-mono text-[11px] tracking-widest uppercase border-b-2 border-bone/30">
                  <th className="py-3.5 px-4 sm:px-6 w-1/2 border-r border-bone/30">
                    <div className="text-crimson font-bold text-[10px] tracking-[0.2em]">FACULTY IN-CHARGE // LEFT COLUMN</div>
                    <div className="font-display text-xl sm:text-2xl text-bone mt-1 uppercase">Mrs. Vibha Arora</div>
                    <div className="font-mono text-[11px] text-bone-dim/80 font-normal lowercase tracking-normal">vibhaarora@dpsrkp.net</div>
                  </th>
                  <th className="py-3.5 px-4 sm:px-6 w-1/2">
                    <div className="text-crimson font-bold text-[10px] tracking-[0.2em]">FACULTY IN-CHARGE // RIGHT COLUMN</div>
                    <div className="font-display text-xl sm:text-2xl text-bone mt-1 uppercase">Mr. Sanchit Chauhan</div>
                    <div className="font-mono text-[11px] text-bone-dim/80 font-normal lowercase tracking-normal">sanchitchauhan@dpsrkp.net</div>
                  </th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs divide-y divide-bone/20 text-bone">
                {/* Department / Designation */}
                <tr className="hover:bg-bone/[0.03] transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 border-r border-bone/20 align-top">
                    <div className="text-crimson text-[9.5px] uppercase font-bold tracking-wider mb-1">Designation &amp; Department</div>
                    <div className="font-label font-bold text-base text-bone uppercase">Teacher In-Charge</div>
                    <div className="text-bone-dim text-xs mt-0.5">Department of Physics, DPS R.K. Puram</div>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 align-top">
                    <div className="text-crimson text-[9.5px] uppercase font-bold tracking-wider mb-1">Designation &amp; Department</div>
                    <div className="font-label font-bold text-base text-bone uppercase">Teacher In-Charge</div>
                    <div className="text-bone-dim text-xs mt-0.5">Department of Physics, DPS R.K. Puram</div>
                  </td>
                </tr>

                {/* Email Row */}
                <tr className="hover:bg-bone/[0.03] transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 border-r border-bone/20 align-top">
                    <div className="text-crimson text-[9.5px] uppercase font-bold tracking-wider mb-1">Official Email</div>
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href="mailto:vibhaarora@dpsrkp.net?subject=%5BCelesteCon%2026%5D%20Attn:%20Mrs.%20Vibha%20Arora"
                        className="font-mono text-xs sm:text-sm text-bone font-bold hover:text-crimson transition-colors inline-flex items-center gap-1.5"
                      >
                        <Mail size={13} className="text-crimson" />
                        <span>vibhaarora@dpsrkp.net</span>
                      </a>
                      <button
                        onClick={() => handleCopy('vibhaarora@dpsrkp.net', 'vibha-email')}
                        className="p-1 px-2 border border-bone/30 text-bone-dim hover:text-crimson hover:border-crimson text-[10px] inline-flex items-center gap-1 transition-colors bg-bone/5"
                        title="Copy email"
                      >
                        {copiedKey === 'vibha-email' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                        <span>{copiedKey === 'vibha-email' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 align-top">
                    <div className="text-crimson text-[9.5px] uppercase font-bold tracking-wider mb-1">Official Email</div>
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href="mailto:sanchitchauhan@dpsrkp.net?subject=%5BCelesteCon%2026%5D%20Attn:%20Mr.%20Sanchit%20Chauhan"
                        className="font-mono text-xs sm:text-sm text-bone font-bold hover:text-crimson transition-colors inline-flex items-center gap-1.5"
                      >
                        <Mail size={13} className="text-crimson" />
                        <span>sanchitchauhan@dpsrkp.net</span>
                      </a>
                      <button
                        onClick={() => handleCopy('sanchitchauhan@dpsrkp.net', 'sanchit-email')}
                        className="p-1 px-2 border border-bone/30 text-bone-dim hover:text-crimson hover:border-crimson text-[10px] inline-flex items-center gap-1 transition-colors bg-bone/5"
                        title="Copy email"
                      >
                        {copiedKey === 'sanchit-email' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                        <span>{copiedKey === 'sanchit-email' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Telephone Row */}
                <tr className="hover:bg-bone/[0.03] transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 border-r border-bone/20 align-top">
                    <div className="text-crimson text-[9.5px] uppercase font-bold tracking-wider mb-1">Direct Telephone</div>
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href="tel:+919871383581"
                        className="font-mono text-xs sm:text-sm text-bone font-bold hover:text-crimson transition-colors inline-flex items-center gap-1.5"
                      >
                        <Phone size={13} className="text-crimson" />
                        <span>+91 98713 83581</span>
                      </a>
                      <button
                        onClick={() => handleCopy('+919871383581', 'vibha-phone')}
                        className="p-1 px-2 border border-bone/30 text-bone-dim hover:text-crimson hover:border-crimson text-[10px] inline-flex items-center gap-1 transition-colors bg-bone/5"
                        title="Copy phone number"
                      >
                        {copiedKey === 'vibha-phone' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                        <span>{copiedKey === 'vibha-phone' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 align-top">
                    <div className="text-crimson text-[9.5px] uppercase font-bold tracking-wider mb-1">Direct Telephone</div>
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href="tel:+919560332064"
                        className="font-mono text-xs sm:text-sm text-bone font-bold hover:text-crimson transition-colors inline-flex items-center gap-1.5"
                      >
                        <Phone size={13} className="text-crimson" />
                        <span>+91 95603 32064</span>
                      </a>
                      <button
                        onClick={() => handleCopy('+919560332064', 'sanchit-phone')}
                        className="p-1 px-2 border border-bone/30 text-bone-dim hover:text-crimson hover:border-crimson text-[10px] inline-flex items-center gap-1 transition-colors bg-bone/5"
                        title="Copy phone number"
                      >
                        {copiedKey === 'sanchit-phone' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                        <span>{copiedKey === 'sanchit-phone' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Direct Action Buttons */}
                <tr className="bg-bone/[0.02]">
                  <td className="p-3.5 px-4 sm:px-6 border-r border-bone/20">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <a
                        href="tel:+919871383581"
                        className="flex-1 flex items-center justify-center gap-1.5 border border-crimson bg-crimson/15 hover:bg-crimson hover:text-white text-crimson py-2.5 px-3 font-mono text-[11px] font-bold tracking-wider uppercase transition-colors"
                      >
                        <Phone size={12} />
                        <span>Call Mrs. Arora</span>
                      </a>
                      <a
                        href="mailto:vibhaarora@dpsrkp.net?subject=%5BCelesteCon%2026%5D%20Attn:%20Mrs.%20Vibha%20Arora"
                        className="flex-1 flex items-center justify-center gap-1.5 border border-bone/40 hover:border-bone hover:bg-bone hover:text-ink text-bone py-2.5 px-3 font-mono text-[11px] font-bold tracking-wider uppercase transition-colors"
                      >
                        <Mail size={12} />
                        <span>Email Desk</span>
                      </a>
                    </div>
                  </td>
                  <td className="p-3.5 px-4 sm:px-6">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <a
                        href="tel:+919560332064"
                        className="flex-1 flex items-center justify-center gap-1.5 border border-crimson bg-crimson/15 hover:bg-crimson hover:text-white text-crimson py-2.5 px-3 font-mono text-[11px] font-bold tracking-wider uppercase transition-colors"
                      >
                        <Phone size={12} />
                        <span>Call Mr. Chauhan</span>
                      </a>
                      <a
                        href="mailto:sanchitchauhan@dpsrkp.net?subject=%5BCelesteCon%2026%5D%20Attn:%20Mr.%20Sanchit%20Chauhan"
                        className="flex-1 flex items-center justify-center gap-1.5 border border-bone/40 hover:border-bone hover:bg-bone hover:text-ink text-bone py-2.5 px-3 font-mono text-[11px] font-bold tracking-wider uppercase transition-colors"
                      >
                        <Mail size={12} />
                        <span>Email Desk</span>
                      </a>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Communications Matrix & Dispatch Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
        {/* Left Column: Direct Lines & Inquiries */}
        <div className="space-y-6">
          <h3 className="font-display text-2xl md:text-3xl text-bone uppercase leading-none">
            Direct Line & Channels
          </h3>
          <p className="font-label text-base text-bone-dim leading-relaxed">
            For official school delegations, sponsorship liaison, or competition clarifications, our desk is operational.
          </p>

          <div className="border-2 border-bone">
            <div className="bg-bone text-ink font-mono text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 flex justify-between font-bold">
              <span>Primary Desks</span>
              <span>EST. 2009</span>
            </div>
            <dl className="p-3 sm:p-4 grid grid-cols-[80px_1fr] sm:grid-cols-[auto_1fr] gap-x-3 sm:gap-x-4 gap-y-2.5 sm:gap-y-3 font-mono text-[10px] sm:text-[10.5px] tracking-[0.03em]">
              <dt className="text-crimson font-bold uppercase whitespace-nowrap">Primary POC</dt>
              <dd className="text-bone border-b border-dotted border-bone/40 pb-0.5 break-words">
                <a href="tel:+918929020721" className="hover:text-crimson font-bold transition-colors">
                  Siddharth Srivastava (+91 89290 20721)
                </a>
              </dd>
              <dt className="text-crimson font-bold uppercase whitespace-nowrap">Central Email</dt>
              <dd className="text-bone border-b border-dotted border-bone/40 pb-0.5 break-all">
                <a href="mailto:aeross@dpsrkp.net" className="hover:text-crimson transition-colors">
                  aeross@dpsrkp.net
                </a>
              </dd>
              <dt className="text-crimson font-bold uppercase whitespace-nowrap">Instagram</dt>
              <dd className="text-bone border-b border-dotted border-bone/40 pb-0.5">
                <a
                  href="https://www.instagram.com/aerospace_society/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-crimson transition-colors inline-flex items-center gap-1"
                >
                  <span>@aerospace_society</span>
                  <ExternalLink size={9} />
                </a>
              </dd>
              <dt className="text-crimson font-bold uppercase whitespace-nowrap">LinkedIn</dt>
              <dd className="text-bone border-b border-dotted border-bone/40 pb-0.5">
                <a
                  href="https://www.linkedin.com/company/aeross-aerospace-society"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-crimson transition-colors inline-flex items-center gap-1"
                >
                  <span>Aeross: Aerospace Society</span>
                  <ExternalLink size={9} />
                </a>
              </dd>
              <dt className="text-crimson font-bold uppercase whitespace-nowrap">Event Venue</dt>
              <dd className="text-bone border-b border-dotted border-bone/40 pb-0.5 leading-relaxed">
                Delhi Public School, Sector 12, R.K. Puram<br />
                New Delhi — 110022
              </dd>
              <dt className="text-crimson font-bold uppercase whitespace-nowrap">Supported By</dt>
              <dd className="text-bone border-b border-dotted border-bone/40 pb-0.5 leading-relaxed">
                HelpLink.dev
              </dd>
            </dl>
          </div>

          {/* Official Registration Portals */}
          <div className="border-2 border-crimson bg-crimson/5 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-crimson font-bold uppercase tracking-widest">Official Registration</span>
              <span className="font-mono text-[9px] text-bone-dim uppercase font-bold">CelesteCon 2026</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href="/celestecon_registration.html"
                className="p-3 border border-bone/40 bg-ink hover:border-crimson hover:text-crimson transition-colors block text-left"
              >
                <div className="font-label font-bold text-sm text-bone uppercase tracking-wider">
                  School Contingent
                </div>
                <p className="font-label text-xs text-bone-dim mt-0.5">Official school delegation entry (2–3 teams per event quota).</p>
                <span className="font-mono text-[10px] text-crimson mt-2 inline-block font-bold">Open Portal ↗</span>
              </a>
              <a
                href="/celestecon_individual_registration.html"
                className="p-3 border border-crimson bg-crimson/10 hover:bg-crimson hover:text-white transition-colors block text-left group"
              >
                <div className="font-label font-bold text-sm text-crimson group-hover:text-white uppercase tracking-wider">
                  Individual Entry
                </div>
                <p className="font-label text-xs text-bone-dim group-hover:text-bone-hi mt-0.5">Independent student / team entry (strictly 1 team per event).</p>
                <span className="font-mono text-[10px] text-crimson group-hover:text-white mt-2 inline-block font-bold">Open Portal ↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Direct Transmission Desk */}
        <div className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-bone/30 pb-2">
            <h3 className="font-display text-2xl md:text-3xl text-bone uppercase leading-none">
              Direct Transmission Desk
            </h3>
            <span className="font-mono text-[9px] text-crimson uppercase font-bold">Quick Email</span>
          </div>
          <p className="font-label text-sm text-bone-dim leading-relaxed">
            Send an instant dispatch to the Aerospace Society secretariat for event clarifications, registration inquiries, or campus access verification.
          </p>

          <div className="p-4 border border-bone/30 bg-bone/[0.02]">
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                const designation = e.currentTarget.elements.designation.value;
                const message = e.currentTarget.elements.message.value;
                const body = encodeURIComponent(`From: ${designation}\n\nMessage:\n${message}`);
                window.location.href = `mailto:aeross@dpsrkp.net?subject=${encodeURIComponent(
                  `[CelesteCon 26 Inquiry] ${designation}`
                )}&body=${body}`;
              }}
            >
              <div>
                <label className="font-mono text-[10px] text-bone-dim uppercase font-bold block mb-1">
                  Sender Identity // Institution // Designation
                </label>
                <input
                  name="designation"
                  type="text"
                  required
                  placeholder="e.g. Dr. A. Sharma // St. Xavier's // Delegation In-Charge"
                  className="w-full bg-transparent border-[1.5px] border-bone/40 px-3 py-2 font-mono text-base sm:text-xs text-bone placeholder:text-bone/30 focus:outline-none focus:border-crimson transition-colors"
                />
              </div>
              <div>
                <label className="font-mono text-[10px] text-bone-dim uppercase font-bold block mb-1">
                  Dispatch Content // Inquiries &amp; Requests
                </label>
                <textarea
                  name="message"
                  required
                  rows="4"
                  placeholder="Enter your inquiry, competition clarification, or contingent arrival details..."
                  className="w-full bg-transparent border-[1.5px] border-bone/40 px-3 py-2 font-mono text-base sm:text-xs text-bone placeholder:text-bone/30 focus:outline-none focus:border-crimson transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full border-[1.5px] border-crimson bg-crimson text-bone font-label font-bold text-sm uppercase tracking-widest py-3 hover:bg-ink hover:text-crimson transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <Mail size={14} />
                <span>Transmit Dispatch to aeross@dpsrkp.net</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
