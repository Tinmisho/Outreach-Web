#!/usr/bin/env python3
"""Generates the SEO layer of the Outreach site into ../public, in English, Georgian and Russian:

  * content pages (services, how-it-works, pricing, contact) per language: /, /ka/, /ru/
  * the 3D home page per language (/ka/ and /ru/ are copies of index.html with the language fixed)
  * unique <title>, meta description, canonical, hreflang, Open Graph, breadcrumbs and JSON-LD on every page
  * 404.html, sitemap.xml (with hreflang alternates), robots.txt, llms.txt, _headers
  * minified copies of the hand-written scripts (sources live in ../site-src)

Run after any content change:  python3 tools/build_pages.py
Switching to a custom domain = change SITE below and run it again.
Georgian plan / step / FAQ texts are the official ones from the main Outreach site (WebB-Site).
"""
import json, pathlib, re, subprocess, shutil, datetime, html

SITE = "https://outreach.pre-production.workers.dev"   # canonical origin (no trailing slash)
ROOT = pathlib.Path(__file__).resolve().parent.parent
PUB = ROOT / "public"
SRC = ROOT / "site-src"
TODAY = datetime.date.today().isoformat()
YEAR = datetime.date.today().year

LANGS = ["en", "ka", "ru"]
PREFIX = {"en": "", "ka": "ka/", "ru": "ru/"}
LOCALE = {"en": "en_US", "ka": "ka_GE", "ru": "ru_RU"}
LANG_NAME = {"en": "EN", "ka": "ქა", "ru": "RU"}
LANG_FULL = {"en": "English", "ka": "ქართული", "ru": "Русский"}
GEORGIAN_FONT = "https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian:wght@400;600;700;800&display=swap"

BUSINESS = {
    "name": "Outreach", "locality": "Tbilisi", "country": "GE", "area": "Georgia", "price_range": "100–350 ₾ / month",
    # Fill these in when they exist; empty values are left out of the structured data.
    "telephone": "", "email": "", "street": "", "same_as": [],
}

SLUGS = ["", "services/", "how-it-works/", "pricing/", "contact/"]
NAV = SLUGS[1:]

# ── texts ──────────────────────────────────────────────────────────────────────────────────────────────
UI = {
    "en": {"nav": {"": "Home", "services/": "Services", "how-it-works/": "How it works", "pricing/": "Pricing", "contact/": "Contact"},
           "tagline": "Websites, hosting and care · Tbilisi, Georgia", "crumbs": "Breadcrumb", "langs": "Language",
           "cta_h": "Want to see your website first?", "cta_p": "Tell us the name of your business. We will build something and send you a link.",
           "talk": "Talk to us", "see_pricing": "See pricing", "month": "/ month", "setup": "Setup {n} ₾, charged once", "own": "Want to own it?",
           "questions": "Questions", "year": "/ year, paid up front", "setup_free": "setup free", "buyout": "Buy the site outright", "in_every": "In every package", "compare": "What each package does", "plan": "Package", "addons": "Add-ons"},
    "ka": {"nav": {"": "მთავარი", "services/": "სერვისები", "how-it-works/": "როგორ ვმუშაობთ", "pricing/": "ფასები", "contact/": "კონტაქტი"},
           "tagline": "ვებსაიტები, ჰოსტინგი და მხარდაჭერა · თბილისი, საქართველო", "crumbs": "ნავიგაციის ბილიკი", "langs": "ენა",
           "cta_h": "გსურთ ჯერ თქვენი ვებსაიტი ნახოთ?", "cta_p": "გვითხარით თქვენი ბიზნესის სახელი. რაღაცას ავაწყობთ და ბმულს გამოგიგზავნით.",
           "talk": "დაგვიკავშირდით", "see_pricing": "ფასების ნახვა", "month": "/ თვე", "setup": "Setup {n} ₾, ერთჯერადად", "own": "გსურთ საიტი იყიდოთ?",
           "questions": "კითხვები", "year": "/ წელი, წინასწარ", "setup_free": "setup უფასოა", "buyout": "საიტის პირდაპირი ყიდვა", "in_every": "რა შედის ყველა პაკეტში", "compare": "რას აკეთებს თითოეული პაკეტი", "plan": "პაკეტი", "addons": "დამატებები"},
    "ru": {"nav": {"": "Главная", "services/": "Услуги", "how-it-works/": "Как мы работаем", "pricing/": "Цены", "contact/": "Контакты"},
           "tagline": "Сайты, хостинг и поддержка · Тбилиси, Грузия", "crumbs": "Навигационная цепочка", "langs": "Язык",
           "cta_h": "Хотите сначала увидеть свой сайт?", "cta_p": "Назовите ваш бизнес. Мы сделаем сайт и пришлём вам ссылку.",
           "talk": "Связаться", "see_pricing": "Смотреть цены", "month": "/ мес", "setup": "Запуск {n} ₾, один раз", "own": "Хотите купить сайт?",
           "questions": "Вопросы", "year": "/ год, предоплатой", "setup_free": "запуск бесплатно", "buyout": "Купить сайт целиком", "in_every": "Что входит в каждый пакет", "compare": "Что умеет каждый пакет", "plan": "Пакет", "addons": "Дополнения"},
}

