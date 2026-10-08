import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

const NOSE_COEFF = {
  ogive: 0.466,
  cone: 0.666,
  parabolic: 0.5
};

const DEFAULT_PARAMS = {
  d: 24.8,
  lb: 320,
  shape: 'ogive',
  ln: 80,
  n: '3',
  cr: 60,
  ct: 30,
  s: 45,
  xr: 30,
  aft: 0,
  m: 40,
  cg: 260,
  mm: 44, // Estes D12-5 loaded mass (g)
  mp: 21, // Estes D12-5 propellant mass (g)
  lm: 70  // 24 x 70 mm casing
};

const CHECKLIST_ITEMS = [
  { id: 'c1', label: '.ork file submitted by 22 October 23:59:59 IST' },
  { id: 'c2', label: 'Estes D12-5 selected in the .ork, and every pre-made part declared' },
  { id: 'c3', label: 'Built rocket weighed and measured against the .ork design file' },
  { id: 'c4', label: 'Motor mount fits standard 24 × 70 mm casing with positive retainer hook' },
  { id: 'c5', label: 'Motor mount hollow and empty. Zero motors, igniters or propellants on campus' },
  { id: 'c6', label: 'Working parachute or streamer packed inside the airframe' },
  { id: 'c7', label: 'Laptop with OpenRocket and your file, fully charged for verification' },
  { id: 'c8', label: 'Token of Submission ready for event desk check-in' },
  { id: 'c9', label: 'Present at Welcome Foyer, DPS R.K. Puram by 07:45 AM' }
];

// Toggle flag to hide or show Barrowman Stability Lab without removing code
const SHOW_STABILITY_LAB = false;

const VALID_TABS = SHOW_STABILITY_LAB
  ? ['brief', 'motor', 'flow', 'checklist', 'judging', 'stability', 'rules']
  : ['brief', 'motor', 'flow', 'checklist', 'judging', 'rules'];

