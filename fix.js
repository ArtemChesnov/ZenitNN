const fs = require("fs");
const path = require("path");

const exts = [".html", ".css", ".js"];
const prefix = "/ZenitNN/";

// Добавляет префикс только к абсолютным путям, если он ещё не добавлен
function addPrefix(value) {
  if (
    !value ||
    value.startsWith("http") ||
    value.startsWith("data:") ||
    value.startsWith("tel:") ||
    value.startsWith("mailto:") ||
    value.startsWith(prefix)
  ) {
    return value;
  }
  if (value.startsWith("/")) return prefix + value.slice(1);
  return value;
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");

  // HTML: href="/...", src="/...", action="/..."
  content = content.replace(
    /(href|src|action)\s*=\s*["'](\/[^"']+)["']/gi,
    (_, attr, val) => `${attr}="${addPrefix(val)}"`
  );

  // CSS: url('/...')
  content = content.replace(
    /url\((['"]?)\/([^)'"]+)\1\)/gi,
    (_, quote, val) => `url(${quote}${addPrefix("/" + val)}${quote})`
  );

  // JS: строки "/..." внутри JS-файлов
  if (filePath.endsWith(".js")) {
    content = content.replace(
      /(["'`])\/([^"'`]+?)\1/g,
      (_, quote, val) => `${quote}${addPrefix("/" + val)}${quote}`
    );
  }

  fs.writeFileSync(filePath, content, "utf-8");
  console.log("✔ Обработан:", filePath);
}

function walk(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    // Пропустить сам скрипт
    if (file === "fix.js") return;

    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (exts.includes(path.extname(fullPath))) {
      processFile(fullPath);
    }
  });
}

// Запуск обработки файлов проекта
walk(path.resolve(__dirname));

// Обработка news.json (обложка и фото)
const newsPath = path.join(__dirname, "data", "news.json");

if (fs.existsSync(newsPath)) {
  const raw = fs.readFileSync(newsPath, "utf-8");
  const news = JSON.parse(raw);

  news.forEach((item) => {
    if (
      item.cover &&
      item.cover.startsWith("/") &&
      !item.cover.startsWith(prefix)
    ) {
      item.cover = prefix + item.cover.slice(1);
    }
    if (Array.isArray(item.photos)) {
      item.photos = item.photos.map((photo) =>
        photo.startsWith("/") && !photo.startsWith(prefix)
          ? prefix + photo.slice(1)
          : photo
      );
    }
  });

  fs.writeFileSync(newsPath, JSON.stringify(news, null, 2), "utf-8");
  console.log("✔ Обработан:", newsPath);
}
