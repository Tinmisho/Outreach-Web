# Outreach — Websites. Engineered.

The Outreach website: a 3D home page plus light content pages, hosted on Cloudflare Workers (static assets).

## Layout

- `public/` — everything that is published (and nothing else). Cloudflare serves only this folder (`wrangler.jsonc`).
- `site-src/` — readable sources of the site scripts (theme, language, chat, sounds, …). They are minified into `public/`.
- `tools/build_pages.py` — generates the SEO layer: the Services / How it works / Pricing / Contact pages, `404.html`,
  titles, meta descriptions, canonical links, breadcrumbs, JSON-LD (LocalBusiness, offers, FAQ), `sitemap.xml`,
  `robots.txt`, `llms.txt`, `_headers`, and minifies `site-src/*.js` into `public/`.

## Workflow

1. Edit `site-src/*.js`, `public/assets/*`, or the content in `tools/build_pages.py`.
2. Run `python3 tools/build_pages.py`.
3. Commit and push: Cloudflare deploys automatically.

Custom domain: set `SITE` at the top of `tools/build_pages.py`, run the build, push.
