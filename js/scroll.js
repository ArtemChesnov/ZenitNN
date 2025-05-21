document.querySelectorAll(".scroll-link").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href").substring(1);
    const target = document.getElementById(targetId);

    const offset = parseInt(this.dataset.offset) || 300;

    if (target) {
      const topOffsetPosition =
        target.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({
        top: topOffsetPosition,
        behavior: "smooth",
      });
    }
  });
});
