# Shivansh Printers — website

Static marketing site for **Shivansh Printers**, Koregaon Bhima, Pune — multicolour offset,
digital, screen and flexo printing, barcode labels, stamps, I-cards, binding and industrial
signage, plus supply of safety, packaging, housekeeping and office stationery material.

Content, machine photography and client logos are taken from the company profile PDF; the
four-colour press, the four supply categories and the current logo were supplied separately.

## Stack

Plain HTML, CSS and vanilla JavaScript. No build step, no framework, no npm install.
Everything in the repository root *is* the published site.

```
index.html                  the whole site (single page, anchored sections)
assets/css/styles.css       styles
assets/js/main.js           mobile nav, gallery lightbox, quote-form composer
assets/img/brand/           logo lockup + mark, from the supplied logo artwork
assets/img/units/           machine and product photography
assets/img/supplies/        safety / packaging / housekeeping / stationery
assets/img/clients/         customer logos
favicon.*, apple-touch-icon.png
.nojekyll                   tells Pages to serve files as-is
.github/workflows/deploy.yml
```

## Run it locally

Open `index.html` in a browser, or serve it so relative paths behave exactly as they will
in production:

```bash
python -m http.server 8000
```

Then visit <http://localhost:8000>.

## Deploy to GitHub Pages

The workflow in `.github/workflows/deploy.yml` publishes the repository root on every push
to `main`. It uses the official Pages actions, so no `gh-pages` branch is involved.

**One-time setup**

1. Create a repository on GitHub (public, or private on a plan that includes Pages).
2. Point this folder at it and push:

```bash
git remote add origin https://github.com/USERNAME/REPO.git
git branch -M main
git push -u origin main
```

3. In the repository, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
4. Push again (or run the workflow from the **Actions** tab). The live URL appears on the
   workflow run and under Settings → Pages.

The site will be at `https://USERNAME.github.io/REPO/`.

### Custom domain

1. Add a `CNAME` file in the repository root containing just the domain, e.g.
   `shivanshprinters.com`.
2. At your DNS provider, point the domain at GitHub Pages:
   - apex domain — four `A` records to `185.199.108.153`, `185.199.109.153`,
     `185.199.110.153`, `185.199.111.153`
   - `www` subdomain — a `CNAME` record to `USERNAME.github.io`
3. In **Settings → Pages**, enter the domain and tick **Enforce HTTPS** once the
   certificate is issued.
4. Update the commented `Sitemap:` line in `robots.txt` and the `og:image` URL in
   `index.html` if you want absolute URLs for social previews.

## Editing content

Everything is in `index.html` — there is no CMS and no templating. Common edits:

| What | Where |
| --- | --- |
| Phone / WhatsApp number | `index.html` (search `7798232464`) **and** `PHONE` in `assets/js/main.js` |
| Email address | `index.html` (search `shivanshprinters22`) **and** `EMAIL` in `assets/js/main.js` |
| Address, GST | `index.html` — contact section and the JSON-LD block in `<head>` |
| Brand colours | CSS custom properties at the top of `assets/css/styles.css` |
| Products list | the `.cat-grid` block in `index.html` |
| Add a client logo | drop a trimmed PNG in `assets/img/clients/` and add an `<li>` to `.client-grid` |
| Add a gallery photo | drop a JPEG in `assets/img/units/` and add a `<figure>` to `#gallery-grid` |
| Supply item lists | the `.item-list` blocks in the `#supplies` section |
| Quote-form categories | the `<optgroup>` blocks in `#qf-job` |

### The quote form

The form does **not** post anywhere. Both buttons build a message from the fields and
hand it to the visitor's own WhatsApp or mail client, so the site stays fully static with
no backend, no third-party form service and no data stored on the server.

If a real inbox-delivered form is wanted later, a hosted endpoint (Formspree, Basin,
Netlify Forms) can be dropped into `assets/js/main.js` without touching anything else.

## Notes on the assets

- `brand/logo.png` and `brand/mark.png` come from the supplied logo JPEG. The white
  background was removed by flood-filling inward from the border, so the white gaps *inside*
  the printer body survive; the alpha edge was then feathered to hide the JPEG stair-step.
  If a vector original (AI/EPS/SVG/PDF) ever turns up, replace these — it will be sharper
  and much smaller.
- Machine and product photographs are the images embedded in the profile PDF, trimmed and
  re-encoded. Several are stock or supplier product shots used in the original brochure
  rather than photographs of this workshop — the self-ink stamp shot is visibly
  Trodat-branded and the pre-ink one carries an `expressprint.com.sg` watermark. The four
  supply collages are generic web images of the same kind. All of these are worth replacing
  with real photographs of actual stock when they are available.
- The four-colour press photo is 542px wide after trimming, which is the limit of the
  supplied file. It is sharp enough for the card and gallery tiles but would soften if used
  much larger.
- Client logos are reproduced from the profile's customer page. All marks belong to their
  respective owners.

## Card image sizing

`.unit-media` and `.supply-media` use a fixed `height` plus a `max-height: calc(...)` on the
image, deliberately — **not** `aspect-ratio` with `max-height: 100%`. A percentage
max-height on a grid item resolves against the auto-sized row track rather than the box, so
it gets ignored: tall or square photos then stretch the box, which knocks the card titles in
a row out of alignment and clips the image. If you change these heights, change the padding
variable alongside them.
