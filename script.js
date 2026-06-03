let slides = Array.from(document.querySelectorAll(".slide"));
const dotsContainer = document.querySelector("[data-dots]");
const prevButton = document.querySelector("[data-prev]");
const nextButton = document.querySelector("[data-next]");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const projectForm = document.querySelector("#projectForm");
const projectImage = document.querySelector("#projectImage");
const projectTitle = document.querySelector("#projectTitle");
const projectCategory = document.querySelector("#projectCategory");
const projectDescription = document.querySelector("#projectDescription");
const imagePreview = document.querySelector("#imagePreview");
const previewTitle = document.querySelector("#previewTitle");
const previewDescription = document.querySelector("#previewDescription");
const clearProjects = document.querySelector("#clearProjects");
const adminAccess = document.querySelector("#adminAccess");
const loginOverlay = document.querySelector("#loginOverlay");
const loginForm = document.querySelector("#loginForm");
const loginClose = document.querySelector("#loginClose");
const adminEmail = document.querySelector("#adminEmail");
const adminPassword = document.querySelector("#adminPassword");
const loginError = document.querySelector("#loginError");
const adminSection = document.querySelector("#admin");
const adminLogout = document.querySelector("#adminLogout");
const heroSlider = document.querySelector(".hero-slider");
const portfolioGrid = document.querySelector(".portfolio-grid");
const uploadedProjectsKey = "kongowea_uploaded_projects";
const adminSessionKey = "kongowea_admin_logged_in";
const adminLogin = {
  email: "gathogosimon79@gmail.com",
  password: "..Kongowea@254"
};
let currentSlide = 0;
let sliderTimer;

function showSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => slide.classList.toggle("active", slideIndex === currentSlide));
  document.querySelectorAll(".slider-dots button").forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === currentSlide));
}

function startSlider() {
  clearInterval(sliderTimer);
  sliderTimer = setInterval(() => showSlide(currentSlide + 1), 5500);
}

function rebuildDots() {
  dotsContainer.innerHTML = "";
  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Show project ${index + 1}`);
    dot.addEventListener("click", () => {
      showSlide(index);
      startSlider();
    });
    dotsContainer.appendChild(dot);
  });
  showSlide(Math.min(currentSlide, slides.length - 1));
}

function getUploadedProjects() {
  try {
    return JSON.parse(localStorage.getItem(uploadedProjectsKey)) || [];
  } catch {
    return [];
  }
}

function saveUploadedProjects(projects) {
  localStorage.setItem(uploadedProjectsKey, JSON.stringify(projects));
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function addProjectToPage(project) {
  const title = escapeHtml(project.title);
  const category = escapeHtml(project.category);
  const description = escapeHtml(project.description);
  const slide = document.createElement("article");
  slide.className = "slide project-slide";
  slide.style.setProperty("--image", `url('${project.image}')`);
  slide.innerHTML = `
    <div class="slide-content">
      <span class="badge">${category}</span>
      <h1>${title} <span>Featured Project</span></h1>
      <p>${description}</p>
      <div class="hero-actions">
        <a href="#portfolio" class="primary-btn">View Projects</a>
        <a href="https://wa.me/254798137188" target="_blank" rel="noreferrer" class="secondary-btn">WhatsApp</a>
      </div>
    </div>
  `;
  heroSlider.appendChild(slide);

  const card = document.createElement("article");
  card.className = "uploaded-card";
  card.innerHTML = `
    <img src="${project.image}" alt="${title}" />
    <div><h3>${title}</h3><p>${description}</p></div>
  `;
  portfolioGrid.prepend(card);

  slides = Array.from(document.querySelectorAll(".slide"));
  rebuildDots();
}

function readImageAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function showLogin() {
  loginOverlay.classList.remove("is-hidden");
  loginOverlay.setAttribute("aria-hidden", "false");
  loginError.textContent = "";
  adminEmail.focus();
}

function hideLogin() {
  loginOverlay.classList.add("is-hidden");
  loginOverlay.setAttribute("aria-hidden", "true");
  loginForm.reset();
}

function showAdmin() {
  adminSection.classList.remove("is-hidden");
  adminSection.setAttribute("aria-hidden", "false");
  adminAccess.classList.add("is-hidden");
}

function hideAdmin() {
  adminSection.classList.add("is-hidden");
  adminSection.setAttribute("aria-hidden", "true");
  adminAccess.classList.remove("is-hidden");
}

getUploadedProjects().forEach(addProjectToPage);
rebuildDots();

if (sessionStorage.getItem(adminSessionKey) === "true") {
  showAdmin();
}

prevButton.addEventListener("click", () => {
  showSlide(currentSlide - 1);
  startSlider();
});

nextButton.addEventListener("click", () => {
  showSlide(currentSlide + 1);
  startSlider();
});

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

adminAccess.addEventListener("click", showLogin);
loginClose.addEventListener("click", hideLogin);

loginOverlay.addEventListener("click", (event) => {
  if (event.target === loginOverlay) {
    hideLogin();
  }
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = adminEmail.value.trim().toLowerCase();
  const password = adminPassword.value;

  if (email === adminLogin.email && password === adminLogin.password) {
    sessionStorage.setItem(adminSessionKey, "true");
    hideLogin();
    showAdmin();
    adminSection.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  loginError.textContent = "Wrong email or password.";
});

adminLogout.addEventListener("click", () => {
  sessionStorage.removeItem(adminSessionKey);
  hideAdmin();
  window.location.hash = "";
});

projectImage.addEventListener("change", async () => {
  const file = projectImage.files[0];
  if (!file) return;
  const image = await readImageAsDataUrl(file);
  imagePreview.src = image;
});

[projectTitle, projectDescription].forEach((field) => {
  field.addEventListener("input", () => {
    previewTitle.textContent = projectTitle.value || "Your project title";
    previewDescription.textContent = projectDescription.value || "Choose an image and fill the form to preview your upload.";
  });
});

projectForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const file = projectImage.files[0];
  if (!file) return;

  const project = {
    image: await readImageAsDataUrl(file),
    title: projectTitle.value.trim(),
    category: projectCategory.value.trim(),
    description: projectDescription.value.trim()
  };

  const projects = getUploadedProjects();
  projects.unshift(project);
  saveUploadedProjects(projects);
  addProjectToPage(project);
  showSlide(slides.length - 1);
  startSlider();
  projectForm.reset();
  previewTitle.textContent = "Your project title";
  previewDescription.textContent = "Choose an image and fill the form to preview your upload.";
});

clearProjects.addEventListener("click", () => {
  localStorage.removeItem(uploadedProjectsKey);
  window.location.reload();
});

startSlider();
