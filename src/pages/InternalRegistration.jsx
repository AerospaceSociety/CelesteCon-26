import React, { useState } from 'react';

const INTERNAL_EVENTS = [
  {
    id: '01',
    code: 'SMT',
    name: 'Settle-Me-This',
    discipline: 'Space Settlement Design',
    mode: 'Hybrid',
    minMembers: 3,
    maxMembers: 5,
    gradesAllowed: 'both', // 'junior', 'senior', 'both'
    overview: 'Design a permanent, habitable orbital settlement in free space. 2D/3D models and hand-drawn sketches encouraged.',
    portalUrl: '/prompts/settlement'
  },
  {
    id: '02',
    code: 'VOL',
    name: 'Volatus',
    discipline: 'Aviation, UAV & 3D CAD',
    mode: 'Hybrid',
    minMembers: 3,
    maxMembers: 3,
    gradesAllowed: 'senior',
    overview: 'Design a mission-profile UAV or eVTOL with aero calculations, 3D CAD modeling, and onsite science-fair defense.',
    portalUrl: '/prompts/volatus'
  },
  {
    id: '03',
    code: 'IPOD',
    name: 'In Pursuit of Dispute',
    discipline: 'Quiz (Quizzitch) & Debate',
    mode: 'Hybrid',
    minMembers: 2,
    maxMembers: 2,
    gradesAllowed: 'senior',
    overview: 'Online Quizzitch screening round leading into live parliamentary debate chambers on campus.',
    portalUrl: '/prompts/dispute'
  },
  {
    id: '04',
    code: 'BPP',
    name: 'Business Power Pitch',
    discipline: 'Aerospace Venture & Pitch',
    mode: 'Hybrid',
    minMembers: 3,
    maxMembers: 3,
    gradesAllowed: 'both',
    overview: 'Propose a commercial aerospace venture, submit pitch deck and 5-minute video, then pitch live to investor judges.',
    portalUrl: '/prompts/bpp'
  },
  {
    id: '05',
    code: 'ATH',
    name: 'AEROSS Theatre',
    discipline: 'Open Stage & Talent Showcase',
    mode: 'Hybrid',
    minMembers: 3,
    maxMembers: 5,
    gradesAllowed: 'senior',
    overview: 'Total creative freedom: stand-up, skits, instruments, singing, dance, poetry, mimicry, magic or monologues.',
    portalUrl: '/prompts/theatre'
  },
  {
    id: '06',
    code: 'CJAM',
    name: 'CelesteJam',
    discipline: 'Game Development',
    mode: 'Onsite',
    minMembers: 2,
    maxMembers: 3,
    gradesAllowed: 'both',
    overview: 'Build a playable minigame from scratch around the theme, then defend code & host peer playtesting onsite.',
    portalUrl: '/prompts/gamejam'
  },
  {
    id: '07',
    code: 'ROC',
    name: 'Rocketry',
    discipline: 'Model Rocket Design & Simulation',
    mode: 'Onsite',
    minMembers: 2,
    maxMembers: 3,
    gradesAllowed: 'both',
    overview: 'Fabricate a real scale rocket around supplied motor specs, submit OpenRocket files, compete via onsite measurements.',
    portalUrl: '/prompts/rocketry'
  },
  {
    id: '08',
    code: 'APRIX',
    name: 'AEROSS Prix',
    discipline: 'CO2 Dragster & F1 Motorsport',
    mode: 'Onsite',
    minMembers: 3,
    maxMembers: 5,
    gradesAllowed: 'senior',
    overview: 'Design, manufacture, brand, and sprint miniature CO2-powered F1 cars along a 20m high-speed track.',
    portalUrl: '/prompts/prix'
  }
];

const SECTIONS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W'];
const JUNIOR_CLASSES = ['6', '7', '8'];
const SENIOR_CLASSES = ['9', '10', '11', '12'];

// Helper to strictly validate DPS R.K. Puram school email
const isValidDpsrkpEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const clean = email.trim().toLowerCase();
  return /^[a-zA-Z0-9._%+-]+@dpsrkp\.net$/.test(clean);
};

// Clamp a class selection to strictly fit Junior (6-8) or Senior (9-12) category
const clampClassForCategory = (cls, isSenior) => {
  const num = parseInt(cls, 10);
  if (isSenior) {
    if (isNaN(num) || num < 9 || num > 12) return '11';
    return String(num);
  } else {
    if (isNaN(num) || num < 6 || num > 8) return '8';
    return String(num);
  }
};

const JOTFORM_INTERNAL_FORM_ID = '262820575510050';

// Dedup guard to prevent double submissions
let lastSubmitKey = '';
let lastSubmitTimestamp = 0;

