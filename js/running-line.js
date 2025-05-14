document.addEventListener("DOMContentLoaded", () => {
  const inner = document.querySelector(".js-marquee");
  if (!inner) return;

  // Дублируем контент
  const clone = inner.cloneNode(true);
  inner.parentNode.appendChild(clone);

  // Объединяем два блока в один (чтобы scrollWidth был полной шириной)
  const totalWidth = inner.scrollWidth;

  // Устанавливаем длительность на основе ширины
  const speed = 50; // пикселей в секунду
  const duration = totalWidth / speed;

  // Применяем к обоим элементам
  [inner, clone].forEach((el) => {
    el.style.setProperty("--marquee-duration", `${duration}s`);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const inner = document.querySelector(".js-marque");
  if (!inner) return;

  // Дублируем контент
  const clone = inner.cloneNode(true);
  inner.parentNode.appendChild(clone);

  // Объединяем два блока в один (чтобы scrollWidth был полной шириной)
  const totalWidth = inner.scrollWidth;

  // Устанавливаем длительность на основе ширины
  const speed = 50; // пикселей в секунду
  const duration = totalWidth / speed;

  // Применяем к обоим элементам
  [inner, clone].forEach((el) => {
    el.style.setProperty("--marquee-duration", `${duration}s`);
  });
});
