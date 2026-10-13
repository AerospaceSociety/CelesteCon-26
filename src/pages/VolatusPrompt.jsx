import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

const R1_DEADLINE = new Date('2026-10-18T23:59:00+05:30').getTime();
const VALID_SECTIONS = ['brief', 'format', 'tracks', 'cad', 'calc', 'checklist', 'rules'];

const JUNIOR_RFPS = [
  {
    id: 'j-fm',
    code: 'J-FM',
    trackName: 'Biomimetic Flight',
    title: 'Flockmate · Urban Biomimetic UAV',
    meta: '400 g take-off mass · 14 m/s cruise · Delhi Rooftops',
    aircraftType: 'Flapping-Wing Ornithopter / Biomimetic Scout',
    wingspan: '~0.65 – 0.85 m',
    mtow: '≈ 400 g (0.4 kg)',
    payload: '40 g HD micro-sensor gimbal & bird deterrent emitter',
    endurance: '≥ 25 minutes continuous patrol',
    flightRegime: 'Low altitude urban boundary layer (0 – 120 m AGL)',
    background:
      'Birds in urban skies navigate turbulent building wakes, thermal plumes, and wires effortlessly. Flockmate is an autonomous biomimetic flapping-wing drone designed to mimic rock pigeons. Its mission: fly alongside real flocks without causing distress, monitor avian diseases, and deter birds from airport approach runways using non-harmful acoustic patterns.',
    rfpSummary:
      'Design a lightweight ornithopter that matches avian wing kinematics. Calculate flapping frequency, stroke angle, lift-to-thrust coupling, and integrate micro-servos, gearboxes, carbon-fiber wing ribs, and elastic membrane wing skins into an ultra-compact CAD airframe.',
    constraints: [
      'Maximum take-off mass strictly capped at 500 grams.',
      'Flapping kinematics: dual-action flapping-stroke mechanism with passive pitch rotation.',
      'Acoustic signature: low noise emission under 55 dBA at 10 metres.',
      'Battery safety: single 2S/3S LiPo pack fully enclosed in a fire-retardant fuselage compartment.',
      'Fail-safe glide mode: auto-lock wings in dihedral position for unpowered gliding in case of motor failure.'
    ]
  },
  {
    id: 'j-fl',
    code: 'J-FL',
    trackName: 'Disaster Logistics',
    title: 'Floodline · Amphibious Aid Courier',
    meta: '5 kg MTOW · 18 m/s cruise · Brahmaputra River Islands',
    aircraftType: 'Amphibious Fixed-Wing Aid Delivery UAV',
    wingspan: '~1.8 – 2.2 m',
    mtow: '≈ 5.0 kg',
    payload: '1.0 kg emergency medical supplies, water purifiers & blood bags',
    endurance: '≥ 60 minutes (35+ km mission radius)',
    flightRegime: 'Sub-tropical monsoon, rain-resistant IP54 airframe',
    background:
      'During monsoon floods in the Brahmaputra river basin, isolated island settlements (Chars) are cut off from medical supplies. Roads are submerged and power boats take hours against swollen currents. Floodline is an amphibious, twin-motor fixed-wing drone engineered to take off from wet launch pads, navigate monsoon winds, and parachute-drop emergency supplies before landing safely on water.',
    rfpSummary:
      'Design a durable amphibious cargo aircraft. Calculate wing area for high lift at low speeds, size twin electric tractor motors, design sealed waterproof electronics bays with watertight silicone gaskets, and model an automated belly release hatch for cargo pods.',
    constraints: [
      'Water ingress protection: IP54 or higher for all internal avionics and battery compartments.',
      'Payload bay: modular drop mechanism capable of deploying 1 kg pods via parachute.',
      'Stall speed must not exceed 10 m/s for safe emergency water ditching.',
      'Power: swappable 4S/6S Li-Ion or LiPo pack with real-world telemetry voltage monitoring.',
      'Corrosion resistance: sealed carbon and marine-grade stainless hardware.'
    ]
  }
];

