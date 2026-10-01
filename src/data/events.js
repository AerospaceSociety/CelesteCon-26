export const eventOutline = {
  title: 'Event Outline & Master Regulations',
  description:
    'CelesteCon 2026 brings forward 8 flagship competitions designed to test the complete spectrum of aerospace, engineering, debate, commercialization, creative arts, and motorsport. From orbital settlement architecture to live aircraft flight reviews, Quizzitch debates, CelesteJam game builds, OpenRocket simulations, and AEROSS Prix sprints, explore the official competition dossiers and timelines below.'
};

export const masterMilestones = {
  regOpens: '01 Oct',
  regDeadlineRegular: '10 Oct 11:59 PM IST',
  regDeadlineExtended: '20 Oct 11:59 PM IST (Rocketry, AEROSS Prix, CelesteJam)',
  r1Commences: '11 Oct',
  onsiteFinale: '24 Oct 07:45 AM Reporting',
  venue: 'Delhi Public School, Sector 12, R.K. Puram, New Delhi — 110022'
};

export const events = [
  {
    id: '01',
    name: 'Settle-Me-This',
    discipline: 'Space Settlement Design',
    mode: 'Hybrid',
    eligibility: 'Grades 6–8 Junior · Grades 9–12 Senior (judged separately)',
    team: 'Team of 3–5 members',
    schoolCap: '2 teams / school',
    quote: '“Mankind was born on Earth. It was never meant to die here.”',
    overview:
      'Create your own proposal for a fully functioning, habitable orbital space settlement in free space. The settlement must not be located on a planet or moon, though support activities may be.',
    hook: 'Author a proposal for a permanent, habitable free-space orbital settlement.',
    categories: [
      {
        name: 'Junior Division (Grades 6–8)',
        desc: 'Open to middle school students. Maximum 25 pages. Evaluated independently with age-appropriate engineering criteria.'
      },
      {
        name: 'Senior Division (Grades 9–12)',
        desc: 'Open to high school students. Maximum 35 pages. Evaluated independently with advanced technical and closed-loop systems evaluation.'
      }
    ],
    rounds: [
      {
        title: 'Round 1 (Online Proposal Submission)',
        desc: 'The settlement must not be located on a planet or moon, though support activities may be. Cover structural design, material selection, life support systems and shielding, plus human aspects such as community planning and socio-economic structure. 2D/3D models and hand-drawn sketches are encouraged. Max 25 pages (Junior) / 35 pages (Senior).'
      },
      {
        title: 'Round 2 (Onsite Presentation & Defense)',
        desc: 'The top 5 teams from each category qualify and may improve their submission before presenting on event day at DPS R.K. Puram, optionally with a digital presentation or other supporting material: 7-min presentation followed by up to 5 min of jury questioning.'
      }
    ],
    criteria: [
      'Research & scientific accuracy',
      'Innovation & originality',
      'Engineering & technical feasibility',
      'Clarity & presentation of ideas',
      'Presentation of proposal'
    ],
    timeline: [
      { label: 'Registration Opens', date: '01 Oct' },
      { label: 'Proposal Submission Deadline', date: '17 Oct' },
      { label: 'Finalists Announcement (Top 5 / Category)', date: '19 Oct' },
      { label: 'Onsite Presentation & Defense', date: '24 Oct (CelesteCon 2026)' }
    ],
    isDraft: false
  },
  {
    id: '02',
    name: 'Volatus',
    discipline: 'Aviation, UAV & 3D CAD (incl. Dimension III)',
    mode: 'Hybrid',
    eligibility: 'Grades 9–12',
    team: 'Team of 3 members',
    schoolCap: '3 teams / school',
    quote: '“Once you have tasted flight, you will forever walk the earth with your eyes turned skyward.” — Leonardo da Vinci',
    overview:
      'Design a UAV or eVTOL that meets a defined mission profile: research it, design it and defend it. Incorporates aero-mechanical calculations, digital 3D CAD modeling, and a science-fair style defense.',
    hook: 'Aero-mechanical UAV/eVTOL design challenge with 3D CAD modeling and live flight exhibit defense.',
    rounds: [
      {
        title: 'Round 1 (Online Proposal & 3D CAD Submission)',
        desc: 'Choose one of 3 case-based prompts released for the round. Submit an online project proposal outlining your solution, its technical grounding and its relevance to the chosen case (e.g. mission profile, aerodynamic sizing, weight & balance analysis), accompanied by a digital 3D model built in CAD software such as Blender, Autodesk Fusion 360 or Onshape.'
      },
      {
        title: 'Round 2 (Onsite Science-Fair Exhibit & Q&A)',
        desc: 'Shortlisted teams develop their Round 1 submission into a full project on their assigned case study and present it science-fair style, with judges and visitors moving between exhibits. A physical model, prototype or display chart is encouraged. Explain and defend your work directly to the judges in a live Q&A.'
      }
    ],
    software: ['Autodesk Fusion 360', 'SolidWorks', 'Blender', 'Onshape', 'AutoCAD', 'OpenVSP', 'FreeCAD'],
    criteria: [
      'Research & technical understanding',
      'Aerodynamic feasibility, airfoil selection & sizing calculations',
      'Relevance to the assigned case study',
      'Structural detailing & 3D CAD model',
      'Quality of presentation & exhibit',
      'Defense of design choices & answering questions'
    ],
    timeline: [
      { label: 'Registration Opens', date: '01 Oct' },
      { label: 'Proposal & 3D Model Due', date: '17 Oct' },
      { label: 'Shortlist Notification', date: '19 Oct' },
      { label: 'Onsite Science-Fair Exhibition', date: '24 Oct (CelesteCon 2026)' }
    ],
    isDraft: false
  },
  {
    id: '03',
    name: 'In Pursuit of Dispute',
    discipline: 'Quiz (Quizzitch) & Debate',
    mode: 'Hybrid',
    eligibility: 'Grades 9–12',
    team: 'Team of 2 members',
    schoolCap: '2 teams / school',
    quote: '“It’s better to debate a question without settling it than to settle a question without debating it.”',
    overview:
      'Qualify through an online aerospace quiz (Quizzitch), then prove your knowledge in a high-energy onsite parliamentary debate.',
    hook: 'Online Quizzitch screening into a high-energy live parliamentary debate on campus.',
    rounds: [
      {
        title: 'Round 1 (Online Quiz — Quizzitch)',
        desc: 'A 45-minute quiz on our custom Quizzitch platform covering orbital mechanics, mission history, space law, astrophysics and more, testing aerospace and STEM knowledge and logical reasoning. MCQs come in three formats: single correct (no negative marking), single correct (+3 / −1), and multiple correct (bonus questions if the rest of the quiz is finished before time). The top 10 teams advance.'
      },
      {
        title: 'Round 2 (Onsite Parliamentary Debate)',
        desc: 'Motions are assigned 3 days before the event (21 Oct). Each team gets one stance, and paired teams debate the same motion from opposite sides. Total speaking time is 5 minutes per team, split between the two speakers as they wish, with warning bells at 4 and 5 minutes. Each debate is followed by 5 minutes of cross-questioning: POIs from the opposing team and other school teams, plus judges’ questions. Notes are allowed for reference.'
      }
    ],
    criteria: [
      'Research & technical understanding',
      'Argumentation, evidence & examples',
      'Structure & organisation',
      'Delivery',
      'Response to cross-questioning & rebuttals'
    ],
    timeline: [
      { label: 'Online Quiz (Quizzitch)', date: '16 Oct' },
      { label: 'Qualifier Results (Top 10 Teams)', date: '19 Oct' },
      { label: 'Motions Assigned (3 Days Prior)', date: '21 Oct' },
      { label: 'Live Debate Chambers', date: '24 Oct (CelesteCon 2026)' }
    ],
    isDraft: false
  },
  {
    id: '04',
    name: 'Business Power Pitch',
    discipline: 'Aerospace Venture & Pitch',
    mode: 'Hybrid',
    eligibility: 'Grades 6–8 Junior · Grades 9–12 Senior (judged separately)',
    team: 'Team of 3 members',
    schoolCap: '2 teams / school',
    quote: '“The most powerful person in the world is the storyteller.” — Steve Jobs',
    overview:
      'Turn a quirky prompt into a technically grounded aerospace or aviation product or service, then market it and pitch it for funding.',
    hook: 'Architect a space commercialization venture, submit a pitch deck & video, and pitch live to investor judges.',
    categories: [
      {
        name: 'Junior Division (Grades 6–8)',
        desc: 'Open to middle school students. Evaluated independently focusing on venture ingenuity, creative storytelling, and presentation delivery.'
      },
      {
        name: 'Senior Division (Grades 9–12)',
        desc: 'Open to high school students. Evaluated independently with rigorous scrutiny of business model viability, unit economics, and investor defense.'
      }
    ],
    rounds: [
      {
        title: 'Round 1 (Pitch Deck & 5-Min Video Submission)',
        desc: 'Choose a sub-track from the theme provided and propose a creative solution as a good or a service. Submit a pitch deck detailing your idea and a 5-minute video pitching it in a unique and convincing way.'
      },
      {
        title: 'Round 2 (Live Investor Pitch & Challenger Interrogation)',
        desc: 'Qualifying teams compete for "funding" from the judges, who act as investors. Present your pitch deck and market your idea in a 7-minute presentation; props, a small prototype or creative and artistic methods are welcome. The panel then cross-questions, and competing teams in the audience may ask challenger questions for bonus points.'
      }
    ],
    templateUrl: 'https://docs.google.com/document/d/1wd8T4sqoSLX3euoxNoyVo6AzFL1JX9Vvt_xle5pmrMY/edit?tab=t.0#heading=h.nmq48d4hymqb',
    templateLabel: 'Business Power Pitch Submission Template',
    criteria: [
      'Originality & creativity of the idea',
      'Technical soundness & feasibility',
      'Presentation style',
      'Clarity & persuasiveness of the pitch',
      'Response to cross-questioning'
    ],
    timeline: [
      { label: 'Round 1 Submission (Deck + Video)', date: '17 Oct' },
      { label: 'Finalists Announcement', date: '19 Oct' },
      { label: 'Live Investor Pitches', date: '24 Oct (CelesteCon 2026)' }
    ],
    isDraft: false
  },
  {
    id: '05',
    name: 'CelesteJam',
    discipline: 'Game Development',
    mode: 'Onsite',
    eligibility: 'Grades 6–12 (Open)',
    team: 'Team of 1–3 members',
    schoolCap: '2 teams / school',
    quote: '“You can discover more about a person in an hour of play than in a year of conversation.” — Plato',
    overview:
      'Build, polish and showcase a working minigame from scratch around a set theme, then open it to peer review and jury evaluation on campus.',
    hook: 'Develop an original minigame around an assigned theme, then defend code & host peer playtesting onsite.',
    rounds: [
      {
        title: 'Round 1 (Theme Release & Pre-Event Build)',
        desc: 'The theme is released online ahead of the event (10 Oct). Build a working minigame based on it beforehand, using any game engine such as Unity, Unreal Engine, Godot, WebGL / Three.js or Pygame.'
      },
      {
        title: 'Round 2 (Arcade Expo, Peer Review & Jury Inspection)',
        desc: 'Teams showcase their games onsite while other participating teams play and rate each other’s work. Judges review submissions independently of peer scores, looking at codebase quality, technical design, frame rate stability, and UI polish. Note: Participants are to bring their own devices to showcase their games.'
      }
    ],
    software: ['Unity', 'Unreal Engine', 'Godot', 'WebGL / Three.js', 'Python / Pygame', 'Raylib / C++', 'Any Engine'],
    criteria: [
      'Creativity & relevance to the theme',
      'Functionality & completeness of the game',
      'Visual aesthetics, UI clarity, sound design & polish',
      'Peer review score'
    ],
    timeline: [
      { label: 'Theme Released Online', date: '10 Oct' },
      { label: 'Registration Deadline', date: '20 Oct 11:59 PM IST' },
      { label: 'Live Arcade Showcase & Peer Review', date: '24 Oct (CelesteCon 2026)' }
    ],
    isDraft: false
  },
  {
    id: '06',
    name: 'AEROSS Theatre',
    discipline: 'Open Stage & Talent Showcase',
    mode: 'Hybrid',
    eligibility: 'Grades 6–12 (Open)',
    team: 'Team of 1–5 members',
    schoolCap: '2 teams / school',
    quote: '“All the world’s a stage, and all the men and women merely players.” — William Shakespeare',
    overview:
      'Total creative freedom: stand-up, skits, instruments, singing, dance, poetry, mimicry, magic or monologues. No aerospace or science theme required.',
    hook: 'Total creative performance freedom — stand-up, skits, music, singing, dance, poetry, magic, or monologues.',
    rounds: [
      {
        title: 'Round 1 (Video Audition Performance)',
        desc: 'Submit a 3–5 minute video performance showcasing a talent of your choice, in any genre. Make sure the audio and visual quality are clear and the video stays strictly within the time limit.'
      },
      {
        title: 'Round 2 (Live Showcase & Spontaneous Improv at the AVH)',
        desc: 'Shortlisted participants perform live on event day in a talent show where creativity has no bounds. The round also includes improv performances on a topic given on the spot, testing presence of mind, quick thinking and creativity under pressure. Stage lighting, vocal mics and audio playback are provided by the host school.'
      }
    ],
    criteria: [
      'Humour & audience engagement',
      'Creativity & originality',
      'Stage presence & delivery'
    ],
    timeline: [
      { label: 'Video Audition Due', date: '17 Oct' },
      { label: 'Finalists Announcement', date: '19 Oct' },
      { label: 'Live Stage Showcase & Improv', date: '24 Oct (CelesteCon 2026)' }
    ],
    isDraft: false
  },
  {
    id: '07',
    name: 'Rocketry',
    discipline: 'Model Rocket Designing & Crafting / Simulation',
    mode: 'Onsite',
    eligibility: 'Grades 6–8 Junior · Grades 9–12 Senior (judged separately)',
    team: 'Team of 1–3 members',
    schoolCap: '2 teams / school',
    quote: '“The best way to predict the future is to build it.” — Alan Kay',
    overview:
      'Build a real rocket around a supplied motor, without fitting it, and let the simulation decide: the best-performing rockets win. No launches at this event.',
    hook: 'Fabricate a scale rocket around a specified motor, submit OpenRocket files, and compete via onsite measurements & simulation.',
    categories: [
      {
        name: 'Junior Division (Grades 6–8)',
        desc: 'Craftsmanship, symmetry, fin alignment, and basic Center of Gravity (CG) vs Center of Pressure (CP) stability verification.'
      },
      {
        name: 'Senior Division (Grades 9–12)',
        desc: 'Advanced aerodynamic sizing, precision OpenRocket simulation alignment, recovery packaging, and high-performance simulation modeling.'
      }
    ],
    rounds: [
      {
        title: 'Single Round (Build, Measure & Simulate — Onsite)',
        desc: 'Every team is given the same motor: a predefined motor from OpenRocket (visit site for specifications). Design and build a rocket around it, with NO actual rocket motor fitted, and share your OpenRocket file with us before the event. On the day, bring the real model to your display station. After check-in and safety screening, the judges measure your rocket and enter those measurements into a simulation. The best-performing rockets win, with Juniors and Seniors ranked separately.'
      }
    ],
    safetyRules: [
      'Build rules: Build it yourselves around the supplied motor specifications.',
      'Pre-made parts such as nosecones or tubes are allowed if declared with your OpenRocket file; ready-to-fly kits are strictly prohibited.',
      'Strict safety mandate: No motors, propellants, igniters, or pressurised components at the venue under any circumstances.',
      'No physical launches or flight tests on campus; all flight performance is evaluated purely through computational simulation based on physical measurements.'
    ],
    criteria: [
      'Simulated flight performance of the measured rocket',
      'Match between the OpenRocket file and the built model',
      'Build quality and craftsmanship'
    ],
    timeline: [
      { label: 'Registration Opens', date: '01 Oct' },
      { label: 'Registration Deadline', date: '20 Oct 11:59 PM IST' },
      { label: 'OpenRocket File Due', date: '22 Oct' },
      { label: 'Onsite Measurement & Simulation', date: '24 Oct (CelesteCon 2026)' }
    ],
    isDraft: false
  },
  {
    id: '08',
    name: 'AEROSS Prix',
    discipline: 'Inspired by F1 Motorsport',
    mode: 'Onsite',
    eligibility: 'Grades 9–12',
    team: 'Team of up to 5 members (1–5 members)',
    schoolCap: '2 teams / school',
    quote: '“Simplify, then add lightness.” — Colin Chapman',
    overview:
      'Found your own racing constructor and take a miniature F1-style car from concept through CAD and manufacturing to the track. The fastest car does not automatically win.',
    hook: 'Design, manufacture, brand, and sprint miniature CO2-powered F1 cars along a 20m high-speed track.',
    rounds: [
      {
        title: 'Round 1 (Design & Documentation — Online)',
        desc: 'Each team enters one car, designed and manufactured by the team with its own materials and resources. Submit a technical write-up (max 30 pages: design, materials, aerodynamic reasoning, development process, key decisions), a CAD model with 3-view drawing, and a one-page team identity summary (name, logo, livery concept, sponsorship plan).'
      },
      {
        title: 'Round 2 (Competition Day — Onsite)',
        desc: '(1) Car inspection against the technical specifications; a non-compliant car cannot race. (2) Engineering evaluation. (3) Team presentation. (4) Pit display evaluation of branding, sponsorship and team identity. (5) F1 race: timed runs, fastest valid run counts. The final result combines engineering, presentation, and race scores.'
      }
    ],
    safetyRules: [
      'Car technical specs: length 170–210 mm · width ≤ 85 mm · height ≤ 65 mm · wheel diameter 26–34 mm · minimum mass 50 g without cartridge.',
      'Propulsion: Organiser-supplied 12 g CO₂ cartridge, handled and loaded exclusively by event marshals.',
      'Budget cap: ₹20,000 for car, spares, tooling, and display (in-kind contributions valued at fair market value).',
      'Structural safety: Cars must withstand rapid deceleration at the deceleration gate without chassis fragmentation.'
    ],
    criteria: [
      'Engineering & design (15 pts)',
      'Aerodynamics (10 pts)',
      'Manufacturing & craftsmanship (10 pts)',
      'Race performance (20 pts)',
      'Innovation & creativity (10 pts)',
      'Technical documentation (10 pts)',
      'Team presentation (10 pts)',
      'Branding & marketing (10 pts)',
      'Teamwork & organisation (5 pts)'
    ],
    timeline: [
      { label: 'Registration Deadline', date: '20 Oct 11:59 PM IST' },
      { label: 'Technical Write-up Submission', date: '22 Oct' },
      { label: 'Scrutineering & Inspection', date: '24 Oct Morning' },
      { label: 'Track Races & Grand Prix Finals', date: '24 Oct (CelesteCon 2026)' }
    ],
    isDraft: false
  }
];
