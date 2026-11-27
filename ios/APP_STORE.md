# Publishing CVAscender on the App Store

A step-by-step checklist. Budget **1–2 weeks** for the first time (account approval plus review).

## 0. Before you start: the developer account
- You need the **Apple Developer Program** (99 a year, paid in CHF in Switzerland). Enroll at developer.apple.com/programs.
- ⚠️ **The account holder must be an adult (18+).** If you're under 18, a **parent or guardian** enrolls with their own Apple ID and adds you to the team. A school or club can also enroll as an organisation (needs a D-U-N-S number).
- Publishing under a person's name shows their legal name as the "Seller" on the App Store.

## 1. Make the app yours (in Xcode)
1. **Bundle identifier:** target **CVAscender → Signing & Capabilities**. Change `com.example.cvascender` to something unique you own, e.g. `ch.yourname.cvascender`.
2. **Team:** pick your developer team there.
3. **Version:** in the General tab, Version `1.0` and Build `1` are fine for the first upload. Increase Build for every new upload.
4. **Test on a real iPhone:** onboarding, feed, search, save → applied → completed, the CV share, the reminder bell (accept the notification permission), and deleting your data.

## 2. Privacy policy (required)
- The website now has a page at **`/privacy`** (`app/privacy/page.js`).
- The contact email on the privacy page is **cvascender@gmail.com**.
- Deploy the website (README section 7). Your privacy URL is then `https://<your-site>/privacy`.

## 3. Create the app in App Store Connect
appstoreconnect.apple.com → **Apps → + → New App**
- Platform: iOS · Name: **CVAscender** (if taken, try "CVAscender – Student Opportunities") · Primary language: English · Bundle ID: the one from step 1 · SKU: `cvascender-ios`

### App information
- **Subtitle (30 characters):** `Olympiads, clubs & more in CH`
- **Category:** Education (secondary: Productivity)
- **Content rights:** "does not contain, show, or access third-party content". The app shows facts about public programmes and links to their websites; it uses no third-party logos or photos.
- **Age rating questionnaire:** answer **None/No** to everything. "Unrestricted web access": **No** (links open in Safari, not inside the app). The result should be **4+**.
- **Do not** put it in the **Kids** category. That category has much stricter rules and isn't needed.

### App privacy ("nutrition label")
- "Do you or your third-party partners collect data from this app?" → **No, we do not collect data from this app.** This is true: everything stays on the device, and there are no analytics, no ads and no SDKs. The app only *downloads* public images (Unsplash photos, organiser icons); that isn't data collection in Apple's sense, and the privacy page mentions it.
- Privacy Policy URL: `https://<your-site>/privacy`

### Pricing and availability
- Availability: **Switzerland and the United Kingdom** (the listings cover both).

## 4. Screenshots (required)
- You need iPhone screenshots for the **6.9" display** (1320 × 2868 px; Apple scales them down for smaller iPhones). 3–5 is plenty.
- Easiest way: run the **iPhone 16 Pro Max** simulator → **File → Save Screen** (⌘S).
- Good set: 1) For you feed · 2) a details page with "Why it fits you" · 3) Explore search, e.g. "robotics" · 4) My path · 5) Profile & CV.

### Description (you can paste and edit this)
> **Find what's next — and build your CV while you do it.**
>
> CVAscender shows high-school students in Switzerland and the UK nearly 5,000 opportunities in one place: science olympiads, competitions, hackathons, university taster weeks, research programmes, essay prizes, sports clubs, scouts, volunteering, job taster days and more, from all 26 Swiss cantons and every UK region — from UKMT and the Big Bang Competition to UNIQ, Sutton Trust summer schools and DofE.
>
> • **Matched to you:** tell us your canton, town, age, interests and the skills you want to build, and every listing gets a match score with the reason it fits.
> • **Search everything:** "football Geneva", "robotics", "essay", or browse by type.
> • **Never miss a deadline:** turn on a reminder for any listing.
> • **My path:** track what you've saved, applied to and completed.
> • **Your CV, built for you:** record your activities, and completed ones turn into a ready-made CV you can share.
> • **Private by design:** no account, no ads, no tracking. Everything stays on your phone.
>
> Listings marked "Source checked" were verified against official pages; others are real organisations whose details you should confirm on their website. CVAscender isn't affiliated with the organisations listed.

- **Keywords (100 characters):** `olympiad,competition,volunteering,summer school,DofE,UCAS,CV,Switzerland,UK,sixth form,clubs`
- **Support URL:** your website, e.g. `https://<your-site>` · **Contact email for App Review:** cvascender@gmail.com

## 5. Upload the build
1. In Xcode, choose **Any iOS Device (arm64)** as the destination.
2. **Product → Archive**. When it's done, the Organizer opens: **Distribute App → App Store Connect → Upload**.
3. After about 15–30 minutes the build appears in App Store Connect under **TestFlight**. Optionally test it there first on your phone.
4. On the version page, under **Build**, select the build.
5. **Export compliance:** already answered in `Info.plist` (`ITSAppUsesNonExemptEncryption = NO`).

