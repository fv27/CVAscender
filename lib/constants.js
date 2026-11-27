// Shared vocabulary for the whole app. Adding a country, interest or skill
// here makes it appear in onboarding, filters and matching automatically.

// CVAscender covers Switzerland and the United Kingdom. Every listing has a
// `country` ('CH' or 'GB'); listings with scope 'global' (online / abroad)
// show in both. Regions (Swiss cantons, UK nations and English regions) share
// one list so the `canton` field works for both countries.
const ALL_COUNTRIES = [
  { code: 'CH', name: 'Switzerland', regionLabel: 'Canton', regionPlural: 'cantons', example: 'Geneva' },
  { code: 'GB', name: 'United Kingdom', regionLabel: 'Region', regionPlural: 'regions', example: 'Manchester' },
];
// Switzerland only for now. The UK data (lib/uk.js) is kept and can be switched
// back on by adding 'GB' here and UK_LISTINGS in lib/opportunities.js.
export const ENABLED_COUNTRIES = ['CH'];
export const COUNTRIES = ALL_COUNTRIES.filter((c) => ENABLED_COUNTRIES.includes(c.code));
export const REGION = COUNTRIES[0]; // kept for older imports
export const countryName = (c) => ALL_COUNTRIES.find((x) => x.code === c)?.name || 'Switzerland';
export const countryInfo = (c) => ALL_COUNTRIES.find((x) => x.code === c) || ALL_COUNTRIES[0];

const SWISS_CANTONS = [
  ['AG', 'Aargau'], ['AI', 'Appenzell I.Rh.'], ['AR', 'Appenzell A.Rh.'], ['BE', 'Bern'], ['BL', 'Basel-Landschaft'],
  ['BS', 'Basel-Stadt'], ['FR', 'Fribourg'], ['GE', 'Geneva'], ['GL', 'Glarus'], ['GR', 'Graubünden'], ['JU', 'Jura'],
  ['LU', 'Lucerne'], ['NE', 'Neuchâtel'], ['NW', 'Nidwalden'], ['OW', 'Obwalden'], ['SG', 'St. Gallen'], ['SH', 'Schaffhausen'],
  ['SO', 'Solothurn'], ['SZ', 'Schwyz'], ['TG', 'Thurgau'], ['TI', 'Ticino'], ['UR', 'Uri'], ['VD', 'Vaud'], ['VS', 'Valais'],
  ['ZG', 'Zug'], ['ZH', 'Zurich'],
].map(([code, name]) => ({ code, name, country: 'CH' }));

// UK nations, and the nine English regions.
const UK_REGIONS = [
  ['UK-LDN', 'London'], ['UK-SE', 'South East England'], ['UK-SW', 'South West England'], ['UK-EE', 'East of England'],
  ['UK-EM', 'East Midlands'], ['UK-WM', 'West Midlands'], ['UK-YH', 'Yorkshire and the Humber'], ['UK-NW', 'North West England'],
  ['UK-NE', 'North East England'], ['UK-SCT', 'Scotland'], ['UK-WLS', 'Wales'], ['UK-NIR', 'Northern Ireland'],
].map(([code, name]) => ({ code, name, country: 'GB' }));

export const CANTONS = [...SWISS_CANTONS, ...UK_REGIONS];
export const regionsFor = (country) => CANTONS.filter((c) => c.country === (country || 'CH'));
export const cantonName = (c) => CANTONS.find((x) => x.code === c)?.name || c;
export const regionCountry = (c) => CANTONS.find((x) => x.code === c)?.country || 'CH';

// Real Swiss international & boarding schools live in lib/schools.js.
export { SCHOOLS } from './schools';

export const INTERESTS = [
  { id: 'technology', label: 'Technology', hue: '#2F5BFF' },
  { id: 'science', label: 'Science', hue: '#0E9F8E' },
  { id: 'sports', label: 'Sports', hue: '#FF7A1A' },
  { id: 'volunteering', label: 'Volunteering', hue: '#2E9E4F' },
  { id: 'business', label: 'Business', hue: '#B8860B' },
  { id: 'arts', label: 'Arts & culture', hue: '#D6336C' },
  { id: 'leadership', label: 'Leadership', hue: '#6E3FF3' },
  { id: 'academic', label: 'Academic programmes', hue: '#1F3A93' },
  { id: 'environment', label: 'Environment', hue: '#4B8B3B' },
  { id: 'health', label: 'Health & medicine', hue: '#E03E3E' },
];

export const SKILLS = [
  'Coding', 'Public speaking', 'Teamwork', 'Leadership', 'Research',
  'Problem solving', 'Creativity', 'Entrepreneurship', 'Communication',
  'Languages', 'Project management', 'Data analysis', 'Design', 'Writing',
];

