/*
  Intro loader (home page): ~1.8s.
  · bottom-right: rolling percentage counter
  · centre: hero-carousel projects appear one by one and chase the cursor like a snake
    (no mouse → they drift around the centre on their own)
  · at 100%: the background dissolves and each card flies to its place in the hero carousel
*/
(() => {
  const root = document.documentElement;
  const loader = document.getElementById("loader");
  if (!loader) return;
  if (!root.classList.contains("is-loading")) { loader.remove(); return; }

  const { projects, cover } = window.Site;

  /* block scrolling while loading, but keep the scrollbar (no layout jump when it ends) */
  const block = (e) => { e.preventDefault(); e.stopImmediatePropagation(); };
  const keyBlock = (e) => {
    if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", " ", "Home", "End"].includes(e.key)) block(e);
  };
  addEventListener("wheel", block, { capture: true, passive: false });
  addEventListener("touchmove", block, { capture: true, passive: false });
  addEventListener("keydown", keyBlock, { capture: true });
  const unblock = () => {
    removeEventListener("wheel", block, { capture: true });
    removeEventListener("touchmove", block, { capture: true });
    removeEventListener("keydown", keyBlock, { capture: true });
  };
  window.scrollTo(0, 0);
  const featured = projects.slice(0, 9);
  const DURATION = 1700;

  /* ---------- rolling counter ---------- */
  const digitsEl = document.getElementById("loaderDigits");
  const cols = [0, 1, 2].map(() => {
    const col = document.createElement("span");
    col.className = "digit";
    const strip = document.createElement("span");
    strip.className = "strip";
    strip.innerHTML = "0123456789".split("").map((d) => `<i>${d}</i>`).join("");
    col.appendChild(strip);
    digitsEl.appendChild(col);
    return { col, strip };
  });
  const setCount = (n) => {
    const s = String(n);
    cols.forEach((c, i) => {
      const ch = s[s.length - 3 + i];          // right-align into 3 columns
      const appearing = ch !== undefined && c.col.classList.contains("hidden");
      c.col.classList.toggle("hidden", ch === undefined);
      if (appearing) c.strip.style.transition = "none";   // a new column shows its digit at once
      c.strip.style.transform = `translateY(${-(ch === undefined ? 0 : +ch) * 0.78}em)`;
      if (appearing) { c.strip.offsetHeight; c.strip.style.transition = ""; }
    });
  };
  setCount(0);

  /* ---------- snake of cards following the cursor ---------- */
  const wrap = document.getElementById("loaderCards");
  const size = () => (innerWidth < 860 ? 92 : 150);
  const cards = featured.map((p, i) => {
    const el = document.createElement("div");
    el.className = "loader-card";
    el.style.zIndex = String(featured.length - i);
    const c = cover(p, p.image || null);
    el.appendChild(c);
    wrap.appendChild(el);
    return { el, x: innerWidth / 2, y: innerHeight / 2, born: 120 + i * 85, s: 0 };
  });

  let mx = innerWidth / 2, my = innerHeight / 2, lastMove = -1e9;
  const onMove = (e) => { mx = e.clientX; my = e.clientY; lastMove = performance.now(); };
  addEventListener("pointermove", onMove, { passive: true });

  const t0 = performance.now();
  let flying = false, lastTick = 0;
  const loop = (now) => {
    if (flying) return;
    const t = Math.max(0, now - t0);
    // idle: wander on a soft figure-eight around the centre
    let tx = mx, ty = my;
    if (now - lastMove > 500) {
      const a = t / 650;
      tx = innerWidth / 2 + Math.sin(a) * Math.min(260, innerWidth * 0.28);
      ty = innerHeight / 2 + Math.sin(a * 2) * Math.min(110, innerHeight * 0.14);
    }
    const sz = size();
    cards.forEach((c, i) => {
      const lead = i === 0 ? { x: tx, y: ty } : cards[i - 1];
      const k = i === 0 ? 0.2 : 0.3;
      c.x += (lead.x - c.x) * k; c.y += (lead.y - c.y) * k;
      const target = t > c.born ? 1 : 0;
      c.s += (target - c.s) * 0.18;
      c.el.style.width = c.el.style.height = sz + "px";
      c.el.style.transform = `translate3d(${c.x - sz / 2}px, ${c.y - sz / 2}px, 0) scale(${c.s.toFixed(3)})`;
    });
    // progress: eased over DURATION, holds at 99 until the hero carousel is ready
    let p = Math.min(1, t / DURATION);
    p = 1 - Math.pow(1 - p, 2.2);
    let n = Math.round(p * 100);
    const ready = root.classList.contains("orbit-ready");
    if (n >= 100 && !ready) n = 99;
    if (n >= 100 || now - lastTick > 260) { setCount(n); lastTick = now; }
    if (n >= 100) finish(); else requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  /* ---------- fly into the hero carousel ---------- */
  function finish() {
    flying = true;
    removeEventListener("pointermove", onMove);
    const targets = [...document.querySelectorAll("#orbit .card")];
    const sz = size();
    loader.classList.add("done");
    cards.forEach((c, i) => {
      const t = targets[i];
      if (!t) { c.el.style.opacity = "0"; return; }
      const r = t.getBoundingClientRect();
      const op = getComputedStyle(t).opacity;
      c.el.style.transition =
        `transform .85s cubic-bezier(.7,0,.2,1) ${i * 35}ms, opacity .5s ease ${i * 35 + 350}ms`;
      c.el.style.transform = `translate3d(${r.left}px, ${r.top}px, 0) scale(${(r.width / sz).toFixed(4)})`;
      c.el.style.transformOrigin = "0 0";
      c.el.style.setProperty("--to-opacity", op);
      c.el.classList.add("to-orbit");
    });
    // when the cards land, hand over to the real carousel
    setTimeout(() => {
      root.classList.remove("is-loading");
      unblock();
      loader.classList.add("gone");
      setTimeout(() => loader.remove(), 700);
    }, 850 + featured.length * 35);
  }

  // safety net: never block the page for more than 6s
  setTimeout(() => { if (!flying) { root.classList.add("orbit-ready"); } }, 6000);
})();
