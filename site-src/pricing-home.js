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
    lede: { en: 'Every amount is in GEL and final, with no hourly billing. Minimum term 3 months, then 30 days notice. Hosting, SSL, daily backups and changes are always included.', ka: 'ყველა თანხა ლარშია და საბოლოოა, საათობრივი დათვლა არ გვაქვს. მინიმალური ვადა 3 თვე, შემდეგ 30 დღით ადრე. ჰოსტინგი, SSL, ყოველდღიური ასლი და ცვლილებები ყოველთვის შედის.', ru: 'Все суммы в лари и окончательные, почасовой оплаты нет. Минимальный срок 3 месяца, далее за 30 дней. Хостинг, SSL, ежедневные копии и изменения всегда включены.' },
    month: { en: '/ month', ka: '/ თვე', ru: '/ мес' },
    setup: { en: 'Setup {n} ₾, charged once', ka: 'Setup {n} ₾, ერთჯერადად', ru: 'Запуск {n} ₾, один раз' },
    own: { en: 'Want to own it?', ka: 'გსურთ საიტი იყიდოთ?', ru: 'Хотите купить сайт?' },
    own_body: { en: 'Buying outright runs 2,000–4,200 ₾ depending on the package. After twelve paid months the buyout price drops, reaching 60% at two years.', ka: 'სრული შესყიდვა პაკეტის მიხედვით 2,000–4,200 ₾ ღირს. 12 გადახდილი თვის შემდეგ ფასი იკლებს და ორ წელიწადში 60%-ს აღწევს.', ru: 'Покупка стоит 2 000–4 200 ₾ в зависимости от тарифа. После двенадцати оплаченных месяцев цена выкупа снижается и через два года составляет 60%.' },
    talk: { en: 'Talk to us ↗', ka: 'დაგვიკავშირდით ↗', ru: 'Связаться ↗' },
    all: { en: 'All the details', ka: 'ყველა დეტალი', ru: 'Все детали' },
    buy: { en: 'Buy outright', ka: 'პირდაპირი ყიდვა', ru: 'Купить целиком' },
  };

  // name, ₾ per month, setup ₾ — the order matches PLANS below
  // name, ₾ per month, setup ₾, buyout ₾ — the packages table, same source as /pricing/
  const PRICES = [['BASIC', 100, 150, 2000], ['PLUS', 160, 150, 2400], ['PRO', 250, 250, 3200], ['MAX', 350, 450, 4200]];
  const TAG = { en: ['a site', '+ chatbot', '+ forms', '+ online payment'],
                ka: ['საიტი', '+ ჩატბოტი', '+ ფორმები', '+ ონლაინ გადახდა'],
                ru: ['сайт', '+ чат-бот', '+ формы', '+ онлайн-оплата'] };
  const PLANS = {
    en: [['A site for your business.', ['Your own .ge domain', 'Hosting, SSL and daily backups', 'One change a month']],
         ['A site that answers questions.', ['Everything in BASIC', 'FAQ chatbot with your own answers', 'One change a month plus a chatbot update']],
         ['A site that collects enquiries.', ['Everything in PLUS', 'Up to 2 booking or enquiry forms', 'Three changes a month, monthly report']],
         ['A site that takes payment.', ['Everything in PRO', 'Online payment, up to 10 products', 'Four changes a month']]],
    ka: [['საიტი თქვენი ბიზნესისთვის.', ['თქვენი .ge დომენი', 'ჰოსტინგი, SSL და ყოველდღიური ასლი', 'ერთი ცვლილება თვეში']],
         ['საიტი, რომელიც კითხვებს პასუხობს.', ['ყველაფერი BASIC-იდან', 'FAQ ჩატბოტი თქვენი პასუხებით', 'ერთი ცვლილება თვეში და ჩატბოტის განახლება']],
         ['საიტი, რომელიც განაცხადებს აგროვებს.', ['ყველაფერი PLUS-იდან', 'ჯავშნის / მოთხოვნის ფორმები (≤ 2)', 'სამი ცვლილება თვეში, ყოველთვიური ანგარიში']],
         ['საიტი, რომელიც გადახდას იღებს.', ['ყველაფერი PRO-დან', 'ონლაინ გადახდა, ≤ 10 პროდუქტი', 'ოთხი ცვლილება თვეში']]],
    ru: [['Сайт для вашего бизнеса.', ['Ваш домен .ge', 'Хостинг, SSL и ежедневные копии', 'Одно изменение в месяц']],
         ['Сайт, который отвечает на вопросы.', ['Всё из BASIC', 'FAQ-чат-бот с вашими ответами', 'Одно изменение в месяц плюс обновление чат-бота']],
         ['Сайт, который собирает заявки.', ['Всё из PLUS', 'Формы брони и заявок (до 2)', 'Три изменения в месяц, ежемесячный отчёт']],
         ['Сайт, который принимает оплату.', ['Всё из PRO', 'Онлайн-оплата, до 10 товаров', 'Четыре изменения в месяц']]],
  };

  const esc = (s) => String(s).replace(/[&<>"]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[m]);
  const plans = PLANS[L] || PLANS.en;
  const base = L === 'en' ? '' : '../';          // /ka/ and /ru/ sit one level deeper

  const card = ([name, price, setup, buyout], i) => `
    <article class="ox-plan${i === 1 ? ' ox-plan--lead' : ''}" data-i="${i}">
      <h3 class="ox-plan__name">${esc(name)} <span class="ox-plan__tag">${esc((TAG[L] || TAG.en)[i])}</span></h3>
      <p class="ox-plan__price"><strong>${price}</strong> ₾ <span>${esc(t(HEAD.month))}</span></p>
      <p class="ox-plan__sum">${esc(plans[i][0])}</p>
      <ul class="ox-plan__feats">${plans[i][1].map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
      <p class="ox-plan__setup">${esc(t(HEAD.setup).replace('{n}', setup))}</p>
      <p class="ox-plan__setup">${esc(t(HEAD.buy))}: <strong>${buyout.toLocaleString('en-US')} ₾</strong></p>
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
