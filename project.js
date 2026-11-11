(() => {
  const { projects, cover, projectUrl } = window.Site;
  const slug = new URLSearchParams(location.search).get("p");
  let i = projects.findIndex((p) => p.slug === slug);
  if (i < 0) { location.replace("index.html#work"); return; }
  const p = projects[i];

  document.title = `${p.title} — Daniil Krasko`;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.content = p.intro || p.text || desc.content;

  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };

  /* head */
  document.getElementById("caseTitle").textContent = p.title;
  document.getElementById("caseIntro").textContent = p.intro || p.text || "";
  const meta = document.getElementById("caseMeta");
  const rows = [["Category", p.category], ["Year", p.year]];
  if (p.tags && p.tags.length) rows.push(["Scope", p.tags.join(", ")]);
  rows.forEach(([k, v]) => meta.append(el("dt", "muted", k), el("dd", null, v)));
  if (p.link) {
    const dd = el("dd");
    const a = el("a", "ul", "Visit ↗");
    a.href = p.link; a.target = "_blank"; a.rel = "noopener";
    dd.appendChild(a);
    meta.append(el("dt", "muted", "Link"), dd);
  }

  /* cover */
  const coverEl = document.getElementById("caseCover");
  if (p.image) {
    const img = el("img");
    img.src = p.image; img.alt = p.title;
    coverEl.appendChild(img);
  } else {
    coverEl.classList.add("is-art");
    coverEl.appendChild(cover(p));
  }

  /* body — falls back to a placeholder long-read */
  const body = p.body || [
    { h: "Overview" },
    { p: p.text || "" },
    { h: "The task" },
    { p: "[Placeholder — describe the brief: who the client was, what needed to be solved and your role.]" },
    { img: null, caption: "[Placeholder — key screen or visual]", wide: true },
    { h: "Process" },
    { p: "[Placeholder — research, ideas, iterations. Explain the decisions that shaped the final design.]" },
    { img: null, caption: "[Placeholder — details, sketches, variations]" },
    { h: "Result" },
    { p: "[Placeholder — what was launched and what changed for the client.]" },
  ];

  const root = document.getElementById("caseBody");
  body.forEach((b) => {
    if (b.h) root.appendChild(el("h2", null, b.h));
    else if (b.p) root.appendChild(el("p", null, b.p));
    else if ("img" in b) {
      const fig = el("figure", b.wide ? "wide" : "");
      if (b.img) {
        const img = el("img");
        img.src = b.img; img.alt = b.caption || p.title; img.loading = "lazy";
        fig.appendChild(img);
      } else {
        const ph = el("div", "ph");
        ph.appendChild(cover(p, null));
        fig.appendChild(ph);
      }
      if (b.caption) fig.appendChild(el("figcaption", "muted", b.caption));
      root.appendChild(fig);
    }
  });

  /* next project */
  const next = projects[(i + 1) % projects.length];
  const nav = document.getElementById("caseNext");
  nav.append(el("p", "muted", "Next project"));
  const a = el("a", "next-link");
  a.href = projectUrl(next);
  const thumb = el("div", "thumb");
  thumb.appendChild(cover(next));
  a.append(thumb, el("span", "name", `${next.title} →`));
  nav.appendChild(a);
})();
