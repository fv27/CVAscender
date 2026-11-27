// ---------------------------------------------------------------------------
// Batch 10 (Nov 2026): the "Swiss network": local activities in every canton
// and in about 160 towns.
//
// HONESTY RULES (see CLAUDE.md):
//  * These are built from real, nationwide youth structures that have local
//    groups across Switzerland: scouts (Pfadi), Jubla, Cevi, the Red Cross,
//    Samaritans, lifesaving (SLRG/SSS), music schools, football, gymnastics,
//    swimming, tennis, athletics, chess clubs and so on.
//  * We did NOT check each town or canton one by one. Every listing is
//    therefore `verified: false` (the app shows "Not checked yet"), says
//    "in or near <town>", and links to a web search instead of a guessed
//    website. No names of specific clubs, no dates, no fees are invented.
//  * To upgrade a listing: find the real local club, replace `searchUrl`
//    with its `url`, and set `verified: true` with a `source`.
// ---------------------------------------------------------------------------

import { cantonName } from './constants';

const search = (q) => 'https://duckduckgo.com/?q=' + encodeURIComponent(q);
const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Main language of each canton (bilingual cantons: the town decides).
const LANG = {
  AG: 'de', AI: 'de', AR: 'de', BE: 'de', BL: 'de', BS: 'de', FR: 'fr', GE: 'fr', GL: 'de', GR: 'de', JU: 'fr', LU: 'de', NE: 'fr',
  NW: 'de', OW: 'de', SG: 'de', SH: 'de', SO: 'de', SZ: 'de', TG: 'de', TI: 'it', UR: 'de', VD: 'fr', VS: 'fr', ZG: 'de', ZH: 'de',
};

