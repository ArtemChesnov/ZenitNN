const phoneButton = document.getElementById("phoneButton");
const phoneModal = document.getElementById("phoneModal");
const closePhoneModal = document.getElementById("closePhoneModal");

phoneButton.addEventListener("click", () => {
  phoneModal.style.display = "flex";
});

closePhoneModal.addEventListener("click", () => {
  phoneModal.style.display = "none";
});

document.addEventListener("click", (e) => {
  if (!phoneModal.contains(e.target) && !phoneButton.contains(e.target)) {
    phoneModal.style.display = "none";
  }
});
