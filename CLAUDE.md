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
2. Preview locally only when needed, and stop the server + close the preview tab at the end of the round
   (the laptop overheats with the 3D page). Use a no-cache server; the preview browser caches hard.
3. Commit (author Misho) and push. Mirror `public/` (minus `_headers`) into
   `~/Projects/Outreach/WebB-Demos/rc0xbuk4c2/` and push that repo too.

## Design rules

- Light mode only. Default theme: Firefox orange (#FF7139 / #FFBD4F / #FF4F5E, text-orange #E8590C, bg #FAF7F2).
  Other themes are a switcher option; logos are drawn in the theme colours by `theme.js` (`window.__oxLogo`).
- Logo = hexagon mark + "Outreach" only (no underline or tagline).
- Liquid glass (experiment) is gated on `<html data-glass=on>` from `liquid-glass.js`; `?glass=0` or
  `window.__oxGlass.toggle()` shows the flat site. Its CSS sits at the end of `public/site.css` and of
  `public/assets/index-*.css` — keep the two in step. On the 3D page the glass also needs
  `data-scene=off`, which `liquid-glass.js` sets once the dive is over: backdrop-filter over the live
  WebGL canvas cost the scene its laptop and phone, so nothing there is translucent until it stops.
- Sounds stay light and airy (no bass, no "braam"). Browsers only allow sound after the first click/keypress.
- The home-page plans (`site-src/pricing-home.js`) repeat the numbers and wording of `/pricing/`;
  `PLAN_PRICES` / `PLANS` in `tools/build_pages.py` is the source of both — change them together.
- Business facts come from the main Outreach site (WebB-Site): plans START 100 / CHAT 160 / PRO 250 / PAY 350 ₾
  per month, Tbilisi, Georgia. No real phone/email/street yet — never invent them.
