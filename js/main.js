const titles = {
  ru: "Ансар Жалялов — роботы, AI, технический руководитель",
  en: "Ansar Zhalyalov — robots, AI, technical leader",
};
const descriptions = {
  ru: "Перевожу разработку на AI и запускаю роботов: агенты в Cursor и Claude, быстрее выпуск, меньше затрат на ИТ. Консалтинг и роли CTO, CIO, Head of Robotics.",
  en: "I move development onto AI and launch robots: agents in Cursor and Claude, faster delivery, lower IT cost. Consulting, and CTO, CIO, and Head of Robotics roles.",
};
let lang = document.documentElement.lang === "en" ? "en" : "ru";

const heroVideo = document.querySelector("#hero-video");
const videoToggle = document.querySelector("#video-toggle");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function syncVideoToggle() {
  if (!videoToggle || !heroVideo) return;
  const paused = heroVideo.paused;
  videoToggle.setAttribute("aria-pressed", String(paused));
  videoToggle.textContent = paused
    ? lang === "en" ? "Play" : "Смотреть"
    : lang === "en" ? "Pause" : "Пауза";
}

function applyLang(next) {
  lang = next === "en" ? "en" : "ru";
  document.documentElement.lang = lang;
  try { localStorage.setItem("az-lang", lang); } catch (e) {}
  document.title = titles[lang];
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", descriptions[lang]);
  document.querySelectorAll("[data-set-lang]").forEach((btn) => {
    btn.setAttribute("aria-pressed", String(btn.dataset.setLang === lang));
  });
  document.querySelectorAll("[data-alt-ru]").forEach((el) => {
    el.alt = el.getAttribute(lang === "en" ? "data-alt-en" : "data-alt-ru") || "";
  });
  syncVideoToggle();
}

document.querySelectorAll("[data-set-lang]").forEach((btn) => {
  btn.addEventListener("click", () => applyLang(btn.dataset.setLang));
});

const burger = document.querySelector(".burger");
const nav = document.querySelector("#nav");
function closeNav() {
  nav.classList.remove("open");
  burger.setAttribute("aria-expanded", "false");
  document.body.classList.remove("lock");
}
burger.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  burger.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("lock", open);
});
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNav));

const header = document.querySelector(".header");
function onScroll() {
  header.classList.toggle("scrolled", window.scrollY > 8);
}
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

if (heroVideo && videoToggle) {
  heroVideo.muted = true;
  heroVideo.playbackRate = 1.5;
  heroVideo.addEventListener("loadedmetadata", () => {
    heroVideo.playbackRate = 1.5;
  });
  if (reduceMotion) heroVideo.pause();
  else heroVideo.play().catch(() => {});
  videoToggle.addEventListener("click", () => {
    if (heroVideo.paused) heroVideo.play();
    else heroVideo.pause();
  });
  heroVideo.addEventListener("play", () => {
    heroVideo.playbackRate = 1.5;
    syncVideoToggle();
  });
  heroVideo.addEventListener("pause", syncVideoToggle);
}

const galleryObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const video = entry.target;
    if (entry.isIntersecting) {
      if (!video.getAttribute("src")) video.src = video.dataset.src;
      if (!reduceMotion) video.play().catch(() => {});
    } else {
      video.pause();
    }
  });
}, { rootMargin: "240px" });
document.querySelectorAll(".tile video").forEach((video) => galleryObserver.observe(video));

const dialog = document.querySelector("#lightbox");
const stage = document.querySelector("#lightbox-stage");
const caption = document.querySelector("#lightbox-caption");
document.querySelectorAll(".tile").forEach((tile) => {
  tile.addEventListener("click", () => {
    stage.replaceChildren();
    if (tile.dataset.kind === "video") {
      const video = document.createElement("video");
      video.controls = true;
      video.playsInline = true;
      video.autoplay = true;
      video.poster = tile.dataset.poster || "";
      video.src = tile.dataset.src;
      stage.append(video);
    } else {
      const img = document.createElement("img");
      img.src = tile.dataset.src;
      img.alt = "";
      stage.append(img);
    }
    const text = tile.querySelector(lang === "en" ? ".cap .en" : ".cap .ru");
    caption.textContent = text ? text.textContent : "";
    dialog.showModal();
  });
});
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener("close", () => stage.replaceChildren());

applyLang(lang);
