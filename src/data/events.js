export const eventOutline = {
  title: 'Event Outline',
  description:
    'CelesteCon 2026 brings forward 8 flagship competitions designed to test the complete spectrum of aerospace, engineering, debate, commercialization, and artistic innovation. From orbital settlement architecture to live aircraft flight reviews, chess-clock debates, and field rocketry launches, explore our updated competition catalog below.'
};

export const events = [
  {
    id: '01',
    name: 'Settle-Me-This',
    discipline: 'Space Settlement Design',
    mode: 'Hybrid',
    eligibility: 'Grades 6–12 (Junior: 6th–8th, Senior: 9th–12th)',
    team: 'Team of 3–5 members (max 3 teams per school)',
    quote: '“Earth is the cradle of humanity, but one cannot live in the cradle forever.” — Konstantin Tsiolkovsky',
    overview:
      'The flagship space settlement engineering competition of CelesteCon. Teams author an exhaustive technical engineering proposal for a fully functioning, permanent orbital habitat beyond planetary surfaces, followed by an intense defense before aerospace scientists.',
    hook: 'Design a comprehensive proposal for a self-sustaining, habitable free-space settlement.',
    url: '/events/settle-me-this.html',
    categories: [
      {
        name: 'Junior Category (Grades 6–8)',
        desc: 'Evaluated separately. Maximum proposal length: 25 pages.'
      },
      {
        name: 'Senior Category (Grades 9–12)',
        desc: 'Evaluated separately. Maximum proposal length: 35 pages.'
      }
    ],
    rounds: [
      {
        title: 'Round 1 (Proposal Submission)',
        desc: 'Comprehensive engineering proposal covering orbital mechanics, structural pressure vessels, life support (ECLSS), and artificial gravity architecture.'
      },
      {
        title: 'Round 2 (Presentation & Defense)',
        desc: 'On-campus defense featuring a 10-minute presentation, judge interrogation, and a rapid 3-minute injection challenge.'
      }
    ],
    criteria: [
      'Structural design & artificial gravity sizing',
      'Life support (ECLSS) & radiation shielding',
      'Engineering feasibility & technical depth',
      'Clarity of presentation & injection defense'
    ],
    isDraft: false
  },
  {
    id: '02',
    name: 'Volatus',
    discipline: 'Aviation, UAV & 3D CAD',
    mode: 'Hybrid',
    eligibility: 'Grades 6–12 (Junior: 6th–8th, Senior: 9th–12th)',
    team: 'Team of 2–4 members (max 3 teams per school)',
    quote: '“Once you have tasted flight, you will forever walk the earth with your eyes turned skyward.” — Leonardo da Vinci',
    overview:
      'Aero-Mechanical Design & Digital Prototyping Challenge incorporating Dimension III. Teams design an uncrewed aircraft (UAV/eVTOL) to meet real aerodynamic mission profiles, packaged with a complete 3D CAD assembly and defended in a live flight review.',
    hook: 'Aero-mechanical design challenge incorporating precision 3D CAD modeling and flight review.',
    url: '/events/volatus.html',
    categories: [
      {
        name: 'Junior Division (Grades 6–8)',
        desc: 'Electric fixed-wing cargo aircraft; hand-launchable with a defined payload drop mechanism.'
      },
      {
        name: 'Senior Division (Grades 9–12)',
        desc: 'High-performance eVTOL / long-range delivery aircraft modeled in precision CAD with CFD verification.'
      }
    ],
    rounds: [
      {
        title: 'Round 1 (Technical Dossier & 3D CAD)',
        desc: 'Submission of an aerodynamic technical dossier, flight envelope calculations, and complete 3D CAD assembly files.'
      },
      {
        title: 'Round 2 (Flight Review & Jury Interrogation)',
        desc: 'On-campus flight review at DPS R.K. Puram: CAD model audit, jury defense, and live engineering curveball.'
      }
    ],
    software: ['Autodesk Fusion 360', 'SolidWorks', 'Blender', 'Onshape', 'OpenVSP'],
    criteria: [
      'Aerodynamic sizing & wing loading analysis',
      '3D CAD craftsmanship, packaging & tolerances',
      'Mass properties & CG/static margin verification',
      'Flight review presentation & defense'
    ],
    isDraft: false
  },
  {
    id: '03',
    name: 'In Pursuit of Dispute',
    discipline: 'Debate & Forensics',
    mode: 'Hybrid',
    eligibility: 'Grades 6–12 (Open)',
    team: 'Team of 3 (max 2 teams per school)',
    quote: '“It’s better to debate a question without settling it than to settle a question without debating it.”',
    overview:
      'The flagship forensics and debate championship of CelesteCon, incorporating Quizzitch preliminaries. A proctored online screening of aerospace trivia and STEM logic filters the top teams into a high-energy, chess-clock 3v3 debate tournament on campus.',
    hook: 'Quizzitch prelims integrated with a high-stakes 3v3 chess-clock debate tournament.',
    url: '/events/in-pursuit-of-dispute.html',
    rounds: [
      {
        title: 'Round 1 (Quizzitch Screening & Case Video)',
        desc: 'Online proctored aerospace quiz and 3-minute video case submission on contested space governance motions.'
      },
      {
        title: 'Round 2 (Onsite Chess-Clock Finals)',
        desc: 'Live 3v3 parliamentary debate tournament on campus with a 15-minute shared chess-clock time bank per team and intense POI cross-examination.'
      }
    ],
    criteria: [
      'Technical accuracy & policy grounding',
      'Argumentation structure & empirical evidence',
      'Chess-clock time management & rhetoric',
      'Rebuttal sharpness & clash handling'
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
      'The aerospace venture challenge set beyond Earth. Teams architect a viable commercial venture, service, or resource extraction product on the Moon or Mars, proving financial viability, unit economics, and operational feasibility before an investor jury.',
    hook: 'Architect a space commercialization venture and pitch live before venture capitalists.',
    url: '/events/business-power-pitch.html',
    rounds: [
      {
        title: 'Round 1 (Business Proposal & Pitch Video)',
        desc: 'Comprehensive venture memo covering market size, unit economics, orbital supply chain, and a 5-minute video pitch.'
      },
      {
        title: 'Round 2 (Live Investor Pitch)',
        desc: 'Qualifying teams deliver an on-stage pitch to venture capitalists and industry leaders followed by rigorous financial scrutiny.'
      }
    ],
    criteria: [
      'Problem definition & technical solution',
      'Unit economics & financial modeling',
      'Market strategy & operational feasibility',
      'Pitch deck delivery & investor defense'
    ],
    isDraft: false
  },
  {
    id: '05',
    name: 'Vector GameJam',
    discipline: 'Game Development',
    mode: 'Onsite',
    eligibility: 'Grades 6–12',
    team: 'Team of 1–3 members (max 3 teams per school)',
    quote: '“You can discover more about a person in an hour of play than in a year of conversation.” — Plato',
    overview:
      'The aerospace game development challenge. Teams are tasked with designing, coding, and polishing an original, playable aerospace minigame governed by authentic physics and orbital simulation, showcased live in an on-campus Arcade Expo.',
    hook: 'Code and polish a playable aerospace game for live playtesting and jury scrutineering.',
    url: '/events/gamejam.html',
    rounds: [
      {
        title: 'Phase 1 (Theme Release & Pre-Build)',
        desc: 'Theme released online. Teams design and program a working game prototype accompanied by a Game Design Document (GDD).'
      },
      {
        title: 'Phase 2 (Arcade Expo & Patch Sprint)',
        desc: 'On-campus showcase with peer playtesting, code review by senior developers, and a live curveball patch sprint.'
      }
    ],
    criteria: [
      'Gameplay mechanics & aerodynamic/orbital physics',
      'Code quality, architecture & performance (60 FPS)',
      'Aesthetic direction, UI & sound design',
      'Live patch sprint execution'
    ],
    isDraft: false
  },
  {
    id: '06',
    name: 'AEROSS Theatre',
    discipline: 'Theatre, Improv & Comedy',
    mode: 'Hybrid',
    eligibility: 'Grades 6–12',
    team: 'Team of 1–3 members (max 3 teams per school)',
    quote: '“If you want to tell people the truth, make them laugh, otherwise they\'ll kill you.” — Oscar Wilde',
    overview:
      'The Proscenium & Spotlight Challenge brings aerospace satire, performance art, stand-up comedy, skit, and live improv to the stage. Celebrates performers who can translate the cosmic scale of space exploration into sharp, captivating stagecraft.',
    hook: 'Performing arts, satire, stand-up comedy, and live aerospace improv on the main stage.',
    url: '/events/aeross-theatre.html',
    rounds: [
      {
        title: 'Round 1 (Online Video Audition)',
        desc: 'Teams submit a 3 to 5 minute recorded performance: comedy monologue, theatrical sketch, or aerospace musical satire.'
      },
      {
        title: 'Round 2 (Live Showcase at AVH)',
        desc: 'Finalists perform live on stage at the Audio-Visual Hall (AVH), facing an impromptu Spotlight Curveball topic under pressure.'
      }
    ],
    criteria: [
      'Humour, wit & audience engagement',
      'Artistic originality & thematic relevance',
      'Stage presence, vocal delivery & timing',
      'Spontaneous improv under the spotlight'
    ],
    isDraft: false
  },
  {
    id: '07',
    name: 'Rocketry',
    discipline: 'Rocketry & Fabrication',
    mode: 'Onsite',
    eligibility: 'Grades 6–12 (Junior: 6th–8th, Senior: 9th–12th)',
    team: 'Individual or Team of 1–3 members',
    quote: '“The best way to predict the future is to build it.” — Alan Kay',
    overview:
      'The hands-on aerospace model-making and flight propulsion challenge. Participants construct high-precision static scale rocket models or flight-ready motorized propulsion vehicles capable of an official range test launch under NAR safety regulations.',
    hook: 'Build and launch high-powered scale models and functional rocket craft on the launch pad.',
    url: '/events/rocketry.html',
    categories: [
      {
        name: 'Track A — Scale & Static Craft (Junior & Senior)',
        desc: 'Museum-grade scale reproduction of historical orbital rockets, lunar landers, or planetary probes.'
      },
      {
        name: 'Track B — Flight Rocketry & Launch (Senior: 9th–12th)',
        desc: 'Functional rocket builds with certified commercial solid motors or pneumatic water systems, evaluated in live flight.'
      }
    ],
    rounds: [
      {
        title: 'Round 1 (Engineering Dossier & Blueprint)',
        desc: 'Submit full dimensioned CAD drawings, Barrowman center-of-gravity/pressure calculations, and parachute ejection logic.'
      },
      {
        title: 'Round 2 (Range Scrutineering & Launch)',
        desc: 'Static model exhibition at the OAT followed by live flight launch testing at the designated campus range.'
      }
    ],
    criteria: [
      'Craftsmanship, scale precision & structural finish',
      'Aerodynamic stability margin (≥ 1.0 caliber)',
      'Launch rail clearance velocity & straight ascent',
      'Parachute ejection reliability & safe recovery'
    ],
    isDraft: false
  },
  {
    id: '08',
    name: 'Formula Celeste',
    discipline: 'F1 & Automotive Engineering',
    mode: 'Onsite',
    eligibility: 'Grades 6–12 (Junior & Senior Divisions)',
    team: 'Team of 3–5 members (max 3 teams per school)',
    quote: '“Simplify, then add lightness.” — Colin Chapman',
    overview:
      'The F1 Motorsport Engineering Challenge of CelesteCon 2026. Teams design, manufacture, and brand miniature CO2-powered Formula 1 racing cars, combining CAD/CFD aerodynamics, precision CNC/3D manufacturing, pit-wall marketing, and official track races.',
    hook: 'Design, manufacture, brand, and race miniature F1 cars on the competition racetrack.',
    url: '/events/formula-celeste.html',
    rounds: [
      {
        title: 'Round 1 (Engineering & Enterprise Dossier)',
        desc: 'Submit detailed CAD models, CFD drag polar analysis, and team brand marketing plan.'
      },
      {
        title: 'Round 2 (Track Races & Scrutineering)',
        desc: 'On-campus competition featuring technical scrutineering, pit display defense, and timed 20-meter CO2 racetrack runs.'
      }
    ],
    criteria: [
      'Aerodynamic CFD optimization & downforce balance',
      'Manufacturing tolerance, wheel alignment & weight',
      'Track race elapsed time & reaction speed',
      'Team livery, enterprise branding & oral defense'
    ],
    isDraft: false
  }
];
