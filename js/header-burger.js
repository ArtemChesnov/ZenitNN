const burger = document.getElementById("burger");
const navigation = document.getElementById("navigation");
const nav = document.getElementById("headerNav");
const dropdownToggle = document.getElementById("dropdownToggle");
const dropdownMenu = document.getElementById("dropdownMenu");

burger.addEventListener("click", function () {
  burger.classList.toggle("active");
  navigation.classList.toggle("active");
});

dropdownToggle.addEventListener("click", function (e) {
  // e.preventDefault(); // чтобы не дергался якорь при клике
  dropdownToggle.classList.toggle("active");
  dropdownMenu.classList.toggle("active");
});
