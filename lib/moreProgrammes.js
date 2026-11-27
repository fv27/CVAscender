// ---------------------------------------------------------------------------
// Batch 4 (added 7 Nov 2026): competitions, hackathons, university outreach,
// business camps and arts/science contests from the team's four lists.
//
//  verified: true  → checked against the organiser's site (see `source`).
//  verified: false → real organiser and link, but dates/ages come from the
//                    team's list and were NOT independently checked. The app
//                    labels these "Not checked yet".
// ---------------------------------------------------------------------------

const P = (o) => ({
  scope: 'national', format: 'in-person', city: null, canton: null,
  minAge: 14, maxAge: 19, cost: 'See the website', commitment: 'Varies',
  timing: 'See the website for current dates',
  eligibility: 'See the website for current eligibility.',
  verified: false, source: 'Team-supplied list (Nov 2026) — not independently checked',
  ...o,
});

const hack = (city, canton, when, extra = {}) => P({
  id: `hack-apertus-${city.toLowerCase().replace(/[^a-z]/g, '')}`,
  title: `Hack Apertus ${city}`, org: 'Hack Apertus (Swiss open-source AI hackathon series)',
  type: 'Hackathon', categories: ['technology', 'business'], skills: ['Coding', 'Teamwork', 'Problem solving'],
  city, canton: null, minAge: 16, maxAge: 25,
  eligibility: 'Student and university teams. No minimum age is published — confirm with the organisers before signing up.',
  description: `A two-day hackathon in ${city}: build open-source prototypes with Apertus, Switzerland’s open AI language model, on challenges from partner organisations.`,
  details: 'Part of a Swiss series of Apertus hackathons; winning teams can pitch at the Grand Finals in St. Gallen on 14 May 2027.',
  timing: when, commitment: 'Two days', url: 'https://hackapertus.ch/', ...extra,
});

const yesPitch = (region, city, canton, date) => P({
  id: `yes-pitch-${region.toLowerCase().replace(/[^a-z]/g, '-')}`,
  title: `YES Pitch Competition — ${region}`, org: 'Young Enterprise Switzerland (YES)',
  type: 'Entrepreneurship programme', categories: ['business', 'leadership'], skills: ['Entrepreneurship', 'Public speaking'],
  scope: 'local', city, canton, minAge: 16, maxAge: 20,
  eligibility: 'Teams in the YES Company Programme (student mini-companies).',
  description: `Pitch your student mini-company to a regional jury in ${city === 'Root' ? 'Root (Lucerne)' : city}.`,
  timing: date, commitment: 'One day', cost: 'Free for participating teams',
  url: 'https://yes.swiss/programme/company-programme',
});

const wro = (id, title, ages, minAge, maxAge, description) => P({
  id, title, org: 'World Robot Olympiad Switzerland',
  type: 'Academic competition', categories: ['technology', 'science'], skills: ['Coding', 'Problem solving', 'Teamwork'],
  minAge, maxAge, eligibility: `2027 age group: ${ages}.`,
  description, timing: '2027 season — check the Swiss regional competition dates', commitment: 'A season of team practice',
  url: 'https://wro.swiss/',
});

const techspark = (city, canton, url) => P({
  id: `techspark-${city.toLowerCase()}`, title: `TechSpark AI & Startup Lab — ${city}`, org: 'TechSpark Academy (private provider)',
  type: 'Summer programme', categories: ['technology', 'business'], skills: ['Entrepreneurship', 'Problem solving', 'Public speaking'],
  scope: 'local', city, canton, minAge: 13, maxAge: 18,
  eligibility: 'Ages 13+. No coding experience needed.',
  description: 'A paid holiday camp: use AI tools and startup methods to find a problem, build a solution and pitch it as a team.',
  timing: 'Holiday camps — check the 2027 sessions', commitment: 'Day camp (several days)', cost: 'Paid camp — see the website', url,
});

