// Удаление <br> из карточек coach при ширине < 1130px
function updateCoachParagraphs() {
  const cards = document.querySelectorAll(".coach .coach__card p");

  cards.forEach((p) => {
    if (!p.dataset.original) {
      p.dataset.original = p.innerHTML;
    }

    if (window.innerWidth < 1130) {
      p.innerHTML = p.dataset.original.replace(/<br\s*\/?>/gi, " ");
    } else {
      p.innerHTML = p.dataset.original;
    }
  });
}

export default updateCoachParagraphs;
