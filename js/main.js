import { preloadFirstImage, startSlider } from "./home/hero-slider.js";
import { animateAdvantages } from "./home/advantages-animate.js";
import updateCoachParagraphs from "./home/coach-clean-br.js";

import { initGroupHover, initMobileLinkAnimation } from "./home/group-hover.js";

document.addEventListener("DOMContentLoaded", () => {
  preloadFirstImage();
});

document.addEventListener("preloader:done", () => {
  document.querySelector(".header").classList.add("header--visible");
  document
    .querySelector(".hero__title-wrapper")
    .classList.add("hero__title-wrapper--visible");

  startSlider();
  animateAdvantages();
  updateCoachParagraphs();
  initGroupHover();
  initMobileLinkAnimation();
});

window.addEventListener("resize", updateCoachParagraphs);
