// ---------------------------------------------------------------------------
// Batch 5 (added 8 Nov 2026): the rest of the team's "Swiss opportunity
// database" list that wasn't in the app yet, plus extra research, maths and
// essay programmes found on the web.
//
//  verified: true  → checked on the web on the date in `source`.
//  verified: false → from the team's list; real organiser and link, details
//                    NOT checked yet ("Not checked yet" in the app).
// ---------------------------------------------------------------------------

const P = (o) => ({
  scope: 'national', format: 'in-person', city: null, canton: null,
  minAge: 13, maxAge: 19, cost: 'See the website', commitment: 'Varies',
  timing: 'See the website for current dates',
  eligibility: 'See the website for current eligibility.',
  verified: false, source: 'Team-supplied list (Nov 2026) — not independently checked',
  ...o,
});
const L = (city, canton) => ({ scope: 'local', city, canton });
const WORLD = { scope: 'global' };

const council = (id, title, org, city, canton, minAge, maxAge, url, extra = {}) => P({
  id, title, org, type: 'Civic programme', categories: ['leadership', 'volunteering'],
  skills: ['Leadership', 'Public speaking', 'Communication'], ...L(city, canton), minAge, maxAge,
  eligibility: minAge ? `Young people aged about ${minAge}–${maxAge} living in the area — check current rules.` : 'Young people from the area — check the current age limits.',
  description: 'Have a real say in local youth policy: debate issues, propose projects and present ideas to politicians.',
  timing: 'Ongoing — check when new members are recruited', commitment: 'Regular meetings during the year', cost: 'Free', url, ...extra,
});

