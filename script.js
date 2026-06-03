const slides = Array.from(document.querySelectorAll(".slide"));
const dotsContainer = document.querySelector("[data-dots]");
const prevButton = document.querySelector("[data-prev]");
const nextButton = document.querySelector("[data-next]");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
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

showSlide(0);
startSlider();
