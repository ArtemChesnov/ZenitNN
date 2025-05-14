import { preloadFirstImage, startSlider } from "./home/hero-slider.js";
import { animateAdvantages } from "./home/advantages-animate.js";
import updateCoachParagraphs from "./home/coach-clean-br.js";
import initGroupHover from "./home/group-hover.js";

document.addEventListener("DOMContentLoaded", () => {
  preloadFirstImage();

  setTimeout(() => {
    document.querySelector(".header").classList.add("header--visible");
    document
      .querySelector(".hero__title-wrapper")
      .classList.add("hero__title-wrapper--visible");

    startSlider();
    animateAdvantages();
    updateCoachParagraphs();
    initGroupHover();
  }, 300);
});

window.addEventListener("resize", updateCoachParagraphs);