// [town, canton, language if different from the canton's]
const TOWNS = [
  // Zurich
  ['Zurich', 'ZH'], ['Winterthur', 'ZH'], ['Uster', 'ZH'], ['Dübendorf', 'ZH'], ['Dietikon', 'ZH'], ['Wetzikon', 'ZH'], ['Wädenswil', 'ZH'],
  ['Kloten', 'ZH'], ['Horgen', 'ZH'], ['Bülach', 'ZH'], ['Thalwil', 'ZH'], ['Adliswil', 'ZH'], ['Regensdorf', 'ZH'], ['Opfikon', 'ZH'],
  ['Schlieren', 'ZH'], ['Volketswil', 'ZH'], ['Illnau-Effretikon', 'ZH'], ['Küsnacht', 'ZH'], ['Meilen', 'ZH'], ['Stäfa', 'ZH'],
  ['Wallisellen', 'ZH'], ['Affoltern am Albis', 'ZH'], ['Männedorf', 'ZH'], ['Richterswil', 'ZH'],
  // Bern
  ['Bern', 'BE'], ['Biel/Bienne', 'BE'], ['Thun', 'BE'], ['Köniz', 'BE'], ['Burgdorf', 'BE'], ['Ostermundigen', 'BE'], ['Steffisburg', 'BE'],
  ['Langenthal', 'BE'], ['Spiez', 'BE'], ['Muri bei Bern', 'BE'], ['Worb', 'BE'], ['Münsingen', 'BE'], ['Lyss', 'BE'], ['Interlaken', 'BE'],
  ['Belp', 'BE'], ['Moutier', 'BE', 'fr'], ['Saint-Imier', 'BE', 'fr'],
  // Lucerne
  ['Lucerne', 'LU'], ['Emmen', 'LU'], ['Kriens', 'LU'], ['Horw', 'LU'], ['Ebikon', 'LU'], ['Sursee', 'LU'], ['Hochdorf', 'LU'], ['Willisau', 'LU'],
  // Central Switzerland
  ['Altdorf', 'UR'], ['Schwyz', 'SZ'], ['Freienbach', 'SZ'], ['Einsiedeln', 'SZ'], ['Küssnacht', 'SZ'], ['Lachen', 'SZ'],
  ['Sarnen', 'OW'], ['Stans', 'NW'], ['Zug', 'ZG'], ['Baar', 'ZG'], ['Cham', 'ZG'], ['Steinhausen', 'ZG'],
  // Glarus, Appenzell
  ['Glarus', 'GL'], ['Näfels', 'GL'], ['Appenzell', 'AI'], ['Herisau', 'AR'], ['Teufen', 'AR'],
  // Fribourg
  ['Fribourg', 'FR'], ['Bulle', 'FR'], ['Villars-sur-Glâne', 'FR'], ['Marly', 'FR'], ['Estavayer', 'FR'], ['Romont', 'FR'], ['Châtel-Saint-Denis', 'FR'],
  ['Murten', 'FR', 'de'], ['Düdingen', 'FR', 'de'],
  // Solothurn
  ['Solothurn', 'SO'], ['Olten', 'SO'], ['Grenchen', 'SO'], ['Zuchwil', 'SO'], ['Dornach', 'SO'],
  // Basel
  ['Basel', 'BS'], ['Riehen', 'BS'], ['Liestal', 'BL'], ['Allschwil', 'BL'], ['Reinach', 'BL'], ['Muttenz', 'BL'], ['Pratteln', 'BL'],
  ['Binningen', 'BL'], ['Münchenstein', 'BL'], ['Oberwil', 'BL'],
  // Schaffhausen
  ['Schaffhausen', 'SH'], ['Neuhausen am Rheinfall', 'SH'],
  // St. Gallen
  ['St. Gallen', 'SG'], ['Rapperswil-Jona', 'SG'], ['Wil', 'SG'], ['Gossau', 'SG'], ['Uzwil', 'SG'], ['Altstätten', 'SG'], ['Buchs', 'SG'],
  ['Flawil', 'SG'], ['Rorschach', 'SG'], ['Wattwil', 'SG'], ['Sargans', 'SG'],
  // Graubünden
  ['Chur', 'GR'], ['Davos', 'GR'], ['Landquart', 'GR'], ['Domat/Ems', 'GR'], ['St. Moritz', 'GR'], ['Ilanz', 'GR'], ['Poschiavo', 'GR', 'it'], ['Roveredo', 'GR', 'it'],
  // Aargau
  ['Aarau', 'AG'], ['Baden', 'AG'], ['Wettingen', 'AG'], ['Wohlen', 'AG'], ['Brugg', 'AG'], ['Oftringen', 'AG'], ['Rheinfelden', 'AG'],
  ['Spreitenbach', 'AG'], ['Zofingen', 'AG'], ['Lenzburg', 'AG'], ['Bremgarten', 'AG'], ['Muri', 'AG'],
  // Thurgau
  ['Frauenfeld', 'TG'], ['Kreuzlingen', 'TG'], ['Arbon', 'TG'], ['Amriswil', 'TG'], ['Weinfelden', 'TG'], ['Romanshorn', 'TG'],
  // Ticino
  ['Lugano', 'TI'], ['Bellinzona', 'TI'], ['Locarno', 'TI'], ['Mendrisio', 'TI'], ['Chiasso', 'TI'], ['Biasca', 'TI'], ['Minusio', 'TI'],
  // Vaud
  ['Lausanne', 'VD'], ['Yverdon-les-Bains', 'VD'], ['Montreux', 'VD'], ['Renens', 'VD'], ['Nyon', 'VD'], ['Vevey', 'VD'], ['Pully', 'VD'],
  ['Morges', 'VD'], ['Gland', 'VD'], ['Prilly', 'VD'], ['Ecublens', 'VD'], ['La Tour-de-Peilz', 'VD'], ['Aigle', 'VD'], ['Bussigny', 'VD'],
  ['Payerne', 'VD'], ['Rolle', 'VD'], ['Epalinges', 'VD'], ['Crissier', 'VD'], ['Le Mont-sur-Lausanne', 'VD'], ['Moudon', 'VD'],
  // Valais
  ['Sion', 'VS'], ['Martigny', 'VS'], ['Monthey', 'VS'], ['Sierre', 'VS'], ['Conthey', 'VS'], ['Collombey-Muraz', 'VS'],
  ['Brig-Glis', 'VS', 'de'], ['Visp', 'VS', 'de'], ['Naters', 'VS', 'de'],
  // Neuchâtel
  ['Neuchâtel', 'NE'], ['La Chaux-de-Fonds', 'NE'], ['Le Locle', 'NE'], ['Val-de-Ruz', 'NE'], ['Boudry', 'NE'],
  // Geneva
  ['Geneva', 'GE'], ['Vernier', 'GE'], ['Lancy', 'GE'], ['Meyrin', 'GE'], ['Carouge', 'GE'], ['Onex', 'GE'], ['Thônex', 'GE'],
  ['Versoix', 'GE'], ['Le Grand-Saconnex', 'GE'], ['Chêne-Bougeries', 'GE'], ['Plan-les-Ouates', 'GE'], ['Bernex', 'GE'],
  // Jura
  ['Delémont', 'JU'], ['Porrentruy', 'JU'], ['Saignelégier', 'JU'],
];