## 6. App Review notes (paste into "Notes")
> CVAscender is a native SwiftUI app (iOS 17+). All listings are bundled in the app (photos load from Unsplash when online), and the student's profile and progress are stored only on the device (no account, no login, no server). To test: complete the 4-step onboarding (any canton/town), swipe through the Discover reels (double-tap saves), search in Explore, open a listing, save it, tap the bell to set a reminder, and mark something Completed to see it appear on the CV in "Profile & CV". "Open official website" opens the organiser's site in Safari. Listings marked "Not checked yet" are real organisations whose dates we ask students to confirm on the official website.

No demo account is needed: say so ("No sign-in required").

## Subscription: CVAscender Plus (7-day free trial, then CHF 1.50/month or CHF 15/year)
The app is locked behind the subscription (after onboarding the student sees the paywall). The code is in `Model/Subscriptions.swift` and `Views/PaywallView.swift`.

### A. Before anything: agreements and bank (App Store Connect → Business)
1. Accept the **Paid Apps Agreement**.
2. Add **bank account** and **tax forms**. The account holder (a parent, if you're under 18) fills these in.
3. Apply for the **App Store Small Business Program** (Apple takes 15% instead of 30%).

### B. Create the subscriptions (App Store Connect → your app → Subscriptions)
1. **Create a subscription group** called `CVAscender Plus`.
2. Add two subscriptions **with exactly these Product IDs** (the app looks for them):
   | Reference name | Product ID | Duration | Price |
   |---|---|---|---|
   | CVAscender Plus Yearly | `cvascender.plus.yearly` | 1 year | CHF 15.00 |
   | CVAscender Plus Monthly | `cvascender.plus.monthly` | 1 month | CHF 1.50 |
   Put **Yearly at level 1** and Monthly at level 2.
3. For **each** one: **Subscription Prices → +** to set the Swiss price (Apple fills in other countries), then **Introductory Offers → +** → **Free**, **1 week**, all countries.
4. Add a display name and description for each (e.g. "CVAscender Plus (yearly)", "Full access to CVAscender").
5. **Review screenshot:** a screenshot of the paywall (Simulator → ⌘S).
6. On the version page, under **In-App Purchases and Subscriptions**, select both subscriptions so they're reviewed **together with the app**.

### C. Required links
- In `Model/Subscriptions.swift`, set `privacyURL` to your real privacy page (`https://<your-site>/privacy`).
- The app uses **Apple's standard Terms of Use (EULA)**. In App Store Connect, add this line at the end of the **App Description**: `Terms of Use: https://www.apple.com/legal/internet-services/itunes/dev/stdeula/`
- The **Privacy Policy URL** field must be filled in (step 3 above).

### D. Test it before submitting
- **In the Simulator (free, no account needed):** Xcode menu **Product → Scheme → Edit Scheme… → Run → Options → StoreKit Configuration → `CVAscender.storekit`**. Run the app: the paywall shows the plans, and "Start 7-day free trial" works with fake purchases. **Debug → StoreKit → Manage Transactions** lets you cancel or expire them to see the paywall again.
- In debug builds there's also a small **"Skip (debug builds only)"** button on the paywall. It's hidden in App Store builds.
- **On a real iPhone with TestFlight:** purchases are free test purchases, and subscriptions renew every few minutes so you can watch the whole cycle.

### E. App Review notes for subscriptions (add to the notes in section 6)
> The app requires a CVAscender Plus subscription (7-day free trial, then CHF 1.50/month or CHF 15/year). After the 4-step onboarding the paywall appears; please start the free trial with your sandbox account. Restore Purchases is on the paywall and in Profile → Subscription. Subscriptions can be managed in Profile → Subscription → Manage subscription.

### F. Update the description
Add near the top: "Try it free for 7 days, then CHF 1.50 a month or CHF 15 a year. Cancel anytime."

**App Privacy** stays "Data not collected": Apple handles payments, and the app doesn't send purchase data anywhere.

## 7. Submit
Press **Add for Review → Submit**. Review usually takes 1–3 days. If Apple rejects it, the message cites a guideline. Reply in Resolution Center, or fix the issue and upload a new build (increase the Build number).

## Common rejection reasons, and how this app avoids them
| Guideline | Risk | Status |
|---|---|---|
| 4.2 Minimum functionality (website in an app) | High for web wrappers | ✅ Native screens, offline data, notifications, CV builder |
| 5.1.1 Privacy policy and data | Missing policy | ✅ `/privacy` page; "Data not collected" |
| 2.1 App completeness | Crashes, placeholder text | ⚠️ Test on a real device; replace `com.example` and the privacy email |
| 2.3 Accurate metadata | Screenshots that don't match the app | Use real screenshots from the simulator |
| 1.3 / 5.1.4 Kids | Kids category rules | ✅ Not in the Kids category |
