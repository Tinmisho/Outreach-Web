// Colour themes. Runs before the page paints: sets CSS variables and window.__oxTheme for the 3D scene.
// The site's palette is Sunset. The other entries stay as a reference for the drawing code, but nothing switches them.
(() => {
  const THEMES = {
    orange: { label: 'Orange', a: '#ff7139', b: '#ffbd4f', c: '#ff4f5e', d: '#e8590c', amber: '#ffb067', spark: '#ffcf8a', hue: 0 },
    red:    { label: 'Red',    a: '#ef4444', b: '#fb923c', c: '#e11d48', d: '#b91c1c', amber: '#fca5a5', spark: '#fecaca', hue: -18 },
    blue:   { label: 'Blue',   a: '#3b82f6', b: '#38bdf8', c: '#6366f1', d: '#1d4ed8', amber: '#93c5fd', spark: '#bfdbfe', hue: 195 },
    green:  { label: 'Green',  a: '#10b981', b: '#a3e635', c: '#14b8a6', d: '#047857', amber: '#86efac', spark: '#bbf7d0', hue: 135 },
    purple: { label: 'Purple', a: '#8b5cf6', b: '#c084fc', c: '#ec4899', d: '#6d28d9', amber: '#d8b4fe', spark: '#e9d5ff', hue: 238 },
    // mixed palettes: two or three different hues each
    sunset: { group: 'Mixed', label: 'Sunset', a: '#ff6b6b', b: '#ffd166', c: '#c77dff', d: '#d6336c', amber: '#ffa94d', spark: '#ffe3b3', hue: -20 },
    ocean:  { group: 'Mixed', label: 'Ocean',  a: '#06b6d4', b: '#67e8f9', c: '#2563eb', d: '#0e7490', amber: '#a5f3fc', spark: '#cffafe', hue: 169 },
    aurora: { group: 'Mixed', label: 'Aurora', a: '#22c55e', b: '#2dd4bf', c: '#a855f7', d: '#15803d', amber: '#86efac', spark: '#d1fae5', hue: 122 },
    neon:   { group: 'Mixed', label: 'Neon',   a: '#d946ef', b: '#22d3ee', c: '#f43f5e', d: '#a21caf', amber: '#f0abfc', spark: '#f5d0fe', hue: 272 },
    gold:   { group: 'Mixed', label: 'Gold',   a: '#eab308', b: '#fde047', c: '#b45309', d: '#a16207', amber: '#fcd34d', spark: '#fef3c7', hue: 25 },
    rose:   { group: 'Mixed', label: 'Rose',   a: '#f472b6', b: '#fda4af', c: '#a78bfa', d: '#be185d', amber: '#fbcfe8', spark: '#fce7f3', hue: -50 },
  };
  // Sunset is the site's palette. The switcher is gone, and a theme stored by an older visit is ignored
  // on purpose, so everyone sees the same colours.
  const name = 'sunset';
  const t = THEMES[name];
  // Keep the browser tab mark in sync with the site's selected palette.
  const syncFavicon = (theme) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="8" y1="5" x2="55" y2="59" gradientUnits="userSpaceOnUse"><stop stop-color="${theme.a}"/><stop offset=".5" stop-color="${theme.b}"/><stop offset="1" stop-color="${theme.d}"/></linearGradient></defs><path d="M32 2 57 12v34L32 61 7 46V12L32 2Z" fill="url(#g)"/><path d="m32 10 18 7v25L32 53 14 42V17l18-7Z" fill="#0B1420"/><path d="m14 17 18 9 18-9M32 26v27" fill="none" stroke="#FFF5E9" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 21h7m10 0h7m-24 12 7 3m10 0 7-3" fill="none" stroke="${theme.amber}" stroke-width="2.5" stroke-linecap="round"/><path d="M4 10 32 1l28 9v38L32 63 4 47V10Z" fill="none" stroke="url(#g)" stroke-width="2" opacity=".85"/></svg>`;
    let link = document.querySelector('link[rel~="icon"]');
    if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
    link.type = 'image/svg+xml';
    link.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  };
  syncFavicon(t);
  // The full logo in the selected palette (same drawing as outreach-logo.svg). Used by the header logo,
  // the page inside the laptop and the laptop/phone screens, so every logo matches the chosen theme.
  const logoSvg = (theme) => `<svg xmlns="http://www.w3.org/2000/svg" width="680" height="210" viewBox="20 14 680 210" fill="none"><defs><linearGradient id="e" x1="31" y1="31" x2="203" y2="208" gradientUnits="userSpaceOnUse"><stop stop-color="${theme.amber}"/><stop offset=".48" stop-color="${theme.a}"/><stop offset="1" stop-color="${theme.d}"/></linearGradient><linearGradient id="t" x1="264" y1="74" x2="866" y2="160" gradientUnits="userSpaceOnUse"><stop stop-color="${theme.amber}"/><stop offset="1" stop-color="${theme.a}"/></linearGradient></defs><path d="M43 67 115 39 187 67V159L115 201 43 159V67Z" fill="url(#e)"/><path d="M66 80 115 61 164 80V137L115 166 66 137V80Z" fill="#0B1420"/><path d="M66 80 115 101 164 80M115 101V166" stroke="#FFF5E9" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M82 91H99M131 91H148" stroke="#FFF5E9" stroke-width="6" stroke-linecap="round"/><path d="M82 123 97 130M133 130 148 123" stroke="${theme.amber}" stroke-width="7" stroke-linecap="round"/><path d="M34 58 115 27 196 58V164L115 212 34 164V58Z" stroke="url(#e)" stroke-width="5" opacity=".8"/><circle cx="115" cy="101" r="7" fill="${theme.amber}"/><text x="250" y="143" fill="url(#t)" font-family="Inter, Avenir Next, Arial, sans-serif" font-size="88" font-weight="900" letter-spacing="-2.5">Outreach</text></svg>`;
  window.__oxLogo = `data:image/svg+xml,${encodeURIComponent(logoSvg(t))}`;
  const paintLogos = () => document.querySelectorAll('img[src$="outreach-logo.svg"]').forEach((im) => { im.src = window.__oxLogo; });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', paintLogos); else paintLogos();
  const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(',');
  window.__oxThemes = THEMES;
  window.__oxTheme = { name, ...t, hue: t.hue + 'deg', rgba: (al) => `rgba(${rgb(t.a)},${al})` };
  const r = document.documentElement.style;
  r.setProperty('--ox-a', t.a); r.setProperty('--ox-b', t.b); r.setProperty('--ox-c', t.c); r.setProperty('--ox-d', t.d);
  r.setProperty('--ox-amber', t.amber); r.setProperty('--ox-hue', t.hue + 'deg');
  document.documentElement.dataset.theme = name;
})();
