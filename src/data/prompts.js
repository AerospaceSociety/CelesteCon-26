export const hybridPrompts = [
  {
    id: 'settle',
    eventId: '01',
    name: 'Settle-Me-This (Space Settlement Design)',
    mode: 'Hybrid',
    eligibility: 'Grades 6–12 (Junior: 6th–8th, Senior: 9th–12th)',
    team: 'Team of 3–5 members (max 3 teams per school)',
    status: 'ACTIVE BRIEF',
    releaseDate: 'Phase 1 Release',
    submissionDeadline: 'See Timeline',
    category: 'Space Settlement Engineering',
    hook: 'Design a comprehensive proposal for a permanent, self-sustaining free-space settlement.',
    url: '/events/settle-me-this.html',
    round1Prompt: {
      title: 'Project Brief — Autonomous Free-Space Settlement Design',
      topic: 'Design a permanent, fully self-sustaining free-space settlement for a minimum permanent population of 10,000 residents, situated at Earth-Moon Lagrangian Point L4 or L5.',
      requirements: [
        'Structural & Materials Engineering: Hull geometry, artificial gravity generation (rotational kinetics), atmospheric pressure retention, radiation shielding (regolith/magnetic), micro-meteoroid protection.',
        'Operations & Infrastructure: Power generation (solar/nuclear), closed-loop ECLSS (water recovery, air revitalization, agricultural biome), waste recycling, reaction control & attitude maintenance.',
        'Human Factors & Society: Residential zoning, community architecture, psychological wellness, artificial lighting cycles, emergency shelters, medical facilities.',
        'Junior Category (Grades 6–8): Proposal document up to 25 pages.',
        'Senior Category (Grades 9–12): Proposal document up to 35 pages.'
      ]
    },
    round2Prompt: {
      title: 'Round 2 Onsite Defense & Injection Challenge',
      details: [
        'Top 5 teams per category present a 10-minute pitch with PPT or models on campus (virtual accommodations for non-NCR qualifying teams).',
        'Followed by a 5-minute judge interrogation and a surprise 3-minute injection crisis scenario (e.g. solar storm surge or ECLSS failure) to test rapid contingency engineering.'
      ]
    },
    deliverables: 'PDF Proposal (max 25 pages Jr / 35 pages Sr) + Optional 3D/2D model link (Google Drive)',
    evaluationCriteria: [
      'Scientific accuracy and physics soundness',
      'Innovation and architectural feasibility',
      'ECLSS and infrastructure viability',
      'Clarity, visual presentation, and injection challenge response'
    ]
  },
  {
    id: 'volatus',
    eventId: '02',
    name: 'Volatus + Dimension III (Aviation & 3D CAD)',
    mode: 'Hybrid',
    eligibility: 'Grades 6–12 (Junior: 6th–8th, Senior: 9th–12th)',
    team: 'Team of 2–4 members (max 3 teams per school)',
    status: 'ACTIVE CASES',
    releaseDate: 'Phase 1 Release',
    submissionDeadline: 'See Schedule',
    category: 'Aerospace Engineering & 3D CAD',
    hook: 'Aero-mechanical design challenge incorporating precision 3D CAD modeling and flight review.',
    url: '/events/volatus.html',
    round1Prompt: {
      title: 'Round 1 Proposal & 3D CAD — Choose One Engineering Case Study',
      cases: [
        {
          code: 'CASE ALPHA',
          title: 'Autonomous Solar-Electric HALE UAV for Persistent Maritime Monitoring',
          desc: 'Design a High-Altitude Long-Endurance (HALE) unmanned aerial system capable of remaining airborne for 45+ consecutive days at 60,000 ft, utilizing photovoltaic wings, high-energy-density battery storage, and ultra-lightweight carbon composites to monitor remote marine ecosystems.'
        },
        {
          code: 'CASE BRAVO',
          title: 'Urban eVTOL Noise Signature & Low-Altitude Transition Aerodynamics',
          desc: 'Develop an innovative vectored-thrust or lift-plus-cruise electric vertical takeoff and landing (eVTOL) vehicle for intra-city passenger transit, specifically solving aeroacoustic noise pollution (<65 dBA at 100m) and transition stall dynamics during tilt maneuvers.'
        },
        {
          code: 'CASE CHARLIE',
          title: 'Zero-Emission Hydrogen-Electric Regional Turboprop Aircraft',
          desc: 'Design a 50-passenger regional turboprop incorporating cryogenic liquid hydrogen fuel cells or hydrogen combustion, addressing fuel storage volume within the fuselage, weight-and-balance distribution, and wing structural loading.'
        }
      ],
      instructions: [
        'Teams must select exactly one case study and submit an engineering proposal detailing aerodynamics, structural sizing, power plant calculations, and performance envelope.',
        'Include complete 3D CAD model assemblies (.obj/.step/.fbx/Fusion 360 link), schematic drawings, airfoil selection rationale, weight breakdown, and CFD/mathematical estimations.'
      ]
    },
    round2Prompt: {
      title: 'Round 2 Onsite Finals — Flight Review & CAD Jury Defense',
      details: [
        'Shortlisted teams construct an exhibit with technical posters, CAD visualizers, and scale display mockups on campus.',
        'Judges conduct an exhaustive CAD inspection and interrogation session testing engineering choices, structural packaging, and live aerodynamic curveballs.'
      ]
    },
    deliverables: 'Technical Proposal PDF + 3D CAD Assembly files/link (Google Drive)',
    evaluationCriteria: [
      'Technical depth and mathematical grounding',
      'Aerodynamic & propulsion feasibility',
      '3D CAD precision, packaging, and tolerances',
      'Exhibit quality and ability to defend design decisions'
    ]
  },
  {
    id: 'dispute',
    eventId: '03',
    name: 'In Pursuit of Dispute (Debate + Quizzitch)',
    mode: 'Hybrid',
    eligibility: 'Grades 6–12 (Open)',
    team: 'Team of 3 (max 2 teams per school)',
    status: 'ACTIVE PROMPT',
    releaseDate: 'Available Now',
    submissionDeadline: '2 Days Before Onsite Finals',
    category: 'Debate, Forensics & STEM Trivia',
    hook: 'Quizzitch prelims integrated with a high-stakes 3v3 chess-clock debate tournament.',
    url: '/events/in-pursuit-of-dispute.html',
    round1Prompt: {
      title: 'Round 1 Qualifier — Video Case Submission & Quizzitch Screening',
      topic: '“Resolved: The commercialization and unilateral resource exploitation of celestial bodies poses an unacceptable threat to multilateral peaceful space governance.”',
      instructions: [
        'Teams must record and submit a 3 to 4 minute video presenting a thoroughly researched, structured case on the motion above.',
        'All team members must participate and speak in the recording.',
        'Online aerospace logic and trivia preliminary quiz (Quizzitch) screening will also be administered.',
        'The video must be uploaded to Google Drive with permissions set to "Anyone with the link can view".',
        'Emphasis should be placed on technical accuracy, international space treaties (e.g. Outer Space Treaty, Artemis Accords), economic realities, and clear rhetoric.'
      ]
    },
    round2Prompt: {
      title: 'Round 2 Onsite Finals — Live Chess-Clock 3v3 Clashes & POIs',
      details: [
        'Motions for the onsite round will be released to shortlisted teams prior to the event.',
        'Teams will be assigned affirmative or negative stances and paired with opponent schools in a bracketed debate format.',
        'Strict chess-clock timing, Points of Information (POIs), cross-examinations, and judge rebuttals.'
      ]
    },
    deliverables: '3–4 minute video file link (Google Drive MP4/WebM)',
    evaluationCriteria: [
      'Research depth and technical understanding',
      'Argumentation, evidence & legal/engineering examples',
      'Structure, rhetoric & delivery',
      'Clash, rebuttal capability & handling POIs'
    ]
  },
  {
    id: 'bpp',
    eventId: '04',
    name: 'Business Power Pitch',
    mode: 'Hybrid',
    eligibility: 'Grades 6–12 (Open)',
    team: 'Team of 3 members (max 3 teams per school)',
    status: 'ACTIVE PROMPT',
    releaseDate: 'Available Now',
    submissionDeadline: 'See Schedule',
    category: 'Venture Creation & Entrepreneurship',
    hook: 'Propose an aerospace venture, draft a business model, and pitch to angel investors.',
    url: '/events/business-power-pitch.html',
    round1Prompt: {
      title: 'Round 1 Submission — Venture Proposal & 5-Minute Video Pitch',
      topic: 'Select 1 of 4 Commercial Aerospace Venture Tracks:',
      tracks: [
        'Track 1: Orbital Sustainability & Space Debris Remediation Services',
        'Track 2: Downstream Earth Observation & Satellite Data for Climate Analytics',
        'Track 3: In-Space Manufacturing & Microgravity Pharmaceutical Research Platforms',
        'Track 4: Next-Generation Sustainable Aviation Fuels (SAF) & Green Airport Logistics'
      ],
      instructions: [
        'Each team must submit: (1) A comprehensive business plan using the official proposal template; and (2) A 5-minute video pitch.',
        'Proposal must cover: Problem Statement, Product/Service Architecture, Market Size (TAM/SAM/SOM), Business & Revenue Model, Unit Economics, and Go-to-Market Strategy.',
        'Use the official Business Power Pitch Submission Template for formatting.'
      ]
    },
    templateUrl: 'https://docs.google.com/document/d/1wd8T4sqoSLX3euoxNoyVo6AzFL1JX9Vvt_xle5pmrMY/edit?tab=t.0#heading=h.nmq48d4hymqb',
    round2Prompt: {
      title: 'Round 2 Onsite Finals — Live Shark-Tank Pitch & Flaw Rebuttals',
      details: [
        'Qualifying teams pitch live (5–7 minutes) to an investor panel with slide deck and optional prototype.',
        'Peer interrogation round: competing teams can raise commercial/technical critique for bonus marks.'
      ]
    },
    deliverables: 'Completed Proposal PDF (via template) + 5-Minute Video Pitch link (Google Drive)',
    evaluationCriteria: [
      'Problem definition and market research',
      'Technical innovation and viability',
      'Financial model, unit economics, and scalability',
      'Pitch storytelling, persuasiveness, and handling cross-questions'
    ]
  },
  {
    id: 'gamejam',
    eventId: '05',
    name: 'Vector GameJam (Building a Minigame)',
    mode: 'Hybrid',
    eligibility: 'Grades 6–12 (Open)',
    team: 'Team of 2–3 members (max 3 teams per school)',
    status: 'ACTIVE CHALLENGE',
    releaseDate: 'Available Now',
    submissionDeadline: 'See Schedule',
    category: 'Game Design & Software Development',
    hook: 'Build a playable aerospace minigame in 72 hours around orbital mechanics or flight.',
    url: '/events/gamejam.html',
    round1Prompt: {
      title: 'Round 1 Submission — Playable Game Build & Video Walkthrough',
      topic: 'Theme: Orbital Trajectories, Gravitational Slingshots, or Extreme Atmosphere Aerodynamics',
      instructions: [
        'Build a standalone playable web or desktop minigame using Godot, Unity, Pygame, Phaser, or WebGL/Three.js.',
        'Incorporate authentic physical mechanics (gravity, thrust, atmospheric drag, or orbital transfers).',
        'Submit a playable link (e.g. Itch.io or web build) or executable archive, along with source repository and a 3-minute gameplay walkthrough video.'
      ]
    },
    round2Prompt: {
      title: 'Round 2 Onsite Finals — Live Playtest & Code Walkthrough',
      details: [
        'Top qualifying teams set up live gaming stations on campus for judge playtesting and peer gameplay shootout.',
        'Followed by a technical code review and architecture interview.'
      ]
    },
    deliverables: 'Playable Build link / Source Code repository + 3-minute video walkthrough (Google Drive)',
    evaluationCriteria: [
      'Gameplay mechanics and physics fidelity',
      'Visual aesthetic, audio design, and UI polish',
      'Code quality and stability',
      'Fun factor and theme interpretation'
    ]
  },
  {
    id: 'theatre',
    eventId: '06',
    name: 'Aeross Theatre (Skit, Improv & Comedy)',
    mode: 'Hybrid',
    eligibility: 'Grades 6–12 (Open)',
    team: 'Team of 2–5 members (max 2 teams per school)',
    status: 'ROUND 1 ACTIVE',
    releaseDate: 'Phase 1 Video Round',
    submissionDeadline: 'See Timeline',
    category: 'Theatrical Arts, Improv & Comedy',
    hook: 'Translate space history, physics paradoxes, or astronaut life into compelling entertainment.',
    url: '/events/aeross-theatre.html',
    round1Prompt: {
      title: 'Round 1 Qualifier — 3–5 Minute Video Performance',
      topic: 'Theme: Aerospace Satire, Space History Comedy, or Explanatory Theatrical Skit',
      instructions: [
        'Create and record a 3 to 5 minute video performance on an aerospace or aviation theme.',
        'Permitted formats: Stand-up comedy, theatrical sketch, comedic monologue, mock interview, or fun educational performance.',
        'Performances should be entertaining, sharp, and showcase genuine space enthusiasm.',
        'Upload the recorded video to Google Drive and ensure public viewing permissions are enabled.'
      ]
    },
    round2Prompt: {
      title: 'Round 2 Onsite Finals — Live Stage & Improv at AVH',
      details: [
        'Selected acts perform live at the DPS R.K. Puram Audio-Visual Hall (AVH).',
        'Contestants will receive an on-the-spot aerospace prompt / premise and have 5 minutes to prepare an improv set.'
      ]
    },
    deliverables: '3–5 minute video recording link (Google Drive MP4/WebM)',
    evaluationCriteria: [
      'Humour, wit, and audience engagement',
      'Creativity and originality of the narrative',
      'Relevance and integration of aerospace themes',
      'Stage presence, timing, and voice projection'
    ]
  },
  {
    id: 'rocketry',
    eventId: '07',
    name: 'Rocketry (Build & Launch)',
    mode: 'Onsite',
    eligibility: 'Grades 6–12 (Open)',
    team: 'Team of 2–4 members (max 2 teams per school)',
    status: 'ACTIVE BRIEF',
    releaseDate: 'Phase 1 Release',
    submissionDeadline: 'See Schedule',
    category: 'Rocketry & Propulsion Engineering',
    hook: 'Engineer a single or dual-stage model rocket, calculate trajectory, and launch on campus grounds.',
    url: '/events/rocketry.html',
    round1Prompt: {
      title: 'Phase 1 — Rocketry Design Dossier & Stability Verification',
      topic: 'Design and simulate an aerodynamically stable model rocket conforming to Barrowman stability criteria (Cp behind Cg by >= 1.5 calibers).',
      instructions: [
        'Submit a complete design dossier including OpenRocket / RockSim flight simulation plots, apogee estimates, motor selection rationale, and parachute deployment timing.',
        'Provide structural blueprints, material selections, and detailed pre-flight safety checklists.'
      ]
    },
    round2Prompt: {
      title: 'Phase 2 Onsite — Field Launch & Apogee Shootout',
      details: [
        'Teams construct or assemble their rockets and pass mandatory static safety inspection on campus grounds.',
        'Live launch trials under safety range supervision: measured on apogee accuracy, stability margin, and successful recovery deployment.'
      ]
    },
    deliverables: 'Rocket Design Dossier PDF (simulations, Barrowman analysis, launch safety protocol)',
    evaluationCriteria: [
      'Flight simulation accuracy and stability margin (Cg/Cp)',
      'Structural integrity and craftsmanship',
      'Recovery system reliability and launch safety protocol',
      'Field launch performance and telemetry/apogee tracking'
    ]
  },
  {
    id: 'f1',
    eventId: '08',
    name: 'Formula Celeste (F1 in Schools)',
    mode: 'Onsite',
    eligibility: 'Grades 6–12 (Open)',
    team: 'Team of 3–5 members (max 2 teams per school)',
    status: 'ACTIVE BRIEF',
    releaseDate: 'Phase 1 Release',
    submissionDeadline: 'See Schedule',
    category: 'Aerodynamic Automotive Engineering',
    hook: 'Miniature CO2-powered Formula race car design, wind-tunnel aerodynamics, and drag strip racing.',
    url: '/events/formula-celeste.html',
    round1Prompt: {
      title: 'Phase 1 — Engineering Design Portfolio & CFD Analysis',
      topic: 'Design a high-speed miniature CO2 cartridge-powered race car adhering to official dimensional and mass regulations.',
      instructions: [
        'Submit an Engineering Portfolio (max 20 pages) documenting CFD airflow analyses, front/rear wing vortex generation, chassis weight optimization, and wheel assembly bearing selections.',
        'Include 3D CAD files (.step/.obj) and orthographic manufacturing drawings.'
      ]
    },
    round2Prompt: {
      title: 'Phase 2 Onsite — Track Racing & Pit Display Defense',
      details: [
        'Onsite 20-meter timed sprint racing on DPS R.K. Puram elevated drag track.',
        'Teams present their enterprise pit display, engineering portfolio, and undergo judge interrogation.'
      ]
    },
    deliverables: 'Engineering Portfolio PDF + CAD Model Archives (Google Drive)',
    evaluationCriteria: [
      'Aerodynamic design, CFD optimization & downforce-to-drag ratio',
      'Manufacturing precision, tolerances & mass compliance',
      'Sprint track elapsed time & reaction speed',
      'Enterprise pit presentation and jury defense'
    ]
  }
];
