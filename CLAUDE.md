# Outreach main website

The public Outreach website: a 3D scroll-driven home page plus light content pages, in English, Georgian and Russian.

- Live: https://outreach.pre-production.workers.dev/ (Cloudflare Workers static assets, project `outreach`).
- Repo: github.com/Tinmisho/Outreach-Web. Every push to `main` deploys automatically (Cloudflare builds, ~1 min).
- Push uses the ssh alias `github-outreach-web` (deploy key `~/.ssh/id_ed25519_outreach_web`).

## Layout

- `public/` — the only folder that is published (`wrangler.jsonc`; its `name` must stay `outreach`).
  - `public/assets/` — the 3D app: a minified Vite/React Three Fiber/GSAP build that is edited in place
    (`Experience-*.js` = laptop/phone scene, `index-*.js` = page + scroll triggers, `index-*.css` = styles).
    There is no source for it; keep edits small and check syntax with `node --check` (copy to `.mjs`).
- `site-src/` — readable sources of the site scripts (theme, language, chat, sounds, cursor, laptop page,
  example-businesses gallery, home-page plans, liquid glass). Edit these, never the minified copies in `public/`.
- `tools/build_pages.py` — run after any change: minifies `site-src/` into `public/` and generates the
  content pages (services, how-it-works, pricing, contact in EN/KA/RU), `/ka/` + `/ru/` home copies, 404,
  titles/descriptions/canonicals/hreflang/JSON-LD, sitemap.xml, robots.txt, llms.txt, _headers.
  The canonical address is the `SITE` constant at the top.

## Workflow

1. Edit, then `python3 tools/build_pages.py`.
   The hero section's height is the scroll the 3D dive takes (now ~55vh, about one flick) — not a layout value.
2. Preview locally only when needed, and stop the server + close the preview tab at the end of the round
   (the laptop overheats with the 3D page). Use a no-cache server; the preview browser caches hard.
3. Commit (author Misho) and push. Mirror `public/` (minus `_headers`) into
   `~/Projects/Outreach/WebB-Demos/rc0xbuk4c2/` and push that repo too.

## Design rules

- Light mode only. The palette is Sunset (#FF6B6B / #FFD166 / #C77DFF, text #D6336C, bg #FAF7F2), fixed in
  `theme.js`: there is no switcher and a theme stored by an older visit is ignored. The other palettes stay in
  the file for reference. Logos are drawn in the palette by `theme.js` (`window.__oxLogo`).
- Logo = hexagon mark + "Outreach" only (no underline or tagline).
- Liquid glass (experiment) is gated on `<html data-glass=on>` from `liquid-glass.js`; `?glass=0` or
  `window.__oxGlass.toggle()` shows the flat site. Its CSS sits at the end of `public/site.css` and of
  `public/assets/index-*.css` — keep the two in step. On the 3D page the glass also needs
  `data-scene=off`, which `liquid-glass.js` sets once the dive is over: backdrop-filter over the live
  WebGL canvas cost the scene its laptop and phone, so nothing there is translucent until it stops.
- The home page's floating controls are the sound button and the chat bubble, nothing else. The language
  is chosen from the footer links (and hreflang); `lang.js` still detects, stores and serves /ka/ + /ru/.
- Sounds stay light and airy (no bass, no "braam"). Browsers only allow sound after the first click/keypress.
- The packages table is the source of every price: `PLAN_PRICES` / `PLANS` / `INCLUDED` / `MATRIX` / `TERMS`
  in `tools/build_pages.py`. `site-src/pricing-home.js` (home cards) and `site-src/chat-widget.js` repeat
  parts of it — change them together.
- Business facts: packages BASIC 100 / PLUS 160 / PRO 250 / MAX 350 ₾ per month, setup 150 / 150 / 250 / 450 ₾,
  a year up front 1,200 / 1,728 / 2,700 / 3,780 ₾ (−10%, BASIC setup free), buyout 2,000 / 2,400 / 3,200 / 4,200 ₾.
  Minimum term 3 months, then 30 days notice. Tbilisi, Georgia. No real phone/email/street yet — never invent them.
