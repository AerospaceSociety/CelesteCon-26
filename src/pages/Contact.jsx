import React from 'react';
import SectionHeader from '../components/SectionHeader';

const Contact = () => {
  return (
    <div className="max-w-4xl">
      <SectionHeader section="07" title="Communications" jp="お問い合わせ" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
        <div>
          <h3 className="font-display text-2xl md:text-3xl text-bone uppercase leading-none mb-6">
            Direct Line
          </h3>
          <p className="font-label text-base text-bone-dim mb-8 leading-relaxed">
            For sponsorship inquiries, institutional registrations, or general event operations, our communications desk is active.
          </p>

          <div className="border-2 border-bone">
            <div className="bg-bone text-ink font-mono text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 flex justify-between font-bold">
              <span>Primary Contacts</span>
            </div>
            <dl className="p-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 font-mono text-[10.5px] tracking-[0.03em]">
              <dt className="text-crimson font-bold uppercase whitespace-nowrap">Email</dt>
              <dd className="text-bone border-b border-dotted border-bone/40 pb-0.5"><a href="mailto:aeross@dpsrkp.net" className="hover:text-crimson transition-colors">aeross@dpsrkp.net</a></dd>
              <dt className="text-crimson font-bold uppercase whitespace-nowrap">Instagram</dt>
              <dd className="text-bone border-b border-dotted border-bone/40 pb-0.5"><a href="https://instagram.com/aerospace_society" target="_blank" rel="noopener noreferrer" className="hover:text-crimson transition-colors">@aerospace_society</a></dd>
              <dt className="text-crimson font-bold uppercase whitespace-nowrap">LinkedIn</dt>
              <dd className="text-bone border-b border-dotted border-bone/40 pb-0.5">Aeross: Aerospace Society</dd>
              <dt className="text-crimson font-bold uppercase whitespace-nowrap">Location</dt>
              <dd className="text-bone border-b border-dotted border-bone/40 pb-0.5 leading-relaxed">Delhi Public School, R.K. Puram<br/>Sector-12, R.K. Puram<br/>New Delhi – 110022</dd>
            </dl>
          </div>
        </div>

        <div>
          <h3 className="font-display text-2xl md:text-3xl text-bone uppercase leading-none mb-6">
            Faculty Directory
          </h3>
          <div className="space-y-4">
            <div className="border-[1.5px] border-bone p-4">
              <div className="font-mono text-[10px] tracking-widest text-crimson uppercase font-bold mb-1">Teacher In-Charge</div>
              <div className="font-label font-bold text-lg text-bone uppercase tracking-widest">Ms. Vibha Arora</div>
              <div className="font-mono text-xs text-bone-dim mt-1">Physics Department</div>
            </div>
            <div className="border-[1.5px] border-bone p-4">
              <div className="font-mono text-[10px] tracking-widest text-crimson uppercase font-bold mb-1">Teacher In-Charge</div>
              <div className="font-label font-bold text-lg text-bone uppercase tracking-widest">Mr. Sanchit Chauhan</div>
              <div className="font-mono text-xs text-bone-dim mt-1">Physics Department</div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t-[1.5px] border-bone/30">
            <h4 className="font-mono text-[10px] text-bone-dim tracking-[0.15em] uppercase font-bold mb-3">Send a dispatch</h4>
            <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); window.location.href = 'mailto:aeross@dpsrkp.net'; }}>
              <div>
                <input type="text" placeholder="Your Designation // Institution" className="w-full bg-transparent border-[1.5px] border-bone/40 px-3 py-2 font-mono text-[11px] text-bone placeholder:text-bone/30 focus:outline-none focus:border-crimson transition-colors" />
              </div>
              <div>
                <textarea rows="3" placeholder="Message content..." className="w-full bg-transparent border-[1.5px] border-bone/40 px-3 py-2 font-mono text-[11px] text-bone placeholder:text-bone/30 focus:outline-none focus:border-crimson transition-colors resize-none"></textarea>
              </div>
              <button type="submit" className="w-full border-[1.5px] border-crimson bg-crimson text-bone-hi font-label font-bold text-sm uppercase tracking-widest py-2 hover:bg-transparent hover:text-crimson transition-colors">
                Transmit Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
