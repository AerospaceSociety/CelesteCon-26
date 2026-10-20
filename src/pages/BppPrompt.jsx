import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const VALID_SECTIONS = ['brief', 'prompts', 'guide', 'checklist', 'rules'];

const HASH_MAP = {
  tracks: 'prompts',
  template: 'guide',
  cad: 'guide',
  rubrics: 'rules',
  format: 'brief',
  calc: 'brief'
};

const resolveSection = (raw) => {
  const h = (raw || '').replace('#', '').toLowerCase();
  const mapped = HASH_MAP[h] || h;
  return VALID_SECTIONS.includes(mapped) ? mapped : 'brief';
};

const JUNIOR_PROMPTS = [
  {
    id: 'j-thermo',
    code: 'J-TH',
    layer: 'Thermosphere (85–600 km)',
    title: 'The Satellite Lifesaver',
    log: 'When the Sun flares, the top of the atmosphere swells and starts dragging satellites down. Sell the service that keeps them up.',
    story: {
      bg: 'The thermosphere starts about 85 km above the ground and fades out between 500 and 1,000 km up, depending on solar activity. Most low Earth orbit satellites fly through it at ~7.7 km/s. Even trace atmospheric atoms generate drag. When solar storms erupt, the thermosphere heats and expands like a marshmallow over a fire, multiplying drag in hours. In February 2022, SpaceX lost 38 of 49 newly launched Starlink satellites to a geomagnetic storm.',
      challenge: 'Design a commercial service that helps satellite owners track, predict or fight atmospheric drag in the thermosphere, so their satellites stay in orbit longer.',
      hard: 'NOAA publishes daily space-weather forecasts for free, and large operators employ in-house orbital engineers. Your service must deliver superior value: specialized early warnings, thruster-firing schedules, orbit lifetime guarantees, or turnkey flight dynamics for smaller cubesat operators.'
    },
    numbers: [
      { val: '~7.7 km/s', label: 'Orbital velocity at ~400 km altitude' },
      { val: '85–1,000 km', label: 'Thermosphere altitude range (swells with solar flux)' },
      { val: 'Kp 0–9', label: 'Geomagnetic activity index (Kp ≥ 5 = geomagnetic storm)' },
      { val: '~38 of 49', label: 'Starlink satellites lost to storm drag, Feb 2022' },
      { val: '~11 years', label: 'Solar cycle duration (peak drag during solar maximum)' }
    ],
    curveball: 'NOAA\'s space-weather forecasts are free and SpaceX has its own engineers. Name one customer who would pay you this month, and how much.',
    mustCover: [
      { code: 'J-TH.1', title: 'The Service', desc: 'Exact deliverable, frequency, and delivery format (alerts, thruster schedules, monthly API feed). Walk through one customer\'s week.' },
      { code: 'J-TH.2', title: 'Thermosphere Science', desc: 'How solar irradiance expands the thermosphere, aerodynamic drag equations, and input data streams used.' },
      { code: 'J-TH.3', title: 'Target Customers', desc: 'University cubesat labs, commercial Earth-imaging constellations, small telecom operators. Pick your beachhead.' },
      { code: 'J-TH.4', title: 'Competitive Edge', desc: 'Why pay for your service instead of free NOAA data or in-house calculations.' },
      { code: 'J-TH.5', title: 'Unit Economics', desc: 'Monthly fee per satellite/fleet, monthly operating expenses, profit margin, and break-even satellite count.' },
      { code: 'J-TH.6', title: 'Scaling Up', desc: 'Scaling from 10 university cubesats to 5,000 constellation satellites without runaway computational overhead.' }
    ]
  },
  {
    id: 'j-strato',
    code: 'J-ST',
    layer: 'Stratosphere (12–50 km)',
    title: 'The Clean Air Challenge',
    log: 'The ozone layer is healing, slowly. Build a business that helps keep watch over it, and gets paid for doing so.',
    story: {
      bg: 'The stratosphere houses the ozone layer (15–35 km), which absorbs lethal solar ultraviolet radiation. While the 1987 Montreal Protocol successfully banned CFCs, illegal emissions (such as CFC-11 resurging in 2018), mega-wildfire pyrocumulonimbus plumes, and rising orbital rocket exhaust injecting soot directly into the stratosphere pose fresh threats.',
      challenge: 'Design a commercial product or service that uses atmospheric data or technology to help monitor, understand or reduce a real environmental problem connected to the stratosphere.',
      hard: 'NASA and Europe\'s Copernicus programme already publish free satellite ozone data. Customers will only pay for hyper-local resolution, airborne high-altitude balloon sampling, verified emissions auditing, or actionable industrial compliance reports.'
    },
    numbers: [
      { val: '15–35 km', label: 'Altitude range of the stratospheric ozone layer' },
      { val: '~300 DU', label: 'Typical total ozone column in Dobson Units (<220 DU = ozone hole)' },
      { val: '30–35 km', label: 'Burst altitude for standard latex meteorological ozonesondes' },
      { val: '1987', label: 'Montreal Protocol international signing date' },
      { val: '~2066', label: 'Expected Antarctic ozone recovery to 1980 levels (WMO/UNEP)' }
    ],
    curveball: 'NASA and Copernicus publish ozone column data for free. What does your paying client get that cannot be downloaded from NASA Worldview?',
    mustCover: [
      { code: 'J-ST.1', title: 'The Service', desc: 'Exact commercial offering and how it protects/monitors the stratosphere. Client monthly workflow.' },
      { code: 'J-ST.2', title: 'Atmospheric Chemistry', desc: 'Chapman mechanism, catalytic destruction cycles, sensor technology (ozonesondes, UV spectroscopy, Lidar).' },
      { code: 'J-ST.3', title: 'Target Customers', desc: 'Environmental ministries, carbon registries, industrial chemical compliance auditors, launch operators.' },
      { code: 'J-ST.4', title: 'Competitive Advantage', desc: 'Differentiation over free public satellite feeds: higher spatial resolution, rapid response, or legal audit validity.' },
      { code: 'J-ST.5', title: 'Unit Economics', desc: 'Hardware balloon/sensor costs, helium/hydrogen gas expenses, subscription pricing, break-even customer count.' },
      { code: 'J-ST.6', title: 'Geographic Scale', desc: 'Transitioning from a single launch base to multi-regional balloon monitoring networks.' }
    ]
  },
  {
    id: 'j-meso',
    code: 'J-ME',
    layer: 'Mesosphere (50–85 km)',
    title: 'Meteor Intelligence',
    log: 'Every night, space rocks burn up 80 km over your head. Most don\'t matter. Work out which ones do, and who would pay to know.',
    story: {
      bg: 'The mesosphere is dubbed the "ignorosphere": too high for balloons and airplanes, too low for orbital satellites. It is where meteoroids entering at 11 to 72 km/s ablate, creating incandescent meteor trails. While most vaporize into cosmic dust, large bolides—like the 20-meter Chelyabinsk impactor in 2013 that injured 1,500 people—detonate with massive shockwaves.',
      challenge: 'Design a commercial system that detects, analyses and delivers useful information about meteoroids and atmospheric-entry events in the mesosphere.',
      hard: 'Volunteer networks (Global Meteor Network using Raspberry Pi cameras) and defense early-warning satellites already log fireballs. Your business must package actionable intelligence: meteorite recovery ground-footprint coordinates for collectors and universities, real-time shower density warnings for satellite operators, or infrasound discrimination.'
    },
    numbers: [
      { val: '50–85 km', label: 'Mesosphere altitude boundaries' },
      { val: '70–120 km', label: 'Peak light-production ablation altitude for meteors' },
      { val: '11–72 km/s', label: 'Atmospheric entry velocity range for Solar System meteoroids' },
      { val: '~20 m', label: 'Diameter of the 2013 Chelyabinsk superbolide' },
      { val: 'Raspberry Pi', label: 'Core processing hardware used in the Global Meteor Network' }
    ],
    curveball: 'Most meteors burn up harmlessly. Name one specific customer this year who would have paid at least ₹5,00,000 for your detection data, and why.',
    mustCover: [
      { code: 'J-ME.1', title: 'The Solution', desc: 'Sensor modalities (all-sky optical cameras, radio forward scatter, infrasound) and data deliverable.' },
      { code: 'J-ME.2', title: 'Mesospheric Physics', desc: 'Ablation thermodynamics, ionization streaks, and trajectory/velocity triangulation.' },
      { code: 'J-ME.3', title: 'Trajectory Pipeline', desc: 'Triangulation algorithms, dark-flight atmospheric wind drift, and ground strewn-field calculation.' },
      { code: 'J-ME.4', title: 'Customer Personas', desc: 'Research observatories, mineralogical museums, satellite constellation fleet directors, defense radar operators.' },
      { code: 'J-ME.5', title: 'Technical Feasibility', desc: 'Off-the-shelf vs proprietary hardware components, network infrastructure, and bandwidth constraints.' },
      { code: 'J-ME.6', title: 'Edge over Public Nets', desc: 'Why commercial clients pay you rather than scraping free open-source camera logs.' },
      { code: 'J-ME.7', title: 'Revenue & Costs', desc: 'Data subscription pricing, camera station fabrication/maintenance costs, unit contribution margin.' },
      { code: 'J-ME.8', title: 'CapEx Allocation', desc: 'Seed funding split across R&D, sensor deployment, cloud infrastructure, and operational overhead.' },
      { code: 'J-ME.9', title: '10-Year Growth Plan', desc: 'Phased expansion milestones for Years 1, 3, 5, and 10.' },
      { code: 'J-ME.10', title: 'Cost-Effective Scale', desc: 'Adding 1,000 detection nodes worldwide without exponential operational maintenance cost.' }
    ]
  },
  {
    id: 'j-ozone',
    code: 'J-OZ',
    layer: 'Troposphere / Stratosphere Boundary (10–13 km)',
    title: 'Ozone Flight Intelligence',
    log: 'Airliners already fly through the air scientists want to measure. Turn them into a sensor network and sell what it learns.',
    story: {
      bg: 'Modern commercial airliners cruise at 10–12 km, skimming the tropopause and entering the lower stratosphere on polar or winter routes. High stratospheric ozone concentrations entering aircraft air conditioning bleed systems cause passenger nausea, headaches, and respiratory irritation. FAA regulations (14 CFR 25.832) strictly limit cabin ozone to 0.25 ppm peak and 0.1 ppm time-weighted average.',
      challenge: 'Design a commercial service that uses an onboard ozone sensor to collect, analyse and deliver useful atmospheric intelligence to airlines.',
      hard: 'Commercial airliners require strict aviation regulatory certification (DGCA / FAA / EASA STC certifications). Hardware modifications are expensive. Airlines will only adopt your pod if it saves fuel through route planning, extends ozone catalytic converter lifespan, or generates secondary data licensing revenue.'
    },
    numbers: [
      { val: '10–12 km', label: 'Standard commercial jetliner cruising altitude' },
      { val: '0.25 ppm', label: 'FAA peak cabin ozone limit (above 32,000 ft)' },
      { val: '0.10 ppm', label: 'FAA 3-hour time-weighted average cabin ozone limit' },
      { val: '1994', label: 'MOZAIC / IAGOS civil airliner atmospheric research inception' },
      { val: 'Hundreds', label: 'Fleet sizes of major Indian air carriers (IndiGo, Air India)' }
    ],
    curveball: 'An airline can buy pre-flight ozone weather maps for free. What specific line item on your monthly report saves them more money than your subscription costs?',
    mustCover: [
      { code: 'J-OZ.1', title: 'The Service', desc: 'Onboard pod sensing, data telemetry, and airline operational dispatcher dashboard.' },
      { code: 'J-OZ.2', title: 'Sensor & Airframe Integration', desc: 'Pitot static port or fuselage skin probe, UV photometer sensor, avionics power draw, and DGCA STC path.' },
      { code: 'J-OZ.3', title: 'Customer Segments', desc: 'Airline flight operations, fleet maintenance managers, meteorological research agencies.' },
      { code: 'J-OZ.4', title: 'Competitive Advantage', desc: 'Why airlines prefer your real-time hardware data over weather models or IAGOS research feeds.' },
      { code: 'J-OZ.5', title: 'Revenue Model', desc: 'Hardware lease/sale + monthly SaaS fee per tail, sensor maintenance cycle, and unit margins.' },
      { code: 'J-OZ.6', title: 'CapEx Split', desc: 'Seed funding allocation across aviation certification, hardware production, cloud analytics, and team.' },
      { code: 'J-OZ.7', title: '5-Year Plan', desc: 'Tail fleet adoption curve, revenue, operating expenditure, and net profitability timeline.' },
      { code: 'J-OZ.8', title: 'Success Metrics', desc: '3–5 key performance indicators (sensor uptime, airline fuel savings, catalytic converter MTBF extension).' },
      { code: 'J-OZ.9', title: 'Fleet Scalability', desc: 'Economics of outfitting 20 aircraft vs scaling to 500 aircraft across global airline alliances.' }
    ]
  },
  {
    id: 'j-bonus',
    code: 'J-BX',
    layer: 'Open Track (optional)',
    title: 'From Imagination to Impact',
    log: 'Find a problem everyone around you has learned to live with. Build the business that fixes it.',
    story: {
      bg: 'Society accepts countless chronic inefficiencies: school gate traffic gridlocks, unpredictable water tankers, broken cold-chain vaccine logistics, agricultural waste burning, or unmonitored solar roof degradation. Every chronic inconvenience represents a commercial venture.',
      challenge: 'Create a business solving an overlooked real-world problem that customers didn\'t realize had an elegant commercial solution. Submitted as an optional separate addendum (max 4 pages).',
      hard: 'A cute idea is not a business. You must prove real willingness to pay, survey prospective buyers, calculate unit cost to make vs price, and defend break-even numbers.'
    },
    numbers: [
      { val: '20+ people', label: 'Target customer interviews recommended' },
      { val: '1 unit', label: 'Must compute rigorous cost of 1 physical or digital unit' },
      { val: '4 pages', label: 'Maximum page limit for Junior open track addendum PDF' }
    ],
    curveball: 'What do people do about this problem today, and why would they stop doing that and pay you instead of continuing to do nothing?',
    mustCover: [
      { code: 'J-BX.1', title: 'The Problem', desc: 'Pain point, frequency, and verified customer interview evidence.' },
      { code: 'J-BX.2', title: 'The Solution', desc: 'Product/service architecture, bill of materials, and labelled schematics.' },
      { code: 'J-BX.3', title: 'Customer Profile', desc: 'Economic buyer vs daily user, beachhead customer acquisition plan.' },
      { code: 'J-BX.4', title: 'Unit Economics', desc: 'Cost of goods sold (COGS), selling price, unit contribution, monthly fixed overhead, break-even.' },
      { code: 'J-BX.5', title: 'Defensibility', desc: 'Why competitors or incumbents cannot replicate your offering within 6 months.' },
      { code: 'J-BX.6', title: 'Growth Engine', desc: 'Pathway from 50 pilot customers to municipal or regional scale.' }
    ]
  }
];

