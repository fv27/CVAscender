// ---------------------------------------------------------------------------
// Sports clubs from the top leagues, all cantons (second batch of clubs;
// the hand-checked first batch for Geneva and Vaud is in lib/clubs.js).
//
// HONESTY RULES:
//  * Every club below appears in a public league table or club list
//    (sources per sport, checked Nov 2026). We list the club, its sport and
//    its town — nothing else is claimed about it.
//  * We do NOT know each club's youth teams, trials or fees, so the listing
//    tells students to contact the club. No made-up deadlines.
//  * Clubs only show to students in the same canton (see lib/matching.js).
//  * This is a starting set (top leagues). Smaller clubs are added canton by
//    canton. Each canton also gets a "find a club" card for each sport,
//    pointing at the official federation.
// ---------------------------------------------------------------------------

const C = {
  'Aargau': 'AG', 'Appenzell': 'AR', 'Basel-Landschaft': 'BL', 'Basel-Stadt': 'BS', 'Bern': 'BE', 'Fribourg': 'FR',
  'Geneva': 'GE', 'Glarus': 'GL', 'Grisons': 'GR', 'Jura': 'JU', 'Luzern': 'LU', 'Neuchâtel': 'NE', 'Nidwalden': 'NW',
  'Obwalden': 'OW', 'St. Gallen': 'SG', 'Schaffhausen': 'SH', 'Schwyz': 'SZ', 'Solothurn': 'SO', 'Thurgau': 'TG',
  'Ticino': 'TI', 'Uri': 'UR', 'Valais': 'VS', 'Vaud': 'VD', 'Zug': 'ZG', 'Zürich': 'ZH', 'Zurich': 'ZH',
};

// sport -> how we describe it and where clubs come from
const SPORTS = {
  football: {
    label: 'Football', src: 'Wikipedia list of Swiss football clubs (top 5 leagues, 2025–26), checked Nov 2026',
    blurb: 'Many Swiss football clubs run junior teams by age group (Juniors A–G).',
    finder: 'https://www.football.ch',
  },
  basketball: {
    label: 'Basketball', src: 'Swiss Basketball League team lists (Wikipedia, eurobasket.com), checked Nov 2026',
    blurb: 'Basketball clubs usually run youth teams (U12 to U20).',
    finder: 'https://swiss.basketball',
  },
  volleyball: {
    label: 'Volleyball', src: 'Swiss Volley NLA results 2025–26 (dataproject, the-sports.org), checked Nov 2026',
    blurb: 'Volleyball clubs usually run youth teams for girls and boys.',
    finder: 'https://www.volleyball.ch',
  },
  unihockey: {
    label: 'Unihockey', src: 'swiss unihockey league documents and club pages, checked Nov 2026',
    blurb: 'Unihockey clubs run junior teams from the youngest ages up to U21.',
    finder: 'https://www.swissunihockey.ch',
  },
  icehockey: {
    label: 'Ice hockey', src: 'National League and Swiss League team lists (Wikipedia), checked Nov 2026',
    blurb: 'Ice hockey clubs run youth sections (often from age 5–6) up to U20.',
    finder: 'https://www.sihf.ch',
  },
  handball: {
    label: 'Handball', src: 'Quickline Handball League tables 2023–26 (globalsportsarchive.com), checked Nov 2026',
    blurb: 'Handball clubs usually run youth teams for girls and boys.',
    finder: 'https://www.handball.ch',
  },
  baseball: {
    label: 'Baseball & softball', src: 'Swiss Baseball & Softball Federation, WBSC and Wikipedia, checked Nov 2026',
    blurb: 'Several Swiss baseball clubs have youth teams (U12, U15, U18).',
    finder: 'https://www.swiss-baseball.ch',
  },
  netball: {
    label: 'Netball', src: 'Swiss Netball club list (swissnetball.ch/clubs), checked Nov 2026',
    blurb: 'Swiss Netball junior clubs play in age groups U11, U13, U15 and U17.',
    finder: 'https://swissnetball.ch/clubs',
  },
  americanfootball: {
    label: 'American football', src: 'Swiss American Football Federation (safv.ch) and NSFL club lists, checked Nov 2026',
    blurb: 'Swiss American football has junior tackle teams (U16, U19) and flag football (U13, U16).',
    finder: 'https://www.safv.ch',
  },
  footballlocal: {
    label: 'Football', src: '2. Liga interregional group lists and ACVF/ACGF junior documents (Swiss Football Association), checked Nov 2026',
    blurb: 'Local clubs run junior teams by age group (Juniors A–G), for girls and boys.',
    finder: 'https://www.football.ch',
  },
};

