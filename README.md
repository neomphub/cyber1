# OREL IT — GISEC Global 2026 Landing Page

A static, dependency-free build: plain HTML, CSS and JavaScript. No build step,
no npm install, no CDN dependency required to run it — open `index.html`
directly in a browser, or drop the whole folder onto any static web host
(Netlify, S3, GitHub Pages, your own server, etc.).

## Folder structure

```
index.html          Page markup
css/styles.css       All styling (design tokens, layout, responsive rules)
js/main.js           Form validation, UTM capture, analytics hooks
assets/images/       Logo and team photos
```

## Before you publish — replace these placeholders

| Placeholder | Location | What to do |
|---|---|---|
| Brochure PDF | `js/main.js` → `BROCHURE_PDF_URL` | Add the real PDF to `assets/` and update the path |
| Lead form endpoint | `js/main.js` → `FORM_ENDPOINT` | Point to your real CRM / lead-capture API |
| Contact email | `js/main.js` → `CONTACT_EMAIL`, and the `mailto:` links in `index.html` | Confirm the address |
| Speaker phone numbers | `index.html`, the `href="#"` on each speaker's phone icon | Add direct lines, or remove the icon if not available |
| Corporate website / Privacy Policy / Contact Us links | Footer in `index.html` | Add real URLs |
| Analytics | `js/main.js` → `trackEvent()` | Wire to GTM/GA4/Segment/etc. |
| Favicon | `<link rel="icon">` in `index.html` | Add a real favicon file |
| Open Graph image | `<meta property="og:image">` in `index.html` | Add a real share image |
| Live URL | `<meta property="og:url">` in `index.html` | Set once deployed |

The lead form currently calls the placeholder `FORM_ENDPOINT` and will show the
error state until a real backend is connected — that's intentional, so nothing
pretends to submit when it can't.

## Analytics events already wired

`hero_booking_click`, `hero_brochure_download`, `brochure_download`,
`form_start`, `form_submit`, `form_success`, `form_error`, `final_booking_click`

## UTM handling

`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` are read
from the page URL on load and stored in hidden form fields, so they're
submitted along with every lead.
