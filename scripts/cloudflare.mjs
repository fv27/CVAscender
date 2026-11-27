// npm run deploy  → build for Cloudflare, upload the site, then upload the keys
//                   from keys.env as encrypted Cloudflare secrets.
// npm run preview → build and run the Cloudflare version on this computer.
//
// Keys live ONLY in keys.env (never inside the uploaded code). .env / .env.local
// files would be packed into the upload by the build, so this script refuses to
// run if they contain anything.
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const parse = (file) => Object.fromEntries(
  readFileSync(file, 'utf8').split(/\r?\n/).map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#') && l.includes('='))
    .map((l) => {
      const i = l.indexOf('=');
      let v = l.slice(i + 1).trim();
      if (/^(['"]).*\1$/.test(v)) v = v.slice(1, -1);
      return [l.slice(0, i).trim(), v];
    }),
);

for (const f of ['.env', '.env.local', '.env.production', '.env.production.local']) {
  if (existsSync(f) && Object.values(parse(f)).some(Boolean)) {
    console.error(`\nStopped: ${f} contains values. Files named .env… get packed INTO the uploaded code.\nMove your keys into keys.env, then delete ${f} and run this again.\n`);
    process.exit(1);
  }
}

const KEYS = ['keys.env', '.dev.vars'].find((f) => existsSync(f));
const keys = KEYS ? parse(KEYS) : {};
const filled = Object.entries(keys).filter(([, v]) => v);
const isPublic = ([k]) => k.startsWith('NEXT_PUBLIC_');           // safe to show in the browser
const pub = Object.fromEntries(filled.filter(isPublic));
const secret = Object.fromEntries(filled.filter((e) => !isPublic(e)));

const run = (args, opts = {}) => {
  const r = spawnSync('npx', args, { stdio: 'inherit', shell: process.platform === 'win32', ...opts });
  if (r.status !== 0) process.exit(r.status ?? 1);
};

run(['opennextjs-cloudflare', 'build'], { env: { ...process.env, ...pub } });

if (process.argv[2] === 'preview') {
  // Wrangler's local preview reads .dev.vars, so copy the filled-in keys there (never uploaded).
  if (KEYS === 'keys.env') writeFileSync('.dev.vars', filled.map(([k, v]) => `${k}=${JSON.stringify(v)}`).join('\n') + '\n', { mode: 0o600 });
  run(['opennextjs-cloudflare', 'preview']);
  process.exit(0);
}

run(['opennextjs-cloudflare', 'deploy']);

const names = Object.keys(secret);
if (names.length) {
  console.log(`\nUploading ${names.length} key(s) as encrypted secrets: ${names.join(', ')}`);
  run(['wrangler', 'secret', 'bulk'], { input: JSON.stringify(secret), stdio: ['pipe', 'inherit', 'inherit'] });
} else {
  console.log('\nNo keys in keys.env, so the site runs without AI and accounts (that is fine).');
}
console.log('\nDone. Your site is live.');