// [name, town, canton, pro?]
const CLUBS = {
  football: [
    ['FC Basel', 'Basel', 'Basel-Stadt', 1], ['Grasshopper Club Zürich', 'Zurich', 'Zürich', 1], ['FC Lausanne-Sport', 'Lausanne', 'Vaud', 1],
    ['FC Lugano', 'Lugano', 'Ticino', 1], ['FC Luzern', 'Lucerne', 'Luzern', 1], ['FC St. Gallen', 'St. Gallen', 'St. Gallen', 1],
    ['Servette FC', 'Geneva', 'Geneva', 1], ['FC Sion', 'Sion', 'Valais', 1], ['FC Thun', 'Thun', 'Bern', 1],
    ['BSC Young Boys', 'Bern', 'Bern', 1], ['FC Zürich', 'Zurich', 'Zürich', 1], ['FC Aarau', 'Aarau', 'Aargau', 1],
    ['Étoile Carouge FC', 'Carouge', 'Geneva', 1], ['SC Kriens', 'Kriens', 'Luzern', 1], ['Neuchâtel Xamax FCS', 'Neuchâtel', 'Neuchâtel', 1],
    ['FC Rapperswil-Jona', 'Rapperswil-Jona', 'St. Gallen', 1], ['FC Stade Lausanne Ouchy', 'Lausanne', 'Vaud', 1],
    ['FC Stade Nyonnais', 'Nyon', 'Vaud', 1], ['FC Wil', 'Wil', 'St. Gallen', 1], ['FC Winterthur', 'Winterthur', 'Zürich', 1],
    ['Yverdon-Sport FC', 'Yverdon-les-Bains', 'Vaud', 1],
    ['FC Bavois', 'Bavois', 'Vaud'], ['AC Bellinzona', 'Bellinzona', 'Ticino'], ['FC Biel-Bienne', 'Biel/Bienne', 'Bern'],
    ['FC Breitenrain Bern', 'Bern', 'Bern'], ['SC Brühl', 'St. Gallen', 'St. Gallen'], ['FC Bulle', 'Bulle', 'Fribourg'],
    ['SC Cham', 'Cham', 'Zug'], ['FC Grand-Saconnex', 'Le Grand-Saconnex', 'Geneva'], ['FC Kreuzlingen', 'Kreuzlingen', 'Thurgau'],
    ['FC Paradiso', 'Paradiso', 'Ticino'], ['FC Schaffhausen', 'Schaffhausen', 'Schaffhausen'], ['Vevey-Sports', 'Vevey', 'Vaud'],
    ['FC Amical Saint-Prex', 'Saint-Prex', 'Vaud'], ['CS Chênois', 'Thônex', 'Geneva'], ['FC Coffrane', 'Val-de-Ruz', 'Neuchâtel'],
    ['FC Échallens Région', 'Echallens', 'Vaud'], ['FC La Chaux-de-Fonds', 'La Chaux-de-Fonds', 'Neuchâtel'],
    ['FC La Sarraz-Eclépens', 'La Sarraz', 'Vaud'], ['Lancy FC', 'Lancy', 'Geneva'], ['FC Martigny-Sports', 'Martigny', 'Valais'],
    ['Meyrin FC', 'Meyrin', 'Geneva'], ['FC Monthey', 'Monthey', 'Valais'], ['FC Oberwallis Naters', 'Naters', 'Valais'],
    ['FC Portalban-Gletterens', 'Delley-Portalban', 'Fribourg'], ['FC Prishtina Bern', 'Bern', 'Bern'], ['FC Stade-Payerne', 'Payerne', 'Vaud'],
    ['FC Bassecourt', 'Bassecourt', 'Jura'], ['FC Besa Biel-Bienne', 'Biel/Bienne', 'Bern'], ['Black Stars Basel', 'Basel', 'Basel-Stadt'],
    ['SC Buochs', 'Buochs', 'Nidwalden'], ['FC Concordia Basel', 'Basel', 'Basel-Stadt'], ['SR Delémont', 'Delémont', 'Jura'],
    ['FC Courtételle', 'Courtételle', 'Jura'], ['FC Langenthal', 'Langenthal', 'Bern'], ['FC Münsingen', 'Münsingen', 'Bern'],
    ['SV Muttenz', 'Muttenz', 'Basel-Landschaft'], ['BSC Old Boys', 'Basel', 'Basel-Stadt'], ['FC Schötz', 'Schötz', 'Luzern'],
    ['FC Solothurn', 'Solothurn', 'Solothurn'], ['FC Wohlen', 'Wohlen', 'Aargau'], ['Zug 94', 'Zug', 'Zug'],
    ['FC Baden', 'Baden', 'Aargau'], ['FC Collina d’Oro', 'Collina d’Oro', 'Ticino'], ['FC Dietikon', 'Dietikon', 'Zürich'],
    ['FC Freienbach', 'Freienbach', 'Schwyz'], ['SV Höngg', 'Zurich', 'Zürich'], ['FC Kosova', 'Zurich', 'Zürich'],
    ['FC Mendrisio', 'Mendrisio', 'Ticino'], ['SV Schaffhausen', 'Schaffhausen', 'Schaffhausen'], ['AC Taverne', 'Torricella-Taverne', 'Ticino'],
    ['FC Tuggen', 'Tuggen', 'Schwyz'], ['FC Wettswil-Bonstetten', 'Wettswil am Albis', 'Zürich'], ['FC Widnau', 'Widnau', 'St. Gallen'],
    ['YF Juventus', 'Zurich', 'Zürich'], ['FC Champagne Sports', 'Champagne', 'Vaud'], ['FC Collex-Bossy', 'Collex-Bossy', 'Geneva'],
    ['FC Concordia Lausanne', 'Lausanne', 'Vaud'], ['FC Dardania Lausanne', 'Lausanne', 'Vaud'], ['FC Echichens', 'Echichens', 'Vaud'],
    ['Olympique de Genève', 'Geneva', 'Geneva'], ['Pully Football', 'Pully', 'Vaud'], ['Signal FC Bernex-Confignon', 'Bernex', 'Geneva'],
    ['US Terre Sainte (USTS)', 'Commugny', 'Vaud'], ['UGS Genève', 'Geneva', 'Geneva'], ['USI Azzurri', 'Geneva', 'Geneva'],
    ['FC Vernier', 'Vernier', 'Geneva'], ['FC Bosna Neuchâtel', 'Neuchâtel', 'Neuchâtel'], ['FC Bosporus', 'Ostermundigen', 'Bern'],
    ['FC Cugy-Montet-Aumont', 'Cugy', 'Vaud'], ['SC Düdingen', 'Düdingen', 'Fribourg'], ['FC Farvagny-Ogoz', 'Farvagny', 'Fribourg'],
    ['AS Italiana Bern', 'Bern', 'Bern'], ['FC Köniz', 'Köniz', 'Bern'], ['SV Lyss', 'Lyss', 'Bern'], ['FC Muri-Gümligen', 'Muri bei Bern', 'Bern'],
    ['CS Romontois', 'Romont', 'Fribourg'], ['FC Saint-Blaise', 'Saint-Blaise', 'Neuchâtel'], ['FC Savièse', 'Savièse', 'Valais'],
    ['FC Ueberstorf', 'Ueberstorf', 'Fribourg'], ['FC Ajoie-Montierri', 'Cornol', 'Jura'], ['FC Allschwil', 'Allschwil', 'Basel-Landschaft'],
    ['SC Binningen', 'Binningen', 'Basel-Landschaft'], ['FC Bülach', 'Bülach', 'Zürich'], ['SC Dornach', 'Dornach', 'Solothurn'],
    ['FC Dübendorf', 'Dübendorf', 'Zürich'], ['FC Kirchberg Bern', 'Kirchberg', 'Bern'], ['FC Lachen-Altendorf', 'Lachen', 'Schwyz'],
    ['FC Liestal', 'Liestal', 'Basel-Landschaft'], ['FC Pratteln', 'Pratteln', 'Basel-Landschaft'], ['Red Star Zürich', 'Zurich', 'Zürich'],
    ['FC Thalwil', 'Thalwil', 'Zürich'], ['FC Uster', 'Uster', 'Zürich'], ['Zurich City SC', 'Zurich', 'Zürich'],
    ['AS Castello', 'Castel San Pietro', 'Ticino'], ['SC Emmen', 'Emmen', 'Luzern'], ['FC Emmenbrücke', 'Emmen', 'Luzern'],
    ['FC Gambarogno-Contone', 'Gambarogno', 'Ticino'], ['FC Härkingen', 'Härkingen', 'Solothurn'], ['FC Hergiswil', 'Hergiswil', 'Nidwalden'],
    ['FC Ibach', 'Ibach', 'Schwyz'], ['FC Klingnau', 'Klingnau', 'Aargau'], ['FC Locarno', 'Locarno', 'Ticino'], ['FC Malcantone', 'Caslano', 'Ticino'],
    ['FC Rothrist', 'Rothrist', 'Aargau'], ['FC Rotkreuz', 'Rotkreuz', 'Zug'], ['FC Sursee', 'Sursee', 'Luzern'], ['FC Altstätten', 'Altstätten', 'St. Gallen'],
    ['FC Arbon 05', 'Arbon', 'Thurgau'], ['FC Chur 97', 'Chur', 'Grisons'], ['KF Dardania St. Gallen', 'St. Gallen', 'St. Gallen'],
    ['FC Gossau', 'Gossau', 'St. Gallen'], ['FC Linth 04', 'Niederurnen', 'Glarus'], ['FC Rorschach-Goldach 17', 'Goldach', 'St. Gallen'],
    ['FC Seefeld Zürich', 'Zurich', 'Zürich'], ['FC Seuzach', 'Seuzach', 'Zürich'], ['FC Uzwil', 'Uzwil', 'St. Gallen'], ['FC Weesen', 'Weesen', 'St. Gallen'],
  ],
  basketball: [
    ['Fribourg Olympic', 'Fribourg', 'Fribourg', 1], ['Lions de Genève', 'Geneva', 'Geneva', 1], ['Pully Lausanne Foxes', 'Pully', 'Vaud', 1],
    ['Union Neuchâtel Basket', 'Neuchâtel', 'Neuchâtel', 1], ['BBC Nyon', 'Nyon', 'Vaud', 1], ['SAM Massagno', 'Massagno', 'Ticino', 1],
    ['BBC Monthey-Chablais', 'Monthey', 'Valais', 1], ['Starwings Basket', 'Basel', 'Basel-Stadt', 1], ['Lugano Tigers', 'Lugano', 'Ticino', 1],
    ['GC Basketball Zürich', 'Zurich', 'Zürich', 1], ['BC Winterthur', 'Winterthur', 'Zürich'], ['Nyon Basket Féminin', 'Nyon', 'Vaud', 1],
    ['BCF Elfic Fribourg', 'Fribourg', 'Fribourg', 1],
  ],
  volleyball: [
    ['Volley Amriswil', 'Amriswil', 'Thurgau', 1], ['Chênois Genève Volleyball', 'Chêne-Bourg', 'Geneva', 1], ['Volley Schönenwerd', 'Schönenwerd', 'Solothurn', 1],
    ['Lausanne UC (LUC Volleyball)', 'Lausanne', 'Vaud', 1], ['Volley Näfels', 'Näfels', 'Glarus', 1], ['TSV Jona Volleyball', 'Rapperswil-Jona', 'St. Gallen', 1],
    ['Colombier Volley', 'Colombier', 'Neuchâtel', 1], ['STV St. Gallen Volleyball', 'St. Gallen', 'St. Gallen', 1], ['VBC Sursee', 'Sursee', 'Luzern'],
    ['Viteos NUC', 'Neuchâtel', 'Neuchâtel', 1], ['VC Kanti Schaffhausen', 'Schaffhausen', 'Schaffhausen', 1], ['Volley Lugano', 'Lugano', 'Ticino', 1],
    ['Genève Volley', 'Geneva', 'Geneva', 1], ['VA Zürich (Volley Academy)', 'Zurich', 'Zürich'], ['VFM Franches-Montagnes', 'Franches-Montagnes', 'Jura', 1],
    ['Volley Düdingen', 'Düdingen', 'Fribourg', 1], ['Volley Toggenburg', 'Wattwil', 'St. Gallen'], ['VBC Cheseaux', 'Cheseaux-sur-Lausanne', 'Vaud'],
  ],
  unihockey: [
    ['SV Wiler-Ersigen', 'Kirchberg', 'Bern'], ['Chur Unihockey', 'Chur', 'Grisons'], ['Unihockey Tigers Langnau', 'Langnau im Emmental', 'Bern'],
    ['UHC Thun', 'Thun', 'Bern'], ['UHC Uster', 'Uster', 'Zürich'], ['Ad Astra Sarnen', 'Sarnen', 'Obwalden'], ['Piranha Chur', 'Chur', 'Grisons'],
    ['UHC Kloten-Dietlikon Jets', 'Kloten', 'Zürich'], ['Zug United', 'Zug', 'Zug'], ['Unihockey Berner Oberland', 'Seftigen', 'Bern'],
    ['Red Ants Winterthur', 'Winterthur', 'Zürich'], ['Skorpion Emmental Zollbrück', 'Zollbrück', 'Bern'], ['UHC Laupen ZH', 'Laupen', 'Zürich'],
    ['Wizards Bern Burgdorf', 'Burgdorf', 'Bern'], ['UHC Alligator Malans', 'Malans', 'Grisons'], ['UHC Sarganserland', 'Sargans', 'St. Gallen'],
    ['Lokomotiv UC Ste-Croix', 'Sainte-Croix', 'Vaud'], ['UHC Gruyères', 'Gruyères', 'Fribourg'], ['Unihockey Limmattal', 'Limmattal', 'Zürich'],
  ],
  icehockey: [
    ['HC Ajoie', 'Porrentruy', 'Jura', 1], ['HC Ambrì-Piotta', 'Ambrì', 'Ticino', 1], ['SC Bern', 'Bern', 'Bern', 1], ['EHC Biel', 'Biel/Bienne', 'Bern', 1],
    ['HC Davos', 'Davos', 'Grisons', 1], ['HC Fribourg-Gottéron', 'Fribourg', 'Fribourg', 1], ['Genève-Servette HC', 'Geneva', 'Geneva', 1],
    ['EHC Kloten', 'Kloten', 'Zürich', 1], ['Lausanne HC', 'Lausanne', 'Vaud', 1], ['HC Lugano', 'Lugano', 'Ticino', 1],
    ['SCL Tigers', 'Langnau im Emmental', 'Bern', 1], ['SC Rapperswil-Jona Lakers', 'Rapperswil-Jona', 'St. Gallen', 1], ['ZSC Lions', 'Zurich', 'Zürich', 1],
    ['EV Zug', 'Zug', 'Zug', 1], ['EHC Arosa', 'Arosa', 'Grisons'], ['EHC Basel', 'Basel', 'Basel-Stadt'], ['EHC Chur', 'Chur', 'Grisons'],
    ['HC La Chaux-de-Fonds', 'La Chaux-de-Fonds', 'Neuchâtel'], ['GCK Lions', 'Küsnacht', 'Zürich'], ['GDT Bellinzona Snakes', 'Bellinzona', 'Ticino'],
    ['EHC Olten', 'Olten', 'Solothurn'], ['HC Sierre', 'Sierre', 'Valais'], ['HC Thurgau', 'Weinfelden', 'Thurgau'], ['EHC Visp', 'Visp', 'Valais'],
    ['EHC Winterthur', 'Winterthur', 'Zürich'],
  ],
  handball: [
    ['Kadetten Schaffhausen', 'Schaffhausen', 'Schaffhausen', 1], ['RTV 1879 Basel', 'Basel', 'Basel-Stadt', 1], ['TSV St. Otmar St. Gallen', 'St. Gallen', 'St. Gallen', 1],
    ['HSC Suhr Aarau', 'Aarau', 'Aargau', 1], ['HC Kriens-Luzern', 'Kriens', 'Luzern', 1], ['Pfadi Winterthur', 'Winterthur', 'Zürich', 1],
    ['BSV Bern', 'Bern', 'Bern', 1], ['Wacker Thun', 'Thun', 'Bern', 1], ['GC Amicitia Zürich', 'Zurich', 'Zürich', 1], ['Handball Stäfa', 'Stäfa', 'Zürich', 1],
    ['HSC Kreuzlingen', 'Kreuzlingen', 'Thurgau'], ['CS Chênois Genève Handball', 'Thônex', 'Geneva'],
  ],
  baseball: [
    ['Lucerne Eagles', 'Lucerne', 'Luzern'], ['Therwil Flyers', 'Therwil', 'Basel-Landschaft'], ['Zurich Barracudas', 'Zurich', 'Zürich'],
    ['Zurich Challengers', 'Zurich', 'Zürich'], ['Embrach Mustangs', 'Embrach', 'Zürich'], ['Wil Pirates', 'Wil', 'St. Gallen'],
    ['Wittenbach Panthers', 'Wittenbach', 'St. Gallen'], ['Bern Cardinals', 'Bern', 'Bern'], ['Sissach Frogs', 'Sissach', 'Basel-Landschaft'],
    ['Geneva Tigers', 'Geneva', 'Geneva'], ['Bulle Red Sox', 'Bulle', 'Fribourg'], ['Sierre Beavers', 'Sierre', 'Valais'],
  ],
  footballlocal: [
    ['FC Sierre', 'Sierre', 'Valais'], ['FC Fribourg', 'Fribourg', 'Fribourg'], ['FC Sarnen', 'Sarnen', 'Obwalden'], ['FC Amriswil', 'Amriswil', 'Thurgau'], ['FC Prangins', 'Prangins', 'Vaud'], ['FC Gland', 'Gland', 'Vaud'], ['FC Genolier-Begnins', 'Genolier', 'Vaud'], ['FC Bursins-Rolle-Perroy', 'Rolle', 'Vaud'], ['FC Forward Morges', 'Morges', 'Vaud'], ['FC Renens', 'Renens', 'Vaud'], ['FC Epalinges', 'Epalinges', 'Vaud'], ['FC Crissier', 'Crissier', 'Vaud'], ['FC Cossonay', 'Cossonay', 'Vaud'], ['CS La Tour-de-Peilz', 'La Tour-de-Peilz', 'Vaud'], ['FC Thierrens', 'Thierrens', 'Vaud'], ['FC Yvonand', 'Yvonand', 'Vaud'], ['CS Chavannes-Epenex', 'Chavannes-près-Renens', 'Vaud'], ['Foot Lavaux', 'Lavaux', 'Vaud'], ['FC Plan-les-Ouates', 'Plan-les-Ouates', 'Geneva'], ['CS Italien GE', 'Geneva', 'Geneva'], ['FC Veyrier Sports', 'Veyrier', 'Geneva'], ['FC Perly-Certoux', 'Perly-Certoux', 'Geneva'], ['FC Conthey', 'Conthey', 'Valais'], ['FC Saint-Maurice', 'Saint-Maurice', 'Valais'], ['FC Printse-Nendaz', 'Nendaz', 'Valais'], ['FC La Tour/Le Pâquier', 'La Tour-de-Trême', 'Fribourg'], ['FC Châtel-St-Denis', 'Châtel-Saint-Denis', 'Fribourg'], ['FC Richemond', 'Fribourg', 'Fribourg'], ['FC Saint-Imier', 'Saint-Imier', 'Bern'], ['Le Locle Sports', 'Le Locle', 'Neuchâtel'], ['FC Spiez', 'Spiez', 'Bern'], ['FC Konolfingen', 'Konolfingen', 'Bern'], ['FC Lerchenfeld', 'Thun', 'Bern'], ['FC Tavannes/Tramelan', 'Tavannes', 'Bern'], ['FC Moutier', 'Moutier', 'Bern'], ['FC Bubendorf', 'Bubendorf', 'Basel-Landschaft'], ['FC Grenchen 15', 'Grenchen', 'Solothurn'], ['SC Schöftland', 'Schöftland', 'Aargau'], ['SC Zofingen', 'Zofingen', 'Aargau'], ['FC Muri AG', 'Muri', 'Aargau'], ['FC Windisch', 'Windisch', 'Aargau'], ['FC Mutschellen', 'Berikon', 'Aargau'], ['FC Adliswil', 'Adliswil', 'Zürich'], ['FC Regensdorf', 'Regensdorf', 'Zürich'], ['FC Unterstrass', 'Zurich', 'Zürich'], ['FC Blue Stars ZH', 'Zurich', 'Zürich'], ['FC Bassersdorf', 'Bassersdorf', 'Zürich'], ['FC Rüti ZH', 'Rüti', 'Zürich'], ['FC Kickers Luzern', 'Lucerne', 'Luzern'], ['FC Perlen-Buchrain', 'Buchrain', 'Luzern'], ['FC Eschenbach', 'Eschenbach', 'Luzern'], ['FC Willisau', 'Willisau', 'Luzern'], ['FC Aegeri', 'Unterägeri', 'Zug'], ['FC Brunnen', 'Brunnen', 'Schwyz'], ['FC Einsiedeln', 'Einsiedeln', 'Schwyz'], ['FC Frauenfeld', 'Frauenfeld', 'Thurgau'], ['FC Bazenheid', 'Bazenheid', 'St. Gallen'], ['FC Ascona', 'Ascona', 'Ticino'], ['AS Novazzano', 'Novazzano', 'Ticino'],
  ],
  netball: [
    ['Geneva Girls Netball Association (GGNA)', 'Grand-Lancy', 'Geneva'], ['Les Citrons Verts', 'Châtelaine', 'Geneva'],
    ['LGB Jets', 'Geneva', 'Geneva'], ['Meinier Netball', 'Nyon', 'Vaud'], ['Aubonne All Stars', 'Aubonne', 'Vaud'],
    ['Geneva International Netball Club (GIN)', 'Founex', 'Vaud'], ['Lausanne Netball', 'Lausanne', 'Vaud'],
    ['Zurich Netball', 'Zurich', 'Zürich'], ['Netball Zug', 'Zug', 'Zug'], ['Val de Bagnes Netball', 'Le Châble', 'Valais'],
  ],
  americanfootball: [
    ['Calanda Broncos', 'Chur', 'Grisons', 1], ['Geneva Seahawks', 'Geneva', 'Geneva'],
    ['Lausanne University Club (LUC) American Football', 'Lausanne', 'Vaud'], ['Monthey Rhinos', 'Monthey', 'Valais'],
  ],
};

