// Privacy policy for the CVAscender website and iOS app.
// The App Store needs a public URL for this page: https://<your-site>/privacy
import Link from 'next/link';

export const metadata = { title: 'Privacy — CVAscender' };

const CONTACT = 'cvascender@gmail.com';
const UPDATED = '26 November 2026';

const H = ({ children }) => <h2 className="mt-10 font-display text-2xl">{children}</h2>;
const P = ({ children }) => <p className="mt-3 leading-relaxed text-ink-soft">{children}</p>;
const LI = ({ children }) => <li className="mt-2 leading-relaxed text-ink-soft">{children}</li>;

export default function Privacy() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/" className="text-sm font-semibold text-lapis">← CVAscender</Link>
      <h1 className="mt-6 font-display text-5xl leading-none">Privacy</h1>
      <p className="mt-3 text-sm text-ink-muted">Last updated {UPDATED}</p>

      <P>CVAscender helps high-school students in Switzerland and the United Kingdom find opportunities and build their CV. We collect as little as possible, we never sell data, and there are no ads or tracking.</P>

      <H>The iPhone and iPad app</H>
      <ul className="list-disc pl-5">
        <LI><b>Everything stays on your device.</b> Your answers (first name if you give one, canton, town, age, school year, interests, skills) and your saved, applied and completed listings are stored only on your iPhone or iPad. We have no server for the app and cannot see this data.</LI>
        <LI><b>No account, no tracking, no analytics, no ads.</b></LI>
        <LI><b>Subscription:</b> payments for CVAscender Plus are handled entirely by Apple. We never see your payment details; the app only asks Apple whether your subscription is active.</LI>
        <LI><b>Reminders</b> are local notifications scheduled on your device. You can turn them off in iOS Settings.</LI>
        <LI><b>Photos and logos:</b> to show pictures like the website, the app loads illustrative photos from Unsplash and organisers’ icons from Google’s public icon service. These services receive your device’s IP address when an image loads, as with any website, but nothing about you or your answers.</LI>
        <LI><b>Links</b> to official websites open in Safari. Those websites have their own privacy policies.</LI>
        <LI><b>Deleting:</b> Profile &amp; CV → “Delete my data and start again”, or delete the app.</LI>
      </ul>

      <H>The website</H>
      <ul className="list-disc pl-5">
        <LI><b>Without an account</b>, your answers and progress are saved only in your browser (localStorage).</LI>
        <LI><b>With an account</b>, we store your email address, a hashed password (never the password itself) and your profile and progress, encrypted. Login uses a secure cookie. You can delete your account in Settings.</LI>
        <LI><b>Where it’s stored:</b> account data is kept by our database provider, Supabase, on servers in Ireland (EU), protected by the GDPR. The website itself runs on Cloudflare, which processes your requests (including your IP address) to deliver pages securely.</LI>
        <LI><b>AI explanations (if switched on):</b> to write “why this fits you” sentences and CV advice, we send your canton, town, age, school year, interests, skills and the listings concerned to an AI provider (Anthropic or OpenAI). We do <b>not</b> send your name or email.</LI>
        <LI><b>Bot protection (if switched on):</b> the sign-in page may use Cloudflare Turnstile to check you’re not a bot.</LI>
        <LI><b>Fonts and logos</b> are loaded from Google Fonts, Google and DuckDuckGo icon services and the organisers’ own websites. Like any website, these services receive your IP address when your browser loads them.</LI>
      </ul>

      <H>Young people</H>
      <P>CVAscender is made for students aged about 12–19. We don’t ask for more than we need to recommend opportunities, and the app works without any account. If you are under 16, talk to a parent or guardian before creating a website account.</P>

      <H>Your rights</H>
      <P>Under Swiss data protection law and UK data protection law (UK GDPR), and the EU GDPR where it applies, you can ask what data we hold about you, have it corrected or deleted. For the app, the data is on your device and you delete it yourself. For website accounts, contact us.</P>

      <H>Contact</H>
      <P>Questions or requests: <a className="font-semibold text-lapis" href={`mailto:${CONTACT}`}>{CONTACT}</a></P>
    </main>
  );
}
