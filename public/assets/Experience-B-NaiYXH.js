import{r as e}from"./rolldown-runtime-hePW80VL.js";import{a as t,c as n,d as r,f as i,h as a,i as o,o as s,p as c,s as l}from"./r3f-BhBTqpKF.js";import{t as u}from"./index-DwaSGjqr.js";const __oxT = window.__oxTheme || { a: `#ff7139`, b: `#ffbd4f`, c: `#ff4f5e`, d: `#e8590c`, amber: `#ffb067`, spark: `#ffcf8a`, hue: `0deg`, rgba: (al) => `rgba(255,113,57,${al})` };
var d=e(a(),1),f=i(),p=Math.PI/180;/* ---- Laptop hero object (replaces the knot / globe). Uses the bundle's f (jsx), d (React), r (useFrame), u (scroll state). ---- */
const __lpDeg = Math.PI / 180;

/** Axis positions for a rounded box: dense near the edges so the rounded corners stay smooth. */
function __lpAxis(inner, rad, seg) {
  const a = [];
  for (let k = 0; k <= seg; k++) a.push(-inner - rad * Math.cos((k / seg) * Math.PI / 2));
  for (let k = 0; k <= seg; k++) a.push(inner + rad * Math.sin((k / seg) * Math.PI / 2));
  return a;
}

/** Appends a rounded box (size sx,sy,sz, corner radius rad) centred at cx,cy,cz to o = {p, n, i}. */
function __lpBox(o, sx, sy, sz, rad, seg, cx, cy, cz) {
  const H = [sx / 2, sy / 2, sz / 2];
  rad = Math.min(rad, H[0], H[1], H[2]); // a radius larger than half a side would bulge out of the box
  const I = H.map((v) => Math.max(v - rad, 0));
  const L = I.map((v) => __lpAxis(v, rad, seg));
  for (let a = 0; a < 3; a++) {
    for (const s of [1, -1]) {
      let u = (a + 1) % 3, v = (a + 2) % 3;
      if (s < 0) { const t = u; u = v; v = t; }
      const base = o.p.length / 3, Lu = L[u], Lv = L[v], nv = Lv.length;
      for (let i = 0; i < Lu.length; i++) {
        for (let j = 0; j < nv; j++) {
          const q = [0, 0, 0];
          q[a] = s * H[a]; q[u] = Lu[i]; q[v] = Lv[j];
          const inn = q.map((x, k) => Math.min(Math.max(x, -I[k]), I[k]));
          let dx = q[0] - inn[0], dy = q[1] - inn[1], dz = q[2] - inn[2];
          const l = Math.hypot(dx, dy, dz) || 1;
          dx /= l; dy /= l; dz /= l;
          o.p.push(inn[0] + dx * rad + cx, inn[1] + dy * rad + cy, inn[2] + dz * rad + cz);
          o.n.push(dx, dy, dz);
        }
      }
      for (let i = 0; i < Lu.length - 1; i++) {
        for (let j = 0; j < nv - 1; j++) {
          const A = base + i * nv + j, B = base + (i + 1) * nv + j;
          o.i.push(A, B, B + 1, A, B + 1, A + 1);
        }
      }
    }
  }
  return o;
}

const __lpNew = () => ({ p: [], n: [], i: [] });
const __lpGeo = (o) =>
  (0, f.jsxs)(`bufferGeometry`, {
    children: [
      (0, f.jsx)(`bufferAttribute`, { attach: `attributes-position`, args: [new Float32Array(o.p), 3] }),
      (0, f.jsx)(`bufferAttribute`, { attach: `attributes-normal`, args: [new Float32Array(o.n), 3] }),
      (0, f.jsx)(`bufferAttribute`, { attach: `index`, args: [new Uint32Array(o.i), 1] }),
    ],
  });

/** Keyboard: 5 rows in a MacBook layout (the function row is the Touch Bar), each row scaled to the same width. */
const __lpKW = 2.6, __lpTBz = -0.925, __lpTBd = 0.11;
function __lpKeys() {
  const o = __lpNew();
  const W = __lpKW, gap = 0.016, top = 0.1;
  const rows = [
    { d: 0.158, k: [...Array(13).fill(1), 1.5] },
    { d: 0.158, k: [1.5, ...Array(13).fill(1)] },
    { d: 0.158, k: [1.8, ...Array(11).fill(1), 1.8] },
    { d: 0.158, k: [2.3, ...Array(10).fill(1), 2.3] },
    { d: 0.158, k: [1, 1, 1, 1.25, 5.4, 1.25, 1, 1, 1] },
  ];
  let z = __lpTBz + __lpTBd + gap * 1.6;
  for (const row of rows) {
    const units = row.k.reduce((s, x) => s + x, 0);
    const unit = (W - gap * (row.k.length - 1)) / units;
    let x = -W / 2;
    for (const k of row.k) {
      const w = k * unit;
      __lpBox(o, w, 0.02, row.d, 0.012, 2, x + w / 2, top, z + row.d / 2);
      x += w + gap;
    }
    z += row.d + gap;
  }
  return o;
}

