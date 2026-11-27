// ---------------------------------------------------------------------------
// Batch 11 (11 Nov 2026): global competitions (World Scholar's Cup and co.),
// international olympiads, online research, essays & writing prizes, many more
// money & financial-literacy listings, and Swiss volunteering.
//
// HONESTY: these are real, long-running programmes and organisations, written
// from existing knowledge. This session could NOT open their websites, so every
// listing is `verified: false` ("Not checked yet"): dates, ages and costs must
// be confirmed on the official site. Nothing here states a deadline. Where we
// were unsure of an exact web address we link to a search instead.
//
// Money listings stay neutral (see CLAUDE.md): they describe what exists and
// never recommend one bank over another.
// ---------------------------------------------------------------------------

const search = (q) => 'https://duckduckgo.com/?q=' + encodeURIComponent(q);
const SRC = 'Well-known programme — details not checked in this session (Nov 2026)';

// Global / online by default.
const G = (o) => ({
  scope: 'global', format: 'online', city: null, canton: null,
  minAge: 13, maxAge: 18, cost: 'See the website', commitment: 'Varies',
  timing: 'See the website for current dates',
  eligibility: 'See the website for current eligibility.',
  verified: false, source: SRC,
  ...o,
});
// Swiss national, in person by default.
const CH = (o) => G({ scope: 'national', format: 'in-person', ...o });

// International olympiads: Swiss students qualify through the Swiss olympiad.
const OLY = (id, title, swiss, cats, skills, extra = {}) => CH({
  id, title, country: 'CH', org: `${title.split(' (')[0]} — Swiss team via ${swiss}`,
  type: 'Academic competition', categories: cats, skills, scope: 'global', format: 'in-person',
  minAge: 14, maxAge: 20,
  eligibility: `Selected through ${swiss}: do well in the Swiss rounds to be picked for the national team.`,
  description: `The international final of the subject olympiad. Switzerland sends a small national team chosen through ${swiss}.`,
  details: 'Start with the first round of the Swiss olympiad (usually in autumn). The best students go to training camps and selection rounds before the international event.',
  timing: 'Swiss rounds usually start in autumn; the international olympiad is usually in summer',
  commitment: 'Several selection rounds and camps', cost: 'Usually free for selected team members',
  searchUrl: search(`${title} Switzerland team`),
  ...extra,
});

const MONEY_NOTE = 'CVAscender does not recommend any bank. Compare fees, age limits and conditions (e.g. on a comparison site) and talk to a parent before opening an account.';
const bank = (id, name, canton, url, extra = {}) => G({
  id, title: `${name} — youth account`, org: name,
  type: 'Youth bank account', categories: ['business'], skills: ['Project management'],
  scope: canton ? 'local' : 'national', format: 'in-person', city: null, canton: canton || null,
  minAge: 12, maxAge: 25,
  eligibility: 'Young people — age limits and conditions differ between banks; check with the bank.',
  description: `${name} offers accounts for young people, usually with a debit card and app. Conditions vary — compare before choosing.`,
  details: MONEY_NOTE, timing: 'Open any time', commitment: 'Ongoing', cost: 'Often free for young people — check fees',
  ...(url ? { url } : { searchUrl: search(`${name} Jugendkonto compte jeunesse`) }),
  ...extra,
});
// Financial-literacy listings show under "Money & banking" via `group`.
const LIT = (o) => G({ group: 'money', categories: ['business'], skills: ['Data analysis', 'Problem solving'], cost: 'Free', ...o });

const vol = (o) => CH({
  type: 'Volunteering', categories: ['volunteering'], skills: ['Teamwork', 'Communication'],
  minAge: 16, cost: 'Free', commitment: 'One or more shifts',
  eligibility: 'Minimum ages differ (often 16 or 18) — check with the organiser.',
  ...o,
});
const eventVol = (id, event, city, canton, q, cats = ['volunteering', 'sports']) => vol({
  id, title: `Volunteer at ${event}`, org: event, scope: 'local', city, canton, categories: cats,
  description: `${event} relies on volunteers for things like welcoming visitors, logistics and info stands. A good first volunteering line for your CV.`,
  details: 'Volunteer sign-up usually opens a few months before the event. Some roles are only for adults — check the minimum age.',
  timing: 'Sign-up usually opens a few months before the event',
  searchUrl: search(q),
});

