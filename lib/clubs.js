// ---------------------------------------------------------------------------
// Local sports clubs with youth sections — Geneva and Vaud (first batch).
//
// HONESTY RULES (same as the rest of the app):
//  * Every club below was checked in November 2026 against its own website,
//    the city or canton, its federation, or reliable reporting (`source`).
//  * We only write what we found. Training times, fees and trials change
//    every season, so students are told to contact the club.
// ---------------------------------------------------------------------------

const club = (id, title, org, city, canton, cats, skills, description, details, source, url, extra = {}) => ({
  id, title, org, type: 'Sports club', categories: ['sports', ...cats], skills,
  scope: 'local', format: 'in-person', city, canton, minAge: 11, maxAge: 19,
  eligibility: 'Young players who live nearby. Places and team levels vary — some teams hold trials.',
  description, details: details + ' Training times, fees and trials change every season — contact the club before joining.',
  timing: 'New seasons usually start in late summer — ask the club about trial sessions',
  commitment: 'Usually 2–4 trainings a week plus matches', cost: 'Club membership fee — see the club',
  url, verified: true, source, ...extra,
});

const TEAM = ['Teamwork', 'Leadership'];
const SOLO = ['Teamwork', 'Problem solving'];

export const LOCAL_CLUBS = [
  // ---------------- Geneva ----------------
  club('club-servette-fc-academie', 'Servette FC Académie (youth football)', 'Servette FC', 'Geneva', 'GE', [], TEAM,
    'The youth academy of Geneva’s Super League football club.',
    'Servette’s academy fields youth teams in age categories and has brought players into the first team.',
    'servettefc.ch / radiolac.ch, checked Nov 2026', 'https://servettefc.ch'),
  club('club-geneve-futur-hockey', 'Genève-Servette youth ice hockey (Genève Futur Hockey)', 'Genève-Servette HC', 'Geneva', 'GE', [], TEAM,
    'Youth ice hockey linked to Genève-Servette HC.',
    'Genève Futur Hockey is a non-profit association created by Genève-Servette HC to develop young Geneva players; it has coached around 600 young players across teams in Meyrin, Trois-Chêne and Genève-Servette.',
    'gshc.ch / Ville de Genève, checked Nov 2026', 'https://www.gshc.ch'),
  club('club-lions-de-geneve-juniors', 'Lions de Genève youth basketball', 'Lions de Genève — Mouvement Junior', 'Geneva', 'GE', [], TEAM,
    'Youth basketball with Geneva’s top-division club, from U6 to U20.',
    'The Lions’ separate youth association has about 450 young players from U6 to U20.',
    'lionsdegeneve.ch / blick.ch, checked Nov 2026', 'https://www.lionsdegeneve.ch'),
  club('club-geneve-natation-1885', 'Genève Natation 1885 (swimming, water polo, diving, artistic)', 'Genève Natation 1885', 'Geneva', 'GE', [], SOLO,
    'Swimming, water polo, diving and artistic swimming at the Piscine des Vernets.',
    'The club has four sections and runs youth water polo teams (for example U16 and U18) as well as youth swimming groups.',
    'gn1885.ch / Swiss Aquatics, checked Nov 2026', 'https://www.gn1885.ch'),
  club('club-servette-rugby-u16', 'Servette Rugby Club youth teams', 'Servette Rugby Club', 'Geneva', 'GE', [], TEAM,
    'Youth rugby in Geneva, with U16 teams and a U18 women’s team.',
    'Servette RC runs two U16 teams (national and regional level) training at the Stade de Genève, and a U18 women’s team.',
    'servetterc.ch, checked Nov 2026', 'https://servetterc.ch', { minAge: 14 }),
  club('club-geneva-athletics', 'Athletics clubs in Geneva', 'Association genevoise d’athlétisme', 'Geneva', 'GE', [], SOLO,
    'Sprint, jump, throw or run with one of Geneva’s athletics clubs.',
    'The Geneva athletics association groups 15 clubs (about 700 athletes); its training centre (CEFAG) supports clubs. The City of Geneva also runs athletics courses for young people.',
    'geneve.ch, checked Nov 2026', 'https://www.geneve.ch/themes/sport/index-disciplines-sportives/athletisme'),
  club('club-acgf-junior-football', 'Find a junior football club in Geneva', 'ACGF (Geneva football association)', 'Geneva', 'GE', [], TEAM,
    'Every football club in the canton of Geneva, through the cantonal association.',
    'The ACGF organises the Geneva junior championships (juniors A–G and girls’ FF-15 and FF-19). Use its club list to find a team near you.',
    'acgf.ch, checked Nov 2026', 'https://www.acgf.ch'),
  club('club-geneva-sports-index', 'Find any sport in Geneva', 'Ville de Genève', 'Geneva', 'GE', [], TEAM,
    'The City of Geneva’s list of sports you can do in Geneva, with clubs and courses.',
    'Pick a sport to see where to practise it, which associations run it and any city courses for young people.',
    'geneve.ch, checked Nov 2026', 'https://www.geneve.ch/themes/sport/index-disciplines-sportives'),

  // ---------------- Vaud ----------------
  club('club-ls-academie', 'LS Académie (FC Lausanne-Sport youth football)', 'FC Lausanne-Sport', 'Lausanne', 'VD', [], TEAM,
    'The youth academy of FC Lausanne-Sport at the Tuilière.',
    'The academy trains at the Centre sportif de la Tuilière. The club also runs “entre filles” football camps for girls aged 6–14.',
    'lausanne-sport.ch / lausanne.ch, checked Nov 2026', 'https://www.lausanne-sport.ch'),
  club('club-tuiliere-junior-football', 'Junior football at the Tuilière (Lausanne)', 'FC Concordia, ES FC Malley, Racing Club Lausanne', 'Lausanne', 'VD', [], TEAM,
    'Three Lausanne clubs with big junior sections, all based at the Tuilière.',
    'FC Concordia, ES FC Malley, Racing Club Lausanne and the LS Académie share the Tuilière sports centre — about 1,100 players, of whom 850 are juniors.',
    'lausanne.ch, checked Nov 2026', 'https://www.lausanne.ch/centre-sportif-tuiliere'),
  club('club-stade-nyonnais-juniors', 'FC Stade Nyonnais youth football', 'FC Stade Nyonnais', 'Nyon', 'VD', [], TEAM,
    'Youth football with Nyon’s historic club at the Stade de Colovray.',
    'Stade Nyonnais has had a youth academy since 1926.',
    'Wikipedia (FC Stade Nyonnais), checked Nov 2026', undefined),
  club('club-mjor', 'Mouvement Juniors MJOR (Orbe region football)', 'Mouvement Juniors (MJOR)', 'Orbe', 'VD', [], TEAM,
    'One of Vaud’s biggest junior football groupings.',
    'MJOR brings together the junior sections of Arnex, Baulmes, Bavois, Champvent, Chavornay-Sports, Ependes, Montcherand, Orbe, Rances and Suchy-Sports — more than 46 teams and 560 juniors.',
    'localcities.ch, checked Nov 2026', 'https://www.localcities.ch/fr/associations/orbe/7517/303879'),
  club('club-acvf-junior-football', 'Find a junior football club in Vaud', 'ACVF (Vaud football association)', 'Lausanne', 'VD', [], TEAM,
    'Every football club in the canton of Vaud, through the cantonal association.',
    'The ACVF groups the football clubs of Vaud and organises the junior championships. Use its club list to find a team near you.',
    'football.ch/acvf, checked Nov 2026', 'https://www.football.ch/acvf'),
  club('club-lhc-academy', 'Lausanne HC Academy (youth ice hockey)', 'Lausanne HC', 'Lausanne', 'VD', [], TEAM,
    'Youth ice hockey with Lausanne HC, from hockey school to U21.',
    'The LHC Academy runs teams from U9 and U12 up to U21, as part of a cantonal training concept with HC Yverdon and Forward Morges. Places can depend on the player’s level.',
    'academy.lausannehc.ch, checked Nov 2026', 'https://academy.lausannehc.ch'),
  club('club-lausanne-sports-athletisme', 'Lausanne-Sports Athlétisme', 'Lausanne-Sports Athlétisme', 'Lausanne', 'VD', [], SOLO,
    'Athletics at the Stade de la Pontaise, from U10 to elite, plus a leisure group from 16.',
    'Founded in 1904, the club is rated in Swiss Athletics’ top category (5 stars) and runs youth groups (U10 to U16) and a non-competitive leisure group from age 16.',
    'ls-athletisme.ch, checked Nov 2026', 'https://www.ls-athletisme.ch', { minAge: 10 }),
  club('club-lausanne-aquatique', 'Lausanne Aquatique (swimming, artistic swimming, diving, water polo)', 'Lausanne Aquatique', 'Lausanne', 'VD', [], SOLO,
    'Switzerland’s biggest swimming club, with four sections.',
    'Lausanne Aquatique has more than 3,000 members, about 500 of them competitors, across swimming, artistic swimming, diving and water polo.',
    'lausanneaquatique.ch / letemps.ch, checked Nov 2026', 'https://www.lausanneaquatique.ch'),
  club('club-bbc-nyon-youth', 'BBC Nyon youth basketball', 'BBC Nyon', 'Nyon', 'VD', [], TEAM,
    'Youth basketball with Nyon’s top-division men’s club.',
    'BBC Nyon fields youth teams in the national championships (for example U16 and U18 men national).',
    'swiss.basketball, checked Nov 2026', undefined),
  club('club-nyon-basket-feminin', 'Nyon Basket Féminin youth basketball', 'Nyon Basket Féminin', 'Nyon', 'VD', [], TEAM,
    'Girls’ basketball with the 2024–25 Swiss women’s champions.',
    'Nyon Basket Féminin has a youth movement that feeds its Espoirs and first teams.',
    'swiss.basketball / Wikipedia, checked Nov 2026', undefined),
];
