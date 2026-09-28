export const eventOutline = {
  title: 'Event Outline',
  description:
    'CelesteCon 2026 brings forward 8 flagship competitions designed to test the complete spectrum of aerospace, engineering, debate, commercialization, creative arts, and motorsport. From orbital settlement architecture to live aircraft flight reviews, chess-clock debates, CelesteJam game builds, and AEROSS Prix sprints, explore our updated competition guidelines below.'
};

export const events = [
  {
    id: '01',
    name: 'Settle-Me-This (Space Settlement Design)',
    discipline: 'Space Settlement Design',
    mode: 'Hybrid',
    eligibility: 'Grades 6–12 (Junior: 6th–8th, Senior: 9th–12th)',
    team: 'Team of 3–5 members',
    quote: '“Earth is the cradle of humanity, but one cannot live in the cradle forever.” — Konstantin Tsiolkovsky',
    overview:
      'Space colonisation has advanced far beyond lunar outposts or viewing Mars as the only alternate habitat. With rapid advancements in materials, life support, and orbital dynamics, the concept of permanent free-space settlements has gained immense traction. Settle-Me-This invites teams to author a comprehensive engineering proposal for a fully functioning, self-sustaining orbital settlement situated beyond planetary surfaces (such as at Earth-Moon or Sun-Earth Lagrange points).',
    hook: 'Design a comprehensive proposal for a self-sustaining, habitable free-space settlement.',
    categories: [
      {
        name: 'Junior Category (Grades 6–8)',
        desc: 'Open to middle school students. Evaluated independently with age-appropriate criteria.'
      },
      {
        name: 'Senior Category (Grades 9–12)',
        desc: 'Open to high school students. Evaluated independently with advanced technical evaluation.'
      }
    ],
    rounds: [
      {
        title: 'Round 1 (Online Proposal Submission)',
        desc: 'Teams prepare and submit an exhaustive engineering proposal covering: (1) Structural geometry, materials selection, pressure vessel integrity, and artificial gravity sizing; (2) Operations, station logistics, communications, and power generation architecture; (3) Environmental Control and Life Support Systems (ECLSS), radiation shielding, and closed-loop agriculture; and (4) Community planning, socio-economic structure, and emergency decompression protocols. 2D/3D models and engineering blueprints are strongly encouraged. Max pages: 25 pages (Junior) / 35 pages (Senior).'
      },
      {
        title: 'Round 2 (On-Campus Presentation & Defense)',
        desc: 'Shortlisted qualifying teams present live on campus at DPS R.K. Puram (virtual accommodations provided for verified non-NCR teams). Teams deliver an up to 10-minute presentation (using slides, physical mockups, or digital CAD models), followed by a 5-minute judge interrogation and an intensive 3-minute technical injection challenge (an unexpected orbital perturbation or life-support failure scenario requiring rapid spontaneous problem solving).'
      }
    ],
    criteria: [
      'Structural design, artificial gravity rotational sizing & materials',
      'Life support (ECLSS), closed-loop recycling & radiation shielding',
      'Operational feasibility, electrical power architecture & logistics',
      'Clarity of technical documentation, drawings & oral defense',
      'Critical thinking & composure during the injection challenge'
    ],
    timeline: [
      { label: 'Registration Opens', date: 'TBA' },
      { label: 'Proposal Submission Deadline', date: 'TBA' },
      { label: 'Finalists Announcement', date: 'TBA' },
      { label: 'On-Campus Defense & Grand Finale', date: 'CelesteCon 2026' }
    ],
    isDraft: false
  },
  {
    id: '02',
    name: 'Volatus (Aviation / UAV & Dimension III)',
    discipline: 'Aviation, UAV & 3D CAD',
    mode: 'Hybrid',
    eligibility: 'Grades 6–12 (Junior: 6th–8th, Senior: 9th–12th)',
    team: 'Team of 2–4 members',
    quote: '“Once you have tasted flight, you will forever walk the earth with your eyes turned skyward.” — Leonardo da Vinci',
    overview:
      'Combining aero-mechanical engineering, flight dynamics, and digital prototyping (incorporating the legacy of Dimension III 3D modeling), Volatus challenges students to solve real-world aviation problems. Teams design an uncrewed aerial vehicle (UAV/eVTOL) to meet stringent mission profiles, complete with aerodynamic calculations, structural packaging in CAD, and an oral flight review.',
    hook: 'Aero-mechanical design challenge incorporating precision 3D CAD modeling and flight review.',
    categories: [
      {
        name: 'Junior Category (Grades 6–8)',
        desc: 'Open to middle school students. Evaluated independently with age-appropriate design and prototyping criteria.'
      },
      {
        name: 'Senior Category (Grades 9–12)',
        desc: 'Open to high school students. Evaluated independently with advanced aero-mechanical and 3D CAD modeling criteria.'
      }
    ],
    rounds: [
      {
        title: 'Round 1 (Technical Dossier & 3D CAD Submission)',
        desc: 'Teams prepare and submit an engineering dossier detailing: aircraft mission profile, aerodynamic sizing (wing area, aspect ratio, airfoil selection, drag polar, thrust-to-weight), weight & balance analysis, and complete 3D CAD assembly files (.STEP, .F3D, or .BLEND) with rendered isometric views and exploded assembly diagrams.'
      },
      {
        title: 'Round 2 (Onsite Flight Review & Jury Interrogation)',
        desc: 'Finalist teams present their aircraft designs in a science-fair style exhibition on campus. Teams showcase interactive 3D model walkthroughs and physical prototypes/scale mockups. Teams must defend structural choices, stability derivatives, and aerodynamic calculations in a 10-minute jury review followed by an engineering curveball prompt.'
      }
    ],
    software: ['Autodesk Fusion 360', 'SolidWorks', 'Blender', 'Onshape', 'AutoCAD', 'OpenVSP'],
    criteria: [
      'Aerodynamic feasibility, airfoil selection & sizing calculations',
      '3D CAD modeling quality, packaging, assembly & structural detailing',
      'Mass balance, center of gravity (CG) & static stability margin',
      'Technical documentation, rendering & engineering drawing standards',
      'Defense of design choices and response to jury curveballs'
    ],
    timeline: [
      { label: 'Registration Opens', date: 'TBA' },
      { label: 'Dossier & CAD Submission', date: 'TBA' },
      { label: 'Shortlist Notification', date: 'TBA' },
      { label: 'Live Flight Review', date: 'CelesteCon 2026' }
    ],
    isDraft: false
  },
  {
    id: '03',
    name: 'In Pursuit of Dispute (Debate & Quizzitch)',
    discipline: 'Debate & Forensics',
    mode: 'Hybrid',
    eligibility: 'Grades 6–12 (Open)',
    team: 'Team of 2–3 members (max 2 teams per school)',
    quote: '“It’s better to debate a question without settling it than to settle a question without debating it.”',
    overview:
      'The premier aerospace forensics and debate championship of CelesteCon 2026, integrating Quizzitch preliminaries with a high-stakes parliamentary debate tournament. This event tests technical aerospace literacy, geopolitical and ethical acumen, and spontaneous rhetoric under strict time pressure.',
    hook: 'Quizzitch prelims screening into a high-stakes live chess-clock parliamentary debate.',
    rounds: [
      {
        title: 'Round 1 (Quizzitch Screening & Case Video)',
        desc: 'Stage 1 consists of an online proctored aerospace quiz testing orbital mechanics, mission history, astrophysics trivia, and logical reasoning. Concurrently, teams submit a concise 3-minute video presentation addressing an assigned motion regarding space commercialization, orbital debris policy, or planetary defense ethics. Top qualifying teams advance to the finals.'
      },
      {
        title: 'Round 2 (Onsite Chess-Clock Finals)',
        desc: 'Finalist teams face off in a live parliamentary-style tournament at DPS R.K. Puram. Debates operate under a chess-clock time system: each side receives a 15-minute shared time bank to divide between constructive speeches and rebuttals. Opposing teams may raise Points of Information (POIs) during designated open speech windows. The round culminates in rapid-fire cross-examination and jury interrogation.'
      }
    ],
    criteria: [
      'Aerospace scientific accuracy & policy understanding',
      'Argumentation structure, factual evidence & citations',
      'Chess-clock pacing, rhetorical delivery & stage presence',
      'Clash handling, POI execution & rebuttal precision'
    ],
    timeline: [
      { label: 'Online Quiz & Video Submission', date: 'TBA' },
      { label: 'Qualifier Results', date: 'TBA' },
      { label: 'Motions Released for R2', date: '48 hours prior to onsite event' },
      { label: 'Live Tournament', date: 'CelesteCon 2026' }
    ],
    isDraft: false
  },
  {
    id: '04',
    name: 'Business Power Pitch',
    discipline: 'Aerospace Venture & Pitch',
    mode: 'Hybrid',
    eligibility: 'Grades 6–12 (Junior: 6th–8th, Senior: 9th–12th)',
    team: 'Team of 2–4 members (max 3 teams per school)',
    quote: '“The most powerful person in the world is the storyteller.” — Steve Jobs',
    overview:
      'True aerospace innovation demands visionary engineering paired with viable unit economics and compelling market strategy. Business Power Pitch challenges teams to conceptualize a commercial aerospace venture—spanning space resource utilization, satellite constellations, space tourism, or sustainable aviation—and pitch it to a panel of venture capitalists and industry executives.',
    hook: 'Architect a space commercialization venture and pitch live before venture capitalists.',
    categories: [
      {
        name: 'Junior Category (Grades 6–8)',
        desc: 'Open to middle school students. Evaluated independently focusing on innovative venture concept, problem-solving, and pitch presentation.'
      },
      {
        name: 'Senior Category (Grades 9–12)',
        desc: 'Open to high school students. Evaluated independently with comprehensive business model analysis, unit economics, and investor defense.'
      }
    ],
    rounds: [
      {
        title: 'Round 1 (Business Proposal & Pitch Video)',
        desc: 'Teams prepare and submit: (1) A comprehensive business memo detailing market opportunity, solution, business model, addressable market, and financial planning; and (2) A concise 5-minute video pitch deck presenting the venture.'
      },
      {
        title: 'Round 2 (Live Investor Shark Tank)',
        desc: 'Qualifying finalist teams pitch live on stage before a panel of venture capitalists and startup founders. Teams deliver an 8-minute slide presentation (functional mockups, UI demos, or prototypes are encouraged), followed by a 6-minute investor cross-examination probing financial feasibility, customer acquisition, and technical hurdles. Competing teams in the audience may ask challenger questions for bonus points.'
      }
    ],
    templateUrl: 'https://docs.google.com/document/d/1wd8T4sqoSLX3euoxNoyVo6AzFL1JX9Vvt_xle5pmrMY/edit?tab=t.0#heading=h.nmq48d4hymqb',
    templateLabel: 'Business Power Pitch Submission Template',
    criteria: [
      'Problem validation, value proposition & technical novelty',
      'Market sizing (TAM/SAM/SOM) & competitor differentiation',
      'Financial model, unit economics & revenue monetization',
      'Operational feasibility, regulatory compliance & scalability',
      'Pitch delivery, narrative charisma & investor Q&A defense'
    ],
    timeline: [
      { label: 'Registration & Proposal Submission', date: 'TBA' },
      { label: 'Finalists Announcement', date: 'TBA' },
      { label: 'Live Shark Tank Finals', date: 'CelesteCon 2026' }
    ],
    isDraft: false
  },
  {
    id: '05',
    name: 'CelesteJam',
    discipline: 'Game Development & Simulation',
    mode: 'Onsite',
    eligibility: 'Grades 6–12',
    team: 'Team of 1–3 members',
    quote: '“You can discover more about a person in an hour of play than in a year of conversation.” — Plato',
    overview:
      'CelesteJam is CelesteCon’s official game development challenge. Teams are tasked with designing, programming, and polishing an original, playable minigame or interactive simulation to be showcased live on campus for peer playtesting and jury evaluation.',
    hook: 'Design, code, and polish a playable minigame for live campus playtesting and jury review.',
    rounds: [
      {
        title: 'Phase 1 (Theme Announcement & Build Sprint)',
        desc: 'The central theme and mechanics constraints are revealed online. Teams have a dedicated sprint window to develop a fully playable game prototype in any game engine (Unity, Unreal Engine, Godot, WebGL/Three.js, or Pygame). Teams submit their playable build, source code repository link, and a 2-page Game Design Document (GDD) explaining core loop, mechanics, and controls.'
      },
      {
        title: 'Phase 2 (Arcade Expo, Peer Playtesting & Patch Sprint)',
        desc: 'Finalists set up interactive stations in the CelesteCon Arcade Expo. All attendees and competing teams playtest and submit peer ratings. Industry game developers and software judges evaluate codebase quality, frame rate stability (targeted at 60 FPS), and mechanics design. During the event, teams receive a surprise 45-minute "Curveball Patch Sprint" to implement a live feature update.'
      }
    ],
    software: ['Unity', 'Unreal Engine', 'Godot', 'WebGL / Three.js', 'Python / Pygame', 'Raylib / C++'],
    criteria: [
      'Gameplay mechanics, responsiveness & player fun factor',
      'Mechanics design, simulation fidelity & control responsiveness',
      'Software engineering quality, optimization & 60 FPS stability',
      'Visual aesthetics, UI clarity, sound design & polish',
      'Execution of the live surprise patch sprint'
    ],
    timeline: [
      { label: 'Theme Release', date: '72 hours prior to submission' },
      { label: 'Build & GDD Submission', date: 'TBA' },
      { label: 'Live Arcade Expo & Peer Review', date: 'CelesteCon 2026' }
    ],
    isDraft: false
  },
  {
    id: '06',
    name: 'AEROSS Theatre',
    discipline: 'Creative Arts & Talent Showcase',
    mode: 'Hybrid',
    eligibility: 'Grades 6–12',
    team: 'Individual or Team of 1–3 members',
    quote: '“All the world’s a stage, and all the men and women merely players.” — William Shakespeare',
    overview:
      'AEROSS Theatre is CelesteCon’s open stage for creative performance and artistic expression. Participants have complete artistic freedom to submit and perform anything and everything—stand-up comedy, theatrical skits, musical instruments, singing, dance, poetry, mimicry, magic, or dramatic monologues. There are no restrictions to aerospace or science themes; bring your purest stagecraft, talent, and energy to captivate the audience.',
    hook: 'Open creative performance and talent showcase — comedy, skits, instruments, singing, and live stagecraft.',
    rounds: [
      {
        title: 'Round 1 (Online Audition Video)',
        desc: 'Participants prepare and submit a 3 to 5 minute recorded video showcasing any talent of their choice—stand-up comedy, theatrical skits, musical instruments, vocal singing, dance, mono-acting, magic, or poetry. You have total creative freedom over your topic, genre, and style. Submissions are judged on artistic originality, technical proficiency, stage charisma, and entertainment value.'
      },
      {
        title: 'Round 2 (Onsite Finals — Talent Showcase)',
        desc: 'Shortlisted finalists take the main stage live at the Audio-Visual Hall (AVH) in an electrifying talent show format. Acts are not restricted to skits; finalists can perform live musical sets, comedy routines, theatrical pieces, vocal performances, or multi-talent acts. Teams will be evaluated on stage presence, timing, delivery, audience engagement, and overall entertainment quotient.'
      }
    ],
    criteria: [
      'Creativity, originality & artistic expression',
      'Skill and technical execution (acting, vocals, instrumentation, timing)',
      'Stage presence, confidence & crowd engagement',
      'Pacing, delivery & overall entertainment quotient'
    ],
    timeline: [
      { label: 'Video Audition Submission', date: 'TBA' },
      { label: 'Finalists Shortlist', date: 'TBA' },
      { label: 'Live Stage Showcase & Improv', date: 'CelesteCon 2026' }
    ],
    isDraft: false
  },
  {
    id: '07',
    name: 'Rocketry',
    discipline: 'Model Craft & Aerodynamic Flight Simulation',
    mode: 'Onsite',
    eligibility: 'Grades 6–12 (Junior: 6th–8th, Senior: 9th–12th)',
    team: 'Individual or Team of 1–3 members',
    quote: '“The best way to predict the future is to build it.” — Alan Kay',
    overview:
      'Rocketry is CelesteCon’s hands-on aerospace fabrication and aerodynamic simulation challenge. Participants design and construct high-precision scale rockets or flight-capable vehicle models. Rather than live field launches, rockets will undergo rigorous static inspection, dimensional scrutiny, and computational flight simulation testing to evaluate whether the craft is aerodynamically sound, properly balanced, and genuinely capable of flight.',
    hook: 'Design, fabricate, and simulate flight-capable rocket models evaluated through aerodynamic testing.',
    categories: [
      {
        name: 'Junior Division (Grades 6–8)',
        desc: 'Scale model craft, structural symmetry, material selection, fin alignment, and basic center of gravity (CG) / center of pressure (CP) balance verification.'
      },
      {
        name: 'Senior Division (Grades 9–12)',
        desc: 'Advanced aerodynamic design, precision Barrowman stability calculations, recovery bay mechanisms, and multi-variable flight simulation profiles (using OpenRocket / RockSim or analytical models).'
      }
    ],
    rounds: [
      {
        title: 'Single Onsite Round (Static Scrutineering, Simulation & Flight Readiness Test)',
        desc: 'A single comprehensive offline competition held on campus during CelesteCon. Participants bring their fabricated rocket models along with their technical design dossier (or simulation file). The competition comprises: (1) Physical Scrutineering — inspection of craftsmanship, fin alignment, structural integrity, and weight distribution; (2) Aerodynamic Stability & Simulation Test — verification of Center of Gravity (CG) vs Center of Pressure (CP) using Barrowman formulas and digital flight simulations (OpenRocket / RockSim) to simulate apogee, trajectory, velocity curves, and verify genuine flight capability; and (3) Recovery Mechanism Inspection — examination of parachute/streamer bay deployment readiness. Note: Physical rockets will not be launched into the air; all flight evaluations are performed through simulation, bench, and stability testing.'
      }
    ],
    safetyRules: [
      'Physical rockets will NOT be launched at the venue. All flight capabilities are assessed via software simulation and physical bench testing.',
      'Strictly no live pyrotechnic motors, chemical propellants, igniters, or explosive substances may be brought onto school grounds.',
      'Models must be structurally sound and safe for hands-on inspection and measurement by the judging panel.'
    ],
    criteria: [
      'Craftsmanship, dimensional fidelity, symmetry & finish',
      'Aerodynamic stability margin (Barrowman calculations & CG/CP verification)',
      'Flight simulation accuracy (apogee estimation, thrust-to-weight modeling, trajectory)',
      'Internal packaging & parachute/recovery system deployment design',
      'Technical defense and oral presentation before the jury'
    ],
    timeline: [
      { label: 'Registration Deadline', date: 'TBA' },
      { label: 'Onsite Competition & Technical Evaluation', date: 'CelesteCon 2026' }
    ],
    isDraft: false
  },
  {
    id: '08',
    name: 'AEROSS Prix',
    discipline: 'Miniature F1 Motorsport & Aerodynamic Engineering',
    mode: 'Onsite',
    eligibility: 'Grades 6–12 (Junior: 6th–8th, Senior: 9th–12th)',
    team: 'Team of 3–5 members (max 3 teams per school)',
    quote: '“Simplify, then add lightness.” — Colin Chapman',
    overview:
      'AEROSS Prix is CelesteCon’s premier miniature Formula 1 engineering and racing challenge. Teams design, manufacture, brand, and race miniature CO2-cartridge powered racing cars along a 20-meter high-speed track. AEROSS Prix merges computational fluid dynamics (CFD), precision CNC/3D manufacturing, aerodynamic downforce analysis, enterprise pit branding, and lightning-fast track sprints.',
    hook: 'Design, manufacture, brand, and race miniature F1 cars in an action-packed onsite Grand Prix.',
    categories: [
      {
        name: 'Junior Division (Grades 6–8)',
        desc: 'Entry class focusing on balsa/foam aerodynamics, wheel alignment, low rolling resistance, and team livery design.'
      },
      {
        name: 'Senior Division (Grades 9–12)',
        desc: 'High-performance class incorporating precision 3D CAD modeling, CFD drag polar analysis, composite/additive manufacturing tolerances, and full enterprise pit-wall branding.'
      }
    ],
    rounds: [
      {
        title: 'Single Onsite Round (Scrutineering, Pit Defense & Track Races)',
        desc: 'A high-octane single offline competition held on campus during CelesteCon. Teams bring their engineered miniature F1 cars, CAD/CFD documentation, and pit displays. The day is divided into three key phases: (1) Technical Scrutineering — inspection of dimensions, minimum weight thresholds, wheel track, and CO2 canister chamber alignment; (2) Enterprise & Engineering Defense — oral presentation of CAD/CFD design, manufacturing process, and team livery at their pit display; and (3) Official Track Races — head-to-head sprint racing down the 20-meter track powered by standard CO2 canisters with laser-sensor timing measuring reaction speed and sprint times.'
      }
    ],
    safetyRules: [
      'Cars must adhere to standard miniature F1 envelope dimensions and minimum weight thresholds specified in the technical regulations.',
      'Standard 8-gram CO2 canisters will be provided and loaded exclusively by official track marshals at the launch gate.',
      'All wheels must rotate freely and remain in continuous contact with the track surface. Enclosed wheels or internal drive motors are prohibited.',
      'Structural safety: Cars must withstand rapid deceleration at the track deceleration gate without chassis fragmentation.'
    ],
    criteria: [
      'Aerodynamic efficiency (CFD analysis, drag minimization, frontal area)',
      'Manufacturing precision, dimensional tolerances & build finish',
      'Track race performance (laser gate elapsed sprint time & reaction speed)',
      'Enterprise portfolio, livery branding & pit display quality',
      'Engineering presentation & jury technical defense'
    ],
    timeline: [
      { label: 'Registration Deadline', date: 'TBA' },
      { label: 'Scrutineering & Pit Set-up', date: 'Race Day Morning' },
      { label: 'Grand Prix Track Races & Finals', date: 'CelesteCon 2026' }
    ],
    isDraft: false
  }
];
