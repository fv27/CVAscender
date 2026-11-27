// ---------------------------------------------------------------------------
// University & pre-university programmes (added 7 Nov 2026 from the list the
// team supplied, plus a few extra Swiss offers found while checking it).
//
// Honesty rules:
//  • verified: true  → details were checked against the organiser's page or a
//    reliable report on the date in `source`.
//  • verified: false → a real organisation and link, but the details have NOT
//    been checked yet. The app shows these as "Not checked yet".
//  • Items that are NOT open to school students in Switzerland were left out
//    (see README: Cambridge STEM SMART, Oxford UNIQ, Swiss Study Foundation
//    summer academies, ETH summer research fellowships / summer-school
//    directory, Edinburgh visiting-student summer school, MIT BWSI on-site
//    programme, Imperial outreach).
// ---------------------------------------------------------------------------

const P = (o) => ({
  scope: 'national', format: 'in-person', city: null, canton: null,
  minAge: 14, maxAge: 19, cost: 'See the website', commitment: 'Varies',
  timing: 'See the website for current dates',
  eligibility: 'See the website for current eligibility.',
  verified: false, source: 'Team-supplied list — details not yet checked',
  ...o,
});

// Programmes abroad (or online worldwide) get their own scope so the card says so.
const ABROAD = { scope: 'global', format: 'in-person' };
const ONLINE = { scope: 'global', format: 'online' };

