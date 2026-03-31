import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Admin user
  await prisma.user.upsert({
    where: { email: "admin@jeepping.ru" },
    update: {},
    create: {
      email: "admin@jeepping.ru",
      password: hashSync("admin123", 10),
      name: "Администратор",
      role: "admin",
    },
  });

  // Routes
  const routes = [
    {
      slug: "chertov-palec",
      name: 'Скала "Чёртов палец"',
      shortDescription: "Панорамная смотровая площадка с видом на Лаго-Наки и долину реки Белой",
      description: "Один из самых популярных маршрутов в Адыгее. Вы подниметесь к знаменитой скале Чёртов палец, откуда открывается захватывающий панорамный вид на плато Лаго-Наки, долину реки Белой и окрестные горы. Маршрут проходит через живописные горные дороги с бродами через ручьи.",
      price: 9000,
      priceNote: "за машину (до 6 чел.)",
      duration: "2-3 часа",
      difficulty: 2,
      difficultyLabel: "Средний",
      maxPassengers: 6,
      highlights: JSON.stringify(["Панорамный вид на Лаго-Наки", "Скала Чёртов палец", "Долина реки Белой", "Горные броды"]),
      included: JSON.stringify(["Проезд на УАЗе", "Опытный водитель-инструктор", "Фотопаузы на видовых точках"]),
      image: "/images/routes/chertov-palec.jpg",
      gallery: JSON.stringify([]),
      startPoint: "пос. Каменномостский",
      popular: true,
      order: 1,
    },
    {
      slug: "sahrayskie-vodopady",
      name: "Сахрайские водопады",
      shortDescription: "Каскад живописных водопадов в ущелье реки Сахрай",
      description: "Путешествие к Сахрайским водопадам — это погружение в первозданную природу Адыгеи. Маршрут проходит вдоль реки Сахрай через густые леса к каскаду водопадов. Вы увидите несколько водопадов разной высоты, сможете искупаться в природных чашах и насладиться тишиной горного леса.",
      price: 9000,
      priceNote: "за машину (до 6 чел.)",
      duration: "3-4 часа",
      difficulty: 2,
      difficultyLabel: "Средний",
      maxPassengers: 6,
      highlights: JSON.stringify(["Каскад водопадов", "Река Сахрай", "Горный лес", "Купание в природных чашах"]),
      included: JSON.stringify(["Проезд на УАЗе", "Опытный водитель-инструктор", "Фотопаузы"]),
      image: "/images/routes/sahrayskie-vodopady.jpg",
      gallery: JSON.stringify([]),
      startPoint: "пос. Каменномостский",
      popular: true,
      order: 2,
    },
    {
      slug: "marshrut-na-chas",
      name: "Маршрут на час",
      shortDescription: "Быстрое знакомство с джиппингом — идеально для первого раза",
      description: "Самый быстрый маршрут — отличный выбор для тех, кто хочет попробовать джиппинг впервые или ограничен во времени. За один час вы получите яркие впечатления от езды по бездорожью, увидите красивые горные пейзажи и поймёте, почему джиппинг вызывает зависимость.",
      price: 5000,
      priceNote: "за машину (до 6 чел.)",
      duration: "1 час",
      difficulty: 1,
      difficultyLabel: "Лёгкий",
      maxPassengers: 6,
      highlights: JSON.stringify(["Быстрое знакомство с джиппингом", "Горные пейзажи", "Идеально для новичков"]),
      included: JSON.stringify(["Проезд на УАЗе", "Опытный водитель-инструктор"]),
      image: "/images/routes/marshrut-na-chas.jpg",
      gallery: JSON.stringify([]),
      startPoint: "пос. Каменномостский",
      popular: false,
      order: 3,
    },
    {
      slug: "lago-naki",
      name: "Лаго-Наки",
      shortDescription: "Легендарное плато с альпийскими лугами и горными панорамами",
      description: "Путешествие к знаменитому плато Лаго-Наки — жемчужине Адыгеи. Вы подниметесь через горные серпантины к альпийским лугам, откуда открываются панорамы Главного Кавказского хребта. Зимой здесь снежные пейзажи, летом — цветущие поляны. Один из самых красивых маршрутов.",
      price: 9000,
      priceNote: "за машину (до 6 чел.)",
      duration: "3-4 часа",
      difficulty: 2,
      difficultyLabel: "Средний",
      maxPassengers: 6,
      highlights: JSON.stringify(["Плато Лаго-Наки", "Альпийские луга", "Панорама Кавказского хребта", "Горные серпантины"]),
      included: JSON.stringify(["Проезд на УАЗе", "Опытный водитель-инструктор", "Фотопаузы на видовых точках"]),
      image: "/images/routes/lago-naki.jpg",
      gallery: JSON.stringify([]),
      startPoint: "ст. Даховская",
      popular: true,
      order: 4,
    },
    {
      slug: "guamskoe-ushchelye",
      name: "Гуамское ущелье",
      shortDescription: "Величественное ущелье глубиной 400 метров с узкоколейной железной дорогой",
      description: "Гуамское ущелье — одно из самых впечатляющих мест Кавказа. Отвесные скалы высотой до 400 метров, реликтовые леса и горная река создают неповторимую атмосферу. Маршрут длиннее обычного, но каждый километр стоит того. По пути вы увидите знаменитую узкоколейную железную дорогу.",
      price: 18000,
      priceNote: "за машину (до 6 чел.)",
      duration: "5-6 часов",
      difficulty: 3,
      difficultyLabel: "Выше среднего",
      maxPassengers: 6,
      highlights: JSON.stringify(["Ущелье глубиной 400 м", "Узкоколейная железная дорога", "Реликтовые леса", "Горная река"]),
      included: JSON.stringify(["Проезд на УАЗе", "Опытный водитель-инструктор", "Фотопаузы", "Остановка на обед (за свой счёт)"]),
      image: "/images/routes/guamskoe-ushchelye.jpg",
      gallery: JSON.stringify([]),
      startPoint: "пос. Каменномостский",
      popular: true,
      order: 5,
    },
    {
      slug: "grot-cherep-skala-galkina",
      name: "Грот Череп и Скала Галкина",
      shortDescription: "Загадочный грот в форме черепа и живописная скала над рекой",
      description: "Маршрут к двум уникальным природным достопримечательностям. Грот Череп получил своё название за характерную форму, напоминающую человеческий череп. Скала Галкина — величественный утёс над рекой с потрясающим видом. Дорога проходит через лесные тропы и горные переправы.",
      price: 15000,
      priceNote: "за машину (до 6 чел.)",
      duration: "4-5 часов",
      difficulty: 3,
      difficultyLabel: "Выше среднего",
      maxPassengers: 6,
      highlights: JSON.stringify(["Грот в форме черепа", "Скала Галкина", "Горные переправы", "Лесные тропы"]),
      included: JSON.stringify(["Проезд на УАЗе", "Опытный водитель-инструктор", "Фотопаузы"]),
      image: "/images/routes/grot-cherep.jpg",
      gallery: JSON.stringify([]),
      startPoint: "ст. Даховская",
      popular: false,
      order: 6,
    },
    {
      slug: "universitetskiy-vodopad",
      name: "Университетский водопад",
      shortDescription: "Мощный водопад высотой 20 метров в окружении скал",
      description: "Университетский водопад — один из самых красивых водопадов Адыгеи. Мощный поток воды падает с высоты около 20 метров в каменную чашу. Дорога к водопаду — это уже приключение: горные подъёмы, броды, густой лес. На месте можно искупаться в ледяной горной воде.",
      price: 15000,
      priceNote: "за машину (до 6 чел.)",
      duration: "4-5 часов",
      difficulty: 3,
      difficultyLabel: "Выше среднего",
      maxPassengers: 6,
      highlights: JSON.stringify(["Водопад высотой 20 м", "Горные броды", "Купание", "Каменная чаша"]),
      included: JSON.stringify(["Проезд на УАЗе", "Опытный водитель-инструктор", "Фотопаузы"]),
      image: "/images/routes/universitetskiy-vodopad.jpg",
      gallery: JSON.stringify([]),
      startPoint: "ст. Даховская",
      popular: false,
      order: 7,
    },
    {
      slug: "universitetskiy-i-chinarskiy",
      name: "Университетский и Чинарский водопады",
      shortDescription: "Два водопада за одну поездку — максимум впечатлений",
      description: "Расширенная версия маршрута к Университетскому водопаду. Вы посетите сразу два потрясающих водопада: мощный Университетский и живописный Чинарский. Маршрут длиннее и сложнее, но награда — двойная порция красоты. Подходит для тех, кто хочет увидеть больше за одну поездку.",
      price: 18000,
      priceNote: "за машину (до 6 чел.)",
      duration: "5-6 часов",
      difficulty: 4,
      difficultyLabel: "Сложный",
      maxPassengers: 6,
      highlights: JSON.stringify(["Два водопада", "Университетский водопад", "Чинарский водопад", "Сложное бездорожье"]),
      included: JSON.stringify(["Проезд на УАЗе", "Опытный водитель-инструктор", "Фотопаузы"]),
      image: "/images/routes/universitetskiy-chinarskiy.jpg",
      gallery: JSON.stringify([]),
      startPoint: "ст. Даховская",
      popular: false,
      order: 8,
    },
    {
      slug: "guzeripl-yavorova-polyana",
      name: "Гузерипль — Яворова Поляна",
      shortDescription: "Путь к подножию горы Оштен через реликтовые леса",
      description: "Маршрут ведёт через посёлок Гузерипль к Яворовой Поляне — отправной точке для восхождений на гору Оштен. По пути вы проедете через реликтовые пихтовые леса, увидите горные реки и вдохнёте чистейший горный воздух. Зимой поляна покрыта снегом — волшебное зрелище.",
      price: 12000,
      priceNote: "за машину (до 6 чел.)",
      duration: "4-5 часов",
      difficulty: 3,
      difficultyLabel: "Выше среднего",
      maxPassengers: 6,
      highlights: JSON.stringify(["Яворова Поляна", "Подножие горы Оштен", "Реликтовые пихтовые леса", "Посёлок Гузерипль"]),
      included: JSON.stringify(["Проезд на УАЗе", "Опытный водитель-инструктор", "Фотопаузы", "Посещение Гузерипля"]),
      image: "/images/routes/guzeripl-yavorova.jpg",
      gallery: JSON.stringify([]),
      startPoint: "пос. Каменномостский",
      popular: false,
      order: 9,
    },
    {
      slug: "hrebet-du-du-gush",
      name: "Хребет Ду-Ду-Гуш",
      shortDescription: "Самый экстремальный маршрут с подъёмом на горный хребет",
      description: "Самый сложный и длительный маршрут для настоящих любителей экстрима. Подъём на хребет Ду-Ду-Гуш — это серьёзное бездорожье, крутые подъёмы и спуски. Награда — потрясающие виды с высоты хребта на горы Адыгеи. Только для тех, кто готов к настоящему приключению.",
      price: 22000,
      priceNote: "за машину (до 6 чел.)",
      duration: "6-7 часов",
      difficulty: 5,
      difficultyLabel: "Экстремальный",
      maxPassengers: 6,
      highlights: JSON.stringify(["Хребет Ду-Ду-Гуш", "Экстремальное бездорожье", "Панорамные виды", "Крутые подъёмы и спуски"]),
      included: JSON.stringify(["Проезд на УАЗе", "Опытный водитель-инструктор", "Фотопаузы", "Перекус в горах"]),
      image: "/images/routes/du-du-gush.jpg",
      gallery: JSON.stringify([]),
      startPoint: "ст. Даховская",
      popular: false,
      order: 10,
    },
  ];

  for (const route of routes) {
    await prisma.route.upsert({
      where: { slug: route.slug },
      update: route,
      create: route,
    });
  }

  // Reviews
  const reviews = [
    { name: "Анна М.", date: "Март 2026", rating: 5, text: "Ездили всей семьёй с двумя детьми (5 и 8 лет) на Чёртов палец. Дети в восторге, виды невероятные! Водитель очень аккуратный, чувствовали себя в безопасности. Обязательно вернёмся на другой маршрут!", route: 'Скала «Чёртов палец»', order: 1 },
    { name: "Дмитрий К.", date: "Февраль 2026", rating: 5, text: "Брали маршрут на Ду-Ду-Гуш — это было мощно! Реальный экстрим, подъёмы такие, что дух захватывает. Виды с хребта — лучшее, что я видел на Кавказе. Рекомендую всем, кто не боится приключений.", route: "Хребет Ду-Ду-Гуш", order: 2 },
    { name: "Елена и Сергей", date: "Январь 2026", rating: 5, text: "Были на Сахрайских водопадах летом — купались в горных чашах, невероятно красиво! Водитель рассказывал интересные истории про эти места. Отличное приключение для пары.", route: "Сахрайские водопады", order: 3 },
    { name: "Максим В.", date: "Декабрь 2025", rating: 5, text: "Компанией из 6 человек поехали на Лаго-Наки. Зимние пейзажи — сказка! Снег, горы, свежий воздух. УАЗ прошёл везде без проблем. Отдельное спасибо водителю за профессионализм.", route: "Лаго-Наки", order: 4 },
    { name: "Ольга Н.", date: "Ноябрь 2025", rating: 4, text: "Взяли маршрут на час для первого знакомства с джиппингом. Понравилось, но хотелось больше! В следующий раз возьмём маршрут подлиннее. Хорошее соотношение цена/впечатления.", route: "Маршрут на час", order: 5 },
    { name: "Игорь и Марина", date: "Октябрь 2025", rating: 5, text: "Гуамское ущелье — просто вау! Стены скал уходят вверх на сотни метров, чувствуешь себя песчинкой. Долгий маршрут, но ни минуты скуки. Обед в горах — отдельное удовольствие.", route: "Гуамское ущелье", order: 6 },
  ];

  for (const review of reviews) {
    await prisma.review.create({ data: review });
  }

  // FAQ
  const faqs = [
    { question: "С какого возраста можно детям?", answer: "Дети от 3 лет могут участвовать в большинстве маршрутов. Для маленьких пассажиров предусмотрены безопасные места. Маршруты с повышенной сложностью (4-5) рекомендуем для детей от 7 лет.", order: 1 },
    { question: "Что взять с собой?", answer: "Удобную закрытую обувь, солнцезащитные очки, головной убор, воду. В прохладную погоду — ветровку. Для купания в водопадах — купальник и полотенце. Мы рекомендуем одежду, которую не жалко испачкать.", order: 2 },
    { question: "Что будет, если пойдёт дождь?", answer: "Лёгкий дождь не помеха — УАЗы оборудованы тентами. В сильный ливень мы можем перенести поездку на другую дату без доплаты. Безопасность гостей — наш приоритет.", order: 3 },
    { question: "Насколько это безопасно?", answer: "Все наши водители — опытные инструкторы, знающие каждый метр маршрута. Машины проходят регулярное техобслуживание. Мы возим семьи с маленькими детьми — безопасность гарантирована.", order: 4 },
    { question: "Можно забронировать всю машину?", answer: "Да! Цены указаны за машину целиком (УАЗ Хантер — до 6 чел., УАЗ Патриот — до 8 чел.). Вы можете поехать своей компанией без посторонних.", order: 5 },
    { question: "Откуда стартуют маршруты?", answer: "Основные точки старта — посёлок Каменномостский и станица Даховская. Также возможен трансфер из Хамышков, Гузерипля, Абадзехской, Цветочного, Тульского и баз отдыха по дороге на Лаго-Наки (за дополнительную плату).", order: 6 },
    { question: "Как забронировать?", answer: "Оставьте заявку на сайте, напишите в WhatsApp, Telegram или позвоните нам. Мы подберём удобную дату и маршрут, ответим на все вопросы.", order: 7 },
    { question: "Нужна ли специальная подготовка?", answer: "Никакой подготовки не нужно! Вы — пассажир, за рулём опытный водитель-инструктор. Просто наслаждайтесь поездкой и видами.", order: 8 },
  ];

  for (const faq of faqs) {
    await prisma.fAQ.create({ data: faq });
  }

  // Gallery
  const galleryItems = [
    { image: "/images/gallery/1.jpg", alt: "Горные дороги Адыгеи", span: "col-span-2 row-span-2", order: 1 },
    { image: "/images/gallery/2.jpg", alt: "Водопады Адыгеи", span: "", order: 2 },
    { image: "/images/gallery/3.jpg", alt: "УАЗ на горной тропе", span: "", order: 3 },
    { image: "/images/gallery/4.jpg", alt: "Панорама Лаго-Наки", span: "", order: 4 },
    { image: "/images/gallery/5.jpg", alt: "Гуамское ущелье", span: "col-span-2", order: 5 },
    { image: "/images/gallery/6.jpg", alt: "Скала Чёртов палец", span: "", order: 6 },
    { image: "/images/gallery/7.jpg", alt: "Горная река", span: "", order: 7 },
    { image: "/images/gallery/8.jpg", alt: "Команда на маршруте", span: "col-span-2", order: 8 },
  ];

  for (const item of galleryItems) {
    await prisma.galleryItem.create({ data: item });
  }

  // Contacts
  const contacts = [
    { key: "phone", value: "+7 (999) 123-45-67" },
    { key: "phone_raw", value: "+79991234567" },
    { key: "whatsapp", value: "https://wa.me/79991234567" },
    { key: "telegram", value: "https://t.me/jeepping_travel" },
    { key: "telegram_username", value: "@jeepping_travel" },
    { key: "max", value: "https://max.ru/jeepping_travel" },
    { key: "address", value: "Республика Адыгея, пос. Каменномостский, ст. Даховская" },
    { key: "working_hours", value: "Ежедневно с 8:00 до 20:00" },
  ];

  for (const contact of contacts) {
    await prisma.contact.upsert({
      where: { key: contact.key },
      update: { value: contact.value },
      create: contact,
    });
  }

  // Settings
  const settings = [
    { key: "site_name", value: "Jeepping Travel Адыгея" },
    { key: "site_description", value: "Джиппинг-туры по горам Адыгеи на УАЗах" },
    { key: "seo_title", value: "Jeepping Travel Адыгея — Джиппинг-туры по горам Адыгеи" },
    { key: "seo_description", value: "Джиппинг в Адыгее на УАЗах. 10 маршрутов по горам, водопадам и ущельям. Безопасно для семей с детьми. Бронируйте онлайн от 5 000 ₽." },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
