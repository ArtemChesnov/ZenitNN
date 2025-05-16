const fs = require("fs");

const filePath = "css/style.css"; // Имя CSS-файла

let css = fs.readFileSync(filePath, "utf-8");

// Простая минификация
css = css
  .replace(/\/\*[\s\S]*?\*\//g, "") // Удалить комментарии
  .replace(/\s+/g, " ") // Удалить лишние пробелы и переносы
  .replace(/\s*([{}:;,])\s*/g, "$1") // Удалить пробелы вокруг {},:;,
  .replace(/;}/g, "}"); // Удалить ; перед }

fs.writeFileSync(filePath, css); // Перезапись исходного файла

console.log(`Файл '${filePath}' минифицирован.`);