const SENIOR_PROMPTS = [
  {
    id: 's-thermo',
    code: 'S-TH',
    layer: 'Thermosphere & Beyond (LEO to Deep Space)',
    title: 'Make the Sun Pay for the Shield',
    log: 'Spacecraft carry dead weight to protect themselves from the Sun. Design a shield that earns its mass back.',
    story: {
      bg: 'Spacecraft in LEO pass through the South Atlantic Anomaly (SAA), while lunar and interplanetary probes face devastating Solar Particle Events (SPE) and Galactic Cosmic Rays (GCR). High-energy protons flip memory bits, degrade solar cells, and induce single-event latchups. Conventional defenses rely on thick aluminum or polyethylene passive shielding (adding parasitic launch mass) and radiation-hardened chips that cost 10x commercial silicon.',
      challenge: 'Design a scalable commercial system that reduces harmful radiation for spacecraft in the thermosphere and beyond, by deflecting it, absorbing it, or both, while recovering useful energy from what it captures to help power the spacecraft.',
      hard: 'The solar constant delivers ~1,361 W/m² of electromagnetic sunlight, but the solar wind carries less than 0.001 W/m² of kinetic particle energy. In LEO, Earth\'s geomagnetic field shields most solar wind anyway. If particle harvesting produces only microwatts, you must derive the economic payoff from mass reduction, dual-use structural batteries, or propellant water shielding.'
    },
    numbers: [
      { val: '1,361 W/m²', label: 'Solar constant (electromagnetic irradiance at 1 AU)' },
      { val: '< 0.001 W/m²', label: 'Average particle kinetic power density in solar wind at 1 AU' },
      { val: '~400 km', label: 'ISS orbit altitude (shielded inside magnetosphere except SAA)' },
      { val: '$ thousands/kg', label: 'Commercial rideshare launch costs to Low Earth Orbit' },
      { val: 'SAA', label: 'South Atlantic Anomaly: trapped Van Allen radiation dip' }
    ],
    curveball: 'How many usable watts does your system recover per kilogram added, and how does that compare with simply launching an extra square metre of solar panel?',
    mustCover: [
      { code: 'S-TH.1', title: 'Physical Mechanism', desc: 'Deflection (magnetic/electrostatic Lorentz force) vs absorption (borated hydrides, liquid hydrogen, graphene) + energy harvesting mechanism.' },
      { code: 'S-TH.2', title: 'Energy & Mass Budget', desc: 'Watts harvested vs parasitic mass added. Radiation dosage reduction (Sieverts / rads) compared with equivalent aluminum shielding.' },
      { code: 'S-TH.3', title: 'Launch Mass Savings', desc: 'Parasitic shielding mass eliminated × launch price per kg ($/kg) = net launch cash savings per satellite across 2 standard bus sizes.' },
      { code: 'S-TH.4', title: 'Market Segmentation', desc: 'Initial beachhead in commercial LEO megaconstellations scaling to lunar cislunar tugs and deep-space science probes.' },
      { code: 'S-TH.5', title: 'Competitive Defense', desc: 'Why your system outperforms redundant rad-hard silicon, spot-shielding, and ECC memory algorithms.' },
      { code: 'S-TH.6', title: 'Pricing & Licensing', desc: 'Hardware bus OEM sales vs IP patent licensing vs dollar-per-kilogram-saved performance pricing.' },
      { code: 'S-TH.7', title: 'CapEx & Flight Testing', desc: 'Cyclotron radiation beam testing, CubeSat in-orbit demonstration (IOD) launch costs, and break-even milestones.' },
      { code: 'S-TH.8', title: 'Risk, ITAR & IN-SPACe', desc: 'Space regulatory licensing under Indian Space Policy 2023 / IN-SPACe, export compliance, patent moats.' },
      { code: 'S-TH.9', title: '5-Year Pro-Forma', desc: 'Detailed 5-year financial statement: R&D phase, IOD flight, commercial OEM rollout, cash burn, and EBITDA.' }
    ]
  },
  {
    id: 's-meso',
    code: 'S-ME',
    layer: 'Mesosphere (50–85 km)',
    title: 'AeroGenesis: The Flying Dinosaur',
    log: 'Design the most aerodynamically advanced flying dinosaur ever, from the bones up. Then turn what you learned into a business.',
    story: {
      bg: 'Pterosaurs like Quetzalcoatlus reached 10-meter wingspans and ~200 kg body mass. But biological evolution is constrained by genetic path-dependence; it never engineered optimal aerodynamic camber, vortex generators, or carbon-nanotube bone density. In the mesosphere, air density plummets to ~0.001 kg/m³ at 50 km (1,000x thinner than sea level), making conventional wings useless. Thin air demands extreme wing area, hypersonic velocities, or negligible wing loading.',
      challenge: 'Design and commercialise the world\'s most aerospace-optimised flying dinosaur. Treat it as a rigorous aerospace engineering problem, then build a business licensing or manufacturing the resulting aerodynamic technologies.',
      hard: 'The square-cube law is brutal: double length and mass scales 8x while wing area scales only 4x. Muscle power output tops out around 100–150 W/kg. A massive flyer cannot sustain continuous flapping; it must rely on atmospheric thermal soaring, dynamic soaring, or aeroelastic morphing wings.'
    },
    numbers: [
      { val: 'L = ½ρv²S·CL', label: 'Fundamental aerodynamic lift formula' },
      { val: '1.225 kg/m³', label: 'Sea level air density (US Standard Atmosphere 1976)' },
      { val: '0.413 kg/m³', label: 'Air density at 10 km (airliner cruise)' },
      { val: '0.089 kg/m³', label: 'Air density at 20 km (U-2 / Zephyr HAPS cruise)' },
      { val: '~0.001 kg/m³', label: 'Air density at 50 km (stratopause / lower mesosphere)' },
      { val: '~10 m', label: 'Wingspan of Quetzalcoatlus northropi' }
    ],
    curveball: 'Double your dinosaur\'s wingspan. What happens to its structural mass, its stall speed in thin air, and its daily metabolic food caloric requirement?',
    mustCover: [
      { code: 'S-ME.1', title: 'Biomimetic Airframe', desc: 'Skeletal anatomy, pneumatic hollow bones, skin membrane elastodynamics, wingspan, chord, aspect ratio, mass budget.' },
      { code: 'S-ME.2', title: 'Flight Mechanics', desc: 'Wing loading (W/S), lift coefficient (CL_max), flapping kinematic cycles vs dynamic thermal soaring regimes.' },
      { code: 'S-ME.3', title: 'Aerodynamic Drag Profile', desc: 'Parasite, profile, and induced drag breakdown (CD = CD0 + CL²/π·AR·e), wingtip vortices, Reynolds number.' },
      { code: 'S-ME.4', title: 'Performance Envelope', desc: 'Stall speed (v_stall), cruise speed, maximum ceiling, turn radius at load factor n, power required curve.' },
      { code: 'S-ME.5', title: 'Bio-Energetics', desc: 'Basal metabolic rate (BMR), active flight muscle power (W/kg), daily caloric intake (Joules/day), feeding logistics.' },
      { code: 'S-ME.6', title: 'Atmospheric Boundary', desc: 'Performance degradation across altitudes (0 km to 20 km ceiling); show why it cannot fly in the mesosphere.' },
      { code: 'S-ME.7', title: 'Proprietary Innovation', desc: 'Novel aerodynamic feature: passive gust-alleviating aeroelastic wingtips, leading-edge tubercles, or riblets.' },
      { code: 'S-ME.8', title: 'Engineering Trade-offs', desc: 'Three quantified trade-offs (e.g. wing aspect ratio vs roll rate vs spar root bending moment).' },
      { code: 'S-ME.9', title: 'Commercial Spin-Off', desc: 'Licensing biomimetic morphing wing skins or gust-alleviation control algorithms to HAPS drone makers.' },
      { code: 'S-ME.10', title: 'Venture Financials', desc: 'AeroGenesis business model: patent royalties, R&D government grants, unit economics, 5-year pro-forma.' }
    ]
  },
  {
    id: 's-exo',
    code: 'S-EX',
    layer: 'Exosphere & Beyond (600 km+ / Deep Space)',
    title: 'Asteroid Prospecting, Series A',
    log: 'One fund, one cheque, one asteroid company. Close the mass budget or don\'t get funded.',
    story: {
      bg: 'The exosphere fades into the interplanetary medium above 600 km. It is 2045: in-orbit propellant depots, orbital shipyards, and space stations demand hundreds of tonnes of water (for hydrogen/oxygen fuel) and structural metals. Lifting resources from Earth\'s deep gravity well costs thousands of dollars per kilogram. Near-Earth Asteroids (NEAs) like Ryugu, Bennu, or metallic M-type asteroids hold trillions of dollars in volatile and metallurgical wealth with negligible escape velocities.',
      challenge: 'Pitch a company that mines one resource from one near-Earth asteroid and sells it to customers in Earth orbit.',
      hard: 'Your real benchmark is launch cost from Earth. As heavy-lift rockets drive launch costs down, your delivered cost per kilogram in LEO/cislunar space must beat Earth-launched mass. You must close the rocket equation for both outbound and return legs, anchor in microgravity, and solve space resource property law.'
    },
    numbers: [
      { val: 'Δv = Isp·g0·ln(m0/mf)', label: 'Tsiolkovsky rocket equation (g0 = 9.80665 m/s²)' },
      { val: '300–450 s', label: 'Chemical bipropellant specific impulse (Isp)' },
      { val: '1,500–3,000 s', label: 'Hall-effect and gridded-ion electric propulsion Isp' },
      { val: '1,361 ÷ r² W/m²', label: 'Solar irradiance at r Astronomical Units (AU) from the Sun' },
      { val: '~120 g · ~5 g', label: 'OSIRIS-REx (Bennu) and Hayabusa2 (Ryugu) sample masses' }
    ],
    curveball: 'Your mass budget closes with 20% margin. Then your asteroid extraction yield comes in at 50% of nominal. What breaks first: the mission timeline or the venture balance sheet?',
    mustCover: [
      { code: 'S-EX.1', title: 'Asteroid Target', desc: 'Specific target chosen from JPL Small-Body Database: designation, spectral type, semi-major axis, eccentricity, rotation period.' },
      { code: 'S-EX.2', title: 'Resource & Customer', desc: 'Single target resource (e.g. water ice for LOX/LH2 propellant or nickel-iron), delivery form, and first in-orbit client.' },
      { code: 'S-EX.3', title: 'Mission Architecture', desc: 'Trajectory delta-v breakdown (LEO escape, transfer, rendezvous, return, Earth capture), launch windows.' },
      { code: 'S-EX.4', title: 'Rocket Equation Proof', desc: 'Full mathematical application of Tsiolkovsky equation with engine Isp, propellant mass, dry mass for each burn.' },
      { code: 'S-EX.5', title: 'Spacecraft Mass Table', desc: 'Subsystem mass breakdown (structures, thermal, power, avionics, mining payload, propellant) with ≥20% margin.' },
      { code: 'S-EX.6', title: 'Power Subsystem', desc: 'Solar array sizing computed via inverse-square law at aphelion vs battery storage vs nuclear RTG/fission.' },
      { code: 'S-EX.7', title: 'Extraction Physics', desc: 'Anchoring in microgravity, optical mining sublimation vs mechanical cutting, daily yield (kg/day), dust handling.' },
      { code: 'S-EX.8', title: 'Delivered Unit Economics', desc: 'All-in cost per kilogram delivered to LEO/EML-1 vs predicted 2045 Earth launch price per kilogram.' },
      { code: 'S-EX.9', title: 'Staged Capitalization', desc: 'Tranche funding (Seed/A/B) tied to flight milestones: prospector flyby, rendezvous demo, extraction return.' },
      { code: 'S-EX.10', title: 'Outer Space Law & Risk', desc: 'Compliance with OST Articles II & VI, national space resource ownership laws (US 2015, India Space Policy 2023).' }
    ]
  },
  {
    id: 's-tropo',
    code: 'S-TR',
    layer: 'Troposphere (0–12 km)',
    title: 'Weather, by Appointment',
    log: 'Build a business that can change local weather for up to 72 hours, and prove it was you.',
    story: {
      bg: 'Almost all terrestrial weather takes place in the troposphere. Unpredictable hail flattens vineyards, winter radiation fog halts Delhi airport operations causing hundreds of crores in airline disruptions, and localized droughts starve hydroelectric dams. Cloud seeding utilizes silver iodide (AgI) or hygroscopic salts to nucleate ice crystals or coalesce droplets. However, trials often fail when atmospheric moisture is insufficient, and proving causal attribution is notoriously complex.',
      challenge: 'Design a scientifically grounded, commercially viable technology or service that can influence specific local weather conditions for a limited period of up to 72 hours.',
      hard: 'Natural weather systems process petawatts of energy. You cannot force weather; you can only trigger existing atmospheric instabilities. You must prove statistically that your intervention caused the rainfall or dispersed the fog, rather than natural atmospheric variability, and navigate interstate water theft accusations.'
    },
    numbers: [
      { val: '8–18 km', label: 'Troposphere ceiling height (poles to equator)' },
      { val: '72 hours', label: 'Maximum permitted duration of any weather modification event' },
      { val: '0 °C', label: 'Boundary between seedable supercooled fog and warm advection fog' },
      { val: '1976', label: 'UN ENMOD convention banning hostile environmental modification' },
      { val: '2017', label: 'SNOWIE field campaign proving radar-verified seeded snowfall' }
    ],
    curveball: 'It rained 15 millimetres after your seeding plane flew over. How do you prove in court or to your client that it wouldn\'t have rained anyway?',
    mustCover: [
      { code: 'S-TR.1', title: 'The Technology', desc: 'Nucleation agent (hygroscopic flares, liquid propane, ionized particles, acoustic cannons), delivery drone/aircraft, targeted area.' },
      { code: 'S-TR.2', title: 'Atmospheric Physics', desc: 'Cloud thermodynamics: convective available potential energy (CAPE), dewpoint depression, supercooled liquid water.' },
      { code: 'S-TR.3', title: 'Addressable Market', desc: 'Airport fog-dispersal contracts, agricultural hail-suppression cooperatives, municipal reservoir managers.' },
      { code: 'S-TR.4', title: 'Business Model', desc: 'Readiness retainer fee + success fee per operational clearance event; weather-indexed performance contracts.' },
      { code: 'S-TR.5', title: 'Environmental & Legal Risks', desc: 'Toxicity of seeding chemical agents, neighboring rainfall depletion (rain shadow accusations), DGCA flight clearance.' },
      { code: 'S-TR.6', title: 'Statistical Attribution', desc: 'Dual-polarization Doppler radar differential reflectivity (ZDR), randomized target/control crossover experimental design.' },
      { code: 'S-TR.7', title: 'Financial Modeling', desc: 'Aircraft/drone fleet CapEx, flare consumables OpEx, insurance premiums, per-operation cost, and 5-year EBITDA.' }
    ]
  },
  {
    id: 's-bonus',
    code: 'S-BX',
    layer: 'Open Track (optional)',
    title: 'The Big Idea',
    log: 'Every company starts with a question that begins "What if". Find one nobody is asking and make it pay.',
    story: {
      bg: 'Aerospace, quantum communications, advanced materials, and climate tech are riddled with hidden bottlenecks: single-source supply chain vulnerabilities, testing facilities that charge exorbitant fees, or raw telemetry data that sits unmined. Any domain is eligible—from orbital robotics to industrial biology.',
      challenge: 'Identify an overlooked high-impact technological or industrial bottleneck, engineer a commercial solution, and prove its financial viability. Submitted as an optional separate addendum (max 6 pages).',
      hard: '"Nobody has done this before" is often a red flag, not a badge of honor. You must demonstrate why incumbents failed, why the technological or market timing is right now, and prove defensibility against copycats.'
    },
    numbers: [
      { val: '6 pages', label: 'Maximum page limit for Senior open track addendum PDF' },
      { val: '1 client', label: 'Must name specific real-world corporate or institutional buyer' },
      { val: '3 years', label: 'Minimum duration of financial cash flow projection' }
    ],
    curveball: 'Why hasn\'t Boeing, ISRO, or a venture-backed startup in Silicon Valley already built this, and what stops them copying you the month you launch?',
    mustCover: [
      { code: 'S-BX.1', title: 'Market Opportunity', desc: 'The industrial or technological bottleneck, quantified commercial cost of status quo, evidence.' },
      { code: 'S-BX.2', title: 'The Innovation', desc: 'System architecture, proprietary intellectual property, TRL level, development pathway.' },
      { code: 'S-BX.3', title: 'Market Sizing', desc: 'TAM / SAM / SOM derived bottom-up with verified industry price points and sales cycle duration.' },
      { code: 'S-BX.4', title: 'Unit Economics & Cash', desc: 'Gross margin per unit, customer acquisition cost (CAC), lifetime value (LTV), 3-year cash flow forecast.' },
      { code: 'S-BX.5', title: 'Defensible Moat', desc: 'Patents, network effects, high switching costs, or proprietary datasets preventing fast-follower replication.' }
    ]
  }
];

