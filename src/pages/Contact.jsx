import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import { EXECUTIVES } from '../data/executives';
import { Phone, Mail, Copy, Check, ExternalLink, User, AlertTriangle, ShieldCheck } from 'lucide-react';

const ExecCard = ({ exec, index }) => {
  const [imgSrc, setImgSrc] = useState(exec.image);
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

  return (
    <div className="border-2 border-bone/80 bg-ink/70 flex flex-col justify-between hover:border-crimson transition-all duration-300 group">
      <div>
        {/* Top Header Tag */}
        <div className="bg-bone/10 border-b border-bone/30 px-3 py-1.5 flex items-center justify-between font-mono text-[9.5px] uppercase tracking-widest text-bone-dim">
          <span className="text-crimson font-bold">EXEC // 0{index + 1}</span>
          <span className="truncate max-w-[110px]">{exec.division.split(' ')[0]}</span>
        </div>

        {/* Photo Container - Specifically engineered for background-less PNG cutouts */}
        <div className="relative h-64 sm:h-72 w-full bg-gradient-to-t from-ink via-ink/40 to-bone/5 border-b border-bone/20 flex items-end justify-center overflow-hidden">
          {/* Subtle Technical Crosshair Markings */}
          <span className="absolute top-2 left-2 font-mono text-[9px] text-bone/25 select-none">+</span>
          <span className="absolute top-2 right-2 font-mono text-[9px] text-bone/25 select-none">+</span>
          <span className="absolute bottom-2 left-2 font-mono text-[9px] text-bone/25 select-none">+</span>
          <span className="absolute bottom-2 right-2 font-mono text-[9px] text-bone/25 select-none">+</span>

          {/* Cutout / Placeholder Image */}
          <img
            src={imgSrc}
            alt={exec.name}
            onError={handleImageError}
            className={`max-h-full max-w-full object-contain object-bottom relative z-10 drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] transition-transform duration-300 group-hover:scale-105 ${
              hasError ? 'opacity-80' : 'opacity-100'
            }`}
          />

          {/* Background-less image notification & path hint */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <span className="bg-ink/90 border border-bone/40 text-bone font-mono text-[8px] px-2 py-0.5 whitespace-nowrap uppercase tracking-wider">
              {hasError ? `Drop PNG: /public${exec.image}` : 'Transparent Cutout'}
            </span>
          </div>

          {/* Bottom subtle shadow ramp */}
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-ink to-transparent z-10 pointer-events-none" />
        </div>

        {/* Executive Info */}
        <div className="p-4 space-y-2">
          <div className="font-mono text-[9px] text-crimson font-bold uppercase tracking-wider">
            {exec.role}
          </div>
          <h4 className="font-display text-xl text-bone uppercase leading-none tracking-wide group-hover:text-crimson transition-colors">
            {exec.name}
          </h4>
          <div className="font-mono text-[10px] text-bone-dim border-b border-dotted border-bone/30 pb-2">
            {exec.division}
          </div>
          <p className="font-label text-[11px] text-bone/80 leading-snug">
            {exec.focus}
          </p>
        </div>
      </div>

      {/* Action / Contact Footer */}
      <div className="p-4 pt-0 space-y-2 font-mono text-[10px]">
        {exec.phone && (
          <div className="flex items-center gap-1.5">
            <a
              href={`tel:${exec.phoneRaw}`}
              className="flex-1 flex items-center justify-center gap-1.5 border border-crimson/80 bg-crimson/15 hover:bg-crimson hover:text-bone text-crimson py-1.5 px-2 font-bold transition-colors"
              title="Call Siddhartha Srivastava"
            >
              <Phone size={11} />
              <span>{exec.phone}</span>
            </a>
            <button
              onClick={handleCopyPhone}
              className="p-1.5 border border-bone/30 text-bone hover:border-bone hover:text-crimson transition-colors"
              title="Copy phone number"
            >
              {copiedPhone ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
            </button>
          </div>
        )}

        <a
          href={`mailto:${exec.email}?subject=%5BCelesteCon%2026%5D%20Attn:%20${encodeURIComponent(exec.name)}`}
          className={`w-full flex items-center justify-center gap-1.5 border py-1.5 px-2 font-bold transition-colors ${
            exec.phone
              ? 'border-bone/30 text-bone hover:border-bone hover:text-crimson'
              : 'border-crimson/80 bg-crimson/15 hover:bg-crimson hover:text-bone text-crimson'
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
          <p className="font-mono text-xs text-bone-dim max-w-md">
            Direct coordination desk for competition scrutiny, institutional delegations, event schedule synchronization, and emergency logistics.
          </p>
        </div>

        {/* 5 Exec Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {EXECUTIVES.map((exec, idx) => (
            <ExecCard key={exec.id} exec={exec} index={idx} />
          ))}
        </div>
      </div>

      {/* Communications Matrix & Faculty Section */}
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
            <dl className="p-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 font-mono text-[10.5px] tracking-[0.03em]">
              <dt className="text-crimson font-bold uppercase whitespace-nowrap">Primary POC</dt>
              <dd className="text-bone border-b border-dotted border-bone/40 pb-0.5">
                <a href="tel:+918929020721" className="hover:text-crimson font-bold transition-colors">
                  Siddhartha Srivastava (+91 89290 20721)
                </a>
              </dd>
              <dt className="text-crimson font-bold uppercase whitespace-nowrap">Central Email</dt>
              <dd className="text-bone border-b border-dotted border-bone/40 pb-0.5">
                <a href="mailto:aeross@dpsrkp.net" className="hover:text-crimson transition-colors">
                  aeross@dpsrkp.net
                </a>
              </dd>
              <dt className="text-crimson font-bold uppercase whitespace-nowrap">Instagram</dt>
              <dd className="text-bone border-b border-dotted border-bone/40 pb-0.5">
                <a
                  href="https://instagram.com/aerospace_society"
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
                  href="https://www.linkedin.com/company/aeross-dpsrkp"
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
                Delhi Public School, R.K. Puram<br />
                Sector-12, R.K. Puram, New Delhi – 110022
              </dd>
            </dl>
          </div>
        </div>

        {/* Right Column: Faculty Directory & Message Transmission */}
        <div className="space-y-6">
          <h3 className="font-display text-2xl md:text-3xl text-bone uppercase leading-none">
            Faculty Directory
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border-[1.5px] border-bone p-4 bg-ink/50">
              <div className="font-mono text-[10px] tracking-widest text-crimson uppercase font-bold mb-1">
                Teacher In-Charge
              </div>
              <div className="font-label font-bold text-lg text-bone uppercase tracking-widest">
                Ms. Vibha Arora
              </div>
              <div className="font-mono text-xs text-bone-dim mt-1">
                Physics Department
              </div>
            </div>
            <div className="border-[1.5px] border-bone p-4 bg-ink/50">
              <div className="font-mono text-[10px] tracking-widest text-crimson uppercase font-bold mb-1">
                Teacher In-Charge
              </div>
              <div className="font-label font-bold text-lg text-bone uppercase tracking-widest">
                Mr. Sanchit Chauhan
              </div>
              <div className="font-mono text-xs text-bone-dim mt-1">
                Physics Department
              </div>
            </div>
          </div>

          <div className="pt-2 border-t-[1.5px] border-bone/30">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-mono text-[10px] text-bone-dim tracking-[0.15em] uppercase font-bold">
                Send a dispatch to the Secretariat
              </h4>
              <span className="font-mono text-[9px] text-crimson uppercase font-bold">Quick Email</span>
            </div>
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
                <input
                  name="designation"
                  type="text"
                  required
                  placeholder="Your Name // Institution // Designation"
                  className="w-full bg-transparent border-[1.5px] border-bone/40 px-3 py-2 font-mono text-[11px] text-bone placeholder:text-bone/30 focus:outline-none focus:border-crimson transition-colors"
                />
              </div>
              <div>
                <textarea
                  name="message"
                  required
                  rows="3"
                  placeholder="Inquiry content, competition questions, or delegation notes..."
                  className="w-full bg-transparent border-[1.5px] border-bone/40 px-3 py-2 font-mono text-[11px] text-bone placeholder:text-bone/30 focus:outline-none focus:border-crimson transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full border-[1.5px] border-crimson bg-crimson text-bone-hi font-label font-bold text-sm uppercase tracking-widest py-2 hover:bg-transparent hover:text-crimson transition-colors flex items-center justify-center gap-2"
              >
                <Mail size={13} />
                <span>Transmit Dispatch</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
