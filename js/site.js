const NAV = [
  ["index.html", "accueil", "Accueil"],
  ["projets.html", "projets", "Projets"],
  ["atelier.html", "equipe", "L'équipe"],
  ["press.html", "press", "Press"],
  ["contact.html", "contact", "Contact"],
];

function mountChrome() {
  const page = document.body.dataset.page || "";
  const header = document.getElementById("site-header");
  const footer = document.getElementById("site-footer");
  if (header) {
    header.innerHTML = `
      <a class="skip" href="#contenu">Aller au contenu</a>
      <header class="nav is-solid">
        <a class="brand" href="index.html" aria-label="Inside Mood, accueil">
          <span>Inside</span><span>Mood</span>
        </a>
        <button class="menu-btn" type="button" aria-expanded="false" aria-label="Ouvrir le menu">
          <span></span>
        </button>
        <ul class="nav-links">
          ${NAV.map(
            ([href, id, label]) =>
              `<li><a href="${href}"${id === page ? ' aria-current="page"' : ""}>${label}</a></li>`
          ).join("")}
        </ul>
      </header>`;
    const btn = header.querySelector(".menu-btn");
    const links = header.querySelector(".nav-links");
    btn.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    });
    links.addEventListener("click", (event) => {
      if (event.target.closest("a")) links.classList.remove("is-open");
    });
  }
  if (footer) {
    footer.innerHTML = `
      <footer class="site-footer">
        <div class="footer-grid">
          <div>
            <a class="brand" href="index.html"><span>Inside</span><span>Mood</span></a>
            <p class="fine">Architecture et architecture d'intérieur</p>
          </div>
          <div>
            <p>Route de l'État 9</p>
            <p>1380 Lasne — Belgique</p>
            <p><a href="tel:+32475691828">+32 475 69 18 28</a></p>
            <p><a href="mailto:sandrine@insidemood.be">sandrine@insidemood.be</a></p>
          </div>
          <div>
            <p><a href="https://www.instagram.com/insidemood_architecture/" target="_blank" rel="noreferrer">Instagram</a></p>
            <p><a href="https://www.facebook.com/profile.php?id=61566520197933" target="_blank" rel="noreferrer">Facebook</a></p>
            <p><a href="projets.html">Portfolio</a></p>
            <p><a href="contact.html">Contact</a></p>
          </div>
        </div>
        <p class="fine">© ${new Date().getFullYear()} Inside Mood · Lasne</p>
      </footer>`;
  }
}

function projectGroup(project) {
  const type = project.type || "";
  if (type.startsWith("Maison")) return "maisons";
  if (type === "Boutique") return "magasins";
  if (type === "Restaurant" || type === "Bar" || type === "Établissement") return "etablissements";
  return "autre";
}

function card(project) {
  const where = [project.type, project.place].filter(Boolean).join(" · ");
  return `
    <article class="card" data-group="${projectGroup(project)}">
      <a href="projet.html?id=${project.id}">
        <div class="media">
          <img src="${project.cover}" alt="${project.title}${project.place ? ", " + project.place : ""}">
        </div>
        <h3>${project.title}</h3>
        <p>${where}</p>
      </a>
    </article>`;
}

function personCard(person) {
  return `
    <article class="person">
      <img src="${person.photo}" alt="Portrait de ${person.name}">
      <h2>${person.name}</h2>
      <p class="role">${person.role}</p>
      <a href="mailto:${person.email}">${person.email}</a>
    </article>`;
}

function bindWordFilters(bar, items) {
  if (!bar) return;
  bar.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    const filter = button.dataset.filter;
    bar.querySelectorAll("button").forEach((item) => item.classList.toggle("is-on", item === button));
    items.forEach((item) => {
      item.hidden = filter !== "tous" && item.dataset.group !== filter;
    });
  });
}

function soonSlides(item) {
  return `<div class="soon-slides">${item.images.map((src, imageIndex) => `
    <img src="${src}" alt="${imageIndex === 0 ? `${item.title}, ${item.place}, projet en cours` : ""}"${imageIndex === 0 ? ' class="is-on"' : ""}>`
  ).join("")}</div>`;
}

function soonCard(item) {
  const visual = item.images && item.images.length
    ? soonSlides(item)
    : item.image
      ? `<img src="${item.image}" alt="${item.title}, ${item.place}">`
      : "";
  return `
    <li class="soon-card">
      <div class="soon-visual">${visual}</div>
      <h3>${item.title}</h3>
      <p>${item.place}</p>
    </li>`;
}

