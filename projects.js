/*
  ПРОЕКТЫ — редактируйте этот список.
  Порядок важен: первые 9 проектов летают вокруг модели в hero,
  в сетке работ ниже показываются все проекты.

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
    animatedCover — (необязательно) анимированная обложка: фон + слои, которые двигаются
               (пример — UTXO Alliance). Пути движения: cursor-a | cursor-b | cursor-c в styles.css.
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
    title: "UTXO Alliance",
    category: "Website",
    year: 2025,
    text: "Website for the UTxO Alliance — an initiative that brings together UTXO-based blockchains, university blockchain centers, builders and enthusiasts to make blockchains more scalable.",
    tags: ["Web design", "Landing", "Web3"],
    image: "assets/projects/utxo-cover.webp",
    // animated cover: cursors drift over the background (positions in % of the square)
    animatedCover: {
      bg: "assets/projects/utxo/bg.webp",
      layers: [
        { src: "assets/projects/utxo/kate.webp", x: 13.72, y: 39.92, w: 18.72, path: "cursor-a", duration: 9 },
        { src: "assets/projects/utxo/you.webp",  x: 76.25, y: 63.19, w: 17.97, path: "cursor-c", duration: 8, delay: -3 },
        { src: "assets/projects/utxo/john.webp", x: 44.73, y: 83.21, w: 19.04, path: "cursor-b", duration: 11, delay: -5 },
      ],
    },
    palette: ["#f4f5f8", "#7b2ff7"],
    slug: "utxo-alliance",
    intro: "The UTxO Alliance (UTxOA) is an initiative designed to foster collaboration among UTXO-based blockchains, university and affinity blockchain centers, builders, funders and anyone dedicated to enhancing the scalability of blockchains. The website had to make a technical community feel open and welcoming.",
    body: [
      { h: "The project" },
      { p: "“Join, Learn, and Build in the UTxO Ecosystem” — the site is the front door of the alliance. It explains what the initiative is about and invites people to collaborate, innovate and enhance blockchain scalability worldwide." },
      { h: "The task" },
      { p: "[Placeholder — describe the brief: who the client was, what the site needed to achieve and your role in the project.]" },
      { img: "assets/projects/utxo-cover.webp", caption: "Hero section with live “cursors” of community members.", wide: true },
      { h: "Approach" },
      { p: "Collaboration is the core idea, so the design shows it literally: colourful multiplayer-style cursors with names — Kate, John and “You” — float over the page as if people were building it together in real time." },
      { p: "A light interface with thin connecting lines and round nodes carrying network icons hints at a decentralised ecosystem, while the bold headline keeps the message clear." },
      { img: null, caption: "[Placeholder — add more screens: Learn, Build, mobile version.]" },
      { h: "Result" },
      { p: "[Placeholder — share outcomes: launch, audience growth, feedback.]" },
    ],
  },
  {
    title: "Ladneri",
    category: "E-commerce",
    year: 2025,
    text: "Online store for Ladneri — a fashion brand of knitwear and wardrobe essentials. A quiet, editorial interface that lets the clothes and photography lead.",
    tags: ["Web design", "E-commerce", "Fashion"],
    image: "assets/projects/ladneri-cover.webp",
    palette: ["#efedea", "#c8161d"],
    slug: "ladneri",
    intro: "Ladneri is a fashion brand of soft knitwear, shirts and everyday essentials. The online store had to feel like a printed lookbook — calm, airy and premium — while still making shopping effortless.",
    body: [
      { h: "The brand" },
      { p: "Cardigans, sweaters, polos and scarves in a restrained palette with bold accents like the signature red knit. Strong editorial photography is at the heart of the brand." },
      { h: "The task" },
      { p: "[Placeholder — describe the brief: goals of the store, constraints and your role in the project.]" },
      { img: "assets/projects/ladneri-cover.webp", caption: "Catalogue with category menu and a product spotlight framed by lookbook photos.", wide: true },
      { h: "Approach" },
      { p: "The interface steps back. Thin type, generous white space and soft grey product backgrounds keep the focus on texture and colour. The catalogue is a clean grid where every card shows just the name and the price." },
      { p: "Navigation opens as a simple side panel with search and a short list of categories — New Collection, T-Shirts, Sweaters, Scarfs, Accessories. Product spotlights sit between editorial photos, turning the page into a lookbook with a quiet “shop now” link." },
      { img: null, caption: "[Placeholder — add more screens: product page, cart, mobile version.]" },
      { h: "Result" },
      { p: "[Placeholder — share outcomes: launch, sales, feedback.]" },
    ],
  },
  {
    title: "ArtGlacio",
    category: "Website",
    year: 2026,
    text: "Website for Art Glacio — “The World Ice Cream Center”, where ice cream is presented as art in a gallery of old masters.",
    tags: ["Web design", "Art direction", "Food & beverage"],
    image: "assets/projects/artglacio-cover.webp",
    palette: ["#0b0b0b", "#f3ead9"],
    slug: "artglacio",
    link: "https://www.artglacio.lt/en",
    intro: "Art Glacio believes joy has no age — it simply changes its flavor. So instead of an ordinary product site, the brand opened “The World Ice Cream Center”: a digital museum where every flavor is an exhibit and every visit starts with an invitation.",
    body: [
      { h: "The idea" },
      { p: "Ice cream is treated with the seriousness of fine art. The site borrows the language of a classical museum — a dark gallery, gilded frames, a stately facade and famous portraits where the sitters now hold an ice cream. “We take joy seriously” becomes both the tagline and the design principle." },
      { h: "The task" },
      { p: "[Placeholder — describe the brief and your role in the project.]" },
      { h: "Exhibitions instead of categories" },
      { p: "The product range is split into two exhibitions with their own mood. Spells — flavors that have no memories yet, born to surprise and enchant. Sentiments — flavors that never fade and bring back a familiar joy. Each exhibition has its own hall, and the products hang on the walls like paintings in frames." },
      { img: null, caption: "[Placeholder — exhibitions: Spells and Sentiments]", wide: true },
      { h: "Visual language" },
      { p: "Deep black backgrounds, an elegant high-contrast display serif set in capitals and a flowing script logo. Old-master portraits are reimagined with ice cream, while product photography stays bright and appetising against the dark museum space." },
      { h: "Visiting the center" },
      { p: "The journey ends like a real museum visit: “Ready to visit the ice cream world center?” A short form asks for a name, email, preferred visit time and exhibition — turning a contact form into getting an invitation." },
      { img: null, caption: "[Placeholder — invitation form and footer]" },
      { h: "Result" },
      { p: "[Placeholder — share outcomes: launch, feedback, awards.]" },
    ],
  },
  {
    title: "Inflomega",
    category: "Key visual",
    year: 2025,
    text: "Key visual for Inflomega — a dark, kinetic image about the hidden effects of inflammation on the body.",
    tags: ["Art direction", "Key visual", "Health"],
    image: "assets/projects/inflomega-cover.webp",
    palette: ["#0b0b0b", "#e8875c"],
    slug: "inflomega",
    intro: "Inflomega speaks about inflammation — something people rarely see, but feel every day as headaches, joint pain or heart problems. The visual had to make this invisible process tangible and memorable.",
    body: [
      { h: "The idea" },
      { p: "A crowd of people in motion, blurred as if caught in a long exposure: life is fast, and the body keeps up until it can't. Thin orange crosshairs mark points on the figures — “headaches”, “joint pain”, “heart problems” — like a diagnostic overlay revealing what hides beneath the movement." },
      { h: "The task" },
      { p: "[Placeholder — describe the brief: the product, where the visual is used and your role in the project.]" },
      { h: "Visual language" },
      { p: "Black-and-white photography with heavy motion blur sets a tense, almost cinematic mood. The only colour is a warm peach-orange accent used for the markers and the gradient in the logotype." },
      { p: "The wordmark sets INFLOMEGA in heavy capitals across the full width, with the O replaced by the Greek letter Ω — a direct nod to omega." },
      { img: null, caption: "[Placeholder — more visuals: social posts, packaging, website.]", wide: true },
      { h: "Result" },
      { p: "[Placeholder — share outcomes: where the campaign ran, feedback, results.]" },
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
