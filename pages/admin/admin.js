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

  // Автозагрузка черновика
  const savedTitle = localStorage.getItem("draft-title");
  const savedText = localStorage.getItem("draft-text");
  if (savedTitle) titleInput.value = savedTitle;
  if (savedText) textInput.value = savedText;

  // Сохраняем черновик
  [titleInput, textInput].forEach((input) => {
    input.addEventListener("input", () => {
      localStorage.setItem("draft-title", titleInput.value);
      localStorage.setItem("draft-text", textInput.value);
    });
  });

  // Кнопка сброса черновика
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
      showToast("Черновик сброшен");
    }
  });
  form.appendChild(resetBtn);

  async function loadNews() {
    const res = await fetch("/data/news.json");
    const news = await res.json();
    const list = document.getElementById("news-list");
    list.innerHTML = "";

    news.reverse().forEach((n) => {
      const div = document.createElement("div");
      div.className = "admin-panel__news-card";
      div.dataset.id = n.id;
      div.innerHTML = `
        <img src="${n.cover}" alt="${n.title}">
        <h3>${n.title}</h3>
        <div class="admin-panel__news-card-buttons">
          <a href="/pages/news-posts/${n.id}.html" target="_blank">Открыть</a>
          <button class="delete delete-btn">Удалить</button>
        </div>`;
      list.appendChild(div);
    });
  }

  loadNews();

  document.getElementById("news-list").addEventListener("click", async (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const card = e.target.closest(".admin-panel__news-card");
      const id = card.dataset.id;

      if (confirm("Удалить новость?")) {
        progressWrapper.style.display = "block";
        progressBar.style.width = "30%";
        progressText.textContent = "Удаление...";

        const formData = new FormData();
        formData.append("id", id);
        formData.append("csrf_token", csrfInput.value);

        const res = await fetch("delete.php", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          card.remove();
          progressBar.style.width = "100%";
          progressText.textContent = "Готово";
          setTimeout(() => {
            progressWrapper.style.display = "none";
            progressBar.style.width = "0%";
            progressText.textContent = "0%";
            showToast("Новость удалена");
          }, 800);
        } else {
          alert("Ошибка удаления: " + (await res.text()));
        }
      }
    }
  });

  coverInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        coverPreview.src = reader.result;
        coverPreview.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });

  imagesInput.addEventListener("change", (e) => {
    imagesPreviewInner.innerHTML = "";
    [...e.target.files].forEach((file) => {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      img.style.width = "100%";
      img.style.maxHeight = "320px";
      img.style.borderRadius = "6px";
      imagesPreviewInner.appendChild(img);
    });
    imageCount.textContent = `Выбрано фотографий: ${e.target.files.length}`;
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!coverInput.files.length) {
      showToast("Пожалуйста, выберите обложку.");
      return;
    }

    const formData = new FormData(form);
    formData.append("csrf_token", csrfInput.value);

    progressWrapper.style.display = "block";

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "add.php");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        progressBar.style.width = `${percent}%`;
        progressText.textContent = `${percent}%`;
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
          progressBar.style.width = "0%";
          progressText.textContent = "0%";
          localStorage.removeItem("draft-title");
          localStorage.removeItem("draft-text");
          showToast("Новость добавлена");
          loadNews();
        }, 800);
      } else {
        alert("Ошибка: " + xhr.responseText);
      }
    };

    xhr.onerror = () => alert("Ошибка соединения");
    xhr.send(formData);
  });

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
  }
});
