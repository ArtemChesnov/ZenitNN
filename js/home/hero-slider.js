// Слайдер hero секции
let sliderStarted = false;
const images = ["./img/hero-1.webp", "./img/hero-2.webp", "./img/hero-3.webp"];
let current = 0;
let isImg1Active = true;

const img1 = document.getElementById("img1");
const img2 = document.getElementById("img2");

function preloadFirstImage() {
  img1.src = images[0];
  img1.classList.add("hero__background-active");
}

function showNextImage() {
  const nextIndex = (current + 1) % images.length;
  const activeImg = isImg1Active ? img1 : img2;
  const nextImg = isImg1Active ? img2 : img1;

  nextImg.src = images[nextIndex];
  nextImg.classList.add("hero__background-active");
  activeImg.classList.remove("hero__background-active");

  current = nextIndex;
  isImg1Active = !isImg1Active;
}

function startSlider() {
  if (sliderStarted) return;
  setInterval(showNextImage, 4000);
  sliderStarted = true;
}

export { preloadFirstImage, startSlider };