export const UNIVERSITY_PROGRAMMES = [
  // ------------------------------------------------------------ Geneva
  P({
    id: 'unige-club-de-maths', title: 'Club de maths — University of Geneva', org: 'University of Geneva, Section of Mathematics (with SwissMAP and G·EM)',
    type: 'Club', categories: ['science', 'academic'], skills: ['Problem solving', 'Creativity'],
    scope: 'local', city: 'Geneva', canton: 'GE', minAge: 11, maxAge: 16,
    eligibility: 'Pupils from 8P to the 1st year of collège (about ages 11–15).',
    description: 'A weekly maths club on Wednesday afternoons: puzzles, games and constructions, or harder competition-style problems.',
    details: 'From autumn 2026 there are two formats: “Découvertes mathématiques” (8P–11e CO) and “Défis mathématiques” (10e CO to collège), the latter inspired by maths circles and olympiad preparation. Sessions run 16:00–18:00 at the Section of Mathematics, outside school holidays; the first session was 16 September 2026.',
    timing: 'Wednesday afternoons during the school year', commitment: '1–2 hours a week', cost: 'See the website',
    url: 'https://www.unige.ch/math/GEM/nos-activites/uniscolaire/club-de-math', verified: true, source: 'unige.ch (Club de math page), checked Nov 2026',
  }),
  P({
    id: 'unige-offres-ecoles', title: 'UNIGE activities for school students', org: 'University of Geneva',
    type: 'Outreach programme', categories: ['academic', 'science'], skills: ['Research', 'Communication'],
    scope: 'local', city: 'Geneva', canton: 'GE', minAge: 11, maxAge: 19,
    description: 'The university’s catalogue of workshops, lectures, visits and science activities for primary and secondary pupils.',
    details: 'Each activity has its own page (“fiche”) with the age group and how to sign up — for example the Athéna programme and the Club de maths.',
    url: 'https://www.unige.ch/offres-ecoles/', verified: true, source: 'unige.ch/offres-ecoles, checked Nov 2026',
  }),

  // ------------------------------------------------------------ Zurich
  P({
    id: 'uzh-junior-euler-society', title: 'Junior Euler Society (maths courses)', org: 'University of Zurich, Institute of Mathematics',
    type: 'Club', categories: ['science', 'academic'], skills: ['Problem solving', 'Research'],
    scope: 'local', city: 'Zurich', canton: 'ZH', minAge: 10, maxAge: 19,
    eligibility: 'Interested school students of all ages; some courses have selection.',
    description: 'UZH’s maths outreach programme: courses on topics not covered at school, and preparation for maths competitions.',
    details: 'Running since 2007 and directed by Anna Beliakova and Tatiana Samrowski, it reaches over 350 school students a year, in age groups such as U12, U14 and U18.',
    timing: 'During the school year', commitment: 'Regular courses',
    url: 'https://www.math.uzh.ch/en/schueler', verified: true, source: 'math.uzh.ch / NCCR SwissMAP, checked Nov 2026',
  }),
  P({
    id: 'eth-math-youth-academy', title: 'ETH Math Youth Academy', org: 'ETH Zurich, Department of Mathematics',
    type: 'University programme', categories: ['science', 'academic'], skills: ['Problem solving', 'Research'],
    scope: 'local', city: 'Zurich', canton: 'ZH', minAge: 13, maxAge: 19,
    eligibility: 'Gymnasium students from about age 13.',
    description: 'Weekly university-level maths mini-courses for motivated Gymnasium students, taught in English.',
    details: 'Listed by ETH and SwissMAP among Zurich’s maths outreach offers. Check the course list and sign-up on the website.',
    timing: 'During the semester', commitment: 'Weekly', cost: 'Free (per the organiser)',
    url: 'https://math.ethz.ch/outreach/eth-math-youth-academy.html', verified: false, source: 'Team-supplied; listed by math.ch and SwissMAP (details not fully checked)',
  }),
  P({
    id: 'eth-gomath-girls-circle', title: 'goMATH Girls’ Circle', org: 'ETH Zurich, Department of Mathematics',
    type: 'Club', categories: ['science', 'academic', 'leadership'], skills: ['Problem solving', 'Teamwork'],
    scope: 'local', city: 'Zurich', canton: 'ZH', minAge: 12, maxAge: 15,
    eligibility: 'Girls aged 12 to 15.',
    description: 'A free weekly maths circle for girls in the ETH main building, in groups of 10–25.',
    details: 'Meets on Wednesdays (14:00–15:45 when last announced) in German at ETH, Rämistrasse 101. It is part of goMATH, ETH’s programme for women and young talent in maths.',
    timing: 'Wednesday afternoons', commitment: 'Weekly', cost: 'Free',
    url: 'https://math.ethz.ch/outreach/stem-programmes.html', verified: true, source: 'math.ch teacher-day slides (ETH), checked Nov 2026',
  }),
  P({
    id: 'eth-youth-academy', title: 'ETH Youth Academy', org: 'ETH Zurich',
    type: 'University programme', categories: ['science', 'academic'], skills: ['Problem solving', 'Research'],
    scope: 'local', city: 'Zurich', canton: 'ZH', minAge: 12, maxAge: 19,
    description: 'Advanced courses in mathematics and natural sciences for school students.',
    details: 'Named on ETH’s list of maths outreach offers; check the current course list and age groups.',
    url: 'https://math.ethz.ch/outreach/stem-programmes.html',
  }),
  P({
    id: 'eth-csnow-taster-week', title: 'Computer science taster week for young women', org: 'ETH Zurich — CSNOW (Network of Women in Computer Science)',
    type: 'University programme', categories: ['technology', 'academic'], skills: ['Coding', 'Problem solving'],
    scope: 'national', city: 'Zurich', canton: null, minAge: 15, maxAge: 20,
    eligibility: 'Female high-school (Mittelschule) students.',
    description: 'A sought-after taster week to learn about the different sides of computer science and its careers, held twice a year.',
    details: 'Run by CSNOW, ETH’s network of women in computer science, to help female students decide what to study.',
    timing: 'Twice a year', commitment: 'One week',
    url: 'https://inf.ethz.ch/communication-services/schools-universities.html', verified: true, source: 'inf.ethz.ch, checked Nov 2026',
  }),
  P({
    id: 'eth-student-for-a-day', title: 'ETH “Student for a Day”', org: 'ETH Zurich student associations (e.g. VIS, AMIV)',
    type: 'University programme', categories: ['academic', 'technology'], skills: ['Communication'],
    scope: 'national', city: 'Zurich', canton: null, minAge: 16, maxAge: 20,
    eligibility: 'Upper-secondary students thinking about studying at ETH.',
    description: 'Spend a day with ETH students: go to real lectures and tutorials and see what studying is like.',
    details: 'Offered by ETH student associations for their subjects (listed for computer science and for mechanical & electrical engineering).',
    url: 'https://vis.ethz.ch/en/matura-info/', verified: false, source: 'Team-supplied; listed in Canton Solothurn careers guide (details not fully checked)',
  }),
  P({
    id: 'eth-school-offers', title: 'ETH Zurich offers for school students', org: 'ETH Zurich',
    type: 'Outreach programme', categories: ['science', 'technology', 'academic'], skills: ['Research'],
    scope: 'national', city: 'Zurich', canton: null, minAge: 12, maxAge: 19,
    description: 'ETH’s overview of visits, lab activities, workshops and information sessions for school students and classes.',
    url: 'https://ethz.ch/en/the-eth-zurich/education/school-students.html',
  }),
  P({
    id: 'uzh-buddy-programme', title: 'UZH Buddy Programme', org: 'Students’ union of the University of Zurich (VSUZH)',
    type: 'Mentoring programme', categories: ['academic'], skills: ['Communication'],
    scope: 'local', city: 'Zurich', canton: 'ZH', minAge: 16, maxAge: 20,
    eligibility: 'Gymnasium students thinking about university.',
    description: 'Get matched with a UZH student and go to lectures with them.',
    details: 'Recommended by the Canton of Zurich’s study-choice service. You can also sit in on regular lectures at all Swiss universities and ETH.',
    timing: 'During the semester', commitment: 'One or more visits', cost: 'Free',
    url: 'https://studienwahl.zh.ch/studienorientierung/schnuppern-im-studium/', verified: true, source: 'studienwahl.zh.ch, checked Nov 2026',
  }),

  // ------------------------------------------------------------ EPFL / Vaud
  P({
    id: 'epfl-pre-university-weeks', title: 'EPFL pre-university weeks', org: 'EPFL — Education Outreach Department (SPE)',
    type: 'Summer programme', categories: ['science', 'technology', 'academic'], skills: ['Problem solving', 'Research', 'Coding'],
    scope: 'national', city: 'Lausanne', canton: null, minAge: 15, maxAge: 20,
    eligibility: 'Gymnasium / collège / lycée students from all of Switzerland, from the end of their 1st year. One week per student per school year.',
    description: '4–5 day immersions on the EPFL campus on topics like robotics, materials, medicine & AI, sustainability and mathematical thinking.',
    details: 'Weeks run in the spring, summer and autumn holidays, in French or English, for about 24 students each. Recent editions: 6–9 July 2026 (science & sustainability) and 12–16 October 2026 (medicine & AI). Registration for each season opens a few months before.',
    timing: 'Spring, summer and autumn holidays', commitment: '4–5 days', cost: 'CHF 50',
    url: 'https://www.epfl.ch/education/education-and-science-outreach/gymnasiens-2/pre-university-weeks/', verified: true, source: 'epfl.ch pre-university week pages, checked Nov 2026',
  }),
  P({
    id: 'epfl-coding-club', title: 'EPFL Coding Club workshops', org: 'EPFL — Education Outreach Department',
    type: 'Club', categories: ['technology'], skills: ['Coding', 'Creativity'],
    scope: 'national', city: 'Lausanne', canton: null, minAge: 9, maxAge: 16,
    description: 'Programming workshops and coding projects for children and teenagers (age limits depend on the workshop).',
    details: 'EPFL also runs girls-only Coding Club sessions in other cities, including Zurich.',
    url: 'https://www.epfl.ch/education/education-and-science-outreach/epfl-coding-club/',
  }),
  P({
    id: 'epfl-science-outreach', title: 'EPFL science outreach & WINS activities', org: 'EPFL',
    type: 'Outreach programme', categories: ['science', 'technology'], skills: ['Research', 'Problem solving'],
    scope: 'national', city: 'Lausanne', canton: null, minAge: 8, maxAge: 19,
    description: 'Science workshops, lab activities and events for school students, including WINS activities for girls in engineering and science.',
    url: 'https://www.epfl.ch/education/education-and-science-outreach/',
  }),
  P({
    id: 'unil-campus-visits', title: 'UNIL campus visits & study information', org: 'University of Lausanne',
    type: 'Outreach programme', categories: ['academic'], skills: ['Communication'],
    scope: 'local', city: 'Lausanne', canton: 'VD', minAge: 16, maxAge: 20,
    description: 'Information events to discover UNIL’s degree programmes and university life.',
    url: 'https://www.unil.ch/central/en/home.html',
  }),

  // ------------------------------------------------------------ other universities
  P({
    id: 'unibe-school-programmes', title: 'University of Bern — before you study', org: 'University of Bern',
    type: 'Outreach programme', categories: ['academic', 'science'], skills: ['Research'],
    scope: 'local', city: 'Bern', canton: 'BE', minAge: 15, maxAge: 20,
    description: 'Lectures, workshops and study-orientation events for upper-secondary students.',
    url: 'https://www.unibe.ch/studies/before_your_studies/index_eng.html',
  }),
  P({
    id: 'unilu-early-bird', title: 'Early Bird — university courses during school', org: 'University of Lucerne',
    type: 'University programme', categories: ['academic'], skills: ['Research', 'Writing'],
    scope: 'local', city: 'Lucerne', canton: 'LU', minAge: 16, maxAge: 20,
    eligibility: 'Students at Central Swiss Gymnasien (as last announced).',
    description: 'Attend one or two real university courses while still at Gymnasium.',
    details: 'The University of Lucerne also runs a Buddy Programme (follow a student) and support for Matura projects — see the same page.',
    timing: 'During the semester', commitment: '1–2 courses',
    url: 'https://www.unilu.ch/studium/schnupper-und-foerderangebote/', verified: true, source: 'unilu.ch newsletters, checked Nov 2026',
  }),
  P({
    id: 'unilu-buddy', title: 'University of Lucerne Buddy Programme', org: 'University of Lucerne',
    type: 'Mentoring programme', categories: ['academic', 'leadership'], skills: ['Communication'],
    scope: 'local', city: 'Lucerne', canton: 'LU', minAge: 16, maxAge: 20,
    description: 'Follow a university student for a day and experience their degree programme.',
    url: 'https://www.unilu.ch/studium/schnupper-und-foerderangebote/buddy-programm/', verified: true, source: 'Canton Solothurn careers guide listing, checked Nov 2026',
  }),
  P({
    id: 'unilu-matura-research', title: 'Matura project support — University of Lucerne', org: 'University of Lucerne',
    type: 'Mentoring programme', categories: ['academic'], skills: ['Research', 'Writing'],
    scope: 'local', city: 'Lucerne', canton: 'LU', minAge: 16, maxAge: 20,
    eligibility: 'Gymnasium students working on their Matura project.',
    description: 'Get in touch with university researchers for expert advice on your Matura project.',
    url: 'https://www.unilu.ch/studium/schnupper-und-foerderangebote/',
  }),
  P({
    id: 'unibas-schnupper-school', title: 'Schnupper School — University of Basel', org: 'University of Basel',
    type: 'Outreach programme', categories: ['academic'], skills: ['Communication'],
    scope: 'local', city: 'Basel', canton: 'BS', minAge: 16, maxAge: 20,
    description: 'Taster days to try out studying at the University of Basel. Basel also offers free “tales” online courses.',
    url: 'https://www.unibas.ch', verified: true, source: 'Canton Solothurn careers guide listing, checked Nov 2026',
  }),
  P({
    id: 'unifr-school-outreach', title: 'University of Fribourg — offers for schools', org: 'University of Fribourg',
    type: 'Outreach programme', categories: ['academic', 'science', 'business'], skills: ['Research'],
    scope: 'local', city: 'Fribourg', canton: 'FR', minAge: 15, maxAge: 20,
    description: 'Lectures, school visits, information events and workshops for secondary students.',
    url: 'https://www.unifr.ch/',
  }),
  P({
    id: 'unine-school-outreach', title: 'University of Neuchâtel — discover university subjects', org: 'University of Neuchâtel',
    type: 'Outreach programme', categories: ['academic', 'science', 'business'], skills: ['Research'],
    scope: 'local', city: 'Neuchâtel', canton: 'NE', minAge: 15, maxAge: 20,
    description: 'Activities and information events for secondary students to discover subjects in science, economics and humanities.',
    url: 'https://www.unine.ch/',
  }),
  P({
    id: 'hsg-school-outreach', title: 'University of St. Gallen — offers for school students', org: 'University of St. Gallen (HSG)',
    type: 'Outreach programme', categories: ['business', 'leadership', 'academic'], skills: ['Entrepreneurship', 'Communication'],
    scope: 'local', city: 'St. Gallen', canton: 'SG', minAge: 15, maxAge: 20,
    description: 'Explore economics, business, law and international affairs, and HSG study options, through events for school students.',
    url: 'https://www.unisg.ch/en/studying/',
  }),
  P({
    id: 'usi-info-days', title: 'USI information days & lectures', org: 'Università della Svizzera italiana (USI)',
    type: 'Outreach programme', categories: ['academic', 'business', 'technology'], skills: ['Communication'],
    scope: 'local', city: 'Lugano', canton: 'TI', minAge: 16, maxAge: 20,
    description: 'Information days, lectures and orientation activities in Ticino for students thinking about university.',
    url: 'https://www.usi.ch/en',
  }),
  P({
    id: 'franklin-pre-college', title: 'Franklin University Switzerland Pre-College Programme', org: 'Franklin University Switzerland',
    type: 'Summer programme', categories: ['academic', 'leadership', 'arts'], skills: ['Writing', 'Research', 'Languages'],
    scope: 'national', city: 'Lugano', canton: null, minAge: 15, maxAge: 18,
    eligibility: 'High-school students aged 15–18 from any curriculum or country.',
    description: 'Two weeks of university-level courses in Lugano (in English) and 3 university credits.',
    details: 'The 2025 edition ran 14–27 July with an application deadline of 1 June and cost CHF 2,000 including tuition, room and board. Check this year’s dates.',
    timing: 'Two weeks in July; apply by early June', commitment: 'Two weeks, residential', cost: 'About CHF 2,000 (2025)',
    url: 'https://www.fus.edu/fus-pre-college', verified: true, source: 'fus.edu pre-college page / DBS listing, checked Nov 2026',
  }),
  P({
    id: 'kaenguru-mathematik', title: 'Känguru der Mathematik', org: 'Känguru der Mathematik Schweiz',
    type: 'Academic competition', categories: ['science', 'academic'], skills: ['Problem solving'],
    scope: 'national', minAge: 8, maxAge: 19,
    description: 'The international multiple-choice maths competition, taken at school in spring.',
    details: 'Recommended to Swiss maths teachers alongside the maths and informatics olympiads. Ask your maths teacher whether your school takes part.',
    timing: 'Spring', commitment: 'One test', cost: 'Small entry fee (via school)',
    searchUrl: 'https://duckduckgo.com/?q=' + encodeURIComponent('Känguru der Mathematik Schweiz'), verified: true, source: 'math.ch teacher-day slides, checked Nov 2026',
  }),

  // ------------------------------------------------------------ abroad (summer)
  P({
    ...ABROAD, id: 'yale-young-global-scholars', title: 'Yale Young Global Scholars', org: 'Yale University',
    type: 'Summer programme', categories: ['academic', 'leadership', 'science'], skills: ['Research', 'Communication', 'Leadership'],
    city: 'New Haven, USA', minAge: 16, maxAge: 18,
    eligibility: 'Ages 16–18 by mid-July, current sophomores or juniors (Swiss equivalent: 2nd-to-last or 3rd-to-last year). Open to all countries.',
    description: 'A selective two-week interdisciplinary summer session at Yale with students from 150+ countries.',
    details: 'For 2027: Early Action deadline 15 October 2026 (US$85 fee) and Regular Decision 6 January 2027 (US$100 fee). Need-based financial aid is available to students from all countries; residential only.',
    deadline: '2027-01-06', timing: 'Summer; apply by 6 Jan 2027', commitment: 'Two weeks, residential', cost: 'Tuition (about US$7,000 in 2026); financial aid available',
    url: 'https://globalscholars.yale.edu/', verified: true, source: 'globalscholars.yale.edu / YYGS 2027 listings, checked Nov 2026',
  }),
  P({
    ...ABROAD, id: 'harvard-secondary-school-program', title: 'Harvard Secondary School Program', org: 'Harvard Summer School',
    type: 'Summer programme', categories: ['academic', 'business', 'science'], skills: ['Research', 'Writing'],
    city: 'Cambridge, USA', minAge: 16, maxAge: 19,
    description: 'Take real Harvard summer courses alongside college students and potentially earn college credit.',
    url: 'https://summer.harvard.edu/high-school-programs/secondary-school-program/',
  }),
  P({
    ...ABROAD, id: 'stanford-pre-collegiate-institutes', title: 'Stanford Pre-Collegiate Summer Institutes', org: 'Stanford University',
    type: 'Summer programme', categories: ['academic', 'technology', 'science'], skills: ['Problem solving', 'Research'],
    city: 'Stanford, USA', minAge: 13, maxAge: 18,
    description: 'Intensive university-level subject courses for high-school students (age and grade requirements apply).',
    url: 'https://summerinstitutes.spcs.stanford.edu/',
  }),
  P({
    ...ABROAD, id: 'brown-pre-college', title: 'Brown Pre-College Programs', org: 'Brown University',
    type: 'Summer programme', categories: ['academic', 'arts', 'business', 'science'], skills: ['Research', 'Writing'],
    city: 'Providence, USA', minAge: 14, maxAge: 19,
    description: 'University-style summer courses for high-school students in many subjects.',
    url: 'https://precollege.brown.edu/',
  }),
  P({
    ...ABROAD, id: 'columbia-pre-college', title: 'Columbia Pre-College Programs', org: 'Columbia University',
    type: 'Summer programme', categories: ['academic', 'business', 'arts', 'science'], skills: ['Research', 'Communication'],
    city: 'New York, USA', minAge: 14, maxAge: 19,
    description: 'Summer courses in New York for high-school students, from business and politics to science and the arts.',
    url: 'https://precollege.sps.columbia.edu/',
  }),
  P({
    ...ABROAD, id: 'kcl-pre-university', title: 'King’s College London Pre-University Summer School', org: 'King’s College London',
    type: 'Summer programme', categories: ['academic', 'business', 'health'], skills: ['Research', 'Writing'],
    city: 'London, UK', minAge: 15, maxAge: 18,
    description: 'University-level subject courses in London for high-school students (course-specific age limits).',
    url: 'https://www.kcl.ac.uk/summer',
  }),
  P({
    ...ABROAD, id: 'ucl-pre-university-online', title: 'UCL Pre-University Online Summer Course', org: 'UCL Centre for Languages & International Education',
    type: 'Online course', categories: ['academic'], skills: ['Writing', 'Languages', 'Communication'],
    format: 'online', city: null, minAge: 16, maxAge: 18,
    eligibility: 'High-school students aged 16–18 in (or about to start) their final year, whose first language is not English.',
    description: 'A two-week online course building the academic and English skills for UK university study, across several subjects.',
    details: 'Small classes with tutor meetings. Earlier editions ran in late July–early August and cost around £850–£900. UCL also runs an on-campus Bartlett architecture summer school for 14–18-year-olds.',
    timing: 'Late July – early August', commitment: 'Two weeks online', cost: 'About £900',
    url: 'https://www.ucl.ac.uk/languages-international-education/', verified: true, source: 'UCL CLIE news / course listings, checked Nov 2026',
  }),
  P({
    ...ABROAD, id: 'toronto-pre-university', title: 'University of Toronto pre-university programmes', org: 'University of Toronto',
    type: 'Summer programme', categories: ['academic', 'business', 'science'], skills: ['Research'],
    city: 'Toronto, Canada', minAge: 14, maxAge: 18,
    description: 'Programmes for high-school students to experience university-level learning.',
    url: 'https://future.utoronto.ca/',
  }),
  P({
    ...ABROAD, id: 'immerse-education', title: 'Immerse Education summer schools', org: 'Immerse Education (private provider)',
    type: 'Summer programme', categories: ['academic', 'business', 'health', 'technology', 'arts'], skills: ['Research', 'Writing'],
    city: 'Oxford, Cambridge, London & others', minAge: 13, maxAge: 18,
    description: 'Paid, subject-specific summer courses in university cities, taught by academics. A private company, not a university programme.',
    url: 'https://www.immerse.education/',
  }),
  P({
    ...ABROAD, id: 'oxford-scholastica', title: 'Oxford Scholastica Academy', org: 'Oxford Scholastica (private provider)',
    type: 'Summer programme', categories: ['academic', 'business', 'health', 'technology'], skills: ['Research', 'Public speaking'],
    city: 'Oxford, UK', minAge: 12, maxAge: 18,
    description: 'Paid university-style summer courses in Oxford. A private company, not run by the University of Oxford.',
    url: 'https://www.oxfordscholastica.com/',
  }),

  // ------------------------------------------------------------ online, worldwide
  P({
    ...ONLINE, id: 'mit-bwsix-online', title: 'MIT Beaver Works online courses (BWSIx)', org: 'MIT Lincoln Laboratory — Beaver Works',
    type: 'Online course', categories: ['technology', 'science'], skills: ['Coding', 'Problem solving'],
    minAge: 14, maxAge: 19,
    eligibility: 'High-school students can take the online courses. The on-site summer institute itself is limited to US citizens and students at US high schools.',
    description: 'Online courses in Python, machine learning, autonomous vehicles and more — the prerequisite courses for MIT’s Beaver Works Summer Institute.',
    timing: 'Online, year-round', commitment: 'Self-paced', cost: 'Free',
    url: 'https://www.ll.mit.edu/outreach/beaver-works-summer-institute-online-courses', verified: true, source: 'll.mit.edu / BWSI FAQ, checked Nov 2026',
  }),
  P({
    ...ONLINE, id: 'mit-open-learning', title: 'MIT Open Learning (OpenCourseWare)', org: 'MIT',
    type: 'Online course', categories: ['academic', 'science', 'technology'], skills: ['Problem solving'],
    minAge: 14, maxAge: 19,
    description: 'Free MIT course materials and online courses you can study at your own pace.',
    timing: 'Any time', commitment: 'Self-paced', cost: 'Free',
    url: 'https://openlearning.mit.edu/',
  }),
  P({
    ...ONLINE, id: 'harvard-online-courses', title: 'Harvard online courses (HarvardX)', org: 'Harvard University',
    type: 'Online course', categories: ['academic', 'business', 'science', 'technology'], skills: ['Research'],
    minAge: 14, maxAge: 19,
    description: 'Free and paid online courses from Harvard; certificates are usually paid.',
    timing: 'Any time', commitment: 'Self-paced', cost: 'Many free to audit',
    url: 'https://pll.harvard.edu/',
  }),
  P({
    ...ONLINE, id: 'coursera', title: 'Coursera university courses', org: 'Coursera',
    type: 'Online course', categories: ['academic', 'business', 'technology', 'science', 'arts'], skills: ['Data analysis', 'Coding'],
    minAge: 13, maxAge: 19,
    eligibility: 'Check each course’s age rules (users under 18 may need a parent’s permission).',
    description: 'Online courses from universities worldwide, including EPFL and others.',
    timing: 'Any time', commitment: 'Self-paced', cost: 'Many free to audit; certificates paid',
    url: 'https://www.coursera.org/',
  }),
  P({
    ...ONLINE, id: 'edx', title: 'edX university courses', org: 'edX',
    type: 'Online course', categories: ['academic', 'science', 'technology', 'business'], skills: ['Problem solving'],
    minAge: 13, maxAge: 19,
    eligibility: 'Check each course’s age rules.',
    description: 'University-level online courses from institutions around the world.',
    timing: 'Any time', commitment: 'Self-paced', cost: 'Many free to audit; certificates paid',
    url: 'https://www.edx.org/',
  }),
];
