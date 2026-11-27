// ---------------------------------------------------------------------------
// Input validation (zod). Used on the SERVER for every request body, and in
// the browser before saving. Rules of thumb:
//  * strictObject → unknown fields are REJECTED (blocks field tampering, e.g.
//    someone adding "user_id" or "isAdmin" to a request).
//  * every string has a max length and control characters stripped.
//  * every list has a max size; enums only accept known values.
// ---------------------------------------------------------------------------
import { z } from 'zod';
import { CANTONS, SCHOOLS, INTERESTS, SKILLS, TYPES, DIMENSIONS } from './constants';
import { OPPORTUNITIES } from './opportunities';

const clean = (s) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();
const text = (max) => z.string().max(max * 4).transform(clean).pipe(z.string().max(max));

const OPP_IDS = OPPORTUNITIES.map((o) => o.id);
const oppId = z.enum(OPP_IDS);
const skill = z.enum(SKILLS);
const timestamp = z.number().int().min(0).max(4102444800000); // up to year 2100

export const profileSchema = z.strictObject({
  name: text(40).optional().default(''),
  country: z.enum(['CH', 'GB']).default('CH'),
  canton: z.enum(CANTONS.map((c) => c.code)),
  city: text(60).pipe(z.string().min(2).regex(/^[\p{L}\p{M} .'’\/-]+$/u, 'City contains invalid characters')),
  schoolId: z.union([z.enum(SCHOOLS.map((s) => s.id)), z.literal('')]).default(''),
  schoolName: text(80).optional().default(''),
  age: z.coerce.number().int().min(10).max(25),
  year: z.coerce.number().int().min(7).max(13),
  interests: z.array(z.enum(INTERESTS.map((i) => i.id))).min(1).max(INTERESTS.length),
  skills: z.array(skill).min(1).max(SKILLS.length),
  createdAt: timestamp.optional(),
});

const trackSchema = z.strictObject({
  saved: z.boolean().optional(),
  status: z.enum(['applied', 'completed']).nullable().optional(),
  savedAt: timestamp.optional(),
  appliedAt: timestamp.optional(),
  completedAt: timestamp.optional(),
  reflection: text(300).optional(),
  skillsGained: z.array(skill).max(SKILLS.length).optional(),
});

const customSchema = z.strictObject({
  id: z.string().regex(/^c-\d{1,16}$/),
  title: text(100).pipe(z.string().min(1)),
  org: text(100).pipe(z.string().min(1)),
  type: z.enum(Object.keys(TYPES)),
  reflection: text(300).optional(),
  skillsGained: z.array(skill).max(SKILLS.length).default([]),
  completedAt: timestamp,
});

export const studentDataSchema = z.strictObject({
  profile: profileSchema.nullable(),
  tracks: z.partialRecord(oppId, trackSchema).refine((t) => Object.keys(t).length <= OPP_IDS.length),
  custom: z.array(customSchema).max(50),
});

export const credentialsSchema = z.strictObject({
  email: z.string().trim().toLowerCase().max(254).pipe(z.email()),
  // Supabase hashes passwords with bcrypt, which only uses the first 72 bytes.
  password: z.string().min(10, 'Use at least 10 characters.').max(72),
  website: z.string().max(200).optional(),        // honeypot
  turnstileToken: z.string().max(2048).optional(),
});

const lightProfile = profileSchema.partial().strip();
const activity = z.object({ title: text(100), type: z.enum(Object.keys(TYPES)), skillsGained: z.array(skill).max(SKILLS.length).optional() }).strip();

export const recommendSchema = z.object({
  profile: lightProfile,
  ids: z.array(oppId).max(12),
  gaps: z.array(z.enum(DIMENSIONS.map((d) => d.id))).max(DIMENSIONS.length).default([]),
}).strip();

export const cvGapSchema = z.object({
  profile: lightProfile,
  done: z.array(activity).max(60).default([]),
  active: z.array(activity).max(60).default([]),
}).strip();

/** Short, safe error message (never echoes allowed values or internals). */
export function firstError(r) {
  const i = r.error?.issues?.[0];
  if (!i) return 'Invalid input.';
  const field = i.path?.filter((p) => typeof p === 'string').at(-1);
  if (i.code === 'unrecognized_keys') return 'Unexpected field in request.';
  if (i.code === 'invalid_value' || i.code === 'invalid_type' || i.code === 'invalid_key') return field ? `Invalid value for “${field}”.` : 'Invalid input.';
  const msg = String(i.message || 'Invalid input.');
  return msg.length > 80 || /expected/i.test(msg) ? (field ? `Invalid value for “${field}”.` : 'Invalid input.') : msg;
}
