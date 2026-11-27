# Put CVAscender online with Cloudflare

You need Node.js on your Mac (check with `node -v` in Terminal; if missing, install "LTS" from nodejs.org).

## First time
1. Unzip and move the `cvascender` folder into Documents.
2. Terminal:
   cd ~/Documents/cvascender
   npm install
3. Log in to Cloudflare (opens the browser, click "Allow"):
   npx wrangler login
4. Upload the site:
   npm run deploy
   After 1–3 minutes it prints a link like https://cvascender.<your-name>.workers.dev. That's your live site.
   (If it asks you to register a workers.dev subdomain, pick any name, e.g. cvascender.)

## Connect cvascender.com (bought on Cloudflare)
Cloudflare dashboard → Workers & Pages → cvascender → Settings → Domains & Routes → Add → Custom domain →
type cvascender.com → Add. Do it again for www.cvascender.com. No DNS records to copy: Cloudflare does it.
Then: cvascender.com → SSL/TLS → Edge Certificates → turn on "Always Use HTTPS".

## Every update after that
   cd ~/Documents/cvascender
   npm run deploy

## Keys: two files
- keys-template.env : blank template, no keys. Safe to share.
- keys.env               : YOUR keys file (downloaded separately). Put it in the cvascender folder,
                           next to package.json, and paste each key after the = sign.
`npm run deploy` uploads the filled-in keys to Cloudflare as encrypted secrets (never into the code).
`npm run dev` uses them on your Mac too. Never paste keys into a chat, email or screenshot.
Do NOT make a .env.local file: deploy refuses to run if one has keys in it.

Test on your Mac before uploading: `npm run dev` (normal), or `npm run preview` (exactly like Cloudflare).
Accounts ("Sign in") are off on Cloudflare until Supabase is set up; everything else works.
