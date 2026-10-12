const titles = {
  ru: "Ансар Жалялов — роботы, AI, технический руководитель",
  en: "Ansar Zhalyalov — robots, AI, technical leader",
};
const descriptions = {
  ru: "Запускаю роботов и перевожу разработку компании на AI: агенты в Cursor и Claude, быстрее выпуск, меньше затрат на ИТ. Консалтинг и роли CTO, CIO, Head of Robotics.",
  en: "I launch robots and move a company's engineering onto AI: agents in Cursor and Claude, faster delivery, lower IT cost. Consulting, and CTO, CIO, or Head of Robotics roles.",
};
const errors = {
  ru: {
    name: "Укажите имя.",
    contact: "Укажите контакт для ответа.",
    type: "Выберите тип запроса.",
    message: "Опишите задачу чуть подробнее.",
    captcha: "Проверьте ответ на пример.",
    consent: "Нужно согласие, чтобы отправить заявку.",
  },
  en: {
    name: "Add your name.",
    contact: "Add a contact for the reply.",
    type: "Choose a request type.",
    message: "Describe the task in a bit more detail.",
    captcha: "Check the answer.",
    consent: "Consent is required to send the request.",
  },
};

let lang = document.documentElement.lang === "en" ? "en" : "ru";
let captchaA = 0;
let captchaB = 0;

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

function refreshCaptchaLabel() {
  const label = document.querySelector("#captcha-label");
  if (!label) return;
  label.textContent = lang === "en"
    ? `What is ${captchaA} + ${captchaB}?`
    : `Сколько будет ${captchaA} + ${captchaB}?`;
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
  document.querySelectorAll("[data-ph-ru]").forEach((el) => {
    el.placeholder = el.getAttribute(lang === "en" ? "data-ph-en" : "data-ph-ru") || "";
  });
  document.querySelectorAll("option[data-ru]").forEach((opt) => {
    opt.textContent = opt.getAttribute(lang === "en" ? "data-en" : "data-ru") || opt.textContent;
  });
  document.querySelectorAll("[data-alt-ru]").forEach((el) => {
    el.alt = el.getAttribute(lang === "en" ? "data-alt-en" : "data-alt-ru") || "";
  });
  refreshCaptchaLabel();
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

captchaA = 2 + Math.floor(Math.random() * 8);
captchaB = 2 + Math.floor(Math.random() * 7);

const form = document.querySelector("#request-form");
const formError = document.querySelector("#form-error");
const success = document.querySelector("#form-success");

function mark(el, bad) {
  el.classList.toggle("invalid", bad);
  if (bad) el.setAttribute("aria-invalid", "true");
  else el.removeAttribute("aria-invalid");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (form.website.value.trim()) return;

  const name = form.name.value.trim();
  const company = form.company.value.trim();
  const contact = form.contact.value.trim();
  const type = form.type.value;
  const message = form.message.value.trim();
  const answer = Number(form.captcha.value.trim());
  const copy = errors[lang];
  let error = "";

  mark(form.name, !name);
  mark(form.contact, !contact);
  mark(form.type, !type);
  mark(form.message, message.length < 10);
  mark(form.captcha, answer !== captchaA + captchaB);

  if (!name) error = copy.name;
  else if (!contact) error = copy.contact;
  else if (!type) error = copy.type;
  else if (message.length < 10) error = copy.message;
  else if (answer !== captchaA + captchaB) error = copy.captcha;
  else if (!form.consent.checked) error = copy.consent;

  formError.textContent = error;
  if (error) return;

  const typeLabel = form.type.selectedOptions[0].textContent;
  const text = lang === "en"
    ? `Hello! My name is ${name}${company ? `, ${company}` : ""}.\nRequest: ${typeLabel}\nContact: ${contact}\n\n${message}`
    : `Здравствуйте! Меня зовут ${name}${company ? `, ${company}` : ""}.\nТип запроса: ${typeLabel}\nКонтакт: ${contact}\n\n${message}`;
  const subject = lang === "en" ? `Website request: ${typeLabel}` : `Запрос с сайта: ${typeLabel}`;

  document.querySelector("#wa-link").href = `https://wa.me/79653214872?text=${encodeURIComponent(text)}`;
  document.querySelector("#mail-link").href = `mailto:ansaril3g@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
  form.hidden = true;
  success.hidden = false;
});

applyLang(lang);
