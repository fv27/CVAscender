// ---------------------------------------------------------------------------
// Opportunity listings — Switzerland.
//
// HONESTY RULES:
//  * `verified: true` → a REAL programme. Basic facts were checked in
//    November 2026 against the official page or reliable reporting (`source`).
//    Only facts found there are written. Exact dates change every year, so we
//    show `timing` (when it usually happens) instead of inventing deadlines.
//    The ONLY hard deadline below (`deadline`) is one published officially.
//  * Internal (school) activities come from lib/schools.js — real schools,
//    activities taken from each school's own website.
//
// Fields: canton = where it happens; cantons = eligibility restricted to
// students from these cantons.
// ---------------------------------------------------------------------------

import { LOCAL_CLUBS } from './clubs';
import { CLUB_LISTINGS } from './leagueClubs';
import { UNIVERSITY_PROGRAMMES } from './universityProgrammes';
import { MORE_PROGRAMMES, PATCHES } from './moreProgrammes';
import { RESEARCH_ESSAYS } from './researchEssays';
import { BATCH5 } from './batch5';
import { BATCH6 } from './batch6';
import { BATCH7 } from './batch7';
import { BATCH8 } from './batch8';
import { BATCH9 } from './batch9';
import { BATCH10 } from './batch10';
import { BATCH11 } from './batch11';
// UK listings are switched off for now (Switzerland only): import { UK_LISTINGS } from './uk';

const OLYMPIAD_ELIG = 'You attend a school in Switzerland or Liechtenstein, are under 20 and not yet at university.';
const OLYMPIAD_SRC = 'science.olympiad.ch / unibe.ch, checked Nov 2026';

const olympiad = (id, title, cats, skills, extra = {}) => ({
  id, title, org: 'Swiss Science Olympiad', type: 'Academic competition',
  categories: cats, skills, scope: 'national', format: 'hybrid', city: null, canton: null,
  minAge: 12, maxAge: 19, eligibility: OLYMPIAD_ELIG,
  timing: 'Annual rounds — check the official page for this year’s dates',
  commitment: 'Several rounds over the school year', cost: 'Free',
  url: 'https://science.olympiad.ch', verified: true, source: OLYMPIAD_SRC, ...extra,
});