/** Touch Bar: glowing strip above the keyboard (esc, navigation, search, theme swatches, brightness, volume). */
function __lpTouchBar() {
  const cv = document.createElement(`canvas`);
  cv.width = 2048; cv.height = 96;
  const g = cv.getContext(`2d`), H = 96, mid = H / 2;
  g.fillStyle = `#07070a`; g.fillRect(0, 0, 2048, H);
  const grad = (x0, x1) => { const t = g.createLinearGradient(x0, 0, x1, 0); t.addColorStop(0, __oxT.a); t.addColorStop(.5, __oxT.b); t.addColorStop(1, __oxT.c); return t; };
  const key = (x, w, fill = `#3a3a40`) => { g.fillStyle = fill; g.beginPath(); g.roundRect(x, 9, w, H - 18, 14); g.fill(); };
  g.textBaseline = `middle`; g.textAlign = `center`;
  // esc
  key(14, 130, `#4a4a52`); g.fillStyle = `#ffffff`; g.font = `600 32px system-ui, sans-serif`; g.fillText(`esc`, 79, mid + 1);
  // back / forward
  key(166, 92); key(266, 92);
  g.strokeStyle = `#ffffff`; g.lineWidth = 6; g.lineCap = `round`; g.lineJoin = `round`;
  g.beginPath(); g.moveTo(219, mid - 15); g.lineTo(204, mid); g.lineTo(219, mid + 15); g.stroke();
  g.beginPath(); g.moveTo(305, mid - 15); g.lineTo(320, mid); g.lineTo(305, mid + 15); g.stroke();
  // search pill with a gradient edge
  g.fillStyle = grad(380, 960); g.beginPath(); g.roundRect(378, 9, 584, H - 18, 16); g.fill();
  g.fillStyle = `#16161b`; g.beginPath(); g.roundRect(382, 13, 576, H - 26, 13); g.fill();
  g.strokeStyle = __oxT.b; g.lineWidth = 5; g.beginPath(); g.arc(422, mid - 3, 13, 0, Math.PI * 2); g.stroke();
  g.beginPath(); g.moveTo(432, mid + 7); g.lineTo(443, mid + 18); g.stroke();
  g.textAlign = `left`; g.fillStyle = `#ffffff`; g.font = `500 31px system-ui, sans-serif`; g.fillText(`outreach`, 462, mid + 1);
  // theme swatches (glowing)
  [__oxT.a, __oxT.b, __oxT.c, __oxT.amber].forEach((c, i) => { const x = 1020 + i * 74; g.shadowColor = c; g.shadowBlur = 18; g.fillStyle = c; g.beginPath(); g.arc(x, mid, 27, 0, Math.PI * 2); g.fill(); });
  g.shadowBlur = 0;
  // brightness slider
  key(1318, 450, `#1e1e24`);
  g.fillStyle = `#4a4a52`; g.beginPath(); g.roundRect(1384, mid - 6, 360, 12, 6); g.fill();
  g.fillStyle = grad(1384, 1640); g.beginPath(); g.roundRect(1384, mid - 6, 256, 12, 6); g.fill();
  g.fillStyle = `#ffffff`; g.shadowColor = __oxT.b; g.shadowBlur = 14; g.beginPath(); g.arc(1640, mid, 19, 0, Math.PI * 2); g.fill(); g.shadowBlur = 0;
  g.strokeStyle = __oxT.amber; g.lineWidth = 4; g.beginPath(); g.arc(1350, mid, 9, 0, Math.PI * 2); g.stroke();
  for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; g.beginPath(); g.moveTo(1350 + Math.cos(a) * 14, mid + Math.sin(a) * 14); g.lineTo(1350 + Math.cos(a) * 19, mid + Math.sin(a) * 19); g.stroke(); }
  // volume + mute
  key(1786, 118); key(1914, 118);
  const spk = (x) => { g.fillStyle = `#ffffff`; g.beginPath(); g.moveTo(x - 16, mid - 8); g.lineTo(x - 7, mid - 8); g.lineTo(x + 5, mid - 17); g.lineTo(x + 5, mid + 17); g.lineTo(x - 7, mid + 8); g.lineTo(x - 16, mid + 8); g.closePath(); g.fill(); };
  spk(1834); g.strokeStyle = __oxT.b; g.lineWidth = 4; g.beginPath(); g.arc(1841, mid, 11, -0.9, 0.9); g.stroke(); g.beginPath(); g.arc(1841, mid, 20, -0.9, 0.9); g.stroke();
  spk(1962); g.strokeStyle = __oxT.c; g.beginPath(); g.moveTo(1975, mid - 9); g.lineTo(1993, mid + 9); g.moveTo(1993, mid - 9); g.lineTo(1975, mid + 9); g.stroke();
  return cv;
}

