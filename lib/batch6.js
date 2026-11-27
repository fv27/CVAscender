// ---------------------------------------------------------------------------
// Batch 6 (added 8 Nov 2026): business, money and civic list from the team.
//
//  verified: true  → checked on the web on the date in `source`.
//  verified: false → real organiser, details NOT checked ("Not checked yet").
//
// Youth bank accounts are financial products, not programmes. They are listed
// neutrally (type "Youth bank account"), CVAscender is not paid by any bank and
// does not recommend one, and they never count towards the CV.
//
// Left out on purpose (see README): ETH summer/winter schools (for university
// students), Iconomix (a teaching resource for teachers, not students), Zurich
// Innovation Championship (a programme for startups, no youth edition found),
// Swiss Crypto Academy youth seminars, SwissFinTechLadies "NextGen", Startup
// Campus youth programmes, "Lemanic Business Camp" (could not be found).
// ---------------------------------------------------------------------------

const P = (o) => ({
  scope: 'national', format: 'in-person', city: null, canton: null,
  minAge: 14, maxAge: 19, cost: 'See the website', commitment: 'Varies',
  timing: 'See the website for current dates',
  eligibility: 'See the website for current eligibility.',
  verified: false, source: 'Team-supplied list (Nov 2026) — not independently checked',
  ...o,
});

const BANK_NOTE = 'This is a bank product, not a programme. CVAscender is not paid by any bank and does not recommend one — compare fees and limits (e.g. on moneyland.ch) and talk to a parent before opening an account.';
const bank = (o) => P({
  type: 'Youth bank account', categories: ['business'], skills: ['Project management'],
  commitment: 'Ongoing', cost: o.cost || 'Usually free for young people — check fees',
  timing: 'Open any time', details: BANK_NOTE, ...o,
});

