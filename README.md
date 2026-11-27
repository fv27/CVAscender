# CVAscender

**Find opportunities that fit you, and watch your CV build itself.**

🌐 **Live:** [cvascender.com](https://cvascender.com)

CVAscender helps high-school students in Switzerland (about ages 12–19) discover real opportunities: olympiads, competitions, research and university programmes, summer camps, clubs, sports teams and volunteering. It matches them to each student and turns what they do into a CV.

Most students only hear about a handful of these through school. CVAscender puts 3,000+ of them in one place, ranked for *you*.

---

## What it does

- **A personal feed.** A short set of questions (canton, town, age, school year, interests, skills you want to build) creates a feed ranked for each student. Scroll through it one card at a time, like a social app.
- **Search and filters.** Search everything ("football Geneva", "robotics", "essay competition"), or narrow down by type, category, sport, reach (local / national / worldwide) and online vs. in person. Every filter shows how many results it would give.
- **Why it fits you.** Each listing shows a match score and the reasons behind it: your interests, the skills it builds, how close it is, the deadline, and whether you're eligible yet.
- **My path.** Save opportunities, mark them as applied, then completed. Deadlines go straight into your calendar.
- **A CV that builds itself.** Completed activities become CV lines automatically. A gap analysis shows which areas of your CV are thin (leadership, community, competitions…) and suggests opportunities to fill them. Copy it as text or save it as a PDF.
- **Honest listings.** A listing is only marked as checked after its details have been verified against the official source; everything else is clearly labelled *Not checked yet*.
- **Works everywhere.** Phone, tablet and desktop, light and dark mode. Optional accounts sync your progress across devices.

## Built with

| | |
|---|---|
| **Website** | Next.js 16, React 19, Tailwind CSS |
| **Hosting** | Cloudflare Workers (via OpenNext) |
| **Accounts and database** | Supabase (Postgres) |

The matching engine (`lib/matching.js`) is plain, transparent rules rather than a black box, so every recommendation can be explained to the student.

## Privacy and security

Built for young people, so privacy comes first:

- **No ads, no tracking, no selling data.** Without an account, everything stays in the student's own browser.
- **Minimal data.** No birth date, address or phone number, just what's needed to match.
- **Encrypted.** With an account, a student's data is encrypted (AES-256-GCM) before it reaches the database, and database rules (Row Level Security) mean each student can only ever access their own record.
- **Hardened.** Strict Content Security Policy, input validation on every request, rate limiting, secure cookies, and automatic scanning for leaked secrets and vulnerable dependencies on every push.

Details: [`SECURITY.md`](SECURITY.md) · Privacy policy: [cvascender.com/privacy](https://cvascender.com/privacy)

## Contact

📧 [cvascender@gmail.com](mailto:cvascender@gmail.com)