/** The screen: a mock of the Outreach site in the Firefox palette, drawn once into a canvas. */
function __lpScreen() {
  const cv = document.createElement(`canvas`);
  cv.width = 1600; cv.height = 1022;
  const g = cv.getContext(`2d`);
  const LT = !0;
  const BG = LT ? `#faf7f2` : `#07070c`, FG = LT ? `#1c1612` : `#f4f5fb`, MUT = LT ? `#5f564d` : `#a6abc4`,
    GRID = LT ? `rgba(0,0,0,.06)` : `rgba(255,255,255,.05)`, CARD = LT ? `rgba(0,0,0,.04)` : `rgba(255,255,255,.06)`, LINE = LT ? `rgba(0,0,0,.14)` : `rgba(255,255,255,.16)`;
  g.beginPath(); g.roundRect(0, 0, 1600, 1022, 34); g.clip(); // rounded display corners
  g.fillStyle = BG; g.fillRect(0, 0, 1600, 1022);
  g.strokeStyle = GRID; g.lineWidth = 1;
  for (let x = 0; x < 1600; x += 56) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 1022); g.stroke(); }
  for (let y = 0; y < 1022; y += 56) { g.beginPath(); g.moveTo(0, y); g.lineTo(1600, y); g.stroke(); }
  const glow = g.createRadialGradient(1150, 520, 20, 1150, 520, 520);
  glow.addColorStop(0, LT ? __oxT.rgba(.18) : __oxT.rgba(.35)); glow.addColorStop(1, __oxT.rgba(0));
  g.fillStyle = glow; g.fillRect(0, 0, 1600, 1022);
  // nav
  g.fillStyle = __oxT.a; g.beginPath(); g.roundRect(80, 52, 46, 46, 10); g.fill();
  g.strokeStyle = `#0c0b10`; g.lineWidth = 6; g.lineCap = `round`;
  g.beginPath(); g.moveTo(93, 85); g.lineTo(113, 65); g.moveTo(98, 65); g.lineTo(113, 65); g.lineTo(113, 80); g.stroke();
  g.fillStyle = FG; g.font = `700 40px system-ui, sans-serif`; g.fillText(`outreach.`, 142, 89);
  g.fillStyle = MUT; g.font = `500 26px system-ui, sans-serif`;
  [`What we do`, `How it works`, `Pricing`].forEach((t, i) => g.fillText(t, 820 + i * 200, 85));
  { const im = new Image(); im.onload = () => { g.fillStyle = BG; g.fillRect(70, 34, 440, 84); g.drawImage(im, 74, 34, 272, 84); if (__lpTex) __lpTex.needsUpdate = !0; }; im.src = window.__oxLogo || `./outreach-logo.svg`; }
  g.fillStyle = __oxT.a; g.beginPath(); g.roundRect(1380, 50, 150, 54, 12); g.fill();
  g.fillStyle = `#0c0b10`; g.font = `700 24px system-ui, sans-serif`; g.fillText(`Let's talk ↗`, 1400, 85);
  // hero
  g.fillStyle = __oxT.d; g.font = `600 22px ui-monospace, monospace`; g.fillText(`> DIGITAL ENGINEERING / OUTREACH`, 80, 250);
  g.fillStyle = FG; g.font = `800 112px system-ui, sans-serif`; g.fillText(`Websites.`, 74, 380);
  const tg = g.createLinearGradient(74, 0, 760, 0);
  tg.addColorStop(0, __oxT.a); tg.addColorStop(.5, __oxT.b); tg.addColorStop(1, __oxT.c);
  g.fillStyle = tg; g.fillText(`Engineered.`, 74, 500);
  g.fillStyle = MUT; g.font = `400 30px system-ui, sans-serif`;
  g.fillText(`We build, sell, and rent websites for ambitious businesses.`, 80, 575);
  g.fillStyle = __oxT.a; g.beginPath(); g.roundRect(80, 625, 330, 74, 14); g.fill();
  g.fillStyle = `#0c0b10`; g.font = `700 28px system-ui, sans-serif`; g.fillText(`Start a project ↗`, 112, 672);
  g.strokeStyle = LINE; g.lineWidth = 2; g.beginPath(); g.roundRect(430, 625, 250, 74, 14); g.stroke();
  g.fillStyle = FG; g.fillText(`Our work`, 490, 672);
  // device mock on the right
  g.fillStyle = CARD; g.strokeStyle = LINE;
  g.beginPath(); g.roundRect(960, 230, 560, 400, 18); g.fill(); g.stroke();
  [[1000, 280, 300, 24, __oxT.a], [1000, 330, 460, 14, LINE], [1000, 360, 400, 14, CARD]]
    .forEach(([x, y, w, h, c]) => { g.fillStyle = c; g.beginPath(); g.roundRect(x, y, w, h, 7); g.fill(); });
  [[1000, __oxT.a], [1170, __oxT.b], [1340, __oxT.c]].forEach(([x, c]) => {
    g.fillStyle = CARD; g.beginPath(); g.roundRect(x, 420, 150, 170, 14); g.fill();
    g.fillStyle = c; g.beginPath(); g.roundRect(x + 20, 440, 42, 42, 10); g.fill();
  });
  // feature strip
  g.strokeStyle = LINE; g.beginPath(); g.moveTo(0, 800); g.lineTo(1600, 800); g.stroke();
  g.fillStyle = MUT; g.font = `500 24px system-ui, sans-serif`;
  [`◆ Looks good on every screen`, `⚡ Made to move fast`, `✓ No tech talk required`].forEach((t, i) => g.fillText(t, 80 + i * 520, 880));
  return cv;
}

