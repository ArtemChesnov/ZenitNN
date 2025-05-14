// Анимация карточек преимуществ
export function animateAdvantages() {
  const cards = document.querySelectorAll(".advantages__card");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("advantages__card--visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  cards.forEach((card) => observer.observe(card));
}
