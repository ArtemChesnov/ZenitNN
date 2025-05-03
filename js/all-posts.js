fetch("/data/news.json")
  .then((response) => response.json())
  .then((newsData) => {
    const slider = document.getElementById("news");

    newsData.forEach((news) => {
      const slide = document.createElement("a");
      slide.className = "news__item";
      slide.href = `/pages/news-posts/${news.id}.html`;

      const img = document.createElement("img");
      img.className = "news__image";
      img.src = news.cover;
      img.loading = "lazy";

      const caption = document.createElement("p");
      caption.className = "news__caption";
      caption.textContent = `${news.title}`;

      slide.appendChild(img);
      slide.appendChild(caption);
      slider.appendChild(slide);
    });
  })
  .catch((error) => {
    console.error("Ошибка загрузки новостей:", error);
  });
