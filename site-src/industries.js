// "Built for real businesses": a pinned section after "What we do". Scrolling down moves a row of example
// websites sideways; the card in the middle comes forward. Each card holds a complete one-page website,
// laid out at real desktop (or phone) width and scaled into a browser frame, and it scrolls through that
// page as the card crosses the screen. "View the full site" opens the same page at real size.
// Texts follow the site language (window.__oxLang from lang.js).
(() => {
  const L = ['en', 'ka', 'ru'].includes(window.__oxLang) ? window.__oxLang : 'en';
  const t = (o) => (o && typeof o === 'object' ? o[L] || o.en : o);

  const HEAD = {
    eyebrow: { en: '> Built for real businesses', ka: '> ნამდვილი ბიზნესებისთვის', ru: '> Для настоящего бизнеса' },
    title: { en: 'Every business gets <span class="ox-grad">its own site.</span>', ka: 'ყველა ბიზნესს — <span class="ox-grad">საკუთარი საიტი.</span>', ru: 'Каждому бизнесу — <span class="ox-grad">свой сайт.</span>' },
    lede: { en: 'Eight example sites, built the way we build yours. Open any of them at full size.', ka: 'რვა სანიმუშო საიტი, აწყობილი ისე, როგორც თქვენსას ავაწყობთ. ნებისმიერი გახსენით სრული ზომით.', ru: 'Восемь примеров, сделанных так же, как мы сделаем ваш. Любой можно открыть целиком.' },
    example: { en: 'Example', ka: 'მაგალითი', ru: 'Пример' },
    open: { en: 'View the full site', ka: 'სრული საიტის ნახვა', ru: 'Открыть сайт целиком' },
    close: { en: 'Close', ka: 'დახურვა', ru: 'Закрыть' },
    demo: { en: 'Example site by Outreach — the business is invented.', ka: 'სანიმუშო საიტი Outreach-ისგან — ბიზნესი გამოგონილია.', ru: 'Пример сайта от Outreach — бизнес вымышленный.' },
    want: { en: 'Want one like this?', ka: 'გინდათ ასეთი?', ru: 'Хотите такой же?' },
  };

  // Words the example websites share, so eight sites don't need eight translation tables for "Contact".
  const W = {
    home: { en: 'Home', ka: 'მთავარი', ru: 'Главная' },
    shop: { en: 'Shop', ka: 'მაღაზია', ru: 'Магазин' },
    menu: { en: 'Menu', ka: 'მენიუ', ru: 'Меню' },
    services: { en: 'Services', ka: 'სერვისები', ru: 'Услуги' },
    prices: { en: 'Prices', ka: 'ფასები', ru: 'Цены' },
    booking: { en: 'Booking', ka: 'ჯავშანი', ru: 'Бронь' },
    gallery: { en: 'Gallery', ka: 'გალერეა', ru: 'Галерея' },
    rooms: { en: 'Rooms', ka: 'ოთახები', ru: 'Номера' },
    classes: { en: 'Classes', ka: 'ვარჯიშები', ru: 'Занятия' },
    delivery: { en: 'Delivery', ka: 'მიწოდება', ru: 'Доставка' },
    about: { en: 'About', ka: 'ჩვენ შესახებ', ru: 'О нас' },
    contact: { en: 'Contact', ka: 'კონტაქტი', ru: 'Контакты' },
    reviews: { en: 'What guests say', ka: 'რას ამბობენ სტუმრები', ru: 'Что говорят гости' },
    google: { en: 'reviews on Google', ka: 'შეფასება Google-ზე', ru: 'отзывов в Google' },
    today: { en: 'Open today', ka: 'დღეს ღიაა', ru: 'Сегодня открыто' },
    hours: { en: 'Opening hours', ka: 'სამუშაო საათები', ru: 'Часы работы' },
    daily: { en: 'Every day', ka: 'ყოველდღე', ru: 'Ежедневно' },
    find: { en: 'Find us', ka: 'როგორ მოგვაგნოთ', ru: 'Как нас найти' },
    rights: { en: 'All rights reserved.', ka: 'ყველა უფლება დაცულია.', ru: 'Все права защищены.' },
  };
  const CITY = { en: 'Tbilisi', ka: 'თბილისი', ru: 'Тбилиси' };
  const SERIF = '"Iowan Old Style","Palatino Linotype",Palatino,Georgia,"Noto Serif Georgian",serif';
  const SANS = 'Inter,system-ui,-apple-system,"Segoe UI","Noto Sans Georgian",sans-serif';
  const it = (en, ka, ru, den, dka, dru, price) => ({ name: { en, ka, ru }, desc: { en: den, ka: dka, ru: dru }, price });
  const rv = (en, ka, ru, who) => ({ text: { en, ka, ru }, who });

  // c = [accent, page background, second colour, text]; font = the brand's headline face
  const BIZ = [
    { id: 'flowers', brand: 'Bloom & Petal', font: SERIF, c: ['#c2416b', '#fff8f6', '#3c7a52', '#2b1a20'],
      url: 'bloomandpetal.ge', nav: ['shop', 'delivery', 'about', 'contact'], more: 'shop', hours: '09:00 – 21:00', rating: '4.9', count: 318,
      area: { en: 'Vake', ka: 'ვაკე', ru: 'Ваке' },
      type: { en: 'Flower shop', ka: 'ყვავილების მაღაზია', ru: 'Цветочный магазин' },
      note: { en: 'Order by 4 pm for delivery across Tbilisi today', ka: 'შეუკვეთეთ 16:00-მდე — მიწოდება თბილისში დღესვე', ru: 'Закажите до 16:00 — доставим по Тбилиси сегодня' },
      head: { en: 'Fresh flowers, delivered today.', ka: 'ახალი ყვავილები, მიწოდება დღესვე.', ru: 'Свежие цветы с доставкой сегодня.' },
      sub: { en: 'Seasonal bouquets wrapped by hand every morning, from a small studio in Vake.', ka: 'სეზონური თაიგულები, ყოველ დილით ხელით შეკრული, პატარა სტუდიიდან ვაკეში.', ru: 'Сезонные букеты, собранные вручную каждое утро в маленькой студии в Ваке.' },
      btn: { en: 'Order a bouquet', ka: 'თაიგულის შეკვეთა', ru: 'Заказать букет' },
      stats: [['2 h', { en: 'average delivery', ka: 'საშუალო მიწოდება', ru: 'средняя доставка' }], ['40+', { en: 'flowers in season', ka: 'სეზონური ყვავილი', ru: 'сезонных цветов' }], ['6 yrs', { en: 'in Vake', ka: 'ვაკეში', ru: 'в Ваке' }]],
      grid: { en: 'This week’s bouquets', ka: 'ამ კვირის თაიგულები', ru: 'Букеты этой недели' },
      items: [it('Rose bouquet', 'ვარდების თაიგული', 'Букет роз', 'Fifteen garden roses', 'თხუთმეტი ბაღის ვარდი', 'Пятнадцать садовых роз', '45 ₾'),
        it('Peony box', 'პიონები ყუთში', 'Пионы в коробке', 'Peonies in a keepsake box', 'პიონები საჩუქრის ყუთში', 'Пионы в подарочной коробке', '80 ₾'),
        it('Dried bunch', 'ხმელი ყვავილები', 'Сухоцветы', 'Lasts the whole winter', 'მთელი ზამთარი ძლებს', 'Простоит всю зиму', '35 ₾'),
        it('Tulip armful', 'ტიტების თაიგული', 'Охапка тюльпанов', 'Twenty-five tulips', 'ოცდახუთი ტიტა', 'Двадцать пять тюльпанов', '55 ₾'),
        it('Wedding posy', 'საქორწილო თაიგული', 'Свадебный букет', 'Made to your colours', 'თქვენს ფერებში', 'В ваших цветах', '120 ₾'),
        it('Plant of the month', 'თვის მცენარე', 'Растение месяца', 'Potted, with care card', 'ქოთანში, მოვლის ბარათით', 'В горшке, с карточкой ухода', '38 ₾')],
      about: { en: 'A florist, not a warehouse.', ka: 'ფლორისტი, და არა საწყობი.', ru: 'Флорист, а не склад.' },
      story: { en: 'We buy at the market at six, wrap by nine and deliver until evening. Every bouquet is photographed before it leaves, so you see exactly what arrived.', ka: 'ბაზარზე დილის ექვსზე ვყიდულობთ, ცხრისთვის ვკრავთ და საღამომდე ვატარებთ. ყოველ თაიგულს გაგზავნამდე ვიღებთ, ასე რომ ზუსტად ხედავთ, რა მივიდა.', ru: 'Покупаем на рынке в шесть, собираем к девяти и возим до вечера. Каждый букет фотографируем перед отправкой — вы видите, что именно доставлено.' },
      reviews: [rv('The peonies lasted almost two weeks. Ordered at noon, at the door by three.', 'პიონები თითქმის ორი კვირა გაძლო. შუადღისას შევუკვეთე, სამზე უკვე კართან იყო.', 'Пионы простояли почти две недели. Заказала в полдень, в три уже были у двери.', 'Nino K.'),
        rv('They sent a photo before delivery — exactly what I wanted for my mother.', 'მიწოდებამდე ფოტო გამომიგზავნეს — ზუსტად ის, რაც დედაჩემისთვის მინდოდა.', 'Прислали фото перед доставкой — именно то, что я хотел для мамы.', 'Levan T.')] },

    { id: 'restaurant', brand: 'Terrace Kitchen', font: SERIF, c: ['#a8842f', '#f6f2ea', '#1f4d3a', '#1f2a24'],
      url: 'terracekitchen.ge', nav: ['menu', 'booking', 'about', 'contact'], more: 'menu', hours: '12:00 – 23:00', rating: '4.8', count: 642,
      area: { en: 'Sololaki', ka: 'სოლოლაკი', ru: 'Сололаки' },
      type: { en: 'Restaurant', ka: 'რესტორანი', ru: 'Ресторан' },
      note: { en: 'Live music on the terrace every Friday from 8 pm', ka: 'ცოცხალი მუსიკა ტერასაზე ყოველ პარასკევს 20:00-დან', ru: 'Живая музыка на террасе каждую пятницу с 20:00' },
      head: { en: 'A table with a view, tonight.', ka: 'მაგიდა ხედით, დღეს საღამოს.', ru: 'Столик с видом — сегодня вечером.' },
      sub: { en: 'Georgian cooking from the clay oven, natural wine from small cellars, and the old town at your feet.', ka: 'ქართული სამზარეულო თონიდან, ნატურალური ღვინო პატარა მარნებიდან და ძველი ქალაქი ფეხქვეშ.', ru: 'Грузинская кухня из глиняной печи, натуральное вино малых марани и старый город у ваших ног.' },
      btn: { en: 'Book a table', ka: 'მაგიდის დაჯავშნა', ru: 'Забронировать столик' },
      stats: [['60', { en: 'seats on the terrace', ka: 'ადგილი ტერასაზე', ru: 'мест на террасе' }], ['35', { en: 'wines by the glass', ka: 'ღვინო ჭიქით', ru: 'вин по бокалам' }], ['1 min', { en: 'to book online', ka: 'ონლაინ ჯავშანი', ru: 'на онлайн-бронь' }]],
      grid: { en: 'From the menu', ka: 'მენიუდან', ru: 'Из меню' },
      items: [it('Khachapuri', 'ხაჭაპური', 'Хачапури', 'Imeretian, from the oven', 'იმერული, თონიდან', 'Имеретинский, из печи', '18 ₾'),
        it('Grilled trout', 'კალმახი გრილზე', 'Форель на гриле', 'With tarragon and lemon', 'ტარხუნით და ლიმონით', 'С тархуном и лимоном', '32 ₾'),
        it('Glass of wine', 'ღვინო, ჭიქა', 'Бокал вина', 'Saperavi or Rkatsiteli', 'საფერავი ან რქაწითელი', 'Саперави или Ркацители', '12 ₾'),
        it('Pkhali trio', 'ფხალეულის ტრიო', 'Трио пхали', 'Spinach, beet, leek', 'ისპანახი, ჭარხალი, პრასი', 'Шпинат, свёкла, лук-порей', '16 ₾'),
        it('Mtsvadi', 'მწვადი', 'Мцвади', 'Pork on vine embers', 'ღორის ხორცი ვაზის ნაკვერჩხალზე', 'Свинина на лозовых углях', '28 ₾'),
        it('Churchkhela sundae', 'ჩურჩხელის ნაყინი', 'Мороженое с чурчхелой', 'Our one dessert rule-break', 'ჩვენი ერთადერთი დესერტ-ექსპერიმენტი', 'Наш единственный десертный эксперимент', '14 ₾')],
      about: { en: 'Cooked over vine wood.', ka: 'ვაზის შეშაზე მომზადებული.', ru: 'Приготовлено на лозе.' },
      story: { en: 'A family kitchen on a Sololaki rooftop. The menu changes with the market; the view of Narikala does not.', ka: 'საოჯახო სამზარეულო სოლოლაკის სახურავზე. მენიუ ბაზართან ერთად იცვლება, ნარიყალას ხედი — არა.', ru: 'Семейная кухня на крыше в Сололаки. Меню меняется вместе с рынком, вид на Нарикалу — нет.' },
      reviews: [rv('Best khachapuri we had in Tbilisi, and the sunset over Narikala is worth the booking alone.', 'თბილისში ნაჭამი საუკეთესო ხაჭაპური, ხოლო ნარიყალაზე მზის ჩასვლა თავისთავად ღირს ჯავშნად.', 'Лучший хачапури в Тбилиси, а закат над Нарикалой стоит брони сам по себе.', 'Anna R.'),
        rv('Booked from the site in a minute, and they remembered it was our anniversary.', 'საიტიდან ერთ წუთში დავჯავშნეთ და დაიმახსოვრეს, რომ ჩვენი წლისთავი იყო.', 'Забронировали с сайта за минуту, и нас поздравили с годовщиной.', 'Giorgi M.')] },

    { id: 'pizzeria', brand: 'Forno Rosso', font: SANS, c: ['#d0352b', '#fff7ec', '#e8a92a', '#2a1410'],
      url: 'fornorosso.ge', nav: ['menu', 'delivery', 'about', 'contact'], more: 'menu', hours: '11:00 – 23:00', rating: '4.8', count: 1204,
      area: { en: 'Saburtalo', ka: 'საბურთალო', ru: 'Сабуртало' },
      type: { en: 'Pizzeria', ka: 'პიცერია', ru: 'Пиццерия' },
      note: { en: 'Free delivery on orders over 40 ₾', ka: 'უფასო მიწოდება 40 ₾-ზე მეტ შეკვეთაზე', ru: 'Бесплатная доставка от 40 ₾' },
      head: { en: 'Hot pizza in 30 minutes.', ka: 'ცხელი პიცა 30 წუთში.', ru: 'Горячая пицца за 30 минут.' },
      sub: { en: 'Dough rested for 48 hours, a 450° wood oven, and a courier who knows Saburtalo by heart.', ka: '48 საათის ცომი, 450°-იანი შეშის ღუმელი და კურიერი, რომელმაც საბურთალო ზეპირად იცის.', ru: 'Тесто 48 часов, дровяная печь на 450° и курьер, который знает Сабуртало наизусть.' },
      btn: { en: 'Order now', ka: 'შეუკვეთე ახლა', ru: 'Заказать' },
      stats: [['30 min', { en: 'or the next one is free', ka: 'ან შემდეგი უფასოა', ru: 'или следующая бесплатно' }], ['48 h', { en: 'slow-rested dough', ka: 'ნელა მომწიფებული ცომი', ru: 'выдержка теста' }], ['450°', { en: 'wood-fired oven', ka: 'შეშის ღუმელი', ru: 'дровяная печь' }]],
      grid: { en: 'Out of the oven', ka: 'ღუმელიდან', ru: 'Из печи' },
      items: [it('Margherita', 'მარგარიტა', 'Маргарита', 'Tomato, fior di latte, basil', 'პომიდორი, მოცარელა, რეჰანი', 'Томаты, моцарелла, базилик', '22 ₾'),
        it('Diavola', 'დიავოლა', 'Дьявола', 'Spicy salami, chilli honey', 'ცხარე სალამი, წიწაკის თაფლი', 'Острая салями, мёд с чили', '28 ₾'),
        it('Calzone', 'კალცონე', 'Кальцоне', 'Ricotta, ham, mushrooms', 'რიკოტა, ლორი, სოკო', 'Рикотта, ветчина, грибы', '26 ₾'),
        it('Quattro formaggi', 'ოთხი ყველი', 'Четыре сыра', 'With Georgian sulguni', 'ქართული სულგუნით', 'С грузинским сулугуни', '29 ₾'),
        it('Funghi', 'ფუნგი', 'Фунги', 'Wild mushrooms, thyme', 'ტყის სოკო, ბეგქონდარა', 'Лесные грибы, тимьян', '25 ₾'),
        it('Tiramisu', 'ტირამისუ', 'Тирамису', 'Made every morning', 'ყოველ დილით მზადდება', 'Готовим каждое утро', '12 ₾')],
      about: { en: 'Neapolitan rules, Tbilisi flour.', ka: 'ნეაპოლიტანური წესები, თბილისური ფქვილი.', ru: 'Неаполитанские правила, тбилисская мука.' },
      story: { en: 'Two friends, one oven and a recipe brought back from Naples. Track your pizza from the oven to your door.', ka: 'ორი მეგობარი, ერთი ღუმელი და ნეაპოლიდან ჩამოტანილი რეცეპტი. თვალი ადევნეთ პიცას ღუმელიდან კარამდე.', ru: 'Двое друзей, одна печь и рецепт из Неаполя. Следите за пиццей от печи до двери.' },
      reviews: [rv('Arrived in 24 minutes and still blistered from the oven. The diavola is dangerous.', '24 წუთში მოვიდა და ჯერ კიდევ ცხელი იყო. დიავოლა საშიშად გემრიელია.', 'Привезли за 24 минуты, ещё с пылу с жару. Дьявола — опасно вкусная.', 'Saba L.'),
        rv('Ordering from the site is quicker than calling, and I can pay by card.', 'საიტიდან შეკვეთა დარეკვაზე სწრაფია და ბარათით ვიხდი.', 'Заказать на сайте быстрее, чем звонить, и можно оплатить картой.', 'Mariam G.')] },

    { id: 'detailing', brand: 'Gloss Garage', font: SANS, dark: true, c: ['#38bdf8', '#0d1320', '#94a3b8', '#e6edf6'],
      url: 'glossgarage.ge', nav: ['services', 'prices', 'gallery', 'booking'], more: 'prices', hours: '09:00 – 20:00', rating: '5.0', count: 187,
      area: { en: 'Didube', ka: 'დიდუბე', ru: 'Дидубе' },
      type: { en: 'Car detailing', ka: 'ავტო დითეილინგი', ru: 'Детейлинг' },
      note: { en: 'Ceramic coating this month with a free interior clean', ka: 'კერამიკული საფარი ამ თვეში — სალონის წმენდა საჩუქრად', ru: 'Керамика в этом месяце — химчистка салона в подарок' },
      head: { en: 'Showroom shine, booked in a minute.', ka: 'სალონის ბრწყინვალება, ჩაწერა ერთ წუთში.', ru: 'Блеск как из салона — запись за минуту.' },
      sub: { en: 'Hand wash, paint correction and ceramic protection, done in a heated studio by people who love cars.', ka: 'ხელით რეცხვა, საღებავის კორექცია და კერამიკული დაცვა — თბილ სტუდიაში, მანქანების მოყვარულების მიერ.', ru: 'Ручная мойка, полировка и керамика в тёплой студии — от людей, которые любят машины.' },
      btn: { en: 'Book a wash', ka: 'ჩაწერა', ru: 'Записаться' },
      stats: [['3,000+', { en: 'cars detailed', ka: 'გაწმენდილი მანქანა', ru: 'машин после нас' }], ['5 yr', { en: 'coating warranty', ka: 'საფარის გარანტია', ru: 'гарантия на покрытие' }], ['4', { en: 'bays, no queue', ka: 'ბოქსი, რიგის გარეშე', ru: 'бокса, без очереди' }]],
      grid: { en: 'Services & prices', ka: 'სერვისები და ფასები', ru: 'Услуги и цены' },
      items: [it('Exterior wash', 'გარე რეცხვა', 'Мойка кузова', 'Two-bucket hand wash', 'ორვედროიანი ხელით რეცხვა', 'Ручная мойка в два ведра', '60 ₾'),
        it('Interior clean', 'სალონის წმენდა', 'Химчистка салона', 'Seats, carpets, glass', 'სავარძლები, ხალიჩები, მინები', 'Сиденья, ковры, стёкла', '90 ₾'),
        it('Full detail', 'სრული დითეილინგი', 'Полный детейлинг', 'Inside and out, one day', 'შიგნით და გარეთ, ერთ დღეში', 'Внутри и снаружи, за день', '250 ₾'),
        it('Paint correction', 'საღებავის კორექცია', 'Полировка кузова', 'Swirls and scratches out', 'ნაკაწრების მოცილება', 'Убираем царапины и голограммы', '450 ₾'),
        it('Ceramic coating', 'კერამიკული საფარი', 'Керамика', 'Five-year protection', 'ხუთწლიანი დაცვა', 'Защита на пять лет', '900 ₾'),
        it('Headlight restore', 'ფარების აღდგენა', 'Восстановление фар', 'Clear as new', 'ახალივით გამჭვირვალე', 'Прозрачные как новые', '70 ₾')],
      about: { en: 'Obsessive about the details.', ka: 'დეტალებზე შეყვარებულები.', ru: 'Одержимы деталями.' },
      story: { en: 'Every car gets a before-and-after photo set, sent to your phone when it is ready to collect.', ka: 'ყოველ მანქანას აქვს „მანამდე და შემდეგ“ ფოტოები, რომლებსაც ტელეფონზე გიგზავნით, როცა მზად არის.', ru: 'Каждая машина получает фото «до и после» — присылаем на телефон, когда можно забирать.' },
      reviews: [rv('My eight-year-old car looks better than the day I bought it.', 'ჩემი რვა წლის მანქანა იმ დღეზე უკეთ გამოიყურება, როცა ვიყიდე.', 'Моя восьмилетняя машина выглядит лучше, чем в день покупки.', 'Dato B.'),
        rv('Booked online for Saturday at ten, no waiting at all.', 'ონლაინ ჩავეწერე შაბათს ათზე, საერთოდ არ მომიწია ლოდინი.', 'Записался онлайн на субботу в десять — ни минуты ожидания.', 'Irakli S.')] },

    { id: 'bakery', brand: 'Morning Crumb', font: SERIF, c: ['#b8742a', '#fbf4e8', '#7a4e33', '#2e1f14'],
      url: 'morningcrumb.ge', nav: ['menu', 'shop', 'about', 'contact'], more: 'menu', hours: '07:00 – 16:00', rating: '4.9', count: 455,
      area: { en: 'Vera', ka: 'ვერა', ru: 'Вера' },
      type: { en: 'Bakery & café', ka: 'საცხობი და კაფე', ru: 'Пекарня и кафе' },
      note: { en: 'Pre-order before 8 pm, collect from 7 am', ka: 'წინასწარ შეუკვეთეთ 20:00-მდე, წაიღეთ დილის 7-დან', ru: 'Предзаказ до 20:00, забирайте с 7 утра' },
      head: { en: 'Baked at 6 am, gone by noon.', ka: 'ცხვება დილის 6-ზე, შუადღისთვის აღარ რჩება.', ru: 'Испечено в 6 утра — раскуплено к обеду.' },
      sub: { en: 'Sourdough, laminated pastry and proper coffee in a corner bakery in Vera.', ka: 'მჟავე ცომის პური, ფენოვანი ცომეული და ნამდვილი ყავა კუთხის საცხობში, ვერაზე.', ru: 'Хлеб на закваске, слоёная выпечка и настоящий кофе в угловой пекарне на Вере.' },
      btn: { en: "Today's menu", ka: 'დღევანდელი მენიუ', ru: 'Меню на сегодня' },
      stats: [['6:00', { en: 'first loaves out', ka: 'პირველი პურები', ru: 'первые буханки' }], ['24 h', { en: 'sourdough ferment', ka: 'ცომის დუღილი', ru: 'брожение закваски' }], ['0', { en: 'preservatives', ka: 'კონსერვანტი', ru: 'консервантов' }]],
      grid: { en: 'On the counter today', ka: 'დღეს დახლზე', ru: 'Сегодня на витрине' },
      items: [it('Croissant', 'კრუასანი', 'Круассан', 'French butter, three days', 'ფრანგული კარაქი, სამი დღე', 'Французское масло, три дня', '5 ₾'),
        it('Sourdough loaf', 'მჟავე ცომის პური', 'Хлеб на закваске', 'Dark crust, open crumb', 'მუქი ქერქი, ფოროვანი გული', 'Тёмная корка, пористый мякиш', '9 ₾'),
        it('Cinnamon bun', 'დარიჩინის ფუნთუშა', 'Булочка с корицей', 'Cardamom glaze', 'ჰელის მინანქრით', 'С кардамоновой глазурью', '6 ₾'),
        it('Flat white', 'ფლეთ უაითი', 'Флэт уайт', 'Local roaster', 'ადგილობრივი მოხალვა', 'Местная обжарка', '7 ₾'),
        it('Penovani', 'პენოვანი', 'Пеновани', 'Flaky cheese pastry', 'ფენოვანი ხაჭაპური', 'Слоёный хачапури', '6 ₾'),
        it('Seed rye', 'ჭვავის პური მარცვლებით', 'Ржаной с семенами', 'Weekends only', 'მხოლოდ შაბათ-კვირას', 'Только по выходным', '10 ₾')],
      about: { en: 'Small batches, every morning.', ka: 'მცირე პარტიები, ყოველ დილით.', ru: 'Маленькими партиями, каждое утро.' },
      story: { en: 'When the counter is empty, we close. Pre-order online and your loaf waits for you with your name on it.', ka: 'როცა დახლი ცარიელდება, ვიკეტებით. შეუკვეთეთ ონლაინ და თქვენი პური თქვენი სახელით დაგელოდებათ.', ru: 'Когда витрина пустеет, мы закрываемся. Сделайте предзаказ — ваш хлеб будет ждать с вашим именем.' },
      reviews: [rv('The croissants sell out by ten, so I pre-order the night before. Worth it.', 'კრუასანები ათისთვის თავდება, ამიტომ წინა საღამოს ვუკვეთავ. ღირს.', 'Круассаны заканчиваются к десяти, так что заказываю с вечера. Оно того стоит.', 'Tamar D.'),
        rv('Real sourdough, the kind I used to bring back from Berlin.', 'ნამდვილი მჟავე ცომის პური, ისეთი, ბერლინიდან რომ ჩამომქონდა.', 'Настоящая закваска — как та, что я возил из Берлина.', 'Alexei P.')] },

    { id: 'salon', brand: 'Studio Velvet', font: SERIF, c: ['#6d3bd8', '#faf6ff', '#d9629d', '#24123d'],
      url: 'studiovelvet.ge', nav: ['services', 'prices', 'gallery', 'booking'], more: 'prices', hours: '10:00 – 20:00', rating: '4.9', count: 529,
      area: { en: 'Vake', ka: 'ვაკე', ru: 'Ваке' },
      type: { en: 'Beauty salon', ka: 'სილამაზის სალონი', ru: 'Салон красоты' },
      note: { en: 'New clients: 15% off your first colour', ka: 'ახალი კლიენტებისთვის: პირველი შეღებვა 15%-იანი ფასდაკლებით', ru: 'Новым клиентам: −15% на первое окрашивание' },
      head: { en: 'Your chair is ready.', ka: 'თქვენი სავარძელი მზადაა.', ru: 'Ваше кресло уже ждёт.' },
      sub: { en: 'Cuts, colour and nails by a small team of senior stylists. Pick your stylist and your time online.', ka: 'შეჭრა, შეღებვა და ფრჩხილები გამოცდილი სტილისტების პატარა გუნდისგან. აირჩიეთ სტილისტი და დრო ონლაინ.', ru: 'Стрижки, окрашивание и ногти от небольшой команды опытных мастеров. Выберите мастера и время онлайн.' },
      btn: { en: 'Pick a time', ka: 'აირჩიე დრო', ru: 'Выбрать время' },
      stats: [['7', { en: 'senior stylists', ka: 'გამოცდილი სტილისტი', ru: 'опытных мастеров' }], ['24/7', { en: 'online booking', ka: 'ონლაინ ჯავშანი', ru: 'онлайн-запись' }], ['SMS', { en: 'reminder the day before', ka: 'შეხსენება წინა დღეს', ru: 'напоминание накануне' }]],
      grid: { en: 'Services', ka: 'სერვისები', ru: 'Услуги' },
      items: [it('Haircut', 'შეჭრა', 'Стрижка', 'Wash, cut and style', 'დაბანა, შეჭრა, დავარცხნა', 'Мытьё, стрижка, укладка', '50 ₾'),
        it('Colour', 'შეღებვა', 'Окрашивание', 'Single process, gloss', 'ერთფეროვანი, გლოსი', 'В один тон, глосс', '140 ₾'),
        it('Manicure', 'მანიკური', 'Маникюр', 'Gel, any colour', 'გელი, ნებისმიერი ფერი', 'Гель, любой цвет', '40 ₾'),
        it('Balayage', 'ბალაიაჟი', 'Балаяж', 'Hand-painted highlights', 'ხელით დატანილი ელფერი', 'Ручное мелирование', '260 ₾'),
        it('Blow-dry', 'ფენით დავარცხნა', 'Укладка феном', 'Smooth or volume', 'გლუვი ან მოცულობითი', 'Гладкая или объёмная', '35 ₾'),
        it('Brows & lashes', 'წარბები და წამწამები', 'Брови и ресницы', 'Shape and tint', 'ფორმა და შეღებვა', 'Форма и окрашивание', '45 ₾')],
      about: { en: 'Unhurried appointments.', ka: 'აუჩქარებელი ვიზიტები.', ru: 'Без спешки.' },
      story: { en: 'We book one client per stylist at a time, with coffee and a proper consultation before anything is cut.', ka: 'ერთ სტილისტთან ერთდროულად ერთ კლიენტს ვწერთ — ყავით და კონსულტაციით, სანამ რამეს შევჭრით.', ru: 'Один клиент на мастера за раз, с кофе и консультацией, прежде чем что-то стричь.' },
      reviews: [rv('Finally a salon that listens. My colour is exactly what I showed them.', 'ბოლოს და ბოლოს სალონი, რომელიც გისმენს. ფერი ზუსტად ისაა, რაც ვაჩვენე.', 'Наконец салон, который слушает. Цвет ровно такой, как я показала.', 'Ketevan A.'),
        rv('Booking online at midnight and getting a reminder — so easy.', 'შუაღამისას ონლაინ ჩაწერა და შეხსენების მიღება — ძალიან მარტივია.', 'Записалась онлайн в полночь и получила напоминание — очень удобно.', 'Elena V.')] },

    { id: 'guesthouse', brand: 'Old Town Rooms', font: SERIF, c: ['#2257c9', '#f3f6fc', '#d99211', '#14213d'],
      url: 'oldtownrooms.ge', nav: ['rooms', 'gallery', 'about', 'booking'], more: 'rooms', hours: '08:00 – 22:00', rating: '9.4', count: 873,
      area: { en: 'Old Tbilisi', ka: 'ძველი თბილისი', ru: 'Старый Тбилиси' },
      type: { en: 'Guesthouse', ka: 'სასტუმრო', ru: 'Гостевой дом' },
      note: { en: 'Book direct and breakfast is on us', ka: 'დაჯავშნეთ პირდაპირ და საუზმე ჩვენზეა', ru: 'Бронируйте напрямую — завтрак за наш счёт' },
      head: { en: 'Wake up in the old town.', ka: 'გაიღვიძეთ ძველ ქალაქში.', ru: 'Просыпайтесь в старом городе.' },
      sub: { en: 'Six rooms in a restored 19th-century house with a carved balcony, five minutes from the sulphur baths.', ka: 'ექვსი ოთახი აღდგენილ XIX საუკუნის სახლში, მოჩუქურთმებული აივნით, აბანოებიდან ხუთ წუთში.', ru: 'Шесть номеров в отреставрированном доме XIX века с резным балконом, в пяти минутах от серных бань.' },
      btn: { en: 'Check dates', ka: 'თარიღების ნახვა', ru: 'Проверить даты' },
      stats: [['6', { en: 'rooms, all en-suite', ka: 'ოთახი, ყველა სველი წერტილით', ru: 'номеров с ванной' }], ['5 min', { en: 'to the sulphur baths', ka: 'აბანოებამდე', ru: 'до серных бань' }], ['3', { en: 'languages spoken', ka: 'ენა', ru: 'языка общения' }]],
      grid: { en: 'Rooms', ka: 'ოთახები', ru: 'Номера' },
      items: [it('Double room', 'ორადგილიანი ოთახი', 'Двухместный номер', 'Queen bed, courtyard view', 'ორადგილიანი საწოლი, ეზოს ხედი', 'Кровать queen, вид во двор', '180 ₾'),
        it('Family room', 'საოჯახო ოთახი', 'Семейный номер', 'Sleeps four', 'ოთხი სტუმრისთვის', 'Для четверых', '260 ₾'),
        it('Studio', 'სტუდია', 'Студия', 'Kitchenette, balcony', 'პატარა სამზარეულო, აივანი', 'Мини-кухня, балкон', '220 ₾'),
        it('Single room', 'ერთადგილიანი ოთახი', 'Одноместный номер', 'Quiet, top floor', 'მყუდრო, ბოლო სართული', 'Тихий, верхний этаж', '120 ₾'),
        it('Balcony suite', 'ლუქსი აივნით', 'Люкс с балконом', 'The carved balcony', 'მოჩუქურთმებული აივანი', 'Тот самый резной балкон', '320 ₾'),
        it('Airport pickup', 'აეროპორტიდან წამოყვანა', 'Трансфер из аэропорта', 'Any hour', 'ნებისმიერ დროს', 'В любое время', '60 ₾')],
      about: { en: 'A house, not a hotel.', ka: 'სახლი, და არა სასტუმრო.', ru: 'Дом, а не отель.' },
      story: { en: 'Our family has lived on this street for four generations. Breakfast is made by our grandmother, and the map we give you is hand-drawn.', ka: 'ჩვენი ოჯახი ამ ქუჩაზე ოთხი თაობაა ცხოვრობს. საუზმეს ბებია ამზადებს, რუკას კი ხელით ვხატავთ.', ru: 'Наша семья живёт на этой улице четыре поколения. Завтрак готовит бабушка, а карту мы рисуем от руки.' },
      reviews: [rv('The balcony suite at sunrise is something else. Breakfast was enormous.', 'ლუქსის აივანი მზის ამოსვლისას განსაკუთრებულია. საუზმე უზარმაზარი იყო.', 'Люкс с балконом на рассвете — это нечто. Завтрак огромный.', 'Sophie L.'),
        rv('Booked direct on their site — cheaper and they picked us up at 3 am.', 'პირდაპირ მათ საიტზე დავჯავშნეთ — უფრო იაფი იყო და ღამის სამზე დაგვხვდნენ.', 'Бронировали прямо на сайте — дешевле, и нас встретили в три ночи.', 'Mark H.')] },

    { id: 'fitness', brand: 'Pulse Gym', font: SANS, dark: true, c: ['#a3e635', '#0b0f0a', '#65a30d', '#ecfccb'],
      url: 'pulsegym.ge', nav: ['classes', 'prices', 'about', 'booking'], more: 'classes', hours: '07:00 – 23:00', rating: '4.8', count: 366,
      area: { en: 'Saburtalo', ka: 'საბურთალო', ru: 'Сабуртало' },
      type: { en: 'Fitness studio', ka: 'ფიტნეს სტუდია', ru: 'Фитнес-студия' },
      note: { en: 'Your first class is free — no card needed', ka: 'პირველი ვარჯიში უფასოა — ბარათი არ გჭირდებათ', ru: 'Первое занятие бесплатно — карта не нужна' },
      head: { en: 'First class is on us.', ka: 'პირველი ვარჯიში უფასოა.', ru: 'Первое занятие — бесплатно.' },
      sub: { en: 'Strength, conditioning and mobility classes of twelve people or fewer, coached properly.', ka: 'ძალის, გამძლეობის და მოქნილობის ვარჯიშები არაუმეტეს თორმეტ კაციან ჯგუფებში, სწორი მწვრთნელით.', ru: 'Силовые, функциональные занятия и мобильность в группах до двенадцати человек — с нормальным тренером.' },
      btn: { en: 'Join a class', ka: 'ჩაეწერე', ru: 'Записаться' },
      stats: [['12', { en: 'people per class, max', ka: 'კაცი ჯგუფში, მაქს.', ru: 'человек в группе, макс.' }], ['40+', { en: 'classes a week', ka: 'ვარჯიში კვირაში', ru: 'занятий в неделю' }], ['07–23', { en: 'open every day', ka: 'ღიაა ყოველდღე', ru: 'открыто ежедневно' }]],
      grid: { en: 'Memberships', ka: 'აბონემენტები', ru: 'Абонементы' },
      items: [it('Day pass', 'ერთდღიანი ბილეთი', 'Разовое занятие', 'Any class, one day', 'ნებისმიერი ვარჯიში, ერთი დღე', 'Любое занятие, один день', '20 ₾'),
        it('Monthly pass', 'თვიური აბონემენტი', 'Абонемент на месяц', 'Unlimited classes', 'ულიმიტო ვარჯიში', 'Безлимит занятий', '120 ₾'),
        it('Personal training', 'პერსონალური ვარჯიში', 'Персональная тренировка', 'One hour, one coach', 'ერთი საათი, ერთი მწვრთნელი', 'Час с тренером', '60 ₾'),
        it('Strength', 'ძალის ვარჯიში', 'Силовая', 'Barbell basics', 'შტანგის საფუძვლები', 'Основы со штангой', '—'),
        it('Conditioning', 'გამძლეობა', 'Функционал', 'Forty minutes, hard', 'ორმოცი წუთი, ინტენსიური', 'Сорок минут, интенсивно', '—'),
        it('Mobility', 'მოქნილობა', 'Мобильность', 'Sunday reset', 'კვირადღის განტვირთვა', 'Воскресная перезагрузка', '—')],
      about: { en: 'Coaching, not just equipment.', ka: 'მწვრთნელი, და არა მხოლოდ ტრენაჟორები.', ru: 'Тренер, а не только железо.' },
      story: { en: 'Every new member starts with a free assessment and a plan. Book classes and track your visits from your phone.', ka: 'ყოველი ახალი წევრი იწყებს უფასო შეფასებით და გეგმით. ჩაეწერეთ ვარჯიშებზე და ადევნეთ თვალი ვიზიტებს ტელეფონიდან.', ru: 'Каждый новичок начинает с бесплатной оценки и плана. Записывайтесь и следите за посещениями с телефона.' },
      reviews: [rv('Small classes, coaches who correct your form. Deadlift up 30 kg in four months.', 'პატარა ჯგუფები, მწვრთნელები ტექნიკას გისწორებენ. ოთხ თვეში ასაწევი 30 კგ-ით გავზარდე.', 'Маленькие группы, тренеры правят технику. Становая +30 кг за четыре месяца.', 'Luka J.'),
        rv('I book the 7 am class from bed. Never once found it full.', 'დილის 7-ის ვარჯიშზე საწოლიდან ვეწერები. არასდროს დამხვედრია სავსე.', 'Записываюсь на 7 утра прямо из кровати. Ни разу не было мест нет.', 'Natia O.')] },
  ];
  const END = {
    title: { en: 'Your business here?', ka: 'აქ თქვენი ბიზნესი იქნება?', ru: 'Здесь будет ваш бизнес?' },
    body: { en: 'Tell us what you do. We build a demo of your site and send you the link, free.', ka: 'მოგვიყევით რას აკეთებთ. ავაწყობთ თქვენი საიტის დემოს და ბმულს უფასოდ გამოგიგზავნით.', ru: 'Расскажите, чем вы занимаетесь. Мы бесплатно сделаем демо вашего сайта и пришлём ссылку.' },
    btn: { en: 'Get a free demo ↗', ka: 'მიიღეთ უფასო დემო ↗', ru: 'Получить бесплатное демо ↗' },
  };

  const esc = (s) => String(s).replace(/[&<>"]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[m]);

  // Real photographs from public/img/demos/ (slots and subjects in the README there). build_pages.py fills
  // in the list of the ones that exist, so a slot without one shows a frame in the brand's own colours
  // and never requests a file that isn't there.
  const HAVE = new Set(/*@photos*/[]);
  const base = L === 'en' ? '' : '../';          // /ka/ and /ru/ sit one level deeper
  const photo = (file) => (HAVE.has(file) ? `<img src="${base}img/demos/${file}.webp" alt="" loading="lazy" decoding="async">` : '');
  const stars = '<span class="ds-stars" aria-hidden="true">★★★★★</span>';

  // One complete page for one business. `w` is the width it is laid out at; the page's own container
  // queries pick the phone or desktop layout from it.
  const page = (b) => {
    const [acc, bg, sec, fg] = b.c;
    const nav = b.nav.map((k) => `<a>${esc(t(W[k]))}</a>`).join('');
    const items = b.items.map((o, j) => `
      <article class="ds-item">
        <figure class="ds-ph">${photo(`${b.id}-${j + 1}`)}</figure>
        <div class="ds-item__txt"><h4>${esc(t(o.name))}</h4><p>${esc(t(o.desc))}</p></div>
        <strong>${esc(o.price)}</strong>
      </article>`).join('');
    const stats = b.stats.map(([v, l]) => `<li><b>${esc(v)}</b><span>${esc(t(l))}</span></li>`).join('');
    const reviews = b.reviews.map((r) => `<blockquote class="ds-rev">${stars}<p>“${esc(t(r.text))}”</p><cite>${esc(r.who)}</cite></blockquote>`).join('');
    const mono = esc(b.brand.split(/\s+/).map((w) => w[0]).join('').replace(/[^A-Z]/g, '').slice(0, 2));
    return `<div class="dsite${b.dark ? ' is-dark' : ''}" style="--acc:${acc};--bgc:${bg};--sec:${sec};--fgc:${fg};--hf:${b.font.replace(/"/g, "'")}">
      <p class="ds-note">${esc(t(b.note))}</p>
      <header class="ds-nav"><b class="ds-logo"><i>${mono}</i>${esc(b.brand)}</b><nav>${nav}</nav><u class="ds-btn">${esc(t(b.btn))}</u></header>
      <section class="ds-hero">
        <div class="ds-hero__copy">
          <p class="ds-eyebrow">${esc(t(b.type))} · ${esc(t(b.area))}, ${esc(t(CITY))}</p>
          <h3>${esc(t(b.head))}</h3>
          <p class="ds-lede">${esc(t(b.sub))}</p>
          <div class="ds-ctas"><u class="ds-btn ds-btn--big">${esc(t(b.btn))}</u><u class="ds-btn ds-btn--ghost">${esc(t(W[b.more]))} →</u></div>
          <p class="ds-rating">${stars} <b>${esc(b.rating)}</b> · ${b.count.toLocaleString('en-US')} ${esc(t(W.google))}</p>
        </div>
        <figure class="ds-ph ds-hero__ph">${photo(b.id)}
          <figcaption class="ds-open"><i></i>${esc(t(W.today))} · ${esc(b.hours)}</figcaption></figure>
      </section>
      <ul class="ds-stats">${stats}</ul>
      <section class="ds-sec"><div class="ds-sec__head"><h3>${esc(t(b.grid))}</h3><u>${esc(t(W[b.more]))} →</u></div>
        <div class="ds-grid">${items}</div></section>
      <section class="ds-about"><figure class="ds-ph">${photo(`${b.id}-about`)}</figure>
        <div><p class="ds-eyebrow">${esc(t(W.about))}</p><h3>${esc(t(b.about))}</h3><p class="ds-lede">${esc(t(b.story))}</p></div></section>
      <section class="ds-sec"><div class="ds-sec__head"><h3>${esc(t(W.reviews))}</h3><span class="ds-rating">${stars} <b>${esc(b.rating)}</b></span></div>
        <div class="ds-revs">${reviews}</div></section>
      <section class="ds-band"><div><h3>${esc(t(b.head))}</h3><p>${esc(t(W.hours))}: ${esc(t(W.daily))} ${esc(b.hours)} · ${esc(t(b.area))}, ${esc(t(CITY))}</p></div><u class="ds-btn ds-btn--big">${esc(t(b.btn))}</u></section>
      <footer class="ds-foot"><b class="ds-logo"><i>${mono}</i>${esc(b.brand)}</b><span>${esc(b.url)}</span><nav>${nav}</nav><small>© 2026 ${esc(b.brand)}. ${esc(t(W.rights))}</small></footer>
    </div>`;
  };

  const card = (b, i) => `<article class="ox-biz__card${b.dark ? ' is-dark' : ''}" data-i="${i}" style="--acc:${b.c[0]}">
      <p class="ox-biz__type"><span>${String(i + 1).padStart(2, '0')}</span> ${esc(t(b.type))} <em>${esc(t(HEAD.example))}</em></p>
      <div class="ox-mock" aria-hidden="true">
        <div class="ox-mock__bar"><i></i><i></i><i></i><span>${esc(b.url)}</span></div>
        <div class="ox-mock__view"><div class="ox-mock__page">${page(b)}</div></div>
      </div>
      <button type="button" class="ox-biz__open" data-open="${i}">${esc(t(HEAD.open))} <span aria-hidden="true">↗</span></button>
    </article>`;

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

  // The full-size view: the same page at real width, in a dialog over the site.
  let dlg = null, lastFocus = null;
  const openDemo = (i) => {
    const b = BIZ[i]; if (!b) return;
    if (!dlg) {
      dlg = document.createElement('div');
      dlg.className = 'ox-demo'; dlg.hidden = true; dlg.setAttribute('data-lenis-prevent', '');
      dlg.setAttribute('role', 'dialog'); dlg.setAttribute('aria-modal', 'true');
      dlg.innerHTML = `<div class="ox-demo__bar"><span class="ox-demo__url"></span><span class="ox-demo__note">${esc(t(HEAD.demo))}</span>
        <a href="#" class="ox-demo__want" data-chat="contact">${esc(t(HEAD.want))}</a>
        <button type="button" class="ox-demo__close" aria-label="${esc(t(HEAD.close))}">✕</button></div><div class="ox-demo__body"></div>`;
      document.body.append(dlg);
      dlg.addEventListener('click', (e) => {
        if (e.target.closest('.ox-demo__close')) closeDemo();
        const a = e.target.closest('[data-chat]');
        if (a) { e.preventDefault(); closeDemo(); openChat(a.dataset.chat); }
      });
      addEventListener('keydown', (e) => { if (e.key === 'Escape' && dlg && !dlg.hidden) closeDemo(); });
    }
    dlg.querySelector('.ox-demo__url').textContent = b.url;
    dlg.setAttribute('aria-label', `${b.brand} — ${t(HEAD.example)}`);
    const body = dlg.querySelector('.ox-demo__body');
    body.innerHTML = page(b); body.scrollTop = 0;
    body.querySelectorAll('img[loading]').forEach((im) => im.removeAttribute('loading'));
    lastFocus = document.activeElement;
    dlg.hidden = false; document.documentElement.classList.add('ox-demo-open'); if (window.__oxLenis) window.__oxLenis.stop();
    requestAnimationFrame(() => dlg.classList.add('is-in'));
    dlg.querySelector('.ox-demo__close').focus();
  };
  const closeDemo = () => {
    if (!dlg || dlg.hidden) return;
    dlg.classList.remove('is-in'); document.documentElement.classList.remove('ox-demo-open'); if (window.__oxLenis) window.__oxLenis.start();
    setTimeout(() => { dlg.hidden = true; dlg.querySelector('.ox-demo__body').innerHTML = ''; }, 420);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  };
  const openChat = (key) => {
    const fab = document.querySelector('.ox-chat-fab'), panel = document.querySelector('.ox-chat');
    if (fab && panel && panel.hidden) fab.click();
    setTimeout(() => { const chip = document.querySelector(`.ox-chip[data-key="${key}"]`); if (chip) chip.click(); }, 900);
  };

  let sec, track, cards, views, count, bar, active = -1;
  // Lay each page out at desktop width (or phone width on a narrow card) and scale it into its frame.
  const fit = () => {
    if (!views) return;
    views.forEach((v) => {
      if (!v) return;                           // the closing "your business here?" card has no page
      const pg = v.firstElementChild, w = v.clientWidth, lw = w < 470 ? 390 : 1280, k = w / lw;
      pg.style.width = lw + 'px';
      v._k = k; v._lw = lw;
      v._room = Math.max(0, pg.offsetHeight * k - v.clientHeight);
    });
  };
  const update = () => {
    if (!sec) return;
    const r = sec.getBoundingClientRect(), span = sec.offsetHeight - innerHeight;
    const p = Math.min(Math.max(-r.top / (span || 1), 0), 1);
    const max = track.scrollWidth - innerWidth + Math.min(innerWidth * 0.08, 96);
    track.style.transform = `translate3d(${(-p * Math.max(max, 0)).toFixed(1)}px,0,0)`;
    bar.style.transform = `scaleX(${p.toFixed(4)})`;
    // the card closest to the middle comes forward, and each page scrolls as its card crosses the screen
    const mid = innerWidth / 2;
    let best = 0, bestD = 1e9;
    cards.forEach((c, i) => {
      const b = c.getBoundingClientRect(), d = (b.left + b.width / 2 - mid) / innerWidth;
      const cd = Math.max(-1, Math.min(1, d)); c.style.setProperty('--d', cd.toFixed(3)); c.style.setProperty('--ad', Math.abs(cd).toFixed(3));
      c.classList.toggle('is-near', Math.abs(d) < 0.75);
      const v = views[i];
      if (v && v._k) {
        const s = Math.min(Math.max((0.12 - d) / 0.6, 0), 1);       // the hero while it arrives, then down the page as it leaves
        const e = s * s * (3 - 2 * s);
        v.firstElementChild.style.transform = `translate3d(0,${(-e * v._room * 0.62).toFixed(1)}px,0) scale(${v._k.toFixed(4)})`;
      }
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
    views = cards.map((c) => c.querySelector('.ox-mock__view'));
    count = sec.querySelector('.ox-biz__count'); bar = sec.querySelector('.ox-biz__meter b');
    sec.addEventListener('click', (e) => {
      const o = e.target.closest('[data-open]');
      if (o) { openDemo(+o.dataset.open); return; }
      const a = e.target.closest('[data-chat]'); if (!a) return;
      e.preventDefault(); openChat(a.dataset.chat);
    });
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', () => { fit(); update(); });
    // pages grow when their photographs arrive: re-measure how far each one can scroll
    sec.addEventListener('load', () => { fit(); update(); }, true);
    requestAnimationFrame(() => { fit(); dispatchEvent(new Event('resize')); update(); });
    return true;
  };
  if (!mount()) {
    const mo = new MutationObserver(() => { if (mount()) mo.disconnect(); });
    mo.observe(document.getElementById('root') || document.body, { childList: true, subtree: true });
  }
})();