// UK school years (England & Wales numbering; Scotland's S-years and Northern
// Ireland's years are shown alongside).
export const UK_SCHOOL_YEARS = [
  { value: 7, label: 'Year 7 / S1' },
  { value: 8, label: 'Year 8 / S2' },
  { value: 9, label: 'Year 9 / S3' },
  { value: 10, label: 'Year 10 / S4 (GCSE)' },
  { value: 11, label: 'Year 11 / S4–S5 (GCSE)' },
  { value: 12, label: 'Year 12 / S5 (Sixth form)' },
  { value: 13, label: 'Year 13 / S6 (Sixth form)' },
];
export const schoolYearsFor = (country) => (country === 'GB' ? UK_SCHOOL_YEARS : SCHOOL_YEARS);

// Year N = Grade N−1 (e.g. Year 11 is 10th grade). The value is the Year number.
export const SCHOOL_YEARS = [
  { value: 7, label: 'Year 7 / Grade 6' },
  { value: 8, label: 'Year 8 / Grade 7' },
  { value: 9, label: 'Year 9 / Grade 8' },
  { value: 10, label: 'Year 10 / Grade 9' },
  { value: 11, label: 'Year 11 / Grade 10' },
  { value: 12, label: 'Year 12 / Grade 11' },
  { value: 13, label: 'Year 13 / Grade 12 (final year)' },
];

export const SCOPES = [
  { id: 'internal', label: 'My school' },
  { id: 'local', label: 'Local (my canton)' },
  { id: 'national', label: 'National' },
  { id: 'global', label: 'Abroad / online worldwide' },
];

// Each opportunity type maps to a CV section and a "dimension"
// used by the CV gap analysis.
export const TYPES = {
  'Club': { kind: 'internal', cv: 'Clubs & activities', dim: 'activities' },
  'Sports team': { kind: 'internal', cv: 'Clubs & activities', dim: 'teamwork' },
  'Leadership role': { kind: 'internal', cv: 'Leadership & responsibility', dim: 'leadership' },
  'School event': { kind: 'internal', cv: 'Clubs & activities', dim: 'activities' },
  'School competition': { kind: 'internal', cv: 'Competitions & awards', dim: 'competitions' },
  'Extracurricular': { kind: 'internal', cv: 'Clubs & activities', dim: 'activities' },
  'University programme': { kind: 'external', cv: 'Academic programmes', dim: 'academic' },
  'Hackathon': { kind: 'external', cv: 'Competitions & awards', dim: 'competitions' },
  'Volunteering': { kind: 'external', cv: 'Volunteering', dim: 'community' },
  'Internship': { kind: 'external', cv: 'Work experience', dim: 'work' },
  'Academic competition': { kind: 'external', cv: 'Competitions & awards', dim: 'competitions' },
  'Summer programme': { kind: 'external', cv: 'Academic programmes', dim: 'academic' },
  'Online course': { kind: 'external', cv: 'Academic programmes', dim: 'academic' },
  'International programme': { kind: 'external', cv: 'International experience', dim: 'international' },
  'Research week': { kind: 'external', cv: 'Academic programmes', dim: 'academic' },
  'Mentoring programme': { kind: 'external', cv: 'Academic programmes', dim: 'academic' },
  'Outreach programme': { kind: 'external', cv: 'Clubs & activities', dim: 'activities' },
  'Civic programme': { kind: 'external', cv: 'Leadership & responsibility', dim: 'leadership' },
  'Entrepreneurship programme': { kind: 'external', cv: 'Work experience', dim: 'work' },
  'Youth organisation': { kind: 'external', cv: 'Leadership & responsibility', dim: 'leadership' },
  'Arts ensemble': { kind: 'external', cv: 'Clubs & activities', dim: 'teamwork' },
  'Language exchange': { kind: 'external', cv: 'International experience', dim: 'international' },
  'Sports club': { kind: 'external', cv: 'Clubs & activities', dim: 'teamwork' },
  // A bank product, not an activity: never shown on the CV or in gap analysis.
  'Youth bank account': { kind: 'external', cv: null, dim: null },
};

// The CV dimensions a well-rounded student profile usually covers.
export const DIMENSIONS = [
  { id: 'leadership', label: 'Leadership', blurb: 'Taking responsibility for people or projects.' },
  { id: 'work', label: 'Work experience', blurb: 'Seeing how a real workplace operates.' },
  { id: 'community', label: 'Community service', blurb: 'Giving time to a cause beyond yourself.' },
  { id: 'competitions', label: 'Competitions', blurb: 'Testing your skills against a clear bar.' },
  { id: 'academic', label: 'Academic stretch', blurb: 'Learning beyond the school syllabus.' },
  { id: 'teamwork', label: 'Team commitment', blurb: 'Showing up for a team over a season.' },
  { id: 'international', label: 'Languages & cultures', blurb: 'Working across language regions and cultures.' },
];

export const CV_SECTIONS = [
  'Leadership & responsibility', 'Work experience', 'Competitions & awards',
  'Academic programmes', 'Volunteering', 'International experience', 'Clubs & activities',
];

export const interestById = (id) => INTERESTS.find((i) => i.id === id);
