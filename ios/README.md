# CVAscender for iPhone (native SwiftUI app)

A native iPhone app built in SwiftUI that **looks like the website**: the logo, the Geist font, lapis and pumpkin colours, **light and dark mode** (☀️/🌙 button), full-screen **TikTok-style reels**, the website's Explore page, and a **floating capsule tab bar**. Everything is behind the **CVAscender Plus** subscription (7-day free trial, then CHF 1.50/month or CHF 15/year). All ~3,100 listings are bundled inside the app, so it works with no server and no account. Photos and organiser logos load from the internet when available; offline, the app shows the generated poster art.



| Screen | What it does |
|---|---|
| Onboarding | Logo, 4-step progress, step pills, big titles; canton grid and town suggestions; age and school year; colour interest tiles; skill pills. |
| Paywall | After onboarding: "Try it free for 7 days", Today / Day 5 / Day 7 timeline, Yearly (CHF 15, Save 17%) or Monthly (CHF 1.50), Start free trial, Terms · Privacy · Restore. The whole app stays locked without an active subscription. |
| Discover | Full-screen reels that snap one at a time: photo (or club logo) fills the card, tags and title bottom-left; logo, match ring, Save, Share and Apply down the right; double-tap to save; For you / Closing soon; Filters sheet. |
| Explore | Random headline, big search bar, recent searches, Browse by type, suggestion pills, endless two-column photo grid. |
| Details | Photo, type labels, trust badge, big title, why it fits you, facts, Saved / Applied / Completed / Remind, sticky Save + Apply bar. |
| My path | Progress card with weekly goal, next deadlines as calendar blocks, Saved / Applied / Completed. |
| Profile & CV | Stats, skills tracker, Add activity, auto-built CV (copy / share). No CV gap analysis. |
| Settings | Your answers, Appearance (System / Light / Dark), **Subscription (manage / restore)**, reminders, reset, about. |

## Run it

1. Install **Xcode 15 or newer** from the Mac App Store. The app needs **iOS 17 or later**.
2. Double-click `ios/CVAscender.xcodeproj`.
3. Pick an iPhone simulator at the top and press **▶ Run** (⌘R).

You don't need to run `npm run dev`: the app has its own data.

On your own iPhone: go to target **CVAscender → Signing & Capabilities → Team** and pick your Apple ID. Then change the bundle identifier `com.example.cvascender` to your own, for example `ch.yourname.cvascender`.

## After changing listings on the website

The app's data file is `CVAscender/Resources/opportunities.json`. Rebuild it from the website's `lib/` files with:

```
npm run ios:data
```

Run that in the `cvascender` folder, then build the app again in Xcode.

## Files

- `CVAscenderApp.swift`: app start, the 4 tabs, and onboarding on first launch.
- `Model/`: listings (`Models.swift`, `Catalog.swift`), matching rules (`Matching.swift`), saved state (`StudentStore.swift`) and notifications (`Reminders.swift`).
- `Views/`: one file per screen. `DesignSystem.swift` holds the website's colours (light and dark), fonts, logo, buttons, chips, match ring and poster art.
- `Fonts/`: Geist, the website's font (SIL Open Font License).
- `Resources/opportunities.json`: all listings, exported from the website.

**Publishing to the App Store:** see `APP_STORE.md`.

> This project was written without a Mac, so it hasn't been compiled yet. Every Swift file passes a syntax check. If Xcode shows an error, the message will point to the exact line; fix it there or ask for help with it.

## Security
- **Subscription:** only Apple-signed (StoreKit 2 "verified") transactions for CVAscender's own product IDs count; refunded, upgraded or expired ones don't. Nothing is cached by the app, so editing files on the phone can't unlock it. It's re-checked at every launch and every time the app comes back to the front. The debug "Skip" button only exists in Xcode debug builds.
- **Your data:** stored only on the phone, in a file protected by iOS Data Protection (encrypted, readable only after the phone has been unlocked once since restart). No account, no server, no tracking. Saved values are size-limited.
- **Network:** HTTPS only (Apple's App Transport Security, no exceptions); the app opens only http(s) links from its own data, never other URL schemes.
- **Payments:** handled entirely by Apple; the app never sees card details.
