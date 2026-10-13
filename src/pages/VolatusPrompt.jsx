import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const VALID_SECTIONS = ['brief', 'prompts', 'guide', 'checklist', 'rules'];

const HASH_MAP = {
  tracks: 'prompts',
  template: 'guide',
  cad: 'guide',
  rubrics: 'rules',
  format: 'brief',
  calc: 'brief'
};

const resolveSection = (raw) => {
  const h = (raw || '').replace('#', '').toLowerCase();
  const mapped = HASH_MAP[h] || h;
  return VALID_SECTIONS.includes(mapped) ? mapped : 'brief';
};

const RFPS = [
  {
    id: 's-ta',
    code: 'S-TA',
    trackName: 'Stratospheric & Martian Flight',
    title: 'Thin Air · Ultra-High Altitude Glider',
    meta: '25 kg MTOW · 28 m/s cruise · 18,000 m Stratosphere / Mars',
    aircraftType: 'Solar-Electric HAPS / Martian Exploration Glider',
    wingspan: '~12.0 – 16.0 m (High Aspect Ratio AR ≥ 22)',
    mtow: '≈ 25.0 kg',
    payload: '3.5 kg hyperspectral atmospheric sensor array',
    endurance: 'Day/night continuous cycle (Stratosphere) or 4-hour Martian glide',
    flightRegime: 'Ultra-low Reynolds number (Re ≈ 60,000–120,000), air density ρ ≈ 0.12 kg/m³',
    background:
      'Operating at 18 kilometres in Earth’s stratosphere or in the thin carbon dioxide atmosphere of Mars presents the same aerodynamic crucible: air density is less than 10% of sea level. Standard airfoils stall instantly. Thin Air is an ultra-lightweight, carbon-composite solar-electric glider designed to maintain level flight in near-vacuum conditions.',
    rfpSummary:
      'Engineer a High-Altitude Pseudo-Satellite (HAPS). Select specialized low-Reynolds-number laminar airfoils (e.g. Wortmann FX 63-137, Eppler E387, or Selig S1223), calculate wing structural flexure under aeroelastic loads, integrate flexible solar arrays, and prove full 3D CAD internal spar and rib architecture.',
    constraints: [
      'Wing loading strictly below 4.5 kg/m² to prevent excessive stall speeds in thin air.',
      'Aeroelastic rigidity: main spar design must withstand 3.5g gust load factor without flutter.',
      'Thermal operating range: avionics and battery insulation from -65°C to +40°C.',
      'Solar cell integration: minimum 3.0 m² monocrystalline solar array flush-mounted on upper wing skin.',
      'Center of Gravity (CG) margin: static longitudinal stability margin between 8% and 15% MAC.'
    ]
  },
  {
    id: 's-ch',
    code: 'S-CH',
    trackName: 'Hybrid Aerostat Logistics',
    title: 'Cloud Hauler · Heavy-Lift Mountain Cargo',
    meta: '6,000 kg MTOW · 22 m/s cruise · High Himalayas / Ladakh',
    aircraftType: 'Hybrid Aerostatic/Aerodynamic Cargo Lifter',
    wingspan: '~38.0 m overall length (Lifting Body + Helium Gasbags)',
    mtow: '≈ 6,000 kg (6.0 tonnes)',
    payload: '2,500 kg construction machinery or disaster relief goods',
    endurance: '≥ 8 hours continuous cruise',
    flightRegime: 'High-altitude mountain valleys (3,500 – 5,500 m MSL)',
    background:
      'High-altitude Himalayan mountain passes in Ladakh and Uttarakhand are blocked by snow six months a year. Conventional heavy helicopters suffer catastrophic payload penalties above 4,000 metres. Cloud Hauler is a hybrid lifting-body airship that derives 60% of its lift from buoyant helium aerostats and 40% from aerodynamic body lift generated during cruise flight.',
    rfpSummary:
      'Architect a heavy-lift hybrid freight transport. Compute aerostatic vs aerodynamic lift ratio, size four vectored-thrust turboprop or hybrid-electric nacelles for vertical landing (VTOL), design a lightweight truss airframe, and produce a complete 3D CAD model with cargo bay ramp and mooring masts.',
    constraints: [
      'Hybrid lift balance: 55–65% static buoyant lift via helium cells; remaining 35–45% aerodynamic lift.',
      'Vectored thrust: 4 x rotatable propulsion nacelles (±90° tilt) for hover and precision mountain station-keeping.',
      'Cargo bay dimensions: minimum 8.0 m length x 2.2 m width x 2.0 m height with rear ramp access.',
      'Ballast management: compressed air or water ballast system to offset payload drop without gas venting.',
      'Gust alleviation: active control surfaces capable of handling 40 knot mountain shear winds.'
    ]
  }
];

