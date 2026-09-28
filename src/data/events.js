export const eventOutline = {
  title: 'Event Outline',
  description:
    'CelesteCon 2026 brings forward 8 flagship competitions designed to test the complete spectrum of aerospace, engineering, debate, commercialization, and artistic innovation. From orbital settlement architecture to live aircraft flight reviews, chess-clock debates, and field rocketry launches, explore our updated competition guidelines below.'
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
        name: 'Junior Division (Grades 6–8)',
        desc: 'Maximum proposal length: 25 pages. Evaluated with age-appropriate design scope focusing on functional habitat layout, atmospheric baseline, radiation shielding concepts, and agricultural logistics.'
      },
      {
        name: 'Senior Division (Grades 9–12)',
        desc: 'Maximum proposal length: 35 pages. Evaluated on rigorous technical depth, structural finite-element considerations, artificial gravity rotational sizing, ECLSS calculations, and orbital mechanics.'
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
        name: 'Junior Division (Grades 6–8)',
        desc: 'Fixed-wing cargo or disaster-relief UAV. Focus on hand-launch aerodynamics, longitudinal stability, payload bay mechanics, and basic CAD/scale structural prototyping.'
      },
      {
        name: 'Senior Division (Grades 9–12)',
        desc: 'High-performance eVTOL or long-range parcel delivery aircraft. Focus on aerodynamic sizing, wing loading, power-to-weight ratio, center of gravity (CG) envelope, and precision multi-part 3D CAD assembly.'
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
    eligibility: 'Grades 6–12',
    team: 'Team of 2–4 members (max 3 teams per school)',
    quote: '“The most powerful person in the world is the storyteller.” — Steve Jobs',
    overview:
      'True aerospace innovation demands visionary engineering paired with viable unit economics and compelling market strategy. Business Power Pitch challenges teams to conceptualize a commercial aerospace venture—spanning space resource utilization, satellite constellations, space tourism, or sustainable aviation—and pitch it to a panel of venture capitalists and industry executives.',
    hook: 'Architect a space commercialization venture and pitch live before venture capitalists.',
    categories: [
      {
        name: 'Track 1 — Off-Planet Infrastructure & Mining',
        desc: 'In-situ resource extraction, orbital power grids, lunar regolith processing, and extraterrestrial manufacturing.'
      },
      {
        name: 'Track 2 — LEO Commercialization & Satellites',
        desc: 'SmallSat constellations, active orbital debris de-orbiting, space manufacturing, and microgravity research platforms.'
      },
      {
        name: 'Track 3 — Sustainable Aviation & Green Flight',
        desc: 'Hydrogen/electric aircraft propulsion, sustainable aviation fuel (SAF) supply chains, and urban air mobility networks.'
      },
      {
        name: 'Track 4 — Space Exploration Services & Tourism',
        desc: 'Commercial orbital habitat modules, astronaut life-support logistics, astronaut health-tech, and suborbital tourism.'
      }
    ],
    rounds: [
      {
        title: 'Round 1 (Venture Memo & Pitch Video)',
        desc: 'Teams select one venture track and submit: (1) A comprehensive business memo (executive summary, problem & market size TAM/SAM/SOM, unit economics, technical solution, go-to-market plan, risk analysis, and 3-year financial projections); and (2) A concise 5-minute video pitch deck selling the opportunity.'
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
      { label: 'Track Registration & Memo Submission', date: 'TBA' },
      { label: 'Finalists Announcement', date: 'TBA' },
      { label: 'Live Shark Tank Finals', date: 'CelesteCon 2026' }
    ],
    isDraft: false
  },
  {
    id: '05',
    name: 'Vector GameJam',
    discipline: 'Game Development & Simulation',
    mode: 'Onsite',
    eligibility: 'Grades 6–12',
    team: 'Team of 1–3 members',
    quote: '“You can discover more about a person in an hour of play than in a year of conversation.” — Plato',
    overview:
      'The aerospace game development sprint of CelesteCon. Teams are tasked with designing, programming, and polishing an original playable game or interactive simulation built around aerospace concepts (orbital gravity assists, atmospheric reentry, rocket staging, or zero-g navigation) to be showcased live for peer playtesting and jury evaluation.',
    hook: 'Design, code, and polish a playable aerospace game for live playtesting and jury review.',
    rounds: [
      {
        title: 'Phase 1 (Theme Announcement & Build Sprint)',
        desc: 'The central theme and mechanics constraints are revealed online. Teams have a dedicated sprint window to develop a fully playable game prototype in any game engine (Unity, Unreal Engine, Godot, WebGL/Three.js, or Pygame). Teams submit their playable build, source code repository link, and a 2-page Game Design Document (GDD) explaining core loop, physics models, and controls.'
      },
      {
        title: 'Phase 2 (Arcade Expo, Peer Playtesting & Patch Sprint)',
        desc: 'Finalists set up interactive stations in the CelesteCon Arcade Expo. All attendees and competing teams playtest and submit peer ratings. Industry game developers and software judges evaluate codebase quality, frame rate stability (targeted at 60 FPS), and physics fidelity. During the event, teams receive a surprise 45-minute "Curveball Patch Sprint" to implement a live feature update.'
      }
    ],
    software: ['Unity', 'Unreal Engine', 'Godot', 'WebGL / Three.js', 'Python / Pygame', 'Raylib / C++'],
    criteria: [
      'Gameplay mechanics, responsiveness & fun factor',
      'Authentic incorporation of aerospace or orbital physics',
      'Software engineering quality, optimization & 60 FPS stability',
      'Visual aesthetics, UI clarity, sound design & polish',
      'Execution of the surprise live patch sprint'
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
    discipline: 'Theatre, Satire & Improv',
    mode: 'Hybrid',
    eligibility: 'Grades 6–12',
    team: 'Individual or Team of 1–3 members',
    quote: '“If you want to tell people the truth, make them laugh, otherwise they\'ll kill you.” — Oscar Wilde',
    overview:
      'AEROSS Theatre brings the performing arts to the cosmos. Designed for the orators, actors, satirists, and comedians who can take the complexities of space exploration, scientific history, and astronaut life and transform them into sharp, witty, and captivating stagecraft.',
    hook: 'Performing arts, satire, stand-up comedy, and live aerospace improv on the main stage.',
    rounds: [
      {
        title: 'Round 1 (Online Audition Video)',
        desc: 'Participants prepare and submit a 3 to 5 minute recorded video performance on an aerospace, aviation, or space science theme. Submissions may take the form of: theatrical skits, stand-up comedy routines, satirical news broadcasts (e.g., mission control bloopers), dramatic scientific monologues, or musical parodies.'
      },
      {
        title: 'Round 2 (Live Showcase & Improv at AVH)',
        desc: 'Shortlisted finalists perform live in front of a packed audience at the Audio-Visual Hall (AVH). Following their prepared 5-minute set, performers face an impromptu "Spotlight Curveball": an on-the-spot aerospace scenario or audience prompt requiring 2 minutes of spontaneous comedic or dramatic improvisation.'
      }
    ],
    criteria: [
      'Wit, comedic timing, or dramatic storytelling',
      'Creative connection to aerospace themes and scientific tropes',
      'Vocal projection, body language & stage charisma',
      'Audience connection & engagement',
      'Adaptability, quick thinking & spontaneous improv skill'
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
    discipline: 'Model Craft & Flight Propulsion',
    mode: 'Onsite',
    eligibility: 'Grades 6–12 (Junior: 6th–8th, Senior: 9th–12th)',
    team: 'Individual or Team of 1–3 members',
    quote: '“The best way to predict the future is to build it.” — Alan Kay',
    overview:
      'The premier hands-on aerospace fabrication and propulsion competition of CelesteCon. Rocketry celebrates physical engineering, craftsmanship, and ballistics. Teams construct museum-grade scale models of historical/modern launch vehicles or engineer flight-ready functional rockets tested on the campus launch pad.',
    hook: 'Build and launch high-powered scale models and functional rocket craft on the launch pad.',
    categories: [
      {
        name: 'Track A — Scale & Static Display Craft (Junior & Senior)',
        desc: 'Precise scale reproductions of historical or modern launch vehicles, planetary landers, or space probes. Evaluated on fidelity, paint finish, structural symmetry, internal staging detailing, and scale accuracy.'
      },
      {
        name: 'Track B — Flight Propulsion & Launch (Senior: 9th–12th)',
        desc: 'Functional rocket craft powered by certified commercial solid model rocket motors (Class A–D) or pneumatic multi-stage water propulsion systems. Evaluated on stability, straight ascent trajectory, altitude, and safe parachute/streamer recovery.'
      }
    ],
    rounds: [
      {
        title: 'Round 1 (Fabrication Dossier & Safety Declaration)',
        desc: 'Teams register their chosen track and submit a technical dossier including: dimensioned CAD/orthographic blueprints, material specs, Barrowman aerodynamic stability calculations (showing Center of Pressure CP behind Center of Gravity CG by at least 1.0 to 2.0 calibers), and parachute deployment schematics.'
      },
      {
        title: 'Round 2 (Technical Inspection & Live Launch Field Trials)',
        desc: 'On the day of the event, all models undergo a mandatory static scrutineering inspection in the Open Arena. Track A entries are displayed in an open exhibition. Track B flight rockets undergo motor/igniter safety clearance by faculty marshals, followed by official launch pad trials on the campus athletic grounds with altitude tracking and recovery verification.'
      }
    ],
    safetyRules: [
      'Only commercially manufactured, certified model rocket motors (Class A through D) or standard pneumatic water pressure systems are permitted.',
      'Strictly no homemade chemical propellants, unauthorized fireworks, or pyrotechnics of any kind. Violation results in immediate disqualification.',
      'Flight rockets must demonstrate a static stability margin of at least 1.0 body diameter (caliber) prior to launch clearance.',
      'All launches are conducted under the direct supervision of range safety officers at the designated outdoor range with safe standoff distances.',
      'Every flight rocket must incorporate a reliable recovery system (parachute, streamer, or tumble recovery) to prevent ballistic impact.'
    ],
    criteria: [
      'Track A: Scale accuracy & proportions · Craftsmanship & finish · Detailing & material selection · Technical write-up',
      'Track B: Barrowman aerodynamic stability & safety clearance · Launch rail exit velocity & trajectory · Parachute deployment reliability · Clean recovery'
    ],
    timeline: [
      { label: 'Registration & Blueprint Declaration', date: 'TBA' },
      { label: 'Build Window', date: 'September – October 2026' },
      { label: 'Static Inspection & Range Launch', date: 'CelesteCon 2026' }
    ],
    isDraft: false
  },
  {
    id: '08',
    name: 'Formula Celeste (F1)',
    discipline: 'F1 Motorsport & Aerodynamic Engineering',
    mode: 'Onsite',
    eligibility: 'Grades 6–12 (Junior: 6th–8th, Senior: 9th–12th)',
    team: 'Team of 3–5 members (max 3 teams per school)',
    quote: '“Simplify, then add lightness.” — Colin Chapman',
    overview:
      'The miniature Formula 1 engineering challenge of CelesteCon. Teams design, simulate, manufacture, and race miniature CO2-cartridge powered racing cars along a 20-meter high-speed track. Formula Celeste merges computational fluid dynamics (CFD), CNC/3D manufacturing precision, aerodynamic downforce analysis, enterprise team branding, and lightning-fast track racing.',
    hook: 'Design, manufacture, brand, and race miniature F1 cars on the competition racetrack.',
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
        title: 'Round 1 (Engineering Dossier & CAD Submission)',
        desc: 'Teams submit an exhaustive engineering dossier including: complete 3D CAD model (.STEP / .F3D), CFD pressure coefficient and drag analysis, weight and center-of-mass balance, manufacturing process sheets, and enterprise portfolio (team identity, livery, sponsorship concept, and uniform designs).'
      },
      {
        title: 'Round 2 (Technical Scrutineering, Pit Defense & Track Races)',
        desc: 'On race day, cars enter official Parc Fermé for scrutineering (weight check, minimum ground clearance, wheel track, CO2 canister chamber dimensions). Teams defend their design decisions and aerodynamic trade-offs in an oral presentation at their team pit display. Finally, cars compete in head-to-head timed runs down the 20-meter tethered track with laser-sensor timing gates measuring reaction time and elapsed sprint speed.'
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
      { label: 'Registration & CAD Submission', date: 'TBA' },
      { label: 'Scrutineering & Pit Set-up', date: 'Race Day Morning' },
      { label: 'Grand Prix Track Races & Finals', date: 'CelesteCon 2026' }
    ],
    isDraft: false
  }
];
