fetch("/data/get-news.php")
  .then((response) => response.json())
  .then((newsData) => {
    const slider = document.getElementById("news");
    const itemsPerPage = 6;

    let currentPage = getPageFromURL();

    function getPageFromURL() {
      const params = new URLSearchParams(window.location.search);
      const page = parseInt(params.get("page"), 10);
      return isNaN(page) || page < 1 ? 1 : page;
    }

    function updateURL(page) {
      const newUrl = `${window.location.pathname}?page=${page}`;
      history.pushState({ page }, "", newUrl);
    }

    function renderPage(page) {
      slider.innerHTML = "";

      // Удаляем старую пагинацию, если есть
      const oldPagination = document.querySelector(".news__pagination");
      if (oldPagination) oldPagination.remove();

      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const pageItems = newsData.slice(start, end);

      pageItems.forEach((news, index) => {
        const slide = document.createElement("a");
        slide.className = "news__item";
        slide.href = `/pages/news-posts/${news.id}.html`;

        slide.style.opacity = "0";
        slide.style.transform = "translateY(20px)";
        setTimeout(() => {
          slide.style.transition = "all 0.4s ease";
          slide.style.opacity = "1";
          slide.style.transform = "translateY(0)";
        }, index * 50);

        const img = document.createElement("img");
        img.className = "news__image";
        img.src = news.cover;
        img.loading = "lazy";

        const caption = document.createElement("p");
        caption.className = "news__caption";
        caption.textContent = news.title;

        slide.appendChild(img);
        slide.appendChild(caption);
        slider.appendChild(slide);
      });

      updateRelPaginationLinks(page);
      updateURL(page);
      renderPagination(); // ← пересоздаём пагинацию
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function renderPagination() {
      const pageCount = Math.ceil(newsData.length / itemsPerPage);
      if (pageCount <= 1) return;

      const pagination = document.createElement("div");
      pagination.className = "news__pagination";

      // ← Prev
      const prevBtn = document.createElement("button");
      prevBtn.innerHTML = "←";
      prevBtn.className = "news__page-button news__page-button--arrow";
      prevBtn.disabled = currentPage === 1;
      prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
          currentPage--;
          renderPage(currentPage);
          updatePaginationUI();
        }
      });
      pagination.appendChild(prevBtn);

      // Page numbers (smart)
      const pageCountToShow = getSmartPages(currentPage, pageCount);
      pageCountToShow.forEach((val, idx, arr) => {
        if (val === "...") {
          const dots = document.createElement("span");
          dots.className = "news__page-dots";
          dots.textContent = "...";
          pagination.appendChild(dots);
        } else {
          const button = document.createElement("button");
          button.textContent = val;
          button.className = "news__page-button";
          if (val === currentPage) button.classList.add("active");

          button.addEventListener("click", () => {
            currentPage = val;
            renderPage(currentPage);
            updatePaginationUI();
          });

          pagination.appendChild(button);
        }
      });

      // → Next
      const nextBtn = document.createElement("button");
      nextBtn.innerHTML = "→";
      nextBtn.className = "news__page-button news__page-button--arrow";
      nextBtn.disabled = currentPage === pageCount;
      nextBtn.addEventListener("click", () => {
        if (currentPage < pageCount) {
          currentPage++;
          renderPage(currentPage);
          updatePaginationUI();
        }
      });
      pagination.appendChild(nextBtn);

      slider.parentElement.appendChild(pagination);
    }

    function getSmartPages(current, total) {
      const pages = [];

      if (total <= 5) {
        for (let i = 1; i <= total; i++) pages.push(i);
        return pages;
      }

      // Always show first page
      pages.push(1);

      if (current > 3) {
        pages.push("...");
      }

      let start = Math.max(2, current - 1);
      let end = Math.min(total - 1, current + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (current < total - 2) {
        pages.push("...");
      }

      pages.push(total);

      return pages;
    }

    function updatePaginationUI() {
      document
        .querySelectorAll(".news__page-button")
        .forEach((btn) => btn.classList.remove("active"));

      const pageButtons = document.querySelectorAll(".news__page-button");
      pageButtons.forEach((btn) => {
        if (parseInt(btn.textContent) === currentPage) {
          btn.classList.add("active");
        }
      });

      const pageCount = Math.ceil(newsData.length / itemsPerPage);
      const arrows = document.querySelectorAll(".news__page-button--arrow");
      arrows[0].disabled = currentPage === 1;
      arrows[1].disabled = currentPage === pageCount;
    }

    function updateRelPaginationLinks(page) {
      document
        .querySelectorAll('link[rel="prev"], link[rel="next"]')
        .forEach((el) => el.remove());

      const head = document.head;
      const pageCount = Math.ceil(newsData.length / itemsPerPage);

      if (page > 1) {
        const prev = document.createElement("link");
        prev.rel = "prev";
        prev.href = `?page=${page - 1}`;
        head.appendChild(prev);
      }

      if (page < pageCount) {
        const next = document.createElement("link");
        next.rel = "next";
        next.href = `?page=${page + 1}`;
        head.appendChild(next);
      }
    }

    renderPage(currentPage);
  })
  .catch((error) => {
    console.error("Ошибка загрузки новостей:", error);
  });