// Other names students may type for the same town (matching compares these too).
export const TOWN_ALIASES = {
  Zurich: ['Zürich'], Geneva: ['Genève', 'Geneve', 'Genf'], Lucerne: ['Luzern'], Bern: ['Berne'], Basel: ['Bâle', 'Basle'],
  'Biel/Bienne': ['Biel', 'Bienne'], Fribourg: ['Freiburg'], Neuchâtel: ['Neuenburg'], 'St. Gallen': ['St Gallen', 'Saint-Gall'],
  Murten: ['Morat'], Sion: ['Sitten'], Sierre: ['Siders'], Delémont: ['Delsberg'], 'Brig-Glis': ['Brig'], 'Yverdon-les-Bains': ['Yverdon'],
};

// What every town listing is about. `q` is the search phrase per language.
const TOWN_ACTIVITIES = [
  {
    key: 'football', sport: 'football', type: 'Sports club', cats: ['sports'], skills: ['Teamwork', 'Leadership'], minAge: 8,
    title: 'Junior football', org: 'Local football clubs (Swiss Football Association)',
    q: { de: 'FC {t} Junioren', fr: 'FC {t} juniors', it: 'FC {t} allievi' },
    description: 'Join the junior section of a football club in or near {t}. Swiss clubs run junior teams by age group (Juniors A–G), for girls and boys.',
    commitment: 'Usually 2–3 trainings a week plus matches', cost: 'Club membership fee — ask the club',
  },
  {
    key: 'scouts', type: 'Youth organisation', cats: ['leadership', 'environment'], skills: ['Leadership', 'Teamwork', 'Project management'], minAge: 6,
    title: 'Scouts (Pfadi)', org: 'Scout groups (Swiss Guide and Scout Movement)',
    q: { de: 'Pfadi {t}', fr: 'scouts {t}', it: 'scout {t}' },
    description: 'Weekend activities, camps and — as you get older — leading younger members. Scout groups exist all over Switzerland; look for one in or near {t}.',
    commitment: 'Usually one afternoon most weekends plus camps', cost: 'Small yearly fee plus camp costs',
  },
  {
    key: 'music', type: 'Arts ensemble', cats: ['arts'], skills: ['Creativity', 'Teamwork'], minAge: 6,
    title: 'Music school: lessons, bands and orchestras', org: 'Local music school',
    q: { de: 'Musikschule {t}', fr: 'école de musique {t}', it: 'scuola di musica {t}' },
    description: 'Most Swiss towns have a public or subsidised music school with lessons, bands and youth orchestras. Find the one that serves {t}.',
    commitment: 'Weekly lessons; ensembles rehearse weekly', cost: 'Fees vary — often subsidised for residents',
  },
  {
    key: 'youthwork', type: 'Youth organisation', cats: ['leadership', 'volunteering'], skills: ['Communication', 'Project management', 'Leadership'], minAge: 12,
    title: 'Youth centre and youth projects', org: 'Local youth work (Jugendarbeit / animation jeunesse)',
    q: { de: 'Jugendarbeit {t}', fr: 'animation jeunesse {t}', it: 'centro giovani {t}' },
    description: 'Towns and regions run youth centres where you can organise events, start a project or help out. Look for youth work in or near {t}.',
    commitment: 'Drop in, or take on a project', cost: 'Usually free',
  },
  {
    key: 'gym', type: 'Sports club', cats: ['sports'], skills: ['Teamwork', 'Problem solving'], minAge: 6,
    title: 'Gymnastics club', org: 'Local gymnastics club (Swiss Gymnastics Federation)',
    q: { de: 'Turnverein {t} Jugend', fr: 'gym {t} jeunesse', it: 'società ginnastica {t}' },
    description: 'Gymnastics clubs are among the most common sports clubs in Switzerland, with youth groups for gymnastics, athletics and games. Look for one in or near {t}.',
    commitment: 'Usually 1–2 trainings a week', cost: 'Club membership fee — ask the club',
  },
  {
    key: 'swim', sport: 'swimming', type: 'Sports club', cats: ['sports'], skills: ['Problem solving', 'Teamwork'], minAge: 7,
    title: 'Swimming club', org: 'Local swimming club (Swiss Aquatics)',
    q: { de: 'Schwimmclub {t}', fr: 'club de natation {t}', it: 'società nuoto {t}' },
    description: 'Train with a swimming club in or near {t} — competitive groups, water polo or lifesaving, depending on the club.',
    commitment: 'Usually 2–4 trainings a week', cost: 'Club membership fee — ask the club',
  },
  {
    key: 'tennis', type: 'Sports club', cats: ['sports'], skills: ['Problem solving'], minAge: 7,
    title: 'Tennis club juniors', org: 'Local tennis club (Swiss Tennis)',
    q: { de: 'Tennisclub {t} Junioren', fr: 'tennis club {t} juniors', it: 'tennis club {t} juniori' },
    description: 'Many tennis clubs run junior training and interclub teams. Look for one in or near {t}.',
    commitment: 'Weekly junior training; interclub matches in season', cost: 'Membership plus training fees — ask the club',
  },
  {
    key: 'athletics', sport: 'athletics', type: 'Sports club', cats: ['sports'], skills: ['Problem solving'], minAge: 8,
    title: 'Athletics club', org: 'Local athletics club (Swiss Athletics)',
    q: { de: 'Leichtathletik {t} Jugend', fr: 'athlétisme {t} jeunesse', it: 'atletica {t} giovani' },
    description: 'Run, jump and throw with an athletics club in or near {t}. Clubs usually have youth groups (U10–U20) and take part in regional meetings.',
    commitment: 'Usually 2–3 trainings a week', cost: 'Club membership fee — ask the club',
  },
  {
    key: 'teamsport', type: 'Sports club', cats: ['sports'], skills: ['Teamwork', 'Communication'], minAge: 8,
    // Unihockey is huge in German-speaking Switzerland; basketball in the French and Italian parts.
    title: { de: 'Unihockey club juniors', fr: 'Basketball club youth teams', it: 'Basketball club youth teams' },
    org: { de: 'Local unihockey club (swiss unihockey)', fr: 'Local basketball club (Swiss Basketball)', it: 'Local basketball club (Swiss Basketball)' },
    sport: { de: 'unihockey', fr: 'basketball', it: 'basketball' },
    q: { de: 'Unihockey {t} Junioren', fr: 'basket {t} jeunesse', it: 'basket {t} giovanili' },
    description: 'A fast team sport with junior teams by age group. Look for a club in or near {t}.',
    commitment: 'Usually 2 trainings a week plus games', cost: 'Club membership fee — ask the club',
  },
  {
    key: 'chess', type: 'Club', cats: ['academic', 'science'], skills: ['Problem solving', 'Data analysis'], minAge: 8,
    title: 'Chess club', org: 'Local chess club (Swiss Chess Federation)',
    q: { de: 'Schachklub {t}', fr: "club d'échecs {t}", it: 'club scacchi {t}' },
    description: 'Learn openings and endgames, play in team leagues and youth tournaments. Look for a chess club in or near {t}.',
    commitment: 'One club evening a week; tournaments optional', cost: 'Small membership fee',
  },
];

