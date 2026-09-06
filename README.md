# Shivansh Printers — website

Static marketing site for **Shivansh Printers**, Koregaon Bhima, Pune — offset, digital,
screen and flexo printing, barcode labels, stamps, I-cards, binding and industrial signage.

Content, photography and client logos are taken from the company profile PDF.

## Stack

Plain HTML, CSS and vanilla JavaScript. No build step, no framework, no npm install.
Everything in the repository root *is* the published site.

```
index.html                  the whole site (single page, anchored sections)
assets/css/styles.css       styles
assets/js/main.js           mobile nav, gallery lightbox, quote-form composer
assets/img/brand/           logo lockup + mark, extracted from the profile PDF
assets/img/units/           machine and product photography
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

### The quote form

The form does **not** post anywhere. Both buttons build a message from the fields and
hand it to the visitor's own WhatsApp or mail client, so the site stays fully static with
no backend, no third-party form service and no data stored on the server.

If a real inbox-delivered form is wanted later, a hosted endpoint (Formspree, Basin,
Netlify Forms) can be dropped into `assets/js/main.js` without touching anything else.

## Notes on the assets

- The logo, mark and favicons were rendered from the vector artwork in the profile PDF, so
  they are crisp at any size.
- Machine and product photographs are the images embedded in that PDF, trimmed and
  re-encoded. A few of them are stock/supplier product shots that were used in the original
  brochure rather than photographs of this workshop — worth replacing with real shop-floor
  photos when they are available.
- Client logos are reproduced from the profile's customer page. All marks belong to their
  respective owners.