META = {  # slug -> lang -> (title, description)
    "": {"en": ("Outreach — Website design & hosting in Tbilisi", "Outreach designs, builds and hosts fast websites for small businesses in Georgia. See a working demo first, then rent from 100 ₾/month or buy it."),
         "ka": ("Outreach — ვებსაიტების შექმნა და ჰოსტინგი თბილისში", "Outreach ქმნის, უშვებს და ჰოსტავს სწრაფ ვებსაიტებს მცირე ბიზნესებისთვის საქართველოში. ჯერ ნახეთ დემო, შემდეგ იქირავეთ 100 ₾-დან თვეში ან იყიდეთ."),
         "ru": ("Outreach — Разработка и хостинг сайтов в Тбилиси", "Outreach создаёт, запускает и размещает быстрые сайты для малого бизнеса в Грузии. Сначала рабочее демо, затем аренда от 100 ₾ в месяц или покупка.")},
    "services/": {"en": ("Website design, hosting & care — Services | Outreach", "Design and build, hosting and care, rent or own: everything Outreach does for small businesses in Georgia, in plain words."),
                  "ka": ("ვებსაიტის დიზაინი, ჰოსტინგი და მოვლა — სერვისები | Outreach", "დიზაინი და აწყობა, ჰოსტინგი და მოვლა, ქირაობა ან ყიდვა: ყველაფერი, რასაც Outreach მცირე ბიზნესებისთვის აკეთებს, მარტივ ენაზე."),
                  "ru": ("Дизайн сайтов, хостинг и поддержка — Услуги | Outreach", "Дизайн и разработка, хостинг и поддержка, аренда или покупка: всё, что Outreach делает для малого бизнеса в Грузии, простыми словами.")},
    "how-it-works/": {"en": ("How it works: demo first, pay after | Outreach", "We build your website first and send you a link. You look at it on your phone, then decide to rent or buy. No lock-in."),
                      "ka": ("როგორ ვმუშაობთ: ჯერ დემო, შემდეგ გადახდა | Outreach", "ჯერ ვაწყობთ თქვენს ვებსაიტს და ბმულს გიგზავნით. ნახავთ ტელეფონში, შემდეგ წყვეტთ — იქირავოთ თუ იყიდოთ. მიბმის გარეშე."),
                      "ru": ("Как мы работаем: сначала демо, потом оплата | Outreach", "Сначала мы делаем ваш сайт и присылаем ссылку. Вы смотрите его на телефоне и решаете: арендовать или купить. Без обязательств.")},
    "pricing/": {"en": ("Website pricing from 100 ₾/month — Plans | Outreach", "BASIC 100 ₾, PLUS 160 ₾, PRO 250 ₾, MAX 350 ₾ a month with hosting, SSL, daily backups, search engine basics and changes included. Buy outright from 2,000 ₾."),
                 "ka": ("ვებსაიტის ფასები 100 ₾-დან თვეში — პაკეტები | Outreach", "BASIC 100 ₾, PLUS 160 ₾, PRO 250 ₾, MAX 350 ₾ თვეში — ჰოსტინგი, SSL, ყოველდღიური ასლი, SEO და ცვლილებები შედის. სრული შესყიდვა 2,000 ₾-დან."),
                 "ru": ("Цены на сайты от 100 ₾ в месяц — Тарифы | Outreach", "BASIC 100 ₾, PLUS 160 ₾, PRO 250 ₾, MAX 350 ₾ в месяц: хостинг, SSL, ежедневные копии, базовое SEO и изменения включены. Покупка сайта от 2 000 ₾.")},
    "contact/": {"en": ("Contact Outreach — Web studio in Tbilisi, Georgia", "Talk to Outreach about a website for your business. Based in Tbilisi, working with small businesses across Georgia."),
                 "ka": ("კონტაქტი — Outreach, ვებ სტუდია თბილისში", "მოგვიყევით თქვენს ბიზნესზე და ვებსაიტზე ვისაუბროთ. ვართ თბილისში და ვმუშაობთ მცირე ბიზნესებთან მთელ საქართველოში."),
                 "ru": ("Контакты — Outreach, веб-студия в Тбилиси", "Расскажите о своём бизнесе, и мы обсудим ваш сайт. Мы в Тбилиси и работаем с малым бизнесом по всей Грузии.")},
}

INTRO = {  # slug -> lang -> (eyebrow, h1, lede)
    "services/": {"en": ("What we do", "Your website, handled.", "One team for the whole thing: design, launch, hosting and care. Four parts, zero headaches."),
                  "ka": ("რას ვაკეთებთ", "თქვენი ვებსაიტი ჩვენზეა.", "ერთი გუნდი ყველაფრისთვის: დიზაინი, გაშვება, ჰოსტინგი და მოვლა. ოთხი ნაწილი, ნული თავის ტკივილი."),
                  "ru": ("Что мы делаем", "Ваш сайт — наша забота.", "Одна команда на всё: дизайн, запуск, хостинг и поддержка. Четыре части — ноль головной боли.")},
    "how-it-works/": {"en": ("How it works", "Demo first. You decide after.", "We build your website before you pay anything, so you see exactly what you get."),
                      "ka": ("როგორ ვმუშაობთ", "ჯერ დემო. შემდეგ თქვენ წყვეტთ.", "ვებსაიტს ვაწყობთ მანამ, სანამ რამეს გადაიხდით — ზუსტად ხედავთ, რას იღებთ."),
                      "ru": ("Как мы работаем", "Сначала демо. Решаете потом.", "Мы делаем ваш сайт до любой оплаты, поэтому вы точно видите, что получаете.")},
    "pricing/": {"en": ("Pricing", "Simple monthly plans.", "Every amount is in GEL and final. We do not bill by the hour. Minimum term 3 months, then 30 days notice. Hosting, SSL, daily backups, search engine basics and changes are always included."),
                 "ka": ("ფასები", "მარტივი თვიური პაკეტები.", "ყველა თანხა ლარშია და საბოლოოა. საათობრივი დათვლა არ გვაქვს. მინიმალური ვადა 3 თვე, შემდეგ შეწყვეტა 30 დღით ადრე. ჰოსტინგი, SSL, ყოველდღიური ასლი, SEO-ს საფუძვლები და ცვლილებები ყოველთვის შედის."),
                 "ru": ("Цены", "Простые ежемесячные тарифы.", "Все суммы в лари и окончательные. Почасовой оплаты нет. Минимальный срок 3 месяца, далее отмена с уведомлением за 30 дней. Хостинг, SSL, ежедневные копии, базовое SEO и изменения всегда включены.")},
    "contact/": {"en": ("Contact", "Let's build your website.", "Tell us what you do and we'll come back with a plan and a price. No jargon, no surprises."),
                 "ka": ("კონტაქტი", "ავაწყოთ თქვენი ვებსაიტი.", "მოგვიყევით რას აკეთებთ და დაგიბრუნდებით გეგმითა და ფასით. ზედმეტი ტერმინებისა და სიურპრიზების გარეშე."),
                 "ru": ("Контакты", "Давайте создадим ваш сайт.", "Расскажите, чем вы занимаетесь, и мы вернёмся с планом и ценой. Без жаргона и сюрпризов.")},
}

# name, ₾ per month, setup ₾, annual prepay ₾, buyout ₾   (the packages table is the source: BASIC/PLUS/PRO/MAX)
PLAN_PRICES = [("BASIC", 100, 150, 1200, 2000), ("PLUS", 160, 150, 1728, 2400),
               ("PRO", 250, 250, 2700, 3200), ("MAX", 350, 450, 3780, 4200)]