function bindSoonSlides() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll(".soon-slides").forEach((slides) => {
    const imgs = [...slides.querySelectorAll("img")];
    if (imgs.length < 2) return;
    let index = 0;
    let paused = false;
    const card = slides.closest(".soon-card");
    card.addEventListener("mouseenter", () => { paused = true; });
    card.addEventListener("mouseleave", () => { paused = false; });
    window.setInterval(() => {
      if (paused) return;
      imgs[index].classList.remove("is-on");
      index = (index + 1) % imgs.length;
      imgs[index].classList.add("is-on");
    }, 3800);
  });
}

function renderHome() {
  const grid = document.getElementById("work-grid");
  if (grid) {
    grid.innerHTML = PROJECTS.map(card).join("");
    bindWordFilters(document.getElementById("home-filters"), [...grid.querySelectorAll(".card")]);
  }
  const list = document.getElementById("ongoing-list");
  if (list) {
    const set = ONGOING.map(soonCard).join("");
    list.innerHTML = `<ul class="soon-set">${set}</ul><ul class="soon-set" aria-hidden="true">${set}</ul>`;
    bindSoonSlides();
  }
  const team = document.getElementById("team-home");
  if (team) team.innerHTML = TEAM.map(personCard).join("");
  const compares = document.getElementById("compare-row");
  if (compares && typeof COMPARES !== "undefined") {
    compares.innerHTML = COMPARES.map(compareCard).join("");
    bindCompares(compares);
  }
}

function compareCard(item) {
  return `
    <article class="compare-card">
      <div class="compare" style="--pos: 50%">
        <img class="compare-after" src="${item.after}" alt="Après, ${item.title}" draggable="false">
        <img class="compare-before" src="${item.before}" alt="Avant, ${item.title}" draggable="false">
        <span class="compare-tag is-before">Avant</span>
        <span class="compare-tag is-after">Après</span>
        <span class="compare-line" aria-hidden="true"></span>
        <input type="range" min="0" max="100" value="50" aria-label="Glisser pour comparer l'avant et l'après, ${item.title}">
      </div>
      <a class="compare-name" href="projet.html?id=${item.id}">${item.title}</a>
    </article>`;
}

function bindCompares(scope) {
  scope.querySelectorAll(".compare").forEach((node) => {
    const range = node.querySelector("input");
    const set = (value) => {
      const next = Math.max(0, Math.min(100, Number(value)));
      node.style.setProperty("--pos", next + "%");
      range.setAttribute("aria-valuetext", Math.round(next) + " pour cent vers l'après");
    };
    range.addEventListener("input", () => set(range.value));
    set(range.value);
  });
}

function renderIndex() {
  const folio = document.getElementById("folio-grid");
  if (folio) {
    folio.innerHTML = PROJECTS.map(card).join("");
    bindWordFilters(document.getElementById("filters"), [...folio.querySelectorAll(".card")]);
    return;
  }
  const list = document.getElementById("index-list");
  const preview = document.getElementById("index-preview-img");
  const caption = document.getElementById("index-caption");
  if (!list || !preview) return;

  const filters = ["Tous", "Restaurant", "Bar", "Boutique", "Maison", "Établissement"];
  const bar = document.getElementById("filters");
  let current = "Tous";

  function matches(project) {
    if (current === "Tous") return true;
    if (current === "Maison") return project.type.startsWith("Maison");
    return project.type === current;
  }

  function paint(projects) {
    const featured = projects.filter((project) => project.featured);
    const more = projects.filter((project) => !project.featured);
    const row = (project, index) => {
      const where = [project.type, project.place, project.year].filter(Boolean).join(" · ");
      return `
        <li>
          <a href="projet.html?id=${project.id}" data-cover="${project.cover}" data-title="${project.title}">
            <span class="num">${String(index + 1).padStart(2, "0")}</span>
            <span class="name">${project.title}</span>
            <span class="where">${where}</span>
          </a>
        </li>`;
    };
    let html = featured.map(row).join("");
    if (more.length && current === "Tous") {
      html += `<li class="group-label">Plus de projets</li>`;
      html += more.map((project, index) => row(project, featured.length + index)).join("");
    } else if (current !== "Tous") {
      html += more.map((project, index) => row(project, featured.length + index)).join("");
    }
    list.innerHTML = html || `<li class="empty">Aucun projet dans cette catégorie.</li>`;
    const first = projects[0];
    if (first) {
      preview.src = first.cover;
      preview.alt = first.title;
      caption.textContent = first.title;
    }
  }

  bar.innerHTML = filters
    .map(
      (name, index) =>
        `<button type="button" class="${index === 0 ? "is-on" : ""}" data-filter="${name}">${name}</button>`
    )
    .join("");
  bar.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    current = button.dataset.filter;
    bar.querySelectorAll("button").forEach((item) => item.classList.toggle("is-on", item === button));
    paint(PROJECTS.filter(matches));
  });
  list.addEventListener("mouseover", (event) => {
    const link = event.target.closest("a");
    if (!link) return;
    preview.src = link.dataset.cover;
    preview.alt = link.dataset.title;
    caption.textContent = link.dataset.title;
    list.querySelectorAll("a").forEach((item) => item.classList.toggle("is-on", item === link));
  });
  paint(PROJECTS);
}

