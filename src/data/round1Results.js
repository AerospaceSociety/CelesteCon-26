/**
 * CelesteCon 2026 — Official Round 1 Adjudication Communiqué
 * ==========================================================
 * Hybrid Events: Qualified Schools & Teams (No Ranked Order — Alphabetical)
 * 
 * Official qualified delegations as validated by the Conclave Adjudication Jury.
 * All qualifiers listed below are intentionally presented in NO RANKED ORDER,
 * organized alphabetically by School Name. S.No. is strictly for indexing.
 */

export const resultsMetadata = {
  communiquéId: 'AEROSS-C26-COMM-R1-OFFICIAL',
  publicationDate: '20 October 2026',
  publicationTime: '18:00 IST',
  conclaveName: 'CelesteCon 2026 (VI Edition)',
  hostOrganization: 'AEROSS — Aerospace Society, DPS R.K. Puram',
  onsiteFinaleDate: '24 October 2026',
  reportingTime: '07:45 AM – 08:30 AM IST',
  venue: 'Delhi Public School, Sector 12, R.K. Puram, New Delhi — 110022',
  orderDisclaimer: 'Results are published in NO RANKED ORDER (arranged alphabetically by school name). S.No. is solely for indexing. All qualified teams enter the Round 2 Grand Finale with zero rank bias.',
  discordUrl: 'https://discord.gg/5RAF4xVB3',
  supportEmail: 'aeross@dpsrkp.net'
};

