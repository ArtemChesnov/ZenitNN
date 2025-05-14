b// Изменение фона хедера при скролле

const header = document.querySelector(".header");
const dropDown = document.querySelector(".header__dropdown");
const dropdownLink = document.querySelectorAll(".header__dropdown-link");

window.onscroll = function () {
  if (window.scrollY > 204) {
    header.style.background = "#3CA0DB";
    dropDown.classList.add("header__dropdown--white");

    dropdownLink.forEach((el) =>
      el.classList.add("header__dropdown-link--white")
    );
  } else {
    header.style.background = "transparent";
    dropDown.classList.remove("header__dropdown--white");

    dropdownLink.forEach((el) =>
      el.classList.remove("header__dropdown-link--white")
    );
  }
};

// Слайдер hero секции

let sliderStarted = false;

const images = ["./img/hero-1.webp", "./img/hero-2.webp", "./img/hero-3.webp"];

let current = 0;
let isImg1Active = true;

const img1 = document.getElementById("img1");
const img2 = document.getElementById("img2");

const interval = 4000;

// Функция для предварительной загрузки первого изображения
function preloadFirstImage() {
  const firstImage = images[0];
  img1.src = firstImage;
  img1.classList.add("hero__background-active");
}

// Функция переключения изображений
function showNextImage() {
  const nextIndex = (current + 1) % images.length;
  const nextImage = images[nextIndex];

  const activeImg = isImg1Active ? img1 : img2;
  const nextImg = isImg1Active ? img2 : img1;

  nextImg.src = nextImage;
  nextImg.classList.add("hero__background-active");
  activeImg.classList.remove("hero__background-active");

  current = nextIndex;
  isImg1Active = !isImg1Active;
}

// Функция для запуска слайдера после анимации
function startSlider() {
  if (sliderStarted) return;
  setInterval(showNextImage, interval);
  sliderStarted = true;
}

function animateAdvantages() {
  const cards = document.querySelectorAll(".advantages__card");

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("advantages__card--visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.3,
    }
  );

  cards.forEach((card) => {
    observer.observe(card);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  preloadFirstImage();

  // Запуск анимаций при загрузке
  setTimeout(() => {
    document.querySelector(".header").classList.add("header--visible");
    document
      .querySelector(".hero__title-wrapper")
      .classList.add("hero__title-wrapper--visible");

    // Запуск слайдера только после анимации
    startSlider();
    animateAdvantages();
  }, 300); // Чуть позже, чтобы анимации не мешали
});

const juniorLink = document.querySelector(".junior-link");
const middleLink = document.querySelector(".middle-link");
const seniorLink = document.querySelector(".senior-link");

const logo = document.querySelector(".groups__logo");
const juniorImg = document.querySelector(".junior-img");
const middleImg = document.querySelector(".middle-img");
const seniorImg = document.querySelector(".senior-img");

function showImage(imgToShow) {
  logo.classList.add("hidden");
  juniorImg.classList.remove("visible");
  middleImg.classList.remove("visible");
  seniorImg.classList.remove("visible");

  imgToShow.classList.add("visible");
}

function hideAllImages() {
  logo.classList.remove("hidden");
  juniorImg.classList.remove("visible");
  middleImg.classList.remove("visible");
  seniorImg.classList.remove("visible");
}

juniorLink.addEventListener("mouseenter", () => showImage(juniorImg));
middleLink.addEventListener("mouseenter", () => showImage(middleImg));
seniorLink.addEventListener("mouseenter", () => showImage(seniorImg));

juniorLink.addEventListener("mouseleave", hideAllImages);
middleLink.addEventListener("mouseleave", hideAllImages);
seniorLink.addEventListener("mouseleave", hideAllImages);




// Чистит тэги </br> в блоке coach
function updateCoachParagraphs() {
  const cards = document.querySelectorAll(".coach .coach__card p");

  cards.forEach((p) => {
    if (!p.dataset.original) {
      p.dataset.original = p.innerHTML; // сохраняем оригинал
    }

    if (window.innerWidth < 1130) {
      p.innerHTML = p.dataset.original.replace(/<br\s*\/?>/gi, " ");
    } else {
      p.innerHTML = p.dataset.original;
    }
  });
}

document.addEventListener("DOMContentLoaded", updateCoachParagraphs);
window.addEventListener("resize", updateCoachParagraphs);
