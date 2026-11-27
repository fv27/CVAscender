// ---------------------------------------------------------------------------
// Research mentorships and essay competitions (added 8 Nov 2026).
//
// All of these are run from outside Switzerland but are open to students who
// live here, so they use scope 'global' ("Abroad / online worldwide").
//
//  verified: true  → the basics (who runs it, who can enter, format, cost,
//                    dates where given) were checked on the date in `source`.
//  verified: false → a real organiser and link, but details NOT checked yet;
//                    the app shows "Not checked yet".
// Paid programmes say so plainly in `cost` — CVAscender does not endorse them.
// ---------------------------------------------------------------------------

const P = (o) => ({
  scope: 'global', format: 'online', city: null, canton: null,
  minAge: 14, maxAge: 18, commitment: 'Varies', cost: 'See the website',
  timing: 'See the website for current dates',
  verified: false, source: 'Not independently checked yet',
  ...o,
});

export const RESEARCH_ESSAYS = [
  // ============================================================ Research
  P({
    id: 'rise-research', title: 'RISE Research Program', org: 'RISE Research (RISE Global Education)',
    type: 'Mentoring programme', categories: ['science', 'academic', 'technology', 'business'], skills: ['Research', 'Writing', 'Data analysis'],
    minAge: 13, maxAge: 18,
    eligibility: 'High-school students (roughly grades 8–12) from any country.',
    description: 'Online 1-on-1 research mentorship: work with a university mentor on your own project in STEM, social sciences, business or humanities, with a writing coach.',
    details: 'Runs for about 3 months with flexible scheduling. It is a private, paid programme — check the price and any financial aid before applying.',
    timing: 'Several cohorts a year — check current intake dates', commitment: 'About 3 months, part-time', cost: 'Paid programme — see the website',
    url: 'https://riseglobaleducation.com/', verified: true, source: 'GoAbroad programme listing & partner-school pages, checked Nov 2026',
  }),
  P({
    id: 'lumiere-research-scholar', title: 'Lumiere Research Scholar Program', org: 'Lumiere Education',
    type: 'Mentoring programme', categories: ['science', 'academic', 'technology', 'business'], skills: ['Research', 'Writing', 'Problem solving'],
    minAge: 14, maxAge: 18,
    eligibility: 'High-school students worldwide. Accepted students usually have strong grades (about a 3.3/4 GPA or equivalent).',
    description: 'Work 1-on-1 with a PhD mentor for 12 weeks and finish with an independent, university-style research paper.',
    details: 'Founded by Harvard and Oxford researchers. The individual programme costs about USD 3,190; financial aid exists, and the Lumiere Research Inclusion Foundation offers free places to some students with financial need.',
    timing: 'Several cohorts a year — summer deadlines are usually March–May', commitment: '12 weeks, part-time', cost: 'About USD 3,190 (financial aid available)',
    url: 'https://www.lumiere-education.com/', verified: true, source: 'lumiere-education.com and Immerse Education guide, checked Nov 2026',
  }),
  P({
    id: 'polygence-core', title: 'Polygence research mentorship', org: 'Polygence',
    type: 'Mentoring programme', categories: ['science', 'academic', 'technology', 'arts'], skills: ['Research', 'Writing', 'Creativity'],
    minAge: 13, maxAge: 18,
    eligibility: 'High-school students from any country.',
    description: 'Online research with a mentor from a top university. “Pods” are short group projects for beginners; “Core” is a full 1-on-1 project.',
    timing: 'Rolling start dates', commitment: 'A few weeks to a few months', cost: 'Paid — Pods start at about USD 495',
    url: 'https://www.polygence.org/', verified: true, source: 'polygence.org research database, checked Nov 2026',
  }),
  P({
    id: 'pioneer-research', title: 'Pioneer Research Program', org: 'Pioneer Academics',
    type: 'Mentoring programme', categories: ['science', 'academic'], skills: ['Research', 'Writing'],
    minAge: 15, maxAge: 18,
    eligibility: 'High-school students worldwide — check the current requirements.',
    description: 'An online research programme where you write a research paper with a university professor in a small group and then on your own.',
    cost: 'Paid programme — see the website (aid may exist)',
    url: 'https://pioneeracademics.com/',
  }),
  P({
    id: 'rsi-mit', title: 'Research Science Institute (RSI) at MIT', org: 'Center for Excellence in Education & MIT',
    type: 'Summer programme', categories: ['science', 'technology', 'academic'], skills: ['Research', 'Problem solving', 'Data analysis'],
    format: 'in-person', minAge: 16, maxAge: 18, deadline: '2026-12-11',
    eligibility: 'Students in their penultimate year of school (US juniors; final-year students cannot apply). About a third of places go to international students — check CEE’s international route for Switzerland.',
    description: 'A free six-week summer of real research at MIT in maths, science and engineering, ending with a paper and a talk.',
    details: 'Around 100 students a year. The programme is free to attend. International applicants should confirm their route and deadline on cee.org before applying.',
    timing: 'Summer 2027 (six weeks, Cambridge, USA) — applications for 2027 due 11 Dec 2026', commitment: 'Six weeks full-time', cost: 'Free',
    url: 'https://www.cee.org/programs/research-science-institute', verified: true, source: 'cee.org and Immerse Education guide (updated 29 Oct 2026), checked Nov 2026',
  }),

  // ============================================================ Essays
  P({
    id: 'lumiere-essay-award', title: 'Lumiere Scholars Essay Award', org: 'Lumiere Education',
    type: 'Academic competition', categories: ['academic', 'arts', 'science', 'business'], skills: ['Writing', 'Research', 'Communication'],
    minAge: 14, maxAge: 18,
    eligibility: 'Anyone enrolled in high school (from any country). There is a separate junior contest for grades 6–8.',
    description: 'A free essay competition: pick a prompt in STEM, humanities or social sciences and write an academic argument of up to 2,000 words.',
    details: 'Held several times a year. Prizes are cash plus scholarships towards Lumiere’s own (paid) programmes. The autumn 2026 round closed on 2 November 2026.',
    timing: 'Several rounds a year — the autumn 2026 round has closed; watch for the next one', commitment: 'A few weeks of writing', cost: 'Free',
    url: 'https://www.lumiere-education.com/', verified: true, source: 'Lumiere Education & Internshala listing (2026 cycle), checked Nov 2026',
  }),
  P({
    id: 'lumiere-junior-essay', title: 'Lumiere Junior Scholars Essay Contest', org: 'Lumiere Education',
    type: 'Academic competition', categories: ['academic', 'arts'], skills: ['Writing', 'Research'],
    minAge: 11, maxAge: 14,
    eligibility: 'Middle-school students (grades 6–8, about ages 11–14) from any country.',
    description: 'The younger version of the Lumiere essay award — answer one prompt with a researched argument.',
    timing: 'Spring and autumn rounds — check the next deadline', commitment: 'A few weeks of writing', cost: 'Free',
    url: 'https://www.lumiere-education.com/', verified: true, source: 'lumiere-education.com (2026 Spring winners announcement), checked Nov 2026',
  }),
  P({
    id: 'john-locke-essay', title: 'John Locke Institute Global Essay Prize', org: 'John Locke Institute (Oxford)',
    type: 'Academic competition', categories: ['academic', 'leadership', 'business', 'arts'], skills: ['Writing', 'Research', 'Problem solving'],
    minAge: 12, maxAge: 18,
    eligibility: 'Students of any nationality under 19 on the submission deadline. Junior prize for under-15s.',
    description: 'One of the best-known essay prizes for school students: answer a hard question in economics, history, law, philosophy, politics, psychology and more (max 2,000 words).',
    details: 'Free to enter (a fee applies only to late entries). In 2026 questions came out in early February, registration closed on 31 March and essays were due on 31 May; shortlisted writers are invited to a conference and awards dinner. The institute is independent — it is not part of Oxford University.',
    timing: '2027 questions expected early in the year; register and submit in spring (2026 cycle: register by 31 Mar, submit by 31 May)', commitment: 'Several weeks of research and writing', cost: 'Free (late entry costs extra)',
    url: 'https://www.johnlockeinstitute.com/essay-competition', verified: true, source: 'John Locke Institute FAQ (2026 cycle), Oriel Admissions & Pioneer guides, checked Nov 2026',
  }),
  P({
    id: 'immerse-essay-competition', title: 'Immerse Education Essay Competition', org: 'Immerse Education',
    type: 'Academic competition', categories: ['academic', 'arts'], skills: ['Writing', 'Research'],
    minAge: 13, maxAge: 18,
    eligibility: 'Students aged 13–18 from any country with good written English.',
    description: 'Write a 500-word essay on a question from a subject you like for a chance to win a full or partial scholarship to an Immerse summer programme.',
    details: 'Free to enter. Prizes are scholarships to Immerse’s own paid programmes. Rounds usually close in September and January.',
    timing: '2027 competition — rounds usually close in September and January', commitment: 'A short essay', cost: 'Free',
    url: 'https://www.immerse.education/essay-competition', verified: true, source: 'immerse.education essay competition & competitions hub, checked Nov 2026',
  }),
  P({
    id: 'immerse-ted-competition', title: 'Immerse × TED Summer School Competition', org: 'Immerse Education with TED-Ed',
    type: 'Academic competition', categories: ['leadership', 'arts'], skills: ['Public speaking', 'Communication', 'Creativity'],
    minAge: 13, maxAge: 18, deadline: '2027-01-16',
    eligibility: 'Students aged 13–18 from any country.',
    description: 'Submit a short talk or script about an idea worth spreading to win a place at the Immerse × TED Summer School.',
    timing: 'Opened 2 Nov 2026 — deadline 16 Jan 2027', commitment: 'A short talk or script', cost: 'Free',
    url: 'https://www.immerse.education/immerse-competitions-hub', verified: true, source: 'Immerse Competitions Hub 2026–27, checked Nov 2026',
  }),
  P({
    id: 'horizon-essay-prize', title: 'Horizon Academic Essay Prize', org: 'Horizon Academic',
    type: 'Academic competition', categories: ['academic', 'arts'], skills: ['Writing', 'Research'],
    eligibility: 'High-school students aged 14–18 from any country — check the current rules.',
    description: 'A selective essay contest with submissions in winter and a summit for finalists in spring.',
    timing: 'Usually closes in early winter', cost: 'Free (check the website)',
    searchUrl: 'https://duckduckgo.com/?q=' + encodeURIComponent('Horizon Academic Essay Prize'),
  }),
  P({
    id: 'concord-review', title: 'The Concord Review — history essays', org: 'The Concord Review',
    type: 'Academic competition', categories: ['academic', 'arts'], skills: ['Writing', 'Research'],
    eligibility: 'Secondary-school students worldwide — check the current submission rules and any fee.',
    description: 'A journal that publishes long history research essays written by school students. Being published is a strong sign of serious research.',
    timing: 'Rolling submissions', commitment: 'A long research essay', cost: 'Check the website (there may be a submission fee)',
    url: 'https://www.tcr.org/',
  }),
  P({
    id: 'bennington-young-writers', title: 'Bennington Young Writers Awards', org: 'Bennington College',
    type: 'Academic competition', categories: ['arts'], skills: ['Writing', 'Creativity'],
    eligibility: 'High-school students (grades 9–12) from any country — check the current rules.',
    description: 'Submit poetry, fiction or non-fiction to a long-running writing award from a US arts college.',
    timing: 'Usually closes in the autumn — check the next cycle', cost: 'Free (check the website)',
    searchUrl: 'https://duckduckgo.com/?q=' + encodeURIComponent('Bennington Young Writers Awards'),
  }),
  P({
    id: 'nyt-student-contests', title: 'New York Times student writing contests', org: 'The New York Times Learning Network',
    type: 'Academic competition', categories: ['arts', 'academic'], skills: ['Writing', 'Communication'],
    minAge: 13, maxAge: 19,
    eligibility: 'Students aged about 13–19 — check each contest’s rules on international entries.',
    description: 'Several free contests through the school year: personal essays, editorials, reviews and more.',
    timing: 'Different contests run through the school year', cost: 'Free',
    url: 'https://www.nytimes.com/section/learning',
  }),
];