PLAN_TAG = {  # the one-line label under each name in the table
    "en": ["a site", "+ chatbot", "+ forms", "+ online payment"],
    "ka": ["საიტი", "+ ჩატბოტი", "+ ფორმები", "+ ონლაინ გადახდა"],
    "ru": ["сайт", "+ чат-бот", "+ формы", "+ онлайн-оплата"],
}
PLANS = {  # lang -> [(summary, [includes])] in PLAN_PRICES order
    "en": [("A site for your business.", ["Your own .ge domain", "Hosting, SSL and daily backups", "One change a month"]),
           ("A site that answers questions.", ["Everything in BASIC", "FAQ chatbot with your own answers", "One change a month plus a chatbot update"]),
           ("A site that collects enquiries.", ["Everything in PLUS", "Up to 2 booking or enquiry forms", "Three changes a month, monthly report"]),
           ("A site that takes payment.", ["Everything in PRO", "Online payment, up to 10 products", "Four changes a month"])],
    "ka": [("საიტი თქვენი ბიზნესისთვის.", ["თქვენი .ge დომენი", "ჰოსტინგი, SSL და ყოველდღიური ასლი", "ერთი ცვლილება თვეში"]),
           ("საიტი, რომელიც კითხვებს პასუხობს.", ["ყველაფერი BASIC-იდან", "FAQ ჩატბოტი თქვენი პასუხებით", "ერთი ცვლილება თვეში და ჩატბოტის განახლება"]),
           ("საიტი, რომელიც განაცხადებს აგროვებს.", ["ყველაფერი PLUS-იდან", "ჯავშნის / მოთხოვნის ფორმები (≤ 2)", "სამი ცვლილება თვეში, ყოველთვიური ანგარიში"]),
           ("საიტი, რომელიც გადახდას იღებს.", ["ყველაფერი PRO-დან", "ონლაინ გადახდა, ≤ 10 პროდუქტი", "ოთხი ცვლილება თვეში"])],
    "ru": [("Сайт для вашего бизнеса.", ["Ваш домен .ge", "Хостинг, SSL и ежедневные копии", "Одно изменение в месяц"]),
           ("Сайт, который отвечает на вопросы.", ["Всё из BASIC", "FAQ-чат-бот с вашими ответами", "Одно изменение в месяц плюс обновление чат-бота"]),
           ("Сайт, который собирает заявки.", ["Всё из PLUS", "Формы брони и заявок (до 2)", "Три изменения в месяц, ежемесячный отчёт"]),
           ("Сайт, который принимает оплату.", ["Всё из PRO", "Онлайн-оплата, до 10 товаров", "Четыре изменения в месяц"])],
}
# what every package carries
INCLUDED = {
    "en": ["A site that works on a phone, hosting, SSL, domain management, daily backups",
           "Search engine basics: a title and description on every page, a sitemap, and structured data so Google can read the site",
           "Privacy policy text", "A .ge domain in your name — the first year is in the setup fee"],
    "ka": ["მობილურზე მორგებული საიტი, ჰოსტინგი, SSL, დომენის მართვა, ყოველდღიური ასლი",
           "SEO-ს საფუძვლები: სათაური და აღწერა ყველა გვერდზე, საიტის რუკა და სტრუქტურირებული მონაცემები, რომ Google-მა საიტი წაიკითხოს",
           "კონფიდენციალურობის პოლიტიკის ტექსტი", "დომენი (.ge) თქვენს სახელზე — პირველი წელი setup-ში"],
    "ru": ["Сайт, адаптированный под телефон, хостинг, SSL, управление доменом, ежедневные копии",
           "Базовое SEO: заголовок и описание на каждой странице, карта сайта и структурированные данные, чтобы Google прочитал сайт",
           "Текст политики конфиденциальности", "Домен .ge на ваше имя — первый год входит в запуск"],
}
# comparison rows: (section, label, [BASIC, PLUS, PRO, MAX]) — "+" marks a yes, "-" a no
MATRIX = {
    "en": [("Service", "Changes a month", ["1", "1 + chatbot update", "3", "4"]),
           ("Service", "Change done within", ["3 working days", "3 working days", "2 working days", "2 working days"]),
           ("Service", "Response to a fault", ["1 working day", "1 working day", "4 working hours", "4 working hours; payment the same day"]),
           ("Features", "FAQ chatbot, with answers you approve", ["-", "+", "+", "+"]),
           ("Features", "Booking / enquiry forms (up to 2)", ["-", "-", "+", "+"]),
           ("Features", "Short monthly report (visits, calls)", ["-", "-", "+", "+"]),
           ("Features", "Google Business Profile link", ["-", "-", "+", "+"]),
           ("Features", "Online payment (up to 10 products or services)", ["-", "-", "-", "+"]),
           ("Add-ons", "AI chatbot", ["-", "+60 ₾ / month, +100 ₾ once", "+60 ₾ / month, +100 ₾ once", "+60 ₾ / month, +100 ₾ once"]),
           ("Add-ons", "Extra language (EN / RU)", ["+15 ₾ / month, +150 ₾ once"] * 4)],
    "ka": [("მომსახურება", "ცვლილებები თვეში", ["1", "1 + ჩატბოტის განახლება", "3", "4"]),
           ("მომსახურება", "ცვლილების შესრულების ვადა", ["3 სამუშაო დღე", "3 სამუშაო დღე", "2 სამუშაო დღე", "2 სამუშაო დღე"]),
           ("მომსახურება", "ხარვეზზე რეაგირება", ["1 სამუშაო დღე", "1 სამუშაო დღე", "4 სამუშაო საათი", "4 სამუშაო საათი; გადახდაზე იმავე დღეს"]),
           ("ფუნქციები", "FAQ ჩატბოტი (თქვენი დადასტურებული პასუხებით)", ["-", "+", "+", "+"]),
           ("ფუნქციები", "ჯავშნის / მოთხოვნის ფორმები (≤ 2)", ["-", "-", "+", "+"]),
           ("ფუნქციები", "ყოველთვიური მოკლე ანგარიში (ვიზიტები, ზარები)", ["-", "-", "+", "+"]),
           ("ფუნქციები", "Google Business Profile-ის ბმული", ["-", "-", "+", "+"]),
           ("ფუნქციები", "ონლაინ გადახდა (≤ 10 პროდუქტი / სერვისი)", ["-", "-", "-", "+"]),
           ("დამატებები", "AI ჩატბოტი", ["-", "+60 ₾ / თვე, +100 ₾ ერთჯერადი", "+60 ₾ / თვე, +100 ₾ ერთჯერადი", "+60 ₾ / თვე, +100 ₾ ერთჯერადი"]),
           ("დამატებები", "დამატებითი ენა (EN / RU)", ["+15 ₾ / თვე, +150 ₾ ერთჯერადი"] * 4)],
    "ru": [("Обслуживание", "Изменений в месяц", ["1", "1 + обновление чат-бота", "3", "4"]),
           ("Обслуживание", "Срок выполнения изменения", ["3 рабочих дня", "3 рабочих дня", "2 рабочих дня", "2 рабочих дня"]),
           ("Обслуживание", "Реакция на сбой", ["1 рабочий день", "1 рабочий день", "4 рабочих часа", "4 рабочих часа; по оплате — в тот же день"]),
           ("Функции", "FAQ-чат-бот с вашими утверждёнными ответами", ["-", "+", "+", "+"]),
           ("Функции", "Формы брони и заявок (до 2)", ["-", "-", "+", "+"]),
           ("Функции", "Короткий ежемесячный отчёт (визиты, звонки)", ["-", "-", "+", "+"]),
           ("Функции", "Ссылка на профиль Google Business", ["-", "-", "+", "+"]),
           ("Функции", "Онлайн-оплата (до 10 товаров или услуг)", ["-", "-", "-", "+"]),
           ("Дополнения", "AI-чат-бот", ["-", "+60 ₾ / мес, +100 ₾ разово", "+60 ₾ / мес, +100 ₾ разово", "+60 ₾ / мес, +100 ₾ разово"]),
           ("Дополнения", "Дополнительный язык (EN / RU)", ["+15 ₾ / мес, +150 ₾ разово"] * 4)],
}
# the three notes under the table: (heading, [paragraphs])
TERMS = {
    "en": [("How payment works", [
             "Subscription: the setup fee is due within 5 working days of signing, the monthly fee in advance. Minimum term is 3 months, after that you can stop with 30 days notice.",
             "The setup fee covers: a .ge domain for one year, SSL, your text, up to 15 photos, your logo and colours, and two rounds of corrections before launch.",
             "You can move up a package at any time, from the following month."]),
           ("What counts as one change", [
             "One request on one page: up to 100 words of text, or up to 10 lines in a price list or menu, or opening hours / phone / address, or replacing up to 3 photos, or one banner.",
             "An extra change is 20 ₾. Bundles: 3 changes for 50 ₾, 10 changes for 150 ₾. A same-day change (ordered before 14:00) is +30 ₾."]),
           ("Not included in any package", [
             "Writing text from scratch, photo and video shoots, logo design, advertising and its budget, running social media, email hosting, bookkeeping, and the payment provider's commission."])],
    "ka": [("როგორ ხდება გადახდა", [
             "გამოწერა: setup ხელმოწერიდან 5 სამუშაო დღეში, ყოველთვიური საფასური წინასწარ. მინიმალური ვადა 3 თვე, შემდეგ შეწყვეტა 30 დღით ადრე შეტყობინებით.",
             "setup-ში შედის: .ge დომენი 1 წელი, SSL, თქვენი ტექსტი, ≤ 15 ფოტო, ლოგო, ფერები და 2 რაუნდი შესწორება გაშვებამდე.",
             "პაკეტის აწევა შესაძლებელია ნებისმიერ დროს, მომდევნო თვიდან."]),
           ("რა არის ერთი ცვლილება", [
             "ერთი მოთხოვნა ერთ გვერდზე: ტექსტი ≤ 100 სიტყვა, ან ≤ 10 სტრიქონი ფასებში / მენიუში, ან საათები / ტელეფონი / მისამართი, ან ≤ 3 ფოტოს ჩანაცვლება, ან ერთი ბანერი.",
             "დამატებითი ცვლილება — 20 ₾. პაკეტი: 3 ცვლილება — 50 ₾, 10 ცვლილება — 150 ₾. სასწრაფო ცვლილება იმავე დღეს (14:00-მდე) — +30 ₾."]),
           ("არც ერთ პაკეტში არ შედის", [
             "ტექსტის წერა ნულიდან, ფოტო- და ვიდეოგადაღება, ლოგოს შექმნა, რეკლამა და მისი ბიუჯეტი, სოციალური ქსელების წარმოება, ელფოსტის ჰოსტინგი, ბუღალტერია, გადახდის პროვაიდერის საკომისიო."])],
    "ru": [("Как проходит оплата", [
             "Подписка: запуск оплачивается в течение 5 рабочих дней после подписания, ежемесячная плата — заранее. Минимальный срок 3 месяца, далее можно расторгнуть с уведомлением за 30 дней.",
             "В запуск входит: домен .ge на год, SSL, ваш текст, до 15 фотографий, логотип, цвета и два круга правок до запуска.",
             "Перейти на старший пакет можно в любой момент, со следующего месяца."]),
           ("Что считается одним изменением", [
             "Один запрос на одной странице: текст до 100 слов, или до 10 строк в прайсе или меню, или часы работы / телефон / адрес, или замена до 3 фотографий, или один баннер.",
             "Дополнительное изменение — 20 ₾. Пакеты: 3 изменения — 50 ₾, 10 изменений — 150 ₾. Срочное изменение в тот же день (до 14:00) — +30 ₾."]),
           ("Не входит ни в один пакет", [
             "Написание текста с нуля, фото- и видеосъёмка, создание логотипа, реклама и её бюджет, ведение социальных сетей, почтовый хостинг, бухгалтерия, комиссия платёжного провайдера."])],
}
STEPS = {
    "en": [("We build it.", "Before we ever call you. Your business, your photos, your prices: a real site, not a mockup."),
           ("You look at it.", "We send you a link. Open it on your phone. If it is not right, we change it or we stop there."),
           ("You decide.", "Rent it monthly, or buy it outright and take the code with you. No lock-in either way.")],
    "ka": [("ვქმნით.", "სანამ დაგირეკავთ. თქვენი ბიზნესი, თქვენი ფოტოები, თქვენი ფასები — ნამდვილი საიტი და არა მაკეტი."),
           ("თქვენ უყურებთ.", "გიგზავნით ბმულს. გახსენით ტელეფონში. თუ არ მოგეწონათ, შევცვლით ან აქვე ვჩერდებით."),
           ("თქვენ წყვეტთ.", "იქირავეთ თვიურად ან სრულად შეიძინეთ და კოდი თან წაიღეთ. არცერთ შემთხვევაში არ ხართ მიბმული.")],
    "ru": [("Мы делаем сайт.", "Ещё до звонка вам. Ваш бизнес, ваши фото, ваши цены — настоящий сайт, а не макет."),
           ("Вы смотрите.", "Мы присылаем ссылку. Откройте её на телефоне. Если что-то не так, мы исправим — или на этом остановимся."),
           ("Вы решаете.", "Арендуйте помесячно или купите сайт полностью и заберите код. Никаких обязательств в любом случае.")],
}
FAQ = {
    "en": [("What happens if I stop paying?", "The domain is registered in your name from day one, so it stays yours. We hand over DNS control within five working days, and export your form data as a spreadsheet."),
           ("Can I buy the site instead of renting?", "Yes. Buying outright runs 2,000–4,200 ₾ depending on the package. After twelve paid months the buyout price drops, reaching 60% at two years."),
           ("Do I need to understand any of this?", "No. You know your business, we handle the website. We ask for your text and photos and do the rest."),
           ("How fast does it go live?", "Setup takes five working days once we have your content. Changes after that are two to three working days depending on your package.")],
    "ka": [("რა მოხდება, თუ გადახდას შევწყვეტ?", "დომენი პირველივე დღიდან თქვენს სახელზეა რეგისტრირებული და თქვენი რჩება. DNS-ის მართვას 5 სამუშაო დღეში გადმოგცემთ, ფორმების მონაცემებს კი ცხრილად გამოგიგზავნით."),
           ("შემიძლია ქირაობის ნაცვლად საიტის ყიდვა?", "დიახ. სრული შესყიდვა პაკეტის მიხედვით 2,000–4,200 ₾ ღირს. 12 გადახდილი თვის შემდეგ ფასი იკლებს და ორ წელიწადში 60%-ს აღწევს."),
           ("ამ ყველაფრის გარკვევა მჭირდება?", "არა. თქვენ იცნობთ თქვენს ბიზნესს, ჩვენ ვებსაიტზე ვზრუნავთ. გვჭირდება მხოლოდ თქვენი ტექსტი და ფოტოები."),
           ("რამდენად სწრაფად ამოქმედდება?", "Setup 5 სამუშაო დღეს იკავებს მასალების მიღების შემდეგ. შემდგომი ცვლილებები პაკეტის მიხედვით 2-3 სამუშაო დღეა.")],
    "ru": [("Что будет, если я перестану платить?", "Домен с первого дня зарегистрирован на ваше имя, поэтому он остаётся вашим. Мы передадим управление DNS в течение пяти рабочих дней и выгрузим данные форм в таблицу."),
           ("Можно купить сайт вместо аренды?", "Да. Покупка стоит 2 000–4 200 ₾ в зависимости от тарифа. После двенадцати оплаченных месяцев цена выкупа снижается и через два года составляет 60%."),
           ("Мне нужно во всём этом разбираться?", "Нет. Вы знаете свой бизнес, а сайтом занимаемся мы. Нам нужны только ваши тексты и фото."),
           ("Как быстро сайт заработает?", "Запуск занимает пять рабочих дней после получения материалов. Дальнейшие изменения — два-три рабочих дня в зависимости от тарифа.")],
}
SERVICES = {
    "en": [("Design & build", "A fast, mobile-ready website shaped around your business: your texts, your photos, your prices. You see a working demo before you pay a single lari.",
            ["Custom design in your colours", "Works on every phone, tablet and laptop", "Your own .ge domain"]),
           ("Hosting & care", "Hosting, SSL, updates and fixes are part of every plan. We keep the site running, you keep running your business.",
            ["Hosting and SSL included", "Monthly changes included", "Problems fixed for you"]),
           ("Rent or own", "Start monthly with no big upfront cost. After twelve paid months you can buy the site, and the buyout price keeps going down.",
            ["From 100 ₾ a month", "Minimum 3 months, then 30 days notice", "Buy outright from 2,000 ₾"]),
           ("Grow with it", "Add a FAQ chat, booking and contact forms, a Google Business profile or online payments when you need them.",
            ["FAQ chat for customers", "Booking and contact forms", "Online payments to your bank"])],
    "ka": [("დიზაინი და აწყობა", "სწრაფი, მობილურზე მორგებული ვებსაიტი თქვენი ბიზნესისთვის: თქვენი ტექსტები, ფოტოები და ფასები. მოქმედ დემოს გადახდამდე ნახავთ.",
            ["დიზაინი თქვენს ფერებში", "მუშაობს ყველა ტელეფონზე, პლანშეტსა და ლეპტოპზე", "თქვენი .ge დომენი"]),
           ("ჰოსტინგი და მოვლა", "ჰოსტინგი, SSL, განახლებები და შესწორებები ყველა პაკეტშია. საიტს ჩვენ ვუვლით, თქვენ კი ბიზნესს.",
            ["ჰოსტინგი და SSL შედის ფასში", "ყოველთვიური ცვლილებები შედის ფასში", "პრობლემებს ჩვენ ვაგვარებთ"]),
           ("იქირავეთ ან იყიდეთ", "დაიწყეთ თვიურად, დიდი წინასწარი ხარჯის გარეშე. 12 გადახდილი თვის შემდეგ საიტის გამოსყიდვა შეგიძლიათ და ფასი თანდათან მცირდება.",
            ["100 ₾-დან თვეში", "მინიმალური ვადა 3 თვე, შემდეგ 30 დღით ადრე", "სრული შესყიდვა 2,000 ₾-დან"]),
           ("გაიზარდეთ საიტთან ერთად", "დაამატეთ ჩატბოტი, ჯავშნისა და კონტაქტის ფორმები, Google Business პროფილი ან ონლაინ გადახდა, როცა დაგჭირდებათ.",
            ["ჩატბოტი კლიენტებისთვის", "ჯავშნისა და კონტაქტის ფორმები", "ონლაინ გადახდა თქვენს ანგარიშზე"])],
    "ru": [("Дизайн и разработка", "Быстрый сайт, удобный на телефоне и сделанный под ваш бизнес: ваши тексты, фото и цены. Рабочее демо вы увидите ещё до оплаты.",
            ["Дизайн в ваших цветах", "Работает на любом телефоне, планшете и ноутбуке", "Ваш собственный домен .ge"]),
           ("Хостинг и поддержка", "Хостинг, SSL, обновления и исправления входят в каждый тариф. Мы следим за сайтом, вы — за бизнесом.",
            ["Хостинг и SSL включены", "Ежемесячные изменения включены", "Проблемы решаем мы"]),
           ("Аренда или покупка", "Начните помесячно, без больших вложений. После 12 оплаченных месяцев сайт можно выкупить, и цена выкупа продолжает снижаться.",
            ["От 100 ₾ в месяц", "Минимум 3 месяца, далее за 30 дней", "Покупка сайта от 2 000 ₾"]),
           ("Растите вместе с сайтом", "Добавьте чат-бота, формы бронирования и обратной связи, профиль Google Business или онлайн-оплату, когда понадобится.",
            ["Чат-бот для клиентов", "Формы бронирования и обратной связи", "Онлайн-оплата на ваш счёт"])],
}
CONTACT = {
    "en": ("Chat with us", "The quickest way: open the chat, leave your name and how to reach you, and our team gets back to you.", "Open the chat",
           "Where we are", "Outreach<br>Tbilisi, Georgia", "We work with small businesses all over Georgia, in Georgian, English and Russian."),
    "ka": ("მოგვწერეთ ჩატში", "უსწრაფესი გზა: გახსენით ჩატი, დაგვიტოვეთ სახელი და საკონტაქტო ინფორმაცია, ჩვენი გუნდი დაგიკავშირდებათ.", "ჩატის გახსნა",
           "სად ვართ", "Outreach<br>თბილისი, საქართველო", "ვმუშაობთ მცირე ბიზნესებთან მთელ საქართველოში — ქართულად, ინგლისურად და რუსულად."),
    "ru": ("Напишите нам в чат", "Самый быстрый способ: откройте чат, оставьте имя и контакт, и наша команда свяжется с вами.", "Открыть чат",
           "Где мы", "Outreach<br>Тбилиси, Грузия", "Работаем с малым бизнесом по всей Грузии — на грузинском, английском и русском."),
}


