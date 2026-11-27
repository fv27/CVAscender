# CVAscender: discover opportunities in Switzerland

A personalised, scrollable feed of **real Swiss opportunities** for high-school students: science olympiads, university programmes, research weeks, competitions, volunteering, youth organisations, orchestras and language exchanges. Built for the STEM2Connect hackathon.

Recommendations currently cover **Switzerland only** (students choose their canton). The data model is ready to add other countries later (see `REGION` in `lib/constants.js`).

**It works straight away with no keys and no setup.** Student accounts work out of the box too: when you run the app on your own computer, accounts and their (encrypted) data are saved in a `.data/` folder in the project. Supabase (needed once you deploy to Vercel) and AI explanations are optional upgrades you switch on with environment variables.

---

## 1. Run it in VS Code (5 minutes)

1. Install **Node.js 20 or newer** from <https://nodejs.org> (choose the LTS version).
2. Unzip this folder, then in VS Code go to **File → Open Folder…** and choose `cvascender`.
3. Open the terminal (**View → Terminal**) and run:
   ```bash
   npm install
   npm run dev
   ```
4. Open <http://localhost:3000>. That's it.
5. (Once, if you use git) run `npm run hooks`. This turns on a check that stops you committing API keys by accident.

Recommended VS Code extensions: **Tailwind CSS IntelliSense** (autocompletes class names) and **ES7+ React snippets**.

---

## 1b. Test it on your phone (no app store needed)

CVAscender is a **website**, so there's nothing to publish to the App Store or Google Play. You can test it three ways:

**A. In your browser, as a phone.** With `npm run dev` running, open `localhost:3000` in Chrome, press **F12** (Mac: **Cmd + Option + I**), then click the 📱 phone icon at the top of that panel and pick e.g. "iPhone 14".

**B. On your real phone, over Wi-Fi.**
1. Phone and computer on the **same Wi-Fi** (school or public Wi-Fi often blocks this, so home Wi-Fi works best).
2. Stop the app (Ctrl + C), then run `npm run dev:phone`.
3. Find your computer's address. Mac: **System Settings → Wi-Fi → Details → IP address**. Windows: run `ipconfig` and look for "IPv4 Address". It looks like `192.168.1.23`.
4. On your phone, open `http://192.168.1.23:3000`, using your own number.
5. Optional: tap **Share → Add to Home Screen** (iPhone) or **⋮ → Add to Home screen** (Android). It then opens full-screen with its own icon, like a real app.
6. If it won't load, allow Node.js through your computer's firewall when asked (Windows shows a pop-up the first time).

**C. A real link anyone can open (best for judges).** Deploy free to Vercel (section 7). You get an `https://…vercel.app` link that works on any phone, and **Add to Home Screen** works there too. This isn't an app store, just a website address.

---

## 2. What's inside

```
app/
  page.js               Landing page
  onboarding/page.js    4-step personalisation (canton & town, age/year, interests, skills); also used by Settings
  feed/page.js          ★ The snap-scrolling feed, filters, keyboard controls
  saved/page.js         "My path": saved / applied / completed tracker
  profile/page.js       Skills tracker, CV gap analysis, auto-built CV
  settings/page.js      Settings: change your onboarding answers, sign in/out, delete account, reset
  login/page.js         Sign up / sign in
  api/auth/, api/data/  SERVER: accounts and saving each student's data
  api/recommend/        SERVER: AI "why this fits you" explanations
  api/cv-gap/           SERVER: AI CV gap analysis
components/             Cards, detail sheet, filters, nav, generative visuals, app state
lib/
  opportunities.js      The listings (see "Honesty rules" below)
  matching.js           The matching engine: scoring, eligibility, ranking, gap analysis
  constants.js          Countries, interests, skills, opportunity types, CV sections
  ai.js                 SERVER-ONLY AI helper (Anthropic or OpenAI)
  sports.js             Works out each listing's sport (for the Sport filter and search)
  server/accounts.js    SERVER-ONLY accounts: Supabase, or local accounts in .data/ when Supabase isn't set up
  server/supabase.js    Supabase client
supabase/schema.sql     Database table + security rules
```

---

## 3. Key technical decisions (and why)