const SENIOR_RFPS = [
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
  { id: 'v1', label: 'Dossier PDF submitted with selectable text, numbered figures, and SI units.' },
  { id: 'v2', label: 'Page limits respected: Junior max 20 pages · Senior max 25 pages.' },
  { id: 'v3', label: 'Selected RFP from team’s own division clearly declared in executive summary.' },
  { id: 'v4', label: 'Airfoil section specified with NACA / Selig profile coordinates and Reynolds number rationale.' },
  { id: 'v5', label: 'Complete aerodynamic sizing calculation table: Lift, Drag, CL, CD, Wing Loading (W/S).' },
  { id: 'v6', label: 'Weight & Balance spreadsheet: CG vs Neutral Point calculation with static margin.' },
  { id: 'v7', label: 'Native 3D CAD assembly file submitted (.step / .stl / .f3d / .blend).' },
  { id: 'v8', label: 'Assembly tree clean: parts grouped, clear component hierarchy, zero unconstrained floating parts.' },
  { id: 'v9', label: '3-View orthographic engineering blueprint included with overall dimensions in millimetres.' },
  { id: 'v10', label: 'Powerplant & battery matching calculations: Motor KV, propeller pitch/diameter, voltage & flight endurance.' },
  { id: 'v11', label: 'Generative AI and parametric CAD tools disclosed in the bibliography.' },
  { id: 'v12', label: 'Uploaded to official CelesteCon Submission Portal before 18 Oct 23:59:59 IST.' }
];

