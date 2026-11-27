# CVAscender — handoff notes for Claude Code

TikTok-style app for finding student opportunities (STEM2Connect hackathon). Switzerland only.
The owner is a beginner on a Mac: run with `npm install` then `npm run dev`. Explain things simply.

## Stack
- Next.js 16 (App Router), React 19, Tailwind. Accounts are local or Supabase. Deploys on Vercel.
- Font: Geist. Accent colours: lapis blue (`lapis`) and pumpkin orange (`signal`). Dark and light mode.

## Rules you must keep
- **Honesty:** never make false claims about real opportunities. Every listing has `verified: true` (checked on the web; say when in `source`) or `verified: false` (the app shows "Not checked yet"). Only set `verified: true` after actually checking.
- **Security:**
  - Secrets and data: never expose API keys in frontend code; purge secrets from git; use only the public DB key; turn on row-level security; encrypt sensitive data; hash passwords.
  - Auth and access: enforce auth on the server; lock access to records; block field tampering; use secure session cookies; rate-limit login; add bot protection.
  - Input and output: parameterize queries; validate all input; escape user content; restrict file uploads; trim API responses.
  - Infrastructure: add security headers (CSP in `next.config`); force HTTPS; scan dependencies.
- Bank-account listings are neutral and about financial literacy only. They never recommend a bank.

## Key files
- `lib/opportunities.js` is the base list. It merges in `lib/universityProgrammes`, `morePrograms`, `researchEssays`, `batch5.js` … `batch10.js`, removes duplicate ids, and applies `PATCHES`. **About 2,950 listings** (2,278 of them generated town/canton cards from `batch10.js`, all `verified: false`).
  - Add new listings in a new `lib/batchN.js`, then add it to the import and the merge loop (around line 703).
  - Each listing has: id, title, org, type (must exist in `constants.js` types), categories (interest ids), skills, scope (local/national/global), format (in-person/online/hybrid), city, canton, minAge, maxAge, eligibility, description, details?, timing, commitment, cost, url or searchUrl, deadline? ('YYYY-MM-DD'), verified, source.
- `lib/matching.js`:
  - `rankFeed`, `matchOpportunity`, `isVisible` (local listings from other cantons are hidden unless the `typeGroup` is research, university or olympiad).
  - `applyFilters`: searching also shows listings you're not eligible for, with a red "Not eligible yet" tag.
  - `TYPE_GROUPS` and `typeGroup()` sort listings into groups using regexes.
- `lib/headlines.js`: random Explore headlines. `*word*` marks the orange word; `{name}` is replaced by the student's first name.
- `lib/ics.js`: downloads a calendar file for a deadline.
- `components/OpportunityCard.js`: the full-screen reel. Actions run down the right side (logo, match ring, save, share, apply); tags sit bottom-left; tap opens details, double-tap saves.
- `components/DetailSheet.js`: the details pop-up. It has a bar that stays at the bottom and an "Add deadline to calendar" button.
- `app/feed`: snap-scrolling reels. Only reels within ±3 of the current one are rendered; one wheel gesture on desktop moves one reel.
- `app/explore`: big search bar, recent searches (localStorage), the "Browse by type" grid, and an endless masonry list of recommendations.
- `app/saved` ("My path"): saved, applied and completed lists, with "N days left" labels.
- `/api/og/[id]`: gets the official page's og:image only from the stored URL. It has a 5 s timeout, a 400 KB cap and rate limiting. Fallback images: Unsplash, then gradient art, then the org logo.

## Current state (11 Nov 2026)
- 58 listings were added in `batch9.js`: 12 checked, 46 not checked yet. The best next job is to check those 46 and mark them `verified: true` with a source.
- Recent design ideas came from Mobbin (foodpanda/Best Buy search, Snapchat/Partiful event sheets, bless. countdown labels).
- Three older club listings have no URL: `club-stade-nyonnais-juniors`, `club-bbc-nyon-youth`, `club-nyon-basket-feminin`.
- Use only one assistant session at a time. An earlier parallel session overwrote files.

## Testing
- Run `npm run build`, then `npx next start -p 3100`.
- Earlier sessions tested with Playwright scripts (onboarding → feed → explore → saved); those scripts aren't included in this folder.