# ── helpers ────────────────────────────────────────────────────────────────────────────────────────────
def url(slug="", lang="en"):
    return f"{SITE}/{PREFIX[lang]}{slug}"


def esc(s):
    return html.escape(s, quote=True)


def ld(obj):
    return '<script type="application/ld+json">' + json.dumps(obj, ensure_ascii=False, separators=(",", ":")) + "</script>"


def business_ld(lang):
    b = BUSINESS
    o = {"@type": "ProfessionalService", "@id": url() + "#business", "name": b["name"], "url": url(),
         "logo": url("outreach-logo.svg"), "image": url("outreach-logo.svg"), "description": META[""][lang][1],
         "address": {"@type": "PostalAddress", "addressLocality": b["locality"], "addressCountry": b["country"]},
         "areaServed": {"@type": "Country", "name": b["area"]}, "priceRange": b["price_range"],
         "currenciesAccepted": "GEL", "knowsLanguage": ["ka", "en", "ru"],
         "makesOffer": [{"@type": "Offer", "name": f"{n}", "description": PLANS[lang][i][0], "price": p, "priceCurrency": "GEL",
                         "priceSpecification": {"@type": "UnitPriceSpecification", "price": p, "priceCurrency": "GEL", "billingDuration": "P1M", "unitText": "month"}}
                        for i, (n, p, _, _a, _b) in enumerate(PLAN_PRICES)]}
    if b["street"]: o["address"]["streetAddress"] = b["street"]
    if b["telephone"]: o["telephone"] = b["telephone"]
    if b["email"]: o["email"] = b["email"]
    if b["same_as"]: o["sameAs"] = b["same_as"]
    return o