export const OPPORTUNITIES = [
  // ======================= SCIENCE OLYMPIADS =======================
  olympiad('olymp-informatics', 'Swiss Olympiad in Informatics', ['technology', 'academic'], ['Coding', 'Problem solving'], {
    org: 'Swiss Olympiad in Informatics (SOI)', url: 'https://soi.ch', source: 'soi.ch, checked Nov 2026',
    description: 'A programming contest for under-20s. Start with an online first round, then workshops and a second round — the best go on to the International Olympiad in Informatics.',
    details: 'The first round runs online on the Olympiad Portal and only takes about 35 minutes; it is general algorithmic and logic questions, and basic programming helps but is not strictly required. SOI recommends taking part from age 12, and runs algorithm workshops to prepare you for the second round — even if you have little programming experience. Top participants are selected for the Swiss team at the International Olympiad in Informatics.',
    timing: 'First round every September (late participation possible)', commitment: 'From 35 minutes, up to a full season',
  }),
  olympiad('olymp-maths', 'Swiss Mathematical Olympiad', ['science', 'academic'], ['Problem solving', 'Research'], {
    description: 'Switzerland’s top maths competition for high-school students since 2004. The best represent the country at the IMO and EGMO.',
    details: 'Held every year since 2004, it brings together young maths enthusiasts from across Switzerland. Around 15 of the strongest participants represent Switzerland at international events such as the International Mathematical Olympiad (IMO) and the European Girls’ Mathematical Olympiad (EGMO).',
  }),
  olympiad('olymp-physics', 'Swiss Physics Olympiad', ['science', 'academic'], ['Problem solving', 'Research'], {
    description: 'A competition for gymnasium students that leads to the International (IPhO) and European (EuPhO) Physics Olympiads.',
    details: 'Several rounds of physics problems; finalists compete in a national final and the best are selected for the international and European olympiads.',
  }),
  olympiad('olymp-chemistry', 'Swiss Chemistry Olympiad', ['science', 'academic'], ['Research', 'Problem solving'], {
    url: 'https://chemistry.olympiad.ch',
    description: 'Hundreds of students take part; the finalists spend a week at ETH Zurich and the winners go to the International Chemistry Olympiad.',
    details: 'In recent editions more than 400 participants entered, and the national final was held at ETH Zurich. The four winners represent Switzerland at the International Chemistry Olympiad.',
  }),
  olympiad('olymp-biology', 'Swiss Biology Olympiad', ['science', 'health', 'academic'], ['Research', 'Problem solving'], {
    description: 'Test your biology beyond the syllabus and compete for a place in the Swiss team at the International Biology Olympiad.',
    details: 'One of the ten national Science Olympiads. Winners represent Switzerland internationally.',
  }),
  olympiad('olymp-geography', 'Swiss Geography Olympiad', ['science', 'environment', 'academic'], ['Research', 'Data analysis'], {
    description: 'Maps, climate, cities and landscapes — a national competition with a route to the International Geography Olympiad.',
    details: 'Part of the Swiss Science Olympiad since 2015.',
  }),
  olympiad('olymp-philosophy', 'Swiss Philosophy Olympiad', ['academic', 'arts'], ['Writing', 'Research', 'Communication'], {
    description: 'Write a philosophical essay on a big question and compete for a place at the International Philosophy Olympiad.',
    details: 'Part of the Swiss Science Olympiad since 2006.',
  }),
  olympiad('olymp-linguistics', 'Swiss Linguistics Olympiad', ['academic', 'arts'], ['Problem solving', 'Languages'], {
    description: 'Crack puzzles in languages you’ve never seen, using pure logic. No prior linguistics needed.',
    details: 'The newest Swiss Science Olympiad (since 2021). Winners represent Switzerland at the International Linguistics Olympiad.',
  }),
  olympiad('olymp-economics', 'Swiss Economics Olympiad', ['business', 'academic'], ['Problem solving', 'Entrepreneurship'], {
    org: 'Swiss Science Olympiad & YES',
    description: 'Economics, finance and entrepreneurship challenges — the national final leads to the International Economics Olympiad.',
    details: 'A joint project of YES (Young Enterprise Switzerland) and the Science Olympiad, offering practical support in economics, finance and entrepreneurship and a route to the International Economics Olympiad.',
  }),
  olympiad('olymp-astronomy', 'Swiss Astronomy Olympiad', ['science', 'academic'], ['Problem solving', 'Research'], {
    url: 'https://saao.ch', source: 'saao.ch / unibe.ch, checked Nov 2026',
    description: 'Stars, planets and the physics of the universe — a national competition for curious students.',
    details: 'Listed among the Swiss Science Olympiads by the University of Bern. Check the official page for rounds and dates.',
  }),
  {
    id: 'wro-switzerland', title: 'World Robot Olympiad Switzerland', org: 'WRO Switzerland',
    type: 'Academic competition', categories: ['technology', 'science'], skills: ['Coding', 'Teamwork', 'Design'],
    scope: 'national', format: 'in-person', city: null, canton: null, minAge: 8, maxAge: 19,
    eligibility: 'Teams of students; categories by age. See the official page for current rules.',
    description: 'Design, build and program robots in teams, at regional events across Switzerland.',
    details: 'WRO Switzerland is the robotics member of the Association of Science Olympiads. Regional events are hosted by partners around the country (for example in Winterthur, Thun and Yverdon).',
    timing: 'Seasonal — regional events then national final', commitment: 'Team project over several months', cost: 'See official page',
    url: 'https://wro.swiss', verified: true, source: 'wro.swiss, checked Nov 2026',
  },

  // ======================= SCHWEIZER JUGEND FORSCHT =======================
  {
    id: 'sjf-national', title: 'Swiss Youth in Science — National Competition', org: 'Schweizer Jugend forscht (SJf)',
    type: 'Academic competition', categories: ['science', 'academic', 'technology'], skills: ['Research', 'Writing', 'Public speaking'],
    scope: 'national', format: 'in-person', city: null, canton: null, minAge: 16, maxAge: 23,
    eligibility: 'Students aged about 16–23 at upper-secondary (gymnasium or vocational) level with their own research project.',
    description: 'Turn your Matura thesis or own project into a national award. Finalists present to an expert jury.',
    details: 'Many participants submit their Matura thesis. Selected projects reach a semi-final, then the national final, which takes place every year in late April. Awards include special prizes such as trips and international science competitions.',
    timing: 'Submit your project; final every year in late April', commitment: 'Your research project + jury rounds', cost: 'Free',
    url: 'https://sjf.ch', verified: true, source: 'sjf.ch / scnat.ch, checked Nov 2026',
  },
  {
    id: 'sjf-studyweeks', title: 'SJf Study Weeks', org: 'Schweizer Jugend forscht (SJf)',
    type: 'Research week', categories: ['science', 'academic', 'health'], skills: ['Research', 'Data analysis', 'Teamwork'],
    scope: 'national', format: 'in-person', city: null, canton: null, minAge: 16, maxAge: 20,
    eligibility: 'Highly motivated students aged 16–20.',
    description: 'Spend a week in a real research group — at a university or company lab — on your own mini project.',
    details: 'Each study week focuses on a field (for example chemistry and materials science, genetics, or humanities). Participants are placed in research groups, supervised by PhD students, and present their results at a closing event.',
    timing: 'Several study weeks every year', commitment: '1 week', cost: 'See official page',
    url: 'https://sjf.ch', verified: true, source: 'sjf.ch / epfl.ch / unifr.ch, checked Nov 2026',
  },
  {
    id: 'sjf-wildlife', title: 'International Wildlife Research Week', org: 'Schweizer Jugend forscht (SJf)',
    type: 'Research week', categories: ['science', 'environment'], skills: ['Research', 'Teamwork', 'Languages'],
    scope: 'national', format: 'in-person', city: 'Val Müstair', canton: 'GR', minAge: 16, maxAge: 20,
    eligibility: 'Young people from Switzerland and across Europe. See the official page for age and selection.',
    description: 'Discover alpine wildlife in Val Müstair (Graubünden) with young researchers from across Europe.',
    details: 'A field research week in the Swiss Alps, organised by Swiss Youth in Science.',
    timing: 'Yearly — check SJf for dates', commitment: '1 week', cost: 'See official page',
    url: 'https://sjf.ch', verified: true, source: 'sjf.ch, checked Nov 2026',
  },

  // ======================= UNIVERSITIES =======================
  {
    id: 'unige-athena', title: 'Athéna — early university study', org: 'University of Geneva, Faculty of Science',
    type: 'University programme', categories: ['science', 'academic'], skills: ['Research', 'Problem solving'],
    scope: 'local', format: 'in-person', city: 'Geneva', canton: 'GE', cantons: ['GE'],
    minAge: 15, maxAge: 20, minYear: 11, maxYear: 13,
    eligibility: 'Geneva collège students. Admission is based on a file with grades and teacher assessments.',
    description: 'Follow a real university course in physics or maths alongside UNIGE students, with weekly tutoring.',
    details: 'Athéna is an early-study programme in physics and mathematics run by the Faculty of Science. Admitted students attend a university course from a set list during the autumn semester, plus two extra hours of tutoring a week. Students can sit the exam, and credits can count if they later study the subject at UNIGE.',
    timing: 'Course in the autumn semester', commitment: 'One university course + weekly tutoring', cost: 'See official page',
    url: 'https://www.unige.ch/sciences/fr/faculteetcite/programme-athena/', verified: true, source: 'unige.ch, checked Nov 2026',
  },
  {
    id: 'unige-mini-athena', title: 'Mini-Athéna', org: 'University of Geneva, Faculty of Science',
    type: 'University programme', categories: ['science', 'academic'], skills: ['Research', 'Problem solving'],
    scope: 'local', format: 'in-person', city: 'Geneva', canton: 'GE', cantons: ['GE'], minAge: 14, maxAge: 18, minYear: 9, maxYear: 11,
    eligibility: 'Open to students in their 1st and 2nd year of collège in Geneva.',
    description: 'An extension of Athéna for younger collège students: a university-level course in the spring semester.',
    details: 'UNIGE announces the course for the spring semester 2027, with registrations during autumn 2026. Check the official page for the course and how to register.',
    timing: 'Registrations autumn 2026 · course spring 2027', commitment: 'One course for a semester', cost: 'See official page',
    url: 'https://www.unige.ch/sciences/fr/faculteetcite/programme-athena/', verified: true, source: 'unige.ch, checked Nov 2026',
  },
  {
    id: 'epfl-euler', title: 'Cours Euler (gifted maths)', org: 'EPFL',
    type: 'University programme', categories: ['science', 'academic'], skills: ['Problem solving', 'Research'],
    scope: 'local', format: 'in-person', city: 'Lausanne', canton: 'VD', minAge: 10, maxAge: 18,
    eligibility: 'Very motivated students with high maths potential, admitted through an entry competition. Mainly students from Romandie.',
    description: 'A six-year maths programme at EPFL every Wednesday afternoon, from secondary school maths up to first-year university level.',
    details: 'The course covers maths from 9H to Matura twice as fast and more theoretically, then first-year EPFL topics (advanced linear algebra and analysis, discrete maths, physics). Students are excused from maths at their school and do about 8–10 hours of homework a week. Classes run at EPFL from 14:15 to 17:00 every Wednesday. Entry is via a competition; 10H students can join year two, with registrations from December.',
    timing: 'Entry competition each year; 10H registrations open in December', commitment: 'Wednesday afternoons + 8–10 h homework/week', cost: 'Annual fee (see official page)',
    url: 'https://www.epfl.ch/education/education-and-science-outreach/fr/cours-euler/', verified: true, source: 'epfl.ch, checked Nov 2026',
  },
  {
    id: 'epfl-mardimathiques', title: 'Mardimathiques', org: 'EPFL',
    type: 'University programme', categories: ['science', 'academic'], skills: ['Problem solving'],
    scope: 'local', format: 'in-person', city: 'Lausanne', canton: 'VD', minAge: 11, maxAge: 14,
    eligibility: 'Ages 11–14 who love maths.',
    description: 'Tuesday maths workshops for 11–14-year-olds who want to go further than school — more playful and more serious.',
    details: 'Topics that could be studied at school, but explored much more deeply. Especially suited to students waiting a year before (re)taking the Cours Euler entry test — though it is not a preparation course.',
    timing: 'Semester workshops', commitment: 'Weekly sessions', cost: 'See official page',
    url: 'https://www.epfl.ch/education/education-and-science-outreach/fr/jeunepublic/ateliers-semestriels/mardimathiques/', verified: true, source: 'epfl.ch, checked Nov 2026',
  },
  {
    id: 'epfl-coding-girls', title: 'Coding club des filles', org: 'EPFL',
    type: 'Outreach programme', categories: ['technology'], skills: ['Coding', 'Problem solving'],
    scope: 'local', format: 'in-person', city: 'Lausanne', canton: 'VD', minAge: 11, maxAge: 16,
    eligibility: 'Girls aged 11–16.',
    description: 'Encourages girls aged 11–16 to explore STEM by building IT and coding skills.',
    details: 'Part of EPFL’s science outreach for young people. Check the outreach pages for current sessions and locations.',
    timing: 'Check EPFL outreach for sessions', commitment: 'Regular sessions', cost: 'See official page',
    url: 'https://www.epfl.ch/education/education-and-science-outreach/', verified: true, source: 'epfl.ch, checked Nov 2026',
  },
  {
    id: 'unibas-schuelerstudium', title: 'Schülerstudium — University of Basel', org: 'University of Basel',
    type: 'University programme', categories: ['academic', 'science'], skills: ['Research', 'Writing'],
    scope: 'local', format: 'in-person', city: 'Basel', canton: 'BS', cantons: ['BS', 'BL', 'SO', 'AG'], minAge: 15, maxAge: 20, minYear: 11,
    eligibility: 'Especially strong gymnasium students from Basel-Stadt, Basel-Landschaft, Solothurn and Aargau. Selection through your school plus an interview.',
    description: 'Attend real university lectures before your Matura and earn credit points. Around 95 students take part each year.',
    details: 'You register through the Schülerstudium contact person at your gymnasium. For Basel-Stadt gymnasia, the published deadline for the spring semester 2027 is 11 January 2027 (semester starts 22 February 2027). Other cantons may have different internal deadlines — ask your school.',
    deadline: '2027-01-11', timing: 'Spring semester 2027 deadline (Basel-Stadt): 11 Jan 2027', commitment: 'One or more courses per semester', cost: 'See official page',
    url: 'https://www.unibas.ch', verified: true, source: 'unibas.ch / bs.ch flyer, checked Nov 2026',
  },
  {
    id: 'uzh-schuelerstudium', title: 'Schüler:innenstudium — University of Zurich', org: 'University of Zurich (UZH)',
    type: 'University programme', categories: ['academic', 'science'], skills: ['Research', 'Writing'],
    scope: 'local', format: 'in-person', city: 'Zurich', canton: 'ZH', minAge: 16, maxAge: 20, minYear: 12,
    eligibility: 'Students in the last two years before the Matura at a participating school. Your school registers you — UZH does not accept direct applications.',
    description: 'Take UZH modules before your Matura. ECTS credits can count towards a later UZH degree. No fees.',
    details: 'For broadly gifted, motivated and academically interested students. Places are limited. Talk to your school about whether it participates.',
    timing: 'Per semester, via your school', commitment: '1–4 semesters', cost: 'Free',
    url: 'https://www.uzh.ch/de/studies/programs/pupils.html', verified: true, source: 'uzh.ch, checked Nov 2026',
  },
  {
    id: 'eth-studienwochen', title: 'ETH Study Weeks for gymnasium students', org: 'ETH Zurich',
    type: 'Research week', categories: ['science', 'technology', 'academic'], skills: ['Research', 'Problem solving'],
    scope: 'national', format: 'in-person', city: 'Zurich', canton: 'ZH', minAge: 15, maxAge: 20,
    eligibility: 'Gymnasium students interested in science and technology.',
    description: 'A week at ETH working on projects in a chosen field — a real taste of studying at ETH.',
    details: 'Participants from across Switzerland work on projects in their chosen discipline and present them at the end of the week.',
    timing: 'Yearly — check ETH for dates', commitment: '1 week', cost: 'See official page',
    url: 'https://www.ethz.ch/studienwochen', verified: true, source: 'ethz.ch, checked Nov 2026',
  },
  {
    id: 'cern-bl4s', title: 'Beamline for Schools', org: 'CERN',
    type: 'Academic competition', categories: ['science', 'technology'], skills: ['Research', 'Teamwork', 'Writing'],
    scope: 'national', format: 'hybrid', city: 'Geneva', canton: 'GE', minAge: 16, maxAge: 20,
    eligibility: 'Teams of at least five high-school students (16+) with at least one adult coach.',
    description: 'Propose a physics experiment — the winning teams run it on a real particle beamline.',
    details: 'A global physics competition run by CERN. Teams submit a proposal for an experiment that uses a beamline; winners travel to carry it out with support from scientists. A team from the International School of Geneva won in 2020.',
    timing: 'Annual edition — proposals usually due in spring', commitment: 'Team proposal over a few months', cost: 'Free',
    url: 'https://beamline-for-schools.web.cern.ch', verified: true, source: 'home.cern, checked Nov 2026',
  },

  // ======================= TECH & CYBER =======================
  {
    id: 'swiss-hacking-challenge', title: 'Swiss Hacking Challenge', org: 'Swiss Cyber Storm',
    type: 'Hackathon', categories: ['technology'], skills: ['Coding', 'Problem solving'],
    scope: 'national', format: 'online', city: null, canton: null, minAge: 15, maxAge: 25,
    eligibility: 'Anyone can play the qualifiers for fun. To compete for the national team you must be 15–25 and a Swiss citizen.',
    description: 'Switzerland’s national hacking championship: solve capture-the-flag challenges and aim for the national team.',
    details: 'Online qualifiers in a Jeopardy-style CTF format. The best are selected for the Swiss team at the European Cyber Security Challenge. It is also the official SwissSkills qualifier for cybersecurity.',
    timing: 'Online qualifiers usually start 1 March', commitment: 'Online qualifiers + finals', cost: 'Free',
    url: 'https://swisscyberstorm.com', verified: true, source: 'swisscyberstorm.com, checked Nov 2026',
  },
  {
    id: 'informatik-biber', title: 'Informatik-Biber (Bebras)', org: 'SVIA',
    type: 'Academic competition', categories: ['technology', 'academic'], skills: ['Problem solving', 'Coding'],
    scope: 'national', format: 'online', city: null, canton: null, minAge: 8, maxAge: 19,
    eligibility: 'School years 3–13. Your teacher registers the class.',
    description: 'A 40-minute online computational-thinking contest. No prior knowledge needed.',
    details: 'Run every November in Switzerland by the Swiss association for computer science in education (SVIA) and coordinated through schools. Tens of thousands of Swiss students take part.',
    timing: 'Every November, via your school', commitment: '40 minutes', cost: 'Free',
    url: 'https://www.informatik-biber.ch', verified: true, source: 'netzwoche.ch / bwinf.de, checked Nov 2026',
  },
  {
    id: 'first-lego-league', title: 'FIRST LEGO League Challenge', org: 'HANDS on TECHNOLOGY (DACH)',
    type: 'Academic competition', categories: ['technology', 'science'], skills: ['Coding', 'Teamwork', 'Research'],
    scope: 'national', format: 'in-person', city: null, canton: null, minAge: 9, maxAge: 16,
    eligibility: 'Teams of 2–10 members aged 9–16 with an adult coach.',
    description: 'Build and program a LEGO robot and run a research project — regional events across Germany, Austria and Switzerland.',
    details: 'Teams compete in robot design, the robot game, research and core values. Winners advance from regional events to finals; a recent grand finale was held in Davos.',
    timing: 'Season runs autumn to spring', commitment: 'Team project over several months', cost: 'See official page',
    url: 'https://www.first-lego-league.org/de/', verified: true, source: 'first-lego-league.org / university reports, checked Nov 2026',
  },
  {
    id: 'swiss-tecladies', title: 'Swiss TecLadies mentoring', org: 'SATW — Swiss Academy of Engineering Sciences',
    type: 'Mentoring programme', categories: ['technology', 'science', 'leadership'], skills: ['Coding', 'Design', 'Communication'],
    scope: 'national', format: 'hybrid', city: null, canton: null, minAge: 13, maxAge: 16,
    eligibility: 'Girls aged 13–16. Qualify through the online Tec-Challenge.',
    description: 'Nine months with a personal female mentor from tech, plus workshops on technical careers.',
    details: 'A national programme of the SATW. Girls apply after completing an online Tec-Challenge; selected mentees are paired with a mentor and attend workshops at companies and universities across German-speaking, French-speaking and Italian-speaking Switzerland.',
    timing: 'Applications usually in spring for a September start', commitment: '9 months', cost: 'Free',
    url: 'https://www.tecladies.ch', verified: true, source: 'satw.ch, checked Nov 2026',
  },

  // ======================= CIVIC, BUSINESS & DEBATE =======================
  {
    id: 'jugendsession', title: 'Federal Youth Session', org: 'SAJV — Swiss National Youth Council',
    type: 'Civic programme', categories: ['leadership', 'volunteering'], skills: ['Public speaking', 'Leadership', 'Teamwork'],
    scope: 'national', format: 'in-person', city: 'Bern', canton: 'BE', minAge: 14, maxAge: 21,
    eligibility: '200 young people aged 14–21 who live in Switzerland or are Swiss citizens. Party membership not required.',
    description: 'Four days in the Federal Palace in Bern: debate in working groups and vote on demands handed to Parliament.',
    details: 'Held every year since 1993. Participants work in groups on topics they choose and adopt petitions in the National Council chamber. Schools are recommended by the cantons to excuse participants from class.',
    timing: 'Every November in Bern', commitment: '4 days + preparation', cost: 'See official page',
    url: 'https://www.sajv.ch', verified: true, source: 'swissinfo.ch / EDK, checked Nov 2026',
  },
  {
    id: 'yes-company-programme', title: 'YES Company Programme', org: 'YES — Young Enterprise Switzerland',
    type: 'Entrepreneurship programme', categories: ['business', 'leadership'], skills: ['Entrepreneurship', 'Teamwork', 'Project management'],
    scope: 'national', format: 'in-person', city: null, canton: null, minAge: 16, maxAge: 20,
    eligibility: 'Students aged 16–20 at upper-secondary and vocational schools — your school must take part.',
    description: 'Found and run a real mini-company for a school year: real products, real customers, real competition.',
    details: 'Teams take roles such as CEO or CMO, raise starting capital by issuing participation certificates, and compete in pitch competitions and a national final. Around 1,000–1,500 students take part each year.',
    timing: 'School year, starting August', commitment: 'One school year', cost: 'Via your school',
    url: 'https://yes.swiss', verified: true, source: 'yes.swiss / heg-fr.ch / myclimate.org, checked Nov 2026',
  },
  {
    id: 'jugend-debattiert', title: 'Jugend debattiert / La jeunesse débat', org: 'YES — Young Enterprise Switzerland',
    type: 'Academic competition', categories: ['leadership', 'academic'], skills: ['Public speaking', 'Research', 'Communication'],
    scope: 'national', format: 'in-person', city: null, canton: null, minAge: 13, maxAge: 20,
    eligibility: 'Students at participating schools. School, regional and national rounds.',
    description: 'Debate current political and economic questions — you only find out your side (pro or contra) just before.',
    details: 'A Swiss education project with school-internal and regional heats leading to a national final in Bern. Motions are real current issues.',
    timing: 'Regional rounds in winter, national final in spring', commitment: 'Prep + debate days', cost: 'Free',
    url: 'https://yes.swiss', verified: true, source: 'srf.ch / yes.swiss, checked Nov 2026',
  },

  // ======================= VOLUNTEERING & YOUTH ORGANISATIONS =======================
  {
    id: 'jugendrotkreuz', title: 'Youth Red Cross volunteering', org: 'Swiss Red Cross — cantonal associations',
    type: 'Volunteering', categories: ['volunteering', 'health'], skills: ['Communication', 'Teamwork'],
    scope: 'local', format: 'in-person', city: null, canton: null, minAge: 15, maxAge: 30,
    eligibility: 'Young volunteers aged about 15–30, through your cantonal Red Cross association.',
    description: 'Volunteer with your canton’s Youth Red Cross: mentoring, tutoring, sports afternoons and support for young refugees.',
    details: 'Cantonal Youth Red Cross groups (for example in Basel, Zurich and Aargau) each have hundreds of young volunteers. Projects vary by canton.',
    timing: 'Join any time', commitment: 'Flexible', cost: 'Free',
    url: 'https://www.redcross.ch', verified: true, source: 'Red Cross cantonal job postings, checked Nov 2026',
  },
  {
    id: 'pfadi', title: 'Become a Scout leader (Pfadi / Scouts)', org: 'Swiss Guide and Scout Movement',
    type: 'Youth organisation', categories: ['leadership', 'volunteering', 'sports'], skills: ['Leadership', 'Teamwork', 'Project management'],
    scope: 'local', format: 'in-person', city: null, canton: null, minAge: 13, maxAge: 25,
    eligibility: 'Join a local group. Leadership training starts around 13–14; you lead from about 17.',
    description: 'Switzerland’s largest youth organisation. Lead activities and camps, and earn Jugend+Sport (J+S) leader recognition.',
    details: 'Around 50,000 members in some 530 local groups in every canton. The training path includes the Leitpfadi course (13–14) and later the Basiskurs, which leads to J+S leader recognition for planning camps and activities.',
    timing: 'Join any time', commitment: 'Weekly + camps', cost: 'Membership fee (local)',
    url: 'https://pfadi.swiss', verified: true, source: 'pfadi.swiss, checked Nov 2026',
  },

  // ======================= ARTS & LANGUAGES =======================
  {
    id: 'sjso', title: 'Swiss Youth Symphony Orchestra (SJSO)', org: 'Schweizer Jugend-Sinfonie-Orchester',
    type: 'Arts ensemble', categories: ['arts'], skills: ['Teamwork', 'Creativity'],
    scope: 'national', format: 'in-person', city: null, canton: null, minAge: 15, maxAge: 25,
    eligibility: 'Young musicians aged 15–25. Entry by audition.',
    description: 'Switzerland’s national youth orchestra: rehearsal weeks and concert tours in the biggest Swiss cities.',
    details: 'Founded in 1969, it brings together musicians from all language regions for a rehearsal weekend, a rehearsal week and spring and autumn tours.',
    timing: 'Auditions before each project', commitment: 'Rehearsal week + tour', cost: 'See official page',
    url: 'https://www.sjso.ch', verified: true, source: 'sjso.ch / press, checked Nov 2026',
  },
  {
    id: 'jsoz', title: 'Jugend Sinfonieorchester Zürich (JSOZ)', org: 'Musikschule Konservatorium Zürich',
    type: 'Arts ensemble', categories: ['arts'], skills: ['Teamwork', 'Creativity'],
    scope: 'local', format: 'in-person', city: 'Zurich', canton: 'ZH', minAge: 14, maxAge: 24,
    eligibility: 'Musicians aged 14–24. Entry by audition (technique, musicality, intonation, rhythm).',
    description: 'A 90-member youth orchestra that performs across Switzerland and tours abroad.',
    details: 'Founded in 1987. Audition details are sent after you register for a project.',
    timing: 'Auditions per project', commitment: 'Regular rehearsals + concerts', cost: 'See official page',
    url: 'https://www.stadt-zuerich.ch/betriebssites/mkz/de/angebot/angebot-finden/musizieren/eliteformationen/jsoz.html', verified: true, source: 'stadt-zuerich.ch, checked Nov 2026',
  },
  {
    id: 'movetia-exchange', title: 'Language exchange in another Swiss region', org: 'Movetia — national agency for exchange',
    type: 'Language exchange', categories: ['academic', 'arts'], skills: ['Languages', 'Communication'],
    scope: 'national', format: 'in-person', city: null, canton: null, minAge: 11, maxAge: 20,
    eligibility: 'Holiday exchange for ages 11–15; upper-secondary students can do individual or class exchanges through their school and canton.',
    description: 'Live with a family in another language region of Switzerland — and host your partner in return.',
    details: 'Movetia supports exchanges between Swiss language regions. The holiday exchange pairs students aged 11–15 with a partner family; older students can arrange exchanges through their school, often with Movetia funding.',
    timing: 'Holiday exchanges or during the school year', commitment: '1–2 weeks (holiday) or longer', cost: 'Often subsidised',
    url: 'https://www.movetia.ch', verified: true, source: 'movetia.ch / cantonal pages, checked Nov 2026',
  },

  // ======================= MORE PROGRAMMES (added Nov 2026) =======================
  {
    id: 'wirtschaftswoche', title: 'Wirtschaftswoche — run a company for a week', org: 'Wirtschaftsbildung.ch with regional chambers of commerce',
    type: 'Entrepreneurship programme', categories: ['business', 'leadership'], skills: ['Entrepreneurship', 'Teamwork', 'Data analysis'],
    scope: 'national', format: 'in-person', city: null, canton: null, minAge: 15, maxAge: 19,
    eligibility: 'Upper-secondary classes (Gymnasium / Mittelschule). Your school books the week.',
    description: 'Your class becomes the management of competing companies in a business simulation, coached by people from industry.',
    details: 'Teams make dozens of decisions per business year in the WIWAG simulation (developed with the University of St. Gallen) and present results. In 2025 there were 177 Wirtschaftswochen with about 4,500 students.',
    timing: 'During the school year — ask your teacher if your school runs one', commitment: 'One project week', cost: 'Organised through your school',
    url: 'https://www.wirtschaftsbildung.ch', verified: true, source: 'Wirtschaftsbildung.ch annual report 2025 / regional press, checked Nov 2026',
  },
  {
    id: 'soi-workshops', title: 'SOI programming workshops & second round', org: 'Swiss Olympiad in Informatics',
    type: 'Academic competition', categories: ['technology', 'academic'], skills: ['Coding', 'Problem solving'],
    scope: 'national', format: 'hybrid', city: null, canton: null, minAge: 12, maxAge: 19,
    eligibility: 'Young people under 20 in Switzerland. No experience needed for the beginners’ track.',
    description: 'Free weekend workshops that teach programming and algorithms, with a beginners’ and an advanced track.',
    details: 'Workshops run in October–November in Lausanne, Bern and Zurich. The second round of SOI 2027 runs online from 1 October to 30 November 2026. SOI pays all costs of its camps (travel, accommodation, food).',
    deadline: '2026-11-30', timing: 'Workshops Oct–Nov; second round closes 30 Nov 2026', commitment: 'Weekend workshops + tasks at home', cost: 'Free',
    url: 'https://soi.ch', verified: true, source: 'soi.ch timeline, checked Nov 2026',
  },
  {
    id: 'soi-girls', title: 'SOI Girls Camp & girls’ training', org: 'Swiss Olympiad in Informatics',
    type: 'Summer programme', categories: ['technology', 'academic'], skills: ['Coding', 'Problem solving'],
    scope: 'national', format: 'in-person', city: null, canton: null, minAge: 12, maxAge: 19,
    eligibility: 'Girls under 20 in Switzerland.',
    description: 'A one-week camp and girls-only training events to learn algorithms and programming.',
    details: 'SOI runs a girls-only camp each year (in 2026: 5–11 September) and other girls’ events. It also selects the Swiss team for the European Girls’ Olympiad in Informatics (EGOI).',
    timing: 'Camp usually in early September', commitment: 'One week', cost: 'Free',
    url: 'https://soi.ch', verified: true, source: 'soi.ch, checked Nov 2026',
  },
  {
    id: 'informatiktage-zh', title: 'Informatiktage Zürich', org: 'Informatiktage (40+ companies and organisations)',
    type: 'Outreach programme', categories: ['technology'], skills: ['Coding', 'Design'],
    scope: 'local', format: 'in-person', city: 'Zurich', canton: 'ZH', minAge: 11, maxAge: 19,
    eligibility: 'School classes, young people and the public; some workshops are just for girls.',
    description: 'A week of free IT workshops, talks and tours run by Zurich tech companies, ETH and others.',
    details: 'Past workshops included programming a micro:bit, building video games in Unity, Python for girls and Raspberry Pi. Most days are for school classes; there is usually a public day.',
    timing: 'Usually in March — programme on the website', commitment: 'Single workshops', cost: 'Free',
    url: 'https://informatiktage.ch', verified: true, source: 'informatiktage.ch / zh.ch press releases, checked Nov 2026',
  },
  {
    id: 'youngtech-hslu', title: 'Youngtech@hslu tech workshops', org: 'Lucerne University of Applied Sciences (HSLU)',
    type: 'Outreach programme', categories: ['technology', 'science'], skills: ['Coding', 'Problem solving'],
    scope: 'local', format: 'in-person', city: 'Lucerne', canton: 'LU', minAge: 11, maxAge: 16,
    eligibility: 'Girls and boys up to 16.',
    description: 'Workshops on technology and computer science run by HSLU Informatik with the engineering department.',
    details: 'HSLU Informatik offers a range of activities for school students, from primary school to vocational school.',
    timing: 'Several dates a year — see the website', commitment: 'Single workshops', cost: 'See website',
    url: 'https://www.hslu.ch/de-ch/informatik/ueber-uns/future-talents/schulbesuche', verified: true, source: 'hslu.ch / technik-und-wissen.ch, checked Nov 2026',
  },
  {
    id: 'synt', title: 'Swiss Young Naturalists’ Tournament (SYNT)', org: 'Pro IYPT-CH',
    type: 'Academic competition', categories: ['science', 'academic'], skills: ['Research', 'Public speaking', 'Teamwork'],
    scope: 'national', format: 'in-person', city: 'Zurich', canton: null, minAge: 12, maxAge: 16,
    eligibility: 'Students aged 12–16 from anywhere in Switzerland. Held in English.',
    description: 'Investigate a science problem, then defend your results in a “Science Fight” against another team.',
    details: 'A free preparation workshop is offered. The best can be selected for the Swiss team at the International Young Naturalists’ Tournament. Meals are provided and an allowance is paid for accommodation if you live far away.',
    timing: 'Tournament usually in March–May; problems published months before', commitment: 'Project work over several months', cost: 'Free',
    url: 'https://swissynt.ch', verified: true, source: 'swissynt.ch, checked Nov 2026',
  },
  {
    id: 'sypt', title: 'Swiss Young Physicists’ Tournament (SYPT) & Physics Week', org: 'Pro IYPT-CH',
    type: 'Academic competition', categories: ['science', 'academic'], skills: ['Research', 'Public speaking', 'Problem solving'],
    scope: 'national', format: 'in-person', city: null, canton: null, minAge: 15, maxAge: 20,
    eligibility: 'Gymnasium students in Switzerland.',
    description: 'Team physics research competition — the older students’ version of SYNT, with a coached Physics Week to prepare.',
    details: 'During the SYPT Physics Week participants work on their chosen problem with experienced coaches. Pro IYPT-CH also selects the Swiss team for the International Young Physicists’ Tournament.',
    timing: 'Physics Week in winter; tournament in spring', commitment: 'Project work over several months', cost: 'See official page',
    url: 'https://swissynt.ch/en/pro-iypt-ch', verified: true, source: 'swissynt.ch / Cogito Foundation report, checked Nov 2026',
  },
  {
    id: 'sjmw-classica', title: 'Swiss Youth Music Competition — Classica', org: 'Schweizerischer Jugendmusikwettbewerb (SJMW)',
    type: 'Academic competition', categories: ['arts'], skills: ['Creativity', 'Public speaking'],
    scope: 'national', format: 'in-person', city: 'Zurich', canton: null, minAge: 8, maxAge: 20,
    eligibility: 'Young musicians aged 8–20 living in Switzerland or Liechtenstein (solo, chamber music, composition, FreeSpace).',
    description: 'National classical music competition with regional rounds (“Entrada”) in March and a final in Zurich.',
    details: 'First-prize winners in the Entrada go to the final. Categories change each year and include early music, contemporary music, free chamber music, composition and FreeSpace (improvisation, electronics, crossover).',
    timing: 'Online registration usually 1–30 November', commitment: 'Prepare a programme', cost: 'Registration fee',
    url: 'https://sjmw.ch', verified: true, source: 'sjmw.ch regulations 2026 / culturalpromotion.ch, checked Nov 2026',
  },
  {
    id: 'sjmw-jazzpop', title: 'Swiss Youth Music Competition — Jazz & Pop', org: 'Schweizerischer Jugendmusikwettbewerb (SJMW)',
    type: 'Academic competition', categories: ['arts'], skills: ['Creativity', 'Teamwork'],
    scope: 'national', format: 'hybrid', city: 'Zurich', canton: null, minAge: 8, maxAge: 20,
    eligibility: 'Solo acts, duos and bands (up to 8) living in Switzerland.',
    description: 'Send a live video, play a live pre-selection, and the best acts perform at the “Come Together” in Zurich.',
    details: 'Live pre-selections are held in March (e.g. Lausanne and Basel); the final weekend is in Zurich in early May. Jurors include people from music universities and artists.',
    timing: 'Video pre-selection by end of November', commitment: 'Prepare a set', cost: 'CHF 60 solo / CHF 25–30 per person for groups',
    url: 'https://sjmw.ch', verified: true, source: 'sjmw.ch Jazz&Pop regulations 2026, checked Nov 2026',
  },
  {
    id: 'jugendfilmtage', title: 'Swiss Youth Film Days — short-film competition', org: 'Schweizer Jugendfilmtage',
    type: 'Academic competition', categories: ['arts', 'technology'], skills: ['Creativity', 'Teamwork', 'Design'],
    scope: 'national', format: 'in-person', city: 'Zurich', canton: null, minAge: 10, maxAge: 25,
    eligibility: 'Young filmmakers living in Switzerland or with Swiss nationality. Categories: up to 12, 16, 19 and 25 (plus film students up to 30).',
    description: 'Switzerland’s biggest festival for young filmmakers — submit a short film of any genre.',
    details: 'Selected films are screened at the festival in Zurich and judged by a jury, with prize money. The festival also offers free film coaching for school classes and youth groups.',
    timing: 'Submit films made in the previous two years — see the website for this year’s deadline', commitment: 'Make a short film', cost: 'Free to enter',
    url: 'https://www.jugendfilmtage.ch', verified: true, source: 'jugendfilmtage.ch flyer 2027 / regional press, checked Nov 2026',
  },
  {
    id: 'bergwaldprojekt', title: 'Bergwaldprojekt youth project weeks', org: 'Bergwaldprojekt (foundation, Trin GR)',
    type: 'Volunteering', categories: ['volunteering', 'environment'], skills: ['Teamwork', 'Problem solving'],
    scope: 'national', format: 'in-person', city: null, canton: null, minAge: 13, maxAge: 20,
    eligibility: 'School classes and youth groups.',
    description: 'Spend a week working in a Swiss mountain forest with professional foresters: building paths, planting trees, protecting young trees.',
    details: 'In 2025 more than 1,000 young people took part — a record. A project leader visits your class before the week. A contribution towards costs is charged.',
    timing: 'Spring to autumn — your class or group books a week', commitment: 'One week', cost: 'Contribution to costs',
    url: 'https://www.bergwaldprojekt.ch', verified: true, source: 'bergwaldprojekt.ch annual reports 2024–25, checked Nov 2026',
  },
  {
    id: 'gkb-bergwald-sommerjobs', title: 'Summer jobs in the mountain forest (GKB Bergwaldprojekt)', org: 'Graubündner Kantonalbank & Bergwaldprojekt',
    type: 'Internship', categories: ['environment', 'volunteering'], skills: ['Teamwork'],
    scope: 'local', format: 'in-person', city: 'Trin', canton: 'GR', minAge: 15, maxAge: 19,
    eligibility: 'Fit, weatherproof 15- to 19-year-olds.',
    description: 'Paid summer weeks working in the Graubünden mountain forest — about 60 places a year.',
    details: 'The GKB has run these project weeks with the Bergwaldprojekt for over ten years; applications have usually opened in spring at gkb.ch/sommerjobs.',
    timing: 'Applications usually in spring (April)', commitment: 'One summer week', cost: 'Paid summer job',
    url: 'https://www.gkb.ch/sommerjobs', verified: true, source: 'gkb.ch press releases 2020–23, checked Nov 2026',
  },
  {
    id: 'cevi', title: 'Cevi — youth group & leader training', org: 'Cevi Schweiz',
    type: 'Youth organisation', categories: ['volunteering', 'leadership'], skills: ['Leadership', 'Teamwork', 'Project management'],
    scope: 'national', format: 'in-person', city: null, canton: null, minAge: 11, maxAge: 20,
    eligibility: 'Open to children and teenagers; teenagers can become volunteer leaders.',
    description: 'Switzerland’s third-biggest youth association: weekend activities, camps and training to become a leader.',
    details: 'Cevi has about 13,000 members in over 200 local groups and runs over 80 training courses and about 300 camps a year. Groups are led by young volunteers.',
    timing: 'Join any time; camps in the holidays', commitment: 'Most Saturdays + camps', cost: 'Small membership fee',
    url: 'https://www.cevi.ch', verified: true, source: 'cevi.ch / pfadi.swiss joint press release, checked Nov 2026',
  },
  {
    id: 'jubla', title: 'Jungwacht Blauring (Jubla)', org: 'Jungwacht Blauring Schweiz',
    type: 'Youth organisation', categories: ['volunteering', 'leadership'], skills: ['Leadership', 'Teamwork', 'Communication'],
    scope: 'national', format: 'in-person', city: null, canton: null, minAge: 11, maxAge: 20,
    eligibility: 'Children and teenagers in German-speaking Switzerland; open to all regardless of ability, background or religion.',
    description: 'Group activities, nature and camps — teenagers grow into volunteer leaders.',
    details: 'Jubla has around 400 local groups and about 32,000 members. Its volunteer leaders put in around 3 million hours a year, including training courses.',
    timing: 'Join any time; summer camps', commitment: 'Regular group meetings + camps', cost: 'Small membership fee',
    url: 'https://www.jubla.ch', verified: true, source: 'jubla.ch, checked Nov 2026',
  },
  {
    id: 'slrg-jugendbrevet', title: 'SLRG lifesaving — youth brevet & lifeguard training', org: 'Swiss Lifesaving Society (SLRG/SSS)',
    type: 'Volunteering', categories: ['health', 'sports', 'volunteering'], skills: ['Teamwork', 'Communication'],
    scope: 'national', format: 'in-person', city: null, canton: null, minAge: 10, maxAge: 20,
    eligibility: 'The Jugendbrevet is from age 10; adult lifeguard courses come later.',
    description: 'Learn water safety, how to raise the alarm and the first rescue techniques — then go on to lifeguard training.',
    details: 'Courses are run by the SLRG’s more than 130 local sections across Switzerland. Many sections also have training groups for lifesaving sport.',
    timing: 'Courses all year — find your local section', commitment: 'Short course', cost: 'Course fee — see your section',
    url: 'https://www.slrg.ch', verified: true, source: 'berufsberatung.ch / slrg.ch, checked Nov 2026',
  },
  {
    id: 'pronatura-jugend', title: 'Pro Natura youth nature groups', org: 'Pro Natura',
    type: 'Volunteering', categories: ['environment', 'volunteering'], skills: ['Teamwork', 'Leadership'],
    scope: 'national', format: 'in-person', city: null, canton: null, minAge: 10, maxAge: 20,
    eligibility: 'Young people; older teens can help lead groups.',
    description: 'Excursions, camps and hands-on conservation work with your cantonal Pro Natura youth group.',
    details: 'Pro Natura is active in every canton. Youth groups (“Jugendnaturschutz”) organise nature adventures and conservation actions, and are often looking for new young leaders — Pro Natura offers free J+S courses for active leaders.',
    timing: 'Programmes all year', commitment: 'Monthly outings + camps', cost: 'Small fees',
    url: 'https://www.pronatura.ch', verified: true, source: 'pronatura.ch / cantonal sections, checked Nov 2026',
  },
  {
    id: 'youth-parliaments', title: 'Join a youth parliament', org: 'Dachverband Schweizer Jugendparlamente (DSJ)',
    type: 'Civic programme', categories: ['leadership'], skills: ['Public speaking', 'Leadership', 'Communication'],
    scope: 'national', format: 'in-person', city: null, canton: null, minAge: 14, maxAge: 25,
    eligibility: 'Young people; each local or cantonal youth parliament sets its own rules.',
    description: 'Debate local issues, run projects and talk to politicians in your town’s or canton’s youth parliament.',
    details: 'The DSJ is the party-neutral umbrella organisation for youth parliaments in Switzerland and Liechtenstein; it supports existing ones and helps young people start new ones. It also runs easyvote and engage.ch.',
    timing: 'Join any time', commitment: 'Regular meetings', cost: 'Free',
    url: 'https://www.dsj.ch', verified: true, source: 'dsj.ch / cantonal pages, checked Nov 2026',
  },
  {
    id: 'js-leiterkurs', title: 'Jugend+Sport leader course (become a coach)', org: 'Federal Office of Sport (BASPO) — Jugend+Sport',
    type: 'Youth organisation', categories: ['sports', 'leadership'], skills: ['Leadership', 'Communication', 'Teamwork'],
    scope: 'national', format: 'in-person', city: null, canton: null, minAge: 16, maxAge: 25,
    eligibility: 'You must turn 17 in the calendar year of the course and plan to coach regularly in a club.',
    description: 'A 5–6 day course that qualifies you to lead training for 10–20-year-olds in your sport.',
    details: 'Courses run in many sports through the cantons and federations. You can lead J+S courses from age 18 (camp sports/trekking are an exception).',
    timing: 'Courses all year — book through your club or canton', commitment: '5–6 days', cost: 'Subsidised',
    url: 'https://www.jugendundsport.ch', verified: true, source: 'zh.ch / fr.ch / berufsberatung.ch, checked Nov 2026',
  },
  {
    id: '1418coach', title: '1418coach — assistant coach in your club', org: 'Jugend+Sport (cantonal sports offices)',
    type: 'Youth organisation', categories: ['sports', 'leadership'], skills: ['Leadership', 'Teamwork'],
    scope: 'national', format: 'in-person', city: null, canton: null, minAge: 14, maxAge: 18,
    eligibility: '14- to 18-year-olds who help lead training in a J+S sports club (offered by most cantons).',
    description: 'A short course to become an assistant coach before you are old enough for the full J+S leader course.',
    details: 'You get recognised as a 1418coach, which you can add to job applications, and your assistant work in the club can be paid.',
    timing: 'Courses through your canton', commitment: 'Short course + helping at training', cost: 'Usually free',
    url: 'https://www.jugendundsport.ch', verified: true, source: 'sz.ch 1418coach brochure / sg.ch, checked Nov 2026',
  },
  {
    id: 'unil-decouverte', title: 'UNIL Discovery Days (Journées Découverte)', org: 'University of Lausanne',
    type: 'University programme', categories: ['academic'], skills: ['Research', 'Communication'],
    scope: 'local', format: 'in-person', city: 'Lausanne', canton: 'VD', minAge: 16, maxAge: 20,
    eligibility: 'Students in their final year of gymnase, collège or lycée — and anyone thinking of studying at UNIL.',
    description: 'Sit in on real university lectures, meet student associations and get study advice.',
    details: 'Over two days, UNIL opens lectures in every faculty, with presentations, stands and one-to-one guidance interviews.',
    timing: 'Usually early December', commitment: '1–2 days', cost: 'Free',
    url: 'https://www.unil.ch/decouverte', verified: true, source: 'unil.ch programme / fmel.ch, checked Nov 2026',
  },
  {
    id: 'hsg-infotage', title: 'HSG information days & Law taster day', org: 'University of St. Gallen (HSG)',
    type: 'University programme', categories: ['academic', 'business'], skills: ['Research', 'Communication'],
    scope: 'local', format: 'in-person', city: 'St. Gallen', canton: 'SG', minAge: 16, maxAge: 20,
    eligibility: 'Students in their last years before the Matura.',
    description: 'Find out whether HSG suits you: information days, plus a Law (Jus) taster day with professors and students.',
    details: 'HSG holds information days for Matura students; the Jus-Schnuppertag presents the law bachelor programmes and campus life (next: Friday 5 March 2027).',
    timing: 'Information days in autumn; Jus taster day 5 March 2027', commitment: '1 day', cost: 'Free',
    url: 'https://www.unisg.ch', verified: true, source: 'unisg.ch, checked Nov 2026',
  },

  {
    id: 'samariter-help', title: 'Help — Samaritan youth groups (first aid)', org: 'Samariter Schweiz',
    type: 'Volunteering', categories: ['health', 'volunteering'], skills: ['Teamwork', 'Communication'],
    scope: 'national', format: 'in-person', city: null, canton: null, minAge: 8, maxAge: 18,
    eligibility: 'Children and teenagers (most groups take members from about 8).',
    description: 'Learn first aid in a fun way with a local Samaritan youth group — exercises, camps and helping at events.',
    details: 'Samariter Schweiz has about 130 youth groups (“Help”: Helfen, Erleben, Lernen, Plausch) with around 2,800 members, plus a national youth camp.',
    timing: 'Join any time — groups usually meet monthly', commitment: 'Monthly exercises + events', cost: 'Small membership fee',
    url: 'https://www.samariter.ch', verified: true, source: 'samariter.ch / presseportal.ch, checked Nov 2026',
  },

  // School activities (internal) are added from lib/schools.js below.
];
// League clubs: skip any club already covered by a hand-checked listing.
const normOrg = (x) => x.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const covered = LOCAL_CLUBS.map((c) => normOrg(c.org));
const leagueClubs = CLUB_LISTINGS.filter((c) => !covered.some((o) => o === normOrg(c.org) || o.startsWith(normOrg(c.org) + ' ')));
// ---------------------------------------------------------------------------
// MORE PROGRAMMES (batch 2, added 7 Nov 2026) — each checked against the
// organiser's site or a press report on the date in `source`.
// ---------------------------------------------------------------------------
OPPORTUNITIES.push(
  {
    id: 'stock-game-swiss-money-week', title: 'Investment strategy contest (stock market game)', org: 'Swiss Finance Museum, SIX and the SNB’s iconomix',
    type: 'Academic competition', categories: ['business', 'academic'], skills: ['Data analysis', 'Teamwork', 'Entrepreneurship'],
    scope: 'national', format: 'hybrid', city: 'Zurich', canton: null, minAge: 15, maxAge: 20,
    eligibility: 'Classes at Gymnasium / upper-secondary and vocational schools. Pilot in German-speaking Switzerland first; your teacher registers the class.',
    description: 'Teams build and defend an investment strategy in a stock market game launched by the Swiss stock exchange operator, the Finance Museum and the Swiss National Bank’s education programme.',
    details: 'A jury from SIX, the SNB and education and media experts judges the teams’ submissions. The award ceremony is planned for March 2027 at the SIX ConventionPoint in Zurich, during Swiss Money Week. A nationwide roll-out is planned after the pilot.',
    timing: 'School year 2026–27, awards in March 2027', commitment: 'A class project over several weeks', cost: 'Free for schools',
    url: 'https://www.finanzmuseum.ch/en/shared/events/2026/investment-strategy-contest.html', verified: true, source: 'finanzmuseum.ch (Swiss Money Week 2026 / contest page), checked Nov 2026',
  },
  {
    id: 'yes-pitch-competition', title: 'YES Pitch Competition (Romandie)', org: 'Young Enterprise Switzerland with HEG Fribourg',
    type: 'Entrepreneurship programme', categories: ['business', 'leadership'], skills: ['Entrepreneurship', 'Public speaking', 'Teamwork'],
    scope: 'national', format: 'in-person', city: 'Fribourg', canton: 'FR', minAge: 16, maxAge: 20,
    eligibility: 'Teams taking part in the YES Company Programme (mini-enterprises run by upper-secondary students).',
    description: 'Each student mini-company gets four minutes to pitch to a jury that judges originality, creativity and persuasiveness.',
    details: 'The 4th edition was held at HEG Fribourg on 7 February 2026 with 21 mini-enterprises and about 100 students aged 16 to 20. Around 1,500 students across Switzerland run a mini-company in the YES Company Programme each year.',
    timing: 'Usually early February', commitment: 'One day (plus your Company Programme year)', cost: 'Free for participating teams',
    url: 'https://heg-fr.ch/en/media-corner/news/yes-pitch-competition-2026/', verified: true, source: 'heg-fr.ch news, Feb 2026, checked Nov 2026',
  },
  {
    id: 'adopreneurs-fribourg', title: 'ADOpreneurs summer entrepreneurship week', org: 'HEG Fribourg (School of Management Fribourg)',
    type: 'Summer programme', categories: ['business'], skills: ['Entrepreneurship', 'Creativity', 'Public speaking'],
    scope: 'local', format: 'in-person', city: 'Fribourg', canton: 'FR', minAge: 13, maxAge: 18,
    eligibility: 'Teenagers — check the current age range and dates with HEG Fribourg.',
    description: 'A week-long summer immersion in entrepreneurship for teenagers, ending with a launch event where teams present their projects.',
    details: 'Started by HEG-FR professor Raphaël Gaudart, with the Fribourg Chamber of Commerce as first sponsor. Teens present to parents, professors and partner organisations at the end. Check that it runs this year before planning around it.',
    timing: 'Summer holidays', commitment: 'One week', cost: 'Ask HEG Fribourg',
    searchUrl: 'https://duckduckgo.com/?q=' + encodeURIComponent('ADOpreneurs HEG Fribourg'), verified: true, source: 'Global Entrepreneurship Monitor news article, checked Nov 2026',
  },
  {
    id: 'oxford-schools-switzerland', title: 'Oxford Schools’ Debating — Swiss national round', org: 'The Oxford Union, run in Switzerland by The Debate, Eloquence & Rhetoric Society',
    type: 'Academic competition', categories: ['leadership', 'academic'], skills: ['Public speaking', 'Communication', 'Research'],
    scope: 'national', format: 'in-person', city: 'Geneva', canton: null, minAge: 14, maxAge: 18,
    eligibility: 'High-school students aged 14–18 from anywhere in Switzerland — beginners welcome.',
    description: 'The Swiss national round of one of the world’s biggest school debating competitions; the best debaters represent Switzerland at the finals in Oxford.',
    details: 'The 2026 national round was held on 31 January at the University of Geneva, with applications from mid-December to mid-January; the international finals were at the Oxford Union in March. A participation fee applies.',
    timing: 'National round usually late January; sign-up December–January', commitment: 'One competition day (plus practice)', cost: 'Participation fee',
    url: 'https://oxfordschools.net', verified: true, source: 'mymun.com event page / oxford-union.org, checked Nov 2026',
  },
  {
    id: 'marche-de-lespoir', title: 'Marche de l’espoir — sponsored walk for children’s rights', org: 'Terre des Hommes Suisse',
    type: 'Volunteering', categories: ['volunteering'], skills: ['Communication', 'Project management'],
    scope: 'local', format: 'in-person', city: 'Geneva', canton: 'GE', minAge: 6, maxAge: 19,
    eligibility: 'Everyone — children and teenagers walk, and volunteers help run the day.',
    description: 'Find sponsors who pledge money per kilometre, then walk along the Geneva lakefront to raise funds for children’s rights projects.',
    details: 'Held on a Sunday in October on the quai du Mont-Blanc. The 2026 edition (the 35th) on 11 October supported projects in Haiti. Thousands of children and young people take part each year, helped by hundreds of volunteers.',
    timing: 'A Sunday in October each year', commitment: 'One day + finding sponsors beforehand', cost: 'Free (you raise money)',
    url: 'https://terredeshommessuisse.ch', verified: true, source: 'terredeshommessuisse.ch / geneve.com event listing, checked Nov 2026',
  },
  {
    id: 'agriviva', title: 'Agriviva — help out on a Swiss farm', org: 'Agriviva (formerly the Landdienst)',
    type: 'Volunteering', categories: ['volunteering', 'environment'], skills: ['Teamwork', 'Languages', 'Problem solving'],
    scope: 'national', format: 'in-person', city: null, canton: null, minAge: 14, maxAge: 24,
    eligibility: 'Young people aged 14 to 24.',
    description: 'Spend part of your holidays living with a farming family and helping with daily farm work — often in another language region.',
    details: 'Stays usually last 2 to 8 weeks with board, lodging, insurance and pocket money; you get a written certificate, which helps with apprenticeship applications. Around 1,000 young people take part each year.',
    timing: 'School holidays — book a farm on the website', commitment: '2–8 weeks', cost: 'Registration fee; you get pocket money',
    url: 'https://www.agriviva.ch', verified: true, source: 'Agriviva press releases / SRF, checked Nov 2026',
  },
  {
    id: 'benevol-jobs', title: 'Find a volunteering role near you (benevol-jobs.ch)', org: 'benevol Schweiz',
    type: 'Volunteering', categories: ['volunteering'], skills: ['Teamwork', 'Communication'],
    scope: 'national', format: 'in-person', city: null, canton: null, minAge: 14, maxAge: 19,
    eligibility: 'Depends on the role — filter for ones suitable for young people.',
    description: 'Switzerland’s biggest platform for volunteer roles, with thousands of organisations posting opportunities in German and French.',
    details: 'Run by benevol Schweiz, the umbrella of the regional volunteering centres. You can also record your volunteering in the “Dossier freiwillig engagiert”, which is useful for CVs.',
    timing: 'All year', commitment: 'From a few hours to regular roles', cost: 'Free',
    url: 'https://www.benevol-jobs.ch', verified: true, source: 'benevol.ch annual reports / berufsberatung.ch, checked Nov 2026',
  },
  {
    id: 'benevolat-vaud', title: 'Bénévolat-Vaud — volunteering in Vaud', org: 'Bénévolat-Vaud',
    type: 'Volunteering', categories: ['volunteering'], skills: ['Teamwork', 'Communication'],
    scope: 'local', format: 'in-person', city: 'Lausanne', canton: 'VD', minAge: 14, maxAge: 19,
    eligibility: 'Depends on the role.',
    description: 'Information and contacts for volunteering opportunities across the canton of Vaud.',
    details: 'Listed by the official Swiss careers site as the place to find volunteering in Vaud. Ask which roles are open to under-18s.',
    timing: 'All year', commitment: 'Varies', cost: 'Free',
    url: 'https://www.benevolat-vaud.ch', verified: true, source: 'berufsberatung.ch / orientation.ch, checked Nov 2026',
  },
  {
    id: 'schauspielhaus-jugendclubs', title: 'Youth theatre clubs at Schauspielhaus Zürich', org: 'Junges Schauspielhaus Zürich',
    type: 'Arts ensemble', categories: ['arts'], skills: ['Creativity', 'Public speaking', 'Teamwork'],
    scope: 'local', format: 'in-person', city: 'Zurich', canton: 'ZH', minAge: 14, maxAge: 24,
    eligibility: 'Young people aged 14 to 24 — no experience needed.',
    description: 'Make your own play: weekly rehearsals on a real Schauspielhaus rehearsal stage, ending with performances on one of its stages.',
    details: 'Clubs meet weekly from November to May to improvise, rehearse and build a piece together; in spring every club shows its play. There is a taster meeting at the start of the season.',
    timing: 'November to May; taster meeting in autumn', commitment: 'Weekly rehearsals', cost: 'Ask the theatre',
    url: 'https://www.schauspielhaus.ch/en/35589/junges-schauspielhaus', verified: true, source: 'schauspielhaus.ch youth club pages, checked Nov 2026',
  },
  {
    id: 'am-stram-gram-ateliers', title: 'Theatre workshops at Théâtre Am Stram Gram', org: 'Théâtre Am Stram Gram',
    type: 'Arts ensemble', categories: ['arts'], skills: ['Creativity', 'Public speaking', 'Writing'],
    scope: 'local', format: 'in-person', city: 'Geneva', canton: 'GE', minAge: 12, maxAge: 19,
    eligibility: 'Teenagers — check the age groups for each workshop.',
    description: 'Geneva’s theatre for young audiences runs acting and writing workshops, including intergenerational ones for teens and adults.',
    details: 'The theatre (Route de Frontenex 56) is a creation centre for children and young people; it also runs festivals and events where young people take part. Workshop places are limited.',
    timing: 'During the school year — sign up at the start of the season', commitment: 'Weekly workshops', cost: 'Course fee — see the website',
    url: 'https://www.amstramgram.ch', verified: true, source: 'amstramgram.ch / Le Temps, checked Nov 2026',
  },
  {
    id: 'schweizer-jugendchor', title: 'Swiss Youth Choir (Schweizer Jugendchor)', org: 'Schweizer Jugendchor',
    type: 'Arts ensemble', categories: ['arts'], skills: ['Teamwork', 'Creativity'],
    scope: 'national', format: 'in-person', city: null, canton: null, minAge: 16, maxAge: 25,
    eligibility: 'Experienced young singers — places are by audition. Check the current age range.',
    description: 'Switzerland’s national youth choir, which rehearses in project phases and performs in major concert halls.',
    details: 'Led by Nicolas Fink; it has recorded with Deutsche Grammophon and sings Handel’s Messiah at the Tonhalle Zürich on 20 December 2026. Auditions are held for new members.',
    timing: 'Project-based rehearsal phases', commitment: 'Several rehearsal weekends/weeks a year', cost: 'Ask the choir',
    searchUrl: 'https://duckduckgo.com/?q=' + encodeURIComponent('Schweizer Jugendchor Vorsingen'), verified: true, source: 'SRF Kulturclub / Deutsche Grammophon, checked Nov 2026',
  },
);