const pick = (v, lang) => (typeof v === 'object' && v !== null ? v[lang] : v);

const townListing = ([town, canton, langOverride], a) => {
  const lang = langOverride || LANG[canton];
  const fill = (s) => s.replaceAll('{t}', town);
  return {
    id: `net-${a.key}-${slug(town)}`,
    title: `${pick(a.title, lang)} in ${town}`,
    org: pick(a.org, lang), type: a.type, categories: a.cats, skills: a.skills,
    ...(a.sport ? { sport: pick(a.sport, lang) } : {}),
    scope: 'local', format: 'in-person', city: town, canton, aliases: TOWN_ALIASES[town] || [],
    minAge: a.minAge, maxAge: 19,
    eligibility: 'Young people living in or near the town. Ask the group about ages and places.',
    description: fill(a.description),
    details: `We haven't checked the local clubs or groups for ${town} one by one, so the button opens a web search. Look for the official website of the club or service, then contact it about youth places.`,
    timing: 'Most groups take new members before each season or school year — contact them',
    commitment: a.commitment, cost: a.cost,
    searchUrl: search(fill(a.q[lang])),
    verified: false, finder: 'town',
    source: 'Generated from national organisations with local groups across Switzerland — local details not checked',
  };
};

// ---------------- One per canton ----------------
// `langs` limits an organisation to where it actually works (e.g. Jubla and
// Cevi are mainly in German-speaking Switzerland).
const CANTON_ACTIVITIES = [
  {
    key: 'scouts-assoc', type: 'Youth organisation', cats: ['leadership', 'environment'], skills: ['Leadership', 'Teamwork', 'Project management'], minAge: 6,
    title: 'Cantonal scouts association', org: 'Swiss Guide and Scout Movement — cantonal association',
    q: { de: 'Pfadi Kantonalverband {c}', fr: 'association cantonale scouts {c}', it: 'scoutismo ticino' },
    description: 'The scouts association of {c} groups every local scout troop in the canton — use it to find the one nearest you, plus cantonal camps and leader training.',
    commitment: 'Weekend activities plus camps', cost: 'Small yearly fee plus camp costs',
  },
  {
    key: 'jubla', langs: ['de'], type: 'Youth organisation', cats: ['leadership', 'volunteering'], skills: ['Leadership', 'Teamwork', 'Creativity'], minAge: 7,
    title: 'Jungwacht Blauring (Jubla)', org: 'Jungwacht Blauring Schweiz — cantonal branch',
    q: { de: 'Jubla Kanton {c}' },
    description: 'One of the biggest youth organisations in German-speaking Switzerland: group afternoons, summer camps, and from around 16 the chance to lead a group.',
    commitment: 'Group afternoons plus summer camp', cost: 'Small fee plus camp costs',
  },
  {
    key: 'cevi', langs: ['de'], type: 'Youth organisation', cats: ['leadership', 'volunteering'], skills: ['Leadership', 'Teamwork'], minAge: 6,
    title: 'Cevi youth groups', org: 'Cevi Schweiz — regional branch',
    q: { de: 'Cevi {c} Jungschar' },
    description: 'Cevi (YMCA/YWCA youth work) runs group afternoons, camps and leader training. Look for a group in {c}.',
    commitment: 'Group afternoons plus camps', cost: 'Small fee plus camp costs',
  },
  {
    key: 'redcross-youth', type: 'Volunteering', cats: ['volunteering', 'health'], skills: ['Communication', 'Teamwork'], minAge: 14,
    title: 'Red Cross youth volunteering', org: 'Swiss Red Cross — cantonal association',
    q: { de: 'Jugendrotkreuz {c}', fr: 'Croix-Rouge jeunesse {c}', it: 'Croce Rossa gioventù Ticino' },
    description: 'The cantonal Red Cross association in {c} runs projects young volunteers can join — tutoring, visits, events and fundraising.',
    commitment: 'Flexible — a few hours a month', cost: 'Free',
  },
  {
    key: 'babysitting', type: 'Outreach programme', cats: ['health', 'volunteering'], skills: ['Communication', 'Problem solving'], minAge: 12,
    title: 'Red Cross babysitting course', org: 'Swiss Red Cross — cantonal association',
    q: { de: 'SRK Babysitting Kurs {c}', fr: 'cours baby-sitting Croix-Rouge {c}', it: 'corso babysitter Croce Rossa Ticino' },
    description: 'A short course on looking after children safely — a classic first certificate for a CV and a way into babysitting jobs. Run by the Red Cross in {c}; check the minimum age.',
    commitment: 'A few sessions', cost: 'Course fee — see the cantonal Red Cross',
  },
  {
    key: 'first-aid', type: 'Outreach programme', cats: ['health'], skills: ['Problem solving', 'Communication'], minAge: 12,
    title: 'First-aid course (Samaritans)', org: 'Swiss Samaritans — cantonal association',
    q: { de: 'Samariter Nothilfekurs {c}', fr: 'samaritains cours premiers secours {c}', it: 'samaritani corso primi soccorsi Ticino' },
    description: 'Learn first aid with the Samaritans in {c}. Local sections run courses, and some have youth groups that help at events.',
    commitment: 'A one-day or two-evening course', cost: 'Course fee — see the section',
  },
  {
    key: 'lifesaving', type: 'Sports club', sport: 'swimming', cats: ['sports', 'health'], skills: ['Teamwork', 'Problem solving'], minAge: 10,
    title: 'Lifesaving (SLRG / SSS) youth', org: 'Swiss Lifesaving Society — regional sections',
    q: { de: 'SLRG Sektion {c} Jugend', fr: 'SSS sauvetage section {c} jeunesse', it: 'SSS salvataggio Ticino giovani' },
    description: 'Lifesaving sections train young swimmers in rescue skills and run the youth lifesaving certificates. Find a section in {c}.',
    commitment: 'Weekly training in season', cost: 'Membership plus course fees',
  },
  {
    key: 'fire-youth', type: 'Youth organisation', cats: ['volunteering', 'health'], skills: ['Teamwork', 'Leadership'], minAge: 10,
    title: 'Youth fire brigade', org: 'Local fire brigades — youth sections',
    q: { de: 'Jugendfeuerwehr {c}', fr: 'jeunes sapeurs-pompiers {c}', it: 'giovani pompieri Ticino' },
    description: 'Many fire brigades have a youth section (Jugendfeuerwehr / jeunes sapeurs-pompiers) that teaches teamwork, first aid and fire safety. Check what exists in {c}.',
    commitment: 'Usually monthly exercises', cost: 'Usually free',
  },
  {
    key: 'youth-parliament', type: 'Civic programme', cats: ['leadership'], skills: ['Public speaking', 'Leadership', 'Communication'], minAge: 14,
    title: 'Youth parliament or youth council', org: 'Youth parliaments (DSJ — Swiss youth parliaments association)',
    q: { de: 'Jugendparlament {c}', fr: 'parlement des jeunes {c}', it: 'consiglio cantonale dei giovani Ticino' },
    description: 'Debate, propose projects and talk to politicians. Many cantons and towns have a youth parliament or council — check which ones exist in {c}.',
    commitment: 'Monthly meetings plus sessions', cost: 'Free',
  },
  {
    key: 'js-camps', type: 'Summer programme', cats: ['sports'], skills: ['Teamwork', 'Leadership'], minAge: 10,
    title: 'Jugend+Sport holiday sports camps', org: 'Cantonal sports office (Jugend+Sport)',
    q: { de: 'kantonales Sportamt {c} Sportlager Jugend', fr: 'service des sports {c} camps J+S', it: 'Ticino ufficio sport campi G+S' },
    description: 'Cantonal sports offices and clubs run J+S camps in the holidays — ski camps, multi-sport weeks and more. From 18 you can train as a J+S leader.',
    commitment: 'Usually one week in the holidays', cost: 'Subsidised — see the camp',
  },
  {
    key: 'taster-job', type: 'Internship', cats: ['business'], skills: ['Communication', 'Problem solving'], minAge: 13,
    title: 'Job taster days (Schnupperlehre / stage)', org: 'Cantonal career guidance centre',
    q: { de: 'Berufsberatung {c} Schnupperlehre', fr: 'orientation scolaire et professionnelle {c} stage', it: 'orientamento professionale Ticino stage' },
    description: 'Spend a few days in a real workplace to try a job. The career guidance centre of {c} helps you find taster placements; berufsberatung.ch and yousty.ch list them nationally.',
    commitment: '1–5 days', cost: 'Free',
  },
  {
    key: 'volunteer-office', type: 'Volunteering', cats: ['volunteering'], skills: ['Communication', 'Teamwork'], minAge: 14,
    title: 'Volunteering office', org: 'Cantonal volunteering service (Benevol / Bénévolat)',
    q: { de: 'Benevol {c} Freiwilligenarbeit Jugendliche', fr: 'bénévolat {c} jeunes', it: 'volontariato Ticino giovani' },
    description: 'Find volunteering roles near you — events, sports, care homes, environment. Many cantons have a volunteering office that lists them.',
    commitment: 'Flexible', cost: 'Free',
  },
  {
    key: 'pronatura', type: 'Youth organisation', cats: ['environment', 'science'], skills: ['Research', 'Teamwork'], minAge: 8,
    title: 'Pro Natura youth groups', org: 'Pro Natura — cantonal section',
    q: { de: 'Pro Natura {c} Jugendgruppe', fr: 'Pro Natura {c} jeunes', it: 'Pro Natura Ticino giovani' },
    description: 'Nature outings, practical conservation work and camps with the Pro Natura section in {c}.',
    commitment: 'Monthly outings', cost: 'Small fee or free',
  },
  {
    key: 'wwf', type: 'Volunteering', cats: ['environment', 'volunteering'], skills: ['Teamwork', 'Communication'], minAge: 14,
    title: 'WWF volunteering', org: 'WWF Switzerland — regional office',
    q: { de: 'WWF {c} Freiwillige', fr: 'WWF {c} bénévoles', it: 'WWF Svizzera italiana volontari' },
    description: 'Help with nature-care days, events and campaigns run by WWF’s regional office for {c}.',
    commitment: 'Single days or regular', cost: 'Free',
  },
  {
    key: 'sac-youth', type: 'Sports club', cats: ['sports', 'environment'], skills: ['Teamwork', 'Leadership'], minAge: 10,
    title: 'Alpine Club youth (climbing & mountaineering)', org: 'Swiss Alpine Club SAC — local sections',
    q: { de: 'SAC Sektion {c} Jugend KiBe JO', fr: 'CAS section {c} jeunesse', it: 'CAS sezione Ticino gioventù' },
    description: 'SAC sections run youth groups for climbing, hiking and ski touring with trained leaders. Find a section in {c}.',
    commitment: 'Weekend tours plus climbing evenings', cost: 'Youth membership plus tour costs',
  },
  {
    key: 'youth-orchestra', type: 'Arts ensemble', cats: ['arts'], skills: ['Teamwork', 'Creativity'], minAge: 10,
    title: 'Youth orchestras, choirs and bands', org: 'Regional youth music ensembles',
    q: { de: 'Jugendorchester {c}', fr: 'orchestre des jeunes {c}', it: 'orchestra giovanile Ticino' },
    description: 'Play or sing with other young musicians. {c} has youth orchestras, choirs and wind bands — some by audition.',
    commitment: 'Weekly rehearsals or project weeks', cost: 'Varies — ask the ensemble',
  },
  {
    key: 'holiday-pass', type: 'Summer programme', cats: ['arts', 'sports', 'technology'], skills: ['Creativity', 'Teamwork'], minAge: 8, maxAge: 16,
    title: 'Holiday pass (Ferienpass / passeport vacances)', org: 'Towns and regions',
    q: { de: 'Ferienpass {c}', fr: 'passeport vacances {c}', it: 'passaporto vacanze Ticino' },
    description: 'Many towns sell a holiday pass with dozens of short activities — workshops, visits, sports tasters — in the school holidays. Check what exists in {c}.',
    commitment: 'Pick a few half-days', cost: 'Small fee',
  },
];

