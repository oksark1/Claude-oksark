/*
  ПРОЕКТЫ — редактируйте этот список.

  Поля:
    title    — название проекта
    category — тип работы
    year     — год
    text     — краткое описание (вводный абзац страницы, если нет intro)
    tags     — список тегов
    image    — путь к обложке, например "assets/projects/fintech.jpg".
               Пока image не указан, рисуется абстрактная обложка из palette + shape.
    palette  — [фон, акцент] для автоматической обложки
    shape    — "circle" | "stripes" | "grid" | "phone" | "type" | "arch"
    hero     — (необязательно) широкая картинка вверху страницы проекта.
               Если не указана, используется image.
    link     — (необязательно) ссылка на живой сайт, Behance и т.п.
    slug     — (необязательно) адрес страницы: project.html?p=<slug>.
               Если не указан, создаётся из названия.
    intro    — (необязательно) вводный абзац под заголовком на странице проекта
    body     — (необязательно) лонгрид страницы проекта — список блоков по порядку:
                 { h: "Заголовок раздела" }
                 { p: "Абзац текста" }
                 { img: "assets/projects/файл.jpg", caption: "Подпись" }
                 { img: "...", wide: true }       — картинка шире колонки текста
                 { img: null, caption: "..." }    — заглушка, пока нет картинки
               Если body не указан, показывается шаблон-заглушка.
*/
window.PROJECTS = [
  {
    title: "Uptimescan Bot",
    category: "Landing page",
    year: 2025,
    text: "Landing page for UptimeScan — a Telegram bot that monitors websites, ports and servers and notifies you the moment a resource goes down. Clean, friendly layout with an interactive chat preview of the bot.",
    tags: ["Web design", "Landing", "Telegram bot"],
    image: "assets/projects/uptimescan-cover.webp",
    hero: "assets/projects/uptimescan.webp",
    palette: ["#0e1f22", "#27a85a"],
    slug: "uptimescan-bot",
    intro: "UptimeScan is a Telegram bot that keeps an eye on websites, ports and servers and messages you the moment something goes down. The landing page had to explain the product in seconds and get people to open the bot.",
    body: [
      { h: "The product" },
      { p: "Availability monitoring is usually sold through heavy dashboards. UptimeScan lives where people already are — in Telegram. You add a site or a server in the bot, and it notifies you every time the resource becomes unavailable. Getting started is free." },
      { h: "The task" },
      { p: "[Placeholder — describe the brief: who the client was, what the page needed to achieve, constraints and your role in the project.]" },
      { img: "assets/projects/uptimescan.webp", caption: "Hero section: headline, short explanation and an interactive preview of the bot.", wide: true },
      { h: "Approach" },
      { p: "The headline says exactly what the product does — “Availability monitoring, right in your Telegram” — with the Telegram logo set inline so the channel is obvious at a glance. Below it, a short paragraph explains the flow in two sentences." },
      { p: "Instead of an abstract illustration, the hero shows the bot itself: a chat window with the /start command, the bot's friendly greeting and the three monitoring types as buttons. Visitors see what they will get before they click." },
      { img: null, caption: "[Placeholder — add more screens: features, plans, FAQ, mobile version.]" },
      { img: "assets/projects/uptimescan-cover.webp", caption: "The landing page on a desktop display." },
      { h: "Visual language" },
      { p: "A calm, clean layout with lots of white space, a single green accent for actions and a soft mascot-style logo. Bold abstract shapes in green and blue frame the page and give the brand a memorable, playful edge without distracting from the content." },
      { h: "Result" },
      { p: "[Placeholder — share outcomes: launch date, conversion, feedback from the client or users.]" },
    ],
  },
  {
    title: "Coffee brand identity",
    category: "Branding",
    year: 2025,
    text: "Placeholder — logo, packaging and visual language for a specialty coffee brand.",
    tags: ["Logo", "Packaging"],
    palette: ["#e9dfd0", "#7a4b2a"],
    shape: "circle",
  },
  {
    title: "SaaS dashboard",
    category: "Web app",
    year: 2024,
    text: "Placeholder — analytics dashboard with a focus on clarity and dense data.",
    tags: ["Dashboard", "B2B"],
    palette: ["#eef0f4", "#3a5bff"],
    shape: "grid",
  },
  {
    title: "Architecture studio site",
    category: "Website",
    year: 2024,
    text: "Placeholder — minimal portfolio website for an architecture studio.",
    tags: ["Web", "Art direction"],
    palette: ["#d9d6cf", "#1b1b1b"],
    shape: "arch",
  },
  {
    title: "Music festival",
    category: "Visual identity",
    year: 2024,
    text: "Placeholder — posters, social media and merch for a summer festival.",
    tags: ["Posters", "Motion"],
    palette: ["#ff5b2e", "#ffe14d"],
    shape: "stripes",
  },
  {
    title: "E-commerce redesign",
    category: "UX / UI",
    year: 2023,
    text: "Placeholder — new catalogue, product page and checkout for an online store.",
    tags: ["E-commerce", "Web"],
    palette: ["#f4efe9", "#e0483e"],
    shape: "type",
  },
  {
    title: "Health tracker",
    category: "Product design",
    year: 2023,
    text: "Placeholder — habit and health tracking app with calm, friendly visuals.",
    tags: ["Mobile", "iOS"],
    palette: ["#d8ece4", "#1e6b52"],
    shape: "phone",
  },
  {
    title: "Tech conference",
    category: "Branding & web",
    year: 2022,
    text: "Placeholder — identity and website for an annual tech conference.",
    tags: ["Brand", "Web"],
    palette: ["#111111", "#9b8cff"],
    shape: "circle",
  },
];
