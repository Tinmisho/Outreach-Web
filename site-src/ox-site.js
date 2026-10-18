// The page shown on the laptop screen, as a real section of the site. It sits right after the 3D hero,
// so when the camera has dived into the screen the 3D fades out and this page is exactly in view.
// Its opacity is driven by the scene (the same value that fades the 3D out).
(() => {
  const html = `
  <div class="ox-site__inner">
    <nav class="ox-site__nav" aria-label="Main">
      <a class="ox-site__logo" href="#ox-site" aria-label="Outreach home"><img src="${window.__oxLogo || './outreach-logo.svg'}" alt="Outreach — web development and hosting" width="680" height="210"></a>
      <div class="ox-site__links">
        <a href="#showcase">What we do</a>
        <a href="#cta">How it works</a>
        <a href="#ox-pricing" data-chat="pricing">Pricing</a>
        <a class="ox-site__talk" href="#ox-site" data-chat="contact">Let's talk ↗</a>
      </div>
    </nav>
    <div class="ox-site__hero">
      <div class="ox-site__copy">
        <p class="ox-site__eyebrow">&gt; DIGITAL ENGINEERING / OUTREACH</p>
        <h2 class="ox-site__title">Websites.<br><span>Engineered.</span></h2>
        <p class="ox-site__lede">We build, sell, and rent websites for ambitious businesses.</p>
        <div class="ox-site__actions">
          <a class="ox-site__btn ox-site__btn--primary" href="#ox-site" data-chat="contact">Start a project ↗</a>
          <a class="ox-site__btn" href="#showcase">Our work</a>
        </div>
      </div>
      <div class="ox-site__device" aria-hidden="true">
        <span class="ox-bar ox-bar--accent"></span><span class="ox-bar"></span><span class="ox-bar ox-bar--short"></span>
        <div class="ox-tiles"><span><i style="background:var(--ox-a)"></i></span><span><i style="background:color-mix(in srgb,var(--ox-a) 55%,#fff)"></i></span><span><i style="background:color-mix(in srgb,var(--ox-a) 28%,#fff)"></i></span></div>
      </div>
    </div>
    <ul class="ox-site__features">
      <li>◆ Looks good on every screen</li><li>⚡ Made to move fast</li><li>✓ No tech talk required</li>
    </ul>
  </div>`;

  const mount = () => {
    const hero = document.querySelector('section.hero');
    if (!hero || document.getElementById('ox-site')) return !!hero;
    const sec = document.createElement('section');
    sec.id = 'ox-site'; sec.className = 'ox-site'; sec.setAttribute('aria-label', 'Outreach'); sec.innerHTML = html;
    hero.after(sec);
    // buttons that should open the assistant with a topic
    sec.addEventListener('click', (e) => {
      const a = e.target.closest('[data-chat]'); if (!a) return;
      e.preventDefault();
      const fab = document.querySelector('.ox-chat-fab'), panel = document.querySelector('.ox-chat');
      if (fab && panel && panel.hidden) fab.click();
      setTimeout(() => { const chip = document.querySelector(`.ox-chip[data-key="${a.dataset.chat}"]`); if (chip) chip.click(); }, 900);
    });
    // the page got taller: let the scroll animations (ScrollTrigger) re-measure
    requestAnimationFrame(() => dispatchEvent(new Event('resize')));
    return true;
  };
  // background grid: on the first screen it fades around the devices (--gh); once the dive starts it disappears
  // completely so it never crosses the laptop/phone (--go), and it comes back only after the dive is over
  const gridHole = () => {
    const h = document.querySelector('.hero'), H = (h && h.offsetHeight) || innerHeight, k = scrollY / H;
    const go = k <= 0.02 ? 1 : k < 1 ? Math.max(0, 1 - (k - 0.02) / 0.12) : Math.min(1, (k - 1) / 0.4);
    document.body.style.setProperty('--gh', k < 1 ? '1' : '0');
    document.body.style.setProperty('--go', go.toFixed(3));
    const hint = document.querySelector('.hero__hint'); // the little "scroll" hint fades out as soon as you scroll
    if (hint) { const o = Math.max(0, 1 - scrollY / 150); hint.style.opacity = (o * 0.6).toFixed(3); hint.style.visibility = o === 0 ? 'hidden' : ''; }
  };
  addEventListener('scroll', gridHole, { passive: true }); addEventListener('load', gridHole); gridHole();
  // The dive follows the scroll and stops wherever the scrolling stops, halfway included: there is no snap
  // pulling the page to either end (it fought the reader's own hand). Its smoothing lives in index-*.js.

  // in-page links glide even though CSS smooth scrolling is off (it fights the dive)
  addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href') === '#') return;
    const el = document.querySelector(a.getAttribute('href'));
    if (!el) return;
    e.preventDefault();
    // through Lenis when it runs, so the glide and Lenis's own smoothing never pull against each other
    if (window.__oxLenis) window.__oxLenis.scrollTo(el, { duration: 1.1 });
    else el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  });

  // ?chat=contact (links from the other pages) opens the assistant on that topic
  const chatTopic = new URLSearchParams(location.search).get('chat');
  if (chatTopic) addEventListener('load', () => setTimeout(() => {
    const fab = document.querySelector('.ox-chat-fab'); if (fab) fab.click();
    setTimeout(() => { const chip = document.querySelector(`.ox-chip[data-key="${chatTopic}"]`); if (chip) chip.click(); }, 900);
  }, 600));
  if (!mount()) {
    const mo = new MutationObserver(() => { if (mount()) mo.disconnect(); });
    mo.observe(document.getElementById('root') || document.body, { childList: true, subtree: true });
  }
})();
