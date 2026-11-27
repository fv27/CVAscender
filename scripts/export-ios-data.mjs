// Exports every listing to ios/CVAscender/Resources/opportunities.json for the
// native iOS app. Run after changing listings:  npm run ios:data
import { register } from 'node:module';
import { writeFileSync, mkdirSync } from 'node:fs';
register('./node-resolve-hook.mjs', import.meta.url);

const { OPPORTUNITIES } = await import('../lib/opportunities.js');
const { typeGroup } = await import('../lib/matching.js');
const { sportOf } = await import('../lib/sports.js');
const { imageFor } = await import('../lib/images.js');
const { hostOf } = await import('../lib/logos.js');
const { clubMedia, isClub } = await import('../lib/clubMedia.js');
const { TYPES, INTERESTS, SKILLS, CANTONS, SCHOOL_YEARS, UK_SCHOOL_YEARS, COUNTRIES, DIMENSIONS } = await import('../lib/constants.js');
const { UK_TOWNS_BY_REGION } = await import('../lib/uk.js');
const { TOWNS_BY_CANTON } = await import('../lib/batch10.js');

const clean = (o) => {
  const out = {
    id: o.id, country: o.country ?? null, title: o.title, org: o.org, type: o.type, group: typeGroup(o),
    categories: o.categories || [], skills: o.skills || [], scope: o.scope, format: o.format,
    city: o.city || null, canton: o.canton || null, aliases: o.aliases || [], cantons: o.cantons || [],
    minAge: o.minAge ?? null, maxAge: o.maxAge ?? null, minYear: o.minYear ?? null, maxYear: o.maxYear ?? null,
    eligibility: o.eligibility || null, description: o.description || '', details: o.details || null,
    timing: o.timing || null, commitment: o.commitment || null, cost: o.cost || null,
    link: o.url || o.searchUrl || null, linkIsSearch: !o.url && !!o.searchUrl,
    deadline: o.deadline || null, verified: !!o.verified, source: o.source || null,
    sport: sportOf(o), finder: o.finder || null,
    cvSection: TYPES[o.type]?.cv ?? null, dim: TYPES[o.type]?.dim ?? null,
    // Clubs show their real logo (lib/clubMedia.json); others get the illustrative photo.
    photo: isClub(o) ? null : imageFor(o) || null,   // clubs: logo only
    photoIsReal: false,
    logo: clubMedia(o.id)?.logo || null,
    logoHost: hostOf(o) || null,       // organiser website, for its icon
  };
  for (const k of Object.keys(out)) if (out[k] === null) delete out[k];
  return out;
};

const data = {
  generated: new Date().toISOString().slice(0, 10),
  // countries = only the enabled countries
  countries: COUNTRIES, interests: INTERESTS, skills: SKILLS, cantons: CANTONS, schoolYears: SCHOOL_YEARS, ukSchoolYears: UK_SCHOOL_YEARS, dimensions: DIMENSIONS,
  towns: { ...TOWNS_BY_CANTON, ...UK_TOWNS_BY_REGION },
  opportunities: OPPORTUNITIES.filter((o) => o.scope !== 'internal').map(clean),
};
// The iPhone app needs every one of these keys (see CatalogFile in Model/Models.swift).
for (const key of ['generated', 'countries', 'interests', 'skills', 'cantons', 'schoolYears', 'ukSchoolYears', 'dimensions', 'towns', 'opportunities']) {
  if (data[key] === undefined || (Array.isArray(data[key]) && !data[key].length && key !== 'ukSchoolYears')) {
    throw new Error(`Export is missing "${key}" — the iPhone app would not start. Nothing was written.`);
  }
}
const dir = new URL('../ios/CVAscender/Resources/', import.meta.url);
mkdirSync(dir, { recursive: true });
writeFileSync(new URL('opportunities.json', dir), JSON.stringify(data));
console.log(`Wrote ${data.opportunities.length} listings to ios/CVAscender/Resources/opportunities.json`);
