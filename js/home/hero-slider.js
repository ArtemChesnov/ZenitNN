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

  // Не переключать до полной загрузки
  nextImg.onload = () => {
    nextImg.classList.add("hero__background-active");
    activeImg.classList.remove("hero__background-active");

    current = nextIndex;
    isImg1Active = !isImg1Active;
  };

  // установить src ТОЛЬКО после удаления класса
  activeImg.classList.remove("hero__background-active");
  nextImg.src = images[nextIndex];
}

function startSlider() {
  if (sliderStarted) return;
  sliderStarted = true;

  setTimeout(() => {
    showNextImage();
    setInterval(showNextImage, 7000); // чуть больше пауза
  }, 4000);
}

export { preloadFirstImage, startSlider };
