import 'server-only';
// Application-level encryption of student data (AES-256-GCM, authenticated).
// Supabase already encrypts the disk; this adds a second layer so a database
// leak or a curious admin sees only ciphertext. Losing the key = losing data,
// so keep DATA_ENCRYPTION_KEY in your password manager / Vercel env settings.
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { encryptionKey } from './env';

export function seal(obj, key = encryptionKey) {
  const json = JSON.stringify(obj);
  if (!key) return json;
  const iv = randomBytes(12);
  const c = createCipheriv('aes-256-gcm', key, iv);
  const ct = Buffer.concat([c.update(json, 'utf8'), c.final()]);
  return ['enc', 'v1', iv.toString('base64'), c.getAuthTag().toString('base64'), ct.toString('base64')].join(':');
}

export function open(text, key = encryptionKey) {
  if (!text) return null;
  if (!text.startsWith('enc:v1:')) return JSON.parse(text);
  if (!key) throw new Error('Data is encrypted but DATA_ENCRYPTION_KEY is missing.');
  const [, , iv, tag, ct] = text.split(':');
  const d = createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'base64'));
  d.setAuthTag(Buffer.from(tag, 'base64'));
  return JSON.parse(Buffer.concat([d.update(Buffer.from(ct, 'base64')), d.final()]).toString('utf8'));
}