**Next.js (App Router) + React + Tailwind.** One project holds both the website and the server code (`app/api/...`), and Vercel deploys it in one click. I used plain **JavaScript, not TypeScript**, so it stays close to what you already know.

**The matching engine is plain rules, and the AI explains the results.** `lib/matching.js` scores every opportunity like this:

| Signal | Points |
|---|---|
| Matches your interests | up to 40 |
| Builds skills you want | up to 25 |
| In your city or canton / online / open nationwide | up to 15 |
| Fills a gap in your CV | +8 |
| Deadline within 7 days | +5 |
| Not eligible (age, year or canton) | score halved, hidden by default |

This is deliberate. Ranking stays instant, free and explainable (you can tell judges exactly why something ranks first), and it still works if the AI is down. The AI's job (`/api/recommend`) is to turn those signals into one personal sentence per card. The CV gap analysis works the same way: rules find the gaps, and the AI writes the advice.

**Security is built in, not added later.** API keys live only in server files marked `server-only`, so the build fails if one is imported in the browser. Logins use httpOnly cookies. All input is validated, data is encrypted, and every endpoint is rate-limited. See **`SECURITY.md`**, which covers all 20 checklist items and how they were tested.

**It's based on where you live, not your school.** Most schools keep their clubs and teams behind a student login, so school-only listings weren't reliable. The feed now uses your canton and town: local clubs and programmes near you, plus everything open nationwide. (The old school list and activities are still in `lib/schools.js` but are no longer shown.)

**Accounts that work without setup.** State always lives in `localStorage` too, so the app keeps working offline. When a student creates an account, their profile, saved opportunities and CV are saved on the server, and anything they did before signing up is uploaded automatically. Signing in on another browser brings it all back.

- **Local accounts (default when running on your computer).** Stored in `.data/accounts.json` (git-ignored). Passwords are hashed with scrypt and a random salt; the login is a random token in an httpOnly, SameSite cookie (only its SHA-256 is stored); each student's data is encrypted with AES-256-GCM using `DATA_ENCRYPTION_KEY`, or a key generated once into `.data/secret.key`. Don't delete `.data/` unless you want to wipe every account. Set `LOCAL_ACCOUNTS=off` to switch this off.
- **Supabase (for Vercel).** Vercel has no permanent disk, so local accounts are switched off there automatically. Add Supabase keys (section 6) to have accounts on the deployed site.

**Light and dark mode.** Colours are CSS variables in `app/globals.css` (`:root` = light, `.dark` = dark). The accents are lapis blue `#26619C` and pumpkin orange `#FF7518` on a white background. The toggle sits in the side rail on desktop and in the tab bar on mobile. It remembers the choice and follows the device setting the first time.

**Visuals are generated, not downloaded.** Each card gets unique poster art built from its ID and category colour (`components/Visual.js`). That means no copyright problems, no broken image links and a consistent look.

---

## 4. The listings and the honesty rules (`lib/opportunities.js`)

**35 real Swiss programmes**, each checked in November 2026 against its official page or reliable reporting:

| Area | Programmes |
|---|---|
| Science Olympiads | Informatics (SOI), Maths, Physics, Chemistry, Biology, Geography, Philosophy, Linguistics, Economics, Astronomy, World Robot Olympiad |
| Swiss Youth in Science (SJf) | National Competition, Study Weeks, International Wildlife Research Week |
| Universities | UNIGE Athéna and Mini-Athéna, EPFL Cours Euler, Mardimathiques and Coding club des filles, Uni Basel Schülerstudium, UZH Schüler:innenstudium, ETH Study Weeks, CERN Beamline for Schools |
| Tech | Swiss Hacking Challenge, Informatik-Biber, FIRST LEGO League, Swiss TecLadies |
| Civic, business and debate | Federal Youth Session, YES Company Programme, Jugend debattiert |
| Volunteering and leadership | Youth Red Cross, Pfadi/Scouts |
| Arts and languages | Swiss Youth Symphony Orchestra, Jugend Sinfonieorchester Zürich, Movetia language exchanges |