let __lpCache = null;
let __lpBezelGeo = null, __lpScreenMesh = null, __lpLook = null, __lpLayer = null, __lpBezel = null, __lpBrand = null, __lpTex = null, __lpPaused = !1, __lpResume = null;
/** 0 -> 1 over the first 85% of the hero scroll, smoothstepped. */
/** Phones (narrow portrait screens) show only the phone, centred, and the dive goes into its screen. */
const __lpIsMobile = () => innerWidth < 760 && innerWidth / innerHeight < 1;
const __lpDive = (h) => { const x = Math.min(Math.max(h / 0.85, 0), 1); return x * x * (3 - 2 * x); };
const __lpData = () =>
  (__lpCache ??= {
    base: __lpSlab(3.0, 2.05, 0.09, 0.13, 10),
    deck: __lpBox(__lpNew(), 2.72, 0.004, 1.07, 0.002, 1, 0, 0.0895, -0.41),
    keys: __lpKeys(),
    pad: __lpBox(__lpNew(), 1.5, 0.004, 0.76, 0.03, 3, 0, 0.0905, 0.57),
    tb: __lpBox(__lpNew(), __lpKW - __lpTBd - 0.02, 0.01, __lpTBd, 0.008, 2, -(__lpTBd + 0.02) / 2, 0.093, __lpTBz + __lpTBd / 2),
    tid: __lpBox(__lpNew(), __lpTBd, 0.01, __lpTBd, 0.012, 2, __lpKW / 2 - __lpTBd / 2, 0.093, __lpTBz + __lpTBd / 2),
    tbScreen: __lpTouchBar(),
    lid: __lpSlab(3.0, 2.03, 0.045, 0.13, 10),
    screen: __lpScreen(),
  });

const __lpMesh = (geo, mat, extra) =>
  (0, f.jsxs)(`mesh`, { ...extra, children: [geo, mat] });

/* ---- Phone next to the laptop: rounded slab body, black glass front, screen with the mobile site ---- */
/** Rounded-rectangle slab (w x h, depth d, corner radius r) centred at origin, facing +z. Convex, so caps are fans. */
function __lpSlab(w, h, d, r, seg) {
  const o = __lpNew(), pts = [], nrm = [];
  const corners = [[w / 2 - r, h / 2 - r, 0], [-w / 2 + r, h / 2 - r, Math.PI / 2], [-w / 2 + r, -h / 2 + r, Math.PI], [w / 2 - r, -h / 2 + r, Math.PI * 1.5]];
  for (const [cx, cy, a0] of corners) for (let k = 0; k <= seg; k++) {
    const a = a0 + (k / seg) * Math.PI / 2;
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); nrm.push([Math.cos(a), Math.sin(a)]);
  }
  const n = pts.length, z0 = -d / 2, z1 = d / 2;
  for (const [z, nz] of [[z1, 1], [z0, -1]]) { // caps
    const c = o.p.length / 3; o.p.push(0, 0, z); o.n.push(0, 0, nz);
    for (const [x, y] of pts) { o.p.push(x, y, z); o.n.push(0, 0, nz); }
    for (let i = 0; i < n; i++) { const a = c + 1 + i, b = c + 1 + ((i + 1) % n); nz > 0 ? o.i.push(c, a, b) : o.i.push(c, b, a); }
  }
  const s0 = o.p.length / 3; // sides
  for (let i = 0; i < n; i++) { const [x, y] = pts[i], [nx, ny] = nrm[i]; o.p.push(x, y, z0, x, y, z1); o.n.push(nx, ny, 0, nx, ny, 0); }
  for (let i = 0; i < n; i++) { const a = s0 + i * 2, b = s0 + ((i + 1) % n) * 2; o.i.push(a, b, a + 1, b, b + 1, a + 1); }
  return o;
}

