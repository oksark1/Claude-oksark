/* Helpers shared by the home page (main.js) and project pages (project.js). */
(() => {
  /* Always start at the top (hero) on load/reload. Keep the browser's own
     restore only for Back/Forward, and honour #anchors on normal navigation. */
  const navType = (performance.getEntriesByType("navigation")[0] || {}).type;
  if (navType !== "back_forward" && "scrollRestoration" in history) {
    history.scrollRestoration = "manual";
    const toTop = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (navType === "reload" && location.hash) {
      history.replaceState(null, "", location.pathname + location.search);
    }
    if (!location.hash) {
      toTop();
      window.addEventListener("load", toTop, { once: true });
    }
  }

  const projects = window.PROJECTS || [];

  const slugify = (s) =>
    String(s).toLowerCase().replace(/[^a-z0-9а-яё]+/gi, "-").replace(/^-+|-+$/g, "");

  projects.forEach((p) => { if (!p.slug) p.slug = slugify(p.title); });

  /* Square/16:9 cover: real image if set, otherwise generated placeholder art */
  function cover(p, src) {
    // animated cover: background + moving layers (used unless a specific src is requested)
    if (src === undefined && p.animatedCover) return layeredCover(p);
    const image = src !== undefined ? src : p.image;
    const el = document.createElement("div");
    el.className = "art " + (image ? "" : p.shape || "circle");
    el.style.setProperty("--a", (p.palette && p.palette[0]) || "#ddd");
    el.style.setProperty("--b", (p.palette && p.palette[1]) || "#111");
    if (image) {
      const img = document.createElement("img");
      img.src = image;
      img.alt = p.title;
      img.loading = "lazy";
      img.draggable = false;
      el.appendChild(img);
    }
    return el;
  }

  function layeredCover(p) {
    const a = p.animatedCover;
    const el = document.createElement("div");
    el.className = "art layered" + (a.parallax ? " parallax" : "");
    if (a.bgColor) el.style.background = a.bgColor;
    if (a.bg) {
      const bg = document.createElement("img");
      bg.className = "bg"; bg.src = a.bg; bg.alt = p.title; bg.loading = "lazy"; bg.draggable = false;
      el.appendChild(bg);
    } else {
      el.setAttribute("role", "img"); el.setAttribute("aria-label", p.title);
    }
    let entering = false;
    (a.layers || []).forEach((l) => {
      const img = document.createElement("img");
      img.className = "layer" + (l.enter ? " enter" : ""); img.src = l.src; img.alt = ""; img.loading = "lazy"; img.draggable = false;
      img.setAttribute("aria-hidden", "true");
      img.style.cssText =
        `--x:${l.x}%;--y:${l.y}%;--w:${l.w}%;--anim:${l.path || "none"};--dur:${l.duration || 9}s;` +
        `--delay:${l.delay || 0}s;--depth:${l.depth || 0};--origin:${l.origin || "50% 50%"};` +
        (l.enter ? `--enter:${l.enter};--enter-delay:${l.enterDelay || 0}s;` : "");
      if (l.enter) entering = true;
      el.appendChild(img);
    });
    if (entering) enterObserver.observe(el);
    return el;
  }

  /* Layers with `enter` slide in (from behind / below) when the cover scrolls into view */
  const enterObserver = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); enterObserver.unobserve(e.target); } });
      }, { threshold: 0.35 })
    : { observe: (el) => el.classList.add("in") };

  /* Parallax for layered covers marked `parallax`: layers follow the pointer and scroll position */
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion) {
    let mx = null, my = null;
    window.addEventListener("pointermove", (e) => { if (e.pointerType === "mouse") { mx = e.clientX; my = e.clientY; } }, { passive: true });
    const clamp = (v) => Math.max(-1, Math.min(1, v));
    const tick = () => {
      const vh = window.innerHeight;
      document.querySelectorAll(".art.layered.parallax").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh || !r.width) return;
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const scroll = clamp((cy - vh / 2) / vh);
        const px = mx === null ? 0 : clamp((mx - cx) / r.width);
        const py = my === null ? 0 : clamp((my - cy) / r.height);
        const tx = px, ty = clamp(py * 0.6 + scroll);
        const s = el._p || (el._p = { x: 0, y: 0 });
        s.x += (tx - s.x) * 0.08; s.y += (ty - s.y) * 0.08;
        el.style.setProperty("--px", s.x.toFixed(4));
        el.style.setProperty("--py", s.y.toFixed(4));
      });
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // projects with `external: true` open their live site (p.link) in a new tab instead of a case page
  const isExternal = (p) => !!(p.external && p.link);
  const projectUrl = (p) => (isExternal(p) ? p.link : `project.html?p=${encodeURIComponent(p.slug)}`);
  const linkTo = (a, p) => {
    a.href = projectUrl(p);
    if (isExternal(p)) { a.target = "_blank"; a.rel = "noopener"; }
  };

  window.Site = { projects, cover, projectUrl, linkTo, isExternal, slugify };

  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
