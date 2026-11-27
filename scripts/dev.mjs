// npm run dev → starts the site on this computer with the keys from keys.env.
import { readFileSync, existsSync } from 'node:fs';
import { spawn } from 'node:child_process';

const env = { ...process.env };
const KEYS = ['keys.env', '.dev.vars'].find((f) => existsSync(f));
if (KEYS) {
  for (const raw of readFileSync(KEYS, 'utf8').split(/\r?\n/)) {
    const l = raw.trim();
    if (!l || l.startsWith('#') || !l.includes('=')) continue;
    const i = l.indexOf('=');
    let v = l.slice(i + 1).trim();
    if (/^(['"]).*\1$/.test(v)) v = v.slice(1, -1);
    if (v) env[l.slice(0, i).trim()] = v;   // blank lines in the keys file are skipped
  }
}
const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev', ...process.argv.slice(2)], { stdio: 'inherit', env });
child.on('exit', (code) => process.exit(code ?? 0));
for (const s of ['SIGINT', 'SIGTERM']) process.on(s, () => child.kill(s));