const CHECKLIST_ITEMS = [
  { id: 'bpp1', label: 'Proposal PDF submitted with selectable text, numbered figures, and SI units.' },
  { id: 'bpp2', label: 'Page limits strictly respected, counting every page including cover, contents and references: Junior max 25 · Senior max 30.' },
  { id: 'bpp_vid', label: '5-minute pitch video uploaded.' },
  { id: 'bpp3', label: 'Cover page (0.1) complete with team details, division, prompt code, and advisor contact.' },
  { id: 'bpp4', label: 'Executive Summary (1.1) contains one-liner, customer persona, and break-even units.' },
  { id: 'bpp5', label: 'Physics & Environment Log (3.3) cites real atmospheric data with source citations.' },
  { id: 'bpp6', label: 'CapEx (4.1) and monthly OpEx (4.2) itemized with manufacturer price lists or salary references.' },
  { id: 'bpp8', label: 'Bottom-up market sizing (5.2) without generic top-down "1% of a huge market" assumptions.' },
  { id: 'bpp9', label: 'Risk Register (5.6) includes technical, regulatory, and financial risks with clear triggers.' },
  { id: 'bpp10', label: 'Assumption Ledger (6.1) lists every numerical assumption with confidence rating (L/M/H).' },
  { id: 'bpp11', label: 'All references formatted in APA 7th edition (6.2) and Tier 2 AI use disclosed (6.3).' },
  { id: 'bpp12', label: 'Originality & AI Declaration signed by all team members and countersigned by faculty advisor.' }
];

