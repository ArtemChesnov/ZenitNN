document
  .getElementById("contactForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Отменяем стандартное поведение формы (перезагрузка страницы)

    var formData = new FormData(this); // Собираем данные из формы

    // Создаём новый запрос AJAX
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "send.php", true); // Указываем файл PHP, куда отправляем данные

    // Обработчик успешного ответа
    xhr.onload = function () {
      if (xhr.status == 200) {
        document.getElementById("response").innerHTML = xhr.responseText; // Показываем ответ
      } else {
        document.getElementById("response").innerHTML =
          "Ошибка отправки! Попробуйте снова.";
      }
    };

    xhr.send(formData); // Отправляем данные
  });
