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
    el.className = "art layered";
    const bg = document.createElement("img");
    bg.className = "bg"; bg.src = a.bg; bg.alt = p.title; bg.loading = "lazy"; bg.draggable = false;
    el.appendChild(bg);
    (a.layers || []).forEach((l) => {
      const img = document.createElement("img");
      img.className = "layer"; img.src = l.src; img.alt = ""; img.loading = "lazy"; img.draggable = false;
      img.setAttribute("aria-hidden", "true");
      img.style.cssText = `--x:${l.x}%;--y:${l.y}%;--w:${l.w}%;--anim:${l.path};--dur:${l.duration || 9}s;--delay:${l.delay || 0}s`;
      el.appendChild(img);
    });
    return el;
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
