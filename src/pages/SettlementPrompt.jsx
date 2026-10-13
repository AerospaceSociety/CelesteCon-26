import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const VALID_SECTIONS = ['brief', 'tracks', 'template', 'checklist'];

const JUNIOR_RFPS = [
  {
    id: 'j-fringe',
    code: 'J-FR',
    trackName: 'Dwarf-Planet Orbit',
    title: 'The Outpost on the Fringe',
    meta: '15,000 scientists · 10-year mission · Ceres / Pluto',
    site: 'Orbiting Ceres (2.8 AU) or Pluto (39.5 AU)',
    population: '15,000 scientists, engineers, doctors and support staff',
    delay: '15–31 minutes (Ceres) or 4–7 hours (Pluto)',
    solarFlux: '~177 W/m² (Ceres) or <1 W/m² (Pluto)',
    background:
      'Dwarf planets are leftovers from the building of the Solar System. Ceres, in the asteroid belt, holds pockets of salty water and bright carbonate deposits in Occator crater. Pluto, far beyond Neptune, has glaciers of frozen nitrogen and potential subsurface oceans revealed by New Horizons. An international science consortium is funding a ten-year orbital research station to study these pristine worlds without landing.',
    rfpSummary:
      'Engineer a permanent free-space station orbiting your chosen dwarf planet. The settlement must never land on the surface. House 15,000 residents in comfort, sustain complete closed-loop ECLSS, generate artificial gravity through rotation, provide shielding against galactic cosmic rays, and operate reliable sample-return probes.',
    constraints: [
      'The habitat must remain in free orbit; no surface bases or grounding on the dwarf planet.',
      'Artificial gravity must be provided via rotation (0.3g to 1.0g living quarters) with angular velocity under 2 RPM to prevent vestibular nausea.',
      'Closed-loop water and oxygen recovery must achieve >95% efficiency.',
      'Primary power must account for low solar flux: nuclear fission (SMRs) or massive parabolic concentrators.',
      'Emergency reserves must guarantee at least 180 days of survival during complete communications blackout.'
    ],
    brownie: {
      title: 'Cryogenic Ice Extraction & Fuel Refinery',
      prompt:
        'Design an automated orbital shuttle system that lands on the dwarf planet, quarries cryogenic water/nitrogen ice, returns to orbit, and cracks it into liquid hydrogen and oxygen propellant for deep-space missions.'
    }
  },
  {
    id: 'j-vault',
    code: 'J-VA',
    trackName: 'Asteroid Interior',
    title: 'The Subsurface Vault',
    meta: '20,000 people · 20+ years · Asteroids 1–3 AU',
    site: 'Excavated hollow inside a metallic or carbonaceous asteroid (e.g. Psyche, Vesta, or Eros)',
    population: '20,000 permanent residents and mining specialists',
    delay: '5–20 minutes to Earth',
    solarFlux: '~150–1,360 W/m²',
    background:
      'Asteroids in the main belt contain trillions of dollars in platinum-group metals, nickel-iron, and hydrated silicates. Rather than building a fragile exterior shell in empty space, this mission hollows out the core of a massive asteroid to use its natural rock mass as an impenetrable radiation and micrometeoroid barrier.',
    rfpSummary:
      'Design a 20,000-person subterranean habitat inside an asteroid. Address excavation mechanics, structural anchoring, internal artificial rotation (or internal rotating torus), atmospheric pressurization within porous rock, and continuous ore processing.',
    constraints: [
      'Minimum rock overburden of 15 metres to ensure 100% cosmic ray and solar flare shielding.',
      'Sealing mechanism: composite polymer or sintered basalt liners to prevent atmospheric leakage through natural fissure networks.',
      'Rotational dynamics: balance internal spinning habitats against the parent asteroid’s natural spin axis to eliminate gyroscopic precession.',
      'Industrial separation: heavy metallurgical smelting must be thermally and atmospherically isolated from residential biosphere sectors.',
      'Socio-economic plan: clear community governance and living spaces for multi-decade human habitation.'
    ],
    brownie: {
      title: 'Subsurface Closed-Canopy Agricultural Vault',
      prompt:
        'Engineer a vertical hydroponic and aeroponic biosphere using artificial full-spectrum LED illumination and recycled greywater that supplies 2,500 calories per citizen per day.'
    }
  },
  {
    id: 'j-nomad',
    code: 'J-NO',
    trackName: 'Wildcard Migration',
    title: 'The Nomad Habitat',
    meta: '10,000 → 100,000 citizens · Fictional Tara System',
    site: 'Elliptical migration orbit in the multi-star Tara system',
    population: '10,000 initial scaling to 100,000 multi-generational citizens',
    delay: 'Variable (light-hours across system orbits)',
    solarFlux: 'Swings ±25% over each orbital cycle',
    background:
      'In the speculative Tara system, a fleet of migratory habitats must follow complex resonance orbits between companion stars. Over centuries, populations expand ten-fold. The settlement must be designed from day one to expand modularly like a living crystal without ever depressurizing existing sectors.',
    rfpSummary:
      'Architect a modular nomadic space ark. Must accommodate extreme thermal swings as distance to stellar primaries fluctuates, and feature modular expansion docking protocols to support 10x population growth over 50 years.',
    constraints: [
      'Modular growth: docking and expansion of new residential rings without venting or disrupting active biospheres.',
      'Variable thermal management: massive heat pipes, phase-change thermal storage, and variable-geometry radiator louvres.',
      'Centrifugal gravity: multi-tier rotators maintaining steady 1.0g at the rim.',
      'Long-term psychological wellness: parks, recreation, cultural architecture, and acoustic dampening to avoid cabin fever.',
      'Resource logistics: comet harvesting systems for replenishing volatiles on long-distance transfer legs.'
    ],
    brownie: {
      title: 'Kinetic Deflector & Dust Shield Array',
      prompt:
        'Design a high-velocity electromagnetic railgun or plasma deflector shield mounted on the prow to clear micrometeoroid clouds during high-speed orbital transits.'
    }
  }
];