function renderProject() {
  const root = document.getElementById("project-root");
  if (!root) return;
  const id = new URLSearchParams(location.search).get("id");
  const index = PROJECTS.findIndex((project) => project.id === id);
  const project = PROJECTS[index];
  if (!project) {
    root.innerHTML = `<p class="empty">Ce projet est introuvable. <a class="text-link" href="projets.html">Retour au portfolio</a></p>`;
    return;
  }
  document.title = `${project.title} · Inside Mood`;
  const meta = [project.type, project.place, project.year].filter(Boolean);
  const prev = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  const rest = project.images.slice(1);
  root.innerHTML = `
    <header class="project-hero">
      <p class="crumbs"><a href="projets.html">Projets</a></p>
      <h1>${project.title}</h1>
      ${meta.length ? `<ul class="meta-row">${meta.map((item) => `<li>${item}</li>`).join("")}</ul>` : ""}
    </header>
    ${
      typeof COMPARES !== "undefined" && COMPARES.some((item) => item.id === project.id)
        ? `<div class="compare-row project-compares">${COMPARES.filter((item) => item.id === project.id)
            .map(compareCard)
            .join("")}</div>`
        : ""
    }
    <div class="project-lead${project.text.length ? "" : " is-solo"}">
      ${
        project.text.length
          ? `<div class="project-text">${project.text.map((paragraph) => `<p>${paragraph}</p>`).join("")}</div>`
          : ""
      }
      <figure class="project-cover">
        <img src="${project.images[0]}" alt="${project.title}">
      </figure>
    </div>
    ${
      rest.length
        ? `<div class="mosaic">${rest
            .map(
              (src, imageIndex) =>
                `<figure><img src="${src}" alt="${project.title}, vue ${imageIndex + 2}" loading="lazy"></figure>`
            )
            .join("")}</div>`
        : ""
    }
    <nav class="pager" aria-label="Projets voisins">
      <a href="projet.html?id=${prev.id}"><small>Précédent</small><strong>${prev.title}</strong></a>
      <a class="next" href="projet.html?id=${next.id}"><small>Suivant</small><strong>${next.title}</strong></a>
    </nav>`;

  bindCompares(root);
  const shots = [...root.querySelectorAll(".project-cover img, .mosaic img")];
  const box = document.createElement("div");
  box.className = "lightbox";
  box.innerHTML = `
    <button class="lb-close" type="button" aria-label="Fermer">×</button>
    <button class="lb-prev" type="button" aria-label="Image précédente">‹</button>
    <img alt="">
    <button class="lb-next" type="button" aria-label="Image suivante">›</button>`;
  document.body.appendChild(box);
  const view = box.querySelector("img");
  let cursor = 0;
  const open = (imageIndex) => {
    cursor = imageIndex;
    view.src = shots[cursor].src;
    view.alt = shots[cursor].alt;
    box.classList.add("is-open");
  };
  shots.forEach((image, imageIndex) => {
    image.addEventListener("click", () => open(imageIndex));
  });
  const shift = (step) => open((cursor + step + shots.length) % shots.length);
  box.querySelector(".lb-close").addEventListener("click", () => box.classList.remove("is-open"));
  box.querySelector(".lb-prev").addEventListener("click", () => shift(-1));
  box.querySelector(".lb-next").addEventListener("click", () => shift(1));
  box.addEventListener("click", (event) => {
    if (event.target === box) box.classList.remove("is-open");
  });
  document.addEventListener("keydown", (event) => {
    if (!box.classList.contains("is-open")) return;
    if (event.key === "Escape") box.classList.remove("is-open");
    if (event.key === "ArrowRight") shift(1);
    if (event.key === "ArrowLeft") shift(-1);
  });
}

