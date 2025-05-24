document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  const scrollToIdWithOffset = (id) => {
    const target = document.getElementById(id);
    if (target) {
      const topOffsetPosition =
        target.getBoundingClientRect().top + window.pageYOffset;

      window.scrollTo({
        top: topOffsetPosition,
        behavior: "smooth",
      });
    }
  };

  if (path === "/branches") scrollToIdWithOffset("branches");
  if (path === "/groups") scrollToIdWithOffset("groups");
});