const SENIOR_RFPS = [
  {
    id: 's-cradle',
    code: 'S-CR',
    trackName: 'Earth-Moon Lagrangian Point',
    title: 'The Orbital Cradle',
    meta: '50,000 citizens · Earth Orbit 1 AU (L5 Point)',
    site: 'Earth-Moon L5 Lagrangian Equilibrium Point (1 AU)',
    population: '50,000 permanent residents and industrial engineers',
    delay: 'Under 1.5 seconds to Earth',
    solarFlux: '~1,361 W/m²',
    background:
      'Positioned at the gravitationally stable Earth-Moon L5 point, the Orbital Cradle serves as civilization’s premier orbital shipyard and debris-remediation refinery. It captures dead orbital stages and retired satellites, melting them down to manufacture deep-space hulls while housing a thriving permanent urban society.',
    rfpSummary:
      'Design a 50,000-citizen free-space city at L5. Must incorporate closed-loop ECLSS, an industrial orbital refinery dock, active centrifugal gravity, and an economic model based on space manufacturing and orbital power export.',
    constraints: [
      'Twin counter-rotating cylinders or toruses to nullify net angular momentum.',
      'Radiation protection: 2+ metres of lunar regolith or electro-magnetic active shielding against solar particle events (SPE).',
      'Atmospheric mass balance: full nitrogen, oxygen, and carbon dioxide cycle accounting for 50,000 people.',
      'Thermal balance: radiator sizing calculations matching internal heat generation from inhabitants, electronics, and heavy industry.',
      'Construction sequence: step-by-step assembly timeline from initial robotic scaffolding to full pressurization.'
    ],
    brownie: {
      title: 'Autonomous Orbital Debris Sweeper & In-Space Foundry',
      prompt:
        'Engineer a fleet of solar-electric tugs equipped with laser ablation or net harvesters that capture space debris from LEO/GEO, transport it to L5, and feed it into a solar concentrator vacuum furnace.'
    }
  },
  {
    id: 's-interloper',
    code: 'S-IN',
    trackName: 'Interstellar Rendezvous',
    title: 'Project Interloper',
    meta: '30,000 crew · Hyperbolic ISO Capture (1 AU)',
    site: 'Captured Interstellar Object (ISO) in an eccentric heliocentric trajectory',
    population: '30,000 scientists, deep-space miners, and astrobiologists',
    delay: '5–45 minutes to Earth',
    solarFlux: 'Variable along hyperbolic trajectory',
    background:
      'An interstellar object from another star system has entered the solar system on a hyperbolic trajectory. Through an unprecedented international effort, ion-drive tugs intercept and anchor a massive orbital research facility to the object to extract exotic extrasolar minerals and study pre-solar organic compounds before it slingshots away.',
    rfpSummary:
      'Engineer a rapid-deployment habitat and extraction base anchored to a tumbling interstellar visitor. Solve anchoring in microgravity, drilling into volatile-rich interstellar crusts, and maintaining a sealed habitat under extreme trajectory dynamics.',
    constraints: [
      'Anchoring & structural stabilization against asteroid outgassing and spin-rate changes.',
      'Closed-loop life support capable of sustaining 30,000 personnel with zero resupply from Earth for up to 3 years.',
      'Planetary defense fail-safe: redundant propulsion units capable of altering the interloper’s trajectory if collision risk with Earth arises.',
      'Mass budget: clear distinction between Earth-launched modular nodes and in-situ processed structural elements.',
      'Astrobiology quarantine protocol: biohazard isolation suites for studying extrasolar materials.'
    ],
    brownie: {
      title: 'Interstellar Probe Launcher',
      prompt:
        'Design a high-impulse magnetic accelerator rail system on the interloper that uses the object’s gravitational slingshot to launch sub-relativistic micro-probes toward neighboring star systems.'
    }
  },
  {
    id: 's-saturn',
    code: 'S-SH',
    trackName: 'Outer Planet Logistics',
    title: 'The Saturnian Highway',
    meta: '35,000 inhabitants · Saturn Orbit (9.6 AU)',
    site: 'Equatorial orbit around Saturn, servicing Titan and Enceladus',
    population: '35,000 citizens across orbital commerce, transport, and science',
    delay: '67–92 minutes to Earth',
    solarFlux: '~15 W/m² (1% of Earth orbit)',
    background:
      'Saturn is the energy capital of the outer solar system: Titan’s lakes overflow with liquid methane and ethane, while Enceladus spews pure water and organic geysers into space. The Saturnian Highway is an orbital megalopolis serving as the transshipment hub for all resource flows between Saturn’s moons and the inner solar system.',
    rfpSummary:
      'Design a permanent orbital metropolis at Saturn. Solve the critical energy bottleneck where solar power is virtually zero, harness Titan’s cryogenic atmospheres and Enceladus’s water plumes, and manage communications latency exceeding one hour.',
    constraints: [
      'Energy generation: complete reliance on advanced nuclear fusion (D-He3) or fission SMRs, with full thermal radiator loops.',
      'Centrifugal gravity: minimum 0.5g for long-term musculoskeletal integrity in deep space.',
      'Cryogenic propellant depots: zero-boil-off liquid methane, oxygen, and hydrogen storage.',
      'Autonomous governance & AI decision nodes to handle 90-minute round-trip light speed communications lag to Earth.',
      'Radiation protection: shielding against Saturn’s intense inner radiation belts.'
    ],
    brownie: {
      title: 'Enceladus Cryovolcanic Geyser Skimmer',
      prompt:
        'Engineer an autonomous aerogel/scoop spacecraft that dives through the south polar plumes of Enceladus at orbital speeds, collects water and complex amino acids, and delivers them to the orbital highway.'
    }
  }
];