// The feed is based on where the student lives, not their school: school-only
// activities (lib/schools.js) are no longer listed, because most schools keep
// their clubs behind a student login.
OPPORTUNITIES.push(...LOCAL_CLUBS, ...leagueClubs);
{
  const have = new Set(OPPORTUNITIES.map((o) => o.id));
  for (const o of [...UNIVERSITY_PROGRAMMES, ...MORE_PROGRAMMES, ...RESEARCH_ESSAYS, ...BATCH5, ...BATCH6, ...BATCH7, ...BATCH8, ...BATCH9, ...BATCH10, ...BATCH11]) if (!have.has(o.id)) { have.add(o.id); OPPORTUNITIES.push(o); }
  for (const o of OPPORTUNITIES) if (PATCHES[o.id]) Object.assign(o, PATCHES[o.id]);
}

// Turn official dates into "days from now" so the UI can show countdowns.
const DAY = 864e5;
for (const o of OPPORTUNITIES) {
  // Country: listings without one are Swiss, except worldwide (online/abroad) ones.
  if (o.country === undefined) o.country = o.scope === 'global' ? null : 'CH';
  if (o.deadline) o.deadlineDays = Math.ceil((new Date(o.deadline + 'T23:59:00') - Date.now()) / DAY);
  if (o.deadlineDays === undefined) o.deadlineDays = null;
}

