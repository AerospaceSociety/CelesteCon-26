export const hybridPrompts = [
  {
    id: 'dispute',
    eventId: '01',
    name: 'In Pursuit of Dispute (Debate)',
    mode: 'Hybrid',
    eligibility: 'Grades 9–12',
    team: 'Team of 2 (max 1 team per school)',
    status: 'ACTIVE PROMPT',
    releaseDate: 'Available Now',
    submissionDeadline: '2 Days Before Onsite Finals',
    category: 'Debate & Rhetoric',
    hook: 'Video qualifier case defense leading to live parliamentary-style debate rounds.',
    round1Prompt: {
      title: 'Round 1 Qualifier — Video Case Submission',
      topic: '“Resolved: The commercialization and unilateral resource exploitation of celestial bodies poses an unacceptable threat to multilateral peaceful space governance.”',
      instructions: [
        'Teams must record and submit a 3 to 4 minute video presenting a thoroughly researched, structured case on the motion above.',
        'Both team members must participate and speak in the recording.',
        'The video must be uploaded to Google Drive with permissions set to "Anyone with the link can view".',
        'Emphasis should be placed on technical accuracy, international space treaties (e.g. Outer Space Treaty, Artemis Accords), economic realities, and clear rhetoric.'
      ]
    },
    round2Prompt: {
      title: 'Round 2 Onsite Finals — Live Clashes & POIs',
      details: [
        'Motions for the onsite round will be released to shortlisted teams 2 days prior to the event.',
        'Teams will be assigned affirmative or negative stances and paired with opponent schools.',
        'Speaking time: 3–4 minutes per team, split between speakers as desired, followed by 3 minutes of cross-questioning & Points of Information (POIs) from opposing teams and jury.'
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
    id: 'quizzitch',
    eventId: '02',
    name: 'Quizzitch',
    mode: 'Hybrid',
    eligibility: 'Grades 6–12 (Open)',
    team: 'Team of 2',
    status: 'PRE-QUALIFIER ACTIVE',
    releaseDate: 'Round 1 Online Window',
    submissionDeadline: 'Online Schedule',
    category: 'STEM & Logic Quiz',
    hook: 'Rapid-fire aerospace facts, orbital mechanics, launch history, and STEM puzzles.',
    round1Prompt: {
      title: 'Round 1 Qualifier — 45-Minute Online Rapid Quiz',
      topic: 'Comprehensive Aerospace, Aviation, Orbital Mechanics, Astronomy & STEM Logic',
      instructions: [
        'The preliminary round is conducted online on Google Meet + dedicated test platform over 45 minutes.',
        'Question formats: Single Correct (standard), Single Correct (+2 correct, -1 negative marking), and Multiple Correct bonus questions.',
        'Syllabus includes: historical space missions, current Artemis/ISRO/SpaceX missions, aerodynamics basics, propulsion systems, astronomy milestones, and deductive STEM teasers.',
        'Top 10 scoring teams advance directly to the Onsite Finale.'
      ]
    },
    round2Prompt: {
      title: 'Round 2 Onsite Finals — Buzzer & Written Crucible',
      details: [
        'Part A: Written advanced problem-solving test.',
        'Part B: High-intensity rapid-fire buzzer shootout on campus testing quick recall, composure, and teamwork.'
      ]
    },
    deliverables: 'Team confirmation & online qualifier attendance verification',
    evaluationCriteria: [
      'Preliminary round aggregate score',
      'Advanced written paper score',
      'Buzzer round reaction time & accuracy'
    ]
  },
  {
    id: 'settle',
    eventId: '03',
    name: 'Settle-Me-This (Space Settlement)',
    mode: 'Hybrid',
    eligibility: 'Grades 6–12 (Junior: 6th–8th, Senior: 9th–12th)',
    team: 'Team of 3–5 members',
    status: 'ACTIVE BRIEF',
    releaseDate: 'Phase 1 Release',
    submissionDeadline: 'See Timeline',
    category: 'Engineering & Architecture',
    hook: 'Design a fully habitable, permanent free-space settlement proposal.',
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
    id: 'bpp',
    eventId: '04',
    name: 'Business Power Pitch',
    mode: 'Hybrid',
    eligibility: 'Grades 6–12',
    team: 'Team of 3 members',
    status: 'ACTIVE PROMPT',
    releaseDate: 'Available Now',
    submissionDeadline: 'See Schedule',
    category: 'Entrepreneurship & Tech',
    hook: 'Propose an aerospace venture, draft a business model, and pitch to angel investors.',
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
    id: 'volatus',
    eventId: '05',
    name: 'Volatus',
    mode: 'Hybrid',
    eligibility: 'Grades 6–12',
    team: 'Team of 2–4 members',
    status: 'ACTIVE CASES',
    releaseDate: 'Phase 1 Release',
    submissionDeadline: 'See Schedule',
    category: 'Aerospace Engineering',
    hook: 'Choose 1 of 3 case-based aviation engineering challenges and defend your solution.',
    round1Prompt: {
      title: 'Round 1 Proposal — Choose One Engineering Case Study',
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
        'Include schematic drawings, airfoil selection rationale, weight breakdown, and CFD/mathematical estimations where applicable.'
      ]
    },
    round2Prompt: {
      title: 'Round 2 Onsite Finals — Science-Fair Exhibit & Jury Defense',
      details: [
        'Shortlisted teams construct an exhibit with technical posters, CAD visualizers, and scale display mockups on campus.',
        'Judges review booths in an interactive interrogation session testing engineering choices and defense of assumptions.'
      ]
    },
    deliverables: 'Technical Proposal PDF (Google Drive link) with schematics and calculations',
    evaluationCriteria: [
      'Technical depth and mathematical grounding',
      'Aerodynamic & propulsion feasibility',
      'Adherence to chosen case constraints',
      'Exhibit quality and ability to defend design decisions'
    ]
  },
  {
    id: 'cosmovate',
    eventId: '06',
    name: 'Cosmovate',
    mode: 'Hybrid',
    eligibility: 'Grades 6–12',
    team: 'Team of 2–3 members',
    status: 'ACTIVE CHALLENGE',
    releaseDate: 'Available Now',
    submissionDeadline: 'See Schedule',
    category: 'Creative Engineering',
    hook: 'Turn a deliberately quirky aerospace prompt into an engineered, technically viable solution.',
    round1Prompt: {
      title: 'Creative Technical Prompt — Unconventional Planetary Exploration',
      topic: '“The Sub-Surface Swarm: Design a robotic reconnaissance vehicle engineered to operate inside the chaotic cryo-geysers and sub-surface ocean crust of Enceladus or Europa.”',
      instructions: [
        'The idea must be deliberately imaginative yet rooted in real-world physics, thermodynamics, and autonomous systems.',
        'Submissions are accepted in any creative format: an illustrated white paper, an animated video, an infographic poster series, or interactive visual storyboard.',
        'Judging will independently score both artistic craftsmanship/creativity and technical engineering viability.'
      ]
    },
    round2Prompt: {
      title: 'Round 2 Onsite Finals — Live Concept Pitch',
      details: [
        'Top qualifying teams deliver a live 5-minute concept pitch followed by a 4-minute technical Q&A with the judging panel on campus.'
      ]
    },
    deliverables: 'Creative Project Submission (Video, PDF, or Poster series via Google Drive)',
    evaluationCriteria: [
      'Originality and creative storytelling',
      'Soundness of underlying physics and engineering',
      'Visual finish, artistic merit, and presentation',
      'Persuasiveness during live pitch defense'
    ]
  },
  {
    id: 'surprise',
    eventId: '07',
    name: 'Surprise (AEROSS Theatre)',
    mode: 'Hybrid',
    eligibility: 'Grades 6–12',
    team: 'Individual or Team of up to 3',
    status: 'ROUND 1 ACTIVE',
    releaseDate: 'Phase 1 Video Round',
    submissionDeadline: 'See Timeline',
    category: 'Theatrical Arts & Comedy',
    hook: 'Translate space history, physics paradoxes, or astronaut life into compelling entertainment.',
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
      title: 'Round 2 Onsite Finals — Live Improv at AVH',
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
    id: 'dimension3',
    eventId: '08',
    name: 'Dimension III (3D Design & CAD)',
    mode: 'Hybrid',
    eligibility: 'Grades 6–12 (Junior: 6th–8th, Senior: 9th–12th)',
    team: 'Individual or Team of 2',
    status: 'ACTIVE MODELING BRIEF',
    releaseDate: 'Phase 1 Release',
    submissionDeadline: 'See Schedule',
    category: '3D CAD & Prototyping',
    hook: '3D CAD modeling with industrial software for Seniors; physical hands-on craft modeling for Juniors.',
    round1Prompt: {
      title: 'Prompt Selection — Choose 1 of 3 Design Challenges',
      prompts: [
        'Prompt 1: Next-Gen Orbital Tug & In-Orbit Servicing / Refueling Satellite',
        'Prompt 2: Hypersonic Scramjet Waverider Aircraft with Active Thermal Management',
        'Prompt 3: Multi-Crew Pressurized Lunar Surface Exploration Rover'
      ],
      instructions: [
        'Senior Category (Grades 9–12): Models must be built using 3D CAD software (Fusion 360, SolidWorks, Blender, Onshape, AutoCAD). Submit 3D source files (.obj/.fbx/.step) along with 4 high-resolution rendered views and a 2-page design brief.',
        'Junior Category (Grades 6–8): Build a physical structural model using physical craft materials (cardboard, balsa wood, foam board, 3D-printed elements). Submit high-res photos (orthographic & isometric views), a 1-minute video walkthrough, and a brief explanation of the build process.'
      ]
    },
    round2Prompt: {
      title: 'Round 2 Onsite Finals — CAD Model Presentation at OAT (Seniors)',
      details: [
        'Shortlisted senior finalists present and demonstrate their 3D CAD assemblies live on stage at the Open Air Theatre (OAT) to the jury.'
      ]
    },
    deliverables: 'Folder link containing 3D files/renders or photo documentation (Google Drive)',
    evaluationCriteria: [
      'Geometric precision and craftsmanship',
      'Creative aesthetic and industrial detailing',
      'Adherence to selected challenge prompt',
      'Presentation clarity and documentation quality'
    ]
  }
];
