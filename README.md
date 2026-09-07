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
assets/js/main.js           interaction layer (see below)
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
| Gallery filter groups | `data-cat` on each `<figure>`, and the `.chip` buttons above the grid |
| Stat counters | `data-count-to` / `data-count-suffix` on the `.stat strong` elements |

### The quote form

The form does **not** post anywhere. Both buttons build a message from the fields and
hand it to the visitor's own WhatsApp or mail client, so the site stays fully static with
no backend, no third-party form service and no data stored on the server.

If a real inbox-delivered form is wanted later, a hosted endpoint (Formspree, Basin,
Netlify Forms) can be dropped into `assets/js/main.js` without touching anything else.

## The interaction layer

`assets/js/main.js` is one IIFE of small independent blocks, each guarded so a
missing element or unsupported API is a no-op rather than an error:

| Block | What it does |
| --- | --- |
| `nav` | mobile menu, closes on link click, Escape, and on widening past the breakpoint |
| `scrollChrome` | progress bar, header shadow, back-to-top — one rAF-throttled scroll listener, not three |
| `reveal` | staggered fade-and-rise as sections enter view |
| `counters` | stat numbers count up once, when the strip is half visible |
| `activeSection` | underlines the nav link for the section you are reading |
| `parallax` | hero collage drifts with the pointer |
| `lightbox` | full-screen gallery: arrows, keyboard, swipe, focus trap, neighbour preloading |
| `filters` | gallery category chips |
| `copyButtons` | one-click copy for phone, email and GST |
| `quoteForm` | validation, live preview of the message, WhatsApp / mail handoff |

Three things about it are deliberate and worth not undoing:

**Nothing can be hidden by a broken animation.** The reveal animation's hidden
state lives in the stylesheet behind `html.js`, which an inline script in
`<head>` sets before first paint. With JavaScript off, disabled, or failing, no
element is ever hidden — and because the rule is in the blocking stylesheet
rather than applied by the deferred script, there is also no flash of
visible-then-hidden content. On top of that, `reveal` bails out and shows
everything if `IntersectionObserver` is missing, if the viewport has no size
(a background tab, a hidden iframe), or if nothing has revealed after 1.5s.

**`prefers-reduced-motion` is honoured properly.** The block at the end of
`styles.css` removes the movement but keeps every state change, so hovers,
filters and the lightbox still respond — they just do not travel. The parallax
and the counters opt out in JavaScript instead, since there is no static
equivalent of either.

**The lightbox walks the filtered set, not the whole grid.** `filters` hands
the visible figures to `lightbox.setPool()`, so arrowing through a filtered
gallery stays inside the filter and the `3 / 6` counter is honest. The grid
uses one delegated click handler for the same reason — filtering never leaves
stale listeners behind.

## Notes on the assets

- `brand/logo.png` and `brand/mark.png` come from the supplied logo JPEG. The white
  background was removed by flood-filling inward from the border, so the white gaps *inside*
  the printer body survive; the alpha edge was then feathered to hide the JPEG stair-step.
  If a vector original (AI/EPS/SVG/PDF) ever turns up, replace these — it will be sharper
  and much smaller.
- Machine photographs are the images embedded in the profile PDF, trimmed and re-encoded.
  Some remain supplier product shots used in the original brochure rather than photographs
  of this workshop — the self-ink stamp shot is still visibly Trodat-branded, for instance.
  Worth replacing with real photographs when they are available.
- The pre-ink stamp photo arrived carrying an `expressprint.com.sg` watermark along the
  bottom. Publishing another company's watermark on a commercial site is not acceptable, so
  the strip is cropped off (the photo is otherwise the right product).

### Stock photography

Three of the four supply photographs are from **Pexels**, whose licence permits commercial
use with no attribution required. Sources, so they can be re-fetched or replaced:

| File | Pexels photo |
| --- | --- |
| `supplies/safety-material.jpg` | [8488037](https://www.pexels.com/photo/8488037/) — hard hat and work gloves |
| `supplies/housekeeping-material.jpg` | [5217889](https://www.pexels.com/photo/5217889/) — row of cleaning products |
| `supplies/office-stationery.jpg` | [8251060](https://www.pexels.com/photo/8251060/) — desk stationery |

Each is centre-cropped to 16:9 and re-encoded at 1200px wide.

**`supplies/packaging-material.jpg` is deliberately not stock.** Pexels has no usable
photograph of industrial packaging consumables — searches for packing tape, bubble wrap and
stretch film return domestic house-moving shots and warehouses full of cardboard boxes,
and cardboard boxes are not on the product list at all. The supplied collage names the
actual four product families (air bubble roll, stretch roll, packing strip, BOPP tape), so
it is more accurate than any substitute. It is composited onto a 16:9 plate so it matches
the other three cards' proportions.

Because these are photographs rather than white-background product shots, `.supply-media`
fills its frame with `object-fit: cover`, unlike `.unit-media` which contains its image.
- The four-colour press photo is 542px wide after trimming, which is the limit of the
  supplied file. It is sharp enough for the card and gallery tiles but would soften if used
  much larger.
- Client logos are reproduced from the profile's customer page. All marks belong to their
  respective owners. They render desaturated and return to full colour on hover, which stops
  fifteen competing brand palettes fighting the rest of the page.
- The card heading icons (`.unit-icon`, `.supply-icon`) are inline SVG authored in this
  repository — no third-party artwork, a few hundred bytes each, and they take the brand
  cyan from CSS rather than being baked in.

## Card image sizing

`.unit-media` and `.supply-media` use a fixed `height` plus a `max-height: calc(...)` on the
image, deliberately — **not** `aspect-ratio` with `max-height: 100%`. A percentage
max-height on a grid item resolves against the auto-sized row track rather than the box, so
it gets ignored: tall or square photos then stretch the box, which knocks the card titles in
a row out of alignment and clips the image. If you change these heights, change the padding
variable alongside them.
