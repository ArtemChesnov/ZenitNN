const galleryGrid = document.querySelector(".post__grid");
const modal = document.getElementById("post-modal");
const modalImage = modal.querySelector(".post-modal__image");
const modalClose = modal.querySelector(".post-modal__close");
const modalPrev = modal.querySelector(".post-modal__prev");
const modalNext = modal.querySelector(".post-modal__next");
const modalCounter = document.getElementById("post-modalCounter");
const modalThumbnails = document.getElementById("post-modalThumbnails");
const overlay = modal.querySelector(".post-modal__overlay");
const arrowLeft = document.querySelector(".post-thumbs__arrow--left");
const arrowRight = document.querySelector(".post-thumbs__arrow--right");

let currentIndex = 0;
let imageList = [];

const path = window.location.pathname;
const galleryId = path.match(/\/([\w]+)\.html$/)?.[1];

fetch("/data/get-news.php", {
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
})
  .then((res) => res.json())
  .then((data) => {
    const gallery = data.find((gallery) => gallery.id === galleryId);
    if (gallery) {
      imageList = gallery.photos;
      lazyLoadImages(imageList);
    } else {
      console.error("Галерея с таким id не найдена.");
    }
  })
  .catch(console.error);

function createImage(src, index) {
  const img = document.createElement("img");
  img.src = src;
  img.alt = `Фото ${index + 1}`;
  img.className = "post__item";
  img.loading = "lazy";
  img.dataset.index = index;

  img.style.opacity = "0";
  img.style.transition = "opacity 0.6s ease";

  img.addEventListener("load", () => {
    img.style.opacity = "1";
  });

  img.addEventListener("click", () => openPostModal(index));
  galleryGrid.appendChild(img);
}

function lazyLoadImages(images) {
  let index = 0;
  function loadNext() {
    if (index >= images.length) return;
    createImage(images[index], index);
    index++;
    (
      window.requestIdleCallback ||
      function (cb) {
        setTimeout(cb, 0);
      }
    )(loadNext);
  }
  loadNext();
}

function openPostModal(index) {
  currentIndex = index;
  modal.classList.add("active");
  updateModalImage();
  if (!modalThumbnails.hasChildNodes()) {
    generateThumbnails();
  }
}

function generateThumbnails() {
  imageList.forEach((src, index) => {
    const thumb = document.createElement("img");
    thumb.src = src;
    thumb.alt = `Миниатюра ${index + 1}`;
    thumb.dataset.index = index;
    thumb.loading = "lazy";
    thumb.addEventListener("click", () => openPostModal(index));
    modalThumbnails.appendChild(thumb);
  });
  updateActiveThumbnail();
}

function updateModalImage() {
  modalImage.src = imageList[currentIndex];
  modalCounter.textContent = `${currentIndex + 1} / ${imageList.length}`;
  updateActiveThumbnail();
  preloadAdjacentImages();
}

function updateActiveThumbnail() {
  modalThumbnails.querySelectorAll("img").forEach((thumb) => {
    thumb.classList.remove("active");
  });
  const active = modalThumbnails.querySelector(
    `img[data-index="${currentIndex}"]`
  );
  if (active) {
    active.classList.add("active");
    active.scrollIntoView({ behavior: "smooth", inline: "center" });
  }
}

function preloadAdjacentImages() {
  [currentIndex - 1, currentIndex + 1].forEach((i) => {
    if (i >= 0 && i < imageList.length) {
      const img = new Image();
      img.src = imageList[i];
    }
  });
}

function closePostModal() {
  modal.classList.remove("active");
  modalImage.src = "";
}

function showPrev() {
  currentIndex = (currentIndex - 1 + imageList.length) % imageList.length;
  updateModalImage();
}

function showNext() {
  currentIndex = (currentIndex + 1) % imageList.length;
  updateModalImage();
}

modalClose.addEventListener("click", closePostModal);
modalPrev.addEventListener("click", showPrev);
modalNext.addEventListener("click", showNext);
overlay.addEventListener("click", closePostModal);

document.addEventListener("keydown", (e) => {
  if (!modal.classList.contains("active")) return;
  if (e.key === "ArrowLeft") showPrev();
  if (e.key === "ArrowRight") showNext();
  if (e.key === "Escape") closePostModal();
});

let startX = 0;
modalImage.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});
modalImage.addEventListener("touchend", (e) => {
  const diff = startX - e.changedTouches[0].clientX;
  if (diff > 50) showNext();
  else if (diff < -50) showPrev();
});

arrowLeft.addEventListener("click", () => {
  modalThumbnails.scrollBy({ left: -100, behavior: "smooth" });
});
arrowRight.addEventListener("click", () => {
  modalThumbnails.scrollBy({ left: 100, behavior: "smooth" });
});