export const getOpportunity = (id) => OPPORTUNITIES.find((o) => o.id === id);

export function deadlineDate(o) {
  if (o.deadline) return new Date(o.deadline + 'T23:59:00');
  if (o.deadlineDays == null) return null;
  const d = new Date(); d.setHours(23, 59, 0, 0); d.setDate(d.getDate() + o.deadlineDays);
  return d;
}

export function deadlineLabel(o, short = true) {
  if (o.deadlineDays == null) return short ? (o.timing ? shortTiming(o.timing) : 'See official site') : (o.timing || 'See official site');
  if (o.deadlineDays < 0) return 'Deadline passed';
  if (o.deadlineDays === 0) return 'Closes today';
  if (o.deadlineDays === 1) return 'Closes tomorrow';
  if (o.deadlineDays <= 14) return `${o.deadlineDays} days left`;
  return 'Deadline ' + deadlineDate(o).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
const shortTiming = (t) => (t.length > 34 ? t.slice(0, 32).replace(/[\s,—·-]+\S*$/, '') + '…' : t);

export function locationLabel(o) {
  if (o.format === 'online') return o.scope === 'global' ? 'Online · worldwide' : 'Online · Switzerland';
  const where = o.city || 'Across Switzerland';
  return o.format === 'hybrid' ? `${where} · hybrid` : where;
}
