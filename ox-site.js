// The page shown on the laptop screen, as a real section of the site. It sits right after the 3D hero,
// so when the camera has dived into the screen the 3D fades out and this page is exactly in view.
// Its opacity is driven by the scene (the same value that fades the 3D out).
(() => {
  const html = `
  <div class="ox-site__inner">
    <nav class="ox-site__nav" aria-label="Main">
      <a class="ox-site__logo" href="#ox-site" aria-label="Outreach home"><img src="./outreach-logo.svg" alt="Outreach — web development and hosting" width="1080" height="260"></a>
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
        <div class="ox-tiles"><span><i style="background:var(--ox-a)"></i></span><span><i style="background:var(--ox-b)"></i></span><span><i style="background:var(--ox-c)"></i></span></div>
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
  if (!mount()) {
    const mo = new MutationObserver(() => { if (mount()) mo.disconnect(); });
    mo.observe(document.getElementById('root') || document.body, { childList: true, subtree: true });
  }
})();
