# CVAscender: Security

This is how each item on the security checklist is handled, where it lives in the code, and anything **you** still need to do.

## How data flows

```
Browser ──(JSON, same-origin, httpOnly cookie)──▶ Next.js API routes ──(anon key + user session)──▶ Supabase (RLS on)
                                                    │ validate (zod) · rate limit · bot check · encrypt
                                                    └──▶ AI provider (server-only key)
```
The browser never gets a database key, an AI key or a readable session token.

## The checklist

| # | Item | Where / how |
|---|---|---|
| 1 | **Hide API keys** | Keys are only read in `lib/server/*` and `lib/ai.js`. These files start with `import 'server-only'`, so **the build fails** if browser code imports them. No secret uses a `NEXT_PUBLIC_` prefix. Checked: the built browser JS contains no secret names. |
| 2 | **Purge git secrets** | `.gitignore` blocks `.env*` and key files. The `.githooks/pre-commit` hook blocks commits containing keys (run `npm run hooks` once). The CI workflow runs **gitleaks over the whole history** on every push. If a secret ever got committed, see "If a secret leaked" below. |
| 3 | **Use the public DB key** | Only the **anon/publishable** key is used (`SUPABASE_ANON_KEY`). `lib/server/env.js` **refuses to start** if you paste a `service_role` / `sb_secret_` key by mistake. |
| 4 | **Enable Row-Level Security** | `supabase/schema.sql`: RLS **enabled and forced**, all access revoked from `anon`, policies limited `to authenticated` with `auth.uid() = user_id`. |
| 5 | **Encrypt sensitive data** | Student data is encrypted with **AES-256-GCM** in `lib/server/crypto.js` before it reaches the database (`enc:v1:…`). Tampered ciphertext is rejected. Supabase also encrypts at rest, and everything travels over HTTPS/TLS. We collect little: no birth date, address or phone, just age, canton and city. Local accounts encrypt each student's data the same way before writing `.data/accounts.json` (file mode 600, git-ignored). |
| 6 | **Enforce server-side auth** | Every data request goes through `/api/data`, which verifies the session with Supabase (`auth.getUser()`, not just decoding a token). Paid AI calls are only allowed for signed-in users when accounts are on (`lib/server/ai-access.js`). |
| 7 | **Lock record access** | The user id always comes from the verified session. The client never sends it. RLS enforces the same rule again inside Postgres. |
| 8 | **Block field tampering** | `lib/schemas.js` uses **strict schemas**: unknown fields (`user_id`, `isAdmin`…) are rejected. A database trigger stops `user_id` from being changed and sets `updated_at` itself. `UPDATE` policies use both `USING` and `WITH CHECK`. |
| 9 | **Secure session cookies** | `lib/server/supabase.js` sets session cookies to `HttpOnly` (JavaScript can't read them), `Secure` (HTTPS only, in production) and `SameSite=Lax`. Signing out also clears local data. Local accounts (`lib/server/accounts.js`) use the same cookie settings for a random 256-bit token; only its SHA-256 is stored, and it expires after 30 days. |
| 10 | **Hash passwords** | Supabase Auth stores only **bcrypt** hashes, and the app never sees or stores passwords. Passwords must be 10–72 characters (bcrypt uses the first 72 bytes). Local accounts hash passwords with **scrypt** and a random 16-byte salt, compare in constant time, and do the same work for unknown emails so timing doesn't reveal which accounts exist. |
| 11 | **Rate-limit login** | `/api/auth/login`: 10 tries per IP and 5 per email every 15 min. Sign-up: 5 per IP per hour. Data writes, AI and the matching APIs are limited too. Uses **Upstash Redis** when configured (shared across all servers), otherwise in-memory. Supabase Auth adds its own limits. |
| 12 | **Bot protection** | Hidden **honeypot** field on login/sign-up, plus optional **Cloudflare Turnstile**, verified on the server. |
| 13 | **Parameterize queries** | There is no hand-written SQL in the app. supabase-js sends parameters separately (PostgREST), and the trigger function uses `search_path = ''`. |
| 14 | **Validate all input** | Every API body is checked with zod: types, enums, lengths, list sizes, control characters stripped. Bodies must be JSON and are size-capped. Anything read back from `localStorage` is validated too. |
| 15 | **Escape user content** | React escapes all text by default. The only `dangerouslySetInnerHTML` is a fixed theme script with no user input. AI output is shown as plain text. City names reject `<>` and similar characters. |
| 16 | **Restrict file uploads** | The app has **no uploads**. The API rejects anything that isn't `application/json` (`415`), so multipart uploads are refused. The CSP blocks plugins (`object-src 'none'`). If you add uploads later: allow-list types, cap the size, store them in a private Supabase bucket with RLS, and never serve them from your own domain. |
| 17 | **Trim API responses** | Responses only contain what the page needs (`/api/auth/me` returns only `{ email }`). Errors are generic ("Wrong email or password") with no stack traces or lists of valid values. Everything is `Cache-Control: no-store`, and the `X-Powered-By` header is removed. |
| 18 | **Add security headers** | `next.config.mjs` adds Content-Security-Policy, HSTS, `X-Frame-Options: DENY`, `nosniff`, Referrer-Policy, Permissions-Policy and COOP/CORP. |
| 19 | **Force HTTPS** | HSTS (2 years, preload), plus Cloudflare's "Always Use HTTPS" redirect (Vercel also enforces HTTPS). |
| 20 | **Scan dependencies** | `npm run audit` (currently **0 vulnerabilities**). The CI runs `npm audit --audit-level=high` on every push and weekly, and **Dependabot** opens update PRs automatically. |

Also: **CSRF protection.** Every state-changing request must come from your own site (an `Origin` check), on top of `SameSite` cookies.

## Tested

These were run against the production build:

| Attack | Result |
|---|---|
| Request with no `Origin`, or a foreign one (CSRF) | 403 |
| File upload (multipart) | 415 |
| 20 KB body | 413 |
| Unknown ID / script tag as input | 400, with a short message |
| Extra `user_id`, `isAdmin` or unknown listing in saved data | rejected |
| Rapid-fire requests | 429 after the limit |
| Honeypot filled in | rejected |
| Plain HTTP behind a proxy | 308 to HTTPS |
| Encrypted data | contains no readable text; a modified ciphertext is rejected |
| `service_role` key in config | app refuses to start |
| Secret names in browser JavaScript | none found |

## What you still need to do (Supabase dashboard)

1. **Authentication → Providers → Email:** keep **Confirm email** on, and turn on **leaked password protection** if your plan has it.
2. **Authentication → Rate Limits:** check the defaults suit you.
3. Run `supabase/schema.sql`, then check **Database → Advisors → Security** shows no warnings.
4. Generate `DATA_ENCRYPTION_KEY` and store a copy in a password manager:
   `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
5. Keys live only in `keys.env` (template: `keys-template.env`). `npm run deploy` uploads them to Cloudflare as encrypted secrets. On Vercel, add them under **Settings → Environment Variables**.
6. Recommended for production: Upstash Redis (free tier) for shared rate limits, and Cloudflare Turnstile for bot protection.

## If a secret leaked (e.g. you committed `.env.local`)

1. **Rotate it first.** Create a new key in the provider dashboard and delete the old one. Removing it from git is not enough: assume it has been copied.
2. Remove it from **all** history:
   ```bash
   pip install git-filter-repo
   git filter-repo --invert-paths --path .env.local      # remove a whole file
   # or replace a pasted key everywhere:
   echo 'sk-ant-THE-OLD-KEY==>REMOVED' > replacements.txt
   git filter-repo --replace-text replacements.txt
   git push --force --all && git push --force --tags
   ```
3. Ask collaborators to re-clone, and check that the gitleaks CI job passes.

## Known limits (being honest)

- The CSP allows `'unsafe-inline'` scripts because Next.js needs inline hydration scripts. Moving to nonce-based CSP would remove this.
- The in-memory rate limiter is per server instance. Use Upstash on Vercel for a real shared limit.
- Demo mode stores data unencrypted in the browser's `localStorage` (it never leaves the device). Accounts with encryption are the secure mode.

### Preview photos (`/api/og/[id]`)
Fetches only the official `url` already stored for a listing — never a URL from the request — so it can't be used to reach other servers (no SSRF). 5 s timeout, 400 KB read cap, in-memory cache, 600 requests/min per IP. The CSP allows images from any `https:` host (images can't run scripts); scripts, frames and connections stay locked down.