const cantonListing = (canton, a) => {
  const lang = LANG[canton];
  const name = cantonName(canton);
  const fill = (s) => s.replaceAll('{c}', name);
  return {
    id: `net-${a.key}-${canton.toLowerCase()}`,
    title: `${a.title} — ${name}`,
    org: a.org, type: a.type, categories: a.cats, skills: a.skills,
    ...(a.sport ? { sport: a.sport } : {}),
    scope: 'local', format: 'in-person', city: null, canton,
    minAge: a.minAge, maxAge: a.maxAge || 19,
    eligibility: `Young people in ${name}. Check ages and places with the organiser.`,
    description: fill(a.description),
    details: `We haven't checked the ${name} branch one by one, so the button opens a web search. Use the official website you find there — and confirm ages, dates and costs before you sign up.`,
    timing: 'See the organiser — many start with the school year',
    commitment: a.commitment, cost: a.cost,
    searchUrl: search(fill(a.q[lang] || a.q.de)),
    verified: false, finder: 'canton',
    source: 'Generated from national organisations with cantonal branches — cantonal details not checked',
  };
};

const CANTON_CODES = Object.keys(LANG);

export const BATCH10 = [
  ...CANTON_CODES.flatMap((c) => CANTON_ACTIVITIES.filter((a) => !a.langs || a.langs.includes(LANG[c])).map((a) => cantonListing(c, a))),
  ...TOWNS.flatMap((t) => TOWN_ACTIVITIES.map((a) => townListing(t, a))),
];

// Towns per canton (for onboarding hints).
export const TOWNS_BY_CANTON = TOWNS.reduce((acc, [t, c]) => ((acc[c] ||= []).push(t), acc), {});
