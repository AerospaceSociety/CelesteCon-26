import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

const R1_DUE = new Date('2026-10-22T23:59:00+05:30').getTime();
const RACE_DAY = new Date('2026-10-24T07:45:00+05:30').getTime();

const DEFAULT_SPECS = {
  len: 198,
  wid: 82,
  hgt: 58,
  mass: 52.4,
  fd: 30,
  rd: 32,
  ww: 16,
  spend: 18500,
  four: true
};

const VALID_PRIX_TABS = ['brief', 'car', 'rounds', 'scoring', 'check', 'rules'];

export default function AerossPrixPrompt() {
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return VALID_PRIX_TABS.includes(hash) ? hash : 'brief';
  });
  const [specs, setSpecs] = useState(DEFAULT_SPECS);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, label: 'Round 1 due in', liveStatus: 'Round 1 Open' });

  // Handle URL hash changes from external links or browser history
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (VALID_PRIX_TABS.includes(hash)) {
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

  const handleSpecChange = (key, val) => {
    setSpecs(prev => ({ ...prev, [key]: val }));
  };

  const resetSpecs = () => {
    setSpecs(DEFAULT_SPECS);
  };

  const clearSpecs = () => {
    setSpecs({
      len: '',
      wid: '',
      hgt: '',
      mass: '',
      fd: '',
      rd: '',
      ww: '',
      spend: '',
      four: false
    });
  };

  // Countdown timer effect
  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      let target = R1_DUE;
      let label = 'Round 1 due in';
      let liveStatus = 'Round 1 Open';

      if (now >= R1_DUE && now < RACE_DAY) {
        target = RACE_DAY;
        label = 'Lights out in';
        liveStatus = 'Round 1 Closed';
      } else if (now >= RACE_DAY) {
        setTimeLeft({ days: 0, hours: 0, label: '24 October 2026', liveStatus: 'Event Concluded' });
        return;
      }

      const diff = Math.max(0, target - now);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

      setTimeLeft({ days, hours, label, liveStatus });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);

  // Scrutineering evaluation engine
  const evaluation = useMemo(() => {
    const num = (v) => {
      const parsed = parseFloat(v);
      return Number.isFinite(parsed) ? parsed : null;
    };

    const fmt = (x, d) => x.toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d });
    const signed = (x, d, unit) => (x >= 0 ? '+' : '−') + fmt(Math.abs(x), d) + unit;

    const L = num(specs.len);
    const W = num(specs.wid);
    const H = num(specs.hgt);
    const M = num(specs.mass);
    const FD = num(specs.fd);
    const RD = num(specs.rd);
    const WW = num(specs.ww);
    const S = num(specs.spend);
    const four = !!specs.four;

    const checks = [
      {
        id: 'len',
        label: 'Overall Length (170–210 mm)',
        val: L,
        test: (v) => v !== null && v >= 170 && v <= 210,
        margin: (v) => v === null ? '–' : v < 170 ? signed(v - 170, 1, ' mm') : signed(210 - v, 1, ' mm')
      },
      {
        id: 'wid',
        label: 'Width Across Wheels (≤ 85 mm)',
        val: W,
        test: (v) => v !== null && v <= 85,
        margin: (v) => v === null ? '–' : signed(85 - v, 1, ' mm')
      },
      {
        id: 'hgt',
        label: 'Overall Height (≤ 65 mm)',
        val: H,
        test: (v) => v !== null && v <= 65,
        margin: (v) => v === null ? '–' : signed(65 - v, 1, ' mm')
      },
      {
        id: 'fd',
        label: 'Front Wheel Ø (26–34 mm)',
        val: FD,
        test: (v) => v !== null && v >= 26 && v <= 34,
        margin: (v) => v === null ? '–' : v < 26 ? signed(v - 26, 1, ' mm') : signed(34 - v, 1, ' mm')
      },
      {
        id: 'rd',
        label: 'Rear Wheel Ø (26–34 mm)',
        val: RD,
        test: (v) => v !== null && v >= 26 && v <= 34,
        margin: (v) => v === null ? '–' : v < 26 ? signed(v - 26, 1, ' mm') : signed(34 - v, 1, ' mm')
      },
      {
        id: 'ww',
        label: 'Min Wheel Width (≥ 15 mm)',
        val: WW,
        test: (v) => v !== null && v >= 15,
        margin: (v) => v === null ? '–' : signed(v - 15, 1, ' mm')
      },
      {
        id: 'mass',
        label: 'Mass Without Cartridge (≥ 50 g)',
        val: M,
        test: (v) => v !== null && v >= 50,
        margin: (v) => v === null ? '–' : signed(v - 50, 1, ' g')
      },
      {
        id: 'spend',
        label: 'Constructor Spend (≤ ₹30,000)',
        val: S,
        test: (v) => v !== null && v <= 30000,
        margin: (v) => v === null ? '–' : (30000 - v >= 0 ? '+₹' : '−₹') + fmt(Math.abs(30000 - v), 0)
      },
      {
        id: 'four',
        label: 'All 4 Wheels Touch Track',
        val: four,
        test: (v) => v === true,
        margin: () => four ? 'YES' : 'NO'
      }
    ];

    let fails = 0;
    let missing = 0;

    const evaluated = checks.map(c => {
      let status = 'pass';
      if (c.val === null || c.val === '') {
        status = 'na';
        missing++;
      } else if (!c.test(c.val)) {
        status = 'fail';
        fails++;
      }
      return {
        ...c,
        status,
        marginStr: c.margin(c.val)
      };
    });

    const isLegal = fails === 0 && missing === 0;

    return {
      evaluated,
      fails,
      missing,
      isLegal,
      L,
      W
    };
  }, [specs]);

  const navLaps = [
    { id: 'brief', code: 'BRF', pos: 'P1', label: 'The Brief', sub: 'F1 constructor mandate' },
    { id: 'car', code: 'CAR', pos: 'P2', label: 'Car Specs', sub: 'Technical dimensional limits' },
    { id: 'rounds', code: 'RND', pos: 'P3', label: 'The Rounds', sub: 'R1 upload & R2 race track' },
    { id: 'scoring', code: 'PTS', pos: 'P4', label: 'Judging', sub: '100-pt rubric breakdown' },
    { id: 'check', code: 'SCR', pos: 'P5', label: 'Scrutineer Check', sub: 'Live compliance lab' },
    { id: 'rules', code: 'RUL', pos: 'P6', label: 'Regulations', sub: 'Submissions & contacts' }
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
          <span className="text-crimson font-bold">EVENT 08 · AEROSS PRIX</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/submissions" className="text-crimson hover:text-bone transition-colors font-bold uppercase tracking-widest text-[11px]">
            Submission Portal →
          </Link>
          <span className="border border-bone/40 px-2 py-0.5 text-bone font-bold text-[10px] uppercase">
            SCALE F1 CONSTRUCTOR
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-b-2 border-bone/20 pb-8">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-wrap gap-2">
            <span className="border border-crimson px-2.5 py-0.5 font-mono text-xs uppercase tracking-widest text-crimson font-bold bg-crimson/10">
              Event 08
            </span>
            <span className="border border-bone/40 px-2.5 py-0.5 font-mono text-xs uppercase tracking-widest text-bone-dim">
              Grades 9–12
            </span>
            <span className="border border-bone/40 px-2.5 py-0.5 font-mono text-xs uppercase tracking-widest text-bone-dim">
              Teams of 3–5
            </span>
            <span className="border border-bone bg-bone text-ink px-2.5 py-0.5 font-mono text-xs uppercase tracking-widest font-bold">
              Onsite · 24 Oct
            </span>
          </div>

          <h1 className="font-display font-black text-5xl sm:text-7xl md:text-8xl uppercase tracking-wider text-bone leading-none">
            AEROSS <span className="text-crimson">PRIX</span>
          </h1>

          <p className="font-mono text-xs sm:text-sm uppercase tracking-widest text-crimson font-bold">
            Inspired by Formula 1 Motorsport Engineering
          </p>

          <p className="font-label text-base sm:text-lg text-bone-dim leading-relaxed max-w-3xl">
            Found your own racing constructor and take a miniature F1-style CO₂-powered car from aerofoil concept
            through CAD and manufacturing to the high-speed tethered track. <strong className="text-bone font-bold">The fastest car does not automatically win</strong>—80
            points belong to engineering, documentation, livery brand, and pit-wall defense.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => handleTabChange('check')}
              className="px-5 py-2.5 bg-crimson text-bone font-label font-bold text-sm uppercase tracking-widest border border-crimson hover:bg-ink hover:text-crimson transition-all cursor-pointer shadow-lg hover:shadow-crimson/20"
            >
              Open Scrutineer Compliance Lab →
            </button>
            <button
              onClick={() => handleTabChange('car')}
              className="px-5 py-2.5 bg-ink-2 text-bone font-label font-bold text-sm uppercase tracking-widest border border-bone/40 hover:border-crimson hover:text-crimson transition-all cursor-pointer"
            >
              View Technical Regulations
            </button>
          </div>
        </div>

        {/* Race Control Panel Aside */}
        <aside className="lg:col-span-4 bg-ink-2 border-2 border-bone overflow-hidden shadow-xl">
          {/* Crimson & Bone Racing Kerb */}
          <div
            className="h-2 w-full"
            style={{ background: 'repeating-linear-gradient(90deg, #C23A1E 0 20px, #E8E1CE 20px 40px)' }}
          ></div>
          <div className="p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-bone/20 pb-2 font-mono text-xs">
              <span className="text-bone-dim uppercase font-bold tracking-widest">Race Control</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {timeLeft.liveStatus}
              </span>
            </div>

            <div className="space-y-1">
              <div className="font-mono text-[11px] text-bone-dim uppercase tracking-wider">{timeLeft.label}</div>
              <div className="font-mono text-4xl sm:text-5xl font-bold text-crimson flex items-baseline gap-2">
                <span>{String(timeLeft.days).padStart(2, '0')}<small className="text-xs text-bone-dim font-normal ml-1">days</small></span>
                <span>{String(timeLeft.hours).padStart(2, '0')}<small className="text-xs text-bone-dim font-normal ml-1">hrs</small></span>
              </div>
            </div>

            {/* Lap list milestones */}
            <ol className="space-y-2 border-t border-bone/20 pt-3 font-mono text-xs">
              <li className="flex gap-3 items-baseline">
                <span className="text-crimson font-bold w-14">13 OCT</span>
                <span className="text-bone-dim text-[11px]">Specs &amp; Round 1 Brief Released</span>
              </li>
              <li className="flex gap-3 items-baseline">
                <span className="text-crimson font-bold w-14">22 OCT</span>
                <span className="text-bone text-[11px]">Round 1 Dossier &amp; CAD Package Due</span>
              </li>
              <li className="flex gap-3 items-baseline">
                <span className="text-crimson font-bold w-14">24 OCT</span>
                <span className="text-bone text-[11px]">Race Day · DPS R.K. Puram (07:45 AM)</span>
              </li>
            </ol>
          </div>
        </aside>
      </div>

      {/* Main Content: Timing Tower Navigation + Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Timing Tower Nav */}
        <nav className="lg:col-span-3 sticky top-20 bg-ink-2 border-2 border-bone p-3 space-y-1 shadow-lg" aria-label="AEROSS Prix sections">
          <div className="font-mono text-[11px] text-bone-dim uppercase tracking-widest px-2 py-1 font-bold border-b border-bone/20 mb-2 flex justify-between">
            <span>Timing Tower</span>
            <span className="text-crimson">Lap {navLaps.findIndex(l => l.id === activeTab) + 1}/6</span>
          </div>
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1.5 pb-2 lg:pb-0 scrollbar-none">
            {navLaps.map((lap) => {
              const active = activeTab === lap.id;
              return (
                <button
                  key={lap.id}
                  onClick={() => handleTabChange(lap.id)}
                  className={`w-full text-left px-3 py-2.5 transition-all flex items-center gap-3 cursor-pointer border ${active
                      ? 'bg-crimson text-bone font-bold border-crimson shadow-md'
                      : 'bg-ink text-bone-dim hover:text-bone hover:border-bone/50 border-bone/20'
                    }`}
                >
                  <span className={`font-mono text-xs px-1.5 py-0.5 border ${active ? 'bg-bone text-ink border-bone font-bold' : 'border-bone/30 text-bone-dim'
                    }`}>
                    {lap.pos}
                  </span>
                  <div className="min-w-0">
                    <div className="font-label text-sm uppercase tracking-wider font-bold truncate leading-tight">
                      {lap.label}
                    </div>
                    <div className="font-mono text-[10px] opacity-75 truncate hidden sm:block">
                      {lap.sub}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Dynamic Panel Canvas */}
        <div className="lg:col-span-9 bg-ink-2 border-2 border-bone p-6 sm:p-8 space-y-8 shadow-xl min-w-0">
          {/* TAB 01: THE BRIEF */}
          {activeTab === 'brief' && (
            <section className="space-y-6 animate-fadeIn">
              <div className="border-b border-bone/20 pb-4">
                <span className="font-mono text-xs text-crimson font-bold uppercase tracking-widest">Lap 01</span>
                <h2 className="font-display text-3xl sm:text-4xl text-bone uppercase tracking-wider mt-1">
                  Build a Car. Run a Team.
                </h2>
              </div>

              <p className="font-label text-base text-bone-dim leading-relaxed">
                Each team enters one scale aerodynamic racecar, designed and manufactured with its own resources.
                You are judged as an F1 constructor: <strong className="text-bone font-bold">the engineering write-up, CAD fidelity, livery brand identity, and the pit-wall oral pitch count for 80 of the 100 points.</strong> The physical 20 m straight sprint race decides the final 20.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div className="bg-ink p-4 border border-bone/30 space-y-1">
                  <div className="text-bone-dim uppercase">Eligibility</div>
                  <div className="font-bold text-bone text-sm">Grades 9–12</div>
                  <p className="font-label text-xs text-bone-dim normal-case pt-1">
                    Single open category for senior schools.
                  </p>
                </div>
                <div className="bg-ink p-4 border border-bone/30 space-y-1">
                  <div className="text-bone-dim uppercase">Squad Size</div>
                  <div className="font-bold text-crimson text-sm">3–5 Members</div>
                  <p className="font-label text-xs text-bone-dim normal-case pt-1">
                    Must represent the same institution.
                  </p>
                </div>
                <div className="bg-ink p-4 border border-bone/30 space-y-1">
                  <div className="text-bone-dim uppercase">Host Venue</div>
                  <div className="font-bold text-bone text-sm">DPS R.K. Puram</div>
                  <p className="font-label text-xs text-bone-dim normal-case pt-1">
                    Sector 12, New Delhi (Onsite Finale).
                  </p>
                </div>
              </div>

              {/* Big stats row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-ink p-4 border border-bone/30 text-center">
                  <div className="font-display text-4xl text-crimson font-bold">80 PTS</div>
                  <div className="font-mono text-xs text-bone-dim uppercase mt-1">Off-Track Constructor</div>
                </div>
                <div className="bg-ink p-4 border border-bone/30 text-center">
                  <div className="font-display text-4xl text-bone font-bold">20 PTS</div>
                  <div className="font-mono text-xs text-bone-dim uppercase mt-1">On-Track Sprint Race</div>
                </div>
                <div className="bg-ink p-4 border border-bone/30 text-center">
                  <div className="font-display text-4xl text-crimson font-bold">20 M</div>
                  <div className="font-mono text-xs text-bone-dim uppercase mt-1">Tethered Straight Track</div>
                </div>
              </div>

              <div className="border-t border-bone/20 pt-4 flex justify-between">
                <div></div>
                <button
                  onClick={() => handleTabChange('car')}
                  className="font-label text-xs uppercase tracking-widest text-crimson hover:text-bone transition-colors font-bold cursor-pointer"
                >
                  Next: Car Specs &amp; Limits →
                </button>
              </div>
            </section>
          )}

          {/* TAB 02: CAR SPECS */}
          {activeTab === 'car' && (
            <section className="space-y-6 animate-fadeIn">
              <div className="border-b border-bone/20 pb-4">
                <span className="font-mono text-xs text-crimson font-bold uppercase tracking-widest">Lap 02</span>
                <h2 className="font-display text-3xl sm:text-4xl text-bone uppercase tracking-wider mt-1">
                  Technical Specifications &amp; Envelope
                </h2>
              </div>

              {/* Spec table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs border border-bone/30">
                  <thead className="bg-ink border-b border-bone/30">
                    <tr>
                      <th className="p-3 text-bone uppercase tracking-wider">Parameter</th>
                      <th className="p-3 text-crimson uppercase tracking-wider">Mandatory Limit</th>
                      <th className="p-3 text-bone-dim uppercase tracking-wider">Scrutineering Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-bone/20">
                    <tr className="bg-ink/50">
                      <td className="p-3 text-bone font-bold">Overall Length</td>
                      <td className="p-3 text-crimson font-bold">170 – 210 mm</td>
                      <td className="p-3 text-bone-dim">Measured nose tip to trailing edge of rear wing.</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-bone font-bold">Width Across Wheels</td>
                      <td className="p-3 text-crimson font-bold">≤ 85 mm</td>
                      <td className="p-3 text-bone-dim">Outermost tire sidewall to sidewall dimension.</td>
                    </tr>
                    <tr className="bg-ink/50">
                      <td className="p-3 text-bone font-bold">Overall Height</td>
                      <td className="p-3 text-crimson font-bold">≤ 65 mm</td>
                      <td className="p-3 text-bone-dim">Ground plane to highest point of rear wing / camera pod.</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-bone font-bold">Dry Mass (No Cartridge)</td>
                      <td className="p-3 text-crimson font-bold">≥ 50 g</td>
                      <td className="p-3 text-bone-dim">Weighed empty on calibrated digital scale before heat run.</td>
                    </tr>
                    <tr className="bg-ink/50">
                      <td className="p-3 text-bone font-bold">Wheel Diameter</td>
                      <td className="p-3 text-crimson font-bold">26 – 34 mm</td>
                      <td className="p-3 text-bone-dim">Applies to all 4 running wheels.</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-bone font-bold">Minimum Wheel Width</td>
                      <td className="p-3 text-crimson font-bold">≥ 15 mm</td>
                      <td className="p-3 text-bone-dim">Tire contact face measured across axle direction.</td>
                    </tr>
                    <tr className="bg-ink/50">
                      <td className="p-3 text-bone font-bold">Max Constructor Spend</td>
                      <td className="p-3 text-crimson font-bold">≤ ₹30,000</td>
                      <td className="p-3 text-bone-dim">Cost study declared on Technical Bill of Materials.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Technical CAD SVG Drawing */}
              <div className="bg-ink p-4 border border-bone/30 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono text-bone-dim">
                  <span className="font-bold uppercase tracking-wider">Side Elevation &amp; Ground Clearance</span>
                  <span className="text-crimson font-bold">CAD General Arrangement</span>
                </div>
                <svg viewBox="0 0 520 180" className="w-full h-auto select-none" role="img" aria-label="F1 scale car side view">
                  {/* Ground line */}
                  <line x1="10" y1="150" x2="510" y2="150" className="stroke-bone/30" strokeWidth="1.5" strokeDasharray="3 3" />
                  {/* Wheels */}
                  <circle cx="112" cy="120" r="28" className="fill-ink-2 stroke-bone" strokeWidth="1.6" />
                  <circle cx="372" cy="120" r="28" className="fill-ink-2 stroke-bone" strokeWidth="1.6" />
                  {/* Body chassis */}
                  <path
                    d="M34 116 L65 110 L150 90 L210 70 L330 68 L360 88 L448 94 L448 126 L350 126 L320 134 L150 134 L90 126 L34 126 Z"
                    className="fill-ink-2 stroke-bone"
                    strokeWidth="1.6"
                  />
                  {/* Front wing */}
                  <path d="M26 122 L65 122 L65 132 L26 132 Z" className="fill-crimson/30 stroke-crimson" strokeWidth="1.2" />
                  {/* Rear wing */}
                  <path d="M410 40 L452 40 L452 74 L410 74 Z" className="fill-crimson/30 stroke-crimson" strokeWidth="1.2" />
                  {/* CO2 Chamber */}
                  <rect x="345" y="86" width="90" height="26" rx="12" fill="none" className="stroke-crimson" strokeWidth="1.4" strokeDasharray="4 3" />
                  <text x="390" y="103" textAnchor="middle" className="font-mono text-[9px] fill-crimson font-bold">CO₂ CHAMBER</text>
                  {/* Length dimension */}
                  <line x1="34" y1="165" x2="448" y2="165" className="stroke-crimson" strokeWidth="1.2" />
                  <text x="241" y="174" textAnchor="middle" className="font-mono text-[10px] fill-crimson font-bold">170 – 210 mm</text>
                </svg>
              </div>

              <div className="border-t border-bone/20 pt-4 flex justify-between">
                <button
                  onClick={() => handleTabChange('brief')}
                  className="font-label text-xs uppercase tracking-widest text-bone-dim hover:text-bone transition-colors cursor-pointer"
                >
                  ← Previous: The Brief
                </button>
                <button
                  onClick={() => handleTabChange('rounds')}
                  className="font-label text-xs uppercase tracking-widest text-crimson hover:text-bone transition-colors font-bold cursor-pointer"
                >
                  Next: The Two Rounds →
                </button>
              </div>
            </section>
          )}

          {/* TAB 03: THE TWO ROUNDS */}
          {activeTab === 'rounds' && (
            <section className="space-y-6 animate-fadeIn">
              <div className="border-b border-bone/20 pb-4">
                <span className="font-mono text-xs text-crimson font-bold uppercase tracking-widest">Lap 03</span>
                <h2 className="font-display text-3xl sm:text-4xl text-bone uppercase tracking-wider mt-1">
                  The Two Rounds: Online Dossier &amp; Track Finale
                </h2>
              </div>

              {/* Round 1 Card */}
              <div className="bg-ink p-5 border border-bone/40 space-y-4">
                <div className="flex justify-between items-center border-b border-bone/20 pb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs bg-crimson text-bone px-2 py-0.5 font-bold">ROUND 01</span>
                    <h3 className="font-label font-bold text-lg text-bone uppercase">Design Documentation &amp; CAD Package</h3>
                  </div>
                  <span className="font-mono text-xs text-crimson font-bold">Online Due · 22 Oct 2026</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-label text-xs text-bone-dim">
                  <div className="bg-ink-2 p-3 border border-bone/20 space-y-1">
                    <strong className="text-bone block text-sm">DOC 01: Technical Dossier</strong>
                    Max 30 pages. Aerodynamic rationale, CFD airflow analyses, structural FEA pack, and cost study.
                  </div>
                  <div className="bg-ink-2 p-3 border border-bone/20 space-y-1">
                    <strong className="text-bone block text-sm">DOC 02: CAD Drawings</strong>
                    3-view general arrangement (F1-CD-1) fully dimensioned, exploded assembly with BOM (F1-CD-2).
                  </div>
                  <div className="bg-ink-2 p-3 border border-bone/20 space-y-1">
                    <strong className="text-bone block text-sm">DOC 03: Team Identity</strong>
                    Constructor branding, livery deck, sponsor return package, and engineering mission statement.
                  </div>
                </div>
              </div>

              {/* Round 2 Card */}
              <div className="bg-ink p-5 border border-bone/40 space-y-4">
                <div className="flex justify-between items-center border-b border-bone/20 pb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs bg-bone text-ink px-2 py-0.5 font-bold">ROUND 02</span>
                    <h3 className="font-label font-bold text-lg text-bone uppercase">Competition Day Trackside</h3>
                  </div>
                  <span className="font-mono text-xs text-bone font-bold">Onsite · 24 Oct 2026</span>
                </div>
                <ol className="space-y-2.5 font-mono text-xs text-bone-dim">
                  <li className="flex gap-3 items-baseline bg-ink-2 p-3 border border-bone/20">
                    <span className="text-crimson font-bold shrink-0">STAGE 01</span>
                    <span><strong>Scrutineering:</strong> Weighed on a digital scale, put through a physical go/no-go envelope box for length (170–210 mm), width (≤ 85 mm), and height (≤ 65 mm). <strong className="text-bone">Minor infringements can be rectified within 20 minutes.</strong> A car that fails scrutineering cannot race.</span>
                  </li>
                  <li className="flex gap-3 items-baseline bg-ink-2 p-3 border border-bone/20">
                    <span className="text-crimson font-bold shrink-0">STAGE 02</span>
                    <span><strong>Engineering Evaluation:</strong> Open your 3D CAD model and walk arbiters through parametric decisions, FEA structural stress, and CFD flow optimization.</span>
                  </li>
                  <li className="flex gap-3 items-baseline bg-ink-2 p-3 border border-bone/20">
                    <span className="text-crimson font-bold shrink-0">STAGE 03</span>
                    <span><strong>Pit-Wall Team Presentation:</strong> 5-minute constructor defense: design evolution, team structure, budget accounting, and why sponsors should back your outfit.</span>
                  </li>
                  <li className="flex gap-3 items-baseline bg-ink-2 p-3 border border-bone/20">
                    <span className="text-crimson font-bold shrink-0">STAGE 04</span>
                    <span><strong>Pit Display &amp; Livery Showcase:</strong> Static constructor paddock booth scoring identity, team apparel, sponsor return collateral, and graphic consistency.</span>
                  </li>
                  <li className="flex gap-3 items-baseline bg-ink-2 p-3 border border-bone/20">
                    <span className="text-crimson font-bold shrink-0">STAGE 05</span>
                    <span><strong>Timed Sprint Runs:</strong> High-speed sprint heats along a 20 m straight guide tether wire. Marshals load and puncture standard 12 g CO₂ cartridges. <strong className="text-bone">Your fastest valid run time counts.</strong></span>
                  </li>
                </ol>

                <div className="bg-ink-2 p-3.5 border-l-4 border-crimson text-xs font-mono text-bone-dim space-y-1">
                  <span className="text-crimson font-bold uppercase">Guide Tether Specification:</span>
                  <p>
                    Cars run along a taut track guide wire. Your chassis must incorporate secure guide eyelets / bottom slots to maintain continuous capture without snagging or fracturing upon deceleration.
                  </p>
                </div>
              </div>

              <div className="border-t border-bone/20 pt-4 flex justify-between">
                <button
                  onClick={() => handleTabChange('car')}
                  className="font-label text-xs uppercase tracking-widest text-bone-dim hover:text-bone transition-colors cursor-pointer"
                >
                  ← Previous: Car Specs
                </button>
                <button
                  onClick={() => handleTabChange('scoring')}
                  className="font-label text-xs uppercase tracking-widest text-crimson hover:text-bone transition-colors font-bold cursor-pointer"
                >
                  Next: Judging &amp; Rubric →
                </button>
              </div>
            </section>
          )}

          {/* TAB 04: SCORING & RUBRIC */}
          {activeTab === 'scoring' && (
            <section className="space-y-6 animate-fadeIn">
              <div className="border-b border-bone/20 pb-4">
                <span className="font-mono text-xs text-crimson font-bold uppercase tracking-widest">Lap 04</span>
                <h2 className="font-display text-3xl sm:text-4xl text-bone uppercase tracking-wider mt-1">
                  Judging Rubric &amp; Points Matrix
                </h2>
              </div>

              {/* 80 / 20 split */}
              <div className="border border-bone/40 flex flex-col sm:flex-row font-display text-lg tracking-wider">
                <div className="bg-bone text-ink p-3 sm:w-1/4 text-center font-bold">
                  20 PTS · TRACK SPRINT
                </div>
                <div className="bg-ink text-bone p-3 sm:w-3/4 text-center font-bold border-t sm:border-t-0 sm:border-l border-bone/40">
                  80 PTS · ENGINEERING, CAD, BRAND &amp; DEFENSE
                </div>
              </div>

              {/* Rubric rows */}
              <div className="space-y-2 font-mono text-xs">
                {[
                  { name: 'Race Performance (Fastest valid sprint run)', pts: 20, isRace: true },
                  { name: 'Engineering & Aerodynamic Design Soundness', pts: 15 },
                  { name: 'Aerodynamics & Flow CFD Evidence', pts: 10 },
                  { name: 'Manufacturing Quality & Craftsmanship', pts: 10 },
                  { name: 'Innovation & Creative Technical Packaging', pts: 10 },
                  { name: 'Technical Documentation & 3-View CAD Pack', pts: 10 },
                  { name: 'Constructor Oral Presentation & Defense', pts: 10 },
                  { name: 'Branding, Livery Design & Pit Display', pts: 10 },
                  { name: 'Teamwork & Project Management Portfolio', pts: 5 }
                ].map((crit, idx) => (
                  <div key={idx} className="bg-ink p-3 border border-bone/20 flex justify-between items-center">
                    <span className="text-bone">{crit.name}</span>
                    <span className={`font-bold ${crit.isRace ? 'text-crimson' : 'text-bone'}`}>
                      {crit.pts} PTS
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-bone/20 pt-4 flex justify-between">
                <button
                  onClick={() => handleTabChange('rounds')}
                  className="font-label text-xs uppercase tracking-widest text-bone-dim hover:text-bone transition-colors cursor-pointer"
                >
                  ← Previous: The Rounds
                </button>
                <button
                  onClick={() => handleTabChange('check')}
                  className="font-label text-xs uppercase tracking-widest text-crimson hover:text-bone transition-colors font-bold cursor-pointer"
                >
                  Next: Scrutineer Check →
                </button>
              </div>
            </section>
          )}

          {/* TAB 05: SCRUTINEER CHECK */}
          {activeTab === 'check' && (
            <section className="space-y-6 animate-fadeIn">
              <div className="border-b border-bone/20 pb-4 flex justify-between items-end flex-wrap gap-2">
                <div>
                  <span className="font-mono text-xs text-crimson font-bold uppercase tracking-widest">Lap 05</span>
                  <h2 className="font-display text-3xl sm:text-4xl text-bone uppercase tracking-wider mt-1">
                    Scrutineer Dimensional Compliance Lab
                  </h2>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={resetSpecs}
                    className="font-mono text-xs text-crimson border border-crimson px-3 py-1 cursor-pointer font-bold uppercase hover:bg-crimson hover:text-bone transition-colors"
                  >
                    Reset Defaults
                  </button>
                  <button
                    onClick={clearSpecs}
                    className="font-mono text-xs text-bone-dim border border-bone/30 px-3 py-1 cursor-pointer font-bold uppercase hover:text-bone transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <p className="font-label text-sm text-bone-dim">
                Enter your physical model measurements to test full compliance against official scrutineering limits before race day.
              </p>

              {/* Form & Live Status Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Inputs */}
                <div className="bg-ink p-5 border border-bone/30 space-y-4">
                  <h4 className="font-mono text-xs text-crimson uppercase tracking-wider font-bold border-b border-bone/20 pb-1">
                    Envelope Dimensions
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-mono text-[11px] text-bone-dim mb-1">Length (170–210 mm)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={specs.len}
                        onChange={(e) => handleSpecChange('len', e.target.value)}
                        className="w-full bg-ink-2 border border-bone/40 p-2 font-mono text-sm text-bone focus:border-crimson outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] text-bone-dim mb-1">Width (≤ 85 mm)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={specs.wid}
                        onChange={(e) => handleSpecChange('wid', e.target.value)}
                        className="w-full bg-ink-2 border border-bone/40 p-2 font-mono text-sm text-bone focus:border-crimson outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] text-bone-dim mb-1">Height (≤ 65 mm)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={specs.hgt}
                        onChange={(e) => handleSpecChange('hgt', e.target.value)}
                        className="w-full bg-ink-2 border border-bone/40 p-2 font-mono text-sm text-bone focus:border-crimson outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] text-bone-dim mb-1">Dry Mass (≥ 50 g)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={specs.mass}
                        onChange={(e) => handleSpecChange('mass', e.target.value)}
                        className="w-full bg-ink-2 border border-bone/40 p-2 font-mono text-sm text-bone focus:border-crimson outline-none"
                      />
                    </div>
                  </div>

                  <h4 className="font-mono text-xs text-crimson uppercase tracking-wider font-bold border-b border-bone/20 pb-1 pt-2">
                    Wheels &amp; Budget
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-mono text-[11px] text-bone-dim mb-1">Front Wheel Ø (26–34)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={specs.fd}
                        onChange={(e) => handleSpecChange('fd', e.target.value)}
                        className="w-full bg-ink-2 border border-bone/40 p-2 font-mono text-sm text-bone focus:border-crimson outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] text-bone-dim mb-1">Rear Wheel Ø (26–34)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={specs.rd}
                        onChange={(e) => handleSpecChange('rd', e.target.value)}
                        className="w-full bg-ink-2 border border-bone/40 p-2 font-mono text-sm text-bone focus:border-crimson outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] text-bone-dim mb-1">Min Wheel Width (≥ 15)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={specs.ww}
                        onChange={(e) => handleSpecChange('ww', e.target.value)}
                        className="w-full bg-ink-2 border border-bone/40 p-2 font-mono text-sm text-bone focus:border-crimson outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] text-bone-dim mb-1">Total Spend (≤ ₹30k)</label>
                      <input
                        type="number"
                        step="100"
                        value={specs.spend}
                        onChange={(e) => handleSpecChange('spend', e.target.value)}
                        className="w-full bg-ink-2 border border-bone/40 p-2 font-mono text-sm text-bone focus:border-crimson outline-none"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 pt-2 cursor-pointer font-label text-sm text-bone select-none">
                    <input
                      type="checkbox"
                      checked={specs.four}
                      onChange={(e) => handleSpecChange('four', e.target.checked)}
                      className="w-4 h-4 accent-crimson cursor-pointer"
                    />
                    <span>All four wheels make continuous contact with ground</span>
                  </label>
                </div>

                {/* Verdict & Live Checklist */}
                <div className="space-y-4">
                  {/* Verdict Lamp Banner */}
                  <div className={`p-4 border-2 flex items-center gap-3 ${evaluation.isLegal
                      ? 'bg-emerald-950/30 border-emerald-500 text-emerald-400'
                      : evaluation.fails > 0
                        ? 'bg-crimson/20 border-crimson text-crimson'
                        : 'bg-ink border-bone/40 text-bone-dim'
                    }`}>
                    <span className={`w-3.5 h-3.5 rounded-full ${evaluation.isLegal ? 'bg-emerald-400' : evaluation.fails > 0 ? 'bg-crimson animate-pulse' : 'bg-bone/40'
                      }`}></span>
                    <div>
                      <h4 className="font-display text-xl uppercase tracking-wider leading-none">
                        {evaluation.isLegal ? 'CLEARED TO RACE' : evaluation.fails > 0 ? `${evaluation.fails} INFRINGEMENT(S) TO RECTIFY` : 'INCOMPLETE MEASUREMENTS'}
                      </h4>
                      <p className="font-label text-xs mt-1 opacity-80">
                        {evaluation.isLegal
                          ? 'Every parameter is strictly compliant with technical regulations.'
                          : 'Car cannot pass scrutineering in its current configuration.'}
                      </p>
                    </div>
                  </div>

                  {/* Checklist Breakdown */}
                  <div className="bg-ink p-4 border border-bone/30 space-y-2 font-mono text-xs">
                    {evaluation.evaluated.map((c) => (
                      <div key={c.id} className="flex justify-between items-center py-1 border-b border-bone/10 last:border-b-0">
                        <span className="text-bone-dim truncate pr-2">{c.label}</span>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-bone-dim font-bold">{c.marginStr}</span>
                          <span className={`px-2 py-0.5 font-bold uppercase text-[10px] border ${c.status === 'pass'
                              ? 'bg-emerald-900/40 text-emerald-400 border-emerald-500'
                              : c.status === 'fail'
                                ? 'bg-crimson/30 text-crimson border-crimson'
                                : 'text-bone-dim border-bone/20'
                            }`}>
                            {c.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Visual Envelope Box SVG */}
                  <div className="bg-ink p-4 border border-bone/30 space-y-1">
                    <div className="flex justify-between font-mono text-[10px] text-bone-dim uppercase">
                      <span>Plan View 210 × 85 mm Envelope</span>
                      <span>{evaluation.L || 0} × {evaluation.W || 0} mm</span>
                    </div>
                    <svg viewBox="0 0 460 190" className="w-full h-auto select-none" role="img" aria-label="Car plan view inside envelope">
                      {/* Bounding envelope box */}
                      <rect x="10" y="10" width="420" height="170" fill="none" className="stroke-bone/40" strokeWidth="1.5" strokeDasharray="6 4" />
                      {/* Min length guide (170 mm = 340 px) */}
                      <line x1="350" y1="10" x2="350" y2="180" className="stroke-bone/20" strokeWidth="1" strokeDasharray="3 3" />
                      {/* The car body plan representation */}
                      {evaluation.L && evaluation.W && (
                        <rect
                          x="10"
                          y={10 + (170 - Math.min(evaluation.W * 2, 170)) / 2}
                          width={Math.min(evaluation.L * 2, 440)}
                          height={Math.min(evaluation.W * 2, 170)}
                          rx="4"
                          className={`${evaluation.L >= 170 && evaluation.L <= 210 && evaluation.W <= 85
                              ? 'fill-crimson/30 stroke-crimson'
                              : 'fill-red-600/40 stroke-red-500 animate-pulse'
                            }`}
                          strokeWidth="1.8"
                        />
                      )}
                      <text x="12" y="185" className="font-mono text-[9px] fill-bone-dim">0</text>
                      <text x="350" y="185" textAnchor="middle" className="font-mono text-[9px] fill-bone-dim">170</text>
                      <text x="430" y="185" textAnchor="end" className="font-mono text-[9px] fill-bone-dim">210 mm</text>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="border-t border-bone/20 pt-4 flex justify-between">
                <button
                  onClick={() => handleTabChange('scoring')}
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

          {/* TAB 06: REGULATIONS & CONTACTS */}
          {activeTab === 'rules' && (
            <section className="space-y-6 animate-fadeIn">
              <div className="border-b border-bone/20 pb-4">
                <span className="font-mono text-xs text-crimson font-bold uppercase tracking-widest">Lap 06</span>
                <h2 className="font-display text-3xl sm:text-4xl text-bone uppercase tracking-wider mt-1">
                  Regulations &amp; Race Day Contacts
                </h2>
              </div>

              <div className="space-y-3">
                <h4 className="font-mono text-xs uppercase tracking-wider text-crimson font-bold">Race Day Paddock Protocols</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-label text-sm text-bone-dim">
                  <div className="bg-ink p-3.5 border border-bone/30">
                    <strong className="text-bone block mb-1">01. Cartridge Handling</strong>
                    CO₂ cylinders are handled and punctured exclusively by official marshals. Teams never puncture their own cartridges.
                  </div>
                  <div className="bg-ink p-3.5 border border-bone/30">
                    <strong className="text-bone block mb-1">02. Rectification Window</strong>
                    Minor scrutineering infringements are granted a single 20-minute pit window to resolve before preliminary heats.
                  </div>
                  <div className="bg-ink p-3.5 border border-bone/30">
                    <strong className="text-bone block mb-1">03. Host Contingent</strong>
                    DPS R.K. Puram host teams compete for benchmarking telemetry only and cannot claim podium trophies.
                  </div>
                  <div className="bg-ink p-3.5 border border-bone/30">
                    <strong className="text-bone block mb-1">04. Arbiter Sovereign Decision</strong>
                    Track marshal timing and scrutineer jury decisions are final and binding on all constructors.
                  </div>
                </div>
              </div>

              {/* Contact Cards */}
              <div className="space-y-3 pt-2">
                <h4 className="font-mono text-xs uppercase tracking-wider text-crimson font-bold">Event Leads &amp; Secretariat</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  <div className="bg-ink p-4 border border-crimson">
                    <div className="text-crimson font-bold uppercase mb-1">AEROSS Prix Lead Arbiter</div>
                    <div className="text-base font-bold text-bone font-display tracking-wider">ANANT JHA</div>
                    <a href="mailto:v09759anant@dpsrkp.net" className="text-bone-dim hover:text-crimson transition-colors block mt-1">
                      v09759anant@dpsrkp.net
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
                  onClick={() => handleTabChange('check')}
                  className="font-label text-xs uppercase tracking-widest text-bone-dim hover:text-bone transition-colors cursor-pointer"
                >
                  ← Previous: Scrutineer Lab
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