The rules behind them:
- `verified: true` → only facts found in the `source` are stated. Dates change every year, so cards show `timing` (when it *usually* happens, e.g. "First round every September") instead of invented deadlines. The only hard deadline is one published officially (Uni Basel spring semester: 11 Jan 2027).
- `cantons` limits eligibility (e.g. Athéna → Geneva; Basel Schülerstudium → BS, BL, SO, AG). Students from other cantons see these marked "not eligible" and hidden by default.
- **Local sports clubs** live in `lib/clubs.js` (type “Sports club”, scope local): youth sections of real clubs in Geneva and Vaud — football, ice hockey, basketball, swimming/water polo, rugby and athletics — plus “find a club” links to the cantonal football associations and the City of Geneva sports index. Each has a `source`; training times and fees are not listed because they change every season.
- **Schools** (`lib/schools.js`) are kept for reference only and are no longer part of the feed.
- **Before your demo, open the official links once.** Programmes change, so check that the details still hold.

To add a listing, copy an entry, set `verified: true`, fill in `url` and `source`, and only write facts you've confirmed.

---

### University & pre-university programmes (`lib/universityProgrammes.js`)

Added from the team's list. Ones we checked are marked **Real · source checked**; the rest are real organisations whose details we haven't confirmed yet. Those show **Not checked yet** and a warning to confirm on the official website. Programmes abroad or online worldwide are labelled **Abroad / online worldwide**.

Left out on purpose, because they aren't open to school students in Switzerland: Cambridge STEM SMART and Oxford UNIQ (UK state-school students only), Swiss Study Foundation summer academies, ETH summer research fellowships and the ETH summer-school directory (university students), the Edinburgh visiting-student summer school, MIT's on-site Beaver Works Summer Institute (US students only; its online courses are listed instead), and Imperial outreach (UK schools).

### Design (Nov 2026 redesign)

The interface was redesigned using real app patterns found on Mobbin:
- **Onboarding:** "Choose what you like" interest pills with + / ✓ and a full-width "Continue (n)" button (TikTok, X, Reddit).
- **Feed:** scrollable text tabs — For you, Closing soon, Tech, Science, Business, Sports, Arts, Volunteering, Leadership, University, Abroad & online (Perplexity Discover).
- **Explore page** (`app/explore/page.js`): a search bar with filter chips that show result counts (Shopify), home rows of labelled image cards such as "For you in 📍 your town" (Mindtrip), calendar date badges on "Closing soon" (Swiggy), and search results with an outlined type label (Tripadvisor).
- **Phone navigation:** a floating pill tab bar (Shopify, Tripadvisor).
- **Landing page:** a bold hero with a search box and a "Browse by what you love" panel (Shopify Academy).
- Headings now use bold Geist instead of a serif.

### Design (v4, Nov 2026): back to basics

- White background with lapis and pumpkin as accents; bold Geist headings.
- The vertical, snap-scrolling feed works on phones and desktop. Cards follow TikTok: the artwork fills the card, the text sits bottom-left, and Save, Details, Share and Apply run down the right side.
- Explore opens with a row of round category bubbles, like Snapchat's Stories, followed by the rows of cards.
- The detail pages (`/o/[id]`), My path progress, profile header and filter tags are kept from v3.

### Design system (v3, Nov 2026, superseded by v4)

Based on the Mobbin research: Contra, Peerlist, Braintrust, Codecademy, Care.com, Upwork, Circle, Meetup and Handshake.
- Warm off-white background (`--paper #FAF8F4`), near-black ink for main buttons, pumpkin orange only for deadlines and Apply, and lapis for the brand.
- Bold Geist headings, plus typewriter-style mono labels (`.label`) for metadata.
- Swiss-poster artwork (`components/Visual.js`): flat category colour, a grid, one shape and an orange dot.
- Desktop feed is a list with the details beside it (`DesktopFeed` in `app/feed/page.js`); phones keep the swipe feed.
- Each opportunity has its own page at `/o/[id]`, with a facts card and a sticky Save / Apply bar.
- Active filters show as removable tokens with "Clear all".
- The profile has a Contra-style header with a stats strip; empty sections use dashed boxes.
- My path has a progress bar, a weekly goal and the next deadlines shown as calendar blocks.

### Batch 4 listings (`lib/moreProgrammes.js`)

Covers the AI Olympiad, the Hack Apertus series, Baden hackt, Astro Pi, World Robot Olympiad categories, The Earth Prize, Science on the Move, the RoboTIC COntest, university outreach (Bern, the Basel Summer Science Academy, UNIGE and EPFL), the regional YES pitch competitions and trade fair, business camps, REFLEX and others. `PATCHES` updates dates on listings the app already had.

