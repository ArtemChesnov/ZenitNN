document.addEventListener("DOMContentLoaded", () => {
  const toggleButtons = document.querySelectorAll(".toggle-button");

  toggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".coach__card");

      if (card) {
        // Добавляем класс карточке
        card.classList.add("coach__card-toggle");

        // Убираем класс у скрытых пунктов списка
        const hiddenItems = card.querySelectorAll(".coach__card-item--toggle");
        hiddenItems.forEach((item) => {
          item.classList.remove("coach__card-item--toggle");
        });

        // Добавляем класс кнопке
        button.classList.add("display");
      }
    });
  });
});