// Cantonal football associations (the canton's official club list lives there).
const FOOTBALL_ASSOC = {
  VD: ['ACVF — Association cantonale vaudoise de football', 'https://acvf.football.ch'],
  GE: ['ACGF — Association cantonale genevoise de football', 'https://www.acgf.ch'], FR: ['AFF — Association fribourgeoise de football'],
  VS: ['AVF — Association valaisanne de football'], NE: ['ANF — Association neuchâteloise de football'],
  JU: ['AFBJ — Association de football Berne/Jura', 'https://www.fvbj-afbj.ch'], BE: ['FVBJ — Fussballverband Bern/Jura', 'https://www.fvbj-afbj.ch'],
  ZH: ['FVRZ — Fussballverband Region Zürich', 'https://www.fvrz.ch'], SH: ['FVRZ — Fussballverband Region Zürich', 'https://www.fvrz.ch'],
  LU: ['IFV — Innerschweizerischer Fussballverband'], ZG: ['IFV — Innerschweizerischer Fussballverband'],
  SZ: ['IFV — Innerschweizerischer Fussballverband'], UR: ['IFV — Innerschweizerischer Fussballverband'],
  OW: ['IFV — Innerschweizerischer Fussballverband'], NW: ['IFV — Innerschweizerischer Fussballverband'],
  SG: ['OFV — Ostschweizer Fussballverband'], TG: ['OFV — Ostschweizer Fussballverband'], AR: ['OFV — Ostschweizer Fussballverband'],
  AI: ['OFV — Ostschweizer Fussballverband'], GR: ['OFV — Ostschweizer Fussballverband'], GL: ['OFV — Ostschweizer Fussballverband'],
  AG: ['AFV — Aargauischer Fussballverband', 'https://www.afv.ch'], BS: ['FVNWS — Fussballverband Nordwestschweiz'], BL: ['FVNWS — Fussballverband Nordwestschweiz'],
  SO: ['SOFV — Solothurner Kantonal-Fussballverband'], TI: ['FTC — Federazione ticinese di calcio'],
};

