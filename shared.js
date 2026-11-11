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

  /* Slow, smooth wheel scrolling (desktop mouse wheel / trackpad). Touch and keyboard keep native scrolling. */
  if (!reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const EASE = 0.11;      // lower = slower, longer glide
    const SPEED = 1;        // wheel distance multiplier
    let target = window.scrollY, current = window.scrollY, running = false;
    const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;
    const loop = () => {
      current += (target - current) * EASE;
      if (Math.abs(target - current) < 0.5) { current = target; running = false; }
      window.scrollTo({ top: current, behavior: "instant" });
      if (running) requestAnimationFrame(loop);
    };
    window.addEventListener("wheel", (e) => {
      if (e.ctrlKey || e.defaultPrevented) return;                        // pinch-zoom
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;                 // horizontal gestures
      e.preventDefault();
      if (!running) { target = current = window.scrollY; }
      const unit = e.deltaMode === 1 ? 32 : e.deltaMode === 2 ? window.innerHeight : 1;
      target = Math.max(0, Math.min(maxScroll(), target + e.deltaY * unit * SPEED));
      if (!running) { running = true; requestAnimationFrame(loop); }
    }, { passive: false });
    // any other scroll (anchors, keyboard, scrollbar) resets the glide
    window.addEventListener("scroll", () => { if (!running) target = current = window.scrollY; }, { passive: true });
  }

  /* Custom cursor (desktop mouse only): a small square that follows the pointer,
     grows on links and shows a label over projects ("View" / "Visit ↗") and the hero ("Drag"). */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const cur = document.createElement("div");          // state holder + label (normal blending)
    cur.className = "cursor";
    cur.setAttribute("aria-hidden", "true");
    cur.innerHTML = '<span class="cursor-label"></span>';
    const label = cur.firstChild;
    const dot = document.createElement("div");          // the square, inverts what is under it
    dot.className = "cursor-dot";
    dot.setAttribute("aria-hidden", "true");
    document.body.append(dot, cur);
    document.documentElement.classList.add("has-cursor");

    let x = -100, y = -100, cx = x, cy = y, shown = false;
    const follow = () => {
      const k = reduceMotion ? 1 : 0.22;
      cx += (x - cx) * k; cy += (y - cy) * k;
      cur.style.transform = dot.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(follow);
    };
    requestAnimationFrame(follow);

    const setState = (state, text) => {
      cur.dataset.state = dot.dataset.state = state;
      label.textContent = text || "";
    };
    const stateFor = (el) => {
      if (!el || !el.closest || document.documentElement.classList.contains("is-loading")) return ["default"];
      const proj = el.closest(".work-item a, .next-link, .card:not(.no-page), a.client-link");
      if (proj) {
        const external = proj.target === "_blank";
        return ["label", external ? "Visit ↗" : "View"];
      }
      if (el.closest("#stage")) return ["label", "Drag"];
      if (el.closest("a, button, [role=button]")) return ["link"];
      return ["default"];
    };

    window.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX; y = e.clientY;
      if (!shown) { cx = x; cy = y; shown = true; cur.classList.add("visible"); dot.classList.add("visible"); }
      const [state, text] = stateFor(e.target);
      if (cur.dataset.state !== state || label.textContent !== (text || "")) setState(state, text);
    }, { passive: true });
    const both = (fn) => [cur, dot].forEach(fn);
    document.addEventListener("pointerleave", () => both((el) => el.classList.remove("visible")));
    document.addEventListener("pointerenter", () => { if (shown) both((el) => el.classList.add("visible")); });
    window.addEventListener("pointerdown", () => both((el) => el.classList.add("down")));
    window.addEventListener("pointerup", () => both((el) => el.classList.remove("down")));
    setState("default");
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
