document.addEventListener("DOMContentLoaded", () => {
  // Не выполнять повторно
  if (window.__typografAlreadyApplied) return;
  window.__typografAlreadyApplied = true;

  // Проверка наличия библиотеки
  if (typeof Typograf === "undefined") {
    console.warn("Typograf не загружен.");
    return;
  }

  // Создание экземпляра типографа
  const tp = new Typograf({ locale: ["ru", "en-US"] });

  // Селекторы элементов с текстом
  const targets = document.querySelectorAll(".post__text");

  // Применение форматирования
  targets.forEach((el) => {
    el.innerHTML = tp.execute(el.innerHTML);
  });
});
