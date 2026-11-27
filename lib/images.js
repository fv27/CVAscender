// ---------------------------------------------------------------------------
// Photos for the reels.
//
// These are ILLUSTRATIVE stock photos from Unsplash (free to use under the
// Unsplash License, no attribution required) chosen by topic — they are NOT
// photos of the actual programme, and the card says so. No logos, and no
// photos of real, named people.
//
// A listing can set its own `image` (a URL or a file in /public). If a photo
// fails to load, the card falls back to the normal coloured background.
// Allowed image hosts are listed in next.config.mjs (img-src).
// ---------------------------------------------------------------------------
import { sportOf } from './sports';

const U = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=70`;

const POOLS = {
  coding: ['1517694712202-14dd9538aa97', '1461749280684-dccba630e2f6', '1555066931-4365d14bab8c', '1488590528505-98d2b5aba04b'],
  robotics: ['1485827404703-89b55fcc595e', '1518770660439-4636190af475'],
  team: ['1522071820081-009f0129c71c', '1531482615713-2afd69097998', '1522202176988-66273c2fd55f'],
  science: ['1532094349884-543bc11b234d', '1507413245164-6160d8298b31', '1576086213369-97a306d36557'],
  space: ['1446776811953-b23d57bd21aa', '1451187580459-43490279c0fa'],
  business: ['1556761175-5973dc0f32e7', '1552664730-d307ca884978', '1559136555-9303baea8ebd'],
  volunteering: ['1488521787991-ed7bbaae773c', '1559027615-cd4628902d4a', '1593113598332-cd288d649433'],
  arts: ['1513364776144-60967b0f800f', '1460661419201-fd4cecdf8a8b'],
  music: ['1514320291840-2e0a9bf2a9ae', '1507838153414-b4b713384a76'],
  writing: ['1455390582262-044cdead277a', '1456513080510-7bf3a84b82f8', '1434030216411-0b793f4b4173'],
  university: ['1541339907198-e08756dedf3f', '1523050854058-8df90110c9f1', '1503676260728-1c00da094a0b'],
  leadership: ['1475721027785-f74eccf877e2', '1540575467063-178a50c2df87'],
  environment: ['1441974231531-c6227db76b6e', '1470071459604-3b5ec3a7fe05'],
  health: ['1576091160399-112ba8d25d1d', '1579684385127-1ef15d508118'],
  // sports
  football: ['1574629810360-7efbbe195018', '1431324155629-1a6deb1dec8d'],
  basketball: ['1546519638-68e109498ffc'],
  swimming: ['1530549387789-4c1017266635'],
  athletics: ['1461896836934-ffe607ba8211'],
  skiing: ['1551698618-1dfe5d97d256'],
  sport: ['1517649763962-0c623066013b', '1571019613454-1cb2f99b2d8b'],
};

function hash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return Math.abs(h);
}

/** Which photo pool fits a listing best (or null for "no photo"). */
export function photoTopic(o) {
  const t = `${o.title} ${o.org} ${o.type}`.toLowerCase();
  const c = o.categories || [];
  const sp = sportOf(o);
  if (sp) return POOLS[sp] ? sp : 'sport';
  if (/essay|writing|writers|journal|review/.test(t)) return 'writing';
  if (/robot|wro\b|first lego/.test(t)) return 'robotics';
  if (/astro|space|iss\b|esa\b|astronom/.test(t)) return 'space';
  if (/hack/.test(t)) return 'team';
  if (/choir|orchestra|music|band|jazz|chor/.test(t)) return 'music';
  if (/research|lab\b|science/.test(t) && c.includes('science')) return 'science';
  if (c.includes('technology')) return 'coding';
  if (c.includes('science')) return 'science';
  if (c.includes('business')) return 'business';
  if (c.includes('volunteering')) return 'volunteering';
  if (c.includes('arts')) return 'arts';
  if (c.includes('environment')) return 'environment';
  if (c.includes('health')) return 'health';
  if (c.includes('leadership')) return 'leadership';
  if (c.includes('academic')) return 'university';
  return null;
}

/** Photo URL for a listing, or null. */
export function imageFor(o) {
  if (o.image === false) return null;
  if (o.image) return o.image;
  const pool = POOLS[photoTopic(o)];
  if (!pool) return null;
  return U(pool[hash(o.id) % pool.length]);
}