export const BATCH11 = [
  // ======================================================== Global competitions
  G({
    id: 'world-scholars-cup', title: 'World Scholar’s Cup', org: 'World Scholar’s Cup',
    type: 'Academic competition', categories: ['academic', 'leadership'], skills: ['Public speaking', 'Teamwork', 'Writing', 'Research'],
    format: 'hybrid', minAge: 10, maxAge: 19,
    eligibility: 'Teams of three students, usually entered through a school; junior and senior divisions.',
    description: 'A global team competition built around a yearly theme: team debate, collaborative writing, a quiz bowl and a challenge exam. Regional rounds lead to Global Rounds and the Tournament of Champions at Yale.',
    url: 'https://www.scholarscup.org', cost: 'Registration and travel fees',
  }),
  G({
    id: 'ihbb-europe', title: 'International History Bee and Bowl', org: 'International Academic Competitions',
    type: 'Academic competition', categories: ['academic'], skills: ['Research', 'Problem solving'], format: 'hybrid', minAge: 10, maxAge: 19,
    description: 'Buzzer-style history quiz competitions for individuals (Bee) and school teams (Bowl), with regional rounds, online events and European and international championships.',
    url: 'https://www.ihbb.org',
  }),
  G({
    id: 'international-geography-bee', title: 'International Geography Bee', org: 'International Academic Competitions',
    type: 'Academic competition', categories: ['academic', 'environment'], skills: ['Research', 'Problem solving'], format: 'hybrid', minAge: 10, maxAge: 19,
    description: 'A buzzer-style geography competition for school students, with regional and online rounds leading to international championships.',
    searchUrl: search('International Geography Bee International Academic Competitions'),
  }),
  G({
    id: 'swift-student-challenge', title: 'Apple Swift Student Challenge', org: 'Apple',
    type: 'Academic competition', categories: ['technology'], skills: ['Coding', 'Design', 'Creativity'], minAge: 13, maxAge: 25,
    description: 'Build an interactive app playground in Swift on any topic. Winners are recognised by Apple, and some are invited to Apple’s developer conference (WWDC).',
    details: 'Age rules depend on your country (often 13+ or older) — read the official eligibility page.',
    url: 'https://developer.apple.com/swift-student-challenge/',
  }),
  G({
    id: 'hack-club', title: 'Hack Club: build, ship and get rewarded', org: 'Hack Club',
    type: 'Hackathon', categories: ['technology'], skills: ['Coding', 'Project management', 'Creativity'], minAge: 13, maxAge: 18,
    description: 'A global non-profit community of teenagers who code. It runs online challenges where you build a project and receive hardware or grants, and helps students start a coding club at school.',
    url: 'https://hackclub.com',
  }),
  G({
    id: 'codeforces', title: 'Codeforces competitive programming rounds', org: 'Codeforces',
    type: 'Academic competition', categories: ['technology', 'academic'], skills: ['Coding', 'Problem solving'], minAge: 12, maxAge: 25,
    description: 'Free online programming contests several times a week, with a rating that shows your progress. Popular training for the Swiss Informatics Olympiad.',
    timing: 'Contests every week', url: 'https://codeforces.com', cost: 'Free',
  }),
  G({
    id: 'online-physics-olympiad', title: 'Online Physics Olympiad (OPhO)', org: 'Online Physics Olympiad',
    type: 'Academic competition', categories: ['science', 'academic'], skills: ['Problem solving', 'Teamwork'], minAge: 13, maxAge: 19,
    description: 'A free, team-based online physics competition with an open round and an invitational round, written by former olympiad medallists.',
    searchUrl: search('Online Physics Olympiad OPhO'), cost: 'Free',
  }),
  G({
    id: 'physics-cup', title: 'Physics Cup (online olympiad problems)', org: 'Physics Cup (Jaan Kalda)',
    type: 'Academic competition', categories: ['science', 'academic'], skills: ['Problem solving', 'Research'], minAge: 14, maxAge: 19,
    description: 'A series of very hard, olympiad-level physics problems released online over the winter. Solve them at home — excellent preparation for the Physics Olympiad.',
    searchUrl: search('Physics Cup Jaan Kalda online physics olympiad'), cost: 'Free',
  }),
  G({
    id: 'iaac-astronomy', title: 'International Astronomy and Astrophysics Competition (IAAC)', org: 'IAAC',
    type: 'Academic competition', categories: ['science'], skills: ['Problem solving', 'Research'], minAge: 12, maxAge: 19,
    description: 'An online astronomy competition in three rounds, open to school students around the world.',
    searchUrl: search('International Astronomy and Astrophysics Competition IAAC'),
  }),
  G({
    id: 'cubes-in-space', title: 'Cubes in Space', org: 'idoodlelearning / Cubes in Space',
    type: 'Academic competition', categories: ['science', 'technology'], skills: ['Research', 'Problem solving', 'Teamwork'], minAge: 11, maxAge: 18,
    description: 'Design a small experiment that fits in a cube; selected experiments fly on a sounding rocket or high-altitude balloon.',
    searchUrl: search('Cubes in Space student experiment'),
  }),
  G({
    id: 'ocean-awareness-contest', title: 'Ocean Awareness Contest', org: 'Bow Seat Ocean Awareness Programs',
    type: 'Academic competition', categories: ['environment', 'arts'], skills: ['Creativity', 'Writing', 'Research'], minAge: 11, maxAge: 18,
    description: 'Make art, poetry, prose, film, music or a campaign about the ocean and climate. Open to young people worldwide, with cash prizes.',
    searchUrl: search('Bow Seat Ocean Awareness Contest'), cost: 'Free',
  }),
  G({
    id: 'genius-olympiad', title: 'GENIUS Olympiad', org: 'Terra Science and Education',
    type: 'Academic competition', categories: ['environment', 'science', 'arts'], skills: ['Research', 'Creativity', 'Communication'],
    format: 'hybrid', minAge: 13, maxAge: 19,
    description: 'An international high-school project fair about environmental issues, with categories in science, art, writing, music, film and business.',
    searchUrl: search('GENIUS Olympiad environment project competition'),
  }),
  CH({
    id: 'isef-via-sjf', country: 'CH', title: 'Regeneron ISEF — the world’s largest school science fair', org: 'Society for Science — Swiss places via Schweizer Jugend forscht',
    type: 'Academic competition', categories: ['science', 'technology'], skills: ['Research', 'Public speaking'], scope: 'global', minAge: 14, maxAge: 20,
    eligibility: 'Swiss students usually qualify by winning a special prize at the Schweizer Jugend forscht national competition.',
    description: 'The international science and engineering fair in the USA, with project presentations, judging and large prizes.',
    details: 'Your route in from Switzerland: enter a research project (often your Maturaarbeit) in the Schweizer Jugend forscht competition.',
    searchUrl: search('Schweizer Jugend forscht ISEF Sonderpreis'),
  }),
  CH({
    id: 'eucys-via-sjf', country: 'CH', title: 'EU Contest for Young Scientists (EUCYS)', org: 'European Commission — Swiss places via Schweizer Jugend forscht',
    type: 'Academic competition', categories: ['science', 'technology'], skills: ['Research', 'Public speaking'], scope: 'global', minAge: 14, maxAge: 20,
    eligibility: 'Swiss participants are usually chosen at the Schweizer Jugend forscht national competition.',
    description: 'Europe’s big competition for young scientists: present your research project to an international jury.',
    searchUrl: search('EUCYS Schweizer Jugend forscht'),
  }),
  CH({
    id: 'ja-gen-e', country: 'CH', title: 'JA Europe Gen-E — European Company of the Year', org: 'JA Europe — Swiss teams via YES',
    type: 'Entrepreneurship programme', categories: ['business', 'leadership'], skills: ['Entrepreneurship', 'Teamwork', 'Public speaking'],
    scope: 'global', minAge: 15, maxAge: 20,
    eligibility: 'Teams from the YES Company Programme that win in Switzerland represent the country.',
    description: 'The European final for student companies: the best mini-companies from each country pitch to judges and investors.',
    searchUrl: search('JA Europe Gen-E Company of the Year YES Switzerland'),
  }),
  G({
    id: 'thimun', title: 'THIMUN — The Hague International Model United Nations', org: 'THIMUN Foundation',
    type: 'Civic programme', categories: ['leadership'], skills: ['Public speaking', 'Research', 'Communication'], format: 'in-person', city: 'The Hague',
    minAge: 14, maxAge: 19,
    eligibility: 'Delegations are usually sent by schools.',
    description: 'One of the largest school Model UN conferences in the world. Represent a country, debate resolutions and practise diplomacy.',
    url: 'https://www.thimun.org', cost: 'Conference and travel fees',
  }),
  G({
    id: 'ippf-debate', title: 'International Public Policy Forum', org: 'IPPF',
    type: 'Academic competition', categories: ['leadership', 'academic'], skills: ['Writing', 'Public speaking', 'Research'], minAge: 14, maxAge: 19,
    description: 'A written-debate competition for school teams worldwide on a public-policy question; the best teams go on to live debate rounds.',
    searchUrl: search('International Public Policy Forum high school debate'),
  }),
  CH({
    id: 'eyp-switzerland', title: 'European Youth Parliament Switzerland', org: 'European Youth Parliament (Swiss national committee)',
    type: 'Civic programme', categories: ['leadership'], skills: ['Public speaking', 'Teamwork', 'Languages'], minAge: 15, maxAge: 22,
    description: 'Committee work and general assemblies where young people debate European and global issues in English — with sessions in Switzerland and abroad.',
    searchUrl: search('European Youth Parliament Switzerland EYP CH'),
  }),
  G({
    id: 'iasc-asteroid-search', title: 'Asteroid search campaigns (IASC)', org: 'International Astronomical Search Collaboration',
    type: 'Research week', categories: ['science'], skills: ['Research', 'Data analysis'], minAge: 12, maxAge: 19,
    eligibility: 'Teams (often a school class or club) with a teacher or leader.',
    description: 'Analyse real telescope images to find new asteroids. Discoveries can be officially credited — real research from home.',
    searchUrl: search('IASC International Astronomical Search Collaboration students asteroid'), cost: 'Free',
  }),

  // ======================================================= International olympiads
  OLY('imo', 'International Mathematical Olympiad (IMO)', 'the Swiss Mathematical Olympiad', ['academic', 'science'], ['Problem solving']),
  OLY('egmo', 'European Girls’ Mathematical Olympiad (EGMO)', 'the Swiss Mathematical Olympiad', ['academic', 'science'], ['Problem solving'],
    { eligibility: 'For girls; selected through the Swiss Mathematical Olympiad.' }),
  OLY('memo', 'Middle European Mathematical Olympiad (MEMO)', 'the Swiss Mathematical Olympiad', ['academic', 'science'], ['Problem solving', 'Teamwork']),
  OLY('ioi', 'International Olympiad in Informatics (IOI)', 'the Swiss Olympiad in Informatics', ['technology', 'academic'], ['Coding', 'Problem solving']),
  OLY('ipho', 'International Physics Olympiad (IPhO)', 'the Swiss Physics Olympiad', ['science', 'academic'], ['Problem solving', 'Research']),
  OLY('eupho', 'European Physics Olympiad (EuPhO)', 'the Swiss Physics Olympiad', ['science', 'academic'], ['Problem solving', 'Research']),
  OLY('icho', 'International Chemistry Olympiad (IChO)', 'the Swiss Chemistry Olympiad', ['science', 'academic'], ['Problem solving', 'Research']),
  OLY('ibo', 'International Biology Olympiad (IBO)', 'the Swiss Biology Olympiad', ['science', 'health'], ['Research', 'Problem solving']),
  OLY('igeo', 'International Geography Olympiad (iGeo)', 'the Swiss Geography Olympiad', ['environment', 'academic'], ['Research', 'Data analysis']),
  OLY('iol', 'International Linguistics Olympiad (IOL)', 'the Swiss Linguistics Olympiad', ['academic'], ['Languages', 'Problem solving']),
  OLY('ipo', 'International Philosophy Olympiad (IPO)', 'the Swiss Philosophy Olympiad', ['academic'], ['Writing', 'Problem solving']),
  OLY('ioaa', 'International Olympiad on Astronomy and Astrophysics (IOAA)', 'the Swiss Astronomy Olympiad', ['science'], ['Problem solving', 'Research']),
  OLY('ieo', 'International Economics Olympiad (IEO)', 'the Swiss Economics Olympiad', ['business', 'academic'], ['Problem solving', 'Entrepreneurship']),
  OLY('ioai', 'International Olympiad in Artificial Intelligence (IOAI)', 'the Swiss AI Olympiad', ['technology', 'science'], ['Coding', 'Data analysis']),
  CH({
    id: 'fsjm-math-games', title: 'Swiss Championship of Mathematical and Logic Games (FSJM)', org: 'Fédération Suisse des Jeux Mathématiques',
    type: 'Academic competition', categories: ['academic', 'science'], skills: ['Problem solving'], minAge: 9, maxAge: 99,
    description: 'Puzzle-style maths and logic problems in age categories, with qualifying rounds, a Swiss final and an international final.',
    searchUrl: search('FSJM championnat jeux mathématiques Suisse'), cost: 'Small fee',
  }),

  // ===================================================== Online research & science
  G({
    id: 'zooniverse', title: 'Zooniverse — do real research online', org: 'Zooniverse (Oxford and partners)',
    type: 'Research week', categories: ['science', 'environment'], skills: ['Research', 'Data analysis'], minAge: 13, maxAge: 99,
    description: 'Help scientists classify galaxies, count animals in camera-trap photos, read old weather logs and much more. Projects are run by real research teams.',
    details: 'Good for a CV if you contribute regularly and can explain what the project found. Some projects credit volunteers in papers.',
    url: 'https://www.zooniverse.org', cost: 'Free', commitment: 'Whenever you like',
  }),
  G({
    id: 'foldit', title: 'Foldit — protein-folding science game', org: 'Foldit (University of Washington and partners)',
    type: 'Research week', categories: ['science', 'health'], skills: ['Problem solving', 'Research'], minAge: 12, maxAge: 99,
    description: 'Solve protein-folding puzzles that help biochemists; player solutions have contributed to published research.',
    searchUrl: search('Foldit protein folding game'), cost: 'Free',
  }),
  G({
    id: 'igem-high-school', title: 'iGEM — synthetic biology team competition (high-school track)', org: 'iGEM Foundation',
    type: 'Academic competition', categories: ['science', 'health'], skills: ['Research', 'Teamwork', 'Project management'], format: 'hybrid', minAge: 14, maxAge: 19,
    eligibility: 'Teams with a supervisor (school, lab or club).',
    description: 'Design and build a synthetic-biology project over several months and present it at the Grand Jamboree in Paris.',
    url: 'https://igem.org', cost: 'Team registration and lab costs',
  }),
  G({
    id: 'ccir-research', title: 'Cambridge Centre for International Research — research programme', org: 'CCIR (private)',
    type: 'Mentoring programme', categories: ['academic', 'science'], skills: ['Research', 'Writing'], minAge: 14, maxAge: 18,
    description: 'Online research mentoring with university academics, ending in a research paper. A paid private programme, not run by the University of Cambridge.',
    searchUrl: search('Cambridge Centre for International Research CCIR research program'), cost: 'Paid — check the price and any financial aid',
  }),
  G({
    id: 'horizon-research', title: 'Horizon Academic Research Program', org: 'Horizon Academic (private)',
    type: 'Mentoring programme', categories: ['academic', 'science'], skills: ['Research', 'Writing'], minAge: 14, maxAge: 18,
    description: 'Small-group online research seminars with university instructors, ending in a research paper.',
    searchUrl: search('Horizon Academic Research Program high school'), cost: 'Paid — check the price and any financial aid',
  }),
  G({
    id: 'algoverse', title: 'Algoverse AI Research', org: 'Algoverse (private)',
    type: 'Mentoring programme', categories: ['technology', 'science'], skills: ['Coding', 'Research', 'Data analysis'], minAge: 14, maxAge: 22,
    description: 'Online machine-learning research projects in small teams with mentors, aiming at workshop or conference papers.',
    searchUrl: search('Algoverse AI research program high school'), cost: 'Paid — check the price and any financial aid',
  }),
  G({
    id: 'ladder-internships', title: 'Ladder Internships (remote start-up projects)', org: 'Ladder (private)',
    type: 'Internship', categories: ['business', 'technology'], skills: ['Project management', 'Entrepreneurship', 'Communication'], minAge: 15, maxAge: 19,
    description: 'Remote project-based internships with start-ups, with a coach. A paid programme — weigh the cost against free options.',
    searchUrl: search('Ladder Internships high school'), cost: 'Paid — check the price and any financial aid',
  }),
  G({
    id: 'tasp', group: 'university', title: 'Telluride Association Summer Seminar (TASP)', org: 'Telluride Association',
    type: 'Summer programme', categories: ['academic'], skills: ['Writing', 'Research', 'Communication'], format: 'in-person', city: 'USA',
    minAge: 15, maxAge: 18,
    description: 'A highly selective, free humanities and social-science seminar in the USA, with a demanding application essay.',
    searchUrl: search('Telluride Association Summer Seminar TASP international students'), cost: 'Free for admitted students (check travel)',
  }),
  G({
    id: 'garcia-summer', title: 'Garcia Summer Research Program (polymers & materials)', org: 'Stony Brook University',
    type: 'Summer programme', categories: ['science'], skills: ['Research'], format: 'in-person', city: 'Stony Brook, USA', minAge: 16, maxAge: 18,
    description: 'Summer lab research in materials science, with the aim of a publication or competition entry.',
    searchUrl: search('Garcia Summer Research Program Stony Brook'), cost: 'Paid — check the price',
  }),
  G({
    id: 'issyp', group: 'university', title: 'International Summer School for Young Physicists (ISSYP)', org: 'Perimeter Institute',
    type: 'Summer programme', categories: ['science'], skills: ['Research', 'Problem solving'], format: 'in-person', city: 'Waterloo, Canada', minAge: 16, maxAge: 18,
    description: 'A competitive summer programme in theoretical physics for high-school students from Canada and around the world.',
    searchUrl: search('Perimeter Institute ISSYP'),
  }),

  // ==================================================== Essays & writing (more)
  G({
    id: 'adroit-prizes', title: 'Adroit Prizes for Poetry and Prose', org: 'The Adroit Journal',
    type: 'Academic competition', categories: ['arts'], skills: ['Writing', 'Creativity'], minAge: 13, maxAge: 19,
    description: 'Prizes for secondary-school and undergraduate writers worldwide, judged by well-known authors.',
    searchUrl: search('Adroit Prizes for Poetry and Prose'),
  }),
  G({
    id: 'kenyon-grodd-prize', title: 'Patricia Grodd Poetry Prize for Young Writers', org: 'The Kenyon Review',
    type: 'Academic competition', categories: ['arts'], skills: ['Writing', 'Creativity'], minAge: 15, maxAge: 18,
    description: 'A poetry prize for high-school sophomores and juniors anywhere in the world; the winner is published in The Kenyon Review.',
    searchUrl: search('Kenyon Review Patricia Grodd Poetry Prize'), cost: 'Free',
  }),
  G({
    id: 'princeton-poetry-prize', title: 'Leonard L. Milberg High School Poetry Prize', org: 'Princeton University Creative Writing',
    type: 'Academic competition', categories: ['arts'], skills: ['Writing', 'Creativity'], minAge: 15, maxAge: 18,
    description: 'Princeton’s poetry prize for students in the 11th grade (around age 16–17) — check the eligibility rules for international students.',
    searchUrl: search('Princeton Leonard L. Milberg High School Poetry Prize'), cost: 'Free',
  }),
  G({
    id: 'princeton-ten-minute-play', group: 'essay', title: 'Princeton Ten-Minute Play Contest', org: 'Princeton University Theater',
    type: 'Academic competition', categories: ['arts'], skills: ['Writing', 'Creativity'], minAge: 15, maxAge: 18,
    description: 'Write a ten-minute play. Open to 11th-grade students — check the rules for students outside the USA.',
    searchUrl: search('Princeton Ten-Minute Play Contest'), cost: 'Free',
  }),
  G({
    id: 'ccir-rethink-essay', title: 'Re:think Essay Competition', org: 'Cambridge Centre for International Research (private)',
    type: 'Academic competition', categories: ['academic'], skills: ['Writing', 'Research'], minAge: 14, maxAge: 18,
    description: 'An essay competition on questions about society, ethics and technology. Run by a private company, not the University of Cambridge.',
    searchUrl: search('Re:think Essay Competition CCIR'),
  }),
  CH({
    id: 'prix-jeune-ecrivain', country: 'CH', title: 'Prix du Jeune Écrivain (French-language writing prize)', org: 'Prix du Jeune Écrivain',
    type: 'Academic competition', categories: ['arts'], skills: ['Writing', 'Creativity', 'Languages'], format: 'online', scope: 'global', minAge: 15, maxAge: 27,
    eligibility: 'Young writers writing in French, including in Switzerland — check the age range.',
    description: 'A long-running prize for short fiction written in French; winners are published in an anthology.',
    searchUrl: search('Prix du Jeune Écrivain de langue française'), cost: 'Free',
  }),
  CH({
    id: 'der-bund-essay', title: 'Der Bund Essay Prize (German-language essay competition)', org: 'Der Bund (newspaper, Bern)',
    type: 'Academic competition', categories: ['arts', 'academic'], skills: ['Writing'], format: 'online', minAge: 16, maxAge: 25,
    eligibility: 'Young writers in German — check the current age range and theme.',
    description: 'An essay competition on a set theme, with the best essays published.',
    searchUrl: search('Der Bund Essay-Wettbewerb'),
  }),
  CH({
    id: 'schweizer-jugend-schreibt', title: 'Creative-writing competitions for young people in Switzerland', org: 'Various (libraries, literature houses, newspapers)',
    type: 'Academic competition', categories: ['arts'], skills: ['Writing', 'Creativity'], format: 'online', minAge: 12, maxAge: 20,
    description: 'Literature houses, libraries and newspapers across Switzerland run short-story and poetry competitions for young people. Search for current ones in your language.',
    searchUrl: search('Schreibwettbewerb Jugendliche Schweiz 2027'),
  }),

  // ===================================================== Money & banking (more)
  // Cantonal banks (each canton's own bank — a few cantons don't have one).
  bank('bank-zkb-youth', 'Zürcher Kantonalbank', 'ZH', 'https://www.zkb.ch'),
  bank('bank-bekb-youth', 'Berner Kantonalbank (BEKB)', 'BE', 'https://www.bekb.ch'),
  bank('bank-lukb-youth', 'Luzerner Kantonalbank', 'LU', 'https://www.lukb.ch'),
  bank('bank-ukb-youth', 'Urner Kantonalbank', 'UR', 'https://www.ukb.ch'),
  bank('bank-szkb-youth', 'Schwyzer Kantonalbank', 'SZ', 'https://www.szkb.ch'),
  bank('bank-okb-youth', 'Obwaldner Kantonalbank', 'OW', 'https://www.okb.ch'),
  bank('bank-nkb-youth', 'Nidwaldner Kantonalbank', 'NW', 'https://www.nkb.ch'),
  bank('bank-glkb-youth', 'Glarner Kantonalbank', 'GL', 'https://www.glkb.ch'),
  bank('bank-zugerkb-youth', 'Zuger Kantonalbank', 'ZG', 'https://www.zugerkb.ch'),
  bank('bank-bcf-youth', 'Banque Cantonale de Fribourg / Freiburger Kantonalbank', 'FR', 'https://www.bcf.ch'),
  bank('bank-bkb-youth', 'Basler Kantonalbank', 'BS', 'https://www.bkb.ch'),
  bank('bank-blkb-youth', 'Basellandschaftliche Kantonalbank', 'BL', 'https://www.blkb.ch'),
  bank('bank-shkb-youth', 'Schaffhauser Kantonalbank', 'SH', 'https://www.shkb.ch'),
  bank('bank-appkb-youth', 'Appenzeller Kantonalbank', 'AI', 'https://www.appkb.ch'),
  bank('bank-sgkb-youth', 'St.Galler Kantonalbank', 'SG', 'https://www.sgkb.ch'),
  bank('bank-gkb-youth', 'Graubündner Kantonalbank', 'GR', 'https://www.gkb.ch'),
  bank('bank-akb-youth', 'Aargauische Kantonalbank', 'AG', 'https://www.akb.ch'),
  bank('bank-tkb-youth', 'Thurgauer Kantonalbank', 'TG', 'https://www.tkb.ch'),
  bank('bank-bancastato-youth', 'Banca dello Stato del Cantone Ticino (BancaStato)', 'TI', 'https://www.bancastato.ch'),
  bank('bank-bcv-youth', 'Banque Cantonale Vaudoise (BCV)', 'VD', 'https://www.bcv.ch'),
  bank('bank-bcvs-youth', 'Banque Cantonale du Valais / Walliser Kantonalbank', 'VS', 'https://www.bcvs.ch'),
  bank('bank-bcn-youth', 'Banque Cantonale Neuchâteloise (BCN)', 'NE', 'https://www.bcn.ch'),
  bank('bank-bcge-youth', 'Banque Cantonale de Genève (BCGE)', 'GE', 'https://www.bcge.ch'),
  bank('bank-bcj-youth', 'Banque Cantonale du Jura (BCJ)', 'JU', 'https://www.bcj.ch'),
  // Other banks with branches across Switzerland.
  bank('bank-valiant-youth', 'Valiant Bank', null, 'https://www.valiant.ch'),
  bank('bank-regional-youth', 'Regional and savings banks (Clientis, Esprit and others)', null, null, {
    title: 'Regional & savings banks — youth accounts', description: 'Many smaller regional and savings banks also have youth accounts. If your family already banks locally, ask there and compare conditions.',
    searchUrl: search('Regionalbank Jugendkonto Schweiz Vergleich'),
  }),
  bank('bank-compare-youth', 'Comparison sites (moneyland, comparis)', null, null, {
    title: 'Compare youth accounts before you open one', org: 'Independent comparison sites',
    description: 'Comparison sites list Swiss youth accounts side by side — fees, card costs, interest and age limits. Do this before choosing any bank.',
    searchUrl: search('moneyland Jugendkonto Vergleich'), format: 'online',
  }),

  // Financial literacy (shown under Money & banking).
  LIT({
    id: 'iconomix', title: 'iconomix — economics and money learning by the Swiss National Bank', org: 'Swiss National Bank (SNB)',
    type: 'Online course', scope: 'national', minAge: 14, maxAge: 20,
    description: 'Free games, simulations and lessons about money, inflation, interest rates and the economy, made by the SNB for Swiss schools.',
    url: 'https://www.iconomix.ch',
  }),
  LIT({
    id: 'forum-snb', title: 'Forum SNB — the Swiss National Bank’s visitor centre', org: 'Swiss National Bank (SNB)',
    type: 'Outreach programme', scope: 'local', format: 'in-person', city: 'Zurich', canton: 'ZH', minAge: 12, maxAge: 99,
    description: 'An interactive exhibition about money, monetary policy and the SNB. Good for a school trip or a free afternoon.',
    searchUrl: search('Forum SNB Zürich Besucherzentrum'),
  }),
  LIT({
    id: 'financemission', title: 'FinanceMission — money skills game for Swiss schools', org: 'FinanceMission (association backed by teachers’ and banks’ organisations)',
    type: 'Online course', scope: 'national', minAge: 12, maxAge: 18,
    description: 'Learn budgeting, saving, debt and shopping decisions through an online game and lesson materials used in Swiss schools.',
    searchUrl: search('FinanceMission Schweiz'),
  }),
  LIT({
    id: 'postfinance-moneyfit', title: 'MoneyFit — financial education materials', org: 'PostFinance',
    type: 'Online course', scope: 'national', minAge: 10, maxAge: 18,
    description: 'Free learning materials and games on handling money for different school levels. Educational content from a bank — use it to learn, not as a product recommendation.',
    searchUrl: search('PostFinance MoneyFit'),
  }),
  LIT({
    id: 'budgetberatung-youth', title: 'Make your first budget (Budgetberatung Schweiz)', org: 'Budgetberatung Schweiz',
    type: 'Online course', scope: 'national', minAge: 13, maxAge: 25,
    description: 'Free budget templates and guidance for young people — pocket money, first wage, apprenticeship or moving out.',
    searchUrl: search('Budgetberatung Schweiz Jugendliche Budget'),
  }),
  LIT({
    id: 'debt-prevention-youth', title: 'Debt-prevention advice for young people', org: 'Schuldenberatung Schweiz / Dettes Conseils Suisse',
    type: 'Online course', scope: 'national', minAge: 13, maxAge: 25,
    description: 'Learn how phone contracts, buy-now-pay-later and credit cards can lead to debt, and where to get free advice.',
    searchUrl: search('Schuldenprävention Jugendliche Schweiz'),
  }),
  LIT({
    id: 'bankeinstieg-bem', title: 'Bank entry for Matura graduates (BEM / Bankeinstieg)', org: 'Swiss banks (Swiss Bankers Association programme)',
    type: 'Internship', scope: 'national', format: 'in-person', minAge: 17, maxAge: 22, skills: ['Communication', 'Data analysis'],
    description: 'A paid traineeship of about 18 months at a bank for students who have finished the Matura (Gymnasium) — an alternative to going straight to university.',
    searchUrl: search('Bankeinstieg für Mittelschulabsolventen BEM'), cost: 'Paid trainee salary',
  }),
  LIT({
    id: 'khan-personal-finance', title: 'Personal finance course (free)', org: 'Khan Academy',
    type: 'Online course', minAge: 12, maxAge: 99,
    description: 'Free videos and exercises on budgeting, saving, interest, investing basics and taxes (US examples, but the ideas apply everywhere).',
    searchUrl: search('Khan Academy personal finance course'),
  }),
  LIT({
    id: 'global-money-week', title: 'Global Money Week', org: 'OECD International Network on Financial Education',
    type: 'Outreach programme', minAge: 10, maxAge: 25,
    description: 'A yearly international week of financial-education events for young people, run in many countries (Switzerland has its own Swiss Money Week).',
    searchUrl: search('Global Money Week OECD'),
  }),
  LIT({
    id: 'school-investment-club', title: 'Start an investment or economics club at school', org: 'Your school',
    type: 'Club', scope: 'national', format: 'in-person', minAge: 14, maxAge: 19, skills: ['Leadership', 'Data analysis', 'Entrepreneurship'],
    description: 'Run a club that follows the markets with a stock-game account, discusses economics news and enters competitions like the Swiss Money Week stock game or Wharton’s investment competition.',
    searchUrl: search('Börsenspiel Schule Schweiz'),
  }),

  // ======================================================= Volunteering (more)
  vol({
    id: 'tischlein-deck-dich', title: 'Food distribution volunteering (Tischlein deck dich)', org: 'Tischlein deck dich',
    categories: ['volunteering', 'health'], description: 'Help hand out food that would otherwise be wasted to people living on low incomes, at distribution points across Switzerland.',
    searchUrl: search('Tischlein deck dich Freiwillige'),
  }),
  vol({
    id: 'pro-senectute-intergenerational', title: 'Help older people with technology (Pro Senectute)', org: 'Pro Senectute — cantonal organisations',
    skills: ['Communication', 'Teamwork'], minAge: 14,
    description: 'Many Pro Senectute offices look for young people to help seniors with phones, computers and apps, or for intergenerational projects.',
    searchUrl: search('Pro Senectute Jugendliche Freiwillige Smartphone Hilfe'),
  }),
  vol({
    id: 'amnesty-youth', title: 'Amnesty International youth groups', org: 'Amnesty International Switzerland',
    categories: ['volunteering', 'leadership'], skills: ['Communication', 'Public speaking', 'Writing'], minAge: 14,
    description: 'Join or start a youth group: letter-writing campaigns, events and human-rights education.',
    searchUrl: search('Amnesty International Schweiz Jugendgruppe'),
  }),
  vol({
    id: 'greenpeace-volunteers', title: 'Greenpeace Switzerland volunteer groups', org: 'Greenpeace Switzerland',
    categories: ['volunteering', 'environment'], minAge: 16,
    description: 'Regional volunteer groups organise environmental campaigns, stands and actions.',
    searchUrl: search('Greenpeace Schweiz Regionalgruppe Freiwillige'),
  }),
  vol({
    id: 'swiss-youth-for-climate', title: 'Swiss Youth for Climate', org: 'Swiss Youth for Climate',
    categories: ['environment', 'leadership'], skills: ['Project management', 'Communication'], minAge: 15,
    description: 'A youth-led association running climate projects, events and education across Switzerland.',
    searchUrl: search('Swiss Youth for Climate'),
  }),
  vol({
    id: 'umwelteinsatz-sus', title: 'Environmental work weeks (Stiftung Umwelteinsatz)', org: 'Stiftung Umwelteinsatz Schweiz',
    categories: ['environment', 'volunteering'], skills: ['Teamwork'], minAge: 14, commitment: 'A day to a week',
    description: 'Practical nature-care work in the Swiss countryside — dry-stone walls, meadows, paths — in groups.',
    searchUrl: search('Stiftung Umwelteinsatz Schweiz SUS Einsatz'),
  }),
  vol({
    id: 'clean-up-day', title: 'National Clean-Up Day', org: 'IGSU (Swiss interest group for a clean environment)',
    categories: ['environment', 'volunteering'], skills: ['Teamwork', 'Project management'], minAge: 8,
    description: 'Each year, schools, clubs and communities across Switzerland organise litter pick-ups. Join one or register your own.',
    timing: 'Usually in September', searchUrl: search('Clean-Up-Day Schweiz IGSU'),
  }),
  vol({
    id: 'summit-foundation', title: 'Mountain and lake clean-ups (Summit Foundation)', org: 'Summit Foundation',
    categories: ['environment', 'volunteering'], minAge: 12,
    description: 'Clean-up days at ski resorts and in nature, plus waste-awareness projects in schools.',
    searchUrl: search('Summit Foundation clean-up Suisse'),
  }),
  vol({
    id: 'net-leman', title: 'Lake Geneva clean-up (Net’Léman)', org: 'Association pour la Sauvegarde du Léman (ASL)',
    scope: 'local', canton: 'VD', city: 'Lake Geneva', categories: ['environment', 'volunteering'], minAge: 10,
    description: 'A big volunteer clean-up of the shores of Lake Geneva, organised in many towns around the lake.',
    searchUrl: search('Net\'Léman nettoyage Léman bénévoles'),
  }),
  vol({
    id: 'repair-cafe', title: 'Repair Café volunteering', org: 'Repair Cafés (Stiftung für Konsumentenschutz network)',
    categories: ['environment', 'technology'], skills: ['Problem solving', 'Communication'], minAge: 14,
    description: 'Help fix bikes, electronics and clothes at a local Repair Café — great if you like taking things apart.',
    searchUrl: search('Repair Café Schweiz Freiwillige'),
  }),
  vol({
    id: 'animal-shelter', title: 'Animal shelter volunteering', org: 'Swiss Animal Protection (STS) sections and local shelters',
    categories: ['volunteering', 'environment'], minAge: 14,
    description: 'Walk dogs, socialise cats or help at events at a shelter near you. Many shelters have a minimum age or need a parent’s consent.',
    searchUrl: search('Tierheim Freiwillige Jugendliche Schweiz'),
  }),
  vol({
    id: 'insieme-camps', title: 'Helper at holiday camps for people with disabilities (insieme, Procap, Cerebral)', org: 'insieme, Procap and other disability organisations',
    categories: ['volunteering', 'health'], skills: ['Teamwork', 'Communication', 'Leadership'], minAge: 16, commitment: 'Usually one week',
    description: 'Accompany children or adults with disabilities on holiday camps. Training is usually provided; many organisations pay expenses.',
    searchUrl: search('Lagerleitung Freiwillige insieme Procap Lager Jugendliche'),
  }),
  vol({
    id: 'blindspot', title: 'Inclusive youth projects (Blindspot)', org: 'Blindspot',
    categories: ['volunteering', 'leadership'], skills: ['Leadership', 'Communication'], minAge: 14,
    description: 'An organisation that runs inclusive camps and projects where young people with and without disabilities work together.',
    searchUrl: search('Blindspot inklusive Jugendprojekte Schweiz'),
  }),
  vol({
    id: 'pfadi-trotz-allem', title: 'Pfadi trotz allem (PTA) — scouting for young people with disabilities', org: 'Swiss Guide and Scout Movement — PTA groups',
    categories: ['volunteering', 'leadership'], skills: ['Leadership', 'Teamwork'], minAge: 15,
    description: 'Help lead scout activities for children and young people with disabilities.',
    searchUrl: search('Pfadi trotz allem PTA Leiter'),
  }),
  vol({
    id: 'interact-clubs', title: 'Interact clubs (Rotary youth service clubs)', org: 'Rotary International — Interact',
    type: 'Youth organisation', categories: ['volunteering', 'leadership'], skills: ['Leadership', 'Project management'], minAge: 12,
    description: 'Service clubs for 12–18-year-olds sponsored by a local Rotary club: plan local and international service projects.',
    searchUrl: search('Interact Club Schweiz Rotary'),
  }),
  vol({
    id: 'leo-clubs', title: 'Leo clubs (Lions youth service clubs)', org: 'Lions Clubs International — Leo clubs',
    type: 'Youth organisation', categories: ['volunteering', 'leadership'], skills: ['Leadership', 'Project management'], minAge: 12,
    description: 'Youth service clubs that run fundraising and community projects, linked to local Lions clubs.',
    searchUrl: search('Leo Club Schweiz'),
  }),
  vol({
    id: 'un-youth-delegate', title: 'Swiss Youth Delegate to the UN', org: 'Swiss youth councils (SAJV/CSAJ)',
    type: 'Civic programme', categories: ['leadership'], skills: ['Public speaking', 'Languages', 'Leadership'], minAge: 18, maxAge: 25,
    eligibility: 'Young adults — check the current age range. Good to know about for later.',
    description: 'Young people represent Swiss youth at the United Nations General Assembly and related meetings.',
    searchUrl: search('UNO-Jugenddelegierte Schweiz SAJV'),
  }),
  eventVol('vol-weltklasse-zurich', 'Weltklasse Zürich (athletics)', 'Zurich', 'ZH', 'Weltklasse Zürich Volunteers'),
  eventVol('vol-athletissima', 'Athletissima Lausanne (athletics)', 'Lausanne', 'VD', 'Athletissima bénévoles'),
  eventVol('vol-zurich-marathon', 'the Zurich Marathon', 'Zurich', 'ZH', 'Zürich Marathon Helfer'),
  eventVol('vol-lausanne-marathon', 'the Lausanne Marathon', 'Lausanne', 'VD', 'Lausanne Marathon bénévoles'),
  eventVol('vol-grand-prix-bern', 'the Grand Prix von Bern (running)', 'Bern', 'BE', 'Grand Prix von Bern Helfer'),
  eventVol('vol-swiss-indoors', 'the Swiss Indoors Basel (tennis)', 'Basel', 'BS', 'Swiss Indoors Basel Volunteers'),
  eventVol('vol-spengler-cup', 'the Spengler Cup (ice hockey)', 'Davos', 'GR', 'Spengler Cup Volunteers Helfer'),
  eventVol('vol-lauberhorn', 'the Lauberhorn ski races', 'Wengen', 'BE', 'Lauberhorn Rennen Helfer'),
  eventVol('vol-engadin-skimarathon', 'the Engadin Skimarathon', 'St. Moritz', 'GR', 'Engadin Skimarathon Helfer'),
  eventVol('vol-locarno-film', 'the Locarno Film Festival', 'Locarno', 'TI', 'Locarno Film Festival volunteers', ['volunteering', 'arts']),
  eventVol('vol-montreux-jazz', 'the Montreux Jazz Festival', 'Montreux', 'VD', 'Montreux Jazz Festival bénévoles', ['volunteering', 'arts']),
  eventVol('vol-gurtenfestival', 'the Gurtenfestival', 'Bern', 'BE', 'Gurtenfestival Helfer', ['volunteering', 'arts']),
  eventVol('vol-openair-stgallen', 'the OpenAir St. Gallen', 'St. Gallen', 'SG', 'OpenAir St. Gallen Helfer', ['volunteering', 'arts']),
  eventVol('vol-zff', 'the Zurich Film Festival', 'Zurich', 'ZH', 'Zurich Film Festival volunteers', ['volunteering', 'arts']),
  eventVol('vol-fantoche', 'Fantoche animation festival', 'Baden', 'AG', 'Fantoche Baden Helfer', ['volunteering', 'arts']),
  eventVol('vol-nifff', 'the Neuchâtel International Fantastic Film Festival (NIFFF)', 'Neuchâtel', 'NE', 'NIFFF bénévoles', ['volunteering', 'arts']),
  eventVol('vol-fete-musique-ge', 'the Fête de la Musique Geneva', 'Geneva', 'GE', 'Fête de la Musique Genève bénévoles', ['volunteering', 'arts']),
  eventVol('vol-basel-tattoo', 'the Basel Tattoo', 'Basel', 'BS', 'Basel Tattoo Helfer', ['volunteering', 'arts']),
  eventVol('vol-swiss-skills', 'SwissSkills (national skills championships)', 'Bern', 'BE', 'SwissSkills Volunteers', ['volunteering', 'business']),
  // ============================================ More research (journals, citizen science)
  G({
    id: 'jei-journal', title: 'Journal of Emerging Investigators (publish your research)', org: 'Journal of Emerging Investigators',
    type: 'Research week', categories: ['science', 'academic'], skills: ['Research', 'Writing'], minAge: 11, maxAge: 18,
    description: 'A peer-reviewed science journal for middle- and high-school students. Scientists review your paper and help you improve it — a strong next step after a Maturaarbeit or SJf project.',
    searchUrl: search('Journal of Emerging Investigators'), cost: 'Free to submit (check)',
  }),
  G({
    id: 'nhsjs', title: 'National High School Journal of Science', org: 'NHSJS',
    type: 'Research week', categories: ['science', 'academic'], skills: ['Research', 'Writing'], minAge: 13, maxAge: 19,
    description: 'A student-run journal that publishes research papers and reviews by high-school students from around the world.',
    searchUrl: search('National High School Journal of Science submit'),
  }),
  G({
    id: 'journal-student-research', title: 'Journal of Student Research (high-school edition)', org: 'Journal of Student Research',
    type: 'Research week', categories: ['science', 'academic'], skills: ['Research', 'Writing'], minAge: 13, maxAge: 19,
    description: 'An academic journal that publishes high-school research. There is a publication fee — compare with free journals first.',
    searchUrl: search('Journal of Student Research high school edition'), cost: 'Publication fee',
  }),
  CH({
    id: 'schweiz-forscht', title: 'Schweiz forscht — Swiss citizen-science projects', org: 'Science et Cité / Schweiz forscht',
    type: 'Research week', categories: ['science', 'environment'], skills: ['Research', 'Data analysis'], format: 'hybrid', minAge: 10, maxAge: 99,
    description: 'A platform listing Swiss research projects anyone can help with — counting insects, recording plants, measuring air or water, transcribing archives.',
    searchUrl: search('Schweiz forscht citizen science Plattform'), cost: 'Free',
  }),
  CH({
    id: 'ornitho-vogelwarte', title: 'Record bird sightings for the Swiss Ornithological Institute', org: 'Swiss Ornithological Institute (Vogelwarte Sempach) — ornitho.ch',
    type: 'Research week', categories: ['science', 'environment'], skills: ['Research', 'Data analysis'], format: 'hybrid', minAge: 10, maxAge: 99,
    description: 'Log the birds you see on ornitho.ch; the data feeds into Swiss bird monitoring and research. The Vogelwarte also offers youth courses and excursions.',
    searchUrl: search('ornitho.ch Vogelwarte Jugend'), cost: 'Free',
  }),
  CH({
    id: 'wilde-nachbarn', title: 'Wilde Nachbarn — urban wildlife citizen science', org: 'StadtNatur / Wilde Nachbarn',
    type: 'Research week', categories: ['science', 'environment'], skills: ['Research', 'Data analysis'], format: 'hybrid', minAge: 10, maxAge: 99,
    description: 'Report hedgehogs, foxes, badgers and other animals in Swiss towns, or join camera-trap projects that help researchers map urban wildlife.',
    searchUrl: search('Wilde Nachbarn Schweiz Citizen Science'), cost: 'Free',
  }),
  G({
    id: 'inaturalist', title: 'iNaturalist — record species for science', org: 'iNaturalist (California Academy of Sciences & National Geographic)',
    type: 'Research week', categories: ['science', 'environment'], skills: ['Research', 'Data analysis'], format: 'hybrid', minAge: 13, maxAge: 99,
    description: 'Photograph plants, insects and animals; experts help identify them and the data is shared with research databases. Great for a biology Maturaarbeit.',
    searchUrl: search('iNaturalist'), cost: 'Free',
  }),
  G({
    id: 'ebird', title: 'eBird — bird data for researchers', org: 'Cornell Lab of Ornithology',
    type: 'Research week', categories: ['science', 'environment'], skills: ['Research', 'Data analysis'], format: 'hybrid', minAge: 13, maxAge: 99,
    description: 'Submit bird checklists that scientists use to track populations worldwide; you can also download data for your own project.',
    searchUrl: search('eBird Cornell'), cost: 'Free',
  }),
  CH({
    id: 'maturaarbeit-prizes', title: 'Prizes for outstanding Matura projects (Maturaarbeit)', org: 'Universities, foundations and cantons',
    type: 'Research week', categories: ['academic', 'science'], skills: ['Research', 'Writing'], format: 'hybrid', minAge: 16, maxAge: 20,
    eligibility: 'Students with a finished Maturaarbeit / travail de maturité — usually nominated by the school.',
    description: 'Besides Schweizer Jugend forscht, many universities, foundations and cantons award prizes for the best Matura projects in their field. Ask your supervisor which ones fit your topic.',
    searchUrl: search('Preis Maturaarbeit 2027'), cost: 'Free',
  }),
  G({
    id: 'euler-circle', title: 'Euler Circle — online maths research classes', org: 'Euler Circle (private)',
    type: 'Mentoring programme', categories: ['academic', 'science'], skills: ['Research', 'Problem solving', 'Writing'], minAge: 13, maxAge: 18,
    description: 'Online university-level maths classes where students write an expository or research paper.',
    searchUrl: search('Euler Circle math research online'), cost: 'Paid — check the price and any financial aid',
  }),
  G({
    id: 'sumac', title: 'Stanford University Mathematics Camp (SUMaC)', org: 'Stanford Pre-Collegiate Studies',
    type: 'Summer programme', group: 'research', categories: ['academic', 'science'], skills: ['Research', 'Problem solving'], format: 'hybrid', minAge: 15, maxAge: 18,
    description: 'An intensive summer programme in advanced mathematics with research-style projects, online or on campus.',
    searchUrl: search('Stanford SUMaC'), cost: 'Paid — check the price and any financial aid',
  }),
  G({
    id: 'globe-at-night', title: 'Globe at Night — measure light pollution', org: 'NOIRLab (NSF)',
    type: 'Research week', categories: ['science', 'environment'], skills: ['Research', 'Data analysis'], format: 'hybrid', minAge: 10, maxAge: 99,
    description: 'Compare the night sky with star charts and submit your measurement to a worldwide light-pollution dataset.',
    searchUrl: search('Globe at Night citizen science'), cost: 'Free',
  }),
];

