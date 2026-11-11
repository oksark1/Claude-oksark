/* Helpers shared by the home page (main.js) and project pages (project.js). */
(() => {
  const projects = window.PROJECTS || [];

  const slugify = (s) =>
    String(s).toLowerCase().replace(/[^a-z0-9а-яё]+/gi, "-").replace(/^-+|-+$/g, "");

  projects.forEach((p) => { if (!p.slug) p.slug = slugify(p.title); });

  /* Square/16:9 cover: real image if set, otherwise generated placeholder art */
  function cover(p, src) {
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

  const projectUrl = (p) => `project.html?p=${encodeURIComponent(p.slug)}`;

  window.Site = { projects, cover, projectUrl, slugify };

  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