const CHECKLIST_ITEMS = [
  { id: 'c1', label: 'Proposal PDF formatted with selectable text (no scanned images), cover, contents, and SI units.' },
  { id: 'c2', label: 'Page limits respected: Junior max 25 pages · Senior max 35 pages (main body).' },
  { id: 'c3', label: 'Executive pitch deck PDF prepared (Junior max 12 slides · Senior max 15 slides, 16:9).' },
  { id: 'c4', label: 'Artificial gravity rotational maths verified: Radius, RPM, and tangential velocity within comfort band (≤2 RPM).' },
  { id: 'c5', label: 'Closed-loop ECLSS mass balance table included: Oxygen, water, food, and metabolic waste closure.' },
  { id: 'c6', label: 'Radiation shielding thickness specified with material density and cosmic ray/SPE attenuation rationale.' },
  { id: 'c7', label: 'Mass budget table provided with clear origin split (Earth launch vs In-Situ Resource Utilization).' },
  { id: 'c8', label: 'Thermal management & power generation budget: Wattage balance, radiator area, and night/eclipse reserves.' },
  { id: 'c9', label: '2D/3D schematics, isometric cuts, and annotated diagrams included with figure numbers and captions.' },
  { id: 'c10', label: 'Optional Extension Challenge clearly marked in Section B of the proposal (if attempted).' },
  { id: 'c11', label: 'Academic integrity & AI disclosure declaration signed: all citations and generative tools credited.' },
  { id: 'c12', label: 'PDF files tested and uploaded to the official CelesteCon Submission Vault before 18 Oct 23:59:59 IST.' }
];

