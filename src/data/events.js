export const eventOutline = {
  title: 'Event Outline',
  description:
    'Just like each year, CelesteCon 2026 brings forward a variety of different sub-events to cater to the skills and interest of our wide pool of applicants. If you love the research aspect of aerospace and aviation, our space settlement contest and UAV design challenge have got you covered. For those who have a knack for presenting your ideas, debate and business power pitch await you. And if you\'re someone who loves to learn, we have workshops for that too. A detailed overview of all our events has been listed below.'
};

export const events = [
  {
    id: '01',
    name: 'In Pursuit of Dispute (Debate)',
    mode: 'Hybrid',
    eligibility: 'Grades 9–12',
    team: 'Team of 2 (max 1 team per school)',
    quote: "“It’s better to debate a question without settling it than to settle a question without debating it.”",
    overview:
      'This event is for all those space and aviation enthusiasts who not only love to research, but also to discuss, deliberate and voice their opinions and ideas. This two-round event invites a team of two participants per school to participate in high-energy debates on relevant space and aviation frontiers.',
    hook: 'High-energy parliamentary-style debates on relevant space and aviation frontiers.',
    rounds: [
      {
        title: 'Round 1 (Online Qualifier)',
        desc: 'Participants will be given 2 days to prepare and submit a video-based case presentation on the released debate topic.'
      },
      {
        title: 'Round 2 (Onsite Finals)',
        desc: 'Teams will be assigned their motion 2 days prior to the onsite event. The contest will follow a conventional debate format. Each team will be assigned one stance and is free to divide their speaking time between participants as they wish. Total speaking time per team: 3 or 4 minutes (a warning bell will be sounded). Pairs of teams will debate the same motion with opposing stances. Following each speech, a 3-minute cross-questioning window allows opposing teams and other schools to raise Points of Information (POIs). The judging panel may also pose questions at their discretion. Speakers are advised to memorise their speeches, though reference notes are permitted.'
      }
    ],
    criteria: [
      'Research and technical understanding',
      'Argumentation, evidence and examples',
      'Structure and organisation',
      'Delivery and rhetoric',
      'Rebuttal / clashes'
    ],
    isDraft: false
  },
  {
    id: '02',
    name: 'Quizzitch',
    mode: 'Hybrid',
    eligibility: 'Grades 6–12 (Open)',
    team: 'Team of 2',
    quote: '“Somewhere, something incredible is waiting to be known.” — Carl Sagan',
    overview:
      'This competition is designed for all those students who get excited to learn a new solar system fact, love keeping up with the latest space missions, and genuinely enjoy a good brain teaser. This event challenges students to not only bring scientific knowledge, but also their logical approach and problem-solving skills.',
    hook: 'Aerospace trivia, space mission developments, STEM fundamentals, and logical puzzles.',
    rounds: [
      {
        title: 'Round 1 (Online Prelims)',
        desc: 'Qualifying round conducted online over a 45-minute window (Quiz Platform + Google Meet). Participants answer a wide range of questions spanning aerospace, aviation, STEM, and logical reasoning. Questions are MCQ-based across 3 formats: Single Correct (no negative marking), Single Correct (+2 correct, -1 negative marking), and Multiple Correct (Bonus questions if the rest of the quiz is completed before time). Top 10 teams advance to the final onsite round.'
      },
      {
        title: 'Round 2 (Onsite Finals)',
        desc: 'The finalists compete in an offline battle comprising two parts: (1) Advanced Written Test, and (2) Rapid-Fire / Buzzer Round. Tests advanced subject knowledge, critical thinking, rapid deduction, teamwork, and composure under pressure.'
      }
    ],
    criteria: [
      'Written test score and technical accuracy',
      'Rapid-fire / buzzer round speed & precision',
      'Logical problem-solving & deduction',
      'Teamwork and presence of mind'
    ],
    isDraft: false
  },
  {
    id: '03',
    name: 'Settle-Me-This (Space Settlement)',
    mode: 'Hybrid',
    eligibility: 'Grades 6–12 (Junior: 6th–8th, Senior: 9th–12th)',
    team: 'Team of 3–5 members',
    quote: '“Earth is the cradle of humanity, but one cannot live in the cradle forever.” — Konstantin Tsiolkovsky',
    overview:
      'Space colonisation has come far beyond trying to find a second home on the moon or viewing Mars as the only suitable alternate habitat. With advancements in science and technology, the concept of space settlements has gained immense traction. This event invites participants to create their own proposal for a fully functioning, habitable free-space settlement.',
    hook: 'Design a comprehensive proposal for a fully functioning, habitable free-space settlement.',
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
        desc: 'Participants submit a proposal for a free-space settlement (not situated directly on a planetary or lunar surface, though supporting remote infrastructure may be). Proposals must cover structural design, operations & infrastructure, and human life support/social factors. Submissions may include theoretical research, 2D/3D models, or hand-drawn sketches. Max pages: 25 pages (Junior) / 35 pages (Senior).'
      },
      {
        title: 'Round 2 (Presentation & Defense)',
        desc: 'Top 5 qualifying teams from each category receive a window to polish their submission, then present on the day of the onsite event (for NCR students). Non-NCR qualifying teams will be accommodated virtually on Google Meet 1 day prior to the event (or present virtually). Teams deliver up to a 10-minute presentation (PPT or supporting models), followed by a 5-minute judge Q&A and a 3-minute injection challenge session with follow-up questions.'
      }
    ],
    criteria: [
      'Research and scientific accuracy',
      'Innovation and originality',
      'Engineering and technical feasibility',
      'Clarity and presentation of ideas',
      'Overall proposal quality and defense'
    ],
    isDraft: false
  },
  {
    id: '04',
    name: 'Business Power Pitch',
    mode: 'Hybrid',
    eligibility: 'Grades 6–12',
    team: 'Team of 3 members',
    quote: '“The most powerful person in the world is the storyteller.” — Steve Jobs',
    overview:
      'Real-world innovation requires more than just a good idea—it demands execution and compelling communication. This event challenges you to move from concept to pitch. You and your team must detail an innovative product or service based on the theme and provided sub-tracks, then strategically market and pitch it. Success relies equally on the strength of your idea and your ability to sell it.',
    hook: 'Build and pitch an aerospace venture, product, or service to a panel of investors.',
    rounds: [
      {
        title: 'Round 1 (Business Proposal & Pitch Video)',
        desc: 'Propose a creative product or service solution aligned with your chosen track. Each team must submit: (1) A comprehensive business proposal detailing solution, company overview, product/service breakdown, business model, addressable market, and financial planning; and (2) A 5-minute video pitching the idea in a unique and convincing way.'
      },
      {
        title: 'Round 2 (Live Investor Pitch)',
        desc: 'Qualifying teams compete to secure funding from judges acting as "investors". Teams present a pitch deck in a live 5–7 minute presentation (props or small prototypes are welcomed though not mandatory). Following each presentation, competing teams may highlight flaws or ask sharp questions to earn bonus points.'
      }
    ],
    templateUrl: 'https://docs.google.com/document/d/1wd8T4sqoSLX3euoxNoyVo6AzFL1JX9Vvt_xle5pmrMY/edit?tab=t.0#heading=h.nmq48d4hymqb',
    templateLabel: 'Business Power Pitch Submission Template',
    criteria: [
      'Problem & Research',
      'Innovation & Tech',
      'Impact & Scale',
      'Feasibility',
      'Sustainability',
      'Ethics & Inclusion',
      'Presentation & Storytelling'
    ],
    isDraft: false
  },
  {
    id: '05',
    name: 'Volatus',
    mode: 'Hybrid',
    eligibility: 'Grades 6–12',
    team: 'Team of 2–4 members',
    quote: '“Once you have tasted flight, you will forever walk the earth with your eyes turned skyward.” — Leonardo da Vinci',
    overview:
      'Volatus (Latin for "flight") is built for the engineers and problem-solvers of the aerospace world—those who don\'t just imagine a solution, but are willing to research, design and defend it. This event pushes participants to take a case-based aerospace or aviation problem and develop it into a genuine engineering solution, backed by sound reasoning and technical depth.',
    hook: 'Take a case-based aerospace or aviation problem and engineer a defensible solution.',
    rounds: [
      {
        title: 'Round 1 (Case Proposal)',
        desc: 'Participants choose from 3 case-based prompts released for the round. Teams must prepare and submit an online project proposal outlining their proposed solution, its technical grounding, and its direct relevance to the chosen case.'
      },
      {
        title: 'Round 2 (Science-Fair Exhibit & Defense)',
        desc: 'Shortlisted teams develop their Round 1 submission into a full engineering project based on their assigned case study. Teams present their project in a science-fair style format, with judges and visitors interacting between exhibits. Presentations should include supporting visuals, models, or prototypes. Teams must defend design choices in direct Q&A with judges.'
      }
    ],
    criteria: [
      'Research and technical understanding',
      'Depth and feasibility of the proposed solution',
      'Relevance to the assigned case study',
      'Quality of presentation and exhibit',
      'Ability to answer questions and defend design choices'
    ],
    isDraft: false
  },
  {
    id: '06',
    name: 'Cosmovate',
    mode: 'Hybrid',
    eligibility: 'Grades 6–12',
    team: 'Team of 2–3 members',
    quote: '“Logic will get you from A to B. Imagination will take you everywhere.” — Albert Einstein',
    overview:
      'Cosmovate is where creativity meets engineering. Participants are handed a single, deliberately quirky prompt and challenged to turn it into a real, technically grounded aerospace-themed idea. The event rewards teams who can balance imaginative thinking with the discipline of sound technical reasoning, because a good idea is only as strong as the science behind it.',
    hook: 'Turn an unusual, imaginative prompt into a technically sound aerospace innovation.',
    rounds: [
      {
        title: 'Round 1 (Creative Concept Submission)',
        desc: 'All teams receive the same prompt. Teams develop their idea and submit online in a creative format of their choosing (video, poster, write-up, etc.). Entries receive independent evaluation on both artistic merit and technical backing.'
      },
      {
        title: 'Round 2 (Live Concept Pitch)',
        desc: 'Qualifying teams pitch their concept live to a panel of judges. The pitch must clearly cover the core concept, its technical feasibility, and potential real-world applications. Time limit per pitch: 5 minutes, followed by a short panel Q&A.'
      }
    ],
    criteria: [
      'Originality and creativity of the idea',
      'Technical soundness and feasibility',
      'Clarity and persuasiveness of the pitch',
      'Ability to handle questions from the panel',
      'Artistic merit & visual presentation'
    ],
    isDraft: false
  },
  {
    id: '07',
    name: 'Surprise (AEROSS Theatre)',
    mode: 'Hybrid',
    eligibility: 'Grades 6–12',
    team: 'Individual or Team of up to 3',
    quote: '“If you want to tell people the truth, make them laugh, otherwise they\'ll kill you.” — Oscar Wilde',
    overview:
      'AEROSS Theatre brings the stage to the space enthusiast. This event is for the performers, storytellers and comedians who can take the vastness of aerospace and aviation and turn it into something fun, sharp and genuinely entertaining. Whether it\'s stand-up, a skit or an educational bit aimed at a younger audience, the goal is the same: make space engaging.',
    hook: 'Stand-up, skits, improv, and entertaining theatrical performances on space and aviation.',
    rounds: [
      {
        title: 'Round 1 (Online Video Submission)',
        desc: 'Participants submit a video performance built around an aerospace or aviation theme—this may take the form of stand-up comedy, a skit, improv, or an engaging educational video.'
      },
      {
        title: 'Round 2 (Live Improv at AVH)',
        desc: 'Shortlisted participants perform live at the Audio-Visual Hall (AVH). This round is an improv performance on a topic given on the spot. Performances must stay aerospace-themed and showcase presence of mind under pressure.'
      }
    ],
    criteria: [
      'Humour and audience engagement',
      'Creativity and originality',
      'Relevance to the aerospace/aviation theme',
      'Stage presence and delivery',
      'Improvisational skill (Round 2)'
    ],
    isDraft: false
  },
  {
    id: '08',
    name: 'Dimension III (3D Design & CAD)',
    mode: 'Hybrid',
    eligibility: 'Grades 6–12 (Junior: 6th–8th, Senior: 9th–12th)',
    team: 'Individual or Team of 2',
    quote: '“Design is not just what it looks like and feels like. Design is how it works.” — Steve Jobs',
    overview:
      'Dimension III challenges participants to bring their aerospace concepts into three-dimensional form. For the senior category, this means modelling with precision using industry CAD/3D software; for the junior category, it means building hands-on physical models with real materials. Either way, the goal is the same—translate an idea into a tangible, well-constructed model.',
    hook: 'Bring aerospace concepts to life through 3D CAD modeling or hands-on structural crafting.',
    categories: [
      {
        name: 'Junior Category (Grades 6–8)',
        desc: 'Physical Craft Track: Teams build physical models using tangible materials (cardboard, balsa wood, foam board, etc.) as their final round submission.'
      },
      {
        name: 'Senior Category (Grades 9–12)',
        desc: 'Digital CAD/3D Track: Teams model precision engineering designs using CAD or Blender software, presenting live onsite at the OAT.'
      }
    ],
    rounds: [
      {
        title: 'Round 1 (Prompt Release & Online Build)',
        desc: 'Participants choose from 3 released prompts. Senior models must be built using 3D modelling software only (CAD or Blender) and submitted online. Junior teams build their physical model using physical craft materials as their final submission.'
      },
      {
        title: 'Round 2 (Onsite Showcase at OAT — Seniors)',
        desc: 'Shortlisted senior teams refine and present their final 3D models (CAD/Blender) onsite at the Open Air Theatre (OAT) to the jury.'
      }
    ],
    software: ['AutoCAD', 'Autodesk Fusion 360', 'SolidWorks', 'Blender', 'Onshape'],
    criteria: [
      'Technical accuracy and craftsmanship',
      'Creativity and originality of design',
      'Adherence to the prompt specifications',
      'Overall finish, detail, and presentation'
    ],
    isDraft: false
  },
  {
    id: '09',
    name: 'GameJam',
    mode: 'Onsite',
    eligibility: 'Grades 6–12',
    team: 'Individual or Team of up to 3',
    quote: '“You can discover more about a person in an hour of play than in a year of conversation.” — Plato',
    overview:
      'GameJam is a build-and-play challenge for participants who\'d rather create than compete in the traditional sense. Teams are given a theme ahead of time to design, build and polish a working minigame from scratch, then open it up to peer review and judge evaluation.',
    hook: 'Design, code, and polish a working aerospace minigame for live peer review and playtesting.',
    rounds: [
      {
        title: 'Phase 1 (Theme Release & Pre-Build)',
        desc: 'The theme will be released online ahead of the event. Teams build and test a working minigame based on the theme beforehand.'
      },
      {
        title: 'Phase 2 (Onsite Showcase & Peer Review)',
        desc: 'Teams showcase their playable game on campus for a peer-review round, where participating teams play and rate each other\'s work. Judges will also review submissions independently of the peer-review scores.'
      }
    ],
    criteria: [
      'Creativity and relevance to the theme',
      'Functionality and completeness of the game',
      'Peer review score and gameplay experience',
      'Overall polish, visual aesthetics, and sound design'
    ],
    isDraft: false
  },
  {
    id: '10',
    name: 'AEROSS Foundry',
    mode: 'Onsite',
    eligibility: 'Grades 6–12 (Junior: 6th–8th, Senior: 9th–12th)',
    team: 'Individual or Team of up to 2',
    quote: '“The best way to predict the future is to build it.” — Alan Kay',
    overview:
      'AEROSS Foundry is AEROSS\'s flagship model-making and build challenge, open to students ahead of CelesteCon. Participants design and construct a model of a rocket, drone, plane, satellite, or related aerospace/aviation craft—either as a static scale build or as a working, functional model. The event celebrates hands-on craftsmanship: turning a concept into something you can actually hold, display, or fly.',
    hook: 'Hands-on aerospace model-making for static scale display builds or functional RC/propulsion craft.',
    categories: [
      {
        name: 'Track A — Scale & Static Models (Junior & Senior)',
        desc: 'A non-functional, display-built model of a rocket, drone, plane, satellite, or related aerospace craft. Built to represent the real subject as accurately as possible in form, proportion, and detail. Any material allowed (cardboard, foam board, balsa wood, 3D-printed parts, etc.). Not required to fly or launch.'
      },
      {
        name: 'Track B — Working / RC Models (Senior Only: 9th–12th)',
        desc: 'A functional build including RC-controlled planes/drones, motorized/powered models, or rocket models capable of an actual test launch. Judged on real performance (flight, launch, operation) alongside craftsmanship, with a mandatory live demonstration slot.'
      }
    ],
    rounds: [
      {
        title: 'Registration & Declaration',
        desc: 'Interested participants/teams register and declare their track (Track A or B) and subject (rocket, drone, plane, satellite, or craft) by the registration deadline. Max 1 model per entry.'
      },
      {
        title: 'Build & Submission Window',
        desc: 'Participants build independently with their own materials. Each entry must submit a short info card / write-up (subject, scale if applicable, materials used, and for Track B, a note on how it functions). Models submitted onsite on Judging Day (second week of October, by Oct 9th).'
      },
      {
        title: 'Judging Day & Live Demos',
        desc: 'Track A models are displayed and evaluated in an exhibition-style format with judges reviewing each entry. Track B models additionally receive a live demo/test slot in a designated safe area to demonstrate flight/propulsion functionality.'
      }
    ],
    safetyRules: [
      'Only commercially available, certified model rocket motors, batteries, and RC components are permitted.',
      'No homemade propellants, fuels, or explosive materials of any kind.',
      'All propulsion or RC-powered entries must be checked and cleared by a supervising teacher/mentor before their test slot.',
      'Test launches and flights will only be conducted in a designated, supervised area.'
    ],
    criteria: [
      'Track A: Structural and scale accuracy · Craftsmanship and finish · Detailing · Effective material usage · Accompanying write-up',
      'Track B: Functionality and real performance · Build quality & durability · Safety & reliability · Technical innovation · Explanatory write-up'
    ],
    timeline: [
      { label: 'Registration Opens', date: '01 September 2026' },
      { label: 'Build Window', date: 'September – Early October 2026' },
      { label: 'Submission & Judging Day', date: 'Second week of October (by Oct 9, 2026)' },
      { label: 'Exhibition & Results', date: 'CelesteCon 2026' }
    ],
    isDraft: false
  },
  {
    id: '11',
    name: 'F1 (F1 in Schools)',
    mode: 'Onsite',
    eligibility: 'Grades 9–12 (Senior)',
    team: 'Team of up to 5 members',
    quote: '“Simplify, then add lightness.” — Colin Chapman',
    overview:
      'F1 in Schools is a miniature Formula 1 engineering and racing competition hosted by AEROSS as part of CelesteCon 2026. Teams of students design, develop, and build their own miniature F1-style racing car, combining engineering, aerodynamics, manufacturing, teamwork, branding, and racing. The competition challenges participants to take a car from an initial concept through CAD design and construction to the racetrack, evaluated on performance, engineering decisions, design process, presentation, and team identity.',
    hook: 'Design, manufacture, brand, and race miniature F1 cars on the competition racetrack.',
    rounds: [
      {
        title: 'Design & Build Phase',
        desc: 'Teams design and construct their miniature F1 car using CAD and engineering principles: Aerodynamics & efficiency, Dimensions & proportions, Weight & balance, Wheel/axle alignment, Structural integrity, and Manufacturing precision. Along with the car, teams submit a technical write-up. Teams may also develop full team identity (name, logo, livery, sponsorships, pit display).'
      },
      {
        title: 'Competition & Race Day',
        desc: 'Teams present their cars and engineering work before racing on the track. Includes: (1) Technical Inspection against specifications, (2) Engineering Evaluation of aerodynamics & construction, (3) Team Presentation explaining design choices, (4) Pit Display Evaluation, (5) Official F1 Track Races, and (6) Judges\' technical Q&A.'
      }
    ],
    criteria: [
      'Engineering & CAD Design',
      'Aerodynamics & Efficiency',
      'Manufacturing Precision & Craftsmanship',
      'Track Race Performance',
      'Innovation & Technical Documentation',
      'Team Presentation & Defense',
      'Branding, Livery & Marketing',
      'Teamwork & Organisation'
    ],
    timeline: [
      { label: 'Registration Opens', date: '01 October 2026' },
      { label: 'Design & Build Window', date: '01 – 23 October 2026' },
      { label: 'Car & Doc Submission', date: '24 October 2026' },
      { label: 'Competition & Race Day', date: '24 October 2026' },
      { label: 'Results', date: 'Same day at CelesteCon 2026' }
    ],
    isDraft: false
  }
];
