// Site language: English / Georgian / Russian. The choice is remembered and applied to every text on the page
// (the 3D hero, the laptop page, the sections below, the chat). Texts are set once the React page has rendered.
(() => {
  const KEY = 'ox-lang', LANGS = ['en', 'ka', 'ru'], NAMES = { en: 'EN', ka: 'ქა', ru: 'RU' };
  const FULL = { en: 'English', ka: 'ქართული', ru: 'Русский' };
  let lang;
  try { lang = localStorage.getItem(KEY); } catch {}
  if (!LANGS.includes(lang)) { const n = (navigator.language || '').slice(0, 2); lang = LANGS.includes(n) ? n : 'en'; }
  window.__oxLang = lang;
  document.documentElement.lang = lang;

  // [selector, index, mode, {en, ka, ru}] — mode: 'html' replaces the element, 'text' only its first text (keeps icons)
  const T = [
    // 3D hero
    ['.hero .eyebrow', 0, 'text', { en: ' Websites · Hosting · Care', ka: ' ვებსაიტები · ჰოსტინგი · მხარდაჭერა', ru: ' Сайты · Хостинг · Поддержка' }],
    ['.hero__title', 0, 'html', { en: 'Websites that <em>work</em>.<br>Built to grow.', ka: 'ვებსაიტები, რომლებიც <em>მუშაობს</em>.<br>იზრდება თქვენთან ერთად.', ru: 'Сайты, которые <em>работают</em>.<br>И растут с вами.' }],
    ['.hero__lede', 0, 'html', { en: 'Outreach designs, builds and hosts websites for small businesses. Rent one monthly or own it outright.', ka: 'Outreach ქმნის, უშვებს და ჰოსტავს ვებსაიტებს მცირე ბიზნესებისთვის. იქირავეთ თვიურად ან იყიდეთ სრულად.', ru: 'Outreach создаёт, запускает и размещает сайты для малого бизнеса. Арендуйте помесячно или выкупите полностью.' }],
    ['.hero__actions .btn', 0, 'text', { en: 'See what we do ', ka: 'ნახეთ რას ვაკეთებთ ', ru: 'Наши услуги ' }],
    ['.hero__actions .btn', 1, 'text', { en: 'Get in touch ', ka: 'დაგვიკავშირდით ', ru: 'Связаться ' }],
    ['.hero__hint', 0, 'html', { en: 'scroll', ka: 'ჩამოსქროლეთ', ru: 'листайте' }],
    // the page inside the laptop
    ['.ox-site__links a', 0, 'html', { en: 'What we do', ka: 'რას ვაკეთებთ', ru: 'Что мы делаем' }],
    ['.ox-site__links a', 1, 'html', { en: 'How it works', ka: 'როგორ ვმუშაობთ', ru: 'Как мы работаем' }],
    ['.ox-site__links a', 2, 'html', { en: 'Pricing', ka: 'ფასები', ru: 'Цены' }],
    ['.ox-site__links a', 3, 'html', { en: "Let's talk ↗", ka: 'დაგვიკავშირდით ↗', ru: 'Связаться ↗' }],
    ['.ox-site__eyebrow', 0, 'html', { en: '&gt; DIGITAL ENGINEERING / OUTREACH', ka: '&gt; ციფრული ინჟინერია / OUTREACH', ru: '&gt; ЦИФРОВАЯ ИНЖЕНЕРИЯ / OUTREACH' }],
    ['.ox-site__title', 0, 'html', { en: 'Websites.<br><span>Engineered.</span>', ka: 'ვებსაიტები.<br><span>ზუსტად აწყობილი.</span>', ru: 'Сайты.<br><span>Под ключ.</span>' }],
    ['.ox-site__lede', 0, 'html', { en: 'We build, sell, and rent websites for ambitious businesses.', ka: 'ვქმნით, ვყიდით და ვაქირავებთ ვებსაიტებს ამბიციური ბიზნესებისთვის.', ru: 'Создаём, продаём и сдаём в аренду сайты для амбициозного бизнеса.' }],
    ['.ox-site__btn', 0, 'html', { en: 'Start a project ↗', ka: 'დაიწყეთ პროექტი ↗', ru: 'Начать проект ↗' }],
    ['.ox-site__btn', 1, 'html', { en: 'Our work', ka: 'ჩვენი ნამუშევრები', ru: 'Наши работы' }],
    ['.ox-site__features li', 0, 'html', { en: '◆ Looks good on every screen', ka: '◆ კარგად ჩანს ყველა ეკრანზე', ru: '◆ Отлично выглядит на любом экране' }],
    ['.ox-site__features li', 1, 'html', { en: '⚡ Made to move fast', ka: '⚡ სწრაფად იტვირთება', ru: '⚡ Быстро загружается' }],
    ['.ox-site__features li', 2, 'html', { en: '✓ No tech talk required', ka: '✓ ტექნიკური ცოდნა არ გჭირდებათ', ru: '✓ Без технических сложностей' }],
    // What we do
    ['.showcase .eyebrow', 0, 'html', { en: '&gt; What we do', ka: '&gt; რას ვაკეთებთ', ru: '&gt; Что мы делаем' }],
    ['.showcase .section__title', 0, 'html', { en: 'Your website, <span class="ox-grad">handled.</span>', ka: 'თქვენი ვებსაიტი <span class="ox-grad">ჩვენზეა.</span>', ru: 'Ваш сайт — <span class="ox-grad">наша забота.</span>' }],
    ['.showcase__lede', 0, 'html', { en: 'One team for the whole thing: design, launch, hosting and care. Four steps, zero headaches.', ka: 'ერთი გუნდი ყველაფრისთვის: დიზაინი, გაშვება, ჰოსტინგი და მოვლა. ოთხი ნაბიჯი, ნული თავის ტკივილი.', ru: 'Одна команда на всё: дизайн, запуск, хостинг и поддержка. Четыре шага — ноль головной боли.' }],
    ['.panel__title', 0, 'html', { en: 'Design &amp; build', ka: 'დიზაინი და აწყობა', ru: 'Дизайн и разработка' }],
    ['.panel__body', 0, 'html', { en: 'A fast, mobile-ready site shaped around your business. You see a working demo before you pay a single lari.', ka: 'სწრაფი, მობილურზე მორგებული საიტი თქვენი ბიზნესისთვის. გადახდამდე ნახავთ მოქმედ დემოს.', ru: 'Быстрый сайт под ваш бизнес, удобный на телефоне. Рабочее демо вы увидите ещё до оплаты.' }],
    ['.panel__tag', 0, 'html', { en: 'Demo first', ka: 'ჯერ დემო', ru: 'Сначала демо' }],
    ['.panel__title', 1, 'html', { en: 'Hosting &amp; care', ka: 'ჰოსტინგი და მოვლა', ru: 'Хостинг и поддержка' }],
    ['.panel__body', 1, 'html', { en: 'Hosting, SSL, updates and fixes are part of every plan. We keep it running, you keep running your business.', ka: 'ჰოსტინგი, SSL, განახლებები და შესწორებები ყველა პაკეტშია. საიტს ჩვენ ვუვლით, თქვენ კი ბიზნესს.', ru: 'Хостинг, SSL, обновления и исправления входят в каждый тариф. Мы следим за сайтом, вы — за бизнесом.' }],
    ['.panel__tag', 1, 'html', { en: 'Included', ka: 'შედის ფასში', ru: 'Включено' }],
    ['.panel__title', 2, 'html', { en: 'Rent or own', ka: 'იქირავეთ ან იყიდეთ', ru: 'Аренда или покупка' }],
    ['.panel__body', 2, 'html', { en: 'Start monthly with no big upfront cost. After 12 months you can buy the site, and the price keeps going down.', ka: 'დაიწყეთ თვიურად, დიდი წინასწარი ხარჯის გარეშე. 12 თვის შემდეგ საიტის გამოსყიდვა შეგიძლიათ და ფასი თანდათან მცირდება.', ru: 'Начните помесячно, без больших вложений. Через 12 месяцев сайт можно выкупить, и цена продолжает снижаться.' }],
    ['.panel__tag', 2, 'html', { en: 'From 100 ₾/mo', ka: '100 ₾-დან / თვე', ru: 'От 100 ₾/мес' }],
    ['.panel__title', 3, 'html', { en: 'Live in 1–2 weeks', ka: 'მზადაა 1–2 კვირაში', ru: 'Запуск за 1–2 недели' }],
    ['.panel__body', 3, 'html', { en: 'Send us your texts, photos and logo. We handle domains, design and launch, and explain it all in plain words.', ka: 'გამოგვიგზავნეთ ტექსტები, ფოტოები და ლოგო. დომენს, დიზაინს და გაშვებას ჩვენ მივხედავთ და ყველაფერს მარტივად აგიხსნით.', ru: 'Пришлите тексты, фото и логотип. Домен, дизайн и запуск — на нас, и всё объясним простыми словами.' }],
    ['.panel__tag', 3, 'html', { en: 'No tech talk', ka: 'ტექნიკური ენის გარეშე', ru: 'Без жаргона' }],
    // How it works
    ['.prose .eyebrow', 0, 'html', { en: '&gt; How it works', ka: '&gt; როგორ ვმუშაობთ', ru: '&gt; Как мы работаем' }],
    ['.prose .section__title', 0, 'html', { en: 'Tell us about your business.<br>We show you a demo.', ka: 'მოგვიყევით თქვენს ბიზნესზე.<br>ჩვენ დემოს გაჩვენებთ.', ru: 'Расскажите о своём бизнесе.<br>Мы покажем демо.' }],
    ['.prose__body', 0, 'html', { en: 'We start with a short call, then build a working demo of your site. You only commit once you like what you see. After launch we host it, keep it updated and fix anything that comes up.', ka: 'ვიწყებთ მოკლე საუბრით, შემდეგ ვაწყობთ თქვენი საიტის მოქმედ დემოს. გადაწყვეტილებას მხოლოდ მაშინ იღებთ, როცა შედეგი მოგეწონებათ. გაშვების შემდეგ საიტს ვჰოსტავთ, ვაახლებთ და ნებისმიერ პრობლემას ვაგვარებთ.', ru: 'Начинаем с короткого разговора, затем собираем рабочее демо вашего сайта. Решение вы принимаете, только когда результат вам нравится. После запуска мы размещаем сайт, обновляем его и решаем любые вопросы.' }],
    // Closing section + footer
    ['.cta .eyebrow', 0, 'html', { en: '&gt; Your move', ka: '&gt; თქვენი ჯერია', ru: '&gt; Ваш ход' }],
    ['.cta__title', 0, 'html', { en: "Let's build your website.", ka: 'ავაწყოთ თქვენი ვებსაიტი.', ru: 'Давайте создадим ваш сайт.' }],
    ['.cta__body', 0, 'html', { en: "Tell us what you do and we'll come back with a plan and a price. No jargon, no surprises.", ka: 'მოგვიყევით რას აკეთებთ და დაგიბრუნდებით გეგმითა და ფასით. ზედმეტი ტერმინებისა და სიურპრიზების გარეშე.', ru: 'Расскажите, чем вы занимаетесь, и мы вернёмся с планом и ценой. Без жаргона и сюрпризов.' }],
    ['.cta .btn', 0, 'text', { en: 'Talk to us ', ka: 'დაგვიკავშირდით ', ru: 'Связаться ' }],
    ['.footer span', 0, 'html', { en: '© 2026 Outreach', ka: '© 2026 Outreach', ru: '© 2026 Outreach' }],
    ['.footer span', 1, 'html', { en: 'Websites · Hosting · Care', ka: 'ვებსაიტები · ჰოსტინგი · მხარდაჭერა', ru: 'Сайты · Хостинг · Поддержка' }],
    // theme picker group names
    ['.ox-theme__label', 0, 'html', { en: 'Classic', ka: 'კლასიკური', ru: 'Классика' }],
    ['.ox-theme__label', 1, 'html', { en: 'Mixed', ka: 'შერეული', ru: 'Смешанные' }],
  ];
  const TITLE = { en: 'Outreach — Websites. Engineered.', ka: 'Outreach — ვებსაიტები, ზუსტად აწყობილი.', ru: 'Outreach — Сайты под ключ.' };

  // Text drawn on the laptop and phone screens (canvas). [en]: {ka, ru, room}: room = how much wider than the
  // English text a translation may be before it is scaled down to fit.
  const CV = {
    'What we do': { ka: 'რას ვაკეთებთ', ru: 'Что мы делаем', room: 1.25 },
    'How it works': { ka: 'როგორ ვმუშაობთ', ru: 'Как работаем', room: 1.25 },
    'Pricing': { ka: 'ფასები', ru: 'Цены', room: 1.6 },
    "Let's talk ↗": { ka: 'დაგვიკავშირდით ↗', ru: 'Связаться ↗', room: 1.15 },
    '> DIGITAL ENGINEERING / OUTREACH': { ka: '> ციფრული ინჟინერია / OUTREACH', ru: '> ЦИФРОВАЯ ИНЖЕНЕРИЯ / OUTREACH', room: 1.6 },
    '> DIGITAL ENGINEERING': { ka: '> ციფრული ინჟინერია', ru: '> ЦИФРОВАЯ ИНЖЕНЕРИЯ', room: 1.5 },
    'Websites.': { ka: 'ვებსაიტები.', ru: 'Сайты.', room: 1.1 },
    'Engineered.': { ka: 'ზუსტად აწყობილი.', ru: 'Под ключ.', room: 1.1 },
    'We build, sell, and rent websites for ambitious businesses.': { ka: 'ვქმნით, ვყიდით და ვაქირავებთ ვებსაიტებს ამბიციური ბიზნესებისთვის.', ru: 'Создаём, продаём и сдаём в аренду сайты для амбициозного бизнеса.', room: 1.5 },
    'We build, sell, and rent': { ka: 'ვქმნით, ვყიდით და', ru: 'Создаём, продаём и сдаём', room: 1.45 },
    'websites for ambitious': { ka: 'ვაქირავებთ ვებსაიტებს', ru: 'в аренду сайты для', room: 1.45 },
    'businesses.': { ka: 'ამბიციური ბიზნესისთვის.', ru: 'амбициозного бизнеса.', room: 2.6 },
    'Start a project ↗': { ka: 'დაიწყეთ პროექტი ↗', ru: 'Начать проект ↗', room: 1.1 },
    'Our work': { ka: 'ნამუშევრები', ru: 'Наши работы', room: 1.4 },
    '◆ Looks good on every screen': { ka: '◆ კარგად ჩანს ყველა ეკრანზე', ru: '◆ Отлично на любом экране', room: 1.25 },
    '⚡ Made to move fast': { ka: '⚡ სწრაფად იტვირთება', ru: '⚡ Быстро загружается', room: 1.6 },
    '✓ No tech talk required': { ka: '✓ ტექნიკური ცოდნის გარეშე', ru: '✓ Без сложностей', room: 1.5 },
    'Every screen': { ka: 'ყველა ეკრანზე', ru: 'Любой экран', room: 2 },
    'Moves fast': { ka: 'სწრაფი', ru: 'Быстро', room: 2 },
    'No tech talk': { ka: 'მარტივად', ru: 'Без жаргона', room: 2 },
  };
  if (lang !== 'en' && window.CanvasRenderingContext2D) {
    const P = CanvasRenderingContext2D.prototype, draw = P.fillText;
    P.fillText = function (text, x, y, maxW) {
      const e = CV[text]; const tr = e && e[lang];
      if (!tr) return draw.call(this, text, x, y, maxW);
      const limit = this.measureText(text).width * e.room, w = this.measureText(tr).width;
      if (w <= limit) return draw.call(this, tr, x, y, maxW);
      const font = this.font;
      this.font = font.replace(/(\d+(?:\.\d+)?)px/, (_, n) => (n * limit / w).toFixed(1) + 'px');
      draw.call(this, tr, x, y, maxW); this.font = font;
    };
  }

  const setFirstText = (el, text) => {
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n; (n = w.nextNode());) if (n.nodeValue.trim()) { n.nodeValue = text; return; }
    el.prepend(text);
  };
  const apply = () => {
    let missing = 0;
    for (const [sel, i, mode, tx] of T) {
      const el = document.querySelectorAll(sel)[i];
      if (!el) { missing++; continue; }
      if (el.dataset.oxLang === lang) continue;
      if (mode === 'text') setFirstText(el, tx[lang]); else el.innerHTML = tx[lang];
      el.dataset.oxLang = lang;
    }
    document.title = TITLE[lang];
    return missing === 0;
  };

  // the closing button opens the chat on "contact" instead of jumping to the top
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('.cta .btn'); if (!b) return;
    e.preventDefault();
    const fab = document.querySelector('.ox-chat-fab'), panel = document.querySelector('.ox-chat');
    if (fab && panel && panel.hidden) fab.click();
    setTimeout(() => { const chip = document.querySelector('.ox-chip[data-key="contact"]'); if (chip) chip.click(); }, 900);
  }, true);

  // keep applying while the page renders (React, the laptop page and the theme picker mount at different times)
  const mo = new MutationObserver(() => { apply(); });
  const start = () => {
    apply();
    mo.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => mo.disconnect(), 15000);
    mountSwitcher();
  };
  if (document.body) start(); else addEventListener('DOMContentLoaded', start);

  // EN / ქა / RU switcher, next to the theme and sound buttons
  function mountSwitcher() {
    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'ox-lang'; btn.textContent = NAMES[lang];
    btn.setAttribute('aria-haspopup', 'true'); btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Language: ' + FULL[lang]); btn.title = FULL[lang];
    const pop = document.createElement('div');
    pop.className = 'ox-lang__pop'; pop.hidden = true; pop.setAttribute('role', 'menu');
    for (const l of LANGS) {
      const o = document.createElement('button');
      o.type = 'button'; o.setAttribute('role', 'menuitemradio'); o.setAttribute('aria-checked', String(l === lang));
      o.className = 'ox-lang__opt' + (l === lang ? ' is-on' : ''); o.lang = l;
      o.innerHTML = `<b>${NAMES[l]}</b><span>${FULL[l]}</span>`;
      o.addEventListener('click', () => {
        if (l === lang) { pop.hidden = true; return; }
        try { localStorage.setItem(KEY, l); } catch {}
        location.reload(); // the 3D scene and its canvas texts are rebuilt in the new language
      });
      pop.append(o);
    }
    const toggle = (v) => { pop.hidden = !v; btn.setAttribute('aria-expanded', String(v)); };
    btn.addEventListener('click', (e) => { e.stopPropagation(); toggle(pop.hidden); });
    document.addEventListener('click', (e) => { if (!pop.hidden && !pop.contains(e.target)) toggle(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggle(false); });
    document.body.append(btn, pop);
  }
})();