/** Mobile version of the site, drawn once (rounded screen corners are transparent). */
function __lpPhoneScreen() {
  const cv = document.createElement(`canvas`); cv.width = 600; cv.height = 1296;
  const g = cv.getContext(`2d`);
  g.beginPath(); g.roundRect(0, 0, 600, 1296, 70); g.clip();
  g.fillStyle = `#faf7f2`; g.fillRect(0, 0, 600, 1296);
  g.strokeStyle = `rgba(0,0,0,.05)`; g.lineWidth = 1;
  for (let x = 0; x < 600; x += 44) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 1296); g.stroke(); }
  for (let y = 0; y < 1296; y += 44) { g.beginPath(); g.moveTo(0, y); g.lineTo(600, y); g.stroke(); }
  const glow = g.createRadialGradient(420, 760, 10, 420, 760, 420); glow.addColorStop(0, __oxT.rgba(.20)); glow.addColorStop(1, __oxT.rgba(0));
  g.fillStyle = glow; g.fillRect(0, 0, 600, 1296);
  // status bar
  g.fillStyle = `#1c1612`; g.font = `600 30px system-ui, sans-serif`; g.fillText(`9:41`, 52, 66);
  g.fillRect(500, 44, 46, 22); g.fillStyle = `#faf7f2`; g.fillRect(504, 48, 30, 14); g.fillStyle = `#1c1612`; g.fillRect(546, 50, 4, 10);
  // no camera island here: the phone model's notch sits over this spot
  // logo row (real logo once loaded) + menu
  g.fillStyle = __oxT.a; g.beginPath(); g.roundRect(40, 128, 46, 46, 11); g.fill();
  g.fillStyle = `#1c1612`; g.font = `800 36px system-ui, sans-serif`; g.fillText(`Outreach`, 98, 164);
  g.fillStyle = `#1c1612`; [0, 14, 28].forEach((d) => g.fillRect(522, 136 + d, 38, 5));
  { const im = new Image(); im.onload = () => { g.fillStyle = `#faf7f2`; g.fillRect(30, 116, 380, 74); g.drawImage(im, 34, 116, 240, 74); if (__lpPhoneTex) __lpPhoneTex.needsUpdate = !0; }; im.src = window.__oxLogo || `./outreach-logo.svg`; }
  // hero
  g.fillStyle = __oxT.d; g.font = `600 20px ui-monospace, monospace`; g.fillText(`> DIGITAL ENGINEERING`, 44, 300);
  g.fillStyle = `#1c1612`; g.font = `800 96px system-ui, sans-serif`; g.fillText(`Websites.`, 38, 410);
  const tg = g.createLinearGradient(38, 0, 560, 0); tg.addColorStop(0, __oxT.a); tg.addColorStop(.55, __oxT.b); tg.addColorStop(1, __oxT.c);
  g.fillStyle = tg; g.font = `800 88px system-ui, sans-serif`; g.fillText(`Engineered.`, 38, 510);
  g.fillStyle = `#5f564d`; g.font = `400 30px system-ui, sans-serif`;
  g.fillText(`We build, sell, and rent`, 44, 580); g.fillText(`websites for ambitious`, 44, 622); g.fillText(`businesses.`, 44, 664);
  g.fillStyle = __oxT.a; g.beginPath(); g.roundRect(44, 712, 512, 88, 18); g.fill();
  g.fillStyle = `#1a0f08`; g.font = `700 32px system-ui, sans-serif`; g.fillText(`Start a project ↗`, 170, 768);
  g.strokeStyle = `rgba(0,0,0,.16)`; g.lineWidth = 2; g.beginPath(); g.roundRect(44, 820, 512, 88, 18); g.stroke();
  g.fillStyle = `#1c1612`; g.fillText(`Our work`, 236, 876);
  // feature cards
  [[__oxT.a, `Every screen`], [__oxT.b, `Moves fast`], [__oxT.c, `No tech talk`]].forEach(([c, t], i) => {
    const y = 960 + i * 96;
    g.fillStyle = `rgba(0,0,0,.04)`; g.beginPath(); g.roundRect(44, y, 512, 80, 16); g.fill();
    g.fillStyle = c; g.beginPath(); g.roundRect(64, y + 20, 40, 40, 10); g.fill();
    g.fillStyle = `#1c1612`; g.font = `600 28px system-ui, sans-serif`; g.fillText(t, 124, y + 50);
  });
  g.fillStyle = `#1c1612`; g.beginPath(); g.roundRect(220, 1262, 160, 8, 4); g.fill(); // home indicator
  return cv;
}

/* Real laptop and phone (public/assets/models, built by tools/gltf/models.mjs). The drawn ones stay until the models
   arrive, and if they fail to load. Phones never load the laptop: they only show the phone. */
