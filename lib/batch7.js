// ---------------------------------------------------------------------------
// Batch 7 (added 8 Nov 2026): tech camps and volunteering (mostly Geneva and
// Vaud) from the team's list, plus similar ones found on the web.
//
//  verified: true  → checked on the web on the date in `source`.
//  verified: false → real organiser, details NOT checked ("Not checked yet").
// ---------------------------------------------------------------------------

const P = (o) => ({
  scope: 'local', format: 'in-person', minAge: 14, maxAge: 19,
  cost: 'See the website', commitment: 'Varies',
  timing: 'See the website for current dates',
  eligibility: 'See the website for current eligibility.',
  verified: false, source: 'Team-supplied list (Nov 2026) — not independently checked',
  ...o,
});
const GE = { city: 'Geneva', canton: 'GE' };
const LS = { city: 'Lausanne', canton: 'VD' };
const VOL = { type: 'Volunteering', categories: ['volunteering'], skills: ['Teamwork', 'Communication'], cost: 'Free' };
const search = (q) => 'https://duckduckgo.com/?q=' + encodeURIComponent(q);

export const BATCH7 = [
  // ============================================================ Tech camps
  P({
    id: 'village-camps-stem-leysin', title: 'Village Camps STEM & Robotics camp — Leysin', org: 'Village Camps',
    type: 'Summer programme', categories: ['technology', 'science'], skills: ['Coding', 'Problem solving', 'Teamwork'],
    city: 'Leysin', canton: 'VD', minAge: 10, maxAge: 17,
    eligibility: 'Ages 10–17.',
    description: 'A residential summer camp in the Alps mixing robotics, coding and science projects with outdoor activities.',
    timing: 'Summer sessions', commitment: 'One or more weeks, residential', cost: 'Paid camp (expensive) — see the website',
    url: 'https://www.villagecamps.com/STEM-robotics-summer-school-camp-in-leysin-switzerland', verified: true, source: 'villagecamps.com, checked Nov 2026',
  }),
  P({
    id: 'jfk-swiss-outdoor-camp', title: 'Swiss Outdoor Camp', org: 'John F. Kennedy International School (Saanen)',
    type: 'Summer programme', categories: ['sports', 'environment'], skills: ['Teamwork', 'Leadership'],
    city: 'Saanen', canton: 'BE', minAge: 10, maxAge: 14,
    eligibility: 'Children and young teens (about ages 6–14) — check which camp includes tech activities.',
    description: 'A summer camp in the Bernese Oberland with outdoor adventure and hands-on learning.',
    cost: 'Paid camp — see the website', searchUrl: search('JFK Swiss Outdoor Camp Saanen'),
  }),
  P({
    id: 'logiscool', title: 'Logiscool coding courses', org: 'Logiscool Switzerland',
    type: 'Online course', categories: ['technology'], skills: ['Coding', 'Creativity'],
    scope: 'national', minAge: 8, maxAge: 16,
    description: 'After-school coding courses and holiday camps — from games to Python and web development.',
    cost: 'Paid — see the website', searchUrl: search('Logiscool Schweiz Suisse coding courses'),
  }),
  P({
    id: 'techlabs-flight-camps', title: 'TechLabs flight & RC aviation camps', org: 'TechLabs',
    type: 'Summer programme', categories: ['technology', 'science'], skills: ['Problem solving', 'Teamwork'],
    city: null, canton: 'AR', minAge: 10, maxAge: 17,
    description: 'Camps where you build and fly model aircraft and learn how flight works.',
    cost: 'Paid camp — see the website', searchUrl: search('TechLabs flight camp Switzerland'),
  }),

  // ============================================================ Volunteering — Geneva
  P({
    ...VOL, ...GE, id: 'escalade-benevoles', title: 'Volunteer at the Course de l’Escalade',
    org: 'Association Course de l’Escalade',
    description: 'Help run Geneva’s biggest running event in the Old Town — about 1,700 people volunteered last year.',
    details: 'The 48th Course de l’Escalade takes place on 5–6 December 2026 (Parc des Bastions). Check the minimum age for each volunteer role when you sign up.',
    timing: '5–6 December 2026', commitment: 'A shift over the race weekend',
    url: 'https://benevoles.escalade.ch/index', verified: true, source: 'Radio Lac & geneve.com (2026 edition), checked Nov 2026',
  }),
  P({
    ...VOL, ...GE, id: 'geneva-marathon-volunteers', title: 'Volunteer at the Generali Genève Marathon',
    org: 'Generali Genève Marathon',
    description: 'Join a team of more than 1,200 volunteers at Switzerland’s biggest marathon — water stations, finish line, bib pick-up and more.',
    timing: '8–9 May 2027', commitment: 'A shift over the race weekend',
    url: 'https://generaligenevemarathon.com/en/', verified: true, source: 'generaligenevemarathon.com & 2025 press kit, checked Nov 2026',
  }),
  P({
    ...VOL, ...GE, id: 'croix-rouge-paniers-noel', title: 'Red Cross Christmas Baskets (Paniers de Noël)',
    org: 'Croix-Rouge genevoise', categories: ['volunteering', 'health'],
    description: 'Help prepare and hand out about 2,500 Christmas baskets — with toys for 4,500 children — for families in need in Geneva.',
    details: 'An annual operation with around 90 partners; distribution usually takes place in mid-December. Check how young volunteers can help.',
    timing: 'Collection in November–December, distribution mid-December 2026', commitment: 'One or more shifts',
    url: 'https://www.croix-rouge-ge.ch/', verified: true, source: 'Radio Lac reports on the Paniers de Noël operation, checked Nov 2026',
  }),
  P({
    ...VOL, ...GE, id: 'bioparc-volunteering', title: 'Volunteer at Bioparc Genève', org: 'Bioparc Genève',
    categories: ['volunteering', 'environment'], skills: ['Teamwork'], city: 'Bellevue',
    description: 'Help at Geneva’s animal park — preparing enclosures for winter, building paths and supporting the team that cares for 600+ animals.',
    timing: 'Volunteer days through the year', commitment: 'Half days',
    url: 'https://bioparc-geneve.ch/', verified: true, source: 'World Radio Switzerland feature & Bioparc information, checked Nov 2026',
  }),
  P({
    ...VOL, ...GE, id: 'summit-children-armed-conflict', title: 'Summit on Children in Armed Conflict — volunteer team',
    org: 'Organiser to confirm', categories: ['volunteering', 'leadership'], skills: ['Communication', 'Teamwork'],
    description: 'Help run a summit in Geneva about protecting children affected by armed conflict.',
    searchUrl: search('Summit on Children in Armed Conflict Geneva volunteer'),
  }),
  P({
    ...VOL, ...GE, id: 'iiat-accessible-tech', title: 'IIAT accessible-technology service project', org: 'IIAT',
    categories: ['volunteering', 'technology'], skills: ['Coding', 'Design', 'Teamwork'],
    description: 'A service project that uses technology to make everyday things more accessible for people with disabilities.',
    url: 'https://www.accessible-tech.ch/',
  }),
  P({
    ...VOL, ...GE, id: 'parlement-jeunes-genevois', title: 'Parlement des Jeunes Genevois', org: 'Parlement des Jeunes Genevois (PJG)',
    type: 'Civic programme', categories: ['leadership', 'volunteering'], skills: ['Public speaking', 'Leadership'],
    minAge: 15, maxAge: 25,
    eligibility: 'Young people aged 15–25 living in the canton of Geneva.',
    description: 'A youth parliament that speaks to the city and canton on issues affecting young people — and runs its own projects.',
    timing: 'Ongoing', url: 'https://www.geneve.ch/public/jeunes/engager-societe', verified: true, source: 'Ville de Genève “S’engager en tant que jeune”, checked Nov 2026',
  }),
  P({
    ...GE, id: 'sln-geneva', title: 'Société des Nations des Étudiants (SLN)', org: 'Students’ League of Nations',
    type: 'Civic programme', categories: ['leadership', 'academic'], skills: ['Public speaking', 'Communication', 'Languages'],
    minAge: 16, maxAge: 20,
    eligibility: 'Students aged 16–20 from schools around the world.',
    description: 'A realistic simulation of the UN General Assembly, with an annual conference at the Palais des Nations.',
    timing: 'Annual conference', url: 'https://www.geneve.ch/public/jeunes/engager-societe', verified: true, source: 'Ville de Genève “S’engager en tant que jeune”, checked Nov 2026',
  }),
  P({
    ...VOL, ...GE, id: 'geneve-benevolat', title: 'Genève Bénévolat — find a volunteer role', org: 'Genève Bénévolat & Centre genevois du volontariat',
    description: 'Geneva’s volunteering platforms: browse roles in social, cultural and community organisations.',
    timing: 'Ongoing listings', url: 'https://www.geneve.ch/public/jeunes/engager-societe', verified: true, source: 'Ville de Genève “S’engager en tant que jeune”, checked Nov 2026',
  }),

  // ============================================================ Volunteering — Vaud
  P({
    ...VOL, ...LS, id: 'festivelo-volunteers', title: 'Festivélo Lausanne — volunteer team', org: 'Association romande du voyage à vélo',
    description: 'Help at the French-speaking festival of travel by bike — films, talks and stands.',
    timing: 'Early November each year', commitment: 'A shift over the festival weekend',
    searchUrl: search('Festivélo Lausanne bénévoles'),
  }),
  P({
    ...VOL, ...LS, id: 'volontaires-sportifs-lausannois', title: 'Volontaires Sportifs Lausannois', org: 'City of Lausanne — Sports department',
    categories: ['volunteering', 'sports'],
    eligibility: 'Residents of Switzerland and neighbouring France — check the minimum age.',
    description: 'One sign-up to volunteer at Lausanne’s big sports events: the Lausanne Marathon, the 20km de Lausanne, Athletissima, the triathlon and more.',
    timing: 'Events all year', commitment: 'Choose the events you want',
    url: 'https://www.lausanne.ch/en/vie-pratique/sport-pour-tous/manifestations-sportives.html', verified: true, source: 'lausanne.ch sports events page, checked Nov 2026',
  }),
  P({
    ...VOL, ...LS, id: 'festival-de-la-cite-staff', title: 'Volunteer at Festival de la Cité Lausanne', org: 'Festival de la Cité',
    categories: ['volunteering', 'arts'], minAge: 16, maxAge: 30,
    eligibility: 'From 16 (parental permission needed until 18). Available at least 3 days.',
    description: 'Join the volunteer staff of Lausanne’s free arts festival — bars, welcome, logistics — and see how a festival runs from the inside.',
    timing: 'Summer (July)', commitment: 'At least 3 days',
    url: 'https://festivalcite.ch/', verified: true, source: 'Festival de la Cité staff dossier 2024, checked Nov 2026',
  }),
  P({
    ...VOL, id: 'polymanga-staff', title: 'PolyStaff — volunteer at Polymanga', org: 'Polymanga',
    categories: ['volunteering', 'arts'], city: 'Montreux', canton: 'VD', minAge: 16, maxAge: 30,
    eligibility: 'From 16 with parental permission and an ID copy; some roles are 18+.',
    description: 'Volunteer at Switzerland’s biggest pop-culture, manga and gaming convention.',
    timing: 'Spring (Easter weekend)', commitment: 'Several days',
    url: 'https://www.polymanga.com/', verified: true, source: 'Polymanga PolyStaff FAQ, checked Nov 2026',
  }),
  P({
    ...VOL, id: 'paleo-volunteers', title: 'Volunteer at Paléo Festival Nyon', org: 'Paléo Festival Nyon',
    categories: ['volunteering', 'arts'], city: 'Nyon', canton: 'VD', minAge: 18, maxAge: 30,
    eligibility: '18 or older and able to understand French.',
    description: 'Join about 5,400 volunteers at one of Europe’s biggest open-air music festivals.',
    timing: 'Applications open around late April · festival in July', commitment: 'At least 5–6 hours a day',
    url: 'https://yeah.paleo.ch/fr/benevoles', verified: true, source: 'Paléo volunteer FAQ 2026, checked Nov 2026',
  }),
  P({
    ...VOL, ...LS, id: 'chuv-christmas-decorations', title: 'Decorate the CHUV children’s hospital for Christmas', org: 'Love Therapy Zero with CHUV paediatrics',
    categories: ['volunteering', 'arts', 'health'], skills: ['Creativity', 'Teamwork'],
    eligibility: 'Check the minimum age with the association.',
    description: 'Help make, put up and take down Christmas decorations at Lausanne’s children’s hospital.',
    timing: '10 Nov – 6 Dec 2026, and 10–31 Jan 2027', commitment: 'A few sessions',
    url: 'https://www.chuv.ch/', verified: true, source: 'CHUV news item (25 Aug 2026), checked Nov 2026',
  }),
  P({
    ...VOL, scope: 'national', city: null, canton: null, id: 'croix-rouge-2x-noel', title: '“2x Christmas” — sort donations for people in need',
    org: 'Swiss Red Cross (with Coop, Swiss Post and SRG SSR)',
    description: 'After Christmas, volunteers sort and pack tens of thousands of donated parcels for people in need in Switzerland and Eastern Europe.',
    timing: 'Donations 24 Dec – mid-January · sorting from February', commitment: 'One or more shifts',
    url: 'https://www.redcross.ch/', verified: true, source: 'Swiss Red Cross reports on 2x Noël, checked Nov 2026',
  }),
];
