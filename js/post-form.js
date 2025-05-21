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
      const responseElement = document.getElementById("response");
      responseElement.style.display = "block"; // показываем

      if (xhr.status == 200) {
        responseElement.className = "form__response success";
        responseElement.innerHTML = xhr.responseText;
      } else {
        responseElement.className = "form__response error";
        responseElement.innerHTML = "Ошибка отправки! Попробуйте снова.";
      }
    };

    xhr.send(formData); // Отправляем данные
  });
