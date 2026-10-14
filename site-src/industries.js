// "Built for real businesses": a pinned section after "What we do". Scrolling down moves a row of example
// websites sideways (flower shop, restaurant, pizzeria, car detailing, …); the card in the middle comes forward
// and its little animation plays. Texts follow the site language (window.__oxLang from lang.js).
(() => {
  const L = ['en', 'ka', 'ru'].includes(window.__oxLang) ? window.__oxLang : 'en';
  const t = (o) => o[L] || o.en;

  const HEAD = {
    eyebrow: { en: '> Built for real businesses', ka: '> ნამდვილი ბიზნესებისთვის', ru: '> Для настоящего бизнеса' },
    title: { en: 'Every business gets <span class="ox-grad">its own site.</span>', ka: 'ყველა ბიზნესს — <span class="ox-grad">საკუთარი საიტი.</span>', ru: 'Каждому бизнесу — <span class="ox-grad">свой сайт.</span>' },
    lede: { en: 'Scroll through a few examples of what we build. Yours could be next.', ka: 'ნახეთ რამდენიმე მაგალითი, რასაც ვქმნით. შემდეგი შეიძლება თქვენი იყოს.', ru: 'Пролистайте несколько примеров того, что мы делаем. Следующим может быть ваш.' },
    example: { en: 'Example', ka: 'მაგალითი', ru: 'Пример' },
  };

  const BIZ = [
    { id: 'flowers', art: 'petals', brand: 'Bloom & Petal', c: ['#e8577e', '#fff4f6', '#3c8d5a', '#2b1a20'],
      type: { en: 'Flower shop', ka: 'ყვავილების მაღაზია', ru: 'Цветочный магазин' },
      head: { en: 'Fresh flowers, delivered today.', ka: 'ახალი ყვავილები, მიწოდება დღესვე.', ru: 'Свежие цветы с доставкой сегодня.' },
      btn: { en: 'Order a bouquet', ka: 'თაიგულის შეკვეთა', ru: 'Заказать букет' },
      feats: { en: ['Online orders', 'Same-day delivery', 'Bouquet gallery'], ka: ['ონლაინ შეკვეთა', 'მიწოდება დღესვე', 'თაიგულების გალერეა'], ru: ['Онлайн-заказы', 'Доставка в тот же день', 'Галерея букетов'] } },
    { id: 'restaurant', art: 'steam', brand: 'Terrace Kitchen', c: ['#c9a24b', '#f3efe6', '#1f4d3a', '#1f2a24'],
      type: { en: 'Restaurant', ka: 'რესტორანი', ru: 'Ресторан' },
      head: { en: 'A table with a view, tonight.', ka: 'მაგიდა ხედით, დღეს საღამოს.', ru: 'Столик с видом — сегодня вечером.' },
      btn: { en: 'Book a table', ka: 'მაგიდის დაჯავშნა', ru: 'Забронировать столик' },
      feats: { en: ['Table booking', 'Menu with photos', 'Google Maps'], ka: ['მაგიდის დაჯავშნა', 'მენიუ ფოტოებით', 'Google Maps'], ru: ['Бронь столиков', 'Меню с фото', 'Google Maps'] } },
    { id: 'pizzeria', art: 'pizza', brand: 'Forno Rosso', c: ['#d63a2f', '#fff6ea', '#f2b632', '#2a1410'],
      type: { en: 'Pizzeria', ka: 'პიცერია', ru: 'Пиццерия' },
      head: { en: 'Hot pizza in 30 minutes.', ka: 'ცხელი პიცა 30 წუთში.', ru: 'Горячая пицца за 30 минут.' },
      btn: { en: 'Order now', ka: 'შეუკვეთე ახლა', ru: 'Заказать' },
      feats: { en: ['Online ordering', 'Delivery tracking', 'Online payment'], ka: ['ონლაინ შეკვეთა', 'მიწოდების თვალყური', 'ონლაინ გადახდა'], ru: ['Онлайн-заказ', 'Отслеживание доставки', 'Онлайн-оплата'] } },
    { id: 'detailing', art: 'shine', brand: 'Gloss Garage', dark: true, c: ['#38bdf8', '#0f172a', '#e2e8f0', '#e2e8f0'],
      type: { en: 'Car detailing', ka: 'ავტო დითეილინგი', ru: 'Детейлинг' },
      head: { en: 'Showroom shine, booked in a minute.', ka: 'სალონის ბრწყინვალება, ჩაწერა ერთ წუთში.', ru: 'Блеск как из салона — запись за минуту.' },
      btn: { en: 'Book a wash', ka: 'ჩაწერა', ru: 'Записаться' },
      feats: { en: ['Online booking', 'Before / after gallery', 'Price list'], ka: ['ონლაინ ჩაწერა', 'მანამდე / შემდეგ', 'ფასები'], ru: ['Онлайн-запись', 'Галерея до / после', 'Прайс-лист'] } },
    { id: 'bakery', art: 'cup', brand: 'Morning Crumb', c: ['#e9a23b', '#fbf3e6', '#8a5a3b', '#2e1f14'],
      type: { en: 'Bakery & café', ka: 'საცხობი და კაფე', ru: 'Пекарня и кафе' },
      head: { en: 'Baked at 6 am, gone by noon.', ka: 'ცხვება დილის 6-ზე, შუადღისთვის აღარ რჩება.', ru: 'Испечено в 6 утра — раскуплено к обеду.' },
      btn: { en: "Today's menu", ka: 'დღევანდელი მენიუ', ru: 'Меню на сегодня' },
      feats: { en: ['Daily specials', 'Pre-orders', 'Opening hours'], ka: ['დღის შეთავაზებები', 'წინასწარი შეკვეთა', 'სამუშაო საათები'], ru: ['Блюда дня', 'Предзаказ', 'Часы работы'] } },
    { id: 'salon', art: 'sparkle', brand: 'Studio Velvet', c: ['#7c3aed', '#f7f2ff', '#f472b6', '#24123d'],
      type: { en: 'Beauty salon', ka: 'სილამაზის სალონი', ru: 'Салон красоты' },
      head: { en: 'Your chair is ready.', ka: 'თქვენი სავარძელი მზადაა.', ru: 'Ваше кресло уже ждёт.' },
      btn: { en: 'Pick a time', ka: 'აირჩიე დრო', ru: 'Выбрать время' },
      feats: { en: ['Booking calendar', 'Stylists & prices', 'SMS reminders'], ka: ['ჯავშნის კალენდარი', 'სტილისტები და ფასები', 'SMS შეხსენებები'], ru: ['Календарь записи', 'Мастера и цены', 'SMS-напоминания'] } },
    { id: 'guesthouse', art: 'sun', brand: 'Old Town Rooms', c: ['#2563eb', '#eef4ff', '#f59e0b', '#14213d'],
      type: { en: 'Guesthouse', ka: 'სასტუმრო', ru: 'Гостевой дом' },
      head: { en: 'Wake up in the old town.', ka: 'გაიღვიძეთ ძველ ქალაქში.', ru: 'Просыпайтесь в старом городе.' },
      btn: { en: 'Check dates', ka: 'თარიღების ნახვა', ru: 'Проверить даты' },
      feats: { en: ['Room booking', 'Photo tour', 'Three languages'], ka: ['ოთახის დაჯავშნა', 'ფოტო-ტური', 'სამი ენა'], ru: ['Бронирование номеров', 'Фототур', 'Три языка'] } },
    { id: 'fitness', art: 'pulse', brand: 'Pulse Gym', dark: true, c: ['#a3e635', '#0b0f0a', '#65a30d', '#ecfccb'],
      type: { en: 'Fitness studio', ka: 'ფიტნეს სტუდია', ru: 'Фитнес-студия' },
      head: { en: 'First class is on us.', ka: 'პირველი ვარჯიში უფასოა.', ru: 'Первое занятие — бесплатно.' },
      btn: { en: 'Join a class', ka: 'ჩაეწერე', ru: 'Записаться' },
      feats: { en: ['Class schedule', 'Memberships online', 'Trainer profiles'], ka: ['ვარჯიშების განრიგი', 'აბონემენტი ონლაინ', 'მწვრთნელები'], ru: ['Расписание', 'Абонементы онлайн', 'Тренеры'] } },
  ];
  const END = {
    title: { en: 'Your business here?', ka: 'აქ თქვენი ბიზნესი იქნება?', ru: 'Здесь будет ваш бизнес?' },
    body: { en: 'Tell us what you do. We build a demo of your site and send you the link, free.', ka: 'მოგვიყევით რას აკეთებთ. ავაწყობთ თქვენი საიტის დემოს და ბმულს უფასოდ გამოგიგზავნით.', ru: 'Расскажите, чем вы занимаетесь. Мы бесплатно сделаем демо вашего сайта и пришлём ссылку.' },
    btn: { en: 'Get a free demo ↗', ka: 'მიიღეთ უფასო დემო ↗', ru: 'Получить бесплатное демо ↗' },
  };

  const esc = (s) => String(s).replace(/[&<>"]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[m]);
  const ART = {
    petals: '<div class="art art--petals">' + '<i></i>'.repeat(7) + '<b class="vase"></b></div>',
    steam: '<div class="art art--steam"><b class="plate"></b><i></i><i></i><i></i></div>',
    pizza: '<div class="art art--pizza"><b class="pie"><i></i><i></i><i></i><i></i><i></i></b></div>',
    shine: '<div class="art art--shine"><b class="car"><i class="w1"></i><i class="w2"></i></b><span class="sweep"></span></div>',
    cup: '<div class="art art--cup"><b class="mug"></b><i></i><i></i></div>',
    sparkle: '<div class="art art--sparkle"><i></i><i></i><i></i><i></i><b class="chair"></b></div>',
    sun: '<div class="art art--sun"><b class="disc"></b><i class="cloud c1"></i><i class="cloud c2"></i><span class="roofs"></span></div>',
    pulse: '<div class="art art--pulse"><svg viewBox="0 0 200 60" aria-hidden="true"><polyline points="0,32 40,32 52,12 64,50 78,6 92,44 104,32 200,32"/></svg></div>',
  };

  const card = (b, i) => {
    const [acc, bg, sec, fg] = b.c;
    return `<article class="ox-biz__card${b.dark ? ' is-dark' : ''}" data-i="${i}" style="--acc:${acc};--bgc:${bg};--sec:${sec};--fgc:${fg}">
      <p class="ox-biz__type"><span>${String(i + 1).padStart(2, '0')}</span> ${esc(t(b.type))} <em>${esc(t(HEAD.example))}</em></p>
      <div class="ox-mock" aria-hidden="true">
        <div class="ox-mock__bar"><i></i><i></i><i></i><span>${esc(b.brand)}</span></div>
        <div class="ox-mock__page">
          <div class="ox-mock__nav"><b>${esc(b.brand)}</b><span></span><span></span><span></span></div>
          <div class="ox-mock__hero">
            <div class="ox-mock__copy"><h4>${esc(t(b.head))}</h4><u>${esc(t(b.btn))}</u></div>
            ${ART[b.art]}
          </div>
          <div class="ox-mock__tiles"><span></span><span></span><span></span></div>
        </div>
      </div>
      <ul class="ox-biz__feats">${t(b.feats).map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
    </article>`;
  };

  const html = `<div class="ox-biz__sticky">
      <div class="ox-biz__head">
        <p class="ox-biz__eyebrow">${esc(t(HEAD.eyebrow))}</p>
        <h2 class="ox-biz__title">${t(HEAD.title)}</h2>
        <p class="ox-biz__lede">${esc(t(HEAD.lede))}</p>
      </div>
      <div class="ox-biz__track">
        ${BIZ.map(card).join('')}
        <article class="ox-biz__card ox-biz__card--end" data-i="${BIZ.length}">
          <h3>${esc(t(END.title))}</h3><p>${esc(t(END.body))}</p>
          <a href="#" class="ox-biz__cta" data-chat="contact">${esc(t(END.btn))}</a>
        </article>
      </div>
      <div class="ox-biz__meter" aria-hidden="true"><span class="ox-biz__count">01 / ${String(BIZ.length).padStart(2, '0')}</span><i><b></b></i></div>
    </div>`;

  let sec, track, cards, count, bar, active = -1;
  const update = () => {
    if (!sec) return;
    const r = sec.getBoundingClientRect(), span = sec.offsetHeight - innerHeight;
    const p = Math.min(Math.max(-r.top / (span || 1), 0), 1);
    const max = track.scrollWidth - innerWidth + Math.min(innerWidth * 0.08, 96);
    track.style.transform = `translate3d(${(-p * Math.max(max, 0)).toFixed(1)}px,0,0)`;
    bar.style.transform = `scaleX(${p.toFixed(4)})`;
    // the card closest to the middle of the screen comes forward
    const mid = innerWidth / 2;
    let best = 0, bestD = 1e9;
    cards.forEach((c, i) => {
      const b = c.getBoundingClientRect(), d = (b.left + b.width / 2 - mid) / innerWidth;
      const cd = Math.max(-1, Math.min(1, d)); c.style.setProperty('--d', cd.toFixed(3)); c.style.setProperty('--ad', Math.abs(cd).toFixed(3));
      c.classList.toggle('is-near', Math.abs(d) < 0.75);
      if (Math.abs(d) < bestD) { bestD = Math.abs(d); best = i; }
    });
    if (best !== active) {
      if (active >= 0 && r.top < 0 && r.bottom > innerHeight) dispatchEvent(new CustomEvent('ox:card', { detail: best }));
      active = best;
      cards.forEach((c, i) => c.classList.toggle('is-active', i === best));
      count.textContent = `${String(Math.min(best + 1, BIZ.length)).padStart(2, '0')} / ${String(BIZ.length).padStart(2, '0')}`;
    }
  };

  const mount = () => {
    const show = document.getElementById('showcase');
    if (!show || document.getElementById('ox-biz')) return !!show;
    sec = document.createElement('section');
    sec.id = 'ox-biz'; sec.className = 'ox-biz'; sec.style.setProperty('--n', BIZ.length + 1);
    sec.setAttribute('aria-label', t(HEAD.eyebrow).replace('> ', ''));
    sec.innerHTML = html;
    const anchor = show.parentElement && show.parentElement.classList.contains('pin-spacer') ? show.parentElement : show;
    anchor.after(sec);
    track = sec.querySelector('.ox-biz__track'); cards = [...sec.querySelectorAll('.ox-biz__card')];
    count = sec.querySelector('.ox-biz__count'); bar = sec.querySelector('.ox-biz__meter b');
    sec.addEventListener('click', (e) => {
      const a = e.target.closest('[data-chat]'); if (!a) return;
      e.preventDefault();
      const fab = document.querySelector('.ox-chat-fab'), panel = document.querySelector('.ox-chat');
      if (fab && panel && panel.hidden) fab.click();
      setTimeout(() => { const chip = document.querySelector(`.ox-chip[data-key="${a.dataset.chat}"]`); if (chip) chip.click(); }, 900);
    });
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    requestAnimationFrame(() => { dispatchEvent(new Event('resize')); update(); }); // let the scroll animations re-measure
    return true;
  };
  if (!mount()) {
    const mo = new MutationObserver(() => { if (mount()) mo.disconnect(); });
    mo.observe(document.getElementById('root') || document.body, { childList: true, subtree: true });
  }
})();