// Helper to post directly to JotForm endpoint without CORS restrictions via hidden iframe
const submitToJotFormDirect = (payload) => {
  try {
    const submitKey = `${payload.schoolUID}-${payload.events?.[0]?.teams?.[0]?.teamId}`;
    const now = Date.now();
    if (lastSubmitKey === submitKey && (now - lastSubmitTimestamp) < 10000) {
      console.warn('Duplicate JotForm submission blocked by guard');
      return true;
    }
    lastSubmitKey = submitKey;
    lastSubmitTimestamp = now;

    const team = payload.events?.[0]?.teams?.[0];
    const lead = team?.members?.[0];
    const eventObj = payload.events?.[0];
    const eventName = eventObj?.name || '';

    const summaryText = [
      `CELESTECON 2026 // DPS R.K. PURAM INTERNAL REGISTRATION`,
      `======================================================`,
      `STATUS:       HOST DELEGATION ACCREDITED`,
      `SCHOOL UID:   ${payload.schoolUID}`,
      `TEAM UID:     ${team?.teamId}`,
      `EVENT:        ${eventName}`,
      `TEAM NAME:    ${team?.teamName}`,
      `CATEGORY:     ${team?.category?.toUpperCase() || 'SENIOR'}`,
      `TEAM LEADER:  ${lead?.name} (Class ${lead?.class}, Adm: ${lead?.admissionNo})`,
      `LEAD EMAIL:   ${lead?.email}`,
      `LEAD PHONE:   ${lead?.phone}`,
      `PROJECT NOTE: ${payload.projectNotes || 'N/A'}`,
      ``,
      `ROSTER (${team?.members?.length || 1} MEMBERS):`,
      ...(team?.members || []).map((m, i) => `  ${i + 1}. [${m.memberId}] ${m.name} — Class ${m.class} | Adm: ${m.admissionNo} | ${m.email} (${m.gender})`),
      `======================================================`
    ].join('\n');

    // EXACT question IDs matching live form 262820575510050
    const fields = {
      formID: JOTFORM_INTERNAL_FORM_ID,
      simple_spc: `${JOTFORM_INTERNAL_FORM_ID}-${JOTFORM_INTERNAL_FORM_ID}`,

      // EXACT question IDs matching live form 262820575510050
      q3: team?.teamName || 'DPS R.K. Puram Internal',
      q4: lead?.name || '',
      q5: lead?.email || '',
      q6: lead?.phone || '',
      'q6_phone[phone]': lead?.phone || '',
      'q6_phone[full]': lead?.phone || '',
      q7: lead?.class || '',
      q8: lead?.admissionNo || '',
      q9: eventName,
      q10: team?.category?.toUpperCase() || 'SENIOR',
      q11: team?.teamId || payload.schoolUID,
      q12: summaryText,
      q13: JSON.stringify(payload),

      // Unique names matching live Jotform schema
      q3_teamName: team?.teamName || '',
      q4_studentName: lead?.name || '',
      q5_email: lead?.email || '',
      q6_phone: lead?.phone || '',
      q7_classSection: lead?.class || '',
      q8_admissionNo: lead?.admissionNo || '',
      q9_event: eventName,
      q10_category: team?.category?.toUpperCase() || 'SENIOR',
      q11_uid: team?.teamId || payload.schoolUID,
      q12_registration_summary: summaryText,
      q13_registration_json: JSON.stringify(payload),

      // Standard named fields
      teamName: team?.teamName || '',
      studentName: lead?.name || '',
      email: lead?.email || '',
      phone: lead?.phone || '',
      classSection: lead?.class || '',
      admissionNo: lead?.admissionNo || '',
      event: eventName,
      category: team?.category?.toUpperCase() || 'SENIOR',
      uid: team?.teamId || payload.schoolUID,
      registration_summary: summaryText,
      registration_json: JSON.stringify(payload),
      summary: summaryText,

      // API submission array format (matching exact QID indices)
      'submission[3]': team?.teamName || 'DPS R.K. Puram Internal',
      'submission[4]': lead?.name || '',
      'submission[5]': lead?.email || '',
      'submission[6]': lead?.phone || '',
      'submission[7]': lead?.class || '',
      'submission[8]': lead?.admissionNo || '',
      'submission[9]': eventName,
      'submission[10]': team?.category?.toUpperCase() || 'SENIOR',
      'submission[11]': team?.teamId || payload.schoolUID,
      'submission[12]': summaryText,
      'submission[13]': JSON.stringify(payload)
    };

    // Submit cleanly through silent iframe (zero CORS issues, single submission)
    let iframe = document.getElementById('jf_silent_frame');
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'jf_silent_frame';
      iframe.name = 'jf_silent_frame';
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
    }

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `https://submit.jotform.com/submit/${JOTFORM_INTERNAL_FORM_ID}`;
    form.target = 'jf_silent_frame';
    form.style.display = 'none';

    Object.entries(fields).forEach(([k, v]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = k;
      input.value = v;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    setTimeout(() => {
      try { form.remove(); } catch { }
    }, 1500);

    return true;
  } catch (err) {
    console.warn('JotForm direct submit notice:', err);
    return false;
  }
};

export default function InternalRegistration() {
  // Lead Student details
  const [leadStudent, setLeadStudent] = useState({
    name: '',
    classNum: '11',
    section: 'A',
    admissionNo: '',
    email: '',
    phone: '',
    gender: 'Male'
  });

  // Selected Event
  const [selectedEventId, setSelectedEventId] = useState('07'); // Default to Rocketry
  const [division, setDivision] = useState('senior'); // 'junior' or 'senior'
  const [teamName, setTeamName] = useState('');
  const [projectNotes, setProjectNotes] = useState('');

  // Additional Team Members (excluding lead)
  const [additionalMembers, setAdditionalMembers] = useState([
    { name: '', classNum: '11', section: 'A', admissionNo: '', email: '', gender: 'Male' }
  ]);

  // Code of conduct
  const [agreedToRules, setAgreedToRules] = useState(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [copiedManifest, setCopiedManifest] = useState(false);

  // Selected Event metadata
  const currentEvent = INTERNAL_EVENTS.find(e => e.id === selectedEventId) || INTERNAL_EVENTS[0];

  // Category resolution: If event is Senior-only, category is locked to Senior. If dual, matches division.
  const isSeniorCategory = currentEvent.gradesAllowed === 'senior' || (currentEvent.gradesAllowed === 'both' && division === 'senior');
  const availableClasses = isSeniorCategory ? SENIOR_CLASSES : JUNIOR_CLASSES;

  const handleSelectEvent = (id) => {
    setSelectedEventId(id);
    const ev = INTERNAL_EVENTS.find(e => e.id === id) || INTERNAL_EVENTS[0];

    let targetDivision = division;
    if (ev.gradesAllowed === 'senior') {
      targetDivision = 'senior';
    } else if (ev.gradesAllowed === 'junior') {
      targetDivision = 'junior';
    }
    setDivision(targetDivision);

    const isSenior = targetDivision === 'senior';
    const validLeadClass = clampClassForCategory(leadStudent.classNum, isSenior);
    setLeadStudent(prev => ({
      ...prev,
      classNum: validLeadClass
    }));

    const requiredMinAdditional = Math.max(0, ev.minMembers - 1);
    const allowedMaxAdditional = Math.max(0, ev.maxMembers - 1);

    setAdditionalMembers(prev => {
      let updated = prev.map(m => ({
        ...m,
        classNum: clampClassForCategory(m.classNum, isSenior)
      }));

      if (updated.length < requiredMinAdditional) {
        const diff = requiredMinAdditional - updated.length;
        const toAdd = Array.from({ length: diff }, () => ({
          name: '',
          classNum: validLeadClass,
          section: leadStudent.section,
          admissionNo: '',
          email: '',
          gender: 'Male'
        }));
        updated = [...updated, ...toAdd];
      } else if (updated.length > allowedMaxAdditional) {
        updated = updated.slice(0, allowedMaxAdditional);
      }
      return updated;
    });
  };

  const handleDivisionChange = (newDivision) => {
    setDivision(newDivision);
    const isSenior = newDivision === 'senior';
    const validLeadClass = clampClassForCategory(leadStudent.classNum, isSenior);

    setLeadStudent(prev => ({
      ...prev,
      classNum: validLeadClass
    }));

    setAdditionalMembers(prev => prev.map(m => ({
      ...m,
      classNum: clampClassForCategory(m.classNum, isSenior)
    })));
  };

  const handleAddMember = () => {
    if (additionalMembers.length + 1 >= currentEvent.maxMembers) return;
    setAdditionalMembers(prev => [
      ...prev,
      {
        name: '',
        classNum: clampClassForCategory(leadStudent.classNum, isSeniorCategory),
        section: leadStudent.section,
        admissionNo: '',
        email: '',
        gender: 'Male'
      }
    ]);
  };

  const handleRemoveMember = (index) => {
    if (additionalMembers.length + 1 <= currentEvent.minMembers) return;
    setAdditionalMembers(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleMemberChange = (index, field, value) => {
    setAdditionalMembers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Helper validation
  const totalTeamSize = 1 + additionalMembers.length;
  const isTeamSizeValid = totalTeamSize >= currentEvent.minMembers && totalTeamSize <= currentEvent.maxMembers;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Validation checks
    if (!leadStudent.name.trim()) {
      setFormError('Please enter Team Leader / Primary Student name.');
      return;
    }
    if (!leadStudent.admissionNo.trim()) {
      setFormError('Please enter Team Leader admission number.');
      return;
    }
    if (!leadStudent.email.trim()) {
      setFormError('Please enter Team Leader email address.');
      return;
    }
    if (!isValidDpsrkpEmail(leadStudent.email)) {
      setFormError('Team Leader email must be an official DPS R.K. Puram email ending with @dpsrkp.net (e.g. r24333@dpsrkp.net).');
      return;
    }
    if (!leadStudent.phone.trim()) {
      setFormError('Please enter a contact phone / WhatsApp number.');
      return;
    }
    if (!teamName.trim()) {
      setFormError('Please enter a Team Name or Project Title.');
      return;
    }

    // Check grade eligibility as per Category
    const leadClassNumInt = parseInt(leadStudent.classNum, 10);
    if (isSeniorCategory && leadClassNumInt < 9) {
      setFormError(`Class ${leadStudent.classNum} is not permitted for Senior Category. Allowed classes are Grades 9 to 12.`);
      return;
    }
    if (!isSeniorCategory && leadClassNumInt > 8) {
      setFormError(`Class ${leadStudent.classNum} is not permitted for Junior Category. Allowed classes are Grades 6 to 8.`);
      return;
    }

    // Validate additional members
    for (let i = 0; i < additionalMembers.length; i++) {
      const m = additionalMembers[i];
      if (!m.name.trim()) {
        setFormError(`Please enter the full name for Team Member #${i + 2}.`);
        return;
      }
      const mClassNumInt = parseInt(m.classNum, 10);
      if (isSeniorCategory && mClassNumInt < 9) {
        setFormError(`Team Member #${i + 2} (${m.name || 'Member'}) is in Class ${m.classNum}. Senior Category is strictly restricted to Grades 9–12.`);
        return;
      }
      if (!isSeniorCategory && mClassNumInt > 8) {
        setFormError(`Team Member #${i + 2} (${m.name || 'Member'}) is in Class ${m.classNum}. Junior Category is strictly restricted to Grades 6–8.`);
        return;
      }
      if (!m.admissionNo.trim()) {
        setFormError(`Please enter the admission number for Team Member #${i + 2} (${m.name || 'Member'}).`);
        return;
      }
      if (!m.email.trim() || !isValidDpsrkpEmail(m.email)) {
        setFormError(`Team Member #${i + 2} (${m.name || 'Member'}) email must be an official DPS R.K. Puram email ending with @dpsrkp.net.`);
        return;
      }
    }

    // Ensure distinct emails across all team members
    const allEmails = [
      leadStudent.email.trim().toLowerCase(),
      ...additionalMembers.map(m => m.email.trim().toLowerCase())
    ];
    const uniqueEmails = new Set(allEmails);
    if (uniqueEmails.size !== allEmails.length) {
      setFormError('Each team member must have a distinct, unique @dpsrkp.net email address.');
      return;
    }

    if (!isTeamSizeValid) {
      setFormError(`Team size must be between ${currentEvent.minMembers} and ${currentEvent.maxMembers} members for ${currentEvent.name}.`);
      return;
    }

    if (!agreedToRules) {
      setFormError('Please confirm the internal student code of conduct acknowledgment.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Build internal UID
      const randomInternalSuffix = Math.floor(1000 + Math.random() * 9000);
      const generatedUID = `C26-INT-${randomInternalSuffix}`;
      const divTag = division === 'senior' ? 'Sr' : 'Jr';
      const teamId = `${generatedUID}-${currentEvent.code}-${divTag}`;

      // Assemble complete members roster
      const allMembers = [
        {
          memberId: `${teamId}-M1`,
          name: leadStudent.name.trim(),
          class: `${leadStudent.classNum}-${leadStudent.section}`,
          admissionNo: leadStudent.admissionNo.trim(),
          email: leadStudent.email.trim(),
          phone: leadStudent.phone.trim(),
          gender: leadStudent.gender,
          isLead: true
        },
        ...additionalMembers.map((m, idx) => ({
          memberId: `${teamId}-M${idx + 2}`,
          name: m.name.trim(),
          class: `${m.classNum}-${m.section}`,
          admissionNo: m.admissionNo.trim(),
          email: m.email.trim(),
          phone: '',
          gender: m.gender,
          isLead: false
        }))
      ];

      // Build payload matching API submission schema
      const payload = {
        isInternal: true,
        schoolUID: generatedUID,
        school: {
          name: 'Delhi Public School, R.K. Puram (Host Contingent)',
          contact: leadStudent.name.trim(),
          email: leadStudent.email.trim(),
          phone: leadStudent.phone.trim(),
          city: 'New Delhi (Internal)',
          isInternal: true
        },
        events: [
          {
            id: currentEvent.code.toLowerCase(),
            name: `${currentEvent.name} (${division === 'senior' ? 'Senior' : 'Junior'})`,
            trackLabel: division === 'senior' ? 'Senior Division (Grades 9–12)' : 'Junior Division (Grades 6–8)',
            teams: [
              {
                teamId,
                teamName: teamName.trim(),
                category: division,
                members: allMembers
              }
            ]
          }
        ],
        projectNotes: projectNotes.trim(),
        totals: {
          totalTeams: 1,
          totalStudents: allMembers.length,
          totalParticipants: allMembers.length
        },
        submittedAt: new Date().toISOString()
      };

      let apiSubmissionId = null;

      // 1. Direct submit to JotForm form 262820575510050
      submitToJotFormDirect(payload);

      // 2. Post to API /api/submit
      try {
        const resp = await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...payload,
            formId: JOTFORM_INTERNAL_FORM_ID,
            clientDirect: true
          })
        });

        if (resp.ok) {
          const respData = await resp.json();
          if (respData?.submissionID) apiSubmissionId = respData.submissionID;
          if (respData?.schoolUID) payload.schoolUID = respData.schoolUID;
        }
      } catch (netErr) {
        console.warn('API submission unreachable, persisting to browser secure store:', netErr);
      }

      // 2. Persist in local storage
      try {
        const rawRegs = localStorage.getItem('c26_registrations');
        const regStore = rawRegs ? JSON.parse(rawRegs) : {};
        regStore[payload.schoolUID] = payload;
        localStorage.setItem('c26_registrations', JSON.stringify(regStore));

        const rawInt = localStorage.getItem('c26_internal_registrations');
        const intStore = rawInt ? JSON.parse(rawInt) : [];
        intStore.unshift({ ...payload, submissionID: apiSubmissionId });
        localStorage.setItem('c26_internal_registrations', JSON.stringify(intStore));
        localStorage.setItem('c26_active_uid', payload.schoolUID);
      } catch (storeErr) {
        console.warn('Local storage write warning:', storeErr);
      }

      setSubmissionSuccess({
        ...payload,
        apiSubmissionId
      });
    } catch (err) {
      setFormError(`Failed to process internal registration: ${err.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyManifest = () => {
    if (!submissionSuccess) return;
    const team = submissionSuccess.events[0]?.teams[0];
    const text = `CELESTECON 2026 // DPS R.K. PURAM INTERNAL REGISTRATION
======================================================
STATUS:      ACCREDITED HOST CONTINGENT ENTRY
SCHOOL UID:  ${submissionSuccess.schoolUID}
TEAM UID:    ${team?.teamId}
EVENT:       ${submissionSuccess.events[0]?.name}
TEAM NAME:   ${team?.teamName}
TEAM LEADER: ${team?.members[0]?.name} (Class ${team?.members[0]?.class}, Adm: ${team?.members[0]?.admissionNo})
EMAIL:       ${team?.members[0]?.email}
PHONE:       ${team?.members[0]?.phone}

ROSTER (${team?.members?.length} MEMBERS):
${team?.members?.map((m, i) => `  ${i + 1}. [${m.memberId}] ${m.name} — Class ${m.class} | Adm: ${m.admissionNo} | ${m.email} (${m.gender})`).join('\n')}

VENUE:       Delhi Public School, Sector 12, R.K. Puram
FINALE DATE: 24 October 2026 (07:45 AM Reporting)
======================================================`;

    navigator.clipboard.writeText(text);
    setCopiedManifest(true);
    setTimeout(() => setCopiedManifest(false), 2500);
  };

  const printDocket = () => {
    window.print();
  };


  return (
    <div className="space-y-10">
      {/* ========================================================================= */}
      {/* INTERNAL CONCLAVE HERO HEADER */}
      {/* ========================================================================= */}
      <div className="border-b-4 border-crimson pb-6 md:pb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-crimson/20 border border-crimson text-crimson font-mono text-xs uppercase font-bold tracking-widest">
            <span className="w-2 h-2 rounded-full bg-crimson animate-pulse"></span>
            <span>RESTRICTED ACCESS // HOST SCHOOL CONTINGENT</span>
          </div>
          <span className="font-jp text-xs text-bone-dim tracking-widest">
            学内公認登録 • 航空宇宙大会
          </span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl uppercase text-bone tracking-tight leading-none">
          Internal Registration Form
        </h1>
        <p className="font-label text-base sm:text-lg text-bone-dim mt-2 max-w-3xl leading-relaxed">
          Official enrollment terminal for <strong className="text-bone">Delhi Public School, R.K. Puram</strong> students.
          Register your internal team for CelesteCon 2026 competitions.
        </p>

        {/* Advisory callout */}
        <div className="mt-4 p-3 sm:p-4 bg-ink-2 border-l-4 border-crimson font-mono text-xs text-bone-dim leading-relaxed flex items-start gap-3">
          <span className="text-crimson font-bold text-base">ℹ</span>
          <div>
            <strong className="text-bone uppercase">Host Contingent Advisory:</strong> This portal is strictly for DPS R.K. Puram students.
            Use your student official email (<code className="text-crimson">@dpsrkp.net</code>) and valid Admission Number. External school delegations must use their official School Contingent Portal.
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUCCESS CONFIRMATION DOCKET BANNER */}
      {/* ========================================================================= */}
      {submissionSuccess && (
        <div className="border-4 border-green-500 bg-ink-2 p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b-2 border-green-500/40 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-3.5 h-3.5 bg-green-500 rounded-full animate-ping"></span>
              <div>
                <h2 className="font-display text-2xl sm:text-3xl text-bone uppercase">
                  Internal Registration Verified &amp; Accredited
                </h2>
                <div className="font-mono text-xs text-bone-dim mt-0.5">
                  Host School Delegation // Delhi Public School, R.K. Puram
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-green-500 text-ink font-mono text-xs font-bold uppercase tracking-widest">
                ● STATUS: ACTIVE
              </span>
            </div>
          </div>

          <div className="bg-ink p-4 sm:p-6 border border-bone/40 space-y-4 font-mono text-xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-bone/20 pb-3">
              <span className="text-bone-dim uppercase tracking-wider">ASSIGNED INTERNAL UID:</span>
              <div className="flex items-center gap-2">
                <code className="text-base sm:text-xl font-bold text-crimson bg-ink-2 px-3 py-1 border border-crimson tracking-wider">
                  {submissionSuccess.schoolUID}
                </code>
                <button
                  type="button"
                  onClick={copyManifest}
                  className="px-2.5 py-1 bg-bone text-ink hover:bg-crimson hover:text-bone font-bold transition-colors cursor-pointer"
                >
                  {copiedManifest ? '✓ Copied' : 'Copy Manifest'}
                </button>
              </div>
            </div>

            {submissionSuccess.events?.map((ev, eIdx) => {
              const team = ev.teams?.[0];
              return (
                <div key={eIdx} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-bone-dim leading-relaxed">
                    <div><strong className="text-bone">Event:</strong> {ev.name}</div>
                    <div><strong className="text-bone">Team Name:</strong> {team?.teamName}</div>
                    <div><strong className="text-bone">Team ID:</strong> <span className="text-crimson font-bold">{team?.teamId}</span></div>
                    <div><strong className="text-bone">Lead Student:</strong> {team?.members[0]?.name}</div>
                    <div><strong className="text-bone">Class &amp; Sec:</strong> Class {team?.members[0]?.class}</div>
                    <div><strong className="text-bone">Admission No:</strong> {team?.members[0]?.admissionNo}</div>
                  </div>

                  <div className="pt-2 border-t border-bone/20">
                    <div className="font-bold text-bone uppercase mb-2">Registered Team Roster ({team?.members?.length} Members):</div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse border border-bone/30 text-xs">
                        <thead>
                          <tr className="bg-bone/10 text-bone">
                            <th className="p-2 border border-bone/20">Member ID</th>
                            <th className="p-2 border border-bone/20">Name</th>
                            <th className="p-2 border border-bone/20">Class</th>
                            <th className="p-2 border border-bone/20">Adm No.</th>
                            <th className="p-2 border border-bone/20">DPSRKP Email</th>
                            <th className="p-2 border border-bone/20">Gender</th>
                          </tr>
                        </thead>
                        <tbody>
                          {team?.members?.map((m, mIdx) => (
                            <tr key={mIdx} className="border-b border-bone/10">
                              <td className="p-2 text-crimson font-bold border border-bone/20">{m.memberId}</td>
                              <td className="p-2 text-bone font-medium border border-bone/20">{m.name} {m.isLead ? '(Lead)' : ''}</td>
                              <td className="p-2 text-bone-dim border border-bone/20">{m.class}</td>
                              <td className="p-2 text-bone-dim border border-bone/20">{m.admissionNo}</td>
                              <td className="p-2 text-bone-dim border border-bone/20">{m.email}</td>
                              <td className="p-2 text-bone-dim border border-bone/20">{m.gender}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={printDocket}
              className="px-6 py-3 bg-crimson text-bone font-label font-bold text-xs uppercase tracking-widest border border-crimson hover:bg-ink hover:text-crimson transition-colors cursor-pointer"
            >
              ⎙ Print / Save Docket
            </button>
            <button
              type="button"
              onClick={() => {
                setSubmissionSuccess(null);
                setTeamName('');
                setProjectNotes('');
              }}
              className="px-6 py-3 bg-ink border border-bone/40 text-bone hover:border-crimson hover:text-crimson font-label font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer"
            >
              + Register Another Internal Team
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* REGISTRATION FORM BODY */}
      {/* ========================================================================= */}
      {!submissionSuccess && (
        <form onSubmit={handleSubmit} className="space-y-10">
          {formError && (
            <div className="p-4 bg-crimson/15 border-2 border-crimson text-crimson font-mono text-xs uppercase font-bold flex items-center gap-2">
              <span>⚠️</span>
              <span>{formError}</span>
            </div>
          )}

          {/* --------------------------------------------------------------------- */}
          {/* SECTION 1: PRIMARY STUDENT (LEAD) INFORMATION */}
          {/* --------------------------------------------------------------------- */}
          <div className="border-2 border-bone bg-ink-2/60 p-6 sm:p-8 space-y-6">
            <div className="border-b-2 border-bone/30 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <span className="font-mono text-xs text-crimson uppercase tracking-widest font-bold">Step 01 // 申請者情報</span>
                <h2 className="font-display text-2xl sm:text-3xl text-bone uppercase">
                  Team Leader / Primary Student Details
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs px-2 py-0.5 bg-crimson text-bone uppercase font-bold">
                  Host School: DPS R.K. Puram
                </span>
                {currentEvent.gradesAllowed === 'both' ? (
                  <div className="flex items-center gap-1 bg-ink border border-bone/30 px-2 py-0.5">
                    <span className="font-mono text-[10px] text-bone-dim uppercase font-bold">Category:</span>
                    <button
                      type="button"
                      onClick={() => handleDivisionChange('junior')}
                      className={`px-2 py-0.5 font-mono text-[10px] font-bold uppercase transition-colors cursor-pointer ${division === 'junior'
                        ? 'bg-crimson text-bone'
                        : 'text-bone-dim hover:text-bone'
                        }`}
                    >
                      Junior (6–8)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDivisionChange('senior')}
                      className={`px-2 py-0.5 font-mono text-[10px] font-bold uppercase transition-colors cursor-pointer ${division === 'senior'
                        ? 'bg-crimson text-bone'
                        : 'text-bone-dim hover:text-bone'
                        }`}
                    >
                      Senior (9–12)
                    </button>
                  </div>
                ) : (
                  <span className="font-mono text-xs px-2 py-0.5 bg-ink border border-crimson text-crimson uppercase font-bold">
                    Senior Category (Grades 9–12 Only)
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block font-mono text-xs text-bone uppercase tracking-wider font-bold">
                  Student Full Name <span className="text-crimson">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={leadStudent.name}
                  onChange={(e) => setLeadStudent(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-ink border-2 border-bone px-3.5 py-2.5 text-bone font-label text-sm focus:outline-none focus:border-crimson"
                />
              </div>

              {/* Class & Section */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block font-mono text-xs text-bone uppercase tracking-wider font-bold">
                    Class &amp; Section <span className="text-crimson">*</span>
                  </label>
                  <span className="font-mono text-[10px] text-crimson font-bold uppercase">
                    {isSeniorCategory ? 'Senior (9–12)' : 'Junior (6–8)'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={leadStudent.classNum}
                    onChange={(e) => setLeadStudent(prev => ({ ...prev, classNum: e.target.value }))}
                    className="bg-ink border-2 border-bone px-3 py-2.5 text-bone font-label text-sm focus:outline-none focus:border-crimson cursor-pointer"
                  >
                    {availableClasses.map(c => (
                      <option key={c} value={c} className="bg-ink text-bone">Class {c}</option>
                    ))}
                  </select>
                  <select
                    value={leadStudent.section}
                    onChange={(e) => setLeadStudent(prev => ({ ...prev, section: e.target.value }))}
                    className="bg-ink border-2 border-bone px-3 py-2.5 text-bone font-label text-sm focus:outline-none focus:border-crimson cursor-pointer"
                  >
                    {SECTIONS.map(s => (
                      <option key={s} value={s} className="bg-ink text-bone">Sec {s}</option>
                    ))}
                  </select>
                </div>
                <span className="block font-mono text-[10px] text-bone-dim">
                  {isSeniorCategory
                    ? 'Senior category active: only Classes 9, 10, 11, 12 available.'
                    : 'Junior category active: only Classes 6, 7, 8 available.'}
                </span>
              </div>

              {/* Admission Number */}
              <div className="space-y-1.5">
                <label className="block font-mono text-xs text-bone uppercase tracking-wider font-bold">
                  Admission Number <span className="text-crimson">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. R24333"
                  value={leadStudent.admissionNo}
                  onChange={(e) => setLeadStudent(prev => ({ ...prev, admissionNo: e.target.value.trim() }))}
                  className="w-full bg-ink border-2 border-bone px-3.5 py-2.5 text-bone font-mono text-sm uppercase focus:outline-none focus:border-crimson"
                />
              </div>

              {/* Student Email */}
              <div className="space-y-1.5">
                <label className="block font-mono text-xs text-bone uppercase tracking-wider font-bold">
                  DPSRKP Official Email <span className="text-crimson">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="r24333name@dpsrkp.net"
                    value={leadStudent.email}
                    onChange={(e) => setLeadStudent(prev => ({ ...prev, email: e.target.value.trim().toLowerCase() }))}
                    className={`w-full bg-ink border-2 px-3.5 py-2.5 pr-28 text-bone font-mono text-sm focus:outline-none transition-colors ${leadStudent.email.length === 0
                      ? 'border-bone focus:border-crimson'
                      : isValidDpsrkpEmail(leadStudent.email)
                        ? 'border-green-500 focus:border-green-400'
                        : 'border-crimson focus:border-crimson'
                      }`}
                  />
                  {leadStudent.email.length > 0 && (
                    <div className="absolute right-3 top-2.5 font-mono text-xs pointer-events-none">
                      {isValidDpsrkpEmail(leadStudent.email) ? (
                        <span className="text-green-400 font-bold flex items-center gap-1">
                          <span>✓</span> Valid DPSRKP
                        </span>
                      ) : (
                        <span className="text-crimson font-bold flex items-center gap-1">
                          <span>✕</span> @dpsrkp.net
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className={leadStudent.email && !isValidDpsrkpEmail(leadStudent.email) ? 'text-crimson font-semibold' : 'text-bone-dim'}>
                    Must end with <strong className="text-bone">@dpsrkp.net</strong>
                  </span>
                  {!leadStudent.email.includes('@') && leadStudent.email.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setLeadStudent(prev => ({ ...prev, email: `${prev.email}@dpsrkp.net` }))}
                      className="text-crimson hover:underline cursor-pointer"
                    >
                      + Append @dpsrkp.net
                    </button>
                  )}
                </div>
              </div>

              {/* Phone / WhatsApp */}
              <div className="space-y-1.5">
                <label className="block font-mono text-xs text-bone uppercase tracking-wider font-bold">
                  Mobile / WhatsApp <span className="text-crimson">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98100 XXXXX"
                  value={leadStudent.phone}
                  onChange={(e) => setLeadStudent(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full bg-ink border-2 border-bone px-3.5 py-2.5 text-bone font-mono text-sm focus:outline-none focus:border-crimson"
                />
              </div>

              {/* Gender */}
              <div className="space-y-1.5">
                <label className="block font-mono text-xs text-bone uppercase tracking-wider font-bold">
                  Gender (for Accreditation) <span className="text-crimson">*</span>
                </label>
                <select
                  value={leadStudent.gender}
                  onChange={(e) => setLeadStudent(prev => ({ ...prev, gender: e.target.value }))}
                  className="w-full bg-ink border-2 border-bone px-3.5 py-2.5 text-bone font-label text-sm focus:outline-none focus:border-crimson cursor-pointer"
                >
                  <option value="Male" className="bg-ink text-bone">Male</option>
                  <option value="Female" className="bg-ink text-bone">Female</option>
                  <option value="Other" className="bg-ink text-bone">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* SECTION 2: COMPETITION SELECTION & DIVISION */}
          {/* --------------------------------------------------------------------- */}
          <div className="border-2 border-bone bg-ink-2/60 p-6 sm:p-8 space-y-6">
            <div className="border-b-2 border-bone/30 pb-3 flex justify-between items-center">
              <div>
                <span className="font-mono text-xs text-crimson uppercase tracking-widest font-bold">Step 02 // 競技選択</span>
                <h2 className="font-display text-2xl sm:text-3xl text-bone uppercase">
                  Select CelesteCon 2026 Competition
                </h2>
              </div>
              <span className="font-mono text-xs text-bone-dim hidden sm:inline">
                8 Flagship Challenges
              </span>
            </div>

            {/* Event Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {INTERNAL_EVENTS.map(ev => {
                const isSelected = ev.id === selectedEventId;
                const isSeniorOnly = ev.gradesAllowed === 'senior';

                return (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => handleSelectEvent(ev.id)}
                    className={`text-left p-4 border-2 transition-all relative flex flex-col justify-between cursor-pointer ${isSelected
                      ? 'border-crimson bg-crimson/10 shadow-lg'
                      : 'border-bone/40 hover:border-bone hover:bg-ink/50'
                      }`}
                  >
                    <div>
                      <div className="flex justify-between items-start gap-1 mb-2">
                        <span className="font-mono text-xs font-bold px-1.5 py-0.5 bg-ink border border-bone/30 text-crimson">
                          {ev.code} #{ev.id}
                        </span>
                        <span className="font-mono text-[10px] text-bone-dim uppercase">
                          {ev.mode}
                        </span>
                      </div>
                      <h3 className="font-display text-lg text-bone uppercase tracking-wide leading-snug">
                        {ev.name}
                      </h3>
                      <div className="font-mono text-[11px] text-bone-dim mt-0.5">
                        {ev.discipline}
                      </div>
                      <p className="font-label text-xs text-bone-dim/90 mt-2 leading-relaxed">
                        {ev.overview}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-bone/20 flex justify-between items-center font-mono text-[11px]">
                      <span className="text-bone font-semibold">
                        {ev.minMembers === ev.maxMembers ? `${ev.minMembers} Members` : `${ev.minMembers}–${ev.maxMembers} Members`}
                      </span>
                      <span className={isSeniorOnly ? 'text-crimson font-bold' : 'text-bone-dim'}>
                        {isSeniorOnly ? 'Grades 9–12 Only' : 'Grades 6–12 (Dual)'}
                      </span>
                    </div>

                    {isSelected && (
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-crimson animate-ping" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Competition Settings */}
            <div className="bg-ink p-4 sm:p-6 border border-bone/40 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-bone/20 pb-3">
                <div>
                  <h4 className="font-display text-xl text-bone uppercase">
                    Configuring: {currentEvent.name} ({currentEvent.code})
                  </h4>
                  <p className="font-mono text-xs text-bone-dim">
                    {currentEvent.discipline} • Required Team Size: {currentEvent.minMembers === currentEvent.maxMembers ? `${currentEvent.minMembers} Students` : `${currentEvent.minMembers} to ${currentEvent.maxMembers} Students`}
                  </p>
                </div>

                {/* Division Selector */}
                {currentEvent.gradesAllowed === 'both' ? (
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-bone-dim uppercase font-bold">Category:</span>
                    <button
                      type="button"
                      onClick={() => handleDivisionChange('junior')}
                      className={`px-3 py-1 font-mono text-xs font-bold uppercase transition-colors cursor-pointer ${division === 'junior'
                        ? 'bg-crimson text-bone'
                        : 'bg-ink-2 text-bone-dim hover:text-bone border border-bone/30'
                        }`}
                    >
                      Junior (Grades 6–8)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDivisionChange('senior')}
                      className={`px-3 py-1 font-mono text-xs font-bold uppercase transition-colors cursor-pointer ${division === 'senior'
                        ? 'bg-crimson text-bone'
                        : 'bg-ink-2 text-bone-dim hover:text-bone border border-bone/30'
                        }`}
                    >
                      Senior (Grades 9–12)
                    </button>
                  </div>
                ) : (
                  <span className="font-mono text-xs px-2.5 py-1 bg-ink-2 border border-crimson text-crimson uppercase font-bold">
                    Senior Category (Grades 9–12 Only — No Junior Classes)
                  </span>
                )}
              </div>

              {/* Team Name & Project Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-mono text-xs text-bone uppercase tracking-wider font-bold">
                    Team Name / Entry Title <span className="text-crimson">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AeroVanguard / Project Copernicus"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full bg-ink-2 border-2 border-bone px-3.5 py-2.5 text-bone font-label text-sm focus:outline-none focus:border-crimson"
                  />
                  <span className="block font-mono text-[10px] text-bone-dim">
                    Choose a distinct team or design project moniker.
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-mono text-xs text-bone uppercase tracking-wider font-bold">
                    Specializations / Project Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. OpenRocket simulations ready / CAD modeled in Fusion 360"
                    value={projectNotes}
                    onChange={(e) => setProjectNotes(e.target.value)}
                    className="w-full bg-ink-2 border-2 border-bone px-3.5 py-2.5 text-bone font-label text-sm focus:outline-none focus:border-crimson"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* SECTION 3: TEAM MEMBERS ROSTER */}
          {/* --------------------------------------------------------------------- */}
          <div className="border-2 border-bone bg-ink-2/60 p-6 sm:p-8 space-y-6">
            <div className="border-b-2 border-bone/30 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <span className="font-mono text-xs text-crimson uppercase tracking-widest font-bold">Step 03 // メンバー編成</span>
                <h2 className="font-display text-2xl sm:text-3xl text-bone uppercase">
                  Internal Team Roster ({totalTeamSize} of {currentEvent.minMembers === currentEvent.maxMembers ? currentEvent.minMembers : `${currentEvent.minMembers}–${currentEvent.maxMembers}`} Members)
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className={`font-mono text-xs px-2.5 py-1 font-bold uppercase ${isTeamSizeValid ? 'bg-green-800 text-bone' : 'bg-crimson text-bone'
                  }`}>
                  {isTeamSizeValid ? '✓ Valid Size' : `Needs ${currentEvent.minMembers} to ${currentEvent.maxMembers} Members`}
                </span>
                {totalTeamSize < currentEvent.maxMembers && (
                  <button
                    type="button"
                    onClick={handleAddMember}
                    className="px-3 py-1 bg-bone text-ink hover:bg-crimson hover:text-bone font-mono text-xs font-bold uppercase transition-colors cursor-pointer"
                  >
                    + Add Member
                  </button>
                )}
              </div>
            </div>

            {/* Member 1 (Lead Student - Read-only summary) */}
            <div className="bg-ink p-4 border border-crimson/80 space-y-2">
              <div className="flex justify-between items-center font-mono text-xs">
                <span className="text-crimson font-bold uppercase tracking-wider">
                  Member #1 — Team Leader (Captain)
                </span>
                <span className="text-bone-dim text-[11px]">Synced from Step 01</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div><span className="text-bone-dim">Name:</span> <strong className="text-bone">{leadStudent.name || '(Enter Name in Step 1)'}</strong></div>
                <div><span className="text-bone-dim">Class:</span> <strong className="text-bone">{leadStudent.classNum}-{leadStudent.section}</strong></div>
                <div><span className="text-bone-dim">Adm No:</span> <strong className="text-bone">{leadStudent.admissionNo || '-'}</strong></div>
                <div><span className="text-bone-dim">Email:</span> <strong className="text-bone">{leadStudent.email || '-'}</strong></div>
              </div>
            </div>

            {/* Additional Members */}
            {additionalMembers.map((member, index) => (
              <div key={index} className="bg-ink p-4 border border-bone/40 space-y-3 relative">
                <div className="flex justify-between items-center font-mono text-xs border-b border-bone/20 pb-2">
                  <span className="text-bone font-bold uppercase">
                    Member #{index + 2}
                  </span>
                  {totalTeamSize > currentEvent.minMembers && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(index)}
                      className="text-crimson hover:underline text-xs font-bold cursor-pointer"
                    >
                      ✕ Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  <div className="space-y-1">
                    <label className="block font-mono text-[11px] text-bone uppercase">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Student Name"
                      value={member.name}
                      onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                      className="w-full bg-ink-2 border border-bone px-3 py-2 text-bone font-label text-sm focus:outline-none focus:border-crimson"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-mono text-[11px] text-bone uppercase">Class &amp; Sec *</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <select
                        value={member.classNum}
                        onChange={(e) => handleMemberChange(index, 'classNum', e.target.value)}
                        className="bg-ink-2 border border-bone px-2 py-2 text-bone font-label text-xs focus:outline-none focus:border-crimson cursor-pointer"
                      >
                        {availableClasses.map(c => (
                          <option key={c} value={c} className="bg-ink text-bone">Class {c}</option>
                        ))}
                      </select>
                      <select
                        value={member.section}
                        onChange={(e) => handleMemberChange(index, 'section', e.target.value)}
                        className="bg-ink-2 border border-bone px-2 py-2 text-bone font-label text-xs focus:outline-none focus:border-crimson cursor-pointer"
                      >
                        {SECTIONS.map(s => (
                          <option key={s} value={s} className="bg-ink text-bone">{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-mono text-[11px] text-bone uppercase">Adm No. *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. R25112"
                      value={member.admissionNo}
                      onChange={(e) => handleMemberChange(index, 'admissionNo', e.target.value.trim())}
                      className="w-full bg-ink-2 border border-bone px-3 py-2 text-bone font-mono text-xs uppercase focus:outline-none focus:border-crimson"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-mono text-[11px] text-bone uppercase">DPSRKP Email *</label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        placeholder="r25112@dpsrkp.net"
                        value={member.email}
                        onChange={(e) => handleMemberChange(index, 'email', e.target.value.trim().toLowerCase())}
                        className={`w-full bg-ink-2 border px-3 py-2 text-bone font-mono text-xs focus:outline-none transition-colors ${member.email.length === 0
                          ? 'border-bone focus:border-crimson'
                          : isValidDpsrkpEmail(member.email)
                            ? 'border-green-500 focus:border-green-400'
                            : 'border-crimson focus:border-crimson'
                          }`}
                      />
                    </div>
                    {member.email.length > 0 && (
                      <div className="font-mono text-[9px] mt-0.5">
                        {isValidDpsrkpEmail(member.email) ? (
                          <span className="text-green-400 font-semibold">✓ @dpsrkp.net</span>
                        ) : (
                          <span className="text-crimson font-semibold">✕ Must end with @dpsrkp.net</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block font-mono text-[11px] text-bone uppercase">Gender *</label>
                    <select
                      value={member.gender}
                      onChange={(e) => handleMemberChange(index, 'gender', e.target.value)}
                      className="w-full bg-ink-2 border border-bone px-3 py-2 text-bone font-label text-xs focus:outline-none focus:border-crimson cursor-pointer"
                    >
                      <option value="Male" className="bg-ink text-bone">Male</option>
                      <option value="Female" className="bg-ink text-bone">Female</option>
                      <option value="Other" className="bg-ink text-bone">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* SECTION 4: INTERNAL UNDERTAKING & SUBMISSION */}
          {/* --------------------------------------------------------------------- */}
          <div className="border-2 border-bone bg-ink-2/60 p-6 sm:p-8 space-y-6">
            <div className="border-b-2 border-bone/30 pb-3">
              <span className="font-mono text-xs text-crimson uppercase tracking-widest font-bold">Step 04 // 誓約書および登録</span>
              <h2 className="font-display text-2xl sm:text-3xl text-bone uppercase">
                Student Undertaking &amp; Confirmation
              </h2>
            </div>

            <div className="bg-ink p-4 border border-bone/30 font-label text-xs sm:text-sm text-bone-dim space-y-2 leading-relaxed">
              <p>• All team members are verified bona fide students of Delhi Public School, R.K. Puram.</p>
              <p>• Digital deliverables, presentations, models, and code must adhere strictly to CelesteCon 2026 rules and plagiarism standards.</p>
            </div>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                required
                checked={agreedToRules}
                onChange={(e) => setAgreedToRules(e.target.checked)}
                className="mt-1 w-4 h-4 accent-crimson cursor-pointer"
              />
              <span className="font-mono text-xs text-bone group-hover:text-crimson transition-colors leading-relaxed">
                I hereby declare that all details provided above are correct, and our team commits to adhering to all competition regulations established by AEROSS and Delhi Public School, R.K. Puram.
              </span>
            </label>

            <div className="pt-4 border-t border-bone/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="font-mono text-xs text-bone-dim">
                Delegation Code: <strong className="text-bone">DPS-RKP-HOST-C26</strong>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !isTeamSizeValid}
                className="w-full sm:w-auto px-8 py-4 bg-crimson text-bone font-label font-bold text-sm sm:text-base uppercase tracking-widest border-2 border-crimson hover:bg-ink hover:text-crimson transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
              >
                {isSubmitting ? 'Registering with AEROSS Conclave...' : 'Submit Internal Registration →'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