const CHECKLIST_ITEMS = [
  { id: 'v1', label: 'Technical Dossier PDF submitted with selectable text, numbered figures, and SI units.' },
  { id: 'v2', label: 'Page limit respected, counting every page including cover, contents, references, AI disclosure and declaration: max 25 pages.' },
  { id: 'v3', label: 'Selected case (Thin Air or Cloud Hauler) clearly declared in the executive summary.' },
  { id: 'v4', label: 'Airfoil section specified with NACA / Selig profile coordinates and Reynolds number rationale.' },
  { id: 'v5', label: 'Calculations ledger included: Lift, Drag, CL, CD, and Wing Loading (W/S).' },
  { id: 'v6', label: 'Weight & Balance spreadsheet: CG vs Neutral Point calculation with static longitudinal margin.' },
  { id: 'v7', label: '3D CAD model built in an approved program and submitted as .step, .stl, .f3d, .blend or native CAD archive.' },
  { id: 'v8', label: 'Clean assembly tree: proper component hierarchy, fasteners modeled, zero unconstrained floating parts.' },
  { id: 'v10', label: 'Powerplant & battery matching calculations: Motor KV, propeller pitch/diameter, voltage & flight endurance.' },
  { id: 'v11', label: 'Generative AI and external tools disclosed in the bibliography.' },
  { id: 'v12', label: 'PDF and CAD files uploaded to the official CelesteCon Submission Portal before 18 Oct, 11:59 PM IST.' }
];

