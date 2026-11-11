(() => {
  const projects = window.PROJECTS || [];          // all projects → work grid
  const HERO_LIMIT = 9;                              // max cards orbiting in the hero
  const featured = projects.slice(0, HERO_LIMIT);    // first 9 in projects.js
  const n = featured.length;
  const step = (Math.PI * 2) / n;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pad = (i) => String(i + 1).padStart(2, "0");

  const { cover, projectUrl, linkTo, isExternal } = window.Site;
  const openProject = (i) => {
    const p = featured[i];
    if (p.noPage) return;
    if (isExternal(p)) window.open(projectUrl(p), "_blank", "noopener");
    else window.location.href = projectUrl(p);
  };

  /* ---------- Work list ---------- */
  const list = document.getElementById("workList");
  projects.filter((p) => !p.placeholder).forEach((p) => {
    const li = document.createElement("li");
    li.className = "work-item";
    const a = document.createElement(p.noPage ? "div" : "a");
    if (p.noPage) a.className = "no-page"; else linkTo(a, p);
    a.setAttribute("aria-label", `${p.title} — ${p.category}, ${p.year}`);
    a.innerHTML = `<div class="thumb"></div><h3 class="name"></h3>`;
    a.querySelector(".name").textContent = p.title;
    a.querySelector(".thumb").appendChild(cover(p));
    li.appendChild(a);
    list.appendChild(li);
  });
  if ("IntersectionObserver" in window && !reduced) {
    const io = new IntersectionObserver((entries) => {
      // items entering together (one row) start one after another
      entries.filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
        .forEach((e, k) => {
          e.target.style.setProperty("--d", k * 65 + "ms");
          e.target.classList.add("in");
          io.unobserve(e.target);
        });
    }, { rootMargin: "0px 0px -8% 0px" });
    list.querySelectorAll(".work-item").forEach((el) => { el.classList.add("reveal"); io.observe(el); });
  }

  /* ---------- Orbit ---------- */
  const stage = document.getElementById("stage");
  const orbit = document.getElementById("orbit");
  const model = stage.querySelector(".model");
  const cards = featured.map((p, i) => {
    const b = document.createElement("button");
    b.className = "card" + (p.noPage ? " no-page" : "");
    b.setAttribute("aria-label", `${p.title} — ${p.category}`);
    const c = cover(p, p.image || null); // static cover in the hero carousel (no animated layers)
    c.classList.add("cover");
    b.append(c);
    b.addEventListener("click", (e) => {
      if (moved) { e.preventDefault(); return; }
      if (i === active) openProject(i);
      else goTo(i);
    });
    orbit.appendChild(b);
    return b;
  });

  let angle = 0;          // current rotation (rad)
  let target = null;      // snap target
  let velocity = 0;
  let active = -1;
  let rx = 400, ry = 60, cardW = 240;
  let hovering = false;
  let speed = document.documentElement.classList.contains("is-loading") ? 0 : 1;          // auto-rotation speed multiplier

  function layout() {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    const mH = model.getBoundingClientRect().height || h * 0.6;
    const mobile = w < 860;
    cardW = mobile ? 85 : Math.min(210, Math.max(150, w * 0.13));
    rx = mobile ? w * 0.38 : Math.min(w * 0.34, mH * 0.85 + cardW * 0.3);
    ry = mH * (mobile ? 0.26 : 0.2);
    orbit.style.setProperty("--card-w", cardW + "px");
    cards.forEach((c) => c.style.setProperty("--h", cardW + "px"));
  }

  const caption = {
    idx: document.getElementById("capIndex"),
    title: document.getElementById("capTitle"),
    cat: document.getElementById("capCat"),
  };
  function setActive(i) {
    if (i === active) return;
    if (active >= 0) cards[active].classList.remove("active");
    active = i;
    cards[i].classList.add("active");
    caption.idx.textContent = `${pad(i)} / ${pad(n - 1)}`;
    caption.title.textContent = featured[i].title;
    caption.cat.textContent = `${featured[i].category} · ${featured[i].year}`;
  }

  /* Landing from the intro loader: real cards start where the loader cards are and glide
     to their orbit slots. They keep their own z-index, so cards meant to be behind the model
     travel behind it the whole way. */
  let landing = null;
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  window.Orbit = {
    land(points, duration = 950, stagger = 40) {
      const o = orbit.getBoundingClientRect();
      landing = {
        t0: performance.now(), duration, stagger,
        items: cards.map((c, i) => {
          const p = points[i];
          if (!p || c._x === undefined) return null;
          return { dx: p.x - (o.left + c._x), dy: p.y - (o.top + c._y), k: p.size / (cardW * c._scale) };
        }),
      };
      return duration + stagger * cards.length;
    },
  };

  function render() {
    let best = -2, bestI = 0;
    const now = performance.now();
    for (let i = 0; i < n; i++) {
      const t = angle + i * step;
      const s = Math.sin(t), z = Math.cos(t); // z: 1 = front, -1 = back
      const depth = (z + 1) / 2;
      const x = s * rx;
      const y = z * ry - ry * 0.35;
      const scale = 0.55 + 0.45 * depth;
      const c = cards[i];
      c._x = x; c._y = y; c._scale = scale;
      let px = x, py = y, sc = scale, land = 1;
      const L = landing && landing.items[i];
      if (L) {
        land = easeInOut(Math.max(0, Math.min(1, (now - landing.t0 - i * landing.stagger) / landing.duration)));
        px = x + L.dx * (1 - land); py = y + L.dy * (1 - land);
        sc = scale * (L.k + (1 - L.k) * land);
      }
      c.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0) scale(${sc.toFixed(3)}) rotateY(${(-s * 18 * land).toFixed(1)}deg)`;
      // passing beside the model (z ≈ 0) the card fades out, so the swap behind/in front is invisible
      const side = Math.min(1, Math.abs(z) / 0.32);
      const fade = 0.08 + 0.92 * side * side * (3 - 2 * side);     // smoothstep
      const restOpacity = (0.35 + 0.65 * depth) * fade;
      c.style.opacity = (L ? 1 + (restOpacity - 1) * land : restOpacity).toFixed(3);
      const blur = (depth < 0.45 ? (0.45 - depth) * 5 : 0) + (1 - side) * 2.5;
      c.style.filter = blur > 0.05 ? `blur(${blur.toFixed(1)}px)` : "none";
      // behind the model when on the far side of the orbit
      c.style.zIndex = z < 0 ? String(Math.round(depth * 9)) : String(11 + Math.round(depth * 20));
      if (z > best) { best = z; bestI = i; }
    }
    setActive(bestI);
    if (landing && now - landing.t0 > landing.duration + landing.stagger * n + 50) landing = null;
  }

  // nearest angle at which card i sits in front
  function angleFor(i) {
    const base = -i * step;
    const k = Math.round((angle - base) / (Math.PI * 2));
    return base + k * Math.PI * 2;
  }
  function goTo(i) { target = angleFor(((i % n) + n) % n); velocity = 0; }

  document.getElementById("prev").addEventListener("click", () => goTo(active - 1));
  document.getElementById("next").addEventListener("click", () => goTo(active + 1));
  window.addEventListener("keydown", (e) => {
    if (window.scrollY > window.innerHeight * 0.6) return;
    if (e.key === "ArrowLeft") goTo(active - 1);
    if (e.key === "ArrowRight") goTo(active + 1);
  });

  /* drag */
  let dragging = false, moved = false, lastX = 0, startX = 0, lastT = 0;
  stage.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    dragging = true; moved = false;
    startX = lastX = e.clientX; lastT = performance.now();
    target = null; velocity = 0;
  });
  window.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    if (!moved && Math.abs(e.clientX - startX) > 6) {
      moved = true;
      stage.classList.add("dragging");
      try { stage.setPointerCapture(e.pointerId); } catch (_) {}
    }
    if (!moved) return;
    const now = performance.now();
    const d = dx * (1.6 / rx);
    angle += d;
    velocity = d / Math.max(1, now - lastT) * 16;
    lastX = e.clientX; lastT = now;
  });
  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    stage.classList.remove("dragging");
    if (!moved) return;
    setTimeout(() => (moved = false), 0);
    speed = 0; // auto-rotation fades back in after the throw
  };
  window.addEventListener("pointerup", endDrag);
  window.addEventListener("pointercancel", endDrag);

  // hovering a card slows the rotation down instead of stopping it
  cards.forEach((c) => {
    c.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") hovering = true; });
    c.addEventListener("pointerleave", () => (hovering = false));
  });

  /* loop */
  let prev = performance.now();
  function tick(now) {
    const dt = Math.min(48, now - prev) / 16.67;
    prev = now;
    const loading = document.documentElement.classList.contains("is-loading"); // hold still under the loader
    if (!dragging && !loading) {
      if (target !== null) {
        // arrows / clicks: glide to the chosen card, then keep slowly rotating
        const diff = target - angle;
        angle += diff * Math.min(1, 0.1 * dt);
        if (Math.abs(diff) < 0.002) { target = null; speed = 0; }
      } else {
        // momentum from a drag, decaying smoothly
        if (velocity) {
          angle += velocity * dt;
          velocity *= Math.pow(0.95, dt);
          if (Math.abs(velocity) < 0.0002) velocity = 0;
        }
        // slow auto-rotation never stops; slower while hovering a card
        if (!reduced && !document.hidden) {
          speed += ((hovering ? 0.2 : 1) - speed) * Math.min(1, 0.03 * dt);
          angle -= 0.0025 * speed * dt;
        }
      }
    }
    render();
    requestAnimationFrame(tick);
  }

  const start = () => {
    layout(); render(); requestAnimationFrame(tick);
    document.documentElement.classList.add("orbit-ready"); // the loader waits for this
    window.dispatchEvent(new Event("orbitready"));
  };
  window.addEventListener("resize", layout);
  const modelImg = model.querySelector(".model-img");
  if (modelImg.complete) start(); else modelImg.addEventListener("load", start, { once: true });

})();
