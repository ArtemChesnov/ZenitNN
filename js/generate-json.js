const fs = require("fs");
const path = require("path");

const folder = path.join(__dirname, "../img/gallery/timiryazevskogo-open"); // путь к папке с изображениями
const outputFile = path.join(
  __dirname,
  "../img/gallery/timiryazevskogo-open/timiryazevskogo-open.json"
);

const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

fs.readdir(folder, (err, files) => {
  if (err) {
    console.error("Ошибка чтения папки:", err);
    return;
  }

  const images = files
    .filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return allowedExtensions.includes(ext);
    })
    .map((file) => path.posix.join("/ZenitNN/img/gallery/timiryazevskogo-open", file)); // чтобы пути работали в URL

  const json = {
    images,
  };

  fs.writeFile(outputFile, JSON.stringify(json, null, 2), (err) => {
    if (err) {
      console.error("Ошибка записи JSON-файла:", err);
    } else {
      console.log(`Готово! Файл записан в ${outputFile}`);
    }
  });
});
