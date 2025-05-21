fetch("/data/news.json")
  .then((response) => response.json())
  .then((newsData) => {
    const container = document.querySelector(".news-home__container");

    newsData.forEach((news) => {
      container.appendChild(createSlide(news));
    });

    enableSlider();
  })
  .catch((error) => {
    console.error("Ошибка загрузки новостей:", error);
  });

function createSlide(news) {
  const link = document.createElement("a");
  link.className = "news-home__link";
  link.href = `/pages/news-posts/${news.id}.html`;

  const img = document.createElement("img");
  img.className = "news-home__img";
  img.src = news.cover;
  img.alt = news.title;
  img.loading = "lazy";

  const title = document.createElement("p");
  title.className = "news-home__link-title";
  title.textContent = news.title;

  link.appendChild(img);
  link.appendChild(title);

  return link;
}

function enableSlider() {
  const sliderWrapper = document.querySelector(".news-home__container-wrapper");
  const container = document.querySelector(".news-home__container");
  const btnPrev = document.querySelector(".news-home__arrow--prev");
  const btnNext = document.querySelector(".news-home__arrow--next");
  const slides = container.querySelectorAll(".news-home__link");

  let isAnimating = false;
  let scrollTimeout;

  if (slides.length < 2) {
    btnPrev.style.display = "none";
    btnNext.style.display = "none";
    return;
  }

  sliderWrapper.addEventListener("wheel", (e) => {
    const isScrollable = sliderWrapper.scrollWidth > sliderWrapper.clientWidth;
    if (!isScrollable) return;

    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) return;

    e.preventDefault();
    sliderWrapper.scrollLeft += e.deltaY;
  });

  const scrollStep = () => {
    const firstSlide = container.querySelector(".news-home__link");
    if (!firstSlide) return 300;
    const gap = parseInt(getComputedStyle(container).gap) || 0;
    return firstSlide.getBoundingClientRect().width + gap;
  };

  function smoothScrollTo(position) {
    isAnimating = true;
    sliderWrapper.scrollTo({ left: position, behavior: "smooth" });
    setTimeout(() => {
      isAnimating = false;
    }, 400);
  }

  btnPrev.addEventListener("click", () => {
    const step = scrollStep();
    const newScroll = Math.max(0, sliderWrapper.scrollLeft - step);
    smoothScrollTo(newScroll);
  });

  btnNext.addEventListener("click", () => {
    const step = scrollStep();
    const maxScroll = sliderWrapper.scrollWidth - sliderWrapper.clientWidth;
    const newScroll = sliderWrapper.scrollLeft + step;

    if (Math.ceil(sliderWrapper.scrollLeft + step) >= Math.floor(maxScroll)) {
      smoothScrollTo(0);
    } else {
      smoothScrollTo(newScroll);
    }
  });

  sliderWrapper.addEventListener("scroll", () => {
    if (isAnimating) return;

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      snapToClosestSlide();
    }, 120);
  });

  function snapToClosestSlide() {
    const slideElements = container.querySelectorAll(".news-home__link");
    if (!slideElements.length) return;

    const containerRect = sliderWrapper.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    let closestSlide = null;
    let minDistance = Infinity;

    slideElements.forEach((slide) => {
      const rect = slide.getBoundingClientRect();
      const slideCenter = rect.left + rect.width / 2;
      const distance = Math.abs(containerCenter - slideCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestSlide = slide;
      }
    });

    // Добавим порог: не автоцентрировать, если расстояние до ближайшего слайда больше 1/3 ширины
    const threshold = closestSlide.offsetWidth / 3;
    if (minDistance < threshold) {
      const offsetLeft = closestSlide.offsetLeft;
      const slideWidth = closestSlide.offsetWidth;
      const targetScroll =
        offsetLeft - (sliderWrapper.clientWidth - slideWidth) / 2;

      sliderWrapper.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  }
}