let __lpGL = null;
const __lpModels = () => (__lpGL ??= import(`./gltf-zbhD1phr.js`).then(({ GLTFLoader: L, MeshoptDecoder: D }) => {
  const l = new L(); l.setMeshoptDecoder(D);
  // same soft finish as the drawn devices: full metal mirrored the coloured light panels
  const get = (n) => l.loadAsync(new URL(`./models/${n}.glb`, import.meta.url).href).then((g) => { g.scene.traverse((o) => { const m = o.isMesh && o.material; if (!m) return; m.envMapIntensity = 0.35; if (m.metalness > 0.5) { m.metalness = 0.45; m.roughness = Math.max(m.roughness, 0.32); } }); return g.scene; });
  return Promise.all([__lpIsMobile() ? null : get(`laptop`), get(`phone`)]).then(([lap, ph]) => ({ base: lap?.getObjectByName(`base`), lid: lap?.getObjectByName(`lid`), ph }));
}).catch((e) => (console.warn(`3D models:`, e), {})));
const __lpUseModels = () => { const [m, s] = (0, d.useState)(null); (0, d.useEffect)(() => { let on = !0; __lpModels().then((v) => on && s(v)); return () => { on = !1; }; }, []); return m || {}; };
let __lpPhoneTex = null, __lpPhoneCache = null;
function __lpPhone() {
  const P = (__lpPhoneCache ??= {
    body: __lpSlab(0.78, 1.6, 0.085, 0.12, 8),
    glass: __lpSlab(0.775, 1.595, 0.004, 0.118, 8),
    screen: __lpPhoneScreen(),
  });
  const M = __lpIsMobile(), G = __lpUseModels().ph, Q = G?.getObjectByName(`phone`)?.userData.screen;
  return (0, f.jsxs)(`group`, {
    position: M ? [0, -0.45, 0.3] : [2.12, 0.8, 0.28], rotation: M ? [0.05, -0.28, 0] : [-0.06, -0.42, 0], scale: M ? 1.05 : 1,
    children: [
      ...(G ? [(0, f.jsx)(`primitive`, { object: G })] : [
      (0, f.jsxs)(`mesh`, { children: [__lpGeo(P.body), (0, f.jsx)(`meshStandardMaterial`, { color: `#a7abb2`, metalness: 0.5, roughness: 0.3, envMapIntensity: 0.45 })] }),
      (0, f.jsxs)(`mesh`, { position: [0, 0, 0.0445], children: [__lpGeo(P.glass), (0, f.jsx)(`meshStandardMaterial`, { color: `#060607`, metalness: 0.1, roughness: 0.12 })] })]),
      (0, f.jsxs)(`mesh`, {
        position: Q ? [Q[0], Q[1], Q[2]] : [0, 0, 0.0475], ref: (o) => { if (M) __lpScreenMesh = o; },
        children: [
          (0, f.jsx)(`planeGeometry`, { args: Q ? [Q[3], Q[4]] : [0.72, 1.555] }),
          (0, f.jsx)(`meshBasicMaterial`, { toneMapped: !1, transparent: !0, children: (0, f.jsx)(`canvasTexture`, { ref: (t) => { __lpPhoneTex = t; }, attach: `map`, args: [P.screen], colorSpace: `srgb`, anisotropy: 4 }) }),
        ],
      }),
      // side buttons (the model has its own)
      ...(G ? [] : [(0, f.jsxs)(`mesh`, { position: [0.395, 0.35, 0], children: [(0, f.jsx)(`boxGeometry`, { args: [0.012, 0.16, 0.03] }), (0, f.jsx)(`meshStandardMaterial`, { color: `#8e939a`, metalness: 0.5, roughness: 0.32 })] }),
      (0, f.jsxs)(`mesh`, { position: [-0.395, 0.42, 0], children: [(0, f.jsx)(`boxGeometry`, { args: [0.012, 0.1, 0.03] }), (0, f.jsx)(`meshStandardMaterial`, { color: `#8e939a`, metalness: 0.5, roughness: 0.32 })] }),
      (0, f.jsxs)(`mesh`, { position: [-0.395, 0.25, 0], children: [(0, f.jsx)(`boxGeometry`, { args: [0.012, 0.1, 0.03] }), (0, f.jsx)(`meshStandardMaterial`, { color: `#8e939a`, metalness: 0.5, roughness: 0.32 })] })]),
    ],
  });
}