export default function VolatusPrompt() {
  const [activeSection, setActiveSection] = useState(() => resolveSection(window.location.hash));
  const [selectedTrackId, setSelectedTrackId] = useState('s-ta');

  // Interactive preflight checklist state with localStorage (default empty)
  const [checkedItems, setCheckedItems] = useState(() => {
    try {
      const saved = localStorage.getItem('c26-volatus-checklist');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    const onHashChange = () => {
      setActiveSection(resolveSection(window.location.hash));
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleSectionChange = (secId) => {
    setActiveSection(secId);
    window.history.replaceState(null, '', `#${secId}`);
  };

  const toggleCheck = (id) => {
    setCheckedItems((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('c26-volatus-checklist', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const currentRfp = RFPS.find((r) => r.id === selectedTrackId) || RFPS[0];

  return (
    <div className="space-y-8 pb-16">
      {/* Top Breadcrumb & Status */}
      <div className="border-b-2 border-bone/30 pb-3 flex flex-wrap justify-between items-center gap-3 font-mono text-xs text-bone-dim">
        <div className="flex items-center gap-2 flex-wrap">
          <Link to="/" className="text-bone-dim hover:text-crimson">CELESTECON 2026</Link>
          <span>/</span>
          <Link to="/comps" className="text-bone-dim hover:text-crimson">COMPETITIONS</Link>
          <span>/</span>
          <Link to="/prompts" className="text-bone-dim hover:text-crimson">PROMPTS</Link>
          <span>/</span>
          <span className="text-crimson font-bold uppercase">EVENT 02 · VOLATUS</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/submissions" className="text-crimson font-bold uppercase tracking-widest text-[11px] flex items-center gap-1">
            <span>Submission Portal</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* Main Hero Header */}
      <div className="border-2 border-bone bg-ink p-6 sm:p-8 relative">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 relative z-10">
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold px-2 py-0.5 bg-cyan-600 text-bone-hi">
                EVENT 02 · VOLATUS
              </span>
              <span className="font-mono text-xs uppercase px-2 py-0.5 border border-bone/40 text-bone-dim">
                Aircraft Design &amp; 3D Prototyping
              </span>
              <span className="font-mono text-xs uppercase px-2 py-0.5 border border-bone/40 text-bone-dim">
                Senior Division (Grades 9–12)
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl text-bone uppercase tracking-wide leading-none">
              Volatus <span className="text-cyan-400">2026</span>
            </h1>

            <p className="font-label text-sm sm:text-base text-bone-dim leading-relaxed max-w-2xl">
              Design an aircraft that flies on paper, balances in CAD, and survives interrogation by aerospace engineers. Choose one of two cases. Submit a complete technical dossier alongside native 3D CAD assemblies (.step, .stl, .f3d, .blend). Shortlisted teams defend their models and prototypes live at DPS R.K. Puram on 24 October 2026.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => handleSectionChange('prompts')}
                className="px-5 py-2.5 bg-cyan-600 text-bone-hi font-label font-bold text-xs uppercase tracking-widest border border-cyan-600 cursor-pointer"
              >
                Inspect Prompts →
              </button>
              <button
                onClick={() => handleSectionChange('guide')}
                className="px-5 py-2.5 bg-ink-2 text-bone font-label font-bold text-xs uppercase tracking-widest border border-bone/40 cursor-pointer"
              >
                Proposal Guide
              </button>
              <button
                onClick={() => handleSectionChange('checklist')}
                className="px-5 py-2.5 bg-ink-2 text-bone font-label font-bold text-xs uppercase tracking-widest border border-bone/40 cursor-pointer"
              >
                Checklist
              </button>
            </div>
          </div>

          {/* Aside Telemetry Box */}
          <div className="w-full lg:w-80 bg-ink-2 p-5 border-2 border-bone/60 space-y-4 shrink-0">
            <div className="flex justify-between items-center text-xs font-mono border-b border-bone/20 pb-2">
              <span className="text-bone-dim uppercase">Dossier Window</span>
              <span className="font-bold text-cyan-400 uppercase">
                Round 1 Online
              </span>
            </div>

            <div className="p-3 bg-ink border border-bone/20 space-y-1 font-mono text-xs">
              <span className="text-bone-dim uppercase text-[10px] block">Round 1 Deadline</span>
              <strong className="text-bone text-sm block">18 Oct, 11:59 PM IST</strong>
              <span className="text-bone-dim text-[11px] block">Submit via Official Submission Portal</span>
            </div>

            <div className="space-y-1.5 font-mono text-[11px] text-bone-dim pt-2 border-t border-bone/20">
              <div className="flex justify-between">
                <span>Eligibility:</span>
                <strong className="text-bone">Grades 9–12</strong>
              </div>
              <div className="flex justify-between">
                <span>Team Size:</span>
                <strong className="text-bone">3 Members</strong>
              </div>
              <div className="flex justify-between">
                <span>Deliverable:</span>
                <strong className="text-bone">Technical Dossier (PDF) + 3D CAD</strong>
              </div>
              <div className="flex justify-between">
                <span>Round 2 Finale:</span>
                <strong className="text-cyan-400 font-bold">24 Oct · On Campus</strong>
              </div>
            </div>

            <Link
              to="/submissions"
              className="w-full py-2.5 bg-cyan-600 text-bone-hi font-label font-bold text-xs uppercase tracking-widest text-center border border-cyan-600 block"
            >
              Go to Submission Portal →
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="border-2 border-bone/60 bg-ink-2 p-1.5 flex flex-wrap gap-1.5 font-mono text-xs uppercase tracking-wider">
        {[
          { id: 'brief', label: '1 Event Brief' },
          { id: 'prompts', label: '2 Prompts' },
          { id: 'guide', label: '3 Proposal Guide' },
          { id: 'checklist', label: '4 Checklist' },
          { id: 'rules', label: '5 Rules' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleSectionChange(tab.id)}
            className={`flex-1 sm:flex-initial px-4 py-2 font-bold cursor-pointer text-center ${
              activeSection === tab.id
                ? 'bg-cyan-600 text-bone-hi'
                : 'text-bone-dim hover:text-bone hover:bg-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ======================================================== */}
      {/* SECTION 1: EVENT BRIEF */}
      {/* ======================================================== */}
      {activeSection === 'brief' && (
        <div className="space-y-8">
          <div className="border-2 border-bone/40 bg-ink p-6 sm:p-8 space-y-8">
            <div className="border-b border-bone/20 pb-4">
              <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest">Section 1 · Event Brief</span>
              <h2 className="font-display text-3xl sm:text-4xl text-bone uppercase tracking-wider mt-1">
                Aeronautical Engineering &amp; Prototyping
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-bone-dim leading-relaxed">
              <div className="space-y-4">
                <p className="text-bone font-medium text-base">
                  A wing that flies on paper is useless if the battery bay doesn&apos;t clear the main spar. A stunning 3D render is useless if the airfoil stalls at launch. <em>Volatus rewards the team that proves both.</em>
                </p>
                <p>
                  Volatus is open exclusively to Senior students (Grades 9–12). Teams consist of exactly 3 members from the same school, with one team allowed per school. Choose one of two challenging cases (Thin Air or Cloud Hauler) and engineer an airframe from first principles.
                </p>
              </div>

              <div className="space-y-4">
                <div className="border border-cyan-500/30 bg-cyan-500/5 p-4 space-y-2 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <span className="uppercase text-bone-dim font-bold">Eligibility &amp; Limits</span>
                    <span className="px-2 py-0.5 bg-cyan-600 text-bone-hi font-bold">GRADES 9–12</span>
                  </div>
                  <div className="font-display text-2xl text-bone uppercase">
                    Maximum <span className="text-cyan-400">25 Pages</span> Limit
                  </div>
                  <p className="font-sans text-xs text-bone-dim leading-relaxed">
                    Counting every page, including cover, contents, references, AI disclosure and declaration. In Round 1, submit your Technical Dossier PDF together with native 3D CAD files (.step, .stl, .f3d, .blend, or native archive).
                  </p>
                </div>
              </div>
            </div>

            {/* Key Dates Block */}
            <div className="border border-bone/20 bg-ink-2 p-5 space-y-3 font-mono text-xs">
              <span className="text-amber-400 font-bold uppercase block">// Key Dates</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-ink border border-bone/20">
                  <span className="text-bone-dim block text-[10px]">13 Oct</span>
                  <strong className="text-bone block mt-0.5">Round 1 Opens</strong>
                </div>
                <div className="p-3 bg-cyan-600/10 border border-cyan-600">
                  <span className="text-cyan-400 block text-[10px]">18 Oct, 11:59 PM IST</span>
                  <strong className="text-bone block mt-0.5">Round 1 Submission Deadline</strong>
                </div>
                <div className="p-3 bg-ink border border-bone/20">
                  <span className="text-bone-dim block text-[10px]">20 Oct</span>
                  <strong className="text-bone block mt-0.5">Shortlist Announced</strong>
                </div>
                <div className="p-3 bg-ink border border-bone/20">
                  <span className="text-bone-dim block text-[10px]">24 Oct</span>
                  <strong className="text-bone block mt-0.5">Finale at DPS R.K. Puram (Report 07:45–08:45 AM)</strong>
                </div>
              </div>
            </div>

            {/* Competition Progression: Round 1 & Round 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Round 1 Card */}
              <div className="border border-bone/30 bg-ink-2 p-5 space-y-3">
                <div className="flex justify-between items-center border-b border-bone/20 pb-2 font-mono text-xs">
                  <span className="font-bold px-2 py-0.5 bg-cyan-600 text-bone-hi">ROUND 1 · ONLINE</span>
                  <span className="text-amber-400 font-bold">18 OCT, 11:59 PM IST</span>
                </div>
                <h3 className="font-display text-xl text-bone uppercase">Technical Proposal &amp; 3D CAD Package</h3>
                <ul className="space-y-2 font-mono text-xs text-bone-dim">
                  <li><strong className="text-bone">Dossier PDF:</strong> Max 25 pages, counting every page including cover and end-matter.</li>
                  <li><strong className="text-bone">CAD Files:</strong> Standard export (<span className="text-cyan-400">.step, .stl, .f3d, .blend</span>) or native CAD archive.</li>
                  <li><strong className="text-bone">Calculations Ledger:</strong> Mass budget, aerodynamic drag polar, motor &amp; battery runtimes.</li>
                </ul>
              </div>

              {/* Round 2 Card */}
              <div className="border border-bone/30 bg-ink-2 p-5 space-y-3">
                <div className="flex justify-between items-center border-b border-bone/20 pb-2 font-mono text-xs">
                  <span className="font-bold px-2 py-0.5 border border-bone text-bone">ROUND 2 · ONSITE</span>
                  <span className="text-green-400 font-bold">24 OCT · DPS R.K. PURAM</span>
                </div>
                <h3 className="font-display text-xl text-bone uppercase">Exhibition Booth &amp; Live Jury Review</h3>
                <ul className="space-y-2 font-mono text-xs text-bone-dim">
                  <li><strong className="text-bone">Exhibition Booth:</strong> Shortlisted teams receive dedicated booth space to exhibit models and designs.</li>
                  <li><strong className="text-bone">Physical Prototypes:</strong> 3D-printed scale models, airframe skeletons, or RC demonstrators strongly encouraged.</li>
                  <li><strong className="text-bone">Live CAD Sectioning:</strong> Jurors inspect digital CAD models on your laptops and ask for real-time section cuts.</li>
                  <li><strong className="text-bone">Whiteboard Defence:</strong> Defend airfoil selection, Reynolds number matching, and structural load paths.</li>
                </ul>
              </div>
            </div>

            {/* POC and Links */}
            <div className="pt-2 flex flex-wrap justify-between items-center gap-4 font-mono text-xs">
              <div className="text-bone-dim">
                Event Lead: <strong className="text-bone">Tarushi Tomar</strong> (<a href="mailto:r24564tarushi@dpsrkp.net" className="text-cyan-400 hover:underline">r24564tarushi@dpsrkp.net</a>) · <a href="mailto:aeross@dpsrkp.net" className="text-bone hover:underline">aeross@dpsrkp.net</a>
              </div>
              <div className="flex gap-3">
                <Link to="/comps" className="px-4 py-2 border border-bone/40 text-bone uppercase">
                  ← Back to Comps
                </Link>
                <Link to="/submissions" className="px-5 py-2 bg-cyan-600 text-bone-hi font-bold border border-cyan-600 uppercase">
                  Go to Submission Portal →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 2: PROMPTS */}
      {/* ======================================================== */}
      {activeSection === 'prompts' && (
        <div className="space-y-6">
          {/* Prompt Selector Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
            {RFPS.map((rfp) => (
              <button
                key={rfp.id}
                onClick={() => setSelectedTrackId(rfp.id)}
                className={`p-4 border text-left cursor-pointer ${
                  selectedTrackId === rfp.id
                    ? 'bg-ink border-cyan-400'
                    : 'bg-ink-2 border-bone/30 text-bone-dim hover:text-bone hover:border-bone/60'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-cyan-400">{rfp.code}</span>
                  <span className="text-[10px] text-bone-dim uppercase">{rfp.trackName}</span>
                </div>
                <div className="font-display text-lg text-bone uppercase leading-tight">{rfp.title}</div>
                <div className="text-[11px] text-bone-dim mt-1">{rfp.meta}</div>
              </button>
            ))}
          </div>

          {/* Detailed Prompt Brief */}
          <div className="border-2 border-bone bg-ink p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-bone/20 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-cyan-600 text-bone-hi">{currentRfp.code}</span>
                  <span className="font-mono text-xs uppercase px-2 py-0.5 border border-bone/40 text-bone-dim">
                    {currentRfp.aircraftType}
                  </span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl text-bone uppercase tracking-wider">
                  {currentRfp.title}
                </h2>
              </div>
              <div className="text-right font-mono text-xs text-bone-dim">
                <div>MTOW: <strong className="text-cyan-400">{currentRfp.mtow}</strong></div>
                <div>Wingspan: <strong className="text-bone">{currentRfp.wingspan}</strong></div>
              </div>
            </div>

            {/* Spec Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="bg-ink-2 p-3 border border-bone/20">
                <span className="text-bone-dim text-[10px] uppercase block">Wingspan / Geometry</span>
                <strong className="text-bone">{currentRfp.wingspan}</strong>
              </div>
              <div className="bg-ink-2 p-3 border border-bone/20">
                <span className="text-bone-dim text-[10px] uppercase block">Take-Off Mass (MTOW)</span>
                <strong className="text-bone">{currentRfp.mtow}</strong>
              </div>
              <div className="bg-ink-2 p-3 border border-bone/20">
                <span className="text-bone-dim text-[10px] uppercase block">Payload Capacity</span>
                <strong className="text-cyan-400">{currentRfp.payload}</strong>
              </div>
              <div className="bg-ink-2 p-3 border border-bone/20">
                <span className="text-bone-dim text-[10px] uppercase block">Flight Endurance</span>
                <strong className="text-bone">{currentRfp.endurance}</strong>
              </div>
            </div>

            <div className="space-y-3 font-label text-sm text-bone-dim leading-relaxed">
              <h3 className="font-mono text-xs uppercase tracking-widest text-bone font-bold">// Mission Background</h3>
              <p>{currentRfp.background}</p>
              <h3 className="font-mono text-xs uppercase tracking-widest text-bone font-bold pt-2">// Engineering Mandate</h3>
              <p>{currentRfp.rfpSummary}</p>
            </div>

            {/* Constraints */}
            <div className="border border-bone/30 bg-ink-2 p-5 space-y-3">
              <h3 className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-bold">
                Binding Mission Constraints
              </h3>
              <ul className="space-y-2 font-mono text-xs text-bone-dim">
                {currentRfp.constraints.map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">▶</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 3: PROPOSAL GUIDE */}
      {/* ======================================================== */}
      {activeSection === 'guide' && (
        <div className="space-y-8">
          <div className="border-2 border-bone/40 bg-ink p-6 sm:p-8 space-y-6">
            <div className="border-b border-bone/20 pb-4">
              <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest">Section 3 · Proposal Guide</span>
              <h2 className="font-display text-3xl sm:text-4xl text-bone uppercase tracking-wider mt-1">
                Dossier Structure &amp; 3D CAD Requirements
              </h2>
            </div>

            <p className="font-label text-sm text-bone-dim leading-relaxed max-w-3xl">
              Structure your dossier logically from executive summary to calculations and citations. Page limit strictly capped at 25 pages, counting every page including cover, contents, references, AI disclosure and declaration.
            </p>

            {/* 3D CAD model (Dimension III) Block */}
            <div className="border-2 border-cyan-500/40 bg-ink-2 p-6 space-y-4 font-mono text-xs">
              <div className="border-b border-bone/20 pb-3">
                <span className="text-cyan-400 uppercase font-bold tracking-widest text-xs block">Technical Specification</span>
                <h3 className="text-xl font-bold uppercase text-bone mt-0.5">3D CAD Model (Dimension III)</h3>
                <p className="text-bone-dim font-sans text-xs mt-1">
                  Dimension III digital prototyping is fully integrated into Volatus. Jurors evaluate the 3D model on parametric hygiene, realistic mechanical fasteners, material density assignment, and assembly hierarchy.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-ink border border-bone/20 space-y-1.5">
                  <strong className="text-bone uppercase block">Approved Software</strong>
                  <p className="text-bone-dim font-sans text-xs">
                    Autodesk Fusion 360, SolidWorks, Blender, Onshape, AutoCAD, OpenVSP, FreeCAD.
                  </p>
                </div>

                <div className="p-4 bg-ink border border-bone/20 space-y-1.5">
                  <strong className="text-bone uppercase block">Accepted File Formats</strong>
                  <p className="text-bone-dim font-sans text-xs">
                    .step, .stl, .f3d, .blend, or a native CAD archive.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="border border-bone/20 bg-ink p-4 space-y-2">
                  <span className="text-cyan-400 font-bold text-sm block">1. Clean Assembly Tree</span>
                  <p className="text-[11px] text-bone-dim font-sans leading-relaxed">
                    Proper sub-assembly hierarchy: Fuselage, Wing Structure (spars, ribs, skin), Propulsion &amp; Nacelles, Avionics Bay, and Landing Gear. Zero unconstrained floating parts.
                  </p>
                </div>

                <div className="border border-bone/20 bg-ink p-4 space-y-2">
                  <span className="text-cyan-400 font-bold text-sm block">2. Fasteners &amp; Hardware</span>
                  <p className="text-[11px] text-bone-dim font-sans leading-relaxed">
                    Model real mechanical fasteners (M2/M3 bolts, threaded inserts, hinges, control horns, pushrods). No impossible glued joints or magical solid bodies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 4: CHECKLIST */}
      {/* ======================================================== */}
      {activeSection === 'checklist' && (
        <div className="space-y-8">
          <div className="border-2 border-bone/40 bg-ink p-6 sm:p-8 space-y-6">
            <div className="border-b border-bone/20 pb-4">
              <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest">Section 4 · Checklist</span>
              <h2 className="font-display text-3xl sm:text-4xl text-bone uppercase tracking-wider mt-1">
                Preflight Submission Checklist
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {CHECKLIST_ITEMS.map((item) => (
                <label
                  key={item.id}
                  className={`p-3.5 border cursor-pointer flex items-start gap-3 select-none ${
                    checkedItems[item.id]
                      ? 'border-bone/20 bg-ink-2/40 text-bone-dim'
                      : 'border-bone bg-ink-2 text-bone'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!checkedItems[item.id]}
                    onChange={() => toggleCheck(item.id)}
                    className="mt-0.5 accent-cyan-500 cursor-pointer"
                  />
                  <span className={`font-mono text-xs leading-relaxed ${checkedItems[item.id] ? 'line-through text-bone-dim/60' : ''}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>

            <div className="pt-4 border-t border-bone/20 flex flex-wrap justify-between items-center gap-4">
              <span className="font-mono text-xs text-bone-dim">
                Verify all technical deliverables before final deposit.
              </span>
              <Link
                to="/submissions"
                className="px-6 py-2.5 bg-cyan-600 text-bone-hi font-mono text-xs font-bold uppercase tracking-wider border border-cyan-600"
              >
                Go to Submission Portal →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 5: RULES */}
      {/* ======================================================== */}
      {activeSection === 'rules' && (
        <div className="space-y-8">
          <div className="border-2 border-bone/40 bg-ink p-6 sm:p-8 space-y-6">
            <div className="border-b border-bone/20 pb-4">
              <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest">Section 5 · Rules</span>
              <h2 className="font-display text-3xl sm:text-4xl text-bone uppercase tracking-wider mt-1">
                Competition Rules &amp; Evaluation Criteria
              </h2>
            </div>

            {/* General Rules */}
            <div className="border border-bone/20 bg-ink-2 p-5 space-y-3 font-mono text-xs">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 border-b border-bone/20 pb-2">
                General Competition Rules
              </h3>
              <ul className="space-y-2 text-bone-dim text-xs leading-relaxed list-disc pl-4 font-sans">
                <li>Teams register through their school's delegation. Registration closed on 12 Oct; no additions after that.</li>
                <li>Late submissions are not accepted.</li>
                <li>Shortlisted teams report to the Welcome Foyer at DPS R.K. Puram between 07:45 and 08:45 AM on 24 Oct. Late arrivals may lose their slot.</li>
                <li>Bring your own laptop, charger and adapters, fully charged. Power outlets are provided. The host school is not liable for personal hardware. Bring your own internet connection.</li>
                <li>Judges' decisions are final. Disrespect towards judges or marshals leads to disqualification.</li>
                <li>DPS R.K. Puram teams take part for benchmarking only and are not eligible for rankings or trophies.</li>
              </ul>
            </div>

            {/* AI Disclosure */}
            <div className="border border-bone/20 bg-ink-2 p-5 space-y-2 font-mono text-xs">
              <strong className="text-cyan-400 block uppercase tracking-wider text-sm">
                Academic Integrity &amp; Generative AI Policy
              </strong>
              <p className="text-bone-dim font-sans text-xs leading-relaxed">
                Generative AI tools may be used as research and editing assistants only. All core calculations, mass budgets, aerodynamic trade-offs, and 3D CAD assemblies must be original student work. Disclose all external software and AI usage in the bibliography. Submitting unverified AI hallucinations or imported pre-made CAD models without parametric history will lead to disqualification.
              </p>
            </div>

            {/* Judging Criteria */}
            <div className="space-y-3 font-mono text-xs">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 border-b border-bone/20 pb-2">
                How you're judged
              </h3>
              <div className="space-y-3">
                <div className="p-3.5 bg-ink-2 border border-bone/20 space-y-1">
                  <strong className="text-bone text-sm block">Research &amp; technical understanding</strong>
                  <p className="text-bone-dim font-sans leading-relaxed">
                    Depth of literature review, grounding in aeronautical physics, and understanding of the operational flight regime.
                  </p>
                </div>
                <div className="p-3.5 bg-ink-2 border border-bone/20 space-y-1">
                  <strong className="text-bone text-sm block">Aerodynamic feasibility, airfoil selection and sizing calculations</strong>
                  <p className="text-bone-dim font-sans leading-relaxed">
                    Lift and drag estimation, Reynolds number matching, wing loading, power/energy budget, and stall speed margins.
                  </p>
                </div>
                <div className="p-3.5 bg-ink-2 border border-bone/20 space-y-1">
                  <strong className="text-bone text-sm block">Relevance to the assigned case study</strong>
                  <p className="text-bone-dim font-sans leading-relaxed">
                    Fulfillment of binding mission constraints, payload capacity, operational altitude, and mission endurance.
                  </p>
                </div>
                <div className="p-3.5 bg-ink-2 border border-bone/20 space-y-1">
                  <strong className="text-bone text-sm block">Structural detailing &amp; 3D CAD model</strong>
                  <p className="text-bone-dim font-sans leading-relaxed">
                    Clean assembly hierarchy, realistic mechanical fasteners, material choices, tolerances, and packaging.
                  </p>
                </div>
                <div className="p-3.5 bg-ink-2 border border-bone/20 space-y-1">
                  <strong className="text-bone text-sm block">Quality of presentation &amp; exhibit</strong>
                  <p className="text-bone-dim font-sans leading-relaxed">
                    Clarity of the technical dossier layout, craftsmanship of scale models/prototypes, and booth display quality in Round 2.
                  </p>
                </div>
                <div className="p-3.5 bg-ink-2 border border-bone/20 space-y-1">
                  <strong className="text-bone text-sm block">Defence of design choices &amp; answering questions</strong>
                  <p className="text-bone-dim font-sans leading-relaxed">
                    Handling jury cross-examination, whiteboard derivations, trade-off justifications, and live CAD model section cuts.
                  </p>
                </div>
              </div>
            </div>

            {/* POC and Links */}
            <div className="pt-2 flex flex-wrap justify-between items-center gap-4 font-mono text-xs">
              <div className="text-bone-dim">
                Event Lead: <strong className="text-bone">Tarushi Tomar</strong> (<a href="mailto:r24564tarushi@dpsrkp.net" className="text-cyan-400 hover:underline">r24564tarushi@dpsrkp.net</a>) · <a href="mailto:aeross@dpsrkp.net" className="text-bone hover:underline">aeross@dpsrkp.net</a>
              </div>
              <div className="flex gap-3">
                <Link to="/comps" className="px-4 py-2 border border-bone/40 text-bone uppercase">
                  ← Back to Comps
                </Link>
                <Link to="/submissions" className="px-5 py-2 bg-cyan-600 text-bone-hi font-bold border border-cyan-600 uppercase">
                  Go to Submission Portal →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
