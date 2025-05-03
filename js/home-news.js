(function () {
  const getBasePath = () => {
    const depth = location.pathname.replace(/\/$/, "").split("/").length - 1;
    return "../".repeat(depth);
  };

  const basePath = getBasePath();

  fetch(`${basePath}data/news.json`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    })
    .then((newsData) => {
      const container = document.querySelector(".news-home__container");

      newsData.forEach((news) => {
        container.appendChild(createSlide(news, basePath));
      });

      enableSlider();
    })
    .catch((error) => {
      console.error("Ошибка загрузки новостей:", error);
    });

  function createSlide(news, basePath) {
    const link = document.createElement("a");
    link.className = "news-home__link";
    link.href = `${basePath}pages/news-posts/${news.id}.html`;

    const img = document.createElement("img");
    img.className = "news-home__img";
    img.src = `${basePath}${news.cover}`;
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

    if (slides.length < 2) {
      btnPrev.style.display = "none";
      btnNext.style.display = "none";
      return;
    }

    sliderWrapper.addEventListener("wheel", (e) => {
      const isScrollable = sliderWrapper.scrollWidth > sliderWrapper.clientWidth;

      if (!isScrollable || Math.abs(e.deltaY) > Math.abs(e.deltaX)) return;

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
      if (isAnimating) return;
      isAnimating = true;
      sliderWrapper.scrollTo({ left: position, behavior: "smooth" });
      setTimeout(() => (isAnimating = false), 400);
    }

    btnPrev.addEventListener("click", () => {
      const step = scrollStep();
      if (sliderWrapper.scrollLeft <= 0) {
        smoothScrollTo(sliderWrapper.scrollWidth - sliderWrapper.clientWidth);
      } else {
        smoothScrollTo(sliderWrapper.scrollLeft - step);
      }
    });

    btnNext.addEventListener("click", () => {
      const step = scrollStep();
      const isAtEnd =
        sliderWrapper.scrollLeft + sliderWrapper.clientWidth >= sliderWrapper.scrollWidth - 5;

      if (isAtEnd) {
        smoothScrollTo(0);
      } else {
        smoothScrollTo(sliderWrapper.scrollLeft + step);
      }
    });

    let scrollTimeout;

    sliderWrapper.addEventListener("scroll", () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => snapToClosestSlide(), 120);
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

      if (closestSlide) {
        const offsetLeft = closestSlide.offsetLeft;
        const slideWidth = closestSlide.offsetWidth;
        const targetScroll = offsetLeft - (sliderWrapper.clientWidth - slideWidth) / 2;

        sliderWrapper.scrollTo({ left: targetScroll, behavior: "smooth" });
      }
    }
  }
})();