export const MORE_PROGRAMMES = [
  // ===================================================== AI, coding, hackathons
  P({
    id: 'swiss-ai-olympiad', title: 'Swiss Artificial Intelligence Olympiad', org: 'Swiss AI Olympiad',
    type: 'Academic competition', categories: ['technology', 'science'], skills: ['Coding', 'Data analysis', 'Problem solving'],
    format: 'online', minAge: 13, maxAge: 19,
    eligibility: 'Secondary-school students under 20 on 1 July 2027.',
    description: 'Online Python and maths rounds, AI training camps and selection for the International Olympiad in Artificial Intelligence.',
    timing: 'Applications for 2026/27 closed on 30 September 2026 — watch for the next cycle', commitment: 'Several rounds over the school year', cost: 'Free',
    url: 'https://www.aiolympiad.ch/',
  }),
  hack('Zurich', 'ZH', '27–28 November 2026'),
  hack('Basel', 'BS', '4–5 December 2026'),
  hack('Lausanne', 'VD', 'March 2027'),
  hack('St. Gallen', 'SG', '13–14 May 2027 (Grand Finals 14 May)', { details: 'The St. Gallen hackathon ends with the Hack Apertus Grand Finals on 14 May 2027, where winning teams from the series pitch their prototypes.' }),
  P({
    id: 'baden-hackt', title: 'Baden hackt', org: 'Baden hackt',
    type: 'Hackathon', categories: ['technology', 'business'], skills: ['Coding', 'Teamwork', 'Creativity'],
    scope: 'local', city: 'Baden', canton: 'AG', minAge: 16, maxAge: 25,
    eligibility: 'No age limit is published — check before you register.',
    description: 'A two-day hackathon where teams work on technology and innovation challenges.',
    timing: '9–10 April 2027', commitment: 'Two days', url: 'https://badenhackt.ch/',
  }),
  P({
    id: 'astro-pi-mission-zero', title: 'Astro Pi Mission Zero — run your code on the ISS', org: 'ESA & Raspberry Pi Foundation (European Astro Pi Challenge)',
    type: 'Academic competition', categories: ['technology', 'science'], skills: ['Coding', 'Creativity'],
    format: 'online', minAge: 8, maxAge: 19, deadline: '2027-03-22',
    eligibility: 'Young people aged 19 and under from ESA member states (Switzerland included), in teams of up to 4. A mentor — a teacher, club leader or parent — registers the team.',
    description: 'Write a short Python program that shows your pixel art on an Astro Pi computer aboard the International Space Station. Beginner-friendly, about 1 hour.',
    details: 'Every program that follows the guidelines is run in space, and teams get a certificate showing where the ISS was at the time.',
    timing: 'Open 14 Sep 2026 – 22 Mar 2027 (12:00 CET)', commitment: 'About 1 hour', cost: 'Free',
    url: 'https://astro-pi.org/mission-zero/', verified: true, source: 'astro-pi.org Mission Zero guidelines 2026/27, checked Nov 2026',
  }),
  P({
    id: 'astro-pi-mission-space-lab', title: 'Astro Pi Mission Space Lab', org: 'ESA & Raspberry Pi Foundation (European Astro Pi Challenge)',
    type: 'Academic competition', categories: ['technology', 'science'], skills: ['Coding', 'Data analysis', 'Research'],
    format: 'online', minAge: 12, maxAge: 19, deadline: '2027-02-22',
    eligibility: 'Teams of young people up to 19 in ESA member states, with some coding experience; a mentor registers the team.',
    description: 'Write a Python experiment that runs on the Astro Pi computers aboard the ISS and uses its sensors and camera.',
    timing: 'Deadline 22 February 2027 (per team list — confirm on astro-pi.org)', commitment: 'A few weeks of team work', cost: 'Free',
    url: 'https://astro-pi.org/',
  }),

  // ===================================================== robotics
  wro('wro-robomission-junior', 'WRO RoboMission — Junior', '11–15 (born 2012–2016)', 11, 15, 'Build and program a robot that completes autonomous challenges on a competition field.'),
  wro('wro-robomission-senior', 'WRO RoboMission — Senior', '14–19 (born 2008–2013)', 14, 19, 'Build and program a robot to solve the season’s competition tasks.'),
  wro('wro-future-innovators-junior', 'WRO Future Innovators — Junior', '11–15', 11, 15, 'Research a real-world problem and build a robot prototype that tackles it.'),
  wro('wro-future-innovators-senior', 'WRO Future Innovators — Senior', '14–19', 14, 19, 'Build a robotics project on the season’s theme and present your prototype to judges.'),
  wro('wro-future-engineers', 'WRO Future Engineers', '14–19', 14, 19, 'Design and program an autonomous robot car that drives a course on its own.'),
  P({
    id: 'robotic-contest-geneve', title: 'RoboTIC COntest', org: 'Canton of Geneva lower-secondary schools (CO)',
    type: 'School competition', categories: ['technology'], skills: ['Coding', 'Teamwork', 'Problem solving'],
    scope: 'local', city: 'Geneva', canton: 'GE', minAge: 12, maxAge: 15,
    eligibility: 'Teams of four nominated through Geneva cycle d’orientation schools — ask your teacher.',
    description: 'A school robotics competition: build, program and solve problems as a team.',
    timing: 'Next edition to confirm with your school', commitment: 'School-year project', cost: 'Free',
    url: 'https://www.ge.ch/',
  }),

  // ===================================================== science & sustainability
  P({
    id: 'earth-prize', title: 'The Earth Prize', org: 'The Earth Foundation (Geneva)',
    type: 'Academic competition', categories: ['environment', 'business', 'science'], skills: ['Entrepreneurship', 'Research', 'Teamwork'],
    format: 'online', minAge: 13, maxAge: 19, deadline: '2027-01-10',
    eligibility: 'Students aged 13–19 from anywhere in the world, alone or in teams of up to five. Registration is free; everything is in English.',
    description: 'The world’s largest environmental sustainability competition for teenagers: design a solution to an environmental problem, with online mentoring.',
    details: 'US$104,500 in prizes. 2027 timeline: registration until 10 January, submissions close 31 January, scholars announced 3 March, regional winners in May and the awards ceremony on 28 May 2027. Run by a Swiss foundation in Geneva.',
    timing: 'Register by 10 Jan 2027; submit by 31 Jan 2027', commitment: 'A few months, part-time', cost: 'Free',
    url: 'https://www.theearthprize.org/2027', verified: true, source: 'theearthprize.org timeline, checked Nov 2026',
  }),
  P({
    id: 'science-on-the-move', title: 'Science on the Move 2027 (class competition)', org: 'SimplyScience Foundation',
    type: 'Academic competition', categories: ['science', 'technology'], skills: ['Teamwork', 'Research', 'Creativity'],
    minAge: 15, maxAge: 19, deadline: '2027-01-03',
    eligibility: 'Whole upper-secondary classes, one or two years before the Swiss Matura. Your teacher registers the class.',
    description: 'A nationwide team science competition for classes: design your own project, visit a regional company and — for the top classes — perform on stage at the final.',
    details: 'The 2027 theme is “Dancing Plants”. Task published 12 January 2027, project documentation due 25 March, top classes announced 16 April, final event early June 2027. 1st prize is a science trip abroad for the whole class. Run in English.',
    timing: 'Class registration until 3 Jan 2027; competition Jan–Jun 2027', commitment: 'One semester of class project work', cost: 'Free',
    url: 'https://www.simplyscience.ch/teens/spiel-spass/science-on-the-move', verified: true, source: 'simplyscience.ch competition page, checked Nov 2026',
  }),
  P({
    id: 'sjf-labxplore', title: 'LabXplore — Swiss Youth in Science', org: 'Swiss Youth in Science (Schweizer Jugend forscht)',
    type: 'Research week', categories: ['science'], skills: ['Research'],
    description: 'Visit research labs and find out about scientific careers through visits and hands-on activities.',
    timing: '2026/27 — check the current application window', url: 'https://sjf.ch/',
  }),
  P({
    id: 'egoi-swiss-selection', title: 'European Girls’ Olympiad in Informatics — Swiss team', org: 'Swiss Olympiad in Informatics (SOI)',
    type: 'Academic competition', categories: ['technology'], skills: ['Coding', 'Problem solving'],
    format: 'hybrid', minAge: 13, maxAge: 19,
    eligibility: 'Girls who meet the international age rules — check soi.ch.',
    description: 'The selection route for talented young female programmers to represent Switzerland at the European Girls’ Olympiad in Informatics.',
    timing: 'Annual selection', commitment: 'Several rounds + training', cost: 'Free', url: 'https://soi.ch/',
  }),

  // ===================================================== universities: Geneva, Bern, Basel, EPFL
  P({
    id: 'unibe-courses-high-school', title: 'University of Bern — courses for high-school students', org: 'University of Bern',
    type: 'University programme', categories: ['academic'], skills: ['Research', 'Writing'],
    scope: 'local', city: 'Bern', canton: 'BE', minAge: 16, maxAge: 20,
    eligibility: 'Usually third-year Gymnasium students (or equivalent) from Bern and neighbouring cantons.',
    description: 'Take regular university courses alongside school.', cost: 'Free',
    timing: 'Each semester', commitment: 'One or more courses', url: 'https://www.unibe.ch/lifelong_learning/courses_for_high_school_students/index_eng.html',
  }),
  P({
    id: 'basel-summer-science-academy', title: 'Basel Summer Science Academy', org: 'Biozentrum, University of Basel',
    type: 'Summer programme', categories: ['science', 'health'], skills: ['Research', 'Teamwork'],
    scope: 'local', city: 'Basel', canton: 'BS', minAge: 15, maxAge: 19,
    eligibility: 'Gymnasium students from the Basel region with a strong interest in the natural sciences. Apply online with a one-page motivation letter.',
    description: 'Hunt for new phages (viruses that kill bacteria) in and around Basel and study them in a real Biozentrum lab, with researchers as tutors.',
    details: 'Taught in English (tutors also speak German); participation is free with lunch included, and you get a certificate. 43 students aged 15–19 took part in 2026. For 2027 the team list gives two weeks — 5–9 July or 19–23 July — with applications opening in February 2027.',
    timing: 'July 2027; applications open February 2027', commitment: 'One week, daytime', cost: 'Free, lunch included',
    url: 'https://www.biozentrum.unibas.ch/summer-schools/basel-summer-science-academy', verified: true, source: 'biozentrum.unibas.ch (programme page, 2025 flyer, 2026 news), checked Nov 2026',
  }),
  P({
    id: 'swissmap-athena-project', title: 'Athena Project (SwissMAP)', org: 'NCCR SwissMAP with the University of Geneva',
    type: 'University programme', categories: ['science', 'academic'], skills: ['Problem solving', 'Research'],
    scope: 'local', city: 'Geneva', canton: 'GE', minAge: 16, maxAge: 19,
    description: 'Follow selected first-semester university maths and physics courses with extra support and tutoring.',
    timing: 'Contact the organisers for the next intake', url: 'https://www.nccr-swissmap.ch/school-teachers-children/athena-projects',
  }),
  P({
    id: 'unige-mathscope', title: 'Mathscope', org: 'University of Geneva, Section of Mathematics',
    type: 'Outreach programme', categories: ['science'], skills: ['Problem solving', 'Teamwork'],
    scope: 'local', city: 'Geneva', canton: 'GE', minAge: 10, maxAge: 19,
    eligibility: 'School groups — your teacher books a visit.',
    description: 'Interactive maths activities, challenges and hands-on experiments for school groups.', url: 'https://www.unige.ch/',
  }),
  P({
    id: 'unige-elargis-tes-horizons', title: 'Élargis tes horizons', org: 'University of Geneva',
    type: 'Outreach programme', categories: ['science', 'technology'], skills: ['Research'],
    scope: 'local', city: 'Geneva', canton: 'GE', minAge: 10, maxAge: 18,
    eligibility: 'Girls aged 10–18.',
    description: 'Monthly science activities for girls: lab visits and meetings with researchers and engineers.',
    timing: 'Monthly during the school year', url: 'https://www.unige.ch/',
  }),
  P({
    id: 'unige-brain-week', title: 'Brain Week — neuroscience lab visits', org: 'University of Geneva',
    type: 'Research week', categories: ['science', 'health'], skills: ['Research'],
    scope: 'local', city: 'Geneva', canton: 'GE', minAge: 15, maxAge: 19,
    description: 'Visit neuroscience labs and find out about current brain research during the annual Brain Awareness Week.',
    timing: 'Annual (usually March) — watch for the 2027 programme', commitment: 'Half a day', url: 'https://www.unige.ch/',
  }),
  P({
    id: 'unige-bio-medicine-week', title: 'Biology & medicine research week', org: 'University of Geneva',
    type: 'Research week', categories: ['science', 'health'], skills: ['Research'],
    scope: 'local', city: 'Geneva', canton: 'GE', minAge: 15, maxAge: 19,
    description: 'Discover laboratory research in biology and medicine through hands-on activities.',
    timing: '2027 dates to confirm', url: 'https://www.unige.ch/',
  }),
  P({
    id: 'epfl-information-days', title: 'EPFL Information Days', org: 'EPFL',
    type: 'Outreach programme', categories: ['academic', 'technology', 'science'], skills: ['Communication'],
    city: 'Lausanne', minAge: 16, maxAge: 20,
    eligibility: 'Upper-secondary students thinking about studying at EPFL.',
    description: 'Discover EPFL’s Bachelor programmes, attend information sessions and explore the campus.',
    timing: '18–20 November 2026', commitment: '1–3 days', cost: 'Free',
    url: 'https://www.epfl.ch/education/studies/undergraduate/visits-and-information-sessions/',
  }),
  P({
    id: 'epfl-programme-ton-jeu-video', title: 'Programme ton jeu vidéo', org: 'EPFL — Education Outreach Department',
    type: 'Club', categories: ['technology'], skills: ['Coding', 'Creativity', 'Design'],
    city: 'Lausanne', minAge: 13, maxAge: 15,
    description: 'Learn to program by building your own video game.', timing: 'Spring and autumn 2027',
    url: 'https://www.epfl.ch/education/education-and-science-outreach/fr/programmeactivites/',
  }),
  P({
    id: 'epfl-mon-projet-scientifique', title: 'Mon projet scientifique', org: 'EPFL — Education Outreach Department',
    type: 'Summer programme', categories: ['science'], skills: ['Research', 'Project management'],
    city: 'Lausanne', minAge: 13, maxAge: 15,
    description: 'Develop your own science project with support from EPFL.', timing: 'July 2027',
    url: 'https://www.epfl.ch/education/education-and-science-outreach/fr/programmeactivites/',
  }),
  P({
    id: 'epfl-cree-ton-appli', title: 'Toi aussi, crée ton appli !', org: 'EPFL School of Computer and Communication Sciences',
    type: 'Summer programme', categories: ['technology'], skills: ['Coding', 'Design'],
    city: 'Lausanne', minAge: 13, maxAge: 15,
    eligibility: 'Girls aged 13–15, including from outside Vaud.',
    description: 'Design and program your own mobile app and discover careers in tech.', timing: 'August 2027',
    url: 'https://www.epfl.ch/schools/ic/fr/a-propos/promotion-fr/declic-fr/cree-ton-appli-fr/',
  }),

  // ===================================================== business & entrepreneurship
  yesPitch('Basel', 'Basel', 'BS', '23 January 2027'),
  yesPitch('Central Switzerland', 'Root', 'LU', '23 January 2027'),
  yesPitch('Bern', 'Bern', 'BE', '30 January 2027'),
  yesPitch('Zurich', 'Zurich', 'ZH', '6 February 2027'),
  yesPitch('Eastern Switzerland', 'St. Gallen', 'SG', '13 February 2027'),
  yesPitch('Ticino', 'Ticino', 'TI', '20 February 2027'),
  P({ ...yesPitch('Northern Switzerland', null, null, '20 February 2027'), scope: 'national', description: 'Regional pitch competition for student mini-companies in Northern Switzerland.' }),
  P({
    id: 'yes-national-trade-fair', title: 'YES National Trade Fair', org: 'Young Enterprise Switzerland (YES)',
    type: 'Entrepreneurship programme', categories: ['business'], skills: ['Entrepreneurship', 'Communication'],
    city: 'Zurich', minAge: 16, maxAge: 20,
    eligibility: 'The top mini-companies from the YES Company Programme.',
    description: 'Exhibit and sell your student company’s products at the national trade fair.',
    timing: '16–20 March 2027', commitment: 'Several days', url: 'https://yes.swiss/programme/company-programme',
  }),
  P({
    id: 'swissquote-campus-challenge', title: 'Swissquote Campus Challenge', org: 'Swissquote',
    type: 'Academic competition', categories: ['business'], skills: ['Data analysis', 'Entrepreneurship'],
    minAge: 16, maxAge: 25,
    eligibility: 'Student eligibility and minimum age for 2027 are not yet published — it may be aimed at university students. Confirm before applying.',
    description: 'Build an investment strategy — the winners can launch it as a real investment certificate on Swissquote and SIX Swiss Exchange.',
    timing: 'Third edition expected in 2027', url: 'https://www.swissquote.com/en-ch/private/enjoy/students/campus-challenge',
  }),
  P({
    id: 'graines-entrepreneurs-camps', title: 'Graines d’Entrepreneurs holiday camps', org: 'Graines d’Entrepreneurs',
    type: 'Summer programme', categories: ['business', 'leadership'], skills: ['Entrepreneurship', 'Public speaking'],
    scope: 'local', city: 'Geneva', canton: 'GE', minAge: 12, maxAge: 18,
    description: 'Holiday camps where you build a startup idea and pitch it to a jury.', timing: '2027 dates to confirm',
    url: 'https://www.grainesentrepreneurs.ch/holiday-camps',
  }),
  P({
    id: 'graines-entrepreneurs-workshops', title: 'Graines d’Entrepreneurs school workshops', org: 'Graines d’Entrepreneurs',
    type: 'Entrepreneurship programme', categories: ['business'], skills: ['Entrepreneurship', 'Creativity'],
    scope: 'local', city: 'Geneva', canton: 'GE', minAge: 10, maxAge: 18,
    eligibility: 'Through schools — ask your teacher to book a workshop.',
    description: 'Entrepreneurship workshops on innovation, problem-solving and starting a business.',
    url: 'https://www.grainesentrepreneurs.ch/',
  }),
  P({
    id: 'futuremakers-ai-camp', title: 'FutureMakers AI Camp', org: 'FutureMakers (private provider)',
    type: 'Summer programme', categories: ['technology', 'business'], skills: ['Problem solving', 'Teamwork', 'Entrepreneurship'],
    scope: 'local', city: 'Lausanne', canton: 'VD', minAge: 13, maxAge: 18,
    description: 'A one-week project camp using AI to tackle a challenge linked to the UN Sustainable Development Goals.',
    timing: '2027 dates to confirm', commitment: 'One week', cost: 'Paid camp — see the website', url: 'https://futuremakers.ch/',
  }),
  techspark('Geneva', 'GE', 'https://online.techsparkacademy.ch/future-ready-ai-startup-lab/'),
  techspark('Lausanne', 'VD', 'https://leman.techsparkacademy.ch/lausanne-camps/'),
  techspark('Zurich', 'ZH', 'https://zurich.techsparkacademy.ch/zurich-day-camps/'),
  P({
    id: 'albert-florimont-camp', title: 'Data, Business & Entrepreneurship Camp (Albert School × Florimont)', org: 'Albert School and Institut Florimont',
    type: 'Summer programme', categories: ['business', 'technology'], skills: ['Data analysis', 'Entrepreneurship'],
    scope: 'local', city: 'Geneva', canton: 'GE', minAge: 15, maxAge: 18,
    description: 'Two weeks exploring entrepreneurship, business, data and finance through a team project and company visits.',
    timing: 'The 2026 edition has passed — watch for summer 2027', commitment: 'Two weeks', cost: 'Paid camp — see the website',
    url: 'https://www.florimont.ch/en/summer-camps/',
  }),
  P({
    id: 'ehl-junior-academy', title: 'EHL Junior Academy — hospitality & business', org: 'EHL Hospitality Business School',
    type: 'Summer programme', categories: ['business'], skills: ['Entrepreneurship', 'Teamwork'],
    scope: 'local', city: 'Lausanne', canton: 'VD', minAge: 16, maxAge: 18,
    description: 'A pre-university programme on hospitality, business and management, with hands-on learning.',
    timing: 'Check the next programme dates', cost: 'Paid — see the website',
    url: 'https://www.ehl.edu/en/study/pre-university-courses/hospitality-business-innovation',
  }),
  P({
    id: 'venture-startup-competition', title: '>>venture>> startup competition', org: 'venture (ETH Zurich & partners)',
    type: 'Entrepreneurship programme', categories: ['business'], skills: ['Entrepreneurship', 'Public speaking'],
    minAge: 16, maxAge: 30, deadline: '2026-11-30',
    eligibility: 'For Swiss-based startups and non-profits. Whether under-18s can enter is not stated — check first.',
    description: 'Switzerland’s best-known startup competition: coaching, expert feedback and big prizes in six industry categories.',
    timing: 'Applications 1 Oct – 30 Nov 2026; final 22 June 2027 at ETH Zurich', commitment: 'Several months', cost: 'Free',
    url: 'https://www.venture.ch/participate-2027',
  }),

  // ===================================================== arts
  P({
    id: 'sjmw-composition', title: 'Swiss Youth Music Competition — Composition', org: 'Swiss Youth Music Competition (SJMW)',
    type: 'Academic competition', categories: ['arts'], skills: ['Creativity'],
    minAge: 10, maxAge: 21, eligibility: 'Young composers — check the rules for your age group.',
    description: 'Submit your own music to be judged by professional musicians.', timing: '2027 cycle', url: 'https://sjmw.ch/',
  }),
  P({
    id: 'concours-reflex', title: 'REFLEX short-film competition', org: 'Concours REFLEX',
    type: 'Academic competition', categories: ['arts'], skills: ['Creativity', 'Teamwork', 'Design'],
    minAge: 12, maxAge: 26,
    eligibility: 'Ages 12–26 living or studying in French-speaking Switzerland (check the residence rules).',
    description: 'Make a short film on the year’s theme for this youth film competition in Romandie.', timing: '2027 edition',
    url: 'https://concoursreflex.ch/',
  }),
];