export const BATCH6 = [
  // ============================================================ Entrepreneurship
  P({
    id: 'entrepreneurskills', title: 'EntrepreneurSkills — Swiss championship in entrepreneurship', org: 'IG EntrepreneurSkills (at SwissSkills)',
    type: 'Entrepreneurship programme', categories: ['business', 'leadership'], skills: ['Entrepreneurship', 'Teamwork', 'Public speaking'],
    minAge: 15, maxAge: 23,
    eligibility: 'Young people in vocational education and training (apprentices) up to age 23, in teams of two or three.',
    description: 'Compete as a team in entrepreneurship: regional selection days in spring, then a multi-day final at SwissSkills in Bern.',
    details: 'Teams develop a business concept under time pressure in front of a jury. The best teams can go on to EuroSkills.',
    timing: 'Regional selection days usually in March', commitment: 'Selection day + final', cost: 'Free',
    url: 'https://www.entrepreneurskills.ch/', verified: true, source: 'BFH event page & organisator.ch reports on EntrepreneurSkills, checked Nov 2026',
  }),
  P({
    id: 'myidea-challenge', title: 'myidea Challenge', org: 'Schweizerisches Zentrum für unternehmerisches Denken und Handeln',
    type: 'Entrepreneurship programme', categories: ['business'], skills: ['Entrepreneurship', 'Creativity', 'Public speaking'],
    minAge: 15, maxAge: 22,
    eligibility: 'Apprentices at vocational schools across Switzerland with a business idea.',
    description: 'A national ideas competition for apprentices: develop a business idea and pitch it to an expert jury at a live final.',
    timing: 'Registration for the spring 2027 challenge is open', commitment: 'A few weeks + final', cost: 'Free',
    url: 'https://www.myidea.ch/prochain-concours', verified: true, source: 'efvet.org, zh.ch Schulblatt & organiser posts, checked Nov 2026',
  }),
  P({
    id: 'swiss-startup-association-youth', title: 'Swiss Startup Association — youth', org: 'Swiss Startup Association',
    type: 'Entrepreneurship programme', categories: ['business'], skills: ['Entrepreneurship'],
    description: 'Youth activities from Switzerland’s national startup association — a way into the startup scene.',
    url: 'https://swissstartupassociation.ch/topics/youth/',
  }),
  P({
    id: 'yes-fit-for-life', title: 'YES Fit for Life', org: 'Young Enterprise Switzerland (YES)',
    type: 'Entrepreneurship programme', categories: ['business'], skills: ['Communication', 'Project management'],
    description: 'A YES programme on everyday money and life skills for school classes.',
    eligibility: 'Usually done with a school class — ask your teacher.', url: 'https://yes.swiss/',
  }),
  P({
    id: 'sef-nextgen', title: 'SEF.NextGen', org: 'Swiss Economic Forum (SEF)',
    type: 'Entrepreneurship programme', categories: ['business', 'leadership'], skills: ['Entrepreneurship', 'Communication'],
    minAge: 16, maxAge: 25,
    eligibility: 'Young people, students and apprentices in Switzerland — check the current age rules.',
    description: 'Camps for young people with an entrepreneurial spirit: meet people from the Swiss economy, work on challenges and share your ideas.',
    timing: 'Two camps a year', url: 'https://www.swisseconomic.ch/', verified: true, source: 'Swiss Post sponsoring page (SEF.NextGen), checked Nov 2026',
  }),
  P({
    id: 'youngpreneurs', title: 'Youngpreneurs', org: 'Youngpreneurs (Impact Hub network)',
    type: 'Entrepreneurship programme', categories: ['business'], skills: ['Entrepreneurship', 'Teamwork'],
    eligibility: 'Students at vocational schools and academic high schools.',
    description: 'A programme that helps school students turn ideas into real projects and ventures.',
    searchUrl: 'https://duckduckgo.com/?q=' + encodeURIComponent('Youngpreneurs Schweiz Programm'),
  }),

  // ============================================================ Leadership & debate
  P({
    id: 'champittet-leadership-camp', title: 'Champittet Leadership Camp', org: 'Collège Champittet (Nord Anglia Education)',
    type: 'Summer programme', categories: ['leadership', 'business', 'sports'], skills: ['Leadership', 'Teamwork', 'Communication'],
    scope: 'local', city: 'Pully', canton: 'VD', minAge: 10, maxAge: 17,
    eligibility: 'Ages 10–17 from any school: Juniors 10–12, Teens 13–14, Seniors 15–17.',
    description: 'Two-week English-language summer camp near Lausanne mixing leadership workshops with outdoor adventures in the Alps and on the lake.',
    details: 'Workshops are run with partners such as IMD, EHL and the IOC. 2026 fees were about CHF 6,700 residential and CHF 3,500 day camp.',
    timing: '2027: 5–18 July or 19 July – 1 August', commitment: 'Two weeks (residential or day)', cost: 'Paid — about CHF 3,500–6,700',
    url: 'https://www.nordangliaeducation.com/champittet/news/inside-the-champittet-leadership-camp-experience', verified: true, source: 'Collège Champittet news (30 Oct 2026) & 2026 flyer, checked Nov 2026',
  }),
  P({
    id: 'zumun', title: 'ZuMUN — Zurich Model United Nations', org: 'ETH MUN & UZH MUN',
    type: 'Civic programme', categories: ['leadership'], skills: ['Public speaking', 'Communication', 'Research'],
    scope: 'local', city: 'Zurich', canton: 'ZH', minAge: 15, maxAge: 19,
    eligibility: 'High-school students (high-school committees) and university students. Held in English.',
    description: 'Debate world issues as a UN delegate for a weekend — ZuMUN has committees just for high-school students, including ECOSOC.',
    timing: 'Every April (2026: 17–19 April)', commitment: 'A weekend + preparation', cost: 'Registration fee',
    url: 'https://zumun.ch/', verified: true, source: 'zumun.ch & MyMUN conference pages, checked Nov 2026',
  }),
  P({
    id: 'geneva-mun', title: 'Model UN conferences in Geneva', org: 'Various organisers (e.g. WFUNA WIMUN, GIMUN)',
    type: 'Civic programme', categories: ['leadership'], skills: ['Public speaking', 'Communication'],
    scope: 'local', city: 'Geneva', canton: 'GE', minAge: 15, maxAge: 19,
    eligibility: 'Check each conference — several have school-student committees.',
    description: 'Model UN in the city of the UN: several conferences in Geneva welcome high-school delegates.',
    searchUrl: 'https://duckduckgo.com/?q=' + encodeURIComponent('Model United Nations Geneva high school 2027'),
  }),
  P({
    id: 'hsg-public-lectures', title: 'HSG public lectures', org: 'University of St. Gallen (HSG)',
    type: 'University programme', categories: ['academic', 'business'], skills: ['Research'],
    scope: 'local', city: 'St. Gallen', canton: 'SG', minAge: 15, maxAge: 99,
    description: 'Free evening lectures at the University of St. Gallen that anyone can attend — business, law, economics and more.',
    searchUrl: 'https://duckduckgo.com/?q=' + encodeURIComponent('HSG Öffentliche Vorlesungen'),
  }),

  // ============================================================ Careers
  P({
    id: 'commercial-apprenticeship', title: 'Commercial apprenticeship (KV / apprentissage de commerce)', org: 'Swiss VET system — employers across Switzerland',
    type: 'Internship', categories: ['business'], skills: ['Communication', 'Project management', 'Languages'],
    minAge: 15, maxAge: 20,
    eligibility: 'Usually after compulsory school (around age 15–16). Companies recruit about a year ahead.',
    description: 'Learn business on the job: a 3-year apprenticeship (Kauffrau/Kaufmann EFZ, employé·e de commerce CFC) combining work in a company with vocational school.',
    timing: 'Apply in the year before you start — taster days (Schnupperlehre / stages) first', commitment: '3 years', cost: 'Paid apprentice wage',
    searchUrl: 'https://duckduckgo.com/?q=' + encodeURIComponent('Kauffrau Kaufmann EFZ berufsberatung.ch'),
  }),

  // ============================================================ Youth bank accounts
  bank({
    id: 'yuh-14', title: 'Yuh 14+ teen account', org: 'Yuh (Swissquote)',
    format: 'online', minAge: 14, maxAge: 17,
    eligibility: 'Ages 14–17 living in Switzerland. You can open it yourself — no parental consent needed.',
    description: 'A free mobile account with a debit card, TWINT and no overdraft. Investing is switched off until 18; it becomes a normal Yuh account then.',
    cost: 'No account fee', url: 'https://www.yuh.com/en/app/teen-account/', verified: true, source: 'yuh.com teen account page, checked Nov 2026',
  }),
  bank({
    id: 'neon-youth', title: 'neon account (from 15)', org: 'neon',
    format: 'online', minAge: 15, maxAge: 25,
    eligibility: 'From age 15, with a parent’s agreement until 18.',
    description: 'A free Swiss mobile account with a debit card. neon green also plants trees for each customer.',
    cost: 'No account fee', url: 'https://www.neon-free.ch/', verified: true, source: 'neo-banques.ch & moneyland.ch, checked Nov 2026',
  }),
  bank({
    id: 'zak-cler-youth', title: 'Zak by Bank Cler (from 15)', org: 'Bank Cler',
    format: 'online', minAge: 15, maxAge: 25,
    eligibility: 'From age 15, under parental control until 18.',
    description: 'Bank Cler’s mobile banking app with a free debit card — Bank Cler’s youth offer.',
    url: 'https://www.cler.ch/', verified: true, source: 'neo-banques.ch youth account comparison, checked Nov 2026',
  }),
  bank({
    id: 'raiffeisen-youngmemberplus', title: 'Raiffeisen YoungMemberPlus', org: 'Raiffeisen',
    minAge: 10, maxAge: 26,
    eligibility: 'Ages 10 to 26 (students up to 30).',
    description: 'Youth banking package: private and savings account, debit card, TWINT — plus extras like cheaper concert tickets and 50% off the Halbtax.',
    url: 'https://www.raiffeisen.ch/youngmemberplus', verified: true, source: 'raiffeisen.ch account pages, checked Nov 2026',
  }),
  bank({
    id: 'ubs-young', title: 'UBS account for young people', org: 'UBS',
    minAge: 12, maxAge: 26,
    eligibility: 'Young people and students. Note: UBS key4 smart investing is only from age 18.',
    description: 'Youth account and savings account with a debit card. UBS key4 smart investing (funds from CHF 50) opens at 18, with reduced fees under 26.',
    url: 'https://www.ubs.com/ch/en/services/accounts-and-cards/young/youth-and-students-account.html', verified: true, source: 'ubs.com youth pages & key4 FAQ (minimum age 18), checked Nov 2026',
  }),
  bank({
    id: 'postfinance-youth', title: 'PostFinance youth account', org: 'PostFinance',
    minAge: 12, maxAge: 26, description: 'PostFinance’s account for young people, with a debit card and app.',
    url: 'https://www.postfinance.ch/',
  }),
  bank({
    id: 'migros-bank-youth', title: 'Migros Bank youth account', org: 'Migros Bank',
    minAge: 12, maxAge: 25, description: 'Youth account with the “Free 25” perks (Migros Group discounts up to age 25).',
    url: 'https://www.migrosbank.ch/',
  }),
  bank({
    id: 'cantonal-bank-youth', title: 'Cantonal bank youth accounts (ZKB, BCV, BCGE…)', org: 'Your cantonal bank',
    minAge: 12, maxAge: 26,
    eligibility: 'Every cantonal bank has one — age limits differ (often about 12–26).',
    description: 'Youth accounts from your canton’s bank, often with free cards and youth perks (e.g. BCGE’s account for ages 12–25).',
    searchUrl: 'https://duckduckgo.com/?q=' + encodeURIComponent('moneyland youth account comparison'), verified: true, source: 'moneyland.ch youth account pages, checked Nov 2026',
  }),
];
