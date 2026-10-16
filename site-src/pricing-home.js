// Plans on the home page: the four packages, right after the example businesses that follow "What we do".
// Same numbers and wording as the /pricing/ page (tools/build_pages.py is the source of both — keep them
// in step). Texts follow the site language (window.__oxLang from lang.js); the section carries the
// #ox-pricing id the laptop-page nav already links to.
(() => {
  const L = ['en', 'ka', 'ru'].includes(window.__oxLang) ? window.__oxLang : 'en';
  const t = (o) => o[L] || o.en;

  const HEAD = {
    eyebrow: { en: '> Pricing', ka: '> ფასები', ru: '> Цены' },
    title: { en: 'Simple <span class="ox-grad">monthly plans.</span>', ka: 'მარტივი <span class="ox-grad">თვიური პაკეტები.</span>', ru: 'Простые <span class="ox-grad">месячные тарифы.</span>' },
    lede: { en: 'Monthly. Cancel with 30 days notice. Hosting, SSL and changes are always included.', ka: 'თვიური გადახდა. გაუქმება 30 დღით ადრე შეტყობინებით. ჰოსტინგი, SSL და ცვლილებები ყოველთვის შედის.', ru: 'Помесячно. Отмена с уведомлением за 30 дней. Хостинг, SSL и изменения всегда включены.' },
    month: { en: '/ month', ka: '/ თვე', ru: '/ мес' },
    setup: { en: 'Setup {n} ₾, charged once', ka: 'Setup {n} ₾, ერთჯერადად', ru: 'Запуск {n} ₾, один раз' },
    own: { en: 'Want to own it?', ka: 'გსურთ საიტი იყიდოთ?', ru: 'Хотите купить сайт?' },
    own_body: { en: 'Buying outright runs 2,000–4,200 ₾ depending on the package. After twelve paid months the buyout price drops, reaching 60% at two years.', ka: 'სრული შესყიდვა პაკეტის მიხედვით 2,000–4,200 ₾ ღირს. 12 გადახდილი თვის შემდეგ ფასი იკლებს და ორ წელიწადში 60%-ს აღწევს.', ru: 'Покупка стоит 2 000–4 200 ₾ в зависимости от тарифа. После двенадцати оплаченных месяцев цена выкупа снижается и через два года составляет 60%.' },
    talk: { en: 'Talk to us ↗', ka: 'დაგვიკავშირდით ↗', ru: 'Связаться ↗' },
    all: { en: 'All the details', ka: 'ყველა დეტალი', ru: 'Все детали' },
  };

  // name, ₾ per month, setup ₾ — the order matches PLANS below
  const PRICES = [['START', 100, 150], ['CHAT', 160, 150], ['PRO', 250, 250], ['PAY', 350, 450]];
  const PLANS = {
    en: [['A site for your business.', ['Your own .ge domain', 'Hosting and SSL', 'One change a month']],
         ['A site that answers questions.', ['Everything in START', 'FAQ chat for your customers', 'Two changes a month']],
         ['A site that collects enquiries.', ['Everything in CHAT', 'Booking and contact forms', 'Google Business profile']],
         ['A site that takes payment.', ['Everything in PRO', 'Online payments', 'Money goes straight to your bank']]],
    ka: [['საიტი თქვენი ბიზნესისთვის.', ['თქვენი .ge დომენი', 'ჰოსტინგი და SSL', 'ერთი ცვლილება თვეში']],
         ['საიტი, რომელიც კითხვებს პასუხობს.', ['ყველაფერი START-იდან', 'ჩატბოტი თქვენი კლიენტებისთვის', 'ორი ცვლილება თვეში']],
         ['საიტი, რომელიც განაცხადებს აგროვებს.', ['ყველაფერი CHAT-იდან', 'ჯავშნისა და კონტაქტის ფორმები', 'Google Business პროფილი']],
         ['საიტი, რომელიც გადახდას იღებს.', ['ყველაფერი PRO-დან', 'ონლაინ გადახდა', 'თანხა პირდაპირ თქვენს ანგარიშზე']]],
    ru: [['Сайт для вашего бизнеса.', ['Ваш домен .ge', 'Хостинг и SSL', 'Одно изменение в месяц']],
         ['Сайт, который отвечает на вопросы.', ['Всё из START', 'Чат-бот для ваших клиентов', 'Два изменения в месяц']],
         ['Сайт, который собирает заявки.', ['Всё из CHAT', 'Формы бронирования и обратной связи', 'Профиль Google Business']],
         ['Сайт, который принимает оплату.', ['Всё из PRO', 'Онлайн-оплата', 'Деньги идут прямо на ваш счёт']]],
  };

  const esc = (s) => String(s).replace(/[&<>"]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[m]);
  const plans = PLANS[L] || PLANS.en;
  const base = L === 'en' ? '' : '../';          // /ka/ and /ru/ sit one level deeper

  const card = ([name, price, setup], i) => `
    <article class="ox-plan${i === 1 ? ' ox-plan--lead' : ''}" data-i="${i}">
      <h3 class="ox-plan__name">${esc(name)}</h3>
      <p class="ox-plan__price"><strong>${price}</strong> ₾ <span>${esc(t(HEAD.month))}</span></p>
      <p class="ox-plan__sum">${esc(plans[i][0])}</p>
      <ul class="ox-plan__feats">${plans[i][1].map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
      <p class="ox-plan__setup">${esc(t(HEAD.setup).replace('{n}', setup))}</p>
    </article>`;

  const html = `
    <div class="ox-price__inner">
      <div class="ox-price__head">
        <p class="ox-price__eyebrow">${esc(t(HEAD.eyebrow))}</p>
        <h2 class="ox-price__title">${t(HEAD.title)}</h2>
        <p class="ox-price__lede">${esc(t(HEAD.lede))}</p>
      </div>
      <div class="ox-price__grid">${PRICES.map(card).join('')}</div>
      <div class="ox-price__foot">
        <div class="ox-price__own">
          <h3>${esc(t(HEAD.own))}</h3>
          <p>${esc(t(HEAD.own_body))}</p>
        </div>
        <div class="ox-price__actions">
          <a class="ox-price__btn ox-price__btn--primary" href="#ox-pricing" data-chat="pricing">${esc(t(HEAD.talk))}</a>
          <a class="ox-price__btn" href="${base}pricing/">${esc(t(HEAD.all))}</a>
        </div>
      </div>
    </div>`;

  const mount = () => {
    // after the example businesses, which themselves sit right after "What we do"
    const biz = document.getElementById('ox-biz'), show = document.getElementById('showcase');
    const host = biz || show;
    if (!host || document.getElementById('ox-pricing')) return !!host;
    const sec = document.createElement('section');
    sec.id = 'ox-pricing'; sec.className = 'ox-price';
    sec.setAttribute('aria-label', t(HEAD.eyebrow).replace('> ', ''));
    sec.innerHTML = html;
    const anchor = host.parentElement && host.parentElement.classList.contains('pin-spacer') ? host.parentElement : host;
    anchor.after(sec);
    sec.addEventListener('click', (e) => {
      const a = e.target.closest('[data-chat]'); if (!a) return;
      e.preventDefault();
      const fab = document.querySelector('.ox-chat-fab'), panel = document.querySelector('.ox-chat');
      if (fab && panel && panel.hidden) fab.click();
      setTimeout(() => { const chip = document.querySelector(`.ox-chip[data-key="${a.dataset.chat}"]`); if (chip) chip.click(); }, 900);
    });
    requestAnimationFrame(() => dispatchEvent(new Event('resize'))); // the page got taller: let ScrollTrigger re-measure
    return true;
  };
  if (!mount()) {
    const mo = new MutationObserver(() => { if (mount()) mo.disconnect(); });
    mo.observe(document.getElementById('root') || document.body, { childList: true, subtree: true });
  }
})();