const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const search = (q) => 'https://duckduckgo.com/?q=' + encodeURIComponent(q);

const club = (sport, [name, town, cantonName, pro]) => {
  const s = SPORTS[sport];
  const canton = C[cantonName];
  if (!canton) throw new Error('Unknown canton ' + cantonName);
  return {
    id: `club-${sport}-${slug(name)}`,
    title: `${name} — ${s.label.toLowerCase()}`,
    org: name, type: 'Sports club', categories: ['sports'], skills: ['Teamwork', 'Leadership'],
    sport: sport === 'footballlocal' ? 'football' : sport,
    scope: 'local', localOnly: true, format: 'in-person', city: town, canton,
    minAge: 10, maxAge: 19,
    eligibility: 'Contact the club about its youth teams, trials and places.',
    description: `${s.label} club in ${town}. ${s.blurb}`,
    details: (pro
      ? 'This is a top-level club: its youth academy is usually selective (trials or scouting). Ask about junior teams for all levels.'
      : 'Ask the club which age groups have space this season and when training is.')
      + ' We only list the club and where it plays — check the club’s own website before you go.',
    timing: 'Most clubs take new juniors before each season — contact the club',
    commitment: 'Usually 2–3 trainings a week plus matches', cost: 'Club membership fee — ask the club',
    searchUrl: search(`${name} ${town} juniors`),
    verified: true, source: s.src,
  };
};