def website_ld():
    return {"@type": "WebSite", "@id": url() + "#website", "url": url(), "name": "Outreach", "inLanguage": LANGS, "publisher": {"@id": url() + "#business"}}


def crumbs_ld(slug, lang):
    items = [(UI[lang]["nav"][""], url("", lang))] + ([(UI[lang]["nav"][slug], url(slug, lang))] if slug else [])
    return {"@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": i + 1, "name": n, "item": u} for i, (n, u) in enumerate(items)]}


def head(slug, lang, extra_ld=()):
    title, desc = META[slug][lang]
    graph = [website_ld(), business_ld(lang), crumbs_ld(slug, lang)] + list(extra_ld)
    alts = "".join(f'\n    <link rel="alternate" hreflang="{l}" href="{url(slug, l)}">' for l in LANGS) + f'\n    <link rel="alternate" hreflang="x-default" href="{url(slug)}">'
    og_alt = "".join(f'\n    <meta property="og:locale:alternate" content="{LOCALE[l]}">' for l in LANGS if l != lang)
    return (f'    <title>{esc(title)}</title>\n    <meta name="description" content="{esc(desc)}">\n    <meta name="robots" content="index,follow">\n'
            f'    <link rel="canonical" href="{url(slug, lang)}">{alts}\n'
            f'    <meta property="og:type" content="website">\n    <meta property="og:site_name" content="Outreach">\n'
            f'    <meta property="og:title" content="{esc(title)}">\n    <meta property="og:description" content="{esc(desc)}">\n'
            f'    <meta property="og:url" content="{url(slug, lang)}">\n    <meta property="og:locale" content="{LOCALE[lang]}">{og_alt}\n'
            f'    <meta name="twitter:card" content="summary">\n    <meta name="theme-color" content="#FAF7F2">\n'
            f'    {ld({"@context": "https://schema.org", "@graph": graph})}')


