window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;

  const observedImages = new Set();
  let pendingImages = 0;
  let observer;
  let timeoutId;

  function trackImages(container = document.body) {
    const imgs = container.querySelectorAll("img");
    imgs.forEach((img) => {
      if (observedImages.has(img)) return;
      observedImages.add(img);

      if (img.complete) return;

      pendingImages++;
      img.addEventListener("load", checkDone, { once: true });
      img.addEventListener("error", checkDone, { once: true });
    });
  }

  function checkDone() {
    pendingImages--;
    if (pendingImages <= 0) {
      endPreloader();
    }
  }

  function endPreloader() {
    if (observer) observer.disconnect();
    clearTimeout(timeoutId);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        preloader.classList.add("fade-out");
        setTimeout(() => {
          preloader.style.display = "none";
          document.dispatchEvent(new Event("preloader:done")); // ← вот это
        }, 400); // синхронизировано с CSS
      });
    });
  }

  // Фоллбэк: принудительно скрыть прелоадер через 5 секунд
  timeoutId = setTimeout(() => {
    endPreloader();
  }, 5000);

  // Первичная проверка
  trackImages();

  // Если нет изображений для загрузки
  if (pendingImages === 0) {
    endPreloader();
  }

  // Следим за новыми изображениями
  observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          trackImages(node);
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
});
