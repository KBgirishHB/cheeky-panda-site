# Cheeky Panda Photography — website

Single-page static site. No build step, no server code, no API keys.
Double-click `index.html` and it works; host the folder anywhere and it works.

```
index.html            the whole page
assets/style.css      design system + layout
assets/main.js        interactions (lightbox, cursor, accordion, …)
assets/*.png          favicon and app icons made from the real logo (+ web manifest)
media/                intro video shown on the landing screen until "Enter site"
images/               photos, already resized (max 1600px, JPEG q80) and named for SEO
robots.txt            search-engine rules
sitemap.xml           page + image sitemap
404.html              "Out of frame" page (used by Cloudflare Pages and GitHub Pages)
_headers              caching headers for Cloudflare Pages
```

---

## MANUAL SWAPS LEFT

Things only the owner can confirm. Search `index.html` for the quoted text.

1. **Final web address (important for SEO).** Every SEO URL assumes
   `https://cheekypanda.pages.dev/`. If your Cloudflare project gets a different
   name, or you add a custom domain, find-and-replace that address in
   `index.html` (canonical, `og:url`, `og:image`, `twitter:image`, JSON-LD),
   `robots.txt` and `sitemap.xml`.
2. **Portfolio link.** The brief said `/cheekypanda/portfolio`, but that address returns
   404. The live page is spelled `/cheekypanda/portfilio`, so the two "Full archive"
   links use that. If you fix the spelling on Wix, update both links.
3. **Gallery captions.** The eight caption titles come from the brief; the photos are the
   real ones from the Wix portfolio, matched by look and shape. Where the brief's category
   plainly did not fit the photo it was changed (Nº 06 "Newborn" → "Outdoor",
   Nº 07 "Kids" → "Dance"). Nº 01–05 and 08 still carry the brief's category and location
   (e.g. "Wedding · Kanchipuram") — check they are true for the photo shown, or swap the photo.
   Nº 09–12 are extra real photos with new titles; locations are generic ("Chennai").
4. **Hero and studio polaroid captions** ("Divya & Karthik — Kanchipuram, 5:12 AM",
   "backstage, mid-laugh", "the Adyar studio") are the brief's wording on real photos.
5. **Testimonials** are the four sample quotes from the brief. Replace with real client
   words before launch.
6. **Service prices** are the brief's (from ₹75,000 / ₹12,000 / ₹18,000 / ₹25,000 / ₹20,000).
   The Wix site lists different packages (Modeling Shoot ₹2,000, Out Door Shoot ₹4,000).
   Confirm which are current. Prices also appear in the JSON-LD block in `<head>`.
7. **Stats** (7+ years, 400+ shoots, 15,000+ photos) and "Now booking the 2026–27 season".
8. **No newborn, family-group or wedding-ceremony photos** exist on the Wix site, so those
   services have no matching picture yet. Drop new photos into `images/` using the same
   file names to replace any slot with zero layout changes (keep the same shape).
9. **WhatsApp / YouTube**: none found on the old site, so none are linked.
10. **Google Business listing**: the footer uses the Google search link from the brief. If
    you have the real `g.page` / Maps link, swap it in (also add it to `sameAs` in JSON-LD).

Already replaced with real values taken from the Wix site:
email `cheekypandabg@gmail.com`, phone `+91 79046 22479`, Instagram `@cheekypandabg`,
Facebook `girishrao.photography`, founding year 2019 and founders' names.

The real red-panda logo (from the Wix site) is used in the nav, the favicon and as the
fallback on the landing screen: `images/brand/cheeky-panda-logo.png` and `-small.png`.
The landing screen plays `media/cheeky-panda-intro.mp4` (the Wix intro video, 720p, 3.5 MB)
until the visitor clicks "Enter site".

### Replacing a photo

Each gallery photo has two files: `name.jpg` (large, for the lightbox) and `name-800.jpg`
(small, for the grid). Export your new photo at the same shape, save over both, done.

---

## DEPLOY — Step A: GitHub

One-time setup: create a free account at https://github.com and install Git
(https://git-scm.com/download/win) if `git --version` does not work in a terminal.

1. On github.com: **+** (top right) → **New repository** → name `cheeky-panda-site` →
   **Public** → do **not** tick "Add a README" → **Create repository**.
2. Open a terminal in this folder and run, one line at a time
   (replace `YOUR-USERNAME`):

   ```
   git init -b main
   git add .
   git commit -m "Cheeky Panda Photography site"
   git remote add origin https://github.com/YOUR-USERNAME/cheeky-panda-site.git
   git push -u origin main
   ```

   A browser window opens the first time to sign you in to GitHub.

No terminal? On the new repository page click **uploading an existing file**, drag in
`index.html`, `404.html`, `robots.txt`, `sitemap.xml`, `_headers`, `README.md`, `.gitignore`
and the `assets`, `images` and `media` folders, then **Commit changes**.
(Do not upload the brief file `cheekypanda Photography` or the `.claude` folder.)

## DEPLOY — Step B: Cloudflare Pages (main host)

1. Create a free account at https://dash.cloudflare.com.
2. **Workers & Pages** → **Create** → **Pages** tab → **Connect to Git** →
   authorise GitHub → pick `cheeky-panda-site` → **Begin setup**.
3. Build settings: Framework preset **None**, Build command **empty**,
   Build output directory **/** . → **Save and Deploy**.
4. About a minute later the site is live at `https://cheekypanda.pages.dev`
   (if that name is taken Cloudflare adds a suffix — then do Manual Swap 1).
5. Every later `git push` redeploys automatically. Old versions stay under
   **Deployments** for one-click rollback.
6. Custom domain (optional): Pages project → **Custom domains** → **Set up a domain**.
   Free HTTPS is issued automatically. Then do Manual Swap 1 with the new domain.

## DEPLOY — Step C: GitHub Pages (free second URL)

Repo → **Settings** → **Pages** → Source **Deploy from a branch** → Branch **main**,
folder **/ (root)** → **Save**. Live in a few minutes at
`https://YOUR-USERNAME.github.io/cheeky-panda-site/`. All paths are relative, so the
sub-folder address needs no changes.

Use one address as the "real" one. The canonical tag already tells Google that the
Cloudflare address is the original, so the GitHub copy will not compete with it.

---

## SEO — what is built in, and what to do after launch

Built in: title and meta description, canonical URL, Open Graph + Twitter share card
(1200×630 image), `Photographer` / `LocalBusiness` structured data with address, phone,
services and prices, one `<h1>`, ordered headings, descriptive alt text and file names on
every photo, image sitemap, `robots.txt`, lazy-loaded and correctly-sized images,
favicon set, mobile-friendly layout, reduced-motion support.

After the site is live:

1. **Google Search Console** (https://search.google.com/search-console) → add the site →
   verify → **Sitemaps** → submit `sitemap.xml`. This is what gets you indexed.
2. **Google Business Profile**: set the Website field to the new address. For a local
   studio this matters more than anything on the page.
3. Test the structured data at https://search.google.com/test/rich-results and the share
   card by pasting the link into WhatsApp.
4. Put the new address in the Instagram and Facebook bios and on the Wix site.
5. Ask happy clients for Google reviews mentioning the kind of shoot and "Chennai".

## Check after deploying (both hosts)

Lightbox (click a photo, ← →, Esc) · embedded Jotform loads in the booking section ·
custom cursor on desktop · hamburger menu on a phone · the external links: portfolio
site, full archive, mobile app, booking form, Google listing, Instagram, Facebook.