// Updates to listings that were already in the app (merged by id).
export const PATCHES = {
  'cern-bl4s': { timing: 'Proposals open December 2026; deadline about mid-March 2027 (12 March per team list — confirm on the site)' },
  'eth-math-youth-academy': { timing: 'Weekly during the school year; register by email', cost: 'Free' },
  'eth-youth-academy': {
    url: 'https://educ.ethz.ch/lernzentren/mint-lernzentrum/ETH_Youth_Academy.html',
    description: 'Semester courses in mathematics and natural sciences for students in grades 7–12, developed with ETH departments.',
    timing: 'Each semester', minAge: 12, maxAge: 19,
  },
  'unige-athena': { timing: 'Apply by May 2027 (per team list — confirm on the site)' },
  'epfl-coding-girls': {
    url: 'https://www.epfl.ch/education/education-and-science-outreach/fr/jeunepublic/coding-club/',
    timing: 'Spring 2027 registration opens 16 November 2026 (per team list)',
  },
  'olymp-economics': {
    url: 'https://economics.olympiad.ch/en/',
    timing: '2026/27 first round closed; Innovation Camp 19–21 March 2027, national final 9 April 2027 (per team list)',
  },
  'sjf-national': { timing: '2027 registration closed 31 Oct 2026; semi-final 16 January, final 1–3 April 2027' },
  'sjmw-classica': { timing: '2027 regional rounds 26–28 February (per team list)' },
};