function __lpLaptop({ groupRef, reduced }) {
  const D = __lpData(), G = __lpUseModels(), Q = G.lid?.userData.screen; // G.base + G.lid: the model, hinge at the origin, lid shut
  const lid = (0, d.useRef)(null), clock = (0, d.useRef)(0), inner = (0, d.useRef)(null);
  r((st, dt) => {
    clock.current += Math.min(dt, 0.05);
    const k = reduced ? 1 : Math.min(Math.max((clock.current - 0.5) / 1.8, 0), 1);
    const eased = 1 - Math.pow(1 - k, 3);
    const open = eased * 108 * (1 - 0.92 * u.cta);
    lid.current && (lid.current.rotation.x = -open * __lpDeg);
    const M = __lpIsMobile();
    if (M && inner.current && !inner.current.userData.phoneOnly) { inner.current.children.forEach((c, i) => { c.visible = i === 0; }); inner.current.userData.phoneOnly = !0; } // phones: only the phone (first child)
    if (inner.current) { // wide screens: devices on the right half, headline on the left (see .hero CSS)
      const wide = innerWidth >= 900 && innerWidth / innerHeight >= 1.2;
      const fit = Math.min(Math.max((innerWidth / innerHeight - 1.2) / 0.7, 0), 1); // 0 = 6:5 window, 1 = very wide
      const tx = M ? 0 : wide ? 0.95 + 0.5 * fit : -0.38, ts = M ? 1 : wide ? 0.6 + 0.22 * fit : 0.98, k = 1 - Math.exp(-6 * Math.min(dt, 0.05));
      inner.current.position.x += (tx - inner.current.position.x) * k;
      inner.current.scale.setScalar(inner.current.scale.x + (ts - inner.current.scale.x) * k);
    }
  });
  const alu = (0, f.jsx)(`meshStandardMaterial`, { color: `#dcdfe4`, metalness: 0.4, roughness: 0.3, envMapIntensity: 0.35 });
  return (0, f.jsx)(`group`, {
    ref: groupRef,
    children: (0, f.jsxs)(`group`, {
      ref: inner,
      position: [innerWidth >= 900 && innerWidth / innerHeight >= 1.2 ? 1.3 : -0.38, -0.62, 0.1],
      scale: innerWidth >= 900 && innerWidth / innerHeight >= 1.2 ? 0.78 : 0.98,
      children: [
        (0, f.jsx)(__lpPhone, {}),
        ...(G.base ? [(0, f.jsx)(`primitive`, { object: G.base, position: [0, 0.09, -1.02] })] : [
        __lpMesh(__lpGeo(D.base), alu, { position: [0, 0.045, 0], rotation: [-Math.PI / 2, 0, 0] }),
        __lpMesh(__lpGeo(D.deck), (0, f.jsx)(`meshStandardMaterial`, { color: `#ccd0d6`, roughness: 0.42, metalness: 0.35, envMapIntensity: 0.35 })),
        __lpMesh(__lpGeo(D.keys), (0, f.jsx)(`meshStandardMaterial`, { color: `#202226`, roughness: 0.62, metalness: 0.05 })),
        __lpMesh(__lpGeo(D.pad), (0, f.jsx)(`meshStandardMaterial`, { color: `#e2e5e9`, roughness: 0.26, metalness: 0.25, envMapIntensity: 0.35 })),
        __lpMesh(__lpGeo(D.tb), (0, f.jsx)(`meshStandardMaterial`, { color: `#0b0b0c`, roughness: 0.18, metalness: 0.2 })),
        (0, f.jsxs)(`mesh`, {
          position: [-(__lpTBd + 0.02) / 2, 0.0985, __lpTBz + __lpTBd / 2], rotation: [-Math.PI / 2, 0, 0],
          children: [(0, f.jsx)(`planeGeometry`, { args: [__lpKW - __lpTBd - 0.03, __lpTBd - 0.012] }),
            (0, f.jsx)(`meshBasicMaterial`, { toneMapped: !1, children: (0, f.jsx)(`canvasTexture`, { attach: `map`, args: [D.tbScreen], colorSpace: `srgb`, anisotropy: 4 }) })],
        }),
        __lpMesh(__lpGeo(D.tid), (0, f.jsx)(`meshStandardMaterial`, { color: `#1a1a1d`, roughness: 0.12, metalness: 0.6 })),
        (0, f.jsxs)(`mesh`, {
          position: [0, 0.09, -1.0], rotation: [0, 0, Math.PI / 2],
          children: [(0, f.jsx)(`cylinderGeometry`, { args: [0.042, 0.042, 2.3, 32] }), (0, f.jsx)(`meshStandardMaterial`, { color: `#9ca0a7`, metalness: 0.5, roughness: 0.35 })],
        })]),
        (0, f.jsxs)(`group`, {
          ref: lid, position: [0, 0.09, -1.02],
          children: [
            ...(G.lid ? [(0, f.jsx)(`primitive`, { object: G.lid })] : [
            __lpMesh(__lpGeo(D.lid), alu, { position: [0, 0.0225, 1.015], rotation: [-Math.PI / 2, 0, 0] }),
            (0, f.jsxs)(`mesh`, {
              position: [0, -0.0008, 1.015], rotation: [Math.PI / 2, 0, 0],
              children: [__lpGeo(__lpBezelGeo ??= __lpSlab(2.94, 1.97, 0.0012, 0.1, 10)), (0, f.jsx)(`meshStandardMaterial`, { color: `#050506`, roughness: 0.12, metalness: 0 })],
            })]),
            (0, f.jsxs)(`mesh`, {
              ref: (o) => { if (!__lpIsMobile()) __lpScreenMesh = o; }, position: Q ? [Q[0], Q[1], Q[2]] : [0, -0.0016, 1.03], rotation: [Math.PI / 2, 0, 0],
              children: [
                (0, f.jsx)(`planeGeometry`, { args: Q ? [Q[3], Q[4]] : [2.88, 1.84] }),
                (0, f.jsx)(`meshBasicMaterial`, {
                  toneMapped: !1, transparent: !0,
                  children: (0, f.jsx)(`canvasTexture`, { ref: (t) => { __lpTex = t; }, attach: `map`, args: [D.screen], colorSpace: `srgb`, anisotropy: 4 }),
                }),
              ],
            })
          ],
        }),
      ],
    }),
  });
}