def shell(slug, lang, body, extra_ld=()):
    t = UI[lang]
    depth = slug.count("/") + (1 if lang != "en" else 0)
    up = "../" * depth                    # to the site root
    home = up + PREFIX[lang]              # to this language's home
    nav = "".join(f'<a href="{home}{s}"{" aria-current=\"page\"" if s == slug else ""}>{t["nav"][s]}</a>' for s in NAV)
    langs = "".join(f'<a href="{up}{PREFIX[l]}{slug}" hreflang="{l}" lang="{l}" title="{LANG_FULL[l]}"{" aria-current=\"true\"" if l == lang else ""}>{LANG_NAME[l]}</a>' for l in LANGS)
    crumb = (f'<nav class="crumbs" aria-label="{t["crumbs"]}"><ol><li><a href="{home}">{t["nav"][""]}</a></li>'
             f'<li aria-current="page">{t["nav"][slug]}</li></ol></nav>')
    font = f'\n    <link rel="stylesheet" href="{GEORGIAN_FONT}">' if lang == "ka" else ""
    return f"""<!doctype html>
<html lang="{lang}">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
{head(slug, lang, extra_ld)}
    <link rel="icon" type="image/svg+xml" href="{up}favicon.svg">
    <script src="{up}theme.js"></script>
    <script src="{up}liquid-glass.js"></script>
    <link rel="stylesheet" href="{up}site.css">{font}
  </head>
  <body>
    <header class="top">
      <a class="brand" href="{home}" aria-label="Outreach"><img src="{up}outreach-logo.svg" alt="Outreach" width="680" height="210"></a>
      <nav class="links" aria-label="Main">{nav}</nav>
      <nav class="langs" aria-label="{t["langs"]}">{langs}</nav>
    </header>
    <main>
      {crumb}
{body}
    </main>
    <footer class="foot">
      <p><strong>Outreach</strong> · {t["tagline"]}</p>
      <nav aria-label="Footer"><a href="{home}">{t["nav"][""]}</a>{nav}</nav>
      <p class="small">© {YEAR} Outreach</p>
    </footer>
  </body>
</html>
"""


def intro(slug, lang):
    e, h, p = INTRO[slug][lang]
    return f'      <section class="intro"><p class="eyebrow">&gt; {esc(e)}</p><h1>{esc(h)}</h1>\n        <p class="lede">{esc(p)}</p></section>'


def cta(slug, lang):
    t = UI[lang]
    home = "../" * slug.count("/")  # from a content page to this language's home
    return (f'<section class="cta"><h2>{esc(t["cta_h"])}</h2><p>{esc(t["cta_p"])}</p>'
            f'<p class="actions"><a class="btn btn--primary" href="{home}?chat=contact">{esc(t["talk"])}</a><a class="btn" href="{home}pricing/">{esc(t["see_pricing"])}</a></p></section>')


