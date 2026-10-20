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
  - `public/assets/models/` — the laptop and phone (`laptop.glb`, `phone.glb`, CC BY, credits in `CREDITS.md`),
    made by `tools/gltf/models.mjs` from the Sketchfab originals: logos and wallpapers removed, lid folded shut
    at the hinge (the scene opens it), screen rectangle in extras, meshopt-compressed. `Experience-*.js` loads
    them through `gltf-*.js` (GLTFLoader built by `tools/gltf/build.mjs` on the three inside `r3f-*.js`) and lays
    its own screen planes (`__lpScreenMesh`) on them; the drawn devices show until they load or if they fail.
    `room.glb` is the wooden desk the laptop stands on (desk top at y = 0), with a lamp, plant, books and mug,
    plus the walls (back and both sides, `__lpRoomW`, with a skirting board) and floor drawn in `__lpRoom`; the props are placed in the `items` table of `models.mjs`, kept
    right of the headline on desktop, and the plant and books are hidden on phones. The desk is the default scene;
    the earlier floating laptop + phone (with the floating shapes and the idle bob) stays as the other one:
    `?scene=float` / `?scene=desk` picks it and is remembered (`__lpDesk`). The phone only shows in the floating scene
    for now; it is still built and can be removed later.
  - `public/img/demos/` — the photographs the example websites in the gallery show (64 slots; subjects in its
    README). `tools/demo_photos.py <folder>` crops and converts originals into them, and `build_pages.py`
    writes the list of existing files into `industries.js`, so a missing photo is a plain brand-coloured
    frame, never a 404. Real photographs only, licence noted in `SOURCES.md` there.
- `site-src/` — readable sources of the site scripts (theme, language, chat, sounds, cursor, laptop page,
  example-businesses gallery, home-page plans, liquid glass). Edit these, never the minified copies in `public/`.
- `tools/build_pages.py` — run after any change: minifies `site-src/` into `public/` and generates the
  content pages (services, how-it-works, pricing, contact in EN/KA/RU), `/ka/` + `/ru/` home copies, 404,
  titles/descriptions/canonicals/hreflang/JSON-LD, sitemap.xml, robots.txt, llms.txt, _headers.
  The canonical address is the `SITE` constant at the top.

## Workflow

1. Edit, then `python3 tools/build_pages.py`.
   The hero section's height is the scroll the 3D dive takes (~110vh) — not a layout value. The dive is a
   plain scrub: it stops wherever the scrolling stops, halfway included (there is no snap any more — it fought
   the reader's hand and Lenis). Lenis (in `index-*.js`, exposed as `window.__oxLenis`) smooths the wheel;
   in-page links scroll through it, and the demo dialog stops it while open. On top, `__oxHeroT` → `E.hero`
   is a ~50ms time-based chase for what Lenis leaves alone (touch, scrollbar drag); under reduced motion the
   value follows the scroll directly and the camera does not fly in — the scene just crossfades to the page.
   The camera locks onto the eased value once the dive starts (no second lag). A numeric GSAP `scrub` would
   not smooth this: it smooths an attached animation, and that trigger only writes a value in onUpdate.
   CSS `scroll-behavior` must stay `auto`.
2. Preview locally only when needed, and stop the server + close the preview tab at the end of the round
   (the laptop overheats with the 3D page). Use a no-cache server; the preview browser caches hard.
3. Commit (author Claude <noreply@anthropic.com>, with `Co-Authored-By: Misho <mishogorgadze@icloud.com>`
   so GitHub shows the commit as verified and Misho still gets the credit) and push. Mirror `public/` (minus `_headers`) into
   `~/Projects/Outreach/WebB-Demos/rc0xbuk4c2/` and push that repo too.

## Design rules

- Light mode only. The palette is Sunset (#FF6B6B / #FFD166 / #C77DFF, text #D6336C, bg #FAF7F2), fixed in
  `theme.js`: there is no switcher and a theme stored by an older visit is ignored. The other palettes stay in
  the file for reference. Logos are drawn in the palette by `theme.js` (`window.__oxLogo`).
- Logo = hexagon mark + "Outreach" only (no underline or tagline).
- One accent. `--ox-a` carries the interface; `--ox-b` / `--ox-c` are for the logo, the favicon, the 3D
  scene and the two hero titles only — not for bars, buttons, panels or tints. The demo businesses in
  the gallery keep their own palettes: they are meant to look like other people's brands.
- Motion is unhurried: 400–600ms with a soft ease-out, and nothing loops on its own.
- The gallery's example sites (`industries.js`) are complete one-page sites (`.dsite`, styles `.ds-*` in
  `index-*.css`), laid out at 1280px (390px on a narrow card) and scaled into each card; container queries
  pick the layout. "View the full site" opens the same page at real size in `.ox-demo`. The businesses are
  invented: no phone numbers or street addresses on them either.
- Liquid glass (experiment) is gated on `<html data-glass=on>` from `liquid-glass.js`; `?glass=0` or
  `window.__oxGlass.toggle()` shows the flat site. Its CSS sits at the end of `public/site.css` and of
  `public/assets/index-*.css` — keep the two in step. On the 3D page the glass also needs
  `data-scene=off`, which `liquid-glass.js` sets once the dive is over: backdrop-filter over the live
  WebGL canvas cost the scene its laptop and phone, so nothing there is translucent until it stops.
- The home page's floating controls are the EN / ქა / RU button, the sound button and the chat bubble.
  The language is chosen there, not in the footer; `lang.js` detects, stores and serves /ka/ + /ru/.
- Sounds stay light and airy (no bass, no "braam"). Browsers only allow sound after the first click/keypress.
- The packages table is the source of every price: `PLAN_PRICES` / `PLANS` / `INCLUDED` / `MATRIX` / `TERMS`
  in `tools/build_pages.py`. `site-src/pricing-home.js` (home cards) and `site-src/chat-widget.js` repeat
  parts of it — change them together.
- Business facts: packages BASIC 100 / PLUS 160 / PRO 250 / MAX 350 ₾ per month, setup 150 / 150 / 250 / 450 ₾,
  a year up front 1,200 / 1,728 / 2,700 / 3,780 ₾ (−10%, BASIC setup free), buyout 2,000 / 2,400 / 3,200 / 4,200 ₾.
  Minimum term 3 months, then 30 days notice. Tbilisi, Georgia. No real phone/email/street yet — never invent them.
