window.addEventListener("DOMContentLoaded", () => {
  // Запуск анимаций при загрузке
  setTimeout(() => {
    document.querySelector(".header").style.background = "#3CA0DB";
    document.querySelector(".header").classList.add("header--visible");
  }, 300); // Чуть позже, чтобы анимации не мешали
});