## 5. Turn on AI (optional)

1. Get an API key from **Anthropic** (<https://console.anthropic.com>) *or* **OpenAI** (<https://platform.openai.com>).
2. Open the file `keys.env` (your keys file) and paste your key after the `=`:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```
3. Stop the dev server (Ctrl+C) and run `npm run dev` again.

The feed's side panel switches from "Smart matching (rules)" to **"AI matching on"**, and the cards show "AI · why this fits you". To use a different model, set `AI_MODEL`. `.env.local` is in `.gitignore`, so it is never uploaded to GitHub.

## 6. Turn on accounts with Supabase (optional)

1. Create a free project at <https://supabase.com>.
2. In **SQL Editor**, paste the contents of `supabase/schema.sql` and click **Run**. This creates the table plus *Row Level Security* rules, so each student can only access their own data.
3. In **Project Settings → API**, copy the **Project URL** and the **anon / publishable** key (NOT the service_role key) into `.env.local`, and generate an encryption key:
   ```
   SUPABASE_URL=https://xxxx.supabase.co
   SUPABASE_ANON_KEY=eyJ...
   DATA_ENCRYPTION_KEY=   # node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
4. Restart `npm run dev`. Accounts now use Supabase instead of the local `.data/` folder (existing local accounts are not moved over).
   (For quick testing you can turn off "Confirm email" under **Authentication → Providers → Email**.)

These are only read on the server. The browser talks to our own API routes, which check the login cookie, validate the input, encrypt the data and then ask Supabase, where Row Level Security checks again. **Read `SECURITY.md`** for the full security setup and the dashboard settings to switch on.

## 7. Deploy to Vercel

1. Push the folder to a GitHub repository (the `.gitignore` already excludes secrets and `node_modules`).
2. At <https://vercel.com>, choose **Add New → Project**, then import the repo.
3. Under **Environment Variables**, add the same keys you have in `keys.env`, then click **Deploy**.

---

## 8. Features checklist

- Personalised onboarding (canton, city/town, age, year, interests, skills)
- Light/dark mode
- Full-screen snap-scrolling feed. Keyboard: ↑/↓ or J/K to move, S to save. Double-click a card's image to bookmark it.
- Cards show name, organisation, visual, category, location, deadline, eligibility, description, scope, match score, the reason it fits you, Save, Details and Apply
- Search bar: type anything (e.g. "football Geneva", "robotics", "Lausanne"). Searching looks in every canton, so a student in Zurich can find a football club in Geneva. A canton picker shows "Near me", "All of Switzerland" or one chosen canton.
- Filters: 8 categories, a Sport filter (football, ice hockey, basketball, handball, volleyball, unihockey, netball, baseball & softball, American football, rugby, athletics, swimming, skiing, other), local/national, online/in-person, plus "include ones I'm not eligible for yet". Also a "For you" / "Closing soon" toggle.
- Settings page: change any answer from onboarding (where you live, age/year, interests, skills) without starting again; account controls.
- Accounts: sign up, sign in on any browser and get your data back; sign out; delete account.
- Eligibility matching on age, school year and location
- Tracker: saved → applied → completed. Completing an item asks which skills you gained plus a CV line.
- Skills tracker compared against the skills you said you wanted
- Auto-built CV with copy-as-text and print/save-as-PDF, plus "add an activity" for things done off-platform
- CV gap analysis across 7 areas, with tailored advice and matching opportunities for each gap
- Responsive: bottom tabs on mobile, side rail and filter panel on desktop

## 9. Good next steps

1. **More real data.** Add canton-specific programmes (e.g. cantonal youth parliaments, local hackathons, internships) and move listings into the `opportunities` table (already in the schema), with a yearly re-check of dates.
2. **School accounts.** Let a teacher add their school's clubs (internal listings) through a simple form.
3. **"Submit an opportunity"** form, with listings marked unverified until someone reviews them.
4. **Languages.** French and German versions of the interface for Swiss students.
5. **Learn from behaviour.** Boost categories a student saves often, which you can do inside `matchOpportunity()`.

## Photos & logos on the reels (v6)
- **Real photos:** `/api/og/<id>` reads the organiser's own website (only the official link stored for that listing) and uses the photo the site shares for link previews. Credit shown as "Photo: site.ch".
- **Fallback:** if there's no real photo, an illustrative Unsplash topic photo ("Illustrative photo"); if that fails too, the organiser's logo on the coloured background.
- **Logos:** the organiser website's icon (Google / DuckDuckGo icon services), shown above the match score. Tap it for details.
- Tap a tag on a reel (e.g. "Business") to show more like it.

## Batch 5 (8 Nov 2026) — more research, maths and essay programmes
`lib/batch5.js`: PROMYS Europe, Summer Science Program, Canada/USA Mathcamp, Ross, Inspirit AI, Veritas AI, HIR Academic Writing Contest, Think Essay Prize, PSI iLab, plus the rest of the team's Swiss list (youth councils in GE/VD/FR/BE/BS/LU/VS/TI, Nyon youth participation, Youth Forum Switzerland, Red Cross youth Geneva, SCI camps, FIFDH volunteering, Educamint, GirlsCodeToo, Girls on Ice, mint & pepper, wow², Cosmo Robotics, Code Camp, Futurekids, NEXT Academy, TechSpark Zug/Lucerne, Ferienplausch, GLAJ, Passeport Vacances Lausanne, EPFL Zappy Robotics). Most of the team's list was already in the app.
- New **Type** filter (Research programmes, Essays & writing, Olympiads, Competitions & hackathons, University & summer, Camps & courses, Clubs & teams, Volunteering & civic) and Research / Essays rows on Explore.
- University and research programmes in other cantons now show in your feed again (e.g. UNIGE Athéna for a Vaud student); local clubs, councils and camps stay limited to your canton.

## Batch 7 (8 Nov 2026) — tech camps & volunteering
`lib/batch7.js`: Village Camps STEM (Leysin), Swiss Outdoor Camp, Logiscool, TechLabs flight camps; volunteering at the Course de l'Escalade, Generali Genève Marathon, Red Cross Paniers de Noël and 2x Noël, Bioparc, Festivélo, Festival de la Cité, Polymanga, Paléo (18+), CHUV Christmas decorations, Volontaires Sportifs Lausannois, Genève Bénévolat; Parlement des Jeunes Genevois, SLN, the IIAT accessible-tech project and the Summit on Children in Armed Conflict (organiser to confirm).

## Batch 10 (11 Nov 2026): the Swiss network (+2,278 listings) and the heat cursor
`lib/batch10.js` generates local listings from real nationwide youth structures:
- **185 towns × 10 activities** (1,850 cards): junior football, scouts (Pfadi), music school, youth centre/youth work, gymnastics, swimming, tennis, athletics, unihockey (German-speaking) or basketball (French/Italian-speaking), and chess. Each says "in or near <town>" and opens a web search in the town's language.
- **26 cantons × up to 17 organisations** (428 cards): cantonal scouts, Jubla and Cevi (German-speaking cantons only), Red Cross youth, Red Cross babysitting course, Samaritans first aid, SLRG/SSS lifesaving, youth fire brigade, youth parliament, J+S holiday camps, job taster days (Schnupperlehre), volunteering office, Pro Natura, WWF, SAC youth, youth orchestras/choirs and holiday passes.
- **Honesty:** all of them are `verified: false` ("Not checked yet"). No club names, dates or fees are invented. To upgrade one, swap `searchUrl` for the real club's `url` and set `verified: true` with a `source`.
- **Matching:** town cards only appear in the feed for students in that town (`sameTown` in `lib/matching.js`, which also understands names like Zürich/Zurich and Genève/Geneva). Searching or picking a canton shows them all. Generic "find" cards rank a little below specific listings. Onboarding now suggests up to 8 towns per canton.

**Heat cursor** (`components/HeatCursor.js`, mounted in `app/layout.js`): a hidden field of short stripes that heat up around the mouse. They grow, change from lapis to pumpkin and lean in the direction you move, then cool down. Ideas came from Mobbin references: Replit's cursor-reactive arrow grid and KODE Immersive's "scratch around" orange strokes. The glow reaches about 70 px around the pointer (`RADIUS` in the file). It works only with a real mouse, is off when the device asks for reduced motion, never blocks clicks, stops using CPU once everything has cooled, and can be switched off in **Settings → Heat cursor**.

## Batch 11 (11 Nov 2026): global competitions, olympiads, research, essays, money, volunteering (+137)
`lib/batch11.js` covers the following. All entries are `verified: false`: they're real, long-running programmes, but their websites couldn't be opened in this session, so dates, ages and costs still need checking.
- **Global competitions:** World Scholar's Cup, International History Bee and Bowl, International Geography Bee, Apple Swift Student Challenge, Hack Club, Codeforces, Online Physics Olympiad, Physics Cup, IAAC, Cubes in Space, Ocean Awareness Contest, GENIUS Olympiad, ISEF and EUCYS (via Schweizer Jugend forscht), JA Gen-E (via YES), THIMUN, International Public Policy Forum, European Youth Parliament Switzerland and IASC asteroid search.
- **International olympiads** (reached through the Swiss olympiads): IMO, EGMO, MEMO, IOI, IPhO, EuPhO, IChO, IBO, iGeo, IOL, IPO, IOAA, IEO and IOAI, plus the FSJM maths and logic games championship.
- **Research:** Zooniverse, Foldit, iGEM high school, CCIR, Horizon, Algoverse, Ladder, TASP, Garcia, ISSYP, Euler Circle, SUMaC; student journals (JEI, NHSJS, JSR); citizen science (Schweiz forscht, ornitho.ch / Vogelwarte, Wilde Nachbarn, iNaturalist, eBird, Globe at Night); Maturaarbeit prizes.
- **Essays & writing:** Adroit Prizes, Kenyon Review Grodd Prize, Princeton poetry and ten-minute play contests, Re:think, Prix du Jeune Écrivain, Der Bund essay prize, and Swiss writing competitions.
- **Money & banking (8 → 45):** each of the 24 cantonal banks (shown only to students in that canton), Valiant, regional banks and comparison sites. Also financial-literacy resources: iconomix (SNB), Forum SNB, FinanceMission, PostFinance MoneyFit, Budgetberatung, debt prevention, BEM bank traineeship, Khan Academy personal finance, Global Money Week and a school investment club. These use the new `group: 'money'` field (`typeGroup` in `lib/matching.js` honours `group`). Bank listings stay neutral and tell students to compare before choosing.
- **Volunteering:** Tischlein deck dich, Pro Senectute, Amnesty youth, Greenpeace, Swiss Youth for Climate, Stiftung Umwelteinsatz, Clean-Up-Day, Summit Foundation, Net'Léman, Repair Cafés, animal shelters, disability holiday camps, Blindspot, Pfadi trotz allem, Interact and Leo clubs, UN Youth Delegate, plus 19 big events (Weltklasse, Athletissima, marathons, Swiss Indoors, Spengler Cup, Lauberhorn, Locarno, Montreux Jazz, Gurten, OpenAir St. Gallen, ZFF, SwissSkills…).

## iPhone / iPad app (Xcode), Nov 2026
`ios/CVAscender.xcodeproj` is a SwiftUI app (iOS 16+) that shows CVAscender full-screen in a web view. It keeps logins and data, opens official sites in Safari, and shows a native offline screen. In the Simulator it loads `http://localhost:3000`, so run `npm run dev` first. For a real phone, set the address in `ios/CVAscender/AppConfig.swift`. Step-by-step instructions are in **`ios/README.md`**.

## Native iPhone app for the App Store (Nov 2026)
`ios/` is now a **native SwiftUI app** rather than a web wrapper. It has onboarding, a ranked feed, search, details, My path, a CV builder and deadline reminders. All listings are bundled (`npm run ios:data` exports them from `lib/` to `ios/CVAscender/Resources/opportunities.json`), and it works offline with no account. See `ios/README.md` to run it and **`ios/APP_STORE.md`** for the full publishing checklist. The website now has a **`/privacy`** page for the App Store's privacy-policy link; put your real contact email in `app/privacy/page.js`.

### iPhone app redesign (Nov 2026)
The native app now matches the website: logo, Geist font, website colours in **light and dark mode** (System, Light or Dark in Settings, or the ☀️/🌙 button), **full-screen snap-scrolling reels**, the website's Explore page, the details sheet, My path, Profile & CV with the gap analysis, Settings, and a **floating capsule tab bar**. It needs iOS 17 or later. See `ios/README.md`.

## United Kingdom (Nov 2026)
CVAscender now covers **Switzerland and the United Kingdom**. Students choose their country in onboarding, then a canton (CH) or region (12 UK nations and English regions), and school years follow each country (Year 7–13 / S1–S6). The feed only shows the student's own country plus worldwide (online/abroad) listings.

`lib/uk.js` adds **1,824 UK listings**:
- **210 national programmes**: olympiads (UKMT, BMO, UK MOG, BPhO, Chemistry, Biology, Informatics, Linguistics…), the Big Bang Competition, CREST, Nuffield Research Placements, Arkwright, CyberFirst, Smallpeice, UNIQ, Sutton Trust, university access schemes in all four nations, work experience (Speakers for Schools, Springpod…), essay and writing prizes, debating, the UK/Scottish/Welsh youth parliaments and NI Youth Assembly, DofE, Scouts, Girlguiding, cadets, volunteering, national youth ensembles, sport finders, and neutral youth bank accounts plus money education.
- **144 region cards** (12 regions × 12: Wildlife Trusts, Young Farmers, police and fire cadets, volunteer centres, county orchestras, university taster days…).
- **1,470 town cards** (147 towns × 10: football, Scouts, Girlguiding, cadets, St John, music service, youth council, swimming, athletics, rugby).
- **13 national programmes were checked with web searches on 11 Nov 2026** and are marked verified. Everything else is "Not checked yet". **NCS is not listed: it closed on 31 March 2025.** Many UK programmes are for UK state-school students only, and their eligibility says so.

`npm run ios:data` exports both countries to the iPhone app, which has the same country choice.

## Real club logos (Nov 2026)
Specific clubs (FC Basel, US Terre Sainte, ZSC Lions…) **show their own club logo as the image**: no stock photos, and no club photos either, so nothing copyrighted is copied. A logo used to identify its club is the normal way apps show clubs.

The logos come from `lib/clubMedia.json`, which a script fills. **Run it once on your own computer** (it needs normal internet):

```
npm run club-media -- --limit 20
npm run club-media
```

For each club it finds the official website, **checks it really is the club's site** (never a town or tourism site such as `basel.com` for FC Basel; unsure means skipped), and picks the logo. Afterwards, open `lib/clubMedia.json`, delete anything that looks wrong, and run `npm run ios:data` for the iPhone app. Clubs without a logo show the coloured poster art with the club name. USTS is already in the file (`https://www.usts.ch/`).

**Switzerland only again.** The UK data is kept in `lib/uk.js`. To switch it back on, add `'GB'` to `ENABLED_COUNTRIES` in `lib/constants.js` and `UK_LISTINGS` in `lib/opportunities.js`.

## Website restructure (Nov 2026)
Layout patterns from Mobbin: Eventbrite and Dribbble (filter sidebar with counts), and Zillow and Turo (top header with tabs).
- **Top header** on computers: Discover · Explore · My path · Profile, plus search and settings. Phones keep the floating pill bar.
- **Discover**: filters always visible on the left with live counts, the reel scroll in the middle, and closing-soon deadlines on the right.

## Hosting on Cloudflare (Nov 2026)
The site runs on Cloudflare Workers through the OpenNext adapter (`@opennextjs/cloudflare`, `wrangler.jsonc`, `open-next.config.ts`).
`npm run deploy` builds and uploads, and `npm run preview` runs the Cloudflare version locally. The worker is about 1.7 MB gzipped (the free plan allows 3 MB).
Built-in local accounts are off there (`LOCAL_ACCOUNTS=off`, because there's no disk), so use Supabase for accounts.
`proxy.js` (an HTTPS redirect) was removed: Cloudflare's "Always Use HTTPS" does that job, and Node middleware is experimental on Workers.
Step-by-step guide: `PUT-IT-ONLINE.md`.

## Keys: two files (Nov 2026)
- `keys-template.env` is the **blank** template with no keys. It's safe to share or upload.
- `keys.env` is **your** keys file. Fill it in on your Mac. It's in `.gitignore`, is never packed into the code, and `npm run deploy` uploads its filled-in lines to Cloudflare as encrypted secrets. `npm run dev` reads it too.
- Don't use `.env.local`: the Cloudflare build would pack it into the uploaded code, so `npm run deploy` refuses to run if it has values.