export const hybridEventsResults = [
  {
    eventId: '01',
    code: 'SMT',
    name: 'Settle-Me-This',
    discipline: 'Space Settlement Design',
    venue: 'Presentation Hall / AVH',
    hasCategories: true,
    categories: ['Junior Track (Grades 6–8)', 'Senior Track (Grades 9–12)'],
    qualifiers: [
      // SMT Junior (Alphabetical by School Name)
      {
        id: 'SMT-JR-01',
        schoolUID: 'C26-UL-0127',
        teamName: 'TEAM MILKYWAY',
        schoolName: 'Delhi Public School Faridabad',
        category: 'Junior Track (Grades 6–8)'
      },
      {
        id: 'SMT-JR-02',
        schoolUID: 'C26-CM-0163',
        teamName: 'Aegis IV',
        schoolName: 'Delhi Public School Noida Sector 30',
        category: 'Junior Track (Grades 6–8)'
      },
      {
        id: 'SMT-JR-03',
        schoolUID: 'C26-PQ-0129',
        teamName: 'Orbital Haven',
        schoolName: 'DELHI PUBLIC SCHOOL SECTOR 98 FARIDABAD',
        category: 'Junior Track (Grades 6–8)'
      },
      {
        id: 'SMT-JR-04',
        schoolUID: 'C26-RD-0113',
        teamName: 'Project Aethelgard',
        schoolName: 'DELHI PUBLIC SCHOOL SUSHANT LOK GURUGRAM',
        category: 'Junior Track (Grades 6–8)'
      },
      {
        id: 'SMT-JR-05',
        schoolUID: 'C26-ZZ-0123',
        teamName: 'Pioneers Of Space',
        schoolName: 'Tagore International School, East of Kailash',
        category: 'Junior Track (Grades 6–8)'
      },

      // SMT Senior (Alphabetical by School Name)
      {
        id: 'SMT-SR-01',
        schoolUID: 'C26-MZ-0120',
        teamName: 'Gen - Z Scientists',
        schoolName: 'Bal Bharati Public School Noida',
        category: 'Senior Track (Grades 9–12)'
      },
      {
        id: 'SMT-SR-02',
        schoolUID: 'C26-LZ-0111',
        teamName: 'NEXUS',
        schoolName: 'Delhi Public School Faridabad',
        category: 'Senior Track (Grades 9–12)'
      },
      {
        id: 'SMT-SR-03',
        schoolUID: 'C26-CM-0163',
        teamName: 'The Olympus',
        schoolName: 'Delhi Public School Noida Sector 30',
        category: 'Senior Track (Grades 9–12)'
      },
      {
        id: 'SMT-SR-04',
        schoolUID: 'C26-UT-0160',
        teamName: 'ATAL',
        schoolName: 'RYAN INTERNATIONAL SCHOOL, VASANT KUNJ',
        category: 'Senior Track (Grades 9–12)'
      },
      {
        id: 'SMT-SR-05',
        schoolUID: 'C26-ZZ-0123',
        teamName: 'Habitat Hackers',
        schoolName: 'Tagore International School, East of Kailash',
        category: 'Senior Track (Grades 9–12)'
      }
    ]
  },
  {
    eventId: '02',
    code: 'Vol',
    name: 'Volatus',
    discipline: 'Aviation, UAV & 3D CAD Modeling',
    venue: 'Central Quadrangle / Aviation Gallery',
    hasCategories: false,
    categories: ['Senior Track (Grades 9–12)'],
    qualifiers: [
      // Volatus (Alphabetical by School Name)
      {
        id: 'VOL-01',
        schoolUID: 'C26-WR-0116',
        teamName: 'APS HISAR VOLATUS',
        schoolName: 'Army Public School Hisar',
        category: 'Senior Track (Grades 9–12)'
      },
      {
        id: 'VOL-02',
        schoolUID: 'C26-MZ-0120',
        teamName: 'VOLATUS',
        schoolName: 'Bal Bharati Public School Noida',
        category: 'Senior Track (Grades 9–12)'
      },
      {
        id: 'VOL-03',
        schoolUID: 'C26-BH-0115',
        teamName: 'Solaris',
        schoolName: 'Delhi Public School Faridabad',
        category: 'Senior Track (Grades 9–12)'
      },
      {
        id: 'VOL-04',
        schoolUID: 'C26-CN-0161',
        teamName: 'DPSSL',
        schoolName: 'Delhi Public School Sushant Lok',
        category: 'Senior Track (Grades 9–12)'
      },
      {
        id: 'VOL-05',
        schoolUID: 'C26-ZZ-0123',
        teamName: 'AAM lovers',
        schoolName: 'Tagore International School, East of Kailash',
        category: 'Senior Track (Grades 9–12)'
      }
    ]
  },
  {
    eventId: '03',
    code: 'IPOD',
    name: 'In Pursuit of Dispute (IPoD)',
    discipline: 'Quiz (Quizzitch) & Debate',
    venue: 'Debate Chambers',
    hasCategories: false,
    categories: ['Senior Track (Grades 9–12)'],
    qualifiers: [
      // IPoD (Alphabetical by School Name)
      {
        id: 'IPOD-01',
        schoolUID: 'C26-WR-0116',
        teamName: 'APS Hisar',
        schoolName: 'Army Public School Hisar',
        category: 'Senior Track (Grades 9–12)'
      },
      {
        id: 'IPOD-02',
        schoolUID: 'C26-MZ-0120',
        teamName: 'BBPS Noida',
        schoolName: 'Bal Bharati Public School Noida',
        category: 'Senior Track (Grades 9–12)'
      },
      {
        id: 'IPOD-03',
        schoolUID: 'C26-UC-0114',
        teamName: 'BBPS Pitampura',
        schoolName: 'Bal Bharati Public School, Pitampura',
        category: 'Senior Track (Grades 9–12)'
      },
      {
        id: 'IPOD-04',
        schoolUID: 'C26-WU-0133',
        teamName: 'DPS Faridabad',
        schoolName: 'Delhi Public School Faridabad',
        category: 'Senior Track (Grades 9–12)'
      },
      {
        id: 'IPOD-05',
        schoolUID: 'C26-XW-0117',
        teamName: 'DPS Rohini',
        schoolName: 'Delhi Public School Rohini',
        category: 'Senior Track (Grades 9–12)'
      },
      {
        id: 'IPOD-06',
        schoolUID: 'C26-QX-0138',
        teamName: 'DPS Dwarka',
        schoolName: 'Delhi Public School, Dwarka',
        category: 'Senior Track (Grades 9–12)'
      },
      {
        id: 'IPOD-07',
        schoolUID: 'C26-HY-0137',
        teamName: 'DPS Noida',
        schoolName: 'Delhi Public School, Noida',
        category: 'Senior Track (Grades 9–12)'
      },
      {
        id: 'IPOD-08',
        schoolUID: 'C26-EC-0110',
        teamName: 'Hindu Vidyapeeth',
        schoolName: 'Hindu Vidyapeeth Sonepat',
        category: 'Senior Track (Grades 9–12)'
      },
      {
        id: 'IPOD-09',
        schoolUID: 'C26-WB-0108',
        teamName: 'Mayoor School',
        schoolName: 'Mayoor School, Noida, Sec 126',
        category: 'Senior Track (Grades 9–12)'
      },
      {
        id: 'IPOD-10',
        schoolUID: 'C26-UW-0125',
        teamName: 'SRM Public School',
        schoolName: 'SRM PUBLIC SCHOOL NOIDA',
        category: 'Senior Track (Grades 9–12)'
      }
    ]
  },
  {
    eventId: '04',
    code: 'BPP',
    name: 'Business Power Pitch',
    discipline: 'Aerospace Venture & Pitch',
    venue: 'Investor Pitch Arena',
    hasCategories: true,
    categories: ['Junior Track (Grades 6–8)', 'Senior Track (Grades 9–12)'],
    qualifiers: [
      // BPP Junior (Alphabetical by School Name)
      {
        id: 'BPP-JR-01',
        schoolUID: 'C26-MZ-0120',
        teamName: 'NA',
        schoolName: 'Bal Bharati Public School Noida',
        category: 'Junior Track (Grades 6–8)'
      },
      {
        id: 'BPP-JR-02',
        schoolUID: 'C26-CC-0101',
        teamName: 'Project Auralens (Team - Divit)',
        schoolName: 'Delhi Public School Faridabad Sec 19',
        category: 'Junior Track (Grades 6–8)'
      },
      {
        id: 'BPP-JR-03',
        schoolUID: 'C26-PQ-0129',
        teamName: 'DPS 98',
        schoolName: 'DELHI PUBLIC SCHOOL SECTOR 98 FARIDABAD',
        category: 'Junior Track (Grades 6–8)'
      },
      {
        id: 'BPP-JR-04',
        schoolUID: 'C26-HY-0137',
        teamName: 'Team Temptain',
        schoolName: 'Delhi Public School, Noida',
        category: 'Junior Track (Grades 6–8)'
      },

      // BPP Senior (Alphabetical by School Name — Updated with C26-CN-0141 AtmosClear)
      {
        id: 'BPP-SR-01',
        schoolUID: 'C26-MZ-0120',
        teamName: 'Project Orbitra/Team Velora',
        schoolName: 'Bal Bharati Public School Noida',
        category: 'Senior Track (Grades 9–12)'
      },
      {
        id: 'BPP-SR-02',
        schoolUID: 'C26-BH-0115',
        teamName: 'A.C.I.D.R.A.I.N.',
        schoolName: 'Delhi Public School Faridabad',
        category: 'Senior Track (Grades 9–12)'
      },
      {
        id: 'BPP-SR-03',
        schoolUID: 'C26-QX-0138',
        teamName: 'Aether',
        schoolName: 'Delhi Public School, Dwarka',
        category: 'Senior Track (Grades 9–12)'
      },
      {
        id: 'BPP-SR-04',
        schoolUID: 'C26-HY-0137',
        teamName: 'Astro-Scout',
        schoolName: 'Delhi Public School, Noida',
        category: 'Senior Track (Grades 9–12)'
      },
      {
        id: 'BPP-SR-05',
        schoolUID: 'C26-CN-0141',
        teamName: 'AtmosClear',
        schoolName: 'The Indian Heights School',
        category: 'Senior Track (Grades 9–12)'
      }
    ]
  },
  {
    eventId: '05',
    code: 'ATh',
    name: 'AEROSS Theatre',
    discipline: 'Open Stage & Talent Showcase',
    venue: 'Audio-Visual Hall (AVH)',
    hasCategories: false,
    categories: ['Senior Track (Grades 9–12)'],
    qualifiers: [
      // AEROSS Theatre (Alphabetical by School Name)
      {
        id: 'ATH-01',
        schoolUID: 'C26-WR-0116',
        teamName: 'APS Hisar',
        schoolName: 'Army Public School Hisar',
        category: 'Senior Track (Grades 9–12)'
      },
      {
        id: 'ATH-02',
        schoolUID: 'C26-TF-0128',
        teamName: 'AERROS THEATRE',
        schoolName: 'Delhi Public School Faridabad',
        category: 'Senior Track (Grades 9–12)'
      },
      {
        id: 'ATH-03',
        schoolUID: 'C26-HY-0137',
        teamName: 'Team Mod Master',
        schoolName: 'Delhi Public School, Noida',
        category: 'Senior Track (Grades 9–12)'
      },
      {
        id: 'ATH-04',
        schoolUID: 'C26-LH-0169',
        teamName: 'DPS 98',
        schoolName: 'Delhi Public School, Sector 98 Faridabad',
        category: 'Senior Track (Grades 9–12)'
      },
      {
        id: 'ATH-05',
        schoolUID: 'C26-XG-0131',
        teamName: 'TAKE47',
        schoolName: 'The Mann School, Delhi',
        category: 'Senior Track (Grades 9–12)'
      }
    ]
  }
];

export const getTotalQualifiersCount = () => {
  return hybridEventsResults.reduce((sum, event) => sum + event.qualifiers.length, 0);
};