export default function RocketryPrompt() {
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return VALID_TABS.includes(hash) ? hash : 'brief';
  });
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [checkedItems, setCheckedItems] = useState({ c1: true, c2: true });

  // Handle URL hash changes from external links or browser history
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (VALID_TABS.includes(hash)) {
        setActiveTab(hash);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    window.history.replaceState(null, '', `#${tabId}`);
  };

  const handleParamChange = (key, val) => {
    setParams(prev => ({ ...prev, [key]: val }));
  };

  const resetParams = () => {
    setParams(DEFAULT_PARAMS);
  };

  const toggleCheck = (id) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const checkedCount = useMemo(() => {
    return Object.values(checkedItems).filter(Boolean).length;
  }, [checkedItems]);

  // Barrowman stability calculation
  const calc = useMemo(() => {
    const d = parseFloat(params.d);
    const lb = parseFloat(params.lb);
    const ln = parseFloat(params.ln);
    const n = parseInt(params.n, 10);
    const cr = parseFloat(params.cr);
    const ct = parseFloat(params.ct);
    const s = parseFloat(params.s);
    const xr = parseFloat(params.xr);
    const aft = parseFloat(params.aft);
    const m = parseFloat(params.m);
    const cg = parseFloat(params.cg);
    const mm = parseFloat(params.mm);
    const mp = parseFloat(params.mp);
    const lm = parseFloat(params.lm);
    const shape = params.shape;

    const ok = d > 0 && lb > 0 && ln > 0 && cr > 0 && ct >= 0 && s > 0 &&
      Number.isFinite(xr) && aft >= 0 && m > 0 && cg >= 0 &&
      mm >= 0 && mp >= 0 && mp <= mm && lm > 0;

    if (!ok) return { ok: false };

    const R = d / 2;
    const L = ln + lb;
    const CNn = 2;
    const Xn = (NOSE_COEFF[shape] || 0.466) * ln;
    const XB = L - aft - cr;
    const LF = Math.sqrt(s * s + Math.pow(xr + ct / 2 - cr / 2, 2));
    const CNf = (1 + R / (s + R)) * (4 * n * Math.pow(s / d, 2)) / (1 + Math.sqrt(1 + Math.pow(2 * LF / (cr + ct), 2)));
    const Xf = XB + xr * (cr + 2 * ct) / (3 * (cr + ct)) + (cr + ct - cr * ct / (cr + ct)) / 6;
    const CP = (CNn * Xn + CNf * Xf) / (CNn + CNf);
    const xm = L - lm / 2;
    const cg0 = (m * cg + mm * xm) / (m + mm);
    const mb = mm - mp;
    const cg1 = (m * cg + mb * xm) / (m + mb);
    const s0 = (CP - cg0) / d;
    const s1 = (CP - cg1) / d;

    return {
      ok: true,
      L,
      CP,
      cg0,
      cg1,
      s0,
      s1,
      XB,
      d,
      s,
      cr,
      ct,
      xr,
      ln,
      shape,
      lm
    };
  }, [params]);

  // Status helper
  const getStabilityStatus = (val) => {
    if (!Number.isFinite(val)) return { tag: '–', color: 'text-bone-dim' };
    if (val < 1.0) return { tag: 'BELOW 1.0 · UNDERSTABLE', color: 'text-crimson' };
    if (val > 2.5) return { tag: 'ABOVE 2.5 · OVERSTABLE', color: 'text-amber-500' };
    return { tag: 'IN BAND · OPTIMAL', color: 'text-emerald-500' };
  };

  const status0 = getStabilityStatus(calc.ok ? calc.s0 : NaN);
  const status1 = getStabilityStatus(calc.ok ? calc.s1 : NaN);

  // SVG rendering for rocket profile
  const profileSvg = useMemo(() => {
    if (!calc.ok) return null;

    const maxH = calc.d + 2 * calc.s;
    const k = Math.min(580 / calc.L, 120 / maxH);
    const x0 = 20;
    const cy = 90;
    const h = (calc.d * k) / 2;
    const xb = x0 + calc.ln * k;
    const xe = x0 + calc.L * k;

    const rootLE = x0 + calc.XB * k;
    const rootTE = rootLE + calc.cr * k;
    const tipLE = rootLE + calc.xr * k;
    const tipTE = tipLE + calc.ct * k;
    const sp = calc.s * k;

    // Nose cone path
    let nosePath = '';
    if (calc.shape === 'cone') {
      nosePath = `M${xb} ${cy - h} L${x0} ${cy} L${xb} ${cy + h} Z`;
    } else {
      const c = calc.shape === 'ogive' ? 0.15 : 0.35;
      nosePath = `M${xb} ${cy - h} C${x0 + (xb - x0) * c} ${cy - h} ${x0} ${cy - h * 0.35} ${x0} ${cy} C${x0} ${cy + h * 0.35} ${x0 + (xb - x0) * c} ${cy + h} ${xb} ${cy + h} Z`;
    }

    const xcp = x0 + calc.CP * k;
    const xcg0 = x0 + calc.cg0 * k;
    const xcg1 = x0 + calc.cg1 * k;
    const ml = Math.min(calc.lm, calc.L) * k;

    return (
      <svg viewBox="0 0 620 180" className="w-full h-auto select-none" role="img" aria-label="Rocket side profile diagram">
        {/* Top & Bottom Fins */}
        <path
          d={`M${rootLE} ${cy - h} L${tipLE} ${cy - h - sp} L${tipTE} ${cy - h - sp} L${rootTE} ${cy - h} Z`}
          className="fill-crimson/20 stroke-crimson"
          strokeWidth="1.5"
        />
        <path
          d={`M${rootLE} ${cy + h} L${tipLE} ${cy + h + sp} L${tipTE} ${cy + h + sp} L${rootTE} ${cy + h} Z`}
          className="fill-crimson/20 stroke-crimson"
          strokeWidth="1.5"
        />

        {/* Body Tube */}
        <rect
          x={xb}
          y={cy - h}
          width={xe - xb}
          height={2 * h}
          className="fill-ink-2 stroke-bone"
          strokeWidth="1.5"
        />

        {/* Nose Cone */}
        <path d={nosePath} className="fill-ink-2 stroke-bone" strokeWidth="1.5" />

        {/* Motor Bay Placeholder */}
        <rect
          x={xe - ml}
          y={cy - h * 0.6}
          width={ml}
          height={h * 1.2}
          fill="none"
          className="stroke-crimson"
          strokeWidth="1.2"
          strokeDasharray="4 3"
        />

        {/* CG Liftoff */}
        <g transform={`translate(${xcg0}, ${cy})`}>
          <circle r="6" className="fill-ink stroke-cyan-400" strokeWidth="1.5" />
          <path d="M0 -6 A6 6 0 0 1 6 0 L0 0 Z M0 6 A6 6 0 0 1 -6 0 L0 0 Z" className="fill-cyan-400" />
          <line x1="0" y1="8" x2="0" y2="70" className="stroke-cyan-400" strokeWidth="1" strokeDasharray="2 2" />
          <text x="0" y="80" textAnchor="middle" className="font-mono text-[10px] fill-cyan-400 font-bold">CG₀ {calc.cg0.toFixed(0)}mm</text>
        </g>

        {/* CG Burnout */}
        <g transform={`translate(${xcg1}, ${cy})`}>
          <circle r="5" className="fill-ink stroke-sky-300" strokeWidth="1.2" />
          <path d="M0 -5 A5 5 0 0 1 5 0 L0 0 Z M0 5 A5 5 0 0 1 -5 0 L0 0 Z" className="fill-sky-300" />
          <line x1="0" y1="7" x2="0" y2="52" className="stroke-sky-300" strokeWidth="1" strokeDasharray="2 2" />
          <text x="0" y="62" textAnchor="middle" className="font-mono text-[9px] fill-sky-300">CG₁ {calc.cg1.toFixed(0)}mm</text>
        </g>

        {/* CP Center of Pressure */}
        <g transform={`translate(${xcp}, ${cy})`}>
          <circle r="6" className="fill-ink stroke-crimson" strokeWidth="1.5" />
          <circle r="2.5" className="fill-crimson" />
          <line x1="0" y1="-8" x2="0" y2="-65" className="stroke-crimson" strokeWidth="1" strokeDasharray="2 2" />
          <text x="0" y="-70" textAnchor="middle" className="font-mono text-[10px] fill-crimson font-bold">CP {calc.CP.toFixed(0)}mm</text>
        </g>
      </svg>
    );
  }, [calc]);

  const navTabs = [
    { id: 'brief', num: '01', label: 'The Build', sub: 'Brief & divisions' },
    { id: 'motor', num: '02', label: 'Motor Specs', sub: 'Dimensions & rules' },
    { id: 'flow', num: '03', label: 'Event Day', sub: 'Inspect & simulate' },
    { id: 'checklist', num: '04', label: 'Checklist', sub: 'Readiness audit' },
    { id: 'judging', num: '05', label: 'Judging', sub: 'Points & rubric' },
    ...(SHOW_STABILITY_LAB ? [{ id: 'stability', num: '06', label: 'Stability Lab', sub: 'Barrowman solver' }] : []),
    { id: 'rules', num: SHOW_STABILITY_LAB ? '07' : '06', label: 'Regulations', sub: 'Submission & POC' }
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Top Breadcrumb & Telemetry */}
      <div className="border-b-2 border-bone/30 pb-3 flex flex-wrap justify-between items-center gap-3 font-mono text-xs text-bone-dim">
        <div className="flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-crimson transition-colors">CELESTECON 2026</Link>
          <span className="text-bone/40">/</span>
          <Link to="/comps" className="hover:text-crimson transition-colors">THE COMPS</Link>
          <span className="text-bone/40">/</span>
          <Link to="/prompts" className="hover:text-crimson transition-colors">PROMPTS</Link>
          <span className="text-bone/40">/</span>
          <span className="text-crimson font-bold">EVENT 07 · ROCKETRY</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/submissions" className="text-crimson hover:text-bone transition-colors font-bold uppercase tracking-widest text-[11px]">
            Submission Portal →
          </Link>
          <span className="border border-bone/40 px-2 py-0.5 text-bone font-bold text-[10px] uppercase">
            ONSITE · 24 OCT 2026
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-b-2 border-bone/20 pb-8">
        <div className="lg:col-span-8 space-y-4">
          <div className="inline-flex items-center gap-2 border border-crimson px-3 py-1 font-mono text-xs uppercase tracking-widest text-crimson font-bold bg-crimson/10">
            <span>Official Technical Brief</span>
            <span>·</span>
            <span>Ref: CC26-ROC-07</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl uppercase tracking-wider text-bone leading-tight">
            ROCKETRY <span className="text-crimson">MODEL &amp; FLIGHT</span>
          </h1>
          <p className="font-mono text-xs sm:text-sm uppercase tracking-widest text-crimson font-bold">
            Model build &amp; OpenRocket digital aerodynamics
          </p>
          <p className="font-label text-base sm:text-lg text-bone-dim leading-relaxed max-w-3xl">
            Design and construct a high-performance scale model rocket around a supplied standard motor cavity—without ever fitting it.
            On competition day, arbiters physically scrutineer your physical airframe, weigh dry parameters, and compute flight telemetry in OpenRocket. <strong className="text-bone font-bold">No real motors are fired on campus.</strong>
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            {SHOW_STABILITY_LAB ? (
              <button
                onClick={() => handleTabChange('stability')}
                className="px-5 py-2.5 bg-crimson text-bone font-label font-bold text-sm uppercase tracking-widest border border-crimson hover:bg-ink hover:text-crimson transition-all cursor-pointer shadow-lg hover:shadow-crimson/20"
              >
                Open Stability Estimator →
              </button>
            ) : (
              <button
                onClick={() => handleTabChange('motor')}
                className="px-5 py-2.5 bg-crimson text-bone font-label font-bold text-sm uppercase tracking-widest border border-crimson hover:bg-ink hover:text-crimson transition-all cursor-pointer shadow-lg hover:shadow-crimson/20"
              >
                Motor Specifications →
              </button>
            )}
            <button
              onClick={() => handleTabChange('checklist')}
              className="px-5 py-2.5 bg-ink-2 text-bone font-label font-bold text-sm uppercase tracking-widest border border-bone/40 hover:border-crimson hover:text-crimson transition-all cursor-pointer"
            >
              Pre-Flight Checklist ({checkedCount}/8)
            </button>
          </div>
        </div>

        {/* Flight Card Aside */}
        <aside className="lg:col-span-4 bg-ink-2 border-2 border-bone p-5 space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-bone/20 pb-2">
            <span className="font-mono text-xs uppercase tracking-widest text-bone-dim font-bold">Flight Card</span>
            <span className="font-mono text-xs text-crimson font-bold">07 · CC26</span>
          </div>
          <dl className="grid grid-cols-2 gap-y-3 font-mono text-xs">
            <dt className="text-bone-dim uppercase">Junior Div</dt>
            <dd className="font-bold text-bone text-right">Grades 6–8</dd>
            <dt className="text-bone-dim uppercase">Senior Div</dt>
            <dd className="font-bold text-bone text-right">Grades 9–12</dd>
            <dt className="text-bone-dim uppercase">Team Roster</dt>
            <dd className="font-bold text-bone text-right">2–3 Students</dd>
            <dt className="text-bone-dim uppercase">Format</dt>
            <dd className="font-bold text-bone text-right">Onsite Finale</dd>
            <dt className="text-bone-dim uppercase">Event Date</dt>
            <dd className="font-bold text-crimson text-right">24 Oct 2026</dd>
            <dt className="text-bone-dim uppercase">Lead Arbiter</dt>
            <dd className="font-bold text-bone text-right truncate">Farzooque Hasan</dd>
          </dl>
          <div className="border-t border-bone/20 pt-3">
            <div className="text-[11px] font-mono text-bone-dim uppercase tracking-wider mb-1">Lead Contact POC</div>
            <a
              href="mailto:r25246farzooque@dpsrkp.net"
              className="font-mono text-xs text-crimson hover:text-bone transition-colors underline break-all font-bold"
            >
              r25246farzooque@dpsrkp.net
            </a>
          </div>
        </aside>
      </div>

      {/* Main Grid: Tabs + Content Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Tower */}
        <nav className="lg:col-span-3 sticky top-20 bg-ink-2 border-2 border-bone p-3 space-y-1 shadow-lg" aria-label="Rocketry sections">
          <div className="font-mono text-[11px] text-bone-dim uppercase tracking-widest px-2 py-1 font-bold border-b border-bone/20 mb-2">
            Mission Sections
          </div>
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1.5 pb-2 lg:pb-0 scrollbar-none">
            {navTabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full text-left px-3 py-2.5 transition-all flex items-center gap-3 cursor-pointer border ${active
                    ? 'bg-crimson text-bone font-bold border-crimson shadow-md'
                    : 'bg-ink text-bone-dim hover:text-bone hover:border-bone/50 border-bone/20'
                    }`}
                >
                  <span className={`font-mono text-xs px-1.5 py-0.5 border ${active ? 'bg-bone text-ink border-bone font-bold' : 'border-bone/30 text-bone-dim'
                    }`}>
                    {tab.num}
                  </span>
                  <div className="min-w-0">
                    <div className="font-label text-sm uppercase tracking-wider font-bold truncate leading-tight">
                      {tab.label}
                    </div>
                    <div className="font-mono text-[10px] opacity-75 truncate hidden sm:block">
                      {tab.sub}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Dynamic Panels */}
        <div className="lg:col-span-9 bg-ink-2 border-2 border-bone p-6 sm:p-8 space-y-8 shadow-xl min-w-0">
          {/* TAB 01: THE BUILD */}
          {activeTab === 'brief' && (
            <section className="space-y-6 animate-fadeIn">
              <div className="border-b border-bone/20 pb-4">
                <span className="font-mono text-xs text-crimson font-bold uppercase tracking-widest">Section 01</span>
                <h2 className="font-display text-3xl sm:text-4xl text-bone uppercase tracking-wider mt-1">
                  Build Regulations &amp; Mission Mandate
                </h2>
              </div>
              <p className="font-label text-base text-bone-dim leading-relaxed">
                Teams design and build a model rocket to achieve maximum aerodynamic performance. In this competition,
                airframes are judged by precise dimensional measurements, build quality, and flight simulation in OpenRocket
                using standard motors. No motors are ignited at DPS R.K. Puram.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div className="bg-ink p-4 border border-bone/30 space-y-1">
                  <div className="text-bone-dim uppercase">Design Philosophy</div>
                  <div className="font-bold text-bone text-sm">Low Drag + Stability</div>
                  <p className="font-label text-xs text-bone-dim normal-case pt-1">
                    Balance fin span with wet body drag; aim for 1.2–2.0 calibers margin.
                  </p>
                </div>
                <div className="bg-ink p-4 border border-bone/30 space-y-1">
                  <div className="text-bone-dim uppercase">Motor Fitment</div>
                  <div className="font-bold text-crimson text-sm">Supplied Standard</div>
                  <p className="font-label text-xs text-bone-dim normal-case pt-1">
                    Standard 18 mm or 24 mm casing specification provided beforehand.
                  </p>
                </div>
                <div className="bg-ink p-4 border border-bone/30 space-y-1">
                  <div className="text-bone-dim uppercase">Recovery System</div>
                  <div className="font-bold text-bone text-sm">Parachute / Streamer</div>
                  <p className="font-label text-xs text-bone-dim normal-case pt-1">
                    Must declare ejection deployment geometry in simulation.
                  </p>
                </div>
              </div>

              {/* Profile Diagram Preview */}
              <div className="bg-ink p-4 border border-bone/30 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono text-bone-dim">
                  <span className="font-bold uppercase tracking-wider">Reference Rocket Geometry</span>
                  <span className="text-crimson font-bold">Barrowman Standard Axis</span>
                </div>
                <div className="overflow-x-auto py-2">
                  {profileSvg}
                </div>
              </div>

              <div className="border-t border-bone/20 pt-4 flex justify-between">
                <div></div>
                <button
                  onClick={() => handleTabChange('motor')}
                  className="font-label text-xs uppercase tracking-widest text-crimson hover:text-bone transition-colors font-bold cursor-pointer"
                >
                  Next: Motor Specs &amp; Rules →
                </button>
              </div>
            </section>
          )}

          {/* TAB 02: MOTOR */}
          {activeTab === 'motor' && (
            <section className="space-y-6 animate-fadeIn">
              <div className="border-b border-bone/20 pb-4">
                <span className="font-mono text-xs text-crimson font-bold uppercase tracking-widest">Section 02</span>
                <h2 className="font-display text-3xl sm:text-4xl text-bone uppercase tracking-wider mt-1">
                  Motor Specifications &amp; Restrictions
                </h2>
              </div>
              <div className="bg-crimson/10 border-l-4 border-crimson p-4">
                <h4 className="font-label font-bold text-crimson uppercase tracking-wider text-sm mb-1">
                  Safety Mandate: Absolute Zero Live Motors On Campus
                </h4>
                <p className="font-label text-xs sm:text-sm text-bone leading-relaxed">
                  None of these come onto campus: <strong>Motors, Propellant, Black powder, Igniters, Pressurised containers.</strong> Bring any live combustible item to DPS R.K. Puram and your school is disqualified on the spot. The motor mount stays completely empty.
                </p>
              </div>

              {/* Motor Specs Grid */}
              <div className="bg-ink p-5 border border-bone/30 space-y-4">
                <div className="flex justify-between items-start flex-wrap gap-2 border-b border-bone/20 pb-3">
                  <div>
                    <h3 className="font-display text-2xl text-bone uppercase">The Motor: Estes D12-5</h3>
                    <p className="font-label text-xs text-bone-dim mt-0.5">
                      Same standard motor for every team across Junior and Senior divisions. Select it directly from OpenRocket's built-in motor catalogue.
                    </p>
                  </div>
                  <span className="font-mono text-xs px-2.5 py-1 bg-crimson text-bone-hi font-bold">24 × 70 MM CASING</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                  <div className="bg-ink-2 p-3 border border-bone/20">
                    <span className="text-bone-dim text-[11px] block uppercase">Diameter</span>
                    <strong className="text-bone text-base">24 mm</strong>
                  </div>
                  <div className="bg-ink-2 p-3 border border-bone/20">
                    <span className="text-bone-dim text-[11px] block uppercase">Length</span>
                    <strong className="text-bone text-base">70 mm</strong>
                  </div>
                  <div className="bg-ink-2 p-3 border border-bone/20">
                    <span className="text-bone-dim text-[11px] block uppercase">Loaded Mass</span>
                    <strong className="text-bone text-base">≈ 44 g</strong>
                  </div>
                  <div className="bg-ink-2 p-3 border border-bone/20">
                    <span className="text-bone-dim text-[11px] block uppercase">Propellant</span>
                    <strong className="text-bone text-base">≈ 21 g</strong>
                  </div>
                  <div className="bg-ink-2 p-3 border border-bone/20">
                    <span className="text-bone-dim text-[11px] block uppercase">Total Impulse</span>
                    <strong className="text-bone text-base">≈ 16.8 N·s</strong>
                  </div>
                  <div className="bg-ink-2 p-3 border border-bone/20">
                    <span className="text-bone-dim text-[11px] block uppercase">Avg Thrust</span>
                    <strong className="text-bone text-base">≈ 10 N</strong>
                  </div>
                  <div className="bg-ink-2 p-3 border border-bone/20">
                    <span className="text-bone-dim text-[11px] block uppercase">Burn Time</span>
                    <strong className="text-bone text-base">≈ 1.7 s</strong>
                  </div>
                  <div className="bg-ink-2 p-3 border border-bone/20">
                    <span className="text-bone-dim text-[11px] block uppercase">Parachute Delay</span>
                    <strong className="text-crimson text-base">5 s</strong>
                  </div>
                </div>

                <p className="font-mono text-[11px] text-bone-dim/90 pt-1">
                  Figures calibrated from ThrustCurve.org (OpenRocket's core dataset). Rated by Estes for up to 283 g liftoff mass. The parachute ejection charge fires exactly 5 s after motor burnout.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-ink p-4 border border-bone/30 space-y-3">
                  <h4 className="font-mono text-xs text-emerald-400 uppercase tracking-wider font-bold">
                    ✓ Permitted Materials &amp; Construction
                  </h4>
                  <ul className="space-y-2 font-label text-sm text-bone-dim list-disc pl-4">
                    <li>Rockets hand-built by student team members</li>
                    <li>Pre-made body tubes, nose cones or centering rings (must be declared in .ork)</li>
                    <li>Balsa wood, basswood, cardstock, Kraft tubing, fiberglass laminates</li>
                    <li>3D printed components (PLA, PETG, ABS, Resin)</li>
                    <li>Parachute or streamer packed inside the body ready for ejection</li>
                  </ul>
                </div>
                <div className="bg-ink p-4 border border-bone/30 space-y-3">
                  <h4 className="font-mono text-xs text-crimson uppercase tracking-wider font-bold">
                    ✕ Strictly Prohibited Materials
                  </h4>
                  <ul className="space-y-2 font-label text-sm text-bone-dim list-disc pl-4">
                    <li>Ready-to-fly (RTF) commercial off-the-shelf rocket kits</li>
                    <li>Undeclared commercial components or unverified materials</li>
                    <li>Custom or edited motor thrust curve files in the .ork design</li>
                    <li>Metal nose cones or metallic structural airframes</li>
                    <li>Any live motor, propellant, black powder, squib or igniter on site</li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-bone/20 pt-4 flex justify-between">
                <button
                  onClick={() => handleTabChange('brief')}
                  className="font-label text-xs uppercase tracking-widest text-bone-dim hover:text-bone transition-colors cursor-pointer"
                >
                  ← Previous: The Build
                </button>
                <button
                  onClick={() => handleTabChange('flow')}
                  className="font-label text-xs uppercase tracking-widest text-crimson hover:text-bone transition-colors font-bold cursor-pointer"
                >
                  Next: Event-Day Flow →
                </button>
              </div>
            </section>
          )}

          {/* TAB 03: EVENT DAY FLOW */}
          {activeTab === 'flow' && (
            <section className="space-y-6 animate-fadeIn">
              <div className="border-b border-bone/20 pb-4">
                <span className="font-mono text-xs text-crimson font-bold uppercase tracking-widest">Section 03</span>
                <h2 className="font-display text-3xl sm:text-4xl text-bone uppercase tracking-wider mt-1">
                  Event-Day Scrutineering Pipeline
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-ink p-5 border border-bone/30 space-y-2">
                  <div className="font-mono text-xs text-crimson font-bold">STAGE 01</div>
                  <h3 className="font-label font-bold text-base text-bone uppercase">Physical Sizing</h3>
                  <p className="font-label text-xs text-bone-dim leading-relaxed">
                    Judges measure overall length, body outer diameter, fin chord lengths, fin span, and root sweep with digital calipers.
                  </p>
                </div>
                <div className="bg-ink p-5 border border-bone/30 space-y-2">
                  <div className="font-mono text-xs text-crimson font-bold">STAGE 02</div>
                  <h3 className="font-label font-bold text-base text-bone uppercase">Weight &amp; Balance</h3>
                  <p className="font-label text-xs text-bone-dim leading-relaxed">
                    Weighing the empty airframe on a precision digital balance. Verification of experimentally marked dry Center of Gravity (CG).
                  </p>
                </div>
                <div className="bg-ink p-5 border border-bone/30 space-y-2">
                  <div className="font-mono text-xs text-crimson font-bold">STAGE 03</div>
                  <h3 className="font-label font-bold text-base text-bone uppercase">Digital Flight</h3>
                  <p className="font-label text-xs text-bone-dim leading-relaxed">
                    Arbiters load the measured geometry into OpenRocket and execute digital launch simulations to determine apogee, speed, and stability.
                  </p>
                </div>
              </div>

              <div className="bg-ink p-4 border border-bone/30 font-mono text-xs text-bone-dim space-y-1">
                <span className="text-crimson font-bold">Note for Participants:</span>
                <p>
                  Bring your primary laptop with OpenRocket installed and the exact .ork file matching your airframe.
                  Judges will compare measured physical dimensions with your uploaded file.
                </p>
              </div>

              <div className="border-t border-bone/20 pt-4 flex justify-between">
                <button
                  onClick={() => handleTabChange('motor')}
                  className="font-label text-xs uppercase tracking-widest text-bone-dim hover:text-bone transition-colors cursor-pointer"
                >
                  ← Previous: Motor Specs
                </button>
                <button
                  onClick={() => handleTabChange('checklist')}
                  className="font-label text-xs uppercase tracking-widest text-crimson hover:text-bone transition-colors font-bold cursor-pointer"
                >
                  Next: Checklist →
                </button>
              </div>
            </section>
          )}

          {/* TAB 04: CHECKLIST */}
          {activeTab === 'checklist' && (
            <section className="space-y-6 animate-fadeIn">
              <div className="border-b border-bone/20 pb-4 flex justify-between items-end flex-wrap gap-2">
                <div>
                  <span className="font-mono text-xs text-crimson font-bold uppercase tracking-widest">Section 04</span>
                  <h2 className="font-display text-3xl sm:text-4xl text-bone uppercase tracking-wider mt-1">
                    Pre-Flight Readiness Checklist
                  </h2>
                </div>
                <div className="font-mono text-xs text-bone bg-ink px-3 py-1 border border-bone/40 font-bold">
                  {checkedCount} / {CHECKLIST_ITEMS.length} Confirmed
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-ink border border-bone/30 h-3 overflow-hidden">
                <div
                  className="bg-crimson h-full transition-all duration-300"
                  style={{ width: `${(checkedCount / CHECKLIST_ITEMS.length) * 100}%` }}
                ></div>
              </div>

              <div className="space-y-2">
                {CHECKLIST_ITEMS.map((item) => {
                  const isChecked = !!checkedItems[item.id];
                  return (
                    <label
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      className={`flex items-start gap-3 p-3.5 border transition-all cursor-pointer select-none ${isChecked
                        ? 'bg-ink border-bone/40 text-bone'
                        : 'bg-ink/50 border-bone/20 text-bone-dim hover:border-bone/40'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => { }}
                        className="mt-0.5 w-4 h-4 accent-crimson cursor-pointer"
                      />
                      <span className={`font-label text-sm leading-relaxed ${isChecked ? 'line-through text-bone-dim' : 'text-bone'}`}>
                        {item.label}
                      </span>
                    </label>
                  );
                })}
              </div>

              <div className="border-t border-bone/20 pt-4 flex justify-between">
                <button
                  onClick={() => handleTabChange('flow')}
                  className="font-label text-xs uppercase tracking-widest text-bone-dim hover:text-bone transition-colors cursor-pointer"
                >
                  ← Previous: Event Day
                </button>
                <button
                  onClick={() => handleTabChange('judging')}
                  className="font-label text-xs uppercase tracking-widest text-crimson hover:text-bone transition-colors font-bold cursor-pointer"
                >
                  Next: Judging Rubric →
                </button>
              </div>
            </section>
          )}

          {/* TAB 05: JUDGING */}
          {activeTab === 'judging' && (
            <section className="space-y-6 animate-fadeIn">
              <div className="border-b border-bone/20 pb-4">
                <span className="font-mono text-xs text-crimson font-bold uppercase tracking-widest">Section 05</span>
                <h2 className="font-display text-3xl sm:text-4xl text-bone uppercase tracking-wider mt-1">
                  Judging Criteria &amp; Scoring Distribution
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-ink p-5 border-t-4 border-crimson border-r border-b border-l border-bone/30 space-y-3">
                  <div className="font-mono text-xs text-crimson font-bold uppercase tracking-wider">Criterion A</div>
                  <h3 className="font-label font-bold text-lg text-bone uppercase">Simulated Flight Performance</h3>
                  <ul className="space-y-1.5 font-label text-xs sm:text-sm text-bone-dim list-disc pl-4 leading-relaxed">
                    <li>Maximum apogee altitude achieved under standardized simulation conditions</li>
                    <li>Stability margin strictly held between 1.0 and 2.5 calibers throughout motor burn</li>
                    <li>Stable flight trajectory using your measured physical parameters</li>
                  </ul>
                </div>
                <div className="bg-ink p-5 border-t-4 border-bone border-r border-b border-l border-bone/30 space-y-3">
                  <div className="font-mono text-xs text-bone-dim font-bold uppercase tracking-wider">Criterion B</div>
                  <h3 className="font-label font-bold text-lg text-bone uppercase">Digital-to-Physical Fidelity</h3>
                  <ul className="space-y-1.5 font-label text-xs sm:text-sm text-bone-dim list-disc pl-4 leading-relaxed">
                    <li>How closely the physical build matches your submitted .ork file</li>
                    <li>Cross-verified with digital calipers and precision scale</li>
                    <li>Unexplained parameter discrepancies penalize points</li>
                  </ul>
                </div>
                <div className="bg-ink p-5 border-t-4 border-bone-dim border-r border-b border-l border-bone/30 space-y-3">
                  <div className="font-mono text-xs text-bone-dim font-bold uppercase tracking-wider">Criterion C</div>
                  <h3 className="font-label font-bold text-lg text-bone uppercase">Build Quality &amp; Craftsmanship</h3>
                  <ul className="space-y-1.5 font-label text-xs sm:text-sm text-bone-dim list-disc pl-4 leading-relaxed">
                    <li>Fin alignment, fin fillet strength, and resistance to flutter</li>
                    <li>Aerodynamic surface finish and clean external geometry</li>
                    <li>Properly sized and securely packed parachute / streamer recovery system</li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-bone/20 pt-4 flex justify-between">
                <button
                  onClick={() => handleTabChange('checklist')}
                  className="font-label text-xs uppercase tracking-widest text-bone-dim hover:text-bone transition-colors cursor-pointer"
                >
                  ← Previous: Checklist
                </button>
                <button
                  onClick={() => handleTabChange(SHOW_STABILITY_LAB ? 'stability' : 'rules')}
                  className="font-label text-xs uppercase tracking-widest text-crimson hover:text-bone transition-colors font-bold cursor-pointer"
                >
                  {SHOW_STABILITY_LAB ? 'Next: Stability Lab →' : 'Next: Regulations & Contacts →'}
                </button>
              </div>
            </section>
          )}

          {/* TAB 06: STABILITY LAB (HIDDEN - CODE PRESERVED) */}
          {SHOW_STABILITY_LAB && activeTab === 'stability' && (
            <section className="space-y-6 animate-fadeIn">
              <div className="border-b border-bone/20 pb-4 flex justify-between items-end flex-wrap gap-2">
                <div>
                  <span className="font-mono text-xs text-crimson font-bold uppercase tracking-widest">Section 06</span>
                  <h2 className="font-display text-3xl sm:text-4xl text-bone uppercase tracking-wider mt-1">
                    Barrowman Stability Lab
                  </h2>
                </div>
                <button
                  onClick={resetParams}
                  className="font-mono text-xs text-crimson hover:text-bone transition-colors border border-crimson px-3 py-1 cursor-pointer font-bold uppercase"
                >
                  Reset Defaults
                </button>
              </div>

              <p className="font-label text-sm text-bone-dim">
                Real-time Barrowman equation solver. Adjust airframe and fin parameters below to verify that your rocket remains inside the optimal stability corridor (1.0 – 2.5 calibers).
              </p>

              {/* Calculator Inputs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-ink p-5 border border-bone/30">
                {/* Airframe Group */}
                <div className="space-y-4">
                  <h4 className="font-mono text-xs text-crimson uppercase tracking-wider font-bold border-b border-bone/20 pb-1">
                    Body &amp; Nose Cone
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-mono text-[11px] text-bone-dim mb-1">Diameter (mm)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={params.d}
                        onChange={(e) => handleParamChange('d', e.target.value)}
                        className="w-full bg-ink-2 border border-bone/40 p-2 font-mono text-sm text-bone focus:border-crimson outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] text-bone-dim mb-1">Body Length (mm)</label>
                      <input
                        type="number"
                        value={params.lb}
                        onChange={(e) => handleParamChange('lb', e.target.value)}
                        className="w-full bg-ink-2 border border-bone/40 p-2 font-mono text-sm text-bone focus:border-crimson outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] text-bone-dim mb-1">Nose Length (mm)</label>
                      <input
                        type="number"
                        value={params.ln}
                        onChange={(e) => handleParamChange('ln', e.target.value)}
                        className="w-full bg-ink-2 border border-bone/40 p-2 font-mono text-sm text-bone focus:border-crimson outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] text-bone-dim mb-1">Nose Shape</label>
                      <select
                        value={params.shape}
                        onChange={(e) => handleParamChange('shape', e.target.value)}
                        className="w-full bg-ink-2 border border-bone/40 p-2 font-mono text-sm text-bone focus:border-crimson outline-none cursor-pointer"
                      >
                        <option value="ogive">Ogive (Standard)</option>
                        <option value="cone">Conical</option>
                        <option value="parabolic">Parabolic</option>
                      </select>
                    </div>
                  </div>

                  <h4 className="font-mono text-xs text-crimson uppercase tracking-wider font-bold border-b border-bone/20 pb-1 pt-2">
                    Mass &amp; Dry CG
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-mono text-[11px] text-bone-dim mb-1">Dry Mass (g)</label>
                      <input
                        type="number"
                        value={params.m}
                        onChange={(e) => handleParamChange('m', e.target.value)}
                        className="w-full bg-ink-2 border border-bone/40 p-2 font-mono text-sm text-bone focus:border-crimson outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] text-bone-dim mb-1">Dry CG from Nose (mm)</label>
                      <input
                        type="number"
                        value={params.cg}
                        onChange={(e) => handleParamChange('cg', e.target.value)}
                        className="w-full bg-ink-2 border border-bone/40 p-2 font-mono text-sm text-bone focus:border-crimson outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Fins & Motor Group */}
                <div className="space-y-4">
                  <h4 className="font-mono text-xs text-crimson uppercase tracking-wider font-bold border-b border-bone/20 pb-1">
                    Fin Geometry
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-mono text-[11px] text-bone-dim mb-1">Fin Count</label>
                      <select
                        value={params.n}
                        onChange={(e) => handleParamChange('n', e.target.value)}
                        className="w-full bg-ink-2 border border-bone/40 p-2 font-mono text-sm text-bone focus:border-crimson outline-none cursor-pointer"
                      >
                        <option value="3">3 Fins</option>
                        <option value="4">4 Fins</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] text-bone-dim mb-1">Fin Span (mm)</label>
                      <input
                        type="number"
                        value={params.s}
                        onChange={(e) => handleParamChange('s', e.target.value)}
                        className="w-full bg-ink-2 border border-bone/40 p-2 font-mono text-sm text-bone focus:border-crimson outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] text-bone-dim mb-1">Root Chord (mm)</label>
                      <input
                        type="number"
                        value={params.cr}
                        onChange={(e) => handleParamChange('cr', e.target.value)}
                        className="w-full bg-ink-2 border border-bone/40 p-2 font-mono text-sm text-bone focus:border-crimson outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] text-bone-dim mb-1">Tip Chord (mm)</label>
                      <input
                        type="number"
                        value={params.ct}
                        onChange={(e) => handleParamChange('ct', e.target.value)}
                        className="w-full bg-ink-2 border border-bone/40 p-2 font-mono text-sm text-bone focus:border-crimson outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] text-bone-dim mb-1">Sweep (mm)</label>
                      <input
                        type="number"
                        value={params.xr}
                        onChange={(e) => handleParamChange('xr', e.target.value)}
                        className="w-full bg-ink-2 border border-bone/40 p-2 font-mono text-sm text-bone focus:border-crimson outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] text-bone-dim mb-1">Aft Distance (mm)</label>
                      <input
                        type="number"
                        value={params.aft}
                        onChange={(e) => handleParamChange('aft', e.target.value)}
                        className="w-full bg-ink-2 border border-bone/40 p-2 font-mono text-sm text-bone focus:border-crimson outline-none"
                      />
                    </div>
                  </div>

                  <h4 className="font-mono text-xs text-crimson uppercase tracking-wider font-bold border-b border-bone/20 pb-1 pt-2">
                    Supplied Motor Simulation Model
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block font-mono text-[10px] text-bone-dim mb-1">Loaded Mass (g)</label>
                      <input
                        type="number"
                        value={params.mm}
                        onChange={(e) => handleParamChange('mm', e.target.value)}
                        className="w-full bg-ink-2 border border-bone/40 p-2 font-mono text-xs text-bone focus:border-crimson outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] text-bone-dim mb-1">Propellant (g)</label>
                      <input
                        type="number"
                        value={params.mp}
                        onChange={(e) => handleParamChange('mp', e.target.value)}
                        className="w-full bg-ink-2 border border-bone/40 p-2 font-mono text-xs text-bone focus:border-crimson outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] text-bone-dim mb-1">Length (mm)</label>
                      <input
                        type="number"
                        value={params.lm}
                        onChange={(e) => handleParamChange('lm', e.target.value)}
                        className="w-full bg-ink-2 border border-bone/40 p-2 font-mono text-xs text-bone focus:border-crimson outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Readouts & Live Gauge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-ink p-4 border border-bone/30 space-y-1">
                  <div className="font-mono text-xs text-bone-dim uppercase">Margin at Liftoff (Full Motor)</div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-3xl font-bold text-bone">
                      {calc.ok ? calc.s0.toFixed(2) : '–'}
                    </span>
                    <span className="font-mono text-xs text-bone-dim">calibers</span>
                  </div>
                  <div className={`font-mono text-xs font-bold uppercase tracking-wider ${status0.color}`}>
                    {status0.tag}
                  </div>
                </div>
                <div className="bg-ink p-4 border border-bone/30 space-y-1">
                  <div className="font-mono text-xs text-bone-dim uppercase">Margin at Burnout (Empty Motor)</div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-3xl font-bold text-bone">
                      {calc.ok ? calc.s1.toFixed(2) : '–'}
                    </span>
                    <span className="font-mono text-xs text-bone-dim">calibers</span>
                  </div>
                  <div className={`font-mono text-xs font-bold uppercase tracking-wider ${status1.color}`}>
                    {status1.tag}
                  </div>
                </div>
              </div>

              {/* Dynamic Rocket Visualizer */}
              <div className="bg-ink p-4 border border-bone/30 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono text-bone-dim border-b border-bone/20 pb-2">
                  <span>SCALE PROFILE WITH CP / CG MARKERS</span>
                  <span>TOTAL LENGTH: {calc.ok ? calc.L.toFixed(0) : '–'} MM</span>
                </div>
                <div className="overflow-x-auto py-2">
                  {profileSvg}
                </div>
              </div>

              <div className="border-t border-bone/20 pt-4 flex justify-between">
                <button
                  onClick={() => handleTabChange('judging')}
                  className="font-label text-xs uppercase tracking-widest text-bone-dim hover:text-bone transition-colors cursor-pointer"
                >
                  ← Previous: Judging
                </button>
                <button
                  onClick={() => handleTabChange('rules')}
                  className="font-label text-xs uppercase tracking-widest text-crimson hover:text-bone transition-colors font-bold cursor-pointer"
                >
                  Next: Regulations &amp; Contacts →
                </button>
              </div>
            </section>
          )}

          {/* TAB: REGULATIONS & CONTACTS */}
          {activeTab === 'rules' && (
            <section className="space-y-6 animate-fadeIn">
              <div className="border-b border-bone/20 pb-4">
                <span className="font-mono text-xs text-crimson font-bold uppercase tracking-widest">
                  {SHOW_STABILITY_LAB ? 'Section 07' : 'Section 06'}
                </span>
                <h2 className="font-display text-3xl sm:text-4xl text-bone uppercase tracking-wider mt-1">
                  Conclave Rules &amp; Key Contacts
                </h2>
              </div>

              <div className="space-y-3">
                <h4 className="font-mono text-xs uppercase tracking-wider text-crimson font-bold">Event Day Protocols</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-label text-sm text-bone-dim">
                  <div className="bg-ink p-3.5 border border-bone/30">
                    <strong className="text-bone block mb-1">01. Reporting Window</strong>
                    07:45 AM – 08:45 AM at Welcome Foyer, DPS R.K. Puram. Entry requires Token of Submission.
                  </div>
                  <div className="bg-ink p-3.5 border border-bone/30">
                    <strong className="text-bone block mb-1">02. Display Stations</strong>
                    Teams showcase their rockets at designated campus tables. Arbiters inspect airframes in situ.
                  </div>
                  <div className="bg-ink p-3.5 border border-bone/30">
                    <strong className="text-bone block mb-1">03. Benchmarking School</strong>
                    DPS R.K. Puram host contingents participate for benchmarking only and do not qualify for podium trophies.
                  </div>
                  <div className="bg-ink p-3.5 border border-bone/30">
                    <strong className="text-bone block mb-1">04. Arbiter Finality</strong>
                    Scrutineering measurements and OpenRocket execution results by designated conclave arbiters are binding.
                  </div>
                </div>
              </div>

              {/* Contact Cards */}
              <div className="space-y-3 pt-2">
                <h4 className="font-mono text-xs uppercase tracking-wider text-crimson font-bold">Contact Directory</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  <div className="bg-ink p-4 border border-crimson">
                    <div className="text-crimson font-bold uppercase mb-1">Event Lead Arbiter</div>
                    <div className="text-base font-bold text-bone font-display tracking-wider">FARZOOQUE HASAN</div>
                    <a href="mailto:r25246farzooque@dpsrkp.net" className="text-bone-dim hover:text-crimson transition-colors block mt-1">
                      r25246farzooque@dpsrkp.net
                    </a>
                  </div>
                  <div className="bg-ink p-4 border border-bone/40">
                    <div className="text-bone-dim uppercase mb-1">Secretariat · Lead POC</div>
                    <div className="text-base font-bold text-bone font-display tracking-wider">SIDDHARTH SRIVASTAVA</div>
                    <a href="mailto:r24998siddharth@dpsrkp.net" className="text-bone-dim hover:text-crimson transition-colors block mt-1">
                      r24998siddharth@dpsrkp.net
                    </a>
                    <a href="tel:+918929020721" className="text-crimson font-bold block mt-0.5">
                      +91 89290 20721
                    </a>
                  </div>
                </div>
              </div>

              <div className="border-t border-bone/20 pt-4 flex justify-between">
                <button
                  onClick={() => handleTabChange(SHOW_STABILITY_LAB ? 'stability' : 'judging')}
                  className="font-label text-xs uppercase tracking-widest text-bone-dim hover:text-bone transition-colors cursor-pointer"
                >
                  {SHOW_STABILITY_LAB ? '← Previous: Stability Lab' : '← Previous: Judging'}
                </button>
                <Link
                  to="/submissions"
                  className="font-label text-xs uppercase tracking-widest text-crimson hover:text-bone transition-colors font-bold"
                >
                  Go to Submissions Vault →
                </Link>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