const footballFinder = (canton) => {
  const assoc = FOOTBALL_ASSOC[canton];
  return {
    id: `find-football-${canton.toLowerCase()}`,
    title: 'Find a junior football club near you',
    org: assoc[0], type: 'Sports club', categories: ['sports'], skills: ['Teamwork'], sport: 'football',
    scope: 'local', localOnly: true, format: 'in-person', city: null, canton,
    minAge: 8, maxAge: 19,
    eligibility: 'Everyone — most clubs welcome beginners in their junior teams.',
    description: 'Every football club in your area belongs to the regional football association.',
    details: `${assoc[0]} groups the football clubs in your region. Find a club close to home, then contact its junior coordinator. The Swiss Football Association site links to every regional association.`,
    timing: 'All year — most clubs take new juniors before each season',
    commitment: 'Usually 2–3 trainings a week plus matches', cost: 'Club membership fee — ask the club',
    url: assoc[1] || SPORTS.football.finder,
    verified: true, source: 'football.ch (Swiss Football Association), checked Nov 2026',
  };
};

const nationalFinder = (sport) => {
  const s = SPORTS[sport];
  return {
    id: `find-${sport}-ch`,
    title: `Find ${/^[aeiou]/i.test(s.label) ? 'an' : 'a'} ${s.label.toLowerCase()} club near you`,
    org: { basketball: 'Swiss Basketball', volleyball: 'Swiss Volley', unihockey: 'swiss unihockey', icehockey: 'Swiss Ice Hockey Federation', handball: 'Swiss Handball Federation', baseball: 'Swiss Baseball & Softball Federation', netball: 'Swiss Netball', americanfootball: 'Swiss American Football Federation' }[sport],
    type: 'Sports club', categories: ['sports'], skills: ['Teamwork'], sport,
    scope: 'national', format: 'in-person', city: null, canton: null,
    minAge: 8, maxAge: 19,
    eligibility: 'Everyone — clubs welcome beginners in most age groups.',
    description: `The national ${s.label.toLowerCase()} federation lists clubs all over Switzerland.`,
    details: `Use the federation’s website to find clubs close to home, then contact a club about youth teams. ${s.blurb}`,
    timing: 'All year — most clubs take new juniors before each season',
    commitment: 'Usually 2–3 trainings a week plus matches', cost: 'Club membership fee — ask the club',
    url: s.finder, verified: true, source: 'Official federation website, checked Nov 2026',
  };
};

const CANTON_CODES = ['AG', 'AI', 'AR', 'BE', 'BL', 'BS', 'FR', 'GE', 'GL', 'GR', 'JU', 'LU', 'NE', 'NW', 'OW', 'SG', 'SH', 'SO', 'SZ', 'TG', 'TI', 'UR', 'VD', 'VS', 'ZG', 'ZH'];

export const CLUB_LISTINGS = [
  ...Object.entries(CLUBS).flatMap(([sport, list]) => list.map((c) => club(sport, c))),
  // Geneva and Vaud already have hand-checked football finder cards in lib/clubs.js.
  ...CANTON_CODES.filter((c) => c !== 'GE' && c !== 'VD').map(footballFinder),
  ...['basketball', 'volleyball', 'unihockey', 'icehockey', 'handball', 'baseball', 'netball', 'americanfootball'].map(nationalFinder),
];
