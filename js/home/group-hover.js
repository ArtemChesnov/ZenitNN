const juniorLink = document.querySelector(".junior-link");
const middleLink = document.querySelector(".middle-link");
const seniorLink = document.querySelector(".senior-link");

const logo = document.querySelector(".groups__logo");
const juniorImg = document.querySelector(".junior-img");
const middleImg = document.querySelector(".middle-img");
const seniorImg = document.querySelector(".senior-img");

function showImage(img) {
  logo.classList.add("hidden");
  juniorImg.classList.remove("visible");
  middleImg.classList.remove("visible");
  seniorImg.classList.remove("visible");
  img.classList.add("visible");
}

function hideAllImages() {
  logo.classList.remove("hidden");
  juniorImg.classList.remove("visible");
  middleImg.classList.remove("visible");
  seniorImg.classList.remove("visible");
}

function initGroupHover() {
  juniorLink?.addEventListener("mouseenter", () => showImage(juniorImg));
  middleLink?.addEventListener("mouseenter", () => showImage(middleImg));
  seniorLink?.addEventListener("mouseenter", () => showImage(seniorImg));

  juniorLink?.addEventListener("mouseleave", hideAllImages);
  middleLink?.addEventListener("mouseleave", hideAllImages);
  seniorLink?.addEventListener("mouseleave", hideAllImages);
}

function initMobileLinkAnimation() {
  if (window.innerWidth > 1024) return; // Только на мобильных

  const links = document.querySelectorAll(".groups__link");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const wrapper = entry.target.querySelector(".groups__link-wrapper");

        if (entry.isIntersecting) {
          wrapper.classList.add("animate");
        } else {
          wrapper.classList.remove("animate");
        }
      });
    },
    {
      threshold: 0.6,
    }
  );

  links.forEach((link) => observer.observe(link));
}

export { initGroupHover, initMobileLinkAnimation };