export const BATCH5 = [
  // ================================================== Research & maths abroad
  P({
    id: 'promys-europe', title: 'PROMYS Europe — maths summer at Oxford', org: 'PROMYS Europe (Wadham College & Oxford Mathematical Institute, with the Clay Mathematics Institute)',
    type: 'Summer programme', categories: ['science', 'academic'], skills: ['Problem solving', 'Research'],
    ...WORLD, city: 'Oxford', minAge: 16, maxAge: 19,
    eligibility: 'Mathematically ambitious secondary-school students aged 16+ who live in Europe (Switzerland included).',
    description: 'Six weeks of deep, proof-based mathematics at the University of Oxford with a small, selective group from across Europe.',
    details: 'You apply with a hard problem set, a teacher recommendation and short essays. The 2027 fee is about £4,500 including room and meals, with full or partial need-based aid. 2027 dates: 11 July – 21 August.',
    timing: 'Applications open January 2027 (deadline usually early March) · programme 11 Jul – 21 Aug 2027', commitment: 'Six weeks, residential', cost: 'About £4,500 — need-based aid available',
    url: 'https://www.promys-europe.org/', verified: true, source: 'promys-europe.org, Clay Mathematics Institute & Immerse guide (2027 dates), checked Nov 2026',
  }),
  P({
    id: 'summer-science-program', title: 'Summer Science Program (SSP)', org: 'SSP International',
    type: 'Summer programme', categories: ['science', 'academic'], skills: ['Research', 'Data analysis', 'Coding'],
    ...WORLD, city: 'USA', minAge: 15, maxAge: 18,
    eligibility: 'Students in their penultimate school year; international students welcome (earlier deadline).',
    description: 'Five weeks of hands-on research in a small team — astrophysics, biochemistry, genomics or synthetic chemistry — on a US university campus.',
    details: 'Applying is free, and SSP aims to make the programme affordable with need-based aid. About 700 places in 2026.',
    timing: 'Applications open December 2026 · international deadline expected January 2027', commitment: 'Five weeks, residential', cost: 'Need-based — free to apply',
    url: 'https://ssp.org/', verified: true, source: 'ssp.org application page, checked Nov 2026',
  }),
  P({
    id: 'mathcamp', title: 'Canada/USA Mathcamp', org: 'Mathematics Foundation of America',
    type: 'Summer programme', categories: ['science', 'academic'], skills: ['Problem solving', 'Creativity'],
    ...WORLD, city: 'USA', minAge: 13, maxAge: 18,
    eligibility: 'Students aged 13–18 from anywhere in the world; about 10–15% come from outside the US and Canada.',
    description: 'Five weeks of university-level maths classes and a big, friendly maths community. You apply by solving the Qualifying Quiz.',
    details: 'No application fee, and admission does not depend on ability to pay — international students get the same financial aid, including travel help.',
    timing: '2027 dates announced in December · deadline usually late February', commitment: 'Five weeks, residential', cost: 'About USD 7,500 — generous financial aid',
    url: 'https://mathcamp.org/', verified: true, source: 'mathcamp.org international admissions page, checked Nov 2026',
  }),
  P({
    id: 'ross-program', title: 'Ross Mathematics Program', org: 'Ross Mathematics Foundation',
    type: 'Summer programme', categories: ['science', 'academic'], skills: ['Problem solving', 'Research'],
    ...WORLD, city: 'USA', minAge: 14, maxAge: 18,
    eligibility: 'Motivated pre-college students; international students accepted.',
    description: 'Six intensive weeks of number theory — “think deeply about simple things” — on a US campus.',
    timing: '2027 dates not yet published · deadline usually early March', commitment: 'Six weeks, residential', cost: 'About USD 7,500 — financial aid available',
    url: 'https://rossprogram.org/', verified: true, source: 'rossprogram.org FAQ, checked Nov 2026',
  }),
  P({
    id: 'inspirit-ai', title: 'Inspirit AI Scholars', org: 'Inspirit AI',
    type: 'Online course', categories: ['technology', 'science'], skills: ['Coding', 'Data analysis', 'Research'],
    ...WORLD, format: 'online', minAge: 14, maxAge: 18,
    eligibility: 'High-school students (grades 9–12) worldwide; no coding experience needed.',
    description: 'A live online AI bootcamp in small groups: learn the basics of machine learning and build a project with real-world impact.',
    timing: 'Rolling cohorts through the year', commitment: '10 sessions (~25 hours)', cost: 'Paid (about USD 1,400) — limited aid',
    url: 'https://www.inspiritai.com/', verified: true, source: 'inspiritai.com & Borderless listing, checked Nov 2026',
  }),
  P({
    id: 'veritas-ai', title: 'Veritas AI', org: 'Veritas AI',
    type: 'Online course', categories: ['technology', 'science'], skills: ['Coding', 'Data analysis'],
    ...WORLD, format: 'online', minAge: 14, maxAge: 18,
    eligibility: 'High-school students worldwide — check the current requirements.',
    description: 'Online AI programme run by Harvard graduate students: learn machine learning and build a real project with a mentor.',
    cost: 'Paid programme — see the website', url: 'https://www.veritasai.com/',
  }),

  // ================================================== Essays & writing
  P({
    id: 'hir-writing-contest', title: 'Harvard International Review Academic Writing Contest', org: 'Harvard International Review',
    type: 'Academic competition', categories: ['academic', 'leadership', 'arts'], skills: ['Writing', 'Research'],
    ...WORLD, format: 'online', minAge: 12, maxAge: 18, deadline: '2027-01-02',
    eligibility: 'Students in grades 9–12 worldwide; a junior division for grades 7–8.',
    description: 'Write a short analytical article on international affairs. Finalists defend their piece to HIR editors on “Defense Day”.',
    details: 'Three rounds a year. Fall/Winter 2026 round: articles due 2 January 2027, Defense Day 5 February 2027. AI-written entries are disqualified.',
    timing: 'Fall/Winter round — submit by 2 Jan 2027', commitment: 'A short article', cost: 'Free',
    url: 'https://hir.harvard.edu/contest', verified: true, source: 'hir.harvard.edu contest page & Aralia listing, checked Nov 2026',
  }),
  P({
    id: 'think-essay-prize', title: 'Think Essay Prize (philosophy)', org: 'Royal Institute of Philosophy',
    type: 'Academic competition', categories: ['academic', 'arts'], skills: ['Writing', 'Problem solving'],
    ...WORLD, format: 'online', minAge: 15, maxAge: 18,
    eligibility: 'Students aged 15–18 from any country.',
    description: 'Answer one of six philosophy questions in up to 1,200 words. The winning essay is published in the journal Think.',
    timing: '2027 questions released later in the school year · 2026 deadline was 20 April', commitment: 'A short essay', cost: 'Free',
    url: 'https://royalinstitutephilosophy.org/', verified: true, source: 'Royal Institute of Philosophy & Borderless listing, checked Nov 2026',
  }),

  // ================================================== Swiss science
  P({
    id: 'psi-ilab', title: 'iLab school lab at the Paul Scherrer Institute', org: 'Paul Scherrer Institut (PSI)',
    type: 'Outreach programme', categories: ['science'], skills: ['Research', 'Problem solving'],
    ...L('Villigen', 'AG'), minAge: 12, maxAge: 20,
    eligibility: 'School classes — mainly ages 14–15, adapted for 10–20. Ask your teacher to book.',
    description: 'Do experiments with waves, light and vacuum in the lab of Switzerland’s largest research institute.',
    timing: 'During the school year, booked by classes', commitment: 'A day visit', cost: 'Ask PSI',
    url: 'https://www.psi.ch/en/pa/school-lab', verified: true, source: 'psi.ch School Lab iLab page, checked Nov 2026',
  }),
  P({
    id: 'epfl-zappy-robotics', title: 'Zappy Robotics', org: 'EPFL — Education & science outreach',
    type: 'Outreach programme', categories: ['technology', 'science'], skills: ['Coding', 'Problem solving'],
    ...L('Lausanne', 'VD'), minAge: 10, maxAge: 14,
    description: 'An introduction to robotics and programming at EPFL.',
    url: 'https://www.epfl.ch/education/education-and-science-outreach/fr/programmeactivites/',
  }),
  P({
    id: 'girls-on-ice', title: 'Girls on Ice Switzerland', org: 'Girls on Ice Switzerland',
    type: 'Summer programme', categories: ['science', 'environment', 'leadership'], skills: ['Research', 'Teamwork', 'Leadership'],
    minAge: 15, maxAge: 18,
    eligibility: 'Girls — check the age range and selection criteria for the next expedition.',
    description: 'A free outdoor science expedition on a glacier: learn field research on ice, climate and mountains with women scientists.',
    url: 'https://www.girlsonice.ch/',
  }),
  P({
    id: 'girlscodetoo-events', title: 'GirlsCodeToo coding events', org: 'GirlsCodeToo',
    type: 'Outreach programme', categories: ['technology'], skills: ['Coding', 'Creativity'],
    minAge: 10, maxAge: 18, eligibility: 'Girls — the age range depends on the event.',
    description: 'Coding, robotics and 3D-printing workshops for girls, plus the chance to meet women working in tech.',
    url: 'https://www.girlscodetoo.ch/en/our-events/',
  }),
  P({
    id: 'lerobot-workshops', title: 'LeRobot robotics workshops', org: 'LeRobot (via GirlsCodeToo events)',
    type: 'Outreach programme', categories: ['technology'], skills: ['Coding', 'Problem solving'],
    description: 'Hands-on robotics and technology workshops.', url: 'https://www.girlscodetoo.ch/en/our-events/',
  }),
  P({
    id: 'educamint', title: 'Educamint — STEM activities near you', org: 'Educamint',
    type: 'Outreach programme', categories: ['science', 'technology'], skills: ['Research', 'Problem solving'],
    minAge: 8, maxAge: 19, eligibility: 'Depends on the activity.',
    description: 'A searchable catalogue of STEM workshops, camps and science experiences all over Switzerland.',
    timing: 'Ongoing catalogue', url: 'https://educamint.ch/',
  }),
  P({
    id: 'mint-and-pepper', title: 'mint & pepper STEM workshops', org: 'mint & pepper',
    type: 'Outreach programme', categories: ['technology', 'science'], skills: ['Coding', 'Creativity'],
    ...L('Zurich', 'ZH'), minAge: 10, maxAge: 16, eligibility: 'Depends on the activity.',
    description: 'Hands-on STEM and technology workshops, including robotics.', url: 'https://mintpepper.ch/',
  }),
  P({
    id: 'eth-wow2', title: 'wow² — STEM activities at ETH', org: 'ETH Zurich (STEM outreach)',
    type: 'Outreach programme', categories: ['science', 'technology'], skills: ['Problem solving'],
    ...L('Zurich', 'ZH'), description: 'Hands-on STEM outreach activities for school students.',
    url: 'https://math.ethz.ch/outreach/stem-programmes.html',
  }),

  // ================================================== Coding & tech camps
  P({
    id: 'techspark-zug', title: 'TechSpark Academy — Zug', org: 'TechSpark Academy (private provider)',
    type: 'Summer programme', categories: ['technology', 'business'], skills: ['Coding', 'Entrepreneurship'],
    ...L('Zug', 'ZG'), minAge: 12, maxAge: 18, cost: 'Paid camp — see the website',
    description: 'Holiday camps on AI, coding and startups.', url: 'https://techsparkacademy.ch/',
  }),
  P({
    id: 'techspark-luzern', title: 'TechSpark Academy — Lucerne', org: 'TechSpark Academy (private provider)',
    type: 'Summer programme', categories: ['technology', 'business'], skills: ['Coding', 'Entrepreneurship'],
    ...L('Lucerne', 'LU'), minAge: 12, maxAge: 18, cost: 'Paid camp — see the website',
    description: 'Holiday camps on AI, coding and startups.', url: 'https://techsparkacademy.ch/',
  }),
  P({
    id: 'next-academy-ai-camp', title: 'NEXT Academy AI Summer Camp', org: 'NEXT Academy',
    type: 'Summer programme', categories: ['technology'], skills: ['Coding', 'Problem solving'],
    ...L('Geneva', 'GE'), minAge: 13, maxAge: 18, cost: 'Paid camp — see the website',
    description: 'An intensive summer camp focused on artificial intelligence.',
    timing: '2026 dates have passed — watch for 2027', url: 'https://next-academy.ch/',
  }),
  P({
    id: 'futurekids', title: 'Futurekids coding & robotics courses', org: 'Futurekids',
    type: 'Online course', categories: ['technology', 'arts'], skills: ['Coding', 'Creativity', 'Design'],
    minAge: 8, maxAge: 16, cost: 'Paid — see the website',
    description: 'Courses and camps in coding, robotics, animation and game design in several cantons.',
    timing: 'Courses and camps all year', url: 'https://futurekids.io/',
  }),
  P({
    id: 'cosmo-robotics', title: 'Cosmo Robotics Academy camps', org: 'Cosmo Robotics',
    type: 'Summer programme', categories: ['technology'], skills: ['Coding', 'Problem solving'],
    ...L('Nyon', 'VD'), minAge: 8, maxAge: 14, cost: 'Paid camp — see the website',
    description: 'Robotics camps with micro:bit and Maqueen robots and programming projects.',
    timing: '2027 camps: 8–12 Feb, 30 Mar–2 Apr, 12–16 Jul, 26–30 Jul, 9–13 Aug, 11–15 Oct', url: 'https://www.cosmorobotics.ch/en/academy',
  }),
  P({
    id: 'code-camp-switzerland', title: 'Code Camp Switzerland', org: 'Code Camp',
    type: 'Summer programme', categories: ['technology'], skills: ['Coding', 'Creativity'],
    minAge: 10, maxAge: 13, cost: 'Paid camp — see the website',
    eligibility: 'Most courses are for ages 7–13 — check each camp.',
    description: 'Coding, game-development and AI camps in towns across Switzerland.',
    timing: '2027 camps in several towns', url: 'https://en.codecampworld.ch/unsere-camps',
  }),

  // ================================================== Holiday programmes
  P({
    id: 'ferienplausch', title: 'Pro Juventute Ferienplausch', org: 'Pro Juventute',
    type: 'Outreach programme', categories: ['technology', 'arts', 'science'], skills: ['Creativity'],
    ...L('Zurich', 'ZH'), minAge: 8, maxAge: 16,
    description: 'Holiday activities around Zurich: coding, 3D printing, robotics, filmmaking, art and nature.',
    timing: 'Watch for the 2027 listings', url: 'https://ferienplausch.feriennet.projuventute.ch/activities',
  }),
  P({
    id: 'glaj-geneve', title: 'Youth activities in Geneva (GLAJ)', org: 'Groupe de liaison genevois des associations de jeunesse',
    type: 'Youth organisation', categories: ['arts', 'sports', 'volunteering'], skills: ['Teamwork'],
    ...L('Geneva', 'GE'), minAge: 10, maxAge: 25,
    description: 'A directory of youth activities, workshops and holiday programmes in Geneva.',
    timing: 'Ongoing catalogue', url: 'https://glaj-ge.ch/activites-jeunesse/',
  }),
  P({
    id: 'passeport-vacances-lausanne', title: 'Passeport Vacances — Lausanne region', org: 'Association du Passeport Vacances de la région lausannoise',
    type: 'Outreach programme', categories: ['arts', 'sports', 'science'], skills: ['Creativity', 'Teamwork'],
    ...L('Lausanne', 'VD'), minAge: 9, maxAge: 15,
    description: 'Holiday programme with activities in sport, arts, culture and science.',
    timing: 'Each school holiday season', url: 'https://apvrl.ch/',
  }),

  // ================================================== Youth councils & civic
  council('conseil-jeunesse-geneve', 'Conseil de la jeunesse de Genève', 'Canton of Geneva', 'Geneva', 'GE', 14, 21, 'https://www.ge.ch/participation-au-conseil-jeunesse'),
  council('commission-jeunes-vaud', 'Commission de jeunes du canton de Vaud', 'Canton of Vaud', 'Lausanne', 'VD', 14, 20, 'https://www.vd.ch/population/enfance-jeunesse-et-famille/promotion-et-soutien-aux-activites-de-jeunesse-1/commission-de-jeunes'),
  council('conseil-jeunes-fribourg', 'Conseil des jeunes de la Ville de Fribourg', 'City of Fribourg', 'Fribourg', 'FR', 15, 25, 'https://www.fr.ch/vie-quotidienne/enfance-jeunesse-et-famille/participation-et-engagement-pour-les-jeunes'),
  council('jugendparlament-bern', 'Jugendparlament der Stadt Bern', 'City of Bern', 'Bern', 'BE', 0, 0, 'https://www.bern.ch/politik-und-verwaltung/stadtverwaltung/bss/familieundquartier/bereich-soziokultur/fachstelle-fuer-kinder-und-jugendmitwirkung/jugendparlament-der-stadt-bern/', { minAge: 13, maxAge: 25 }),
  council('jugendparlament-basel', 'Jugendparlament Basel', 'Junger Rat Basel', 'Basel', 'BS', 14, 25, 'https://www.jupa.junger-rat.ch/'),
  council('jukalu', 'JUKALU — Jugendparlament Luzern', 'Canton of Lucerne', 'Lucerne', 'LU', 0, 0, 'https://disg.lu.ch/themen/kjf/kjf/kjp/jp', { minAge: 13, maxAge: 25 }),
  council('parlement-jeunes-valais', 'Parlement des jeunes du Valais', 'Canton of Valais', 'Sion', 'VS', 0, 0, 'https://www.vs.ch/fr/web/scj/parlement-des-jeunes1', { minAge: 13, maxAge: 25 }),
  council('consiglio-giovani-ticino', 'Consiglio cantonale dei giovani', 'Canton of Ticino', 'Bellinzona', 'TI', 0, 0, 'https://www4.ti.ch/dss/dasf/temi/giovani/politiche-giovanili/consiglio-cantonale-dei-giovani-ccg/', { minAge: 13, maxAge: 25 }),
  council('parole-jeunes-nyon', 'La parole des jeunes à Nyon', 'City of Nyon', 'Nyon', 'VD', 15, 21, 'https://www.nyon.ch/agenda/la-parole-des-jeunes-a-nyon-2027--appel-a-participation-20374', {
    description: 'Share your ideas on life in Nyon and help shape local projects for young people.', timing: '17 April – 27 June 2027',
  }),
  P({
    id: 'youth-forum-switzerland', title: 'Youth Forum Switzerland', org: 'Youth Forum Switzerland',
    type: 'Civic programme', categories: ['leadership'], skills: ['Public speaking', 'Communication', 'Leadership'],
    ...L('Zug', 'ZG'), minAge: 13, maxAge: 19,
    description: 'A youth forum to debate issues, exchange ideas and get involved in youth initiatives.',
    timing: 'Next event noted for 15 January 2027', url: 'https://www.youthforumswitzerland.ch/faq',
  }),

  // ================================================== Volunteering
  P({
    id: 'croix-rouge-jeunesse-ge', title: 'Croix-Rouge Jeunesse Genève', org: 'Geneva Red Cross',
    type: 'Volunteering', categories: ['volunteering', 'health'], skills: ['Teamwork', 'Communication'],
    ...L('Geneva', 'GE'), minAge: 16, maxAge: 30,
    description: 'Volunteer with young people at the Geneva Red Cross on social and community projects.',
    url: 'https://www.croix-rouge-ge.ch/activites/jeunes/croix-rouge-jeunesse',
  }),
  P({
    id: 'sci-volunteer-camps', title: 'SCI Switzerland volunteer camps', org: 'Service Civil International (SCI) Switzerland',
    type: 'Volunteering', categories: ['volunteering', 'environment'], skills: ['Teamwork', 'Languages'],
    minAge: 16, maxAge: 30, eligibility: 'Often 16+ or 18+ depending on the camp.',
    description: 'Short volunteer work camps in Switzerland and abroad on community and environmental projects.',
    url: 'https://scich.org/en/volunteer-opportunities/',
  }),
  P({
    id: 'fifdh-volunteering', title: 'Volunteer at the FIFDH film festival', org: 'International Film Festival and Forum on Human Rights (FIFDH)',
    type: 'Volunteering', categories: ['volunteering', 'arts'], skills: ['Teamwork', 'Communication'],
    ...L('Geneva', 'GE'), minAge: 16, maxAge: 30, eligibility: 'Check the minimum age for each role.',
    description: 'Help run Geneva’s human-rights film festival — welcoming guests, events and screenings.',
    timing: 'Annual festival (spring)', url: 'https://fifdh.org/en/emplois-benevoles/',
  }),
];