export default function SettlementPrompt() {
  const [activeSection, setActiveSection] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return VALID_SECTIONS.includes(hash) ? hash : 'brief';
  });

  const [division, setDivision] = useState('junior');
  const [selectedTrackId, setSelectedTrackId] = useState('j-fringe');

  // Sync section hash
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

  const activeRfps = division === 'junior' ? JUNIOR_RFPS : SENIOR_RFPS;
  const currentRfp = activeRfps.find((r) => r.id === selectedTrackId) || activeRfps[0];

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
          <span className="text-crimson font-bold uppercase">EVENT 01 · SETTLE-ME-THIS</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/submissions" className="text-crimson font-bold uppercase tracking-widest text-[11px] flex items-center gap-1">
            <span>Submission Vault</span>
            <span>→</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-green-400 uppercase font-bold text-[10px] tracking-wider">PROMPT RELEASED</span>
          </div>
        </div>
      </div>

      {/* Main Hero Header */}
      <div className="border-2 border-bone bg-ink p-6 sm:p-8 relative">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 relative z-10">
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold px-2 py-0.5 bg-crimson text-bone-hi">
                EVENT 01 · SMT
              </span>
              <span className="font-mono text-xs uppercase px-2 py-0.5 border border-bone/40 text-bone-dim">
                Space Settlement Design
              </span>
              <span className="font-mono text-xs uppercase px-2 py-0.5 border border-bone/40 text-bone-dim">
                Junior (Grades 6–8) · Senior (Grades 9–12)
              </span>
              <span className="font-mono text-xs uppercase px-2.5 py-0.5 bg-green-500/10 text-green-400 border border-green-500/40 font-bold">
                ● 6 RFPs ACTIVE
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl text-bone uppercase tracking-wide leading-none">
              Settle-Me-This <span className="text-crimson">2026</span>
            </h1>

            <p className="font-label text-sm sm:text-base text-bone-dim leading-relaxed max-w-2xl">
              Design a permanent, habitable free-space settlement where thousands of people live, work, and thrive for decades far from Earth. Close every environmental loop, count every tonne of launched vs. mined mass, balance thermal radiation, and engineer centrifugal artificial gravity. Six RFPs across two divisions; Round 1 proposals due 18 October, followed by live on-campus jury defense at DPS R.K. Puram on 24 October 2026.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => handleSectionChange('tracks')}
                className="px-5 py-2.5 bg-crimson text-bone-hi font-label font-bold text-xs uppercase tracking-widest border border-crimson cursor-pointer"
              >
                Explore 6 Mission RFPs →
              </button>
              <button
                onClick={() => handleSectionChange('template')}
                className="px-5 py-2.5 bg-ink-2 text-bone font-label font-bold text-xs uppercase tracking-widest border border-bone/40 cursor-pointer"
              >
                Proposal Template
              </button>
              <button
                onClick={() => handleSectionChange('checklist')}
                className="px-5 py-2.5 bg-ink-2 text-bone font-label font-bold text-xs uppercase tracking-widest border border-bone/40 cursor-pointer"
              >
                Preflight Checklist
              </button>
            </div>
          </div>

          {/* Telemetry Aside Box */}
          <div className="w-full lg:w-80 bg-ink-2 p-5 border-2 border-bone/60 space-y-4 shrink-0">
            <div className="flex justify-between items-center text-xs font-mono border-b border-bone/20 pb-2">
              <span className="text-bone-dim uppercase">Proposal Window</span>
              <span className="font-bold text-green-400 uppercase">
                Round 1 Online
              </span>
            </div>

            <div className="p-3 bg-ink border border-bone/20 space-y-1 font-mono text-xs">
              <span className="text-bone-dim uppercase text-[10px] block">Round 1 Deadline</span>
              <strong className="text-bone text-sm block">18 October 2026 · 23:59 IST</strong>
              <span className="text-bone-dim text-[11px] block">Submit via Official Submission Portal</span>
            </div>

            <div className="space-y-1.5 font-mono text-[11px] text-bone-dim pt-2 border-t border-bone/20">
              <div className="flex justify-between">
                <span>Eligibility:</span>
                <strong className="text-bone">Jr (6–8) · Sr (9–12)</strong>
              </div>
              <div className="flex justify-between">
                <span>Team Size:</span>
                <strong className="text-bone">3–5 Members</strong>
              </div>
              <div className="flex justify-between">
                <span>Deliverable:</span>
                <strong className="text-bone">PDF Proposal + Deck</strong>
              </div>
              <div className="flex justify-between">
                <span>Round 2 Finale:</span>
                <strong className="text-crimson font-bold">24 Oct · On Campus</strong>
              </div>
            </div>

            <Link
              to="/submissions"
              className="w-full py-2.5 bg-crimson text-bone-hi font-label font-bold text-xs uppercase tracking-widest text-center border border-crimson block"
            >
              Deposit Proposal PDF →
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="border-2 border-bone/60 bg-ink-2 p-1.5 flex flex-wrap gap-1.5 font-mono text-xs uppercase tracking-wider">
        {[
          { id: 'brief', label: '01 · The Brief' },
          { id: 'tracks', label: '02 · Mission RFPs' },
          { id: 'template', label: '03 · Proposal Guide' },
          { id: 'checklist', label: '04 · Checklist' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleSectionChange(tab.id)}
            className={`flex-1 sm:flex-initial px-4 py-2 font-bold cursor-pointer text-center ${
              activeSection === tab.id
                ? 'bg-crimson text-bone-hi'
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
        <div className="space-y-8">
          <div className="border-2 border-bone/40 bg-ink p-6 sm:p-8 space-y-8">
            {/* Header & Philosophy */}
            <div className="border-b border-bone/20 pb-4">
              <span className="font-mono text-xs text-crimson font-bold uppercase tracking-widest">Section 01 · Strategic Mission Directive</span>
              <h2 className="font-display text-3xl sm:text-4xl text-bone uppercase tracking-wider mt-1">
                More Than Steel &amp; Regolith: Building a Living Civilization
              </h2>
            </div>

            {/* Humanified Narrative */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-bone-dim leading-relaxed">
              <div className="space-y-4">
                <p className="text-bone font-medium text-base leading-relaxed">
                  A space settlement is not merely an orbital machine or a spinning titanium cylinder in the quiet cold of deep space—it is the cradle of humanity&apos;s next chapter. Long after Earth becomes a distant blue marble in the observation cupola, thousands of people will wake up here to raise families, share meals, heal the sick, celebrate cultural festivals, and conduct breakthrough science under artificial sunlight.
                </p>
                <p>
                  Every bolt tightened and every pressure seal welded carries a human life. Designing such a habitat demands far more than basic geometry: it requires balancing raw structural physics against human vulnerability, creating living architectures that shield residents from cosmic radiation while nurturing mental clarity and civic belonging over decades of isolation.
                </p>
              </div>
              <div className="space-y-4">
                <p>
                  In Settle-Me-This, your team acts as the master engineering consortium. You must confront the harsh realities of off-world existence—closing oxygen, water, and nutrient cycles with unforgiving efficiency, generating comfortable centrifugal gravity without vestibular sickness, and establishing civic systems resilient enough to withstand sudden asteroid debris strikes or communications blackouts.
                </p>
                <p>
                  Your proposal will be scrutinized by aerospace researchers and systems architects. Ground your ambition in credible calculations, cite real material constants, and show us how humanity will not merely survive in the void, but truly thrive.
                </p>
              </div>
            </div>

            {/* Division Page Limits Callout */}
            <div className="border-2 border-crimson/80 bg-crimson/10 p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-crimson/30 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-crimson text-bone-hi font-mono text-xs font-bold uppercase tracking-widest">
                    OFFICIAL SUBMISSION LIMITS
                  </span>
                  <span className="font-mono text-xs text-bone-dim uppercase">Round 1 Written Dossier</span>
                </div>
                <span className="font-mono text-xs text-amber-400 font-bold uppercase">
                  Due: 18 October 2026 · 23:59 IST
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
                {/* Junior Card */}
                <div className="border border-bone/30 bg-ink p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs uppercase text-bone-dim font-bold">Junior Division (Grades 6–8)</span>
                    <span className="px-2 py-0.5 bg-bone text-ink text-xs font-bold">JR CATEGORY</span>
                  </div>
                  <div className="font-display text-2xl text-bone uppercase">
                    Juniors: <span className="text-crimson">25 Pages</span> Limit
                  </div>
                  <p className="font-sans text-xs text-bone-dim leading-relaxed">
                    Strict maximum page limit of <strong>25 pages</strong> (15–20 recommended) + <strong>12-slide Pitch Deck</strong> (16:9 PDF). Complete cover-to-cover submission covering all technical disciplines.
                  </p>
                </div>

                {/* Senior Card */}
                <div className="border border-bone/30 bg-ink p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs uppercase text-bone-dim font-bold">Senior Division (Grades 9–12)</span>
                    <span className="px-2 py-0.5 bg-crimson text-bone-hi text-xs font-bold">SR CATEGORY</span>
                  </div>
                  <div className="font-display text-2xl text-bone uppercase">
                    Seniors: <span className="text-crimson">35 Pages</span> Limit
                  </div>
                  <p className="font-sans text-xs text-bone-dim leading-relaxed">
                    Strict maximum page limit of <strong>35 pages</strong> (25–30 recommended) + <strong>15-slide Pitch Deck</strong> (16:9 PDF). Rigorous engineering derivations, mass budgets, and closed-loop schematics required.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap justify-between items-center gap-2 pt-1 font-mono text-xs text-bone-dim">
                <span>Deliverable format: Single PDF document with selectable text + Pitch Deck PDF (English only).</span>
                <span className="text-amber-400">Section B Extension Challenge (optional): ≤3 additional pages within dossier.</span>
              </div>
            </div>

            {/* The Six Core Engineering Disciplines */}
            <div className="space-y-4 pt-2">
              <div className="border-b border-bone/20 pb-2">
                <span className="font-mono text-xs text-crimson font-bold uppercase tracking-widest block">
                  Foundational Architecture
                </span>
                <h3 className="font-display text-2xl text-bone uppercase tracking-wider mt-0.5">
                  The Six Core Pillars of Settlement Design
                </h3>
                <p className="font-label text-xs sm:text-sm text-bone-dim mt-1">
                  Every competitive proposal must address these 6 core engineering systems with scientific rigor:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 1. Structure */}
                <div className="border border-bone/20 bg-ink-2 p-4 space-y-2">
                  <div className="flex items-center justify-between border-b border-bone/10 pb-1.5">
                    <span className="font-mono text-xs font-bold text-crimson uppercase">01 · Structure</span>
                    <span className="font-mono text-[10px] text-bone-dim">Hull &amp; Integrity</span>
                  </div>
                  <h4 className="font-display text-lg text-bone uppercase">Hull, Materials &amp; Shielding</h4>
                  <p className="font-sans text-xs text-bone-dim leading-relaxed">
                    Define the overarching geometry (torus, cylinder, sphere, or excavated asteroid cavity) and compute tensile hull thicknesses under internal atmospheric pressure. Detail passive radiation shielding (lunar regolith, water jackets, or polyethylene matrices) and micrometeoroid Whipple bumper arrays to protect the population.
                  </p>
                </div>

                {/* 2. Design */}
                <div className="border border-bone/20 bg-ink-2 p-4 space-y-2">
                  <div className="flex items-center justify-between border-b border-bone/10 pb-1.5">
                    <span className="font-mono text-xs font-bold text-amber-400 uppercase">02 · Design</span>
                    <span className="font-mono text-[10px] text-bone-dim">Kinematics &amp; Motion</span>
                  </div>
                  <h4 className="font-display text-lg text-bone uppercase">Artificial Gravity &amp; Rotation</h4>
                  <p className="font-sans text-xs text-bone-dim leading-relaxed">
                    Engineer rotational kinematics to produce comfortable centrifugal gravity (0.3g to 1.0g) without inducing vestibular Coriolis sickness (strictly ≤2 RPM). Solve angular momentum conservation with counter-rotating modules and model zero-g industrial docking hubs.
                  </p>
                </div>

                {/* 3. Operations */}
                <div className="border border-bone/20 bg-ink-2 p-4 space-y-2">
                  <div className="flex items-center justify-between border-b border-bone/10 pb-1.5">
                    <span className="font-mono text-xs font-bold text-green-400 uppercase">03 · Operations</span>
                    <span className="font-mono text-[10px] text-bone-dim">Logistics &amp; Growth</span>
                  </div>
                  <h4 className="font-display text-lg text-bone uppercase">Construction, Mass &amp; Logistics</h4>
                  <p className="font-sans text-xs text-bone-dim leading-relaxed">
                    Chart the step-by-step assembly timeline from initial robotic scaffolding to full pressurization. Itemize the complete mass budget, distinguishing Earth-launched precision avionics from in-situ resource utilization (ISRU) metals and volatiles harvested from asteroids or lunar crusts.
                  </p>
                </div>

                {/* 4. Infrastructure */}
                <div className="border border-bone/20 bg-ink-2 p-4 space-y-2">
                  <div className="flex items-center justify-between border-b border-bone/10 pb-1.5">
                    <span className="font-mono text-xs font-bold text-cyan-400 uppercase">04 · Infrastructure</span>
                    <span className="font-mono text-[10px] text-bone-dim">Power &amp; Thermal</span>
                  </div>
                  <h4 className="font-display text-lg text-bone uppercase">Power Grids &amp; Heat Dissipation</h4>
                  <p className="font-sans text-xs text-bone-dim leading-relaxed">
                    Quantify total electrical power demands across residential biospheres and heavy industrial docks, sizing nuclear fission/fusion reactors or solar arrays. Balance thermodynamics by sizing giant radiative heat rejection panels to shed thousands of megawatts of trapped industrial heat into the vacuum of space.
                  </p>
                </div>

                {/* 5. Human Factors */}
                <div className="border border-bone/20 bg-ink-2 p-4 space-y-2">
                  <div className="flex items-center justify-between border-b border-bone/10 pb-1.5">
                    <span className="font-mono text-xs font-bold text-purple-400 uppercase">05 · Human Factors</span>
                    <span className="font-mono text-[10px] text-bone-dim">Civic &amp; Ergonomics</span>
                  </div>
                  <h4 className="font-display text-lg text-bone uppercase">Civic Life, Ergonomics &amp; Health</h4>
                  <p className="font-sans text-xs text-bone-dim leading-relaxed">
                    Allocate internal living volume per citizen, design multi-generational housing, and provide hospitals, schools, and cultural commons. Incorporate psychological ergonomics—circadian lighting, open green parks, acoustic isolation, and emergency governance frameworks—to prevent deep-space confinement distress.
                  </p>
                </div>

                {/* 6. Closed Loop System */}
                <div className="border border-bone/20 bg-ink-2 p-4 space-y-2">
                  <div className="flex items-center justify-between border-b border-bone/10 pb-1.5">
                    <span className="font-mono text-xs font-bold text-rose-400 uppercase">06 · Closed Loop</span>
                    <span className="font-mono text-[10px] text-bone-dim">Biosphere &amp; ECLSS</span>
                  </div>
                  <h4 className="font-display text-lg text-bone uppercase">ECLSS &amp; Regenerative Biosphere</h4>
                  <p className="font-sans text-xs text-bone-dim leading-relaxed">
                    Design a 98%+ closed ecological life support system (ECLSS) balancing oxygen replenishment, Sabatier carbon capture, and greywater distillation. Calculate agricultural surface area for vertical aeroponic farms producing 2,500+ daily calories per resident, backed by 180 days of emergency reserves.
                  </p>
                </div>
              </div>
            </div>

            {/* Qualitative Evaluation Criteria */}
            <div className="space-y-4 pt-2">
              <div className="border-b border-bone/20 pb-2">
                <span className="font-mono text-xs text-crimson font-bold uppercase tracking-widest block">
                  Evaluation Standards
                </span>
                <h3 className="font-display text-2xl text-bone uppercase tracking-wider mt-0.5">
                  Qualitative Assessment Criteria
                </h3>
                <p className="font-label text-xs sm:text-sm text-bone-dim mt-1">
                  Submissions are evaluated holistically by systems engineers and space architecture jurors across five core areas:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
                <div className="border border-bone/20 bg-ink-2 p-4 space-y-1">
                  <span className="text-crimson font-bold uppercase block">// Research &amp; Rigor</span>
                  <div className="font-display text-base text-bone uppercase">Physics &amp; Mechanics</div>
                  <p className="text-[11px] text-bone-dim font-sans">
                    Orbital mechanics accuracy, atmospheric pressure calculations, radiation attenuation physics, and authoritative scientific source citations.
                  </p>
                </div>

                <div className="border border-bone/20 bg-ink-2 p-4 space-y-1">
                  <span className="text-crimson font-bold uppercase block">// Systems Feasibility</span>
                  <div className="font-display text-base text-bone uppercase">Engineering Integrity</div>
                  <p className="text-[11px] text-bone-dim font-sans">
                    Closed ECLSS loops, thermal balance calculations, credible power budgets, and realistic construction logistics from start to finish.
                  </p>
                </div>

                <div className="border border-bone/20 bg-ink-2 p-4 space-y-1">
                  <span className="text-crimson font-bold uppercase block">// Innovation &amp; Habitat</span>
                  <div className="font-display text-base text-bone uppercase">Architecture &amp; Society</div>
                  <p className="text-[11px] text-bone-dim font-sans">
                    Novel structural geometries, human-factors thinking, psychological ergonomics, and resilient multi-generational civic institutions.
                  </p>
                </div>

                <div className="border border-bone/20 bg-ink-2 p-4 space-y-1">
                  <span className="text-crimson font-bold uppercase block">// Clarity &amp; Schematics</span>
                  <div className="font-display text-base text-bone uppercase">Technical Drafting</div>
                  <p className="text-[11px] text-bone-dim font-sans">
                    Standard technical drafting, annotated 2D/3D cutaways, clean typography, legible graphs, and professional presentation.
                  </p>
                </div>

                <div className="border border-bone/20 bg-ink-2 p-4 space-y-1 sm:col-span-2 lg:col-span-2">
                  <span className="text-crimson font-bold uppercase block">// Jury Defense</span>
                  <div className="font-display text-base text-bone uppercase">Live Cross-Examination</div>
                  <p className="text-[11px] text-bone-dim font-sans">
                    Command of architectural trade-offs, handling jury cross-examination, and team cohesion during the live defense round on campus.
                  </p>
                </div>
              </div>
            </div>

            {/* Academic Integrity & Regulations */}
            <div className="border border-bone/20 bg-ink-2 p-5 space-y-2 font-mono text-xs">
              <strong className="text-crimson block uppercase tracking-wider text-sm">
                Academic Integrity &amp; Generative AI Regulations
              </strong>
              <p className="text-bone-dim font-sans text-xs leading-relaxed">
                Generative AI tools may be utilized strictly as research, brainstorming, and editing assistants. All core architectural layouts, mass budgets, calculations, and systems engineering must be original student work. Every prompt and external software used must be transparently disclosed in the bibliography. Submitting unedited AI hallucinations or fabricated physics will result in immediate disqualification.
              </p>
            </div>

            {/* Contact POC */}
            <div className="pt-2 flex flex-wrap justify-between items-center gap-4 font-mono text-xs">
              <div className="text-bone-dim">
                Point of Contact: <strong className="text-bone">Arshia Barsain</strong> (<a href="mailto:r24333arshia@dpsrkp.net" className="text-crimson hover:underline">r24333arshia@dpsrkp.net</a>) · <a href="mailto:aeross@dpsrkp.net" className="text-bone hover:underline">aeross@dpsrkp.net</a>
              </div>
              <div className="flex gap-3">
                <Link to="/comps" className="px-4 py-2 border border-bone/40 text-bone uppercase">
                  ← Back to Comps
                </Link>
                <Link to="/submissions" className="px-5 py-2 bg-crimson text-bone-hi font-bold border border-crimson uppercase">
                  Deposit Proposal →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 02: MISSION RFPS */}
      {/* ======================================================== */}
      {activeSection === 'tracks' && (
        <div className="space-y-6">
          {/* Division Selector */}
          <div className="border-2 border-bone/40 bg-ink p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="font-mono text-xs text-crimson font-bold uppercase tracking-wider block">Division Selection</span>
              <span className="font-label text-sm text-bone-dim">Choose your category to inspect the 3 corresponding settlement mission RFPs.</span>
            </div>
            <div className="flex gap-2 w-full sm:w-auto font-mono text-xs font-bold uppercase">
              <button
                onClick={() => {
                  setDivision('junior');
                  setSelectedTrackId('j-fringe');
                }}
                className={`flex-1 sm:flex-initial px-5 py-2.5 border cursor-pointer ${
                  division === 'junior'
                    ? 'bg-bone text-ink border-bone'
                    : 'bg-ink-2 text-bone-dim border-bone/40 hover:text-bone'
                }`}
              >
                Junior (Grades 6–8)
              </button>
              <button
                onClick={() => {
                  setDivision('senior');
                  setSelectedTrackId('s-cradle');
                }}
                className={`flex-1 sm:flex-initial px-5 py-2.5 border cursor-pointer ${
                  division === 'senior'
                    ? 'bg-crimson text-bone-hi border-crimson'
                    : 'bg-ink-2 text-bone-dim border-bone/40 hover:text-bone'
                }`}
              >
                Senior (Grades 9–12)
              </button>
            </div>
          </div>

          {/* Track Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            {activeRfps.map((rfp) => (
              <button
                key={rfp.id}
                onClick={() => setSelectedTrackId(rfp.id)}
                className={`p-4 border text-left cursor-pointer ${
                  selectedTrackId === rfp.id
                    ? 'bg-ink border-crimson'
                    : 'bg-ink-2 border-bone/30 text-bone-dim hover:text-bone hover:border-bone/60'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-crimson">{rfp.code}</span>
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
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-crimson text-bone-hi">{currentRfp.code}</span>
                  <span className="font-mono text-xs uppercase px-2 py-0.5 border border-bone/40 text-bone-dim">
                    {currentRfp.trackName}
                  </span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl text-bone uppercase tracking-wider">
                  {currentRfp.title}
                </h2>
              </div>
              <div className="text-right font-mono text-xs text-bone-dim">
                <div>Target Site: <strong className="text-bone">{currentRfp.site}</strong></div>
                <div>Population: <strong className="text-crimson">{currentRfp.population}</strong></div>
              </div>
            </div>

            {/* Spec Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="bg-ink-2 p-3 border border-bone/20">
                <span className="text-bone-dim text-[10px] uppercase block">Location / Orbit</span>
                <strong className="text-bone">{currentRfp.site}</strong>
              </div>
              <div className="bg-ink-2 p-3 border border-bone/20">
                <span className="text-bone-dim text-[10px] uppercase block">Population Capacity</span>
                <strong className="text-bone">{currentRfp.population}</strong>
              </div>
              <div className="bg-ink-2 p-3 border border-bone/20">
                <span className="text-bone-dim text-[10px] uppercase block">Earth Comms Latency</span>
                <strong className="text-crimson">{currentRfp.delay}</strong>
              </div>
              <div className="bg-ink-2 p-3 border border-bone/20">
                <span className="text-bone-dim text-[10px] uppercase block">Solar Flux Density</span>
                <strong className="text-bone">{currentRfp.solarFlux}</strong>
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
              <h3 className="font-mono text-xs uppercase tracking-widest text-crimson font-bold">
                Binding Mission Constraints
              </h3>
              <ul className="space-y-2 font-mono text-xs text-bone-dim">
                {currentRfp.constraints.map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-crimson font-bold">▶</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Optional Extension Challenge */}
            <div className="border border-amber-500/40 bg-ink-2 p-5 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-widest">
                  ★ Optional Extension Challenge
                </span>
                <span className="font-mono text-[10px] text-bone-dim">Section B of Proposal</span>
              </div>
              <h4 className="font-display text-xl text-bone uppercase">{currentRfp.brownie.title}</h4>
              <p className="font-label text-xs sm:text-sm text-bone-dim leading-relaxed">
                {currentRfp.brownie.prompt}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 03: PROPOSAL GUIDE */}
      {/* ======================================================== */}
      {activeSection === 'template' && (
        <div className="space-y-8">
          <div className="border-2 border-bone/40 bg-ink p-6 sm:p-8 space-y-6">
            <div className="border-b border-bone/20 pb-4">
              <span className="font-mono text-xs text-crimson font-bold uppercase tracking-widest">Section 03</span>
              <h2 className="font-display text-3xl sm:text-4xl text-bone uppercase tracking-wider mt-1">
                Proposal Architecture &amp; Section Checklist
              </h2>
            </div>

            <p className="font-label text-sm text-bone-dim leading-relaxed max-w-3xl">
              Judges evaluate proposals against core engineering principles. Submissions that structure their proposals around these 7 core sections achieve higher clarity, systems integration, and document readability.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div className="border border-bone/20 bg-ink-2 p-4 space-y-1.5">
                <div className="text-crimson font-bold">SECTION 1.0 · EXECUTIVE SUMMARY &amp; MISSION SCOPE</div>
                <p className="text-[11px] text-bone-dim font-sans">
                  Statement of purpose, client alignment, selected RFP rationale, population demographics, settlement lifetime, and high-level architectural rendering.
                </p>
              </div>

              <div className="border border-bone/20 bg-ink-2 p-4 space-y-1.5">
                <div className="text-crimson font-bold">SECTION 2.0 · STRUCTURAL GEOMETRY &amp; ARTIFICIAL GRAVITY</div>
                <p className="text-[11px] text-bone-dim font-sans">
                  Geometric form (torus, cylinder, sphere, dumbbell), rotation radius, rotational speed (RPM), g-level distribution, material tensile calculations, and atmospheric pressure containment.
                </p>
              </div>

              <div className="border border-bone/20 bg-ink-2 p-4 space-y-1.5">
                <div className="text-crimson font-bold">SECTION 3.0 · ECLSS, BIOSPHERE &amp; WASTE CYCLES</div>
                <p className="text-[11px] text-bone-dim font-sans">
                  Complete chemical mass balance (water recovery, Sabatier O₂ loop, Bosch/electrolysis, nitrogen buffer), food production area per capita, and emergency resupply reserves.
                </p>
              </div>

              <div className="border border-bone/20 bg-ink-2 p-4 space-y-1.5">
                <div className="text-crimson font-bold">SECTION 4.0 · POWER, THERMAL &amp; RADIATION PROTECTION</div>
                <p className="text-[11px] text-bone-dim font-sans">
                  Total electrical budget (residential + industrial kW), generation tech (nuclear vs solar), waste heat radiator sizing, and passive/active radiation shielding against SPE/GCR.
                </p>
              </div>

              <div className="border border-bone/20 bg-ink-2 p-4 space-y-1.5">
                <div className="text-crimson font-bold">SECTION 5.0 · MASS BUDGET &amp; CONSTRUCTION TIMELINE</div>
                <p className="text-[11px] text-bone-dim font-sans">
                  Complete mass breakdown split by origin: Earth-launched high-precision equipment vs. in-situ harvested shielding and metals. Step-by-step assembly phases.
                </p>
              </div>

              <div className="border border-bone/20 bg-ink-2 p-4 space-y-1.5">
                <div className="text-crimson font-bold">SECTION 6.0 · HUMAN FACTORS, COMMUNITY &amp; GOVERNANCE</div>
                <p className="text-[11px] text-bone-dim font-sans">
                  Internal volume allocation per person, residential floorplans, medical and educational facilities, psychological recreation, legal framework, and emergency governance.
                </p>
              </div>

              <div className="border border-bone/20 bg-ink-2 p-4 space-y-1.5 md:col-span-2">
                <div className="text-amber-400 font-bold">SECTION B · OPTIONAL EXTENSION CHALLENGE</div>
                <p className="text-[11px] text-bone-dim font-sans">
                  Dedicated response answering your selected RFP&apos;s Extension Challenge. Maximum 3 pages, including schematics and operational logic.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 04: CHECKLIST */}
      {/* ======================================================== */}
      {activeSection === 'checklist' && (
        <div className="space-y-8">
          <div className="border-2 border-bone/40 bg-ink p-6 sm:p-8 space-y-6">
            <div className="border-b border-bone/20 pb-4">
              <span className="font-mono text-xs text-crimson font-bold uppercase tracking-widest">Section 04</span>
              <h2 className="font-display text-3xl sm:text-4xl text-bone uppercase tracking-wider mt-1">
                Preflight Submission Checklist
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {CHECKLIST_ITEMS.map((item) => (
                <label
                  key={item.id}
                  className="p-3.5 border border-bone bg-ink-2 text-bone flex items-start gap-3 select-none cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="mt-0.5 accent-crimson cursor-pointer"
                  />
                  <span className="font-mono text-xs leading-relaxed">
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
                className="px-6 py-2.5 bg-crimson text-bone-hi font-mono text-xs font-bold uppercase tracking-wider border border-crimson"
              >
                Go to Submission Vault →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
