// ---------------------------------------------------------------------------
// Which sport is a listing about? Used by the Sport filter and the search bar.
// League clubs carry an explicit `sport`; everything else (hand-written clubs,
// school teams) is worked out from the title / organiser text.
// ---------------------------------------------------------------------------

export const SPORT_LIST = [
  { id: 'football', label: 'Football' },
  { id: 'icehockey', label: 'Ice hockey' },
  { id: 'basketball', label: 'Basketball' },
  { id: 'handball', label: 'Handball' },
  { id: 'volleyball', label: 'Volleyball' },
  { id: 'unihockey', label: 'Unihockey' },
  { id: 'netball', label: 'Netball' },
  { id: 'baseball', label: 'Baseball & softball' },
  { id: 'americanfootball', label: 'American football' },
  { id: 'rugby', label: 'Rugby' },
  { id: 'athletics', label: 'Athletics' },
  { id: 'swimming', label: 'Swimming' },
  { id: 'skiing', label: 'Skiing' },
  { id: 'other', label: 'Other sports' },
];

export const sportLabel = (id) => SPORT_LIST.find((s) => s.id === id)?.label || id;

// Order matters: "American football" before "football", "unihockey" before "hockey".
const RULES = [
  ['americanfootball', /american football|football americain|flag football/],
  ['unihockey', /unihockey|floorball/],
  ['icehockey', /ice hockey|hockey/],
  ['netball', /netball/],
  ['basketball', /basket/],
  ['handball', /handball/],
  ['volleyball', /volley/],
  ['baseball', /baseball|softball/],
  ['rugby', /rugby/],
  ['athletics', /athleti|leichtathletik|track and field|cross[- ]country/],
  ['swimming', /swim|natation|aquatique|schwimm|water polo|lifesav|slrg/],
  ['skiing', /\bski|snowboard|freeride/],
  ['football', /football|fussball|calcio|soccer|\bfc\b|futsal/],
];

const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/** Sport id for a listing, or null if it isn't a sports listing. */
export function sportOf(o) {
  if (o.sport) return o.sport;
  if (!o.categories?.includes('sports') && o.type !== 'Sports club') return null;
  const text = norm(`${o.title} ${o.org}`);
  for (const [id, re] of RULES) if (re.test(text)) return id;
  // Multi-sport listings (school teams, gymnastics, "find any sport") go under
  // "Other sports"; things like scouting or the Duke of Edinburgh award don't.
  return o.type === 'Sports club' || /sport|team|gymnast|badminton|tennis|athlet|coach/.test(norm(o.title)) ? 'other' : null;
}
