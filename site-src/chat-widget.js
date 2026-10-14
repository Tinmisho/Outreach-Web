// Outreach assistant: a scripted chat (no AI, no server, nothing is sent anywhere).
// Answers common questions in English or Georgian (it replies in the language you write in).
(() => {
  const KA = /[Ⴀ-ჿ]/, RU = /[А-яЁё]/;
  const A = {
    hi: {
      en: "Hi! I'm the Outreach assistant. We build, sell and rent websites for small businesses. What would you like to know?",
      ka: 'გამარჯობა! მე ვარ Outreach-ის ასისტენტი. ვქმნით, ვყიდით და ვაქირავებთ ვებსაიტებს მცირე ბიზნესებისთვის. რა გაინტერესებთ?',
      ru: 'Здравствуйте! Я ассистент Outreach. Мы создаём, продаём и сдаём в аренду сайты для малого бизнеса. Что вас интересует?',
    },
    services: {
      en: 'We design and build fast, mobile-friendly websites, host them, and keep them updated. You can rent a site monthly or buy it outright. No tech talk required, we handle everything.',
      ka: 'ვქმნით სწრაფ, მობილურზე მორგებულ ვებსაიტებს, ვაქვეყნებთ და ვაახლებთ. საიტის ქირაობა შეგიძლიათ თვიურად ან სრულად ყიდვა. ტექნიკურ დეტალებს ჩვენ ვაგვარებთ.',
      ru: 'Мы создаём быстрые сайты, удобные на телефоне, размещаем их и поддерживаем в актуальном состоянии. Сайт можно арендовать помесячно или купить полностью. Технические детали берём на себя.',
    },
    pricing: {
      en: 'Monthly plans: START 100 ₾ · CHAT 160 ₾ · PRO 250 ₾ · PAY 350 ₾, plus a one-time setup fee. After 12 months of payments you can buy the site, and the buyout price keeps going down. No hourly billing: extras have fixed prices.',
      ka: 'თვიური პაკეტები: START 100 ₾ · CHAT 160 ₾ · PRO 250 ₾ · PAY 350 ₾, პლუს ერთჯერადი გაშვების საფასური. 12 თვის შემდეგ საიტის გამოსყიდვა შეგიძლიათ და ფასი თანდათან მცირდება. საათობრივი ანაზღაურება არ არის, დამატებებს ფიქსირებული ფასი აქვს.',
      ru: 'Тарифы в месяц: START 100 ₾ · CHAT 160 ₾ · PRO 250 ₾ · PAY 350 ₾, плюс разовая плата за запуск. Через 12 месяцев сайт можно выкупить, и цена выкупа продолжает снижаться. Без почасовой оплаты: у дополнений фиксированные цены.',
    },
    time: {
      en: 'A typical site goes live in about 1–2 weeks once we have your content (texts, photos, logo). We show you a demo first, so you see it before you pay.',
      ka: 'საიტი ჩვეულებრივ 1–2 კვირაში ეშვება, როცა მასალა (ტექსტები, ფოტოები, ლოგო) გვექნება. ჯერ დემოს გაჩვენებთ, რომ გადახდამდე ნახოთ.',
      ru: 'Обычно сайт запускается за 1–2 недели, когда у нас есть материалы (тексты, фото, логотип). Сначала мы показываем демо, чтобы вы увидели сайт до оплаты.',
    },
    hosting: {
      en: 'Hosting, SSL and updates are included in every plan. We can use your existing domain or register a new one for you.',
      ka: 'ჰოსტინგი, SSL და განახლებები ყველა პაკეტშია. შეგვიძლია თქვენი არსებული დომენი გამოვიყენოთ ან ახალი დაგირეგისტრიროთ.',
      ru: 'Хостинг, SSL и обновления входят в каждый тариф. Можем использовать ваш домен или зарегистрировать новый.',
    },
    contact: {
      en: "We'd love to talk! Leave your name and phone or email in a message here and our team will get back to you. (This chat is a demo for now: messages aren't sent yet.)",
      ka: 'სიამოვნებით დაგელაპარაკებით! დაგვიტოვეთ სახელი და ტელეფონი ან ელფოსტა და დაგიკავშირდებით. (ჩატი ჯერ სადემონსტრაციოა: შეტყობინებები ჯერ არ იგზავნება.)',
      ru: 'Будем рады пообщаться! Оставьте здесь имя и телефон или email, и наша команда свяжется с вами. (Пока это демо-чат: сообщения ещё не отправляются.)',
    },
    fallback: {
      en: "I'm not sure about that one yet. I can tell you about our services, prices, timing or hosting, or you can leave your contact for the team.",
      ka: 'ამაზე ჯერ ზუსტად ვერ გიპასუხებთ. შემიძლია მოგიყვეთ სერვისებზე, ფასებზე, ვადებზე ან ჰოსტინგზე, ან დაგვიტოვეთ კონტაქტი.',
      ru: 'На этот вопрос я пока не отвечу точно. Могу рассказать об услугах, ценах, сроках или хостинге, или оставьте контакт для команды.',
    },
  };
  const RULES = [
    ['pricing', /price|cost|how much|plan|package|pay|buy|rent|₾|gel|ფას|ღირ|პაკეტ|გადახდ|ქირ|ყიდ|цен|стоим|сколько|тариф|оплат|аренд|купить|выкуп/i],
    ['time', /how long|time|fast|when|deadline|week|ვად|როდის|რამდენ ხან|კვირ|სწრაფ|срок|когда|долго|недел|быстро/i],
    ['hosting', /host|domain|ssl|server|ჰოსტ|დომენ|სერვერ|хост|домен|сервер/i],
    ['contact', /contact|call|phone|email|talk|human|person|meet|კონტაქტ|დარეკ|ტელეფონ|ელფოსტ|დაგვიკავშირ|ადამიან|контакт|позвон|телефон|почт|связ|человек|менеджер/i],
    ['services', /what do you|service|website|site|design|build|do you|სერვის|საიტ|ვებ|დიზაინ|რას აკეთ|услуг|сайт|дизайн|разработ|чем занима/i],
    ['hi', /^(hi|hello|hey|yo|გამარჯობ|სალამ|ჰაი|привет|здравств|добрый)/i],
  ];
  const QUICK = { en: [['services', 'What do you do?'], ['pricing', 'Prices'], ['time', 'How long?'], ['hosting', 'Hosting'], ['contact', 'Talk to us']],
                  ka: [['services', 'რას აკეთებთ?'], ['pricing', 'ფასები'], ['time', 'ვადები'], ['hosting', 'ჰოსტინგი'], ['contact', 'დაგვიკავშირდით']],
                  ru: [['services', 'Что вы делаете?'], ['pricing', 'Цены'], ['time', 'Сроки'], ['hosting', 'Хостинг'], ['contact', 'Связаться']] };

  let lang = ['en', 'ka', 'ru'].includes(window.__oxLang) ? window.__oxLang : (navigator.language || '').startsWith('ka') ? 'ka' : 'en';
  const UI = { en: ['Outreach assistant', 'Usually replies instantly', 'Type a message…', 'Open chat'], ka: ['Outreach ასისტენტი', 'ჩვეულებრივ მაშინვე პასუხობს', 'დაწერეთ შეტყობინება…', 'ჩატის გახსნა'], ru: ['Ассистент Outreach', 'Обычно отвечает сразу', 'Напишите сообщение…', 'Открыть чат'] }[lang];
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

  const fab = el('button', 'ox-chat-fab');
  fab.type = 'button'; fab.setAttribute('aria-label', UI[3]); fab.setAttribute('aria-expanded', 'false');
  fab.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>';

  const panel = el('section', 'ox-chat');
  panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Outreach assistant'); panel.hidden = true;
  const head = el('header', 'ox-chat__head');
  const title = el('div', 'ox-chat__title');
  title.append(el('strong', null, UI[0]), el('span', null, UI[1]));
  const close = el('button', 'ox-chat__close'); close.type = 'button'; close.setAttribute('aria-label', 'Close chat'); close.textContent = '✕';
  head.append(title, close);
  const log = el('div', 'ox-chat__log'); log.setAttribute('aria-live', 'polite');
  const quick = el('div', 'ox-chat__quick');
  const form = el('form', 'ox-chat__form');
  const input = el('input'); input.type = 'text'; input.placeholder = UI[2]; input.setAttribute('aria-label', 'Message'); input.maxLength = 300;
  const send = el('button', null, '↑'); send.type = 'submit'; send.setAttribute('aria-label', 'Send');
  form.append(input, send);
  panel.append(head, log, quick, form);
  document.body.append(panel, fab);

  const add = (who, text) => { const m = el('div', 'ox-msg ox-msg--' + who, text); log.append(m); log.scrollTop = log.scrollHeight; return m; };
  const renderQuick = () => {
    quick.replaceChildren(...QUICK[lang].map(([k, label]) => {
      const b = el('button', 'ox-chip', label); b.type = 'button'; b.dataset.key = k;
      b.addEventListener('click', () => { add('me', label); reply(k); });
      return b;
    }));
  };
  const reply = (key) => {
    const typing = add('bot ox-msg--typing', '…');
    setTimeout(() => { typing.remove(); add('bot', A[key][lang]); }, 450 + Math.random() * 350);
  };
  const answerFor = (text) => { for (const [k, re] of RULES) if (re.test(text)) return k; return 'fallback'; };

  let greeted = false;
  const open = (v) => {
    panel.hidden = !v; fab.setAttribute('aria-expanded', String(v)); fab.classList.toggle('is-open', v);
    if (v) { if (!greeted) { greeted = true; renderQuick(); reply('hi'); } setTimeout(() => input.focus(), 50); } else fab.focus();
  };
  fab.addEventListener('click', () => open(panel.hidden));
  close.addEventListener('click', () => open(false));
  panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') open(false); });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim(); if (!text) return;
    const newLang = KA.test(text) ? 'ka' : RU.test(text) ? 'ru' : /[a-z]/i.test(text) ? 'en' : lang;
    if (newLang !== lang) { lang = newLang; renderQuick(); }
    add('me', text); input.value = '';
    reply(answerFor(text));
  });
})();