function m({reduced:e}){let t=(0,d.useRef)(null),n=(0,d.useRef)(0);return r((r,i)=>{if(!t.current)return;let a=Math.min(i,.05);n.current+=a;let K=e?0:__lpDive(u.hero),o=(-.45+u.progress*Math.PI*1.1)*(1-K);t.current.rotation.y=c.damp(t.current.rotation.y,o,3.2+K*4,a),t.current.rotation.x=c.damp(t.current.rotation.x,(.3+u.showcase*20*p)*(1-K),3.2+K*4,a),e||(t.current.position.y=Math.sin(n.current*.6)*.12*(1-K));let s=c.lerp(1,.68,u.cta);t.current.scale.setScalar(c.damp(t.current.scale.x,s,3,a))}),(0,f.jsx)(__lpLaptop,{groupRef:t,reduced:e})}function h({reduced:e}){let t=(0,d.useRef)(null),i=(0,d.useMemo)(()=>[{pos:[2.9,1.3,-.6],color:__oxT.a,geo:`ico`,size:.28},{pos:[-3,-.9,.4],color:__oxT.b,geo:`oct`,size:.26},{pos:[2.3,-1.8,.9],color:__oxT.c,geo:`tetra`,size:.3},{pos:[-2.4,1.9,-.3],color:__oxT.amber,geo:`box`,size:.24}],[]);return r((n,r)=>{t.current&&!e&&(t.current.rotation.y+=Math.min(r,.05)*.16)}),(0,f.jsx)(`group`,{ref:t,children:i.map((t,r)=>(0,f.jsx)(n,{speed:e?0:1.1+r*.2,rotationIntensity:e?0:.7,floatIntensity:e?0:.8,children:(0,f.jsxs)(`mesh`,{position:t.pos,castShadow:!0,children:[t.geo===`ico`&&(0,f.jsx)(`icosahedronGeometry`,{args:[t.size,0]}),t.geo===`oct`&&(0,f.jsx)(`octahedronGeometry`,{args:[t.size,0]}),t.geo===`tetra`&&(0,f.jsx)(`tetrahedronGeometry`,{args:[t.size,0]}),t.geo===`box`&&(0,f.jsx)(`boxGeometry`,{args:[t.size,t.size,t.size]}),(0,f.jsx)(`meshStandardMaterial`,{color:t.color,emissive:t.color,emissiveIntensity:.55,metalness:.6,roughness:.25})]})},r))})}function g({reduced:e}){return r(({camera:t,pointer:n,setFrameloop:SF},r)=>{let i=Math.min(r,.05),a=u.progress,o=6.2+a*3.4,s=.1+a*1.5,l=e?0:n.x*.55,d=e?0:-n.y*.3;let K=e?0:__lpDive(u.hero),V=t.position.constructor;__lpLook??=new V();let X=l,Y=s+d,Z=o,lx=0,ly=0,lz=0;if(K>0&&__lpScreenMesh){let C=__lpScreenMesh.getWorldPosition(new V()),N=__lpScreenMesh.getWorldDirection(new V()),D=c.lerp(4.4,.85,K);X=c.lerp(l*(1-K),C.x+N.x*D,K),Y=c.lerp(s+d,C.y+N.y*D,K),Z=c.lerp(o,C.z+N.z*D,K),lx=C.x*K,ly=C.y*K,lz=C.z*K}let q=2.4+21.6*Math.min(K/.06,1);t.position.x=c.damp(t.position.x,X,q,i),t.position.y=c.damp(t.position.y,Y,q,i),t.position.z=c.damp(t.position.z,Z,q,i);__lpLook.set(c.damp(__lpLook.x,lx,q,i),c.damp(__lpLook.y,ly,q,i),c.damp(__lpLook.z,lz,q,i)),t.lookAt(__lpLook);__lpLayer??=document.querySelector(`.scene-layer`);let F=Math.min(Math.max((u.hero-.8)/.15,0),1);__lpLayer&&(__lpLayer.style.opacity=String(1-F));__lpBezel??=document.getElementById(`ox-site`);__lpBezel&&(__lpBezel.style.opacity=String(F));__lpBrand??=document.querySelector(`.ox-brand`);__lpBrand&&(__lpBrand.style.opacity=String(1-F),__lpBrand.style.visibility=F>=1?`hidden`:``);if(F>=1&&!__lpPaused&&typeof SF==`function`){__lpPaused=!0,SF(`never`);__lpResume??=(()=>{let w=()=>requestAnimationFrame(()=>{u.hero<.95&&__lpPaused&&(__lpPaused=!1,SF(`always`))});addEventListener(`scroll`,w,{passive:!0});return w})()}}),null}function _({reduced:e}){return(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(`fog`,{attach:`fog`,args:[!0?`#faf7f2`:`#07070c`,9,24]}),(0,f.jsx)(`ambientLight`,{intensity:.55}),(0,f.jsx)(`hemisphereLight`,{args:[`#ffffff`,`#e9ddd0`,1.1]}),(0,f.jsx)(`directionalLight`,{position:[-3,2,6],intensity:.9}),(0,f.jsx)(`directionalLight`,{position:[4,6,5],intensity:2.1,}),(0,f.jsx)(`pointLight`,{position:[-5,-2,-3],intensity:8,color:!0?__oxT.c:`#592acb`,distance:16}),(0,f.jsx)(`pointLight`,{position:[5,2,-4],intensity:14,color:__oxT.b,distance:16}),(0,f.jsxs)(l,{resolution:256,children:[(0,f.jsx)(t,{intensity:2.6,position:[0,4,3],scale:[9,9,1],color:__oxT.a}),(0,f.jsx)(t,{intensity:.8,position:[-5,1,2],"rotation-y":Math.PI/2,scale:[6,5,1],color:!0?__oxT.c:`#592acb`}),(0,f.jsx)(t,{intensity:1.4,position:[5,-1,2],"rotation-y":-Math.PI/2,scale:[6,5,1],color:__oxT.b})]}),(0,f.jsx)(m,{reduced:e}),(0,f.jsx)(h,{reduced:e}),!e&&(0,f.jsx)(o,{count:30,scale:[14,8,8],size:1.6,speed:.3,opacity:.5,color:__oxT.spark}),(0,f.jsx)(g,{reduced:e})]})}export{_ as Experience};