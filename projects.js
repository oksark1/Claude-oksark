/*
  ПРОЕКТЫ — редактируйте этот список.

  Поля:
    title    — название проекта
    category — тип работы
    year     — год
    text     — описание (показывается в окне проекта)
    tags     — список тегов
    image    — путь к обложке, например "assets/projects/fintech.jpg".
               Пока image не указан, рисуется абстрактная обложка из palette + shape.
    palette  — [фон, акцент] для автоматической обложки
    shape    — "circle" | "stripes" | "grid" | "phone" | "type" | "arch"
    link     — (необязательно) ссылка на кейс, Behance и т.п.
*/
window.PROJECTS = [
  {
    title: "Uptimescan Bot",
    category: "Landing page",
    year: 2025,
    text: "Landing page for UptimeScan — a Telegram bot that monitors websites, ports and servers and notifies you the moment a resource goes down. Clean, friendly layout with an interactive chat preview of the bot.",
    tags: ["Web design", "Landing", "Telegram bot"],
    image: "assets/projects/uptimescan.webp",
    palette: ["#0e1f22", "#27a85a"],
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
