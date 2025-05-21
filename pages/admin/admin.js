document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("upload-form");
  if (!form) return;

  const titleInput = document.getElementById("title");
  const textInput = document.getElementById("text");
  const coverInput = document.getElementById("coverInput");
  const imagesInput = document.getElementById("imagesInput");
  const csrfInput = form.querySelector("input[name='csrf_token']");

  const coverPreview = document.getElementById("coverPreview");
  const imagesPreviewInner = document.getElementById("imagesPreviewInner");
  const imageCount = document.getElementById("imageCount");

  const progressWrapper = document.getElementById("progressWrapper");
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");
  const toast = document.getElementById("toast");

  let adminCurrentPage = 1;
  const adminItemsPerPage = 6;
  let fullNewsList = [];

  const savedTitle = localStorage.getItem("draft-title");
  const savedText = localStorage.getItem("draft-text");
  if (savedTitle) titleInput.value = savedTitle;
  if (savedText) textInput.value = savedText;

  [titleInput, textInput].forEach((input) => {
    input.addEventListener("input", () => {
      localStorage.setItem("draft-title", titleInput.value);
      localStorage.setItem("draft-text", textInput.value);
    });
  });

  const resetBtn = document.createElement("button");
  resetBtn.textContent = "Сбросить черновик";
  resetBtn.type = "button";
  resetBtn.className = "admin-panel__form-reset";
  resetBtn.addEventListener("click", () => {
    if (confirm("Очистить черновик?")) {
      localStorage.removeItem("draft-title");
      localStorage.removeItem("draft-text");
      titleInput.value = "";
      textInput.value = "";
      coverPreview.src = "";
      coverPreview.style.display = "none";
      coverInput.value = "";
      imagesPreviewInner.innerHTML = "";
      imageCount.textContent = "";
      imagesInput.value = "";
      showToast("Черновик сброшен");
    }
  });
  form.appendChild(resetBtn);

  async function loadNews() {
    const list = document.getElementById("news-list");
    list.innerHTML = "";
    for (let i = 0; i < 3; i++) {
      const skeleton = document.createElement("div");
      skeleton.className = "skeleton-card";
      list.appendChild(skeleton);
    }

    try {
      const res = await fetch("/data/get-news.php", {
        headers: { "X-Requested-With": "XMLHttpRequest" },
      });

      if (!res.ok) throw new Error("Сервер вернул ошибку");

      const data = await res.json();
      fullNewsList = Array.isArray(data) ? data.reverse() : [];
      renderNewsPage(adminCurrentPage);
      renderAdminPagination();
    } catch (err) {
      list.innerHTML = "<p style='color:red;'>Ошибка загрузки новостей</p>";
    }
  }

  function renderNewsPage(page) {
    const list = document.getElementById("news-list");
    list.innerHTML = "";
    const start = (page - 1) * adminItemsPerPage;
    const end = start + adminItemsPerPage;
    const newsPage = fullNewsList.slice(start, end);

    newsPage.forEach((n) => {
      const div = document.createElement("div");
      div.className = "admin-panel__news-card";
      div.dataset.id = n.id;
      div.innerHTML = `<img src="${n.cover}" alt="${n.title}">
        <h3>${n.title}</h3>
        <div class="admin-panel__news-card-buttons">
          <a href="/pages/news-posts/${n.id}.html" target="_blank">Открыть</a>
          <button class="delete delete-btn">Удалить</button>
        </div>`;
      list.appendChild(div);
    });
  }

  function renderAdminPagination() {
    const wrapper = document.getElementById("news-list");
    const existing = document.querySelector(".admin-pagination");
    if (existing) existing.remove();

    const total = Math.ceil(fullNewsList.length / adminItemsPerPage);
    if (total <= 1) return;

    const pagination = document.createElement("div");
    pagination.className = "admin-pagination";

    const prev = document.createElement("button");
    prev.className = "admin-pagination__btn";
    prev.textContent = "←";
    prev.disabled = adminCurrentPage === 1;
    prev.onclick = () => {
      adminCurrentPage--;
      renderNewsPage(adminCurrentPage);
      renderAdminPagination();
    };
    pagination.appendChild(prev);

    const smartPages = getSmartPages(adminCurrentPage, total);
    smartPages.forEach((val) => {
      if (val === "...") {
        const span = document.createElement("span");
        span.textContent = "...";
        span.className = "admin-pagination__dots";
        pagination.appendChild(span);
      } else {
        const btn = document.createElement("button");
        btn.className = "admin-pagination__btn";
        btn.textContent = val;
        if (val === adminCurrentPage) btn.classList.add("active");
        btn.onclick = () => {
          adminCurrentPage = val;
          renderNewsPage(adminCurrentPage);
          renderAdminPagination();
        };
        pagination.appendChild(btn);
      }
    });

    const next = document.createElement("button");
    next.className = "admin-pagination__btn";
    next.textContent = "→";
    next.disabled = adminCurrentPage === total;
    next.onclick = () => {
      adminCurrentPage++;
      renderNewsPage(adminCurrentPage);
      renderAdminPagination();
    };
    pagination.appendChild(next);

    wrapper.after(pagination);
  }

  function getSmartPages(current, total) {
    const pages = [];
    if (total <= 5) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    if (current > 3) pages.push("...");
    let start = Math.max(2, current - 1);
    let end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (current < total - 2) pages.push("...");
    pages.push(total);
    return pages;
  }

  setTimeout(() => {
    loadNews();
  }, 300);

  document.getElementById("news-list").addEventListener("click", async (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const card = e.target.closest(".admin-panel__news-card");
      const id = card.dataset.id;
      if (confirm("Удалить новость?")) {
        progressWrapper.style.display = "block";
        progressWrapper.style.opacity = "1";
        progressBar.style.width = "30%";
        progressText.textContent = "Удаление...";
        const formData = new FormData();
        formData.append("id", id);
        formData.append("csrf_token", csrfInput.value);
        const res = await fetch("/pages/admin/delete.php", {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          fullNewsList = fullNewsList.filter((n) => n.id !== id);
          renderNewsPage(adminCurrentPage);
          renderAdminPagination();
          progressBar.style.width = "100%";
          progressText.textContent = "Готово";
          setTimeout(() => {
            progressWrapper.style.display = "none";
            progressWrapper.style.opacity = "0";
            progressBar.style.width = "0%";
            progressText.textContent = "0%";
            showToast("Новость удалена");
          }, 800);
        } else {
          showToast("Ошибка удаления: " + (await res.text()), true);
        }
      }
    }
  });

  coverInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      coverPreview.style.display = "block";
      coverPreview.classList.add("skeleton");
      coverPreview.src = "";
      const reader = new FileReader();
      reader.onload = () => {
        setTimeout(() => {
          coverPreview.src = reader.result;
          coverPreview.classList.remove("skeleton");
        }, 300);
      };
      reader.readAsDataURL(file);
    }
  });

  imagesInput.addEventListener("change", (e) => {
    imagesPreviewInner.innerHTML = "";
    const files = [...e.target.files];
    imageCount.textContent = `Выбрано фотографий: ${files.length}`;
    files.forEach(() => {
      const skeleton = document.createElement("div");
      skeleton.className = "skeleton";
      skeleton.style.width = "100%";
      skeleton.style.height = "200px";
      skeleton.style.borderRadius = "8px";
      imagesPreviewInner.appendChild(skeleton);
    });
    files.forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = () => {
        setTimeout(() => {
          const img = document.createElement("img");
          img.src = reader.result;
          img.style.width = "100%";
          img.style.maxHeight = "320px";
          img.style.borderRadius = "6px";
          const skeleton = imagesPreviewInner.children[i];
          imagesPreviewInner.replaceChild(img, skeleton);
        }, 300);
      };
      reader.readAsDataURL(file);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!coverInput.files.length) {
      showToast("Пожалуйста, выберите обложку.", true);
      return;
    }
    const formData = new FormData(form);
    formData.append("csrf_token", csrfInput.value);
    progressWrapper.style.display = "block";
    progressWrapper.style.opacity = "1";
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/pages/admin/add.php");
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        progressBar.style.width = percent + "%";
        progressText.textContent = percent + "%";
      }
    };
    xhr.onload = () => {
      progressBar.style.width = "100%";
      progressText.textContent = "100%";
      if (xhr.status === 200) {
        setTimeout(() => {
          form.reset();
          coverPreview.style.display = "none";
          imagesPreviewInner.innerHTML = "";
          imageCount.textContent = "";
          progressWrapper.style.display = "none";
          progressWrapper.style.opacity = "0";
          progressBar.style.width = "0%";
          progressText.textContent = "0%";
          localStorage.removeItem("draft-title");
          localStorage.removeItem("draft-text");
          showToast("Новость добавлена");
          setTimeout(() => loadNews(), 300);
        }, 800);
      } else {
        showToast("Ошибка: " + xhr.responseText, true);
      }
    };
    xhr.onerror = () => showToast("Ошибка соединения", true);
    xhr.send(formData);
  });

  function showToast(message, isError = false) {
    toast.textContent = message;
    toast.classList.remove("show", "error");
    if (isError) toast.classList.add("error");
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
  }
});