def li(items):
    return "<ul>" + "".join(f"<li>{esc(x)}</li>" for x in items) + "</ul>"


# ── pages ──────────────────────────────────────────────────────────────────────────────────────────────
def build_pages(lang):
    p = PREFIX[lang]
    # services
    s = "services/"
    cards = "".join(f'<article class="card"><h2>{esc(a)}</h2><p>{esc(b)}</p>{li(c)}</article>' for a, b, c in SERVICES[lang])
    svc_ld = {"@type": "ItemList", "name": META[s][lang][0], "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "item": {"@type": "Service", "name": a, "description": b, "serviceType": "Web design and hosting",
                                                          "provider": {"@id": url() + "#business"}, "areaServed": {"@type": "Country", "name": "Georgia"}}}
        for i, (a, b, _) in enumerate(SERVICES[lang])]}
    write(p + s + "index.html", shell(s, lang, f'{intro(s, lang)}\n      <section class="grid">{cards}</section>\n      {cta(s, lang)}', [svc_ld]))

    # how it works + FAQ
    s = "how-it-works/"
    steps = "".join(f'<li class="step"><span class="num">{i + 1:02d}</span><div><h2>{esc(a)}</h2><p>{esc(b)}</p></div></li>' for i, (a, b) in enumerate(STEPS[lang]))
    faq = "".join(f'<details><summary>{esc(q)}</summary><p>{esc(a)}</p></details>' for q, a in FAQ[lang])
    faq_ld = {"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in FAQ[lang]]}
    howto_ld = {"@type": "HowTo", "name": INTRO[s][lang][1], "step": [{"@type": "HowToStep", "position": i + 1, "name": a, "text": b} for i, (a, b) in enumerate(STEPS[lang])]}
    write(p + s + "index.html", shell(s, lang, f'{intro(s, lang)}\n      <ol class="steps">{steps}</ol>\n'
                                            f'      <section class="faq"><h2>{esc(UI[lang]["questions"])}</h2>{faq}</section>\n      {cta(s, lang)}', [howto_ld, faq_ld]))

    # pricing
    s = "pricing/"
    t = UI[lang]
    plans = "".join(
        f'<article class="card plan{" plan--lead" if n == "PLUS" else ""}"><h2>{n} <span class="plan__tag">{esc(PLAN_TAG[lang][i])}</span></h2>'
        f'<p class="price"><strong>{pr} ₾</strong> {esc(t["month"])}</p>'
        f'<p>{esc(PLANS[lang][i][0])}</p>{li(PLANS[lang][i][1])}'
        f'<p class="small">{esc(t["setup"].format(n=su))}</p>'
        f'<p class="small">{yr:,} ₾ {esc(t["year"])}{" · " + esc(t["setup_free"]) if n == "BASIC" else " · −10%"}</p>'
        f'<p class="small">{esc(t["buyout"])}: <strong>{bo:,} ₾</strong></p></article>'
        for i, (n, pr, su, yr, bo) in enumerate(PLAN_PRICES))
    every = f'<section class="note"><h2>{esc(t["in_every"])}</h2><ul class="ticks">' + \
            "".join(f"<li>{esc(x)}</li>" for x in INCLUDED[lang]) + "</ul></section>"
    rows, seen = "", None
    for group, label, cells in MATRIX[lang]:
        if group != seen:
            rows += f'<tr class="matrix__group"><th colspan="5" scope="colgroup">{esc(group)}</th></tr>'
            seen = group
        tds = "".join(f'<td data-plan="{PLAN_PRICES[j][0]}">' +
                      ('<span class="yes" aria-label="yes">✓</span>' if c == "+" else
                       '<span class="no" aria-label="no">—</span>' if c == "-" else esc(c)) + "</td>"
                      for j, c in enumerate(cells))
        rows += f'<tr><th scope="row">{esc(label)}</th>{tds}</tr>'
    heads = "".join(f'<th scope="col">{n}</th>' for n, *_ in PLAN_PRICES)
    matrix = (f'<section class="matrix"><h2>{esc(t["compare"])}</h2><div class="matrix__scroll">'
              f'<table><thead><tr><th scope="col">{esc(t["plan"])}</th>{heads}</tr></thead><tbody>{rows}</tbody></table>'
              f'</div></section>')
    terms = '<section class="grid grid--two terms">' + "".join(
        f'<article class="card"><h2>{esc(h)}</h2>' + "".join(f"<p>{esc(x)}</p>" for x in ps) + "</article>"
        for h, ps in TERMS[lang]) + "</section>"
    cat_ld = {"@type": "OfferCatalog", "name": META[s][lang][0], "itemListElement": [
        {"@type": "Offer", "name": n, "description": PLANS[lang][i][0] + " " + ", ".join(PLANS[lang][i][1]) + ".", "price": pr, "priceCurrency": "GEL", "url": url(s, lang),
         "priceSpecification": [{"@type": "UnitPriceSpecification", "price": pr, "priceCurrency": "GEL", "billingDuration": "P1M", "unitText": "month"},
                                {"@type": "UnitPriceSpecification", "price": su, "priceCurrency": "GEL", "name": "Setup"},
                                {"@type": "UnitPriceSpecification", "price": yr, "priceCurrency": "GEL", "billingDuration": "P1Y", "unitText": "year"}],
         "seller": {"@id": url() + "#business"}} for i, (n, pr, su, yr, bo) in enumerate(PLAN_PRICES)]}
    write(p + s + "index.html", shell(s, lang, f'{intro(s, lang)}\n      <section class="grid grid--plans">{plans}</section>\n'
                                            f'      {every}\n      {matrix}\n      {terms}\n'
                                            f'      <section class="note"><h2>{esc(t["own"])}</h2><p>{esc(FAQ[lang][1][1])}</p></section>\n      {cta(s, lang)}', [cat_ld]))

    # contact
    s = "contact/"
    h1, p1, b1, h2, addr, p2 = CONTACT[lang]
    home = "../"
    con_ld = {"@type": "ContactPage", "name": META[s][lang][0], "url": url(s, lang), "about": {"@id": url() + "#business"}}
    write(p + s + "index.html", shell(s, lang, f'{intro(s, lang)}\n      <section class="grid grid--two">'
                                            f'<article class="card"><h2>{esc(h1)}</h2><p>{esc(p1)}</p><p><a class="btn btn--primary" href="{home}?chat=contact">{esc(b1)}</a></p></article>'
                                            f'<article class="card"><h2>{esc(h2)}</h2><address>{addr}</address><p>{esc(p2)}</p></article></section>', [con_ld]))


def build_404():
    lines = [("en", "This page doesn't exist.", "The link may be old or mistyped.", "Back to the home page"),
             ("ka", "ეს გვერდი არ არსებობს.", "ბმული შესაძლოა მოძველებული ან არასწორია.", "მთავარ გვერდზე დაბრუნება"),
             ("ru", "Такой страницы нет.", "Возможно, ссылка устарела или в ней опечатка.", "На главную")]
    blocks = "".join(f'<div class="nf" lang="{l}"><h{1 if l == "en" else 2}>{esc(h)}</h{1 if l == "en" else 2}><p class="lede">{esc(p)}</p>'
                     f'<p class="actions"><a class="btn{" btn--primary" if l == "en" else ""}" href="/{PREFIX[l]}">{esc(b)}</a></p></div>' for l, h, p, b in lines)
    links = "".join(f'<a href="/{s}">{UI["en"]["nav"][s]}</a>' for s in NAV)
    write("404.html", f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page not found | Outreach</title>
    <meta name="description" content="This page does not exist. Go back to Outreach.">
    <meta name="robots" content="noindex,follow">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <script src="/theme.js"></script>
    <script src="/liquid-glass.js"></script>
    <link rel="stylesheet" href="/site.css">
    <link rel="stylesheet" href="{GEORGIAN_FONT}">
  </head>
  <body>
    <header class="top">
      <a class="brand" href="/" aria-label="Outreach"><img src="/outreach-logo.svg" alt="Outreach" width="680" height="210"></a>
      <nav class="links" aria-label="Main">{links}</nav>
    </header>
    <main>
      <section class="intro intro--404"><p class="eyebrow">&gt; Error 404</p>{blocks}</section>
    </main>
  </body>
</html>
""")


def build_homes():
    """index.html (English, x-default) gets the SEO block; /ka/ and /ru/ are copies with the language fixed."""
    base = (PUB / "index.html").read_text()
    for lang in LANGS:
        s = base
        block = "    <!-- seo:start -->\n" + head("", lang) + "\n    <!-- seo:end -->"
        s = re.sub(r"    <!-- seo:start -->.*?<!-- seo:end -->", lambda m: block, s, flags=re.S) if "<!-- seo:start -->" in s \
            else re.sub(r"    <title>.*?</title>", lambda m: block, s, count=1, flags=re.S)
        links = "".join(f'<a href="{s_}">{UI[lang]["nav"][s_]}</a>' for s_ in NAV)
        # no language nav in the footer: the EN / ქა / RU button at the top of the page does that job
        foot = (f'<!-- seo-foot:start --><footer class="ox-sitefoot"><p><strong>Outreach</strong> · {UI[lang]["tagline"]}</p>'
                f'<nav aria-label="Site">{links}</nav></footer><!-- seo-foot:end -->')
        s = re.sub(r"<!-- seo-foot:start -->.*?<!-- seo-foot:end -->", lambda m: foot, s, flags=re.S) if "<!-- seo-foot:start -->" in s \
            else s.replace("</body>", foot + "</body>", 1)
        s = re.sub(r'<html lang="[a-z]+"( data-lang="[a-z]+")?>', f'<html lang="{lang}"' + (f' data-lang="{lang}"' if lang != "en" else "") + ">", s, count=1)
        if lang == "en":
            (PUB / "index.html").write_text(s)
            base = s
            continue
        # one level deeper: ./x -> ../x for every local file the page loads
        s = re.sub(r'((?:src|href)=")\./', r"\1../", s)
        write(PREFIX[lang] + "index.html", s)


def build_files():
    ns = 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml"'
    rows = []
    for slug in SLUGS:
        alts = "".join(f'<xhtml:link rel="alternate" hreflang="{l}" href="{url(slug, l)}"/>' for l in LANGS) + f'<xhtml:link rel="alternate" hreflang="x-default" href="{url(slug)}"/>'
        for lang in LANGS:
            rows.append(f"  <url><loc>{url(slug, lang)}</loc><lastmod>{TODAY}</lastmod><changefreq>{'weekly' if not slug else 'monthly'}</changefreq>"
                        f"<priority>{'1.0' if not slug else '0.8'}</priority>{alts}</url>\n")
    write("sitemap.xml", f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset {ns}>\n' + "".join(rows) + "</urlset>\n")
    write("robots.txt", f"User-agent: *\nAllow: /\nDisallow: /404.html\n\nSitemap: {url('sitemap.xml')}\n")
    plans = "\n".join(f"- {n}: {p} ₾/month (setup {su} ₾, {yr:,} ₾ a year paid up front, buy outright {bo:,} ₾). "
                       f"{PLANS['en'][i][0]} Includes: {', '.join(PLANS['en'][i][1])}." for i, (n, p, su, yr, bo) in enumerate(PLAN_PRICES))
    faq = "\n".join(f"- {q} {a}" for q, a in FAQ["en"])
    pages = "\n".join(f"- [{UI['en']['nav'][s] if s else 'Home'}]({url(s)}): {META[s]['en'][1]}" for s in SLUGS)
    write("llms.txt", f"""# Outreach

> Outreach is a web studio in Tbilisi, Georgia. It designs, builds, hosts and maintains fast, mobile-ready websites for small businesses. Clients see a working demo before paying, then rent the site monthly or buy it outright. The site is available in English, Georgian ({url('', 'ka')}) and Russian ({url('', 'ru')}).

## Pages

{pages}

## Plans

{plans}

Monthly billing, minimum term 3 months, then 30 days notice. Setup charged once. Hosting, SSL, daily backups, search engine basics and changes included. No hourly billing.

## FAQ

{faq}
""")
    write("_headers", """/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/*.html
  Cache-Control: public, max-age=0, must-revalidate

/sitemap.xml
  Content-Type: application/xml; charset=utf-8

/llms.txt
  Content-Type: text/plain; charset=utf-8
""")


def minify_scripts():
    """site-src/*.js (readable) -> public/*.js (minified). Uses terser if available, else copies."""
    terser = shutil.which("terser") or str(pathlib.Path.home() / ".cache/outreach-min/node_modules/.bin/terser")
    for f in sorted(SRC.glob("*.js")):
        out = PUB / f.name
        try:
            subprocess.run([terser, str(f), "--compress", "--mangle", "--comments", "false", "-o", str(out)], check=True, capture_output=True)
        except Exception:
            shutil.copyfile(f, out)
        print(f"  {f.name}: {f.stat().st_size} -> {out.stat().st_size} bytes")


def write(rel, text):
    path = PUB / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text)
    print("  wrote", rel)


if __name__ == "__main__":
    for lang in LANGS:
        build_pages(lang)
    build_404(); build_homes(); build_files(); minify_scripts()
