(() => {
  const projects = window.PROJECTS || [];
  const n = projects.length;
  const step = (Math.PI * 2) / n;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pad = (i) => String(i + 1).padStart(2, "0");

  const { cover, projectUrl } = window.Site;
  const openProject = (i) => { window.location.href = projectUrl(projects[i]); };

  /* ---------- Work list ---------- */
  const list = document.getElementById("workList");
  projects.forEach((p, i) => {
    const li = document.createElement("li");
    li.className = "work-item";
    const a = document.createElement("a");
    a.href = projectUrl(p);
    a.setAttribute("aria-label", `${p.title} — ${p.category}, ${p.year}`);
    a.innerHTML = `<div class="thumb"></div><h3 class="name"></h3>`;
    a.querySelector(".name").textContent = p.title;
    a.querySelector(".thumb").appendChild(cover(p));
    li.appendChild(a);
    list.appendChild(li);
  });
  if ("IntersectionObserver" in window && !reduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -10% 0px" });
    list.querySelectorAll(".work-item").forEach((el) => { el.classList.add("reveal"); io.observe(el); });
  }

  /* ---------- Orbit ---------- */
  const stage = document.getElementById("stage");
  const orbit = document.getElementById("orbit");
  const model = stage.querySelector(".model");
  const cards = projects.map((p, i) => {
    const b = document.createElement("button");
    b.className = "card";
    b.setAttribute("aria-label", `${p.title} — ${p.category}`);
    const c = cover(p);
    c.classList.add("cover");
    const label = document.createElement("span");
    label.className = "label";
    label.textContent = p.title;
    b.append(c, label);
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
  let pauseUntil = 0;
  let hovering = false;
  let speed = 1;          // auto-rotation speed multiplier

  function layout() {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    const mH = model.getBoundingClientRect().height || h * 0.6;
    const mobile = w < 860;
    cardW = mobile ? Math.max(92, Math.min(130, w * 0.26)) : Math.min(210, Math.max(150, w * 0.13));
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
    caption.title.textContent = projects[i].title;
    caption.cat.textContent = `${projects[i].category} · ${projects[i].year}`;
  }

  function render() {
    let best = -2, bestI = 0;
    for (let i = 0; i < n; i++) {
      const t = angle + i * step;
      const s = Math.sin(t), z = Math.cos(t); // z: 1 = front, -1 = back
      const depth = (z + 1) / 2;
      const x = s * rx;
      const y = z * ry - ry * 0.35;
      const scale = 0.55 + 0.45 * depth;
      const c = cards[i];
      c.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)}) rotateY(${(-s * 18).toFixed(1)}deg)`;
      c.style.opacity = (0.35 + 0.65 * depth).toFixed(3);
      c.style.filter = depth < 0.45 ? `blur(${((0.45 - depth) * 5).toFixed(1)}px)` : "none";
      // behind the model when on the far side of the orbit
      c.style.zIndex = z < -0.05 ? String(Math.round(depth * 9)) : String(11 + Math.round(depth * 20));
      if (z > best) { best = z; bestI = i; }
    }
    setActive(bestI);
  }

  // nearest angle at which card i sits in front
  function angleFor(i) {
    const base = -i * step;
    const k = Math.round((angle - base) / (Math.PI * 2));
    return base + k * Math.PI * 2;
  }
  function goTo(i) { target = angleFor(((i % n) + n) % n); velocity = 0; pauseUntil = performance.now() + 5000; }
  function snap() { goTo(Math.round(-angle / step)); }

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
    pauseUntil = performance.now() + 5000;
    if (!moved) return;
    setTimeout(() => (moved = false), 0);
    if (Math.abs(velocity) < 0.004) snap();
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
    if (!dragging) {
      if (Math.abs(velocity) > 0.0005) {
        angle += velocity * dt;
        velocity *= Math.pow(0.93, dt);
        if (Math.abs(velocity) <= 0.004) { velocity = 0; snap(); }
      } else if (target !== null) {
        const diff = target - angle;
        angle += diff * Math.min(1, 0.1 * dt);
        if (Math.abs(diff) < 0.0005) { angle = target; target = null; }
      } else if (!reduced && now > pauseUntil && !document.hidden) {
        // ease the auto-rotation speed toward its target (slower while hovering a card)
        speed += ((hovering ? 0.2 : 1) - speed) * Math.min(1, 0.06 * dt);
        angle -= 0.0025 * speed * dt;
      }
    }
    render();
    requestAnimationFrame(tick);
  }

  const start = () => { layout(); render(); requestAnimationFrame(tick); };
  window.addEventListener("resize", layout);
  if (model.complete) start(); else model.addEventListener("load", start, { once: true });

})();