function bindContact() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("nom") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const subject = encodeURIComponent(`Demande de projet — ${name || "Inside Mood"}`);
    const body = encodeURIComponent(`${message}\n\n${name}\n${email}`);
    window.location.href = `mailto:sandrine@insidemood.be?subject=${subject}&body=${body}`;
  });
}

function bindProcess() {
  const board = document.getElementById("process-board");
  if (!board) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const narrow = window.matchMedia("(max-width: 800px)").matches;
  if (reduce || narrow) return;

  const steps = [...board.querySelectorAll(".pc")];
  const lines = [...board.querySelectorAll(".process-line")];
  const dots = [...board.querySelectorAll(".process-dot")];

  const play = () => {
    if (board.dataset.played) return;
    board.dataset.played = "1";
    board.classList.add("is-animated");

    const show = (index) => {
      steps[index].classList.add("is-on");
      dots[index].classList.add("is-on");
    };

    const draw = (index) => {
      if (index >= lines.length) return;
      const line = lines[index];
      const done = (event) => {
        if (event.propertyName !== "stroke-dashoffset") return;
        line.removeEventListener("transitionend", done);
        if (steps[index + 1]) show(index + 1);
        window.setTimeout(() => draw(index + 1), 240);
      };
      line.addEventListener("transitionend", done);
      line.classList.add("is-drawn");
    };

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        show(0);
        window.setTimeout(() => draw(0), 520);
      });
    });
  };

  if (!("IntersectionObserver" in window)) {
    play();
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      play();
      observer.disconnect();
    }
  }, { threshold: 0.4 });
  observer.observe(board);
}

function bindFaq() {
  const list = document.querySelector(".faq");
  if (!list) return;
  list.addEventListener("click", (event) => {
    const button = event.target.closest(".faq-toggle");
    if (!button) return;
    const item = button.closest(".faq-item");
    const willOpen = !item.classList.contains("is-open");
    list.querySelectorAll(".faq-item").forEach((node) => {
      node.classList.remove("is-open");
      const toggle = node.querySelector(".faq-toggle");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Afficher la réponse");
    });
    if (willOpen) {
      item.classList.add("is-open");
      button.setAttribute("aria-expanded", "true");
      button.setAttribute("aria-label", "Réduire la réponse");
    }
  });
}

function bindReveal() {
  if (!document.body.classList.contains("home")) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!("IntersectionObserver" in window)) return;

  const nodes = [...document.querySelectorAll([
    ".gb-marks",
    ".gb-story .gb-mood",
    ".gb-story-copy",
    ".gb-cats",
    ".gb-projects > h2",
    ".gb-projects .card",
    ".compare-section .section-head",
    ".compare-card",
    ".ongoing-light > .eyebrow",
    ".ongoing-light .soon-marquee",
    ".process .section-head",
    ".bureau > .eyebrow",
    ".bureau > h2",
    ".bureau .person",
    ".faq-section > .eyebrow",
    ".faq-section > h2",
    ".faq-item",
    ".partners .section-head",
    ".partner-row li",
    ".site-footer",
  ].join(","))];
  if (!nodes.length) return;

  const groups = new Map();
  nodes.forEach((node) => {
    node.classList.add("reveal");
    const list = groups.get(node.parentElement) || [];
    list.push(node);
    groups.set(node.parentElement, list);
  });
  groups.forEach((list) => {
    list.forEach((node, index) => {
      node.style.transitionDelay = `${Math.min(index, 8) * 70}ms`;
    });
  });
  document.body.classList.add("reveal-ready");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.16, rootMargin: "0px 0px -6% 0px" });

  window.requestAnimationFrame(() => {
    nodes.forEach((node) => observer.observe(node));
  });
}

mountChrome();
renderHome();
renderIndex();
renderProject();
bindContact();
bindProcess();
bindFaq();
bindReveal();