export default function VolatusPrompt() {
  const [activeSection, setActiveSection] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return VALID_SECTIONS.includes(hash) ? hash : 'brief';
  });

  const [division, setDivision] = useState('senior');
  const [selectedTrackId, setSelectedTrackId] = useState('s-ta');

  // Interactive Aerodynamic Sizing Lab State
  const [calcInputs, setCalcInputs] = useState({
    mass: '5.0',
    wingspan: '2.0',
    chord: '0.25',
    velocity: '18.0',
    altitude: '0'
  });

  // Interactive Preflight Checklist State
  const [checkedItems, setCheckedItems] = useState(() => {
    try {
      const saved = localStorage.getItem('c26-volatus-checklist');
      return saved ? JSON.parse(saved) : { v1: true, v2: true };
    } catch {
      return { v1: true, v2: true };
    }
  });

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, isLive: true });

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const diff = Math.max(0, R1_DEADLINE - now);
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      setTimeLeft({ days: d, hours: h, minutes: m, isLive: diff > 0 });
    };
    update();
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (VALID_SECTIONS.includes(hash)) {
        setActiveSection(hash);
      }
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
      } catch { }
      return updated;
    });
  };

  const resetChecklist = () => {
    setCheckedItems({});
    try {
      localStorage.setItem('c26-volatus-checklist', JSON.stringify({}));
    } catch { }
  };

  // Aerodynamic sizing math
  const aeroResults = useMemo(() => {
    const m = parseFloat(calcInputs.mass) || 1;
    const b = parseFloat(calcInputs.wingspan) || 1;
    const c = parseFloat(calcInputs.chord) || 0.2;
    const V = parseFloat(calcInputs.velocity) || 10;
    const alt = parseFloat(calcInputs.altitude) || 0;

    // ISA density approximation (kg/m³)
    const rho = Math.max(0.05, 1.225 * Math.exp(-alt / 8500));
    const W = m * 9.80665; // Weight in N
    const S = b * c; // Wing area m²
    const AR = (b * b) / S; // Aspect ratio
    const wingLoading = m / S; // kg/m²

    // Required cruise lift coefficient: L = W = 0.5 * rho * V^2 * S * CL => CL = 2W / (rho * V^2 * S)
    const q = 0.5 * rho * V * V; // Dynamic pressure Pa
    const requiredCL = q * S > 0 ? W / (q * S) : 0;

    // Reynolds number: Re = rho * V * c / mu (mu ≈ 1.8e-5 Pa·s)
    const Re = (rho * V * c) / 1.8e-5;

    // Estimated stall speed assuming max CL = 1.3
    const Vstall = Math.sqrt((2 * W) / (rho * S * 1.3));

    return {
      rho: rho.toFixed(3),
      W: W.toFixed(1),
      S: S.toFixed(2),
      AR: AR.toFixed(1),
      wingLoading: wingLoading.toFixed(1),
      requiredCL: requiredCL.toFixed(3),
      Re: Math.round(Re).toLocaleString(),
      Vstall: Vstall.toFixed(1),
      isFeasible: requiredCL > 0.15 && requiredCL < 1.1
    };
  }, [calcInputs]);

  const activeRfps = division === 'junior' ? JUNIOR_RFPS : SENIOR_RFPS;
  const currentRfp = activeRfps.find((r) => r.id === selectedTrackId) || activeRfps[0];

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Top Breadcrumb & Status */}
      <div className="border-b-2 border-bone/30 pb-3 flex flex-wrap justify-between items-center gap-3 font-mono text-xs text-bone-dim">
        <div className="flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-crimson transition-colors">CELESTECON 2026</Link>
          <span>/</span>
          <Link to="/comps" className="hover:text-crimson transition-colors">COMPETITIONS</Link>
          <span>/</span>
          <Link to="/prompts" className="hover:text-crimson transition-colors">PROMPTS</Link>
          <span>/</span>
          <span className="text-crimson font-bold uppercase">EVENT 02 · VOLATUS</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/submissions" className="text-crimson hover:text-bone transition-colors font-bold uppercase tracking-widest text-[11px] flex items-center gap-1">
            <span>Submission Vault</span>
            <span>→</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-cyan-400 uppercase font-bold text-[10px] tracking-wider">CAD DOSSIER LIVE</span>
          </div>
        </div>
      </div>

      {/* Main Hero Header */}
      <div className="border-2 border-bone bg-ink p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-28 -mt-28"></div>

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
                Incorporating Dimension III
              </span>
              <span className="font-mono text-xs uppercase px-2.5 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/40 font-bold">
                ● 4 RFPs ACTIVE
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl text-bone uppercase tracking-wide leading-none">
              Volatus <span className="text-cyan-400">2026</span>
            </h1>

            <div className="p-3 bg-cyan-500/10 border-l-4 border-cyan-500 font-mono text-xs sm:text-sm text-bone">
              <span className="text-cyan-400 font-bold uppercase tracking-widest block mb-0.5">
                // DA VINCI AVIATION MOTTO
              </span>
              <span className="font-display text-xl sm:text-2xl text-bone uppercase tracking-wider">
                &ldquo;Once you have tasted flight, you will forever walk the earth with your eyes turned skyward.&rdquo;
              </span>
            </div>

            <p className="font-label text-sm sm:text-base text-bone-dim leading-relaxed max-w-2xl">
              Design an aircraft that flies on paper, balances in CAD, and survives interrogation by aerospace engineers. Choose one of four mission RFPs across Junior &amp; Senior divisions (Flockmate, Floodline, Thin Air, and Cloud Hauler). Submit a complete technical dossier alongside native 3D CAD assemblies (.step, .stl, .f3d, .blend). Shortlisted teams defend their models and prototypes live at DPS R.K. Puram on 24 October 2026.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => handleSectionChange('tracks')}
                className="px-5 py-2.5 bg-cyan-600 text-bone-hi font-label font-bold text-xs uppercase tracking-widest border border-cyan-600 hover:bg-ink hover:text-cyan-400 transition-all cursor-pointer shadow-md"
              >
                Inspect 4 Mission RFPs →
              </button>
              <button
                onClick={() => handleSectionChange('calc')}
                className="px-5 py-2.5 bg-ink-2 text-bone font-label font-bold text-xs uppercase tracking-widest border border-bone/40 hover:border-cyan-400 hover:text-cyan-400 transition-all cursor-pointer"
              >
                Aerodynamic Sizing Lab
              </button>
              <button
                onClick={() => handleSectionChange('cad')}
                className="px-5 py-2.5 bg-ink-2 text-bone font-label font-bold text-xs uppercase tracking-widest border border-bone/40 hover:border-bone transition-all cursor-pointer"
              >
                CAD &amp; Dimension III Specs
              </button>
            </div>
          </div>

          {/* Aside Telemetry Box */}
          <div className="w-full lg:w-80 bg-ink-2 p-5 border-2 border-bone/60 space-y-4 shrink-0 shadow-xl">
            <div className="flex justify-between items-center text-xs font-mono border-b border-bone/20 pb-2">
              <span className="text-bone-dim uppercase">Round 1 Dossier Window</span>
              <span className="font-bold text-cyan-400 uppercase">
                {timeLeft.isLive ? '● SUBMISSIONS OPEN' : 'WINDOW CONCLUDED'}
              </span>
            </div>

            <div className="space-y-1">
              <span className="font-mono text-[10px] text-bone-dim uppercase block">
                Deadline: 18 Oct 23:59:59 IST
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-center font-mono">
                <div className="bg-ink p-2 border border-bone/20">
                  <span className="text-xl font-bold text-bone block leading-tight">{timeLeft.days}</span>
                  <span className="text-[9px] text-bone-dim uppercase">Days Left</span>
                </div>
                <div className="bg-ink p-2 border border-bone/20">
                  <span className="text-xl font-bold text-bone block leading-tight">{timeLeft.hours}</span>
                  <span className="text-[9px] text-bone-dim uppercase">Hours</span>
                </div>
                <div className="bg-ink p-2 border border-bone/20">
                  <span className="text-xl font-bold text-cyan-400 block leading-tight">{timeLeft.minutes}</span>
                  <span className="text-[9px] text-bone-dim uppercase">Mins</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 font-mono text-[11px] text-bone-dim pt-2 border-t border-bone/20">
              <div className="flex justify-between">
                <span>Eligibility:</span>
                <strong className="text-bone">Jr (6–8) · Sr (9–12)</strong>
              </div>
              <div className="flex justify-between">
                <span>Team Size:</span>
                <strong className="text-bone">2–4 Members</strong>
              </div>
              <div className="flex justify-between">
                <span>Deliverable:</span>
                <strong className="text-bone">Dossier PDF + 3D CAD</strong>
              </div>
              <div className="flex justify-between">
                <span>Live Review:</span>
                <strong className="text-cyan-400 font-bold">24 Oct · Science Fair</strong>
              </div>
            </div>

            <Link
              to="/submissions"
              className="w-full py-2.5 bg-cyan-600 text-bone-hi font-label font-bold text-xs uppercase tracking-widest text-center border border-cyan-600 hover:bg-ink hover:text-cyan-400 transition-colors block shadow-md"
            >
              Deposit CAD &amp; Dossier →
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="border-2 border-bone/60 bg-ink-2 p-1.5 flex flex-wrap gap-1.5 font-mono text-xs uppercase tracking-wider">
        {[
          { id: 'brief', label: '01 · The Brief' },
          { id: 'format', label: '02 · Format & Scoring' },
          { id: 'tracks', label: '03 · Mission RFPs' },
          { id: 'cad', label: '04 · CAD & Dimension III' },
          { id: 'calc', label: '05 · Sizing Lab' },
          { id: 'checklist', label: '06 · Checklist' },
          { id: 'rules', label: '07 · Rules & Rubric' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleSectionChange(tab.id)}
            className={`flex-1 sm:flex-initial px-4 py-2 font-bold transition-all cursor-pointer text-center ${activeSection === tab.id
                ? 'bg-cyan-600 text-bone-hi shadow-md'
                : 'text-bone-dim hover:text-bone hover:bg-ink'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ======================================================== */}
      {/* SECTION 01: THE BRIEF */}
      {/* ======================================================== */}
      {activeSection === 'brief' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="border-2 border-bone/40 bg-ink p-6 sm:p-8 space-y-6">
            <div className="border-b border-bone/20 pb-4">
              <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest">Section 01</span>
              <h2 className="font-display text-3xl sm:text-4xl text-bone uppercase tracking-wider mt-1">
                Lift Is Calculated. Fit Is Modelled.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-bone-dim leading-relaxed">
              <div className="space-y-4">
                <p className="text-bone font-medium text-base">
                  A wing that flies on paper is useless if the battery bay doesn&apos;t clear the main spar. A stunning 3D render is useless if the airfoil stalls at launch. <em>Volatus rewards the team that proves both.</em>
                </p>
                <p>
                  Volatus is built on the same engineering principles of Real World Design Challenge: an operator provides a mission profile with binding constraints, and your design bureau engineers an airframe from first principles.
                </p>
                <p>
                  Aircraft design is an iterative loop: you estimate mass, size a wing, compute lift and drag, choose motors, select batteries, lay it out in CAD, discover the CG sits behind the neutral point, shift components, and run the math again until your numbers and CAD assembly converge.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="bg-ink-2 p-3.5 border border-bone/20 space-y-1">
                  <span className="text-cyan-400 font-bold block">// TEST 01 · FLIGHT</span>
                  <strong className="text-bone block uppercase">Does It Fly?</strong>
                  <p className="text-[11px] text-bone-dim">Lift, drag, wing loading, Reynolds number, and stall margin calculated at true operational air density.</p>
                </div>
                <div className="bg-ink-2 p-3.5 border border-bone/20 space-y-1">
                  <span className="text-cyan-400 font-bold block">// TEST 02 · FIT</span>
                  <strong className="text-bone block uppercase">Does It Fit in 3D?</strong>
                  <p className="text-[11px] text-bone-dim">Every component modelled at true 1:1 scale with clearances, wiring channels, and CG balancing.</p>
                </div>
                <div className="bg-ink-2 p-3.5 border border-bone/20 space-y-1">
                  <span className="text-cyan-400 font-bold block">// TEST 03 · ENERGY</span>
                  <strong className="text-bone block uppercase">Energy Budget</strong>
                  <p className="text-[11px] text-bone-dim">Motor KV, prop sizing, segment-by-segment amp draw, and 20% battery reserve upon landing.</p>
                </div>
                <div className="bg-ink-2 p-3.5 border border-bone/20 space-y-1">
                  <span className="text-cyan-400 font-bold block">// TEST 04 · DEFENSE</span>
                  <strong className="text-bone block uppercase">Live Defense</strong>
                  <p className="text-[11px] text-bone-dim">Whiteboard calculation re-derivation, section cuts through CAD on request, and handling trade-offs.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 02: FORMAT & SCORING */}
      {/* ======================================================== */}
      {activeSection === 'format' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="border-2 border-bone/40 bg-ink p-6 sm:p-8 space-y-6">
            <div className="border-b border-bone/20 pb-4">
              <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest">Section 02</span>
              <h2 className="font-display text-3xl sm:text-4xl text-bone uppercase tracking-wider mt-1">
                Format, Deadlines &amp; Progression
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Round 1 Card */}
              <div className="border border-bone/30 bg-ink-2 p-5 space-y-3">
                <div className="flex justify-between items-center border-b border-bone/20 pb-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-cyan-600 text-bone-hi">ROUND 1 · ONLINE</span>
                  <span className="font-mono text-[11px] text-amber-400 font-bold">DUE 18 OCT 23:59 IST</span>
                </div>
                <h3 className="font-display text-xl text-bone uppercase">Technical Proposal &amp; 3D CAD Package</h3>
                <ul className="space-y-2 font-mono text-xs text-bone-dim">
                  <li><strong className="text-bone">Dossier PDF:</strong> Max 20 pages (Junior) / 25 pages (Senior).</li>
                  <li><strong className="text-bone">CAD Files:</strong> Standard export (<span className="text-cyan-400">.step, .stl, .f3d, .blend</span>) or native CAD archive.</li>
                  <li><strong className="text-bone">Engineering Blueprint:</strong> 3-view orthographic drawing (top, front, side) with mm dimensions.</li>
                  <li><strong className="text-bone">Calculations Ledger:</strong> Mass budget, aerodynamic drag polar, motor &amp; battery runtimes.</li>
                </ul>
              </div>

              {/* Round 2 Card */}
              <div className="border border-bone/30 bg-ink-2 p-5 space-y-3">
                <div className="flex justify-between items-center border-b border-bone/20 pb-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 border border-bone text-bone">ROUND 2 · ONSITE</span>
                  <span className="font-mono text-[11px] text-green-400 font-bold">24 OCT · DPS R.K. PURAM</span>
                </div>
                <h3 className="font-display text-xl text-bone uppercase">Science-Fair Exhibition &amp; Live Jury Review</h3>
                <ul className="space-y-2 font-mono text-xs text-bone-dim">
                  <li><strong className="text-bone">Exhibition Booth:</strong> Shortlisted teams receive dedicated booth space to exhibit models and drawings.</li>
                  <li><strong className="text-bone">Physical Prototypes:</strong> 3D-printed scale models, airframe skeletons, or RC demonstrators strongly encouraged.</li>
                  <li><strong className="text-bone">Live CAD Sectioning:</strong> Jurors will inspect digital CAD models on your laptops and request real-time section cuts.</li>
                  <li><strong className="text-bone">Whiteboard Defense:</strong> Defend airfoil selection, Reynolds number matching, and structural spar load paths.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 03: MISSION RFPS */}
      {/* ======================================================== */}
      {activeSection === 'tracks' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Division Selector */}
          <div className="border-2 border-bone/40 bg-ink p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider block">Division Selection</span>
              <span className="font-label text-sm text-bone-dim">Select your category to inspect the 2 corresponding aircraft mission RFPs.</span>
            </div>
            <div className="flex gap-2 w-full sm:w-auto font-mono text-xs font-bold uppercase">
              <button
                onClick={() => {
                  setDivision('junior');
                  setSelectedTrackId('j-fm');
                }}
                className={`flex-1 sm:flex-initial px-5 py-2.5 border transition-all cursor-pointer ${division === 'junior'
                    ? 'bg-bone text-ink border-bone'
                    : 'bg-ink-2 text-bone-dim border-bone/40 hover:text-bone'
                  }`}
              >
                Junior (Grades 6–8)
              </button>
              <button
                onClick={() => {
                  setDivision('senior');
                  setSelectedTrackId('s-ta');
                }}
                className={`flex-1 sm:flex-initial px-5 py-2.5 border transition-all cursor-pointer ${division === 'senior'
                    ? 'bg-cyan-600 text-bone-hi border-cyan-600'
                    : 'bg-ink-2 text-bone-dim border-bone/40 hover:text-bone'
                  }`}
              >
                Senior (Grades 9–12)
              </button>
            </div>
          </div>

          {/* Track Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
            {activeRfps.map((rfp) => (
              <button
                key={rfp.id}
                onClick={() => setSelectedTrackId(rfp.id)}
                className={`p-4 border text-left transition-all cursor-pointer ${selectedTrackId === rfp.id
                    ? 'bg-ink border-cyan-400 shadow-lg'
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

          {/* Detailed RFP Brief */}
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
      {/* SECTION 04: CAD & DIMENSION III */}
      {/* ======================================================== */}
      {activeSection === 'cad' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="border-2 border-bone/40 bg-ink p-6 sm:p-8 space-y-6">
            <div className="border-b border-bone/20 pb-4">
              <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest">Section 04</span>
              <h2 className="font-display text-3xl sm:text-4xl text-bone uppercase tracking-wider mt-1">
                CAD Modeling &amp; Dimension III Digital Prototyping
              </h2>
            </div>

            <div className="prose font-label text-sm text-bone-dim leading-relaxed max-w-3xl space-y-3">
              <p>
                In professional aerospace engineering, the 3D digital model <strong className="text-bone">is the aircraft</strong> before any metal is cut. Aerodynamicists extract wing loft contours; structures engineers analyze rib load paths; avionics technicians plan harness runs; and manufacturing generates machine toolpaths.
              </p>
              <p>
                Dimension III is now fully integrated inside Volatus. Jurors evaluate the digital CAD package on the same criteria used by aerospace design bureaus: parametric hygiene, realistic mechanical fasteners, material density assignment, and assembly hierarchy.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="border border-bone/20 bg-ink-2 p-4 space-y-2">
                <span className="text-cyan-400 font-bold text-sm block">1. Clean Assembly Tree</span>
                <p className="text-[11px] text-bone-dim font-sans">
                  Proper sub-assembly hierarchy: Fuselage, Wing Structure (spars, ribs, skin), Propulsion &amp; Nacelles, Avionics Bay, and Landing Gear. Zero floating components.
                </p>
              </div>

              <div className="border border-bone/20 bg-ink-2 p-4 space-y-2">
                <span className="text-cyan-400 font-bold text-sm block">2. Fasteners &amp; Hardware</span>
                <p className="text-[11px] text-bone-dim font-sans">
                  Model real mechanical fasteners (M2/M3 bolts, threaded inserts, hinges, control horns, pushrods). No impossible glued joints or magical solid bodies.
                </p>
              </div>

              <div className="border border-bone/20 bg-ink-2 p-4 space-y-2">
                <span className="text-cyan-400 font-bold text-sm block">3. 3-View Blueprint</span>
                <p className="text-[11px] text-bone-dim font-sans">
                  A high-resolution 3-view orthographic drawing generated directly from the CAD assembly. Annotate wingspan, root/tip chord, dihedral angle, and overall length.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 05: AERODYNAMIC SIZING LAB */}
      {/* ======================================================== */}
      {activeSection === 'calc' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="border-2 border-bone/40 bg-ink p-6 sm:p-8 space-y-6">
            <div className="border-b border-bone/20 pb-4">
              <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest">Section 05</span>
              <h2 className="font-display text-3xl sm:text-4xl text-bone uppercase tracking-wider mt-1">
                Interactive Aerodynamic Sizing Lab
              </h2>
            </div>

            <p className="font-label text-sm text-bone-dim leading-relaxed max-w-3xl">
              Use this interactive aerodynamic sizing tool to calculate your aircraft&apos;s wing area, wing loading, required cruise lift coefficient ($C_L$), Reynolds number ($Re$), and stall speed ($V_{'{'}stall{'}'}$) at your target operational altitude.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Inputs Form */}
              <div className="lg:col-span-5 bg-ink-2 border border-bone/30 p-5 space-y-4 font-mono text-xs">
                <h3 className="font-bold text-bone uppercase border-b border-bone/20 pb-2">
                  Airframe Input Parameters
                </h3>

                <div className="space-y-1">
                  <label className="text-bone-dim block">Take-Off Mass (kg):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={calcInputs.mass}
                    onChange={(e) => setCalcInputs({ ...calcInputs, mass: e.target.value })}
                    className="w-full bg-ink p-2 border border-bone/40 text-bone font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-bone-dim block">Wingspan b (m):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={calcInputs.wingspan}
                    onChange={(e) => setCalcInputs({ ...calcInputs, wingspan: e.target.value })}
                    className="w-full bg-ink p-2 border border-bone/40 text-bone font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-bone-dim block">Mean Aerodynamic Chord c (m):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={calcInputs.chord}
                    onChange={(e) => setCalcInputs({ ...calcInputs, chord: e.target.value })}
                    className="w-full bg-ink p-2 border border-bone/40 text-bone font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-bone-dim block">Cruise Airspeed V (m/s):</label>
                  <input
                    type="number"
                    step="0.5"
                    value={calcInputs.velocity}
                    onChange={(e) => setCalcInputs({ ...calcInputs, velocity: e.target.value })}
                    className="w-full bg-ink p-2 border border-bone/40 text-bone font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-bone-dim block">Operational Altitude (m MSL):</label>
                  <input
                    type="number"
                    step="500"
                    value={calcInputs.altitude}
                    onChange={(e) => setCalcInputs({ ...calcInputs, altitude: e.target.value })}
                    className="w-full bg-ink p-2 border border-bone/40 text-bone font-mono"
                  />
                </div>
              </div>

              {/* Output Results Table */}
              <div className="lg:col-span-7 bg-ink-2 border border-bone/30 p-5 space-y-4 font-mono text-xs">
                <div className="flex justify-between items-center border-b border-bone/20 pb-2">
                  <h3 className="font-bold text-bone uppercase">Computed Aerodynamic Telemetry</h3>
                  <span className={`px-2 py-0.5 font-bold ${aeroResults.isFeasible ? 'bg-green-500/10 text-green-400 border border-green-500/40' : 'bg-red-500/10 text-red-400 border border-red-500/40'}`}>
                    {aeroResults.isFeasible ? 'FEASIBLE CRUISE ENVELOPE' : 'REVIEW AIRFOIL SIZING'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-ink p-3 border border-bone/20">
                    <span className="text-bone-dim text-[11px] block">Air Density ρ</span>
                    <strong className="text-bone text-base">{aeroResults.rho} kg/m³</strong>
                  </div>
                  <div className="bg-ink p-3 border border-bone/20">
                    <span className="text-bone-dim text-[11px] block">Total Weight W</span>
                    <strong className="text-bone text-base">{aeroResults.W} N</strong>
                  </div>
                  <div className="bg-ink p-3 border border-bone/20">
                    <span className="text-bone-dim text-[11px] block">Wing Area S</span>
                    <strong className="text-bone text-base">{aeroResults.S} m²</strong>
                  </div>
                  <div className="bg-ink p-3 border border-bone/20">
                    <span className="text-bone-dim text-[11px] block">Aspect Ratio AR</span>
                    <strong className="text-bone text-base">{aeroResults.AR}</strong>
                  </div>
                  <div className="bg-ink p-3 border border-bone/20">
                    <span className="text-bone-dim text-[11px] block">Wing Loading (W/S)</span>
                    <strong className="text-cyan-400 text-base">{aeroResults.wingLoading} kg/m²</strong>
                  </div>
                  <div className="bg-ink p-3 border border-bone/20">
                    <span className="text-bone-dim text-[11px] block">Required Cruise CL</span>
                    <strong className={`text-base ${aeroResults.isFeasible ? 'text-green-400' : 'text-crimson'}`}>
                      {aeroResults.requiredCL}
                    </strong>
                  </div>
                  <div className="bg-ink p-3 border border-bone/20">
                    <span className="text-bone-dim text-[11px] block">Reynolds Number Re</span>
                    <strong className="text-bone text-base">{aeroResults.Re}</strong>
                  </div>
                  <div className="bg-ink p-3 border border-bone/20">
                    <span className="text-bone-dim text-[11px] block">Est. Stall Speed Vstall</span>
                    <strong className="text-bone text-base">{aeroResults.Vstall} m/s</strong>
                  </div>
                </div>

                <p className="text-[11px] text-bone-dim font-sans leading-relaxed pt-2">
                  * Cruise $C_L$ should ideally stay between 0.3 and 0.8 for conventional fixed-wing airfoils to maintain healthy stall margin ($C_{'{'}L,max{'}'} \approx 1.2 - 1.4$). High altitude designs require larger wing area to prevent excessive wing loading in thin air.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 06: CHECKLIST */}
      {/* ======================================================== */}
      {activeSection === 'checklist' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="border-2 border-bone/40 bg-ink p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-bone/20 pb-4">
              <div>
                <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest">Section 06</span>
                <h2 className="font-display text-3xl sm:text-4xl text-bone uppercase tracking-wider mt-1">
                  Preflight Submission Checklist
                </h2>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="text-cyan-400 font-bold">
                  {Object.values(checkedItems).filter(Boolean).length} of {CHECKLIST_ITEMS.length} verified
                </span>
                <button
                  onClick={resetChecklist}
                  className="px-2 py-1 border border-bone/40 text-bone-dim hover:text-bone text-[11px] uppercase cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {CHECKLIST_ITEMS.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`p-3.5 border cursor-pointer transition-all flex items-start gap-3 select-none ${checkedItems[item.id]
                      ? 'border-bone/20 bg-ink-2/40 text-bone-dim'
                      : 'border-bone bg-ink-2 text-bone hover:border-cyan-400'
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={!!checkedItems[item.id]}
                    onChange={() => { }}
                    className="mt-0.5 accent-cyan-500 cursor-pointer"
                  />
                  <span className={`font-mono text-xs leading-relaxed ${checkedItems[item.id] ? 'line-through text-bone-dim/60' : ''}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-bone/20 flex flex-wrap justify-between items-center gap-4">
              <span className="font-mono text-xs text-bone-dim">
                Status automatically persisted in local browser storage.
              </span>
              <Link
                to="/submissions"
                className="px-6 py-2.5 bg-cyan-600 text-bone-hi font-mono text-xs font-bold uppercase tracking-wider hover:bg-ink hover:text-cyan-400 border border-cyan-600 transition-colors"
              >
                Go to Submission Vault →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 07: RULES & RUBRIC */}
      {/* ======================================================== */}
      {activeSection === 'rules' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="border-2 border-bone/40 bg-ink p-6 sm:p-8 space-y-6">
            <div className="border-b border-bone/20 pb-4">
              <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest">Section 07</span>
              <h2 className="font-display text-3xl sm:text-4xl text-bone uppercase tracking-wider mt-1">
                Evaluation Rubric &amp; Point Breakdown
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 font-mono text-xs">
              <div className="border border-bone/20 bg-ink-2 p-4 space-y-1">
                <span className="text-cyan-400 font-bold text-xs uppercase block">// 25 PTS</span>
                <div className="font-display text-lg text-bone uppercase">Aero Sizing</div>
                <p className="text-[11px] text-bone-dim font-sans">
                  Airfoil polar curve, wing loading, Reynolds number matching, lift-to-drag estimation, and stall margin.
                </p>
              </div>

              <div className="border border-bone/20 bg-ink-2 p-4 space-y-1">
                <span className="text-cyan-400 font-bold text-xs uppercase block">// 25 PTS</span>
                <div className="font-display text-lg text-bone uppercase">CAD Modeling</div>
                <p className="text-[11px] text-bone-dim font-sans">
                  Assembly hierarchy, 3D part tolerances, mechanical fasteners, wiring channels, and 3-view orthographic blueprint.
                </p>
              </div>

              <div className="border border-bone/20 bg-ink-2 p-4 space-y-1">
                <span className="text-cyan-400 font-bold text-xs uppercase block">// 20 PTS</span>
                <div className="font-display text-lg text-bone uppercase">Mission Fit</div>
                <p className="text-[11px] text-bone-dim font-sans">
                  Compliance with the chosen RFP constraints: payload bay volume, flight endurance, and real operational environment.
                </p>
              </div>

              <div className="border border-bone/20 bg-ink-2 p-4 space-y-1">
                <span className="text-cyan-400 font-bold text-xs uppercase block">// 15 PTS</span>
                <div className="font-display text-lg text-bone uppercase">Physical Exhibit</div>
                <p className="text-[11px] text-bone-dim font-sans">
                  Quality of scale models, 3D printed components, hardware cutaways, and exhibition booth craftsmanship.
                </p>
              </div>

              <div className="border border-bone/20 bg-ink-2 p-4 space-y-1">
                <span className="text-cyan-400 font-bold text-xs uppercase block">// 15 PTS</span>
                <div className="font-display text-lg text-bone uppercase">Arbiters Defense</div>
                <p className="text-[11px] text-bone-dim font-sans">
                  Handling live jury questioning, whiteboard calculation defense, and live digital CAD model sectioning.
                </p>
              </div>
            </div>

            {/* POC and Links */}
            <div className="pt-2 flex flex-wrap justify-between items-center gap-4 font-mono text-xs">
              <div className="text-bone-dim">
                Event Lead: <strong className="text-bone">Tarushi Tomar</strong> (<a href="mailto:r24564tarushi@dpsrkp.net" className="text-cyan-400 hover:underline">r24564tarushi@dpsrkp.net</a>) · <a href="mailto:aeross@dpsrkp.net" className="text-bone hover:underline">aeross@dpsrkp.net</a>
              </div>
              <div className="flex gap-3">
                <Link to="/comps" className="px-4 py-2 border border-bone/40 text-bone hover:border-bone transition-colors uppercase">
                  ← Back to Comps
                </Link>
                <Link to="/submissions" className="px-5 py-2 bg-cyan-600 text-bone-hi font-bold hover:bg-ink hover:text-cyan-400 border border-cyan-600 transition-colors uppercase">
                  Deposit CAD &amp; Dossier →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