## Update (11 Nov 2026, later)
- `lib/batch10.js` adds 2,278 generated local cards (`finder: 'town'` or `'canton'`, all unverified, with search links). Town cards only show in the feed for the student's own town (`sameTown` in `matching.js`).
- `components/HeatCursor.js` is the heat-reactive stripe cursor (canvas overlay, mouse only, can be switched off in Settings).
- `lib/batch11.js` (+137, all unverified): global competitions, international olympiads, research and citizen science, essays, 24 cantonal banks + financial literacy (`group: 'money'`), volunteering and events. About 3,090 listings in total. Best next job: check these on the web and mark them `verified: true`.
- `ios/`: a **native SwiftUI iPhone app** (iOS 16+) for the App Store. `Model/Matching.swift` ports `lib/matching.js`; keep the two in step. The data comes from `npm run ios:data` → `ios/CVAscender/Resources/opportunities.json`; re-run it after editing listings. It was written without a Mac: the syntax is checked, but it hasn't been compiled. `ios/APP_STORE.md` is the publishing checklist. `app/privacy/page.js` is the privacy policy (its contact email is a placeholder).
- **Countries: CH + GB.** `lib/constants.js` has COUNTRIES, CANTONS (Swiss cantons + `UK-*` regions, each with `country`), `regionsFor`, `schoolYearsFor`. Every listing has `country` ('CH', 'GB', or null for worldwide). `isVisible` hides other countries. UK data is in `lib/uk.js` (13 verified, the rest unverified). The iOS app mirrors this (`Profile.country`, decoded as "CH" for older saves). The owner later switched back to **Switzerland only**: `ENABLED_COUNTRIES = ['CH']` and UK_LISTINGS are not merged (code kept).
- **Real club media:** `lib/clubMedia.json` (filled by `npm run club-media`, run on the owner's computer) and `lib/clubMedia.js`. Named clubs (`isClub`) show **logos only** (the owner chose no photos, for copyright): no stock and no club photos. `/api/og` returns 404 for clubs; `/api/logo` uses the file, else reads the official site live. `lib/mediaExtract.js` holds the HTML parsing and `siteMatches` (strict: never accept a town or tourism site).
- **iOS app: no CV gap analysis** (owner's choice: too complex). `StudentStore.gaps` returns [], so gaps never affect the app feed. Activity recording (Add activity) and the auto-built CV stay. The website still has its gap analysis.
- **iOS app redesign (18 Nov 2026):** native look (system font/colours, standard TabView: Home, Search, Saved, Profile; Settings inside Profile). No reels, gradient poster art, emoji or mono labels. Files: `Views/DesignSystem.swift`, `Components.swift`, `HomeView`, `SearchView`, `DetailView` (pushed), `SavedView`, `ProfileView` (+ AddActivitySheet), `OnboardingView`. Geist is only used for the logo wordmark.
- **iOS Home = TikTok-style reels again** (owner's choice, 18 Nov 2026), in the native style: `HomeView` + `ReelView` + `ReelBackground`. `ListingCard`, `CarouselCard` and `SectionHeader` in Components.swift are currently unused.
- **iOS subscription (19 Nov 2026):** hard paywall after onboarding (`RootView`: onboarding → `PaywallView` unless `SubscriptionStore.isSubscribed`). Product IDs `cvascender.plus.yearly` (CHF 15) and `cvascender.plus.monthly` (CHF 1.50), both with a 1-week free intro offer, in group "CVAscender Plus". Local testing: `ios/CVAscender/CVAscender.storekit` (select it in the scheme). `DebugUnlock` skip only works in DEBUG builds. Setup steps: `ios/APP_STORE.md`. Placeholder to replace: `SubscriptionStore.privacyURL`.
- **iOS design restored (19 Nov 2026):** the owner preferred the original website-style design (reels, floating tab bar, poster art, Geist, ThemeToggle) over the native redesign, so `Views/` is back to DesignSystem, FeedView, ExploreView, DetailSheet, MyPathView, ProfileView, SettingsView, OnboardingView, plus PaywallView. Subscription gating as above. Security: verified StoreKit transactions for our product IDs only; state stored in an Application Support file with Data Protection (migrated from UserDefaults); links restricted to http(s). LogoMark now follows the owner's SVG (64-unit grid).
- **Paywall switch:** `SubscriptionStore.paywallEnabled` (currently `false` = free app for v1.0). Set to `true` and create the App Store Connect subscriptions to start charging in an update.
- **Contact email:** cvascender@gmail.com — website (landing footer, Settings, Nav, privacy page) and app (`SubscriptionStore.contactEmail`: Settings contact card + about, Profile, listing "Spot a mistake?", paywall Help).
- **School years:** Year N = Grade N−1 (Year 7 / Grade 6 … Year 13 / Grade 12). `scripts/export-ios-data.mjs` now refuses to write the app data if a required key is missing (an earlier stray `//` comment had dropped them).