export default function BppPrompt() {
  const [activeSection, setActiveSection] = useState(() => resolveSection(window.location.hash));
  const [division, setDivision] = useState('senior');
  const [activeJuniorPrompt, setActiveJuniorPrompt] = useState(null);
  const [activeSeniorPrompt, setActiveSeniorPrompt] = useState(null);

  // Checklist state in localStorage (default empty)
  const [checklist, setChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem('c26-bpp-checklist');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Sync hash routing
  useEffect(() => {
    const handleHash = () => {
      setActiveSection(resolveSection(window.location.hash));
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleSectionChange = (secId) => {
    setActiveSection(secId);
    window.history.replaceState(null, '', `#${secId}`);
  };

  const toggleCheck = (id) => {
    setChecklist((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('c26-bpp-checklist', JSON.stringify(next));
      } catch (err) {
        console.warn('Storage failed', err);
      }
      return next;
    });
  };

  const currentPrompts = division === 'junior' ? JUNIOR_PROMPTS : SENIOR_PROMPTS;
  const currentPromptId = division === 'junior' ? activeJuniorPrompt : activeSeniorPrompt;
  const selectedPrompt = currentPromptId ? currentPrompts.find((p) => p.id === currentPromptId) : null;

  return (
    <div className="space-y-8 pb-16">
      {/* Top Breadcrumb & Status */}
      <div className="border-b-2 border-bone/30 pb-3 flex flex-wrap justify-between items-center gap-3 font-mono text-xs text-bone-dim">
        <div className="flex items-center gap-2 flex-wrap">
          <Link to="/" className="text-bone-dim hover:text-crimson">CELESTECON 2026</Link>
          <span>/</span>
          <Link to="/comps" className="text-bone-dim hover:text-crimson">COMPETITIONS</Link>
          <span>/</span>
          <Link to="/prompts" className="text-bone-dim hover:text-crimson">PROMPTS</Link>
          <span>/</span>
          <span className="text-crimson font-bold uppercase">EVENT 04 · BUSINESS POWER PITCH</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-amber-400 font-bold uppercase tracking-widest text-[11px] px-2 py-0.5 border border-amber-400/40 bg-amber-400/10">
            Submissions Closed
          </span>
        </div>
      </div>

      {/* Main Hero Header */}
      <div className="border-2 border-bone bg-ink p-6 sm:p-8 relative">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 relative z-10">
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold px-2 py-0.5 bg-crimson text-bone-hi">
                EVENT 04 · BPP
              </span>
              <span className="font-mono text-xs uppercase px-2 py-0.5 border border-bone/40 text-bone-dim">
                Aerospace Venture &amp; Pitch
              </span>
              <span className="font-mono text-xs uppercase px-2 py-0.5 border border-bone/40 text-bone-dim">
                Junior (Grades 6–8) · Senior (Grades 9–12)
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl text-bone uppercase tracking-wide leading-none">
              Business Power Pitch <span className="text-crimson">2026</span>
            </h1>

            <p className="font-label text-sm sm:text-base text-bone-dim leading-relaxed max-w-2xl">
              An inter-school competition that brings together aspiring innovators and entrepreneurs from across the country to develop solutions with real-world impact. Design a commercially viable aerospace product or service across atmospheric layers, supported by technical feasibility, financial planning, and a go-to-market strategy.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => handleSectionChange('prompts')}
                className="px-5 py-2.5 bg-crimson text-bone-hi font-label font-bold text-xs uppercase tracking-widest border border-crimson cursor-pointer"
              >
                Explore Prompts →
              </button>
              <button
                onClick={() => handleSectionChange('guide')}
                className="px-5 py-2.5 bg-ink-2 text-bone font-label font-bold text-xs uppercase tracking-widest border border-bone/40 cursor-pointer"
              >
                Proposal Guide
              </button>
              <button
                onClick={() => handleSectionChange('checklist')}
                className="px-5 py-2.5 bg-ink-2 text-bone font-label font-bold text-xs uppercase tracking-widest border border-bone/40 cursor-pointer"
              >
                Checklist
              </button>
            </div>
          </div>

          {/* Aside Telemetry Box */}
          <div className="w-full lg:w-80 bg-ink-2 p-5 border-2 border-bone/60 space-y-4 shrink-0">
            <div className="flex justify-between items-center text-xs font-mono border-b border-bone/20 pb-2">
              <span className="text-bone-dim uppercase">Proposal Window</span>
              <span className="font-bold text-amber-400 uppercase">
                Submissions Closed
              </span>
            </div>

            <div className="p-3 bg-ink border border-bone/20 space-y-1 font-mono text-xs">
              <span className="text-bone-dim uppercase text-[10px] block">Round 1 Status</span>
              <strong className="text-amber-400 text-sm block">Submissions Closed</strong>
              <span className="text-bone-dim text-[11px] block">Round 1 proposal submission window has concluded</span>
            </div>

            <div className="space-y-1.5 font-mono text-[11px] text-bone-dim pt-2 border-t border-bone/20">
              <div className="flex justify-between">
                <span>Eligibility:</span>
                <strong className="text-bone">Jr (6–8) · Sr (9–12)</strong>
              </div>
              <div className="flex justify-between">
                <span>Team Size:</span>
                <strong className="text-bone">3 Members</strong>
              </div>
              <div className="flex justify-between">
                <span>Deliverable:</span>
                <strong className="text-bone">Proposal PDF + 5-min video (pitch deck optional)</strong>
              </div>
              <div className="flex justify-between">
                <span>Round 2 Finale:</span>
                <strong className="text-crimson font-bold">24 Oct · On Campus</strong>
              </div>
            </div>

            <Link
              to="/results?event=04"
              className="w-full py-2.5 bg-crimson text-bone-hi border border-crimson hover:bg-ink hover:text-crimson font-mono text-xs uppercase tracking-widest text-center font-bold block transition-colors shadow-md"
            >
              View Round 1 Results ★
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="border-2 border-bone/60 bg-ink-2 p-1.5 flex flex-wrap gap-1.5 font-mono text-xs uppercase tracking-wider">
        {[
          { id: 'brief', label: '1 Event Brief' },
          { id: 'prompts', label: '2 Prompts' },
          { id: 'guide', label: '3 Proposal Guide' },
          { id: 'checklist', label: '4 Checklist' },
          { id: 'rules', label: '5 Rules' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleSectionChange(tab.id)}
            className={`flex-1 sm:flex-initial px-4 py-2 font-bold cursor-pointer text-center ${
              activeSection === tab.id
                ? 'bg-crimson text-bone-hi'
                : 'text-bone-dim hover:text-bone hover:bg-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ======================================================== */}
      {/* SECTION 1: EVENT BRIEF */}
      {/* ======================================================== */}
      {activeSection === 'brief' && (
        <div className="space-y-8">
          <div className="border-2 border-bone/40 bg-ink p-6 sm:p-8 space-y-8">
            {/* Header */}
            <div className="border-b border-bone/20 pb-4">
              <span className="font-mono text-xs text-crimson font-bold uppercase tracking-widest">
                Section 1 · Event Brief
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-bone uppercase tracking-wider mt-1">
                Where Innovation Meets Market Viability &amp; Real-World Impact
              </h2>
            </div>

            {/* Master Brief Narrative */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-bone-dim leading-relaxed">
              <div className="space-y-4">
                <p className="text-bone font-medium text-base leading-relaxed">
                  Business Power Pitch, a flagship sub-event of CelesteCon’26, is an inter-school competition that brings together aspiring innovators and entrepreneurs from across the country. The event provides a dynamic platform for students to combine creativity, technical knowledge, and entrepreneurial thinking to develop solutions with real-world impact.
                </p>
                <p>
                  Participants will be given thought-provoking prompts that require them to design a product or service and support it with a detailed proposal covering technical feasibility, financial planning, and a go-to-market strategy. Teams will brainstorm, ideate, and develop their proposals for submission in Round 1.
                </p>
              </div>
              <div className="space-y-4">
                <p>
                  After careful evaluation by the judges, shortlisted teams will move on to Round 2, where they will present their solutions before a panel, followed by a Q&amp;A session that will test their clarity, confidence, and ability to defend their ideas.
                </p>
                <p>
                  The event encourages participants to think beyond conventional boundaries, blending imagination with practicality, while focusing on innovation, sustainability, and market viability. Business Power Pitch is the perfect stage for students to showcase their entrepreneurial spirit, analytical ability, and leadership skills.
                </p>
              </div>
            </div>

            {/* Key Dates Block */}
            <div className="border border-bone/20 bg-ink-2 p-5 space-y-3 font-mono text-xs">
              <span className="text-amber-400 font-bold uppercase block">// Key Dates</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-ink border border-bone/20">
                  <span className="text-bone-dim block text-[10px]">13 Oct</span>
                  <strong className="text-bone block mt-0.5">Round 1 Opens</strong>
                </div>
                <div className="p-3 bg-crimson/10 border border-crimson">
                  <span className="text-crimson block text-[10px]">19 Oct, 01:00 PM IST</span>
                  <strong className="text-bone block mt-0.5">Round 1 Submission Deadline</strong>
                </div>
                <div className="p-3 bg-ink border border-bone/20">
                  <span className="text-bone-dim block text-[10px]">20 Oct</span>
                  <strong className="text-bone block mt-0.5">Shortlist Announced</strong>
                </div>
                <div className="p-3 bg-ink border border-bone/20">
                  <span className="text-bone-dim block text-[10px]">24 Oct</span>
                  <strong className="text-bone block mt-0.5">Finale at DPS R.K. Puram (Report 07:45–08:45 AM)</strong>
                </div>
              </div>
            </div>

            {/* Division Submission Standards Banner */}
            <div className="border-2 border-crimson/80 bg-crimson/10 p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-crimson/30 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-crimson text-bone-hi font-mono text-xs font-bold uppercase tracking-widest">
                    OFFICIAL SUBMISSION LIMITS
                  </span>
                  <span className="font-mono text-xs text-bone-dim uppercase">Round 1 Written Proposal PDF</span>
                </div>
                <span className="font-mono text-xs text-amber-400 font-bold uppercase">
                  Deadline: 19 Oct, 01:00 PM IST
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
                {/* Junior Card */}
                <div className="border border-bone/30 bg-ink p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs uppercase text-bone-dim font-bold">Junior Division (Grades 6–8)</span>
                    <span className="px-2 py-0.5 bg-bone text-ink text-xs font-bold">JR CATEGORY</span>
                  </div>
                  <div className="font-display text-2xl text-bone uppercase">
                    Juniors: <span className="text-crimson">25 Pages</span> Limit
                  </div>
                  <p className="font-sans text-xs text-bone-dim leading-relaxed">
                    Strict maximum limit of <strong>25 pages</strong>, counting every page including cover, contents, references, AI disclosure and declaration.
                  </p>
                </div>

                {/* Senior Card */}
                <div className="border border-bone/30 bg-ink p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs uppercase text-bone-dim font-bold">Senior Division (Grades 9–12)</span>
                    <span className="px-2 py-0.5 bg-crimson text-bone-hi text-xs font-bold">SR CATEGORY</span>
                  </div>
                  <div className="font-display text-2xl text-bone uppercase">
                    Seniors: <span className="text-crimson">30 Pages</span> Limit
                  </div>
                  <p className="font-sans text-xs text-bone-dim leading-relaxed">
                    Strict maximum limit of <strong>30 pages</strong>, counting every page including cover, contents, references, AI disclosure and declaration.
                  </p>
                </div>
              </div>

              <div className="pt-1 font-mono text-xs text-bone-dim space-y-1">
                <div><strong className="text-bone">Deliverables:</strong> Proposal PDF (required) and a 5-minute pitch video (required). Pitch deck is optional: a separate 16:9 PDF, recommended 12 slides, max 15.</div>
                <div><strong className="text-bone">Team Size:</strong> Exactly 3 members. One team per school per category.</div>
              </div>
            </div>

            {/* Round 2 Presentation Details */}
            <div className="border border-bone/20 bg-ink-2 p-5 space-y-3 font-mono text-xs">
              <span className="text-crimson font-bold uppercase block">// Round 2 Finale Protocol</span>
              <p className="text-bone-dim font-sans text-xs leading-relaxed">
                Shortlisted teams present on 24 Oct at DPS R.K. Puram. Each team receives 7 minutes to present (both Junior and Senior), followed by cross-questioning by the panel. Competing teams in the audience may ask challenger questions for bonus points. Props, a small prototype or creative presentation methods are welcome.
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex flex-wrap justify-between items-center gap-4 font-mono text-xs">
              <div className="text-bone-dim">
                Point of Contact: <strong className="text-bone">Ryaan Namit Jain</strong> (<a href="mailto:r23542ryaan@dpsrkp.net" className="text-crimson hover:underline">r23542ryaan@dpsrkp.net</a>) · <a href="mailto:aeross@dpsrkp.net" className="text-bone hover:underline">aeross@dpsrkp.net</a>
              </div>
              <div className="flex gap-3">
                <Link to="/comps" className="px-4 py-2 border border-bone/40 text-bone uppercase">
                  ← Back to Comps
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 2: PROMPTS */}
      {/* ======================================================== */}
      {activeSection === 'prompts' && (
        <div className="space-y-6">
          {/* Atmospheric Layers Figure */}
          <div className="border-2 border-bone/40 bg-ink p-5 space-y-3">
            <div className="border-b border-bone/20 pb-2">
              <span className="font-mono text-xs text-crimson font-bold uppercase tracking-widest block">
                Atmospheric Territory Overview
              </span>
              <h3 className="font-display text-xl text-bone uppercase tracking-wider mt-0.5">
                The Atmospheric Market Layers
              </h3>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {[
                { name: 'Exosphere & Deep Space', alt: '600+ km', tech: 'Asteroid prospecting, propellant depots, interplanetary logistics', jr: '—', sr: 'S-EX' },
                { name: 'Thermosphere', alt: '85–600 km', tech: 'LEO constellations, solar storm drag mitigation, active radiation shielding', jr: 'J-TH', sr: 'S-TH' },
                { name: 'Mesosphere', alt: '50–85 km', tech: 'Meteor intelligence, infrasound sensing, thin-air biomimetic aerodynamics', jr: 'J-ME', sr: 'S-ME' },
                { name: 'Stratosphere', alt: '12–50 km', tech: 'Ozone monitoring, HAPS gliders, stratospheric aerosol tracking', jr: 'J-ST', sr: '—' },
                { name: 'Troposphere & Tropopause', alt: '0–12 km', tech: 'Airliner sensor networks, local weather modification, cloud nucleation', jr: 'J-OZ', sr: 'S-TR' },
                { name: 'Open Track (Optional Addendum)', alt: 'Any Altitude', tech: 'Unconstrained real-world industrial or commercial innovation', jr: 'J-BX', sr: 'S-BX' }
              ].map((l, i) => (
                <div key={i} className="p-3 bg-ink-2 border border-bone/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-crimson font-bold w-6">{i === 5 ? '★' : 5 - i}</span>
                    <strong className="text-bone uppercase text-sm">{l.name}</strong>
                    <span className="text-bone-dim text-[11px]">({l.alt})</span>
                  </div>
                  <div className="text-bone-dim text-[11px] font-sans flex-1 md:px-4">{l.tech}</div>
                  <div className="flex gap-2">
                    {l.jr !== '—' && <span className="px-2 py-0.5 bg-ink border border-bone/40 text-bone text-[10px] font-bold">JR: {l.jr}</span>}
                    {l.sr !== '—' && <span className="px-2 py-0.5 bg-crimson/20 border border-crimson text-crimson text-[10px] font-bold">SR: {l.sr}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Division Selector */}
          <div className="border-2 border-bone/40 bg-ink p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="font-mono text-xs text-crimson font-bold uppercase tracking-wider block">Division Selection</span>
              <span className="font-label text-sm text-bone-dim">Choose your category to inspect the prompts.</span>
            </div>
            <div className="flex gap-2 w-full sm:w-auto font-mono text-xs font-bold uppercase">
              <button
                onClick={() => {
                  setDivision('junior');
                  setActiveJuniorPrompt(null);
                }}
                className={`flex-1 sm:flex-initial px-5 py-2.5 border cursor-pointer transition-colors ${
                  division === 'junior'
                    ? 'bg-bone text-ink border-bone'
                    : 'bg-ink-2 text-bone-dim border-bone/40 hover:text-bone'
                }`}
              >
                Junior (Grades 6–8)
              </button>
              <button
                onClick={() => {
                  setDivision('senior');
                  setActiveSeniorPrompt(null);
                }}
                className={`flex-1 sm:flex-initial px-5 py-2.5 border cursor-pointer transition-colors ${
                  division === 'senior'
                    ? 'bg-crimson text-bone-hi border-crimson'
                    : 'bg-ink-2 text-bone-dim border-bone/40 hover:text-bone'
                }`}
              >
                Senior (Grades 9–12)
              </button>
            </div>
          </div>

          {/* Section Subhead & Prompt Selector Tabs */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-mono text-xs border-b border-bone/20 pb-2">
              <span className="text-crimson font-bold uppercase tracking-wider">
                // {division === 'junior' ? 'Junior' : 'Senior'} Venture Prompts ({currentPrompts.length} Available · Choose One)
              </span>
              <span className="text-bone-dim text-[11px]">
                {currentPromptId ? 'Click another prompt to switch view' : 'Choose a prompt below to see details'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono text-xs">
              {currentPrompts.map((p) => {
                const isSelected = p.id === currentPromptId;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      if (division === 'junior') setActiveJuniorPrompt(p.id);
                      else setActiveSeniorPrompt(p.id);
                    }}
                    className={`p-3.5 border text-left cursor-pointer transition-all relative ${
                      isSelected
                        ? 'bg-crimson/10 border-2 border-crimson shadow-lg ring-1 ring-crimson/40'
                        : 'bg-ink-2/80 border-bone/30 text-bone-dim hover:text-bone hover:border-bone/70 hover:bg-ink-2'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <span className={`font-bold ${isSelected ? 'text-crimson text-sm' : 'text-crimson'}`}>
                        {p.code}
                      </span>
                      {isSelected ? (
                        <span className="px-1.5 py-0.5 bg-crimson text-bone-hi text-[9px] font-bold uppercase tracking-wider">
                          Viewing
                        </span>
                      ) : (
                        <span className="text-[10px] text-bone-dim truncate max-w-[80px]">{p.layer}</span>
                      )}
                    </div>
                    <div className="font-display text-sm text-bone uppercase leading-tight mb-1">
                      {p.title}
                    </div>
                    <div className="mt-2 pt-2 border-t border-bone/10 text-[10px]">
                      <span className={isSelected ? 'text-crimson font-bold' : 'text-bone-dim'}>
                        {isSelected ? '● Active Selection' : 'Click to inspect →'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Prompt Dossier or Placeholder */}
          {!selectedPrompt ? (
            <div className="border-2 border-dashed border-bone/30 bg-ink-2/40 p-8 sm:p-14 text-center space-y-4 font-mono">
              <div className="w-12 h-12 mx-auto border-2 border-crimson rounded-full flex items-center justify-center text-crimson text-xl font-bold bg-crimson/10 animate-pulse">
                ↑
              </div>
              <div className="space-y-1">
                <span className="text-crimson uppercase text-xs font-bold tracking-widest block">
                  Prompt Selection Required
                </span>
                <h3 className="font-display text-2xl sm:text-3xl text-bone uppercase tracking-wider">
                  Choose a prompt to see details
                </h3>
              </div>
              <p className="font-sans text-xs sm:text-sm text-bone-dim max-w-lg mx-auto leading-relaxed">
                Click any of the {currentPrompts.length} {division === 'junior' ? 'Junior' : 'Senior'} atmospheric venture prompts above to inspect the market thesis, physics boundaries, mandatory deliverables, and question to prepare for.
              </p>
            </div>
          ) : (
            <div className="border-2 border-bone bg-ink p-6 sm:p-8 space-y-6">
              <div className="border-b border-bone/20 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-crimson text-bone-hi">{selectedPrompt.code}</span>
                  <span className="font-mono text-xs uppercase px-2 py-0.5 border border-bone/40 text-bone-dim">
                    {selectedPrompt.layer}
                  </span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl text-bone uppercase tracking-wider">
                  {selectedPrompt.title}
                </h2>
                <p className="font-serif italic text-base sm:text-lg text-amber-300/90 mt-2">
                  &ldquo;{selectedPrompt.log}&rdquo;
                </p>
              </div>

              {/* Story Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 bg-ink-2 border border-bone/20 space-y-2">
                  <span className="text-crimson font-bold uppercase block">// The Physical Context</span>
                  <p className="font-sans text-xs text-bone-dim leading-relaxed">{selectedPrompt.story.bg}</p>
                </div>

                <div className="p-4 bg-ink-2 border border-bone/20 space-y-2">
                  <span className="text-amber-400 font-bold uppercase block">// The Venture Mandate</span>
                  <p className="font-sans text-xs text-bone-dim leading-relaxed">{selectedPrompt.story.challenge}</p>
                </div>

                <div className="p-4 bg-ink-2 border border-bone/20 space-y-2">
                  <span className="text-green-400 font-bold uppercase block">// The Hard Truth</span>
                  <p className="font-sans text-xs text-bone-dim leading-relaxed">{selectedPrompt.story.hard}</p>
                </div>
              </div>

              {/* Numbers that Matter */}
              <div className="space-y-3 pt-2">
                <h3 className="font-mono text-xs uppercase tracking-widest text-bone font-bold">
                  // Critical Physics &amp; Industry Benchmarks
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 font-mono text-xs">
                  {selectedPrompt.numbers.map((n, i) => (
                    <div key={i} className="bg-ink-2 p-3 border border-bone/20">
                      <span className="text-base sm:text-lg font-bold text-bone block leading-tight">{n.val}</span>
                      <span className="text-[10px] text-bone-dim block mt-1 leading-tight">{n.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* A Question to Prepare For */}
              {selectedPrompt.curveball && (
                <div className="border border-amber-500/40 bg-amber-500/5 p-4 space-y-1 font-mono text-xs">
                  <span className="text-amber-400 font-bold uppercase tracking-wider block">
                    A question to prepare for
                  </span>
                  <p className="text-bone font-sans text-xs sm:text-sm leading-relaxed italic">
                    &ldquo;{selectedPrompt.curveball}&rdquo;
                  </p>
                </div>
              )}

              {/* Required Proposal Coverage */}
              <div className="space-y-3 pt-2">
                <h3 className="font-mono text-xs uppercase tracking-widest text-crimson font-bold">
                  // Mandatory Technical &amp; Financial Coverage
                </h3>
                <div className="space-y-2 font-mono text-xs">
                  {selectedPrompt.mustCover.map((req, i) => (
                    <div key={i} className="p-3 bg-ink-2 border border-bone/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-crimson font-bold">{req.code}</span>
                          <strong className="text-bone uppercase">{req.title}</strong>
                        </div>
                        <p className="text-[11px] text-bone-dim font-sans">{req.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 3: PROPOSAL GUIDE */}
      {/* ======================================================== */}
      {activeSection === 'guide' && (
        <div className="space-y-8">
          <div className="border-2 border-bone/40 bg-ink p-6 sm:p-8 space-y-6">
            <div className="border-b border-bone/20 pb-4">
              <span className="font-mono text-xs text-crimson font-bold uppercase tracking-widest">
                Section 3 · Proposal Guide
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-bone uppercase tracking-wider mt-1">
                Required Proposal Architecture
              </h2>
            </div>

            {/* Four Commercial Investment Tests */}
            <div className="border border-bone/30 bg-ink-2 p-5 space-y-3 font-mono text-xs">
              <span className="text-amber-400 uppercase font-bold tracking-widest block">
                Foundational Commercial Principles
              </span>
              <ul className="space-y-2 text-bone-dim text-xs leading-relaxed list-disc pl-4 font-sans">
                <li><strong className="text-bone font-mono">Name who pays:</strong> "Governments" or "everyone" is not a customer. Name specific enterprises, procurement officers, or fleet managers with real operational budgets.</li>
                <li><strong className="text-bone font-mono">Price one unit:</strong> Cost and price one alert feed, one monthly ozonesonde launch, or one kg delivered to orbit. If you cannot cost a single unit, you cannot model a thousand.</li>
                <li><strong className="text-bone font-mono">Physics must hold:</strong> Air density, aerodynamic drag, power density, and orbital decay set your technological boundaries. Commercial ventures that violate physics fail.</li>
                <li><strong className="text-bone font-mono">Defend every number:</strong> Ground every metric in verified citations. Defend unit margins, customer acquisition costs, and break-even sales volume during jury defense.</li>
              </ul>
            </div>

            {/* Document Sequence & Currency Rule */}
            <div className="border border-bone/30 bg-ink-2 p-5 space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-widest text-amber-400 border-b border-bone/20 pb-2">
                Document Sequence &amp; Page Limits
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 bg-ink border border-bone/20">
                  <span className="text-bone-dim block text-[10px]">Page 1</span>
                  <strong className="text-bone block mt-1">0.1 Cover Page</strong>
                </div>
                <div className="p-3 bg-ink border border-bone/20">
                  <span className="text-bone-dim block text-[10px]">Page 2</span>
                  <strong className="text-bone block mt-1">0.2 Contents</strong>
                </div>
                <div className="p-3 bg-crimson/10 border border-crimson">
                  <span className="text-crimson block text-[10px]">Main Sections</span>
                  <strong className="text-bone block mt-1">1.0 &rarr; 6.1</strong>
                  <span className="text-crimson text-[10px]">Jr ≤25pp · Sr ≤30pp</span>
                </div>
                <div className="p-3 bg-ink border border-bone/20">
                  <span className="text-bone-dim block text-[10px]">End Matter</span>
                  <strong className="text-bone block mt-1">6.2, 6.3 &amp; Declaration</strong>
                </div>
              </div>
              <p className="font-mono text-xs text-bone-dim pt-2">
                * Page limits count every page, including cover, contents, references, AI disclosure and declaration: Junior max 25 pages, Senior max 30 pages. Currency: Indian Rupees (INR) or US Dollars (USD) with declared exchange rate and date in Section 6.1.
              </p>
            </div>

            {/* Template Sections */}
            <div className="space-y-4">
              {[
                {
                  no: '1.0',
                  title: 'Introduction & Problem Statement',
                  fields: [
                    { id: '1.1', name: 'Executive Summary', note: 'Problem, solution, target customer, price, and break-even units.' },
                    { id: '1.2', name: 'Company One-Liner', note: 'Single sentence under 30 words summarizing what you sell and to whom.' },
                    { id: '1.3', name: 'Problem Statement', note: 'Concrete problem with cited data proving financial or operational damage.' },
                    { id: '1.4', name: 'Problem-Solution Matrix', note: 'Table mapping pain points to technical solutions and success metrics.' }
                  ]
                },
                {
                  no: '2.0',
                  title: 'Company Description & Team Organization',
                  fields: [
                    { id: '2.1', name: 'Company Structure & Jurisdiction', note: 'Corporate legal framework, IN-SPACe / DGCA licensing, and international treaty compliance.' },
                    { id: '2.2', name: 'Mission & 3-Year Objectives', note: 'Mission in ≤25 words + 3 measurable milestones with dates and metrics.' },
                    { id: '2.3', name: 'Team Hierarchy & Roles', note: 'Member company roles (CEO, CTO, CFO) and respective proposal sections led.' },
                    { id: '2.4', name: '3-Year Staffing Ramp', note: 'Operational hiring schedule: in-house engineers vs outsourced contractors.' }
                  ]
                },
                {
                  no: '3.0',
                  title: 'Product & Service Architecture',
                  fields: [
                    { id: '3.1', name: 'System Architecture & BOM', note: 'Complete component table with supplier sources, current TRL levels, and costs.' },
                    { id: '3.2', name: 'Features & Customer Journey', note: 'Customer onboarding from initial trial through renewal and support.' },
                    { id: '3.3', name: 'Atmospheric Physics Log', note: 'Table of physical layer conditions with cited numbers and design responses.' },
                    { id: '3.4', name: 'Operations Workflow', note: 'Full operational cycle: launch, flight, telemetry data capture, and post-flight processing.' },
                    { id: '3.5', name: 'Product Roadmap', note: 'Planned evolution over 3 years (Junior) or 5 years (Senior).' }
                  ]
                },
                {
                  no: '4.0',
                  title: 'Financial Plan & Unit Economics',
                  fields: [
                    { id: '4.1', name: 'Start-Up CapEx', note: 'One-off capital expenditures (R&D, tooling, certification, testing rigs) with source quotes.' },
                    { id: '4.2', name: 'Monthly OpEx', note: 'Monthly operating expenses (salaries, cloud computing, hangar fees, insurance) with estimation bases.' },
                    { id: '4.3', name: 'Unit Economics & Margins', note: 'Price per unit, variable cost, contribution margin %, and break-even unit calculation.' },
                    { id: '4.4', name: 'Pricing & Competitive Justification', note: 'Pricing model rationale compared against free public data and alternative options.' },
                    { id: '4.5', name: 'Revenue Forecast', note: 'Jr 3-year forecast · Sr 5-year forecast with quarterly granularity and sensitivity testing.' },
                    { id: '4.6', name: 'Capitalization & Tranches', note: 'Seed funding requirements and milestone triggers unlocking subsequent capital rounds.' }
                  ]
                },
                {
                  no: '5.0',
                  title: 'Marketing, Defensibility & Risk',
                  fields: [
                    { id: '5.1', name: 'Customer Personas', note: 'Detailed buyer profiles: economic decision-maker vs daily technical operator.' },
                    { id: '5.2', name: 'Bottom-Up Market Sizing', note: 'TAM / SAM / SOM calculated from realistic addressable buyer counts.' },
                    { id: '5.3', name: 'Go-To-Market & Acquisition', note: 'Customer acquisition cost (CAC), sales cycle duration, and marketing budget.' },
                    { id: '5.4', name: 'Defensible SWOT Matrix', note: 'Factual strengths, weaknesses, opportunities, and threats defended with data.' },
                    { id: '5.5', name: 'Moat & IP Protection', note: 'Proprietary technology, network effects, switching costs, and patent strategy.' },
                    { id: '5.6', name: 'Comprehensive Risk Register', note: 'Technical, regulatory, and financial risks with likelihood, impact, triggers, and mitigation.' }
                  ]
                },
                {
                  no: '6.0',
                  title: 'References, Assumptions & Disclosures',
                  fields: [
                    { id: '6.1', name: 'Assumption Ledger', note: 'Every uncalculated numerical figure with source, reasoning, and confidence (L/M/H).' },
                    { id: '6.2', name: 'APA 7th Edition Bibliography', note: 'Alphabetical references formatted strictly in APA 7th style.' },
                    { id: '6.3', name: 'AI & External Help Disclosure', note: 'Full log of Tier 2 AI inquiries (tool, prompt, date) or statement of non-use.' }
                  ]
                }
              ].map((sec) => (
                <div key={sec.no} className="border border-bone/30 bg-ink-2">
                  <div className="p-3.5 bg-ink border-b border-bone/20 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-crimson font-mono font-bold">{sec.no}</span>
                      <h4 className="text-sm font-bold uppercase text-bone">{sec.title}</h4>
                    </div>
                  </div>
                  <div className="p-3.5 divide-y divide-bone/10">
                    {sec.fields.map((f) => (
                      <div key={f.id} className="py-2 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 text-xs font-mono">
                        <span className="text-amber-400 font-bold w-12 shrink-0">{f.id}</span>
                        <strong className="text-bone w-64 shrink-0 font-sans">{f.name}</strong>
                        <span className="text-bone-dim">{f.note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Signed Declaration Block */}
            <div className="p-5 bg-ink border-2 border-bone space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center text-crimson border-b border-bone/20 pb-2 uppercase tracking-wider">
                <span>Required · Standalone Page</span>
                <span>Originality &amp; Academic Integrity Declaration</span>
              </div>
              <p className="text-bone-dim">
                Every submission must include the following text verbatim on its own page immediately following Section 6.3. All team members must sign, and the faculty advisor must countersign.
              </p>
              <div className="p-4 bg-ink-2 border-l-4 border-crimson text-bone space-y-2 text-[11px] leading-relaxed">
                <p className="font-bold uppercase text-amber-400">Business Power Pitch 2026 · Originality &amp; AI Declaration</p>
                <p>We, the undersigned members of team [team name] from [school name], declare that:</p>
                <ol className="list-decimal pl-4 space-y-1 text-bone-dim">
                  <li>This proposal and pitch materials are our team&apos;s original work. The analysis, writing, and calculations were produced by our team members.</li>
                  <li>Every source of data, image, or fact is cited in text and listed in references.</li>
                  <li>We have read the AI Use Policy in full. No prohibited AI tools were utilized, and all permitted Tier 2 queries are logged in Section 6.3.</li>
                  <li>No external person wrote, edited, calculated, or designed any part of our submission.</li>
                  <li>We will preserve our research drafts and commit to oral defense of our arithmetic upon request.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 4: CHECKLIST */}
      {/* ======================================================== */}
      {activeSection === 'checklist' && (
        <div className="space-y-8">
          <div className="border-2 border-bone/40 bg-ink p-6 sm:p-8 space-y-6">
            <div className="border-b border-bone/20 pb-4">
              <span className="font-mono text-xs text-crimson font-bold uppercase tracking-widest">
                Section 4 · Checklist
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-bone uppercase tracking-wider mt-1">
                Preflight Deliverables Checklist
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-3 pt-2">
              {CHECKLIST_ITEMS.map((item) => (
                <label
                  key={item.id}
                  className={`p-3 border cursor-pointer flex items-start gap-3 select-none text-xs font-mono ${
                    checklist[item.id]
                      ? 'border-bone/20 bg-ink/40 text-bone-dim'
                      : 'border-bone bg-ink text-bone'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!checklist[item.id]}
                    onChange={() => toggleCheck(item.id)}
                    className="mt-0.5 accent-crimson cursor-pointer"
                  />
                  <span className={`leading-relaxed ${checklist[item.id] ? 'line-through text-bone-dim/60' : ''}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>

            <div className="pt-4 border-t border-bone/20 flex flex-wrap justify-between items-center gap-4">
              <span className="font-mono text-xs text-amber-400">
                Round 1 proposals are now closed and currently under review for Round 2 defense qualification.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 5: RULES */}
      {/* ======================================================== */}
      {activeSection === 'rules' && (
        <div className="space-y-8">
          <div className="border-2 border-bone/40 bg-ink p-6 sm:p-8 space-y-8">
            <div className="border-b border-bone/20 pb-4">
              <span className="font-mono text-xs text-crimson font-bold uppercase tracking-widest">
                Section 5 · Rules
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-bone uppercase tracking-wider mt-1">
                Competition Rules &amp; Evaluation Criteria
              </h2>
            </div>

            {/* General Competition Rules */}
            <div className="border border-bone/20 bg-ink-2 p-5 space-y-3 font-mono text-xs">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 border-b border-bone/20 pb-2">
                General Competition Rules
              </h3>
              <ul className="space-y-2 text-bone-dim text-xs leading-relaxed list-disc pl-4 font-sans">
                <li>Teams register through their school's delegation. Registration closed on 12 Oct; no additions after that.</li>
                <li>Late submissions are not accepted.</li>
                <li>Shortlisted teams report to the Welcome Foyer at DPS R.K. Puram between 07:45 and 08:45 AM on 24 Oct. Late arrivals may lose their slot.</li>
                <li>Bring your own laptop, charger and adapters, fully charged. Power outlets are provided. The host school is not liable for personal hardware. Bring your own internet connection.</li>
                <li>Judges' decisions are final. Disrespect towards judges or marshals leads to disqualification.</li>
                <li>DPS R.K. Puram teams take part for benchmarking only and are not eligible for rankings or trophies.</li>
              </ul>
            </div>

            {/* R-06 AI Tier Directive */}
            <div className="border-2 border-crimson bg-ink-2 p-6 space-y-4">
              <div className="flex flex-wrap justify-between items-center border-b border-crimson/40 pb-3 gap-2">
                <div>
                  <span className="text-xs font-mono text-crimson uppercase tracking-widest font-bold">Rule R-06 Directive</span>
                  <h3 className="text-xl font-bold uppercase text-bone">Artificial Intelligence Policy</h3>
                </div>
                <span className="px-3 py-1 bg-crimson text-bone-hi font-mono text-xs uppercase tracking-wider font-bold">
                  Mandatory For All Rounds
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-4 bg-ink border border-green-500/40 space-y-2">
                  <span className="text-green-400 font-bold block uppercase">Tier 1 · Permitted Free Use</span>
                  <strong className="text-bone text-sm block">Standard Software</strong>
                  <p className="text-bone-dim text-[11px] leading-relaxed">
                    Word processors with AI features disabled, spreadsheets using formulas written by the team, basic spell-check, web search engines, and manual CAD modeling.
                  </p>
                </div>

                <div className="p-4 bg-ink border border-amber-500/40 space-y-2">
                  <span className="text-amber-400 font-bold block uppercase">Tier 2 · Permitted If Disclosed</span>
                  <strong className="text-bone text-sm block">Conceptual Research</strong>
                  <p className="text-bone-dim text-[11px] leading-relaxed">
                    Querying chatbots for conceptual explanations, provided the primary scientific source is verified and cited in Section 6.3.
                  </p>
                </div>

                <div className="p-4 bg-ink border border-crimson space-y-2">
                  <span className="text-crimson font-bold block uppercase">Tier 3 · Strictly Prohibited</span>
                  <strong className="text-bone text-sm block">Auto-Generation</strong>
                  <p className="text-bone-dim text-[11px] leading-relaxed">
                    AI writing or rewriting proposal text, auto-generating slide decks, fabricating financial spreadsheets, or AI use during Round 2.
                  </p>
                </div>
              </div>
            </div>

            {/* Judging Criteria */}
            <div className="space-y-3 font-mono text-xs">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 border-b border-bone/20 pb-2">
                How you're judged
              </h3>
              <div className="space-y-3">
                <div className="p-3.5 bg-ink-2 border border-bone/20 space-y-1">
                  <strong className="text-bone text-sm block">Originality and creativity of the idea</strong>
                  <p className="text-bone-dim font-sans leading-relaxed">
                    Novel venture thesis rooted in atmospheric dynamics, offering a creative and non-obvious solution to a real operational pain point.
                  </p>
                </div>
                <div className="p-3.5 bg-ink-2 border border-bone/20 space-y-1">
                  <strong className="text-bone text-sm block">Technical soundness and feasibility</strong>
                  <p className="text-bone-dim font-sans leading-relaxed">
                    Compliance with physical atmospheric constraints, correct formulas, realistic hardware bill of materials, and operational cycle clarity.
                  </p>
                </div>
                <div className="p-3.5 bg-ink-2 border border-bone/20 space-y-1">
                  <strong className="text-bone text-sm block">Presentation style</strong>
                  <p className="text-bone-dim font-sans leading-relaxed">
                    Professional document design, clear graphs, engaging visual aids, prototypes, and team coordination.
                  </p>
                </div>
                <div className="p-3.5 bg-ink-2 border border-bone/20 space-y-1">
                  <strong className="text-bone text-sm block">Clarity and persuasiveness of the pitch</strong>
                  <p className="text-bone-dim font-sans leading-relaxed">
                    Compelling value proposition, defensible unit economics, clear target buyer identification, and logical narrative structure.
                  </p>
                </div>
                <div className="p-3.5 bg-ink-2 border border-bone/20 space-y-1">
                  <strong className="text-bone text-sm block">Response to cross-questioning</strong>
                  <p className="text-bone-dim font-sans leading-relaxed">
                    Confidence, mathematical fluency, handling critical scrutiny from jurors and challenger questions from competing teams.
                  </p>
                </div>
              </div>
            </div>

            {/* Rule Index */}
            <div className="space-y-3 font-mono text-xs">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 border-b border-bone/20 pb-2">
                Rulebook Summary
              </h3>
              {[
                { code: 'R-01', title: 'Eligibility', desc: 'Junior Grades 6–8, Senior Grades 9–12. 3 students per team, with one faculty advisor. One team per school per category.' },
                { code: 'R-02', title: 'Registration', desc: 'All communications conducted through the faculty advisor’s official school email. All deadlines in Indian Standard Time (IST).' },
                { code: 'R-03', title: 'Prompt Selection', desc: 'Exactly 1 layer prompt from the team’s own division. Open track prompt is submitted as an optional separate addendum.' },
                { code: 'R-04', title: 'Submission Protocol', desc: 'Uploads via CelesteCon portal before 19 Oct 2026, 01:00 PM IST. Selectable text required; zero late allowances.' },
                { code: 'R-05', title: 'Content & Ethics', desc: 'No military weaponry, adult content, or trademark infringement.' },
                { code: 'R-07', title: 'Round 2 Conduct', desc: 'Timing is strictly 7 minutes followed by jury cross-examination and audience challenger questions.' },
                { code: 'R-08', title: 'Judging & Ranking', desc: 'Round 1 scores carry into the final ranking together with Round 2. Judges’ decisions are final.' },
                { code: 'R-09', title: 'Intellectual Property', desc: 'Teams retain 100% IP ownership of their ventures.' },
                { code: 'R-10', title: 'Disqualification', desc: 'Plagiarism, undisclosed Tier 3 AI use, or code-of-conduct violations lead to immediate forfeiture.' }
              ].map((r) => (
                <div key={r.code} className="p-3.5 bg-ink-2 border border-bone/20 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                  <span className="text-crimson font-bold w-16 shrink-0">{r.code}</span>
                  <strong className="text-bone text-sm w-48 shrink-0 font-sans">{r.title}</strong>
                  <p className="text-bone-dim leading-relaxed">{r.desc}</p>
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex flex-wrap justify-between items-center gap-4 font-mono text-xs">
              <div className="text-bone-dim">
                Point of Contact: <strong className="text-bone">Ryaan Namit Jain</strong> (<a href="mailto:r23542ryaan@dpsrkp.net" className="text-crimson hover:underline">r23542ryaan@dpsrkp.net</a>) · <a href="mailto:aeross@dpsrkp.net" className="text-bone hover:underline">aeross@dpsrkp.net</a>
              </div>
              <div className="flex gap-3">
                <Link to="/comps" className="px-4 py-2 border border-bone/40 text-bone uppercase">
                  ← Back to Comps
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
