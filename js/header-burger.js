const burger = document.getElementById("burger");
const navigation = document.getElementById("navigation");
const nav = document.getElementById("headerNav");
const dropdownToggle = document.getElementById("dropdownToggle");
const dropdownMenu = document.getElementById("dropdownMenu");

function setVhVariable() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

setVhVariable();
window.addEventListener("resize", setVhVariable);

burger.addEventListener("click", function () {
  burger.classList.toggle("active");
  navigation.classList.toggle("active");
  document.body.classList.toggle("menu-open");
});

dropdownToggle.addEventListener("click", function (e) {
  // e.preventDefault(); // чтобы не дергался якорь при клике
  dropdownToggle.classList.toggle("active");
  dropdownMenu.classList.toggle("active");
});
