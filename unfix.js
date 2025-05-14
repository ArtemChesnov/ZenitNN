const fs = require("fs");
const path = require("path");

const exts = [".html", ".css", ".js"];
const prefix = "/ZenitNN/";
const newsPath = path.join(__dirname, "data", "news.json");

// Удаляет префикс, если он есть
function removePrefix(value) {
  if (value && value.startsWith(prefix)) {
    return "/" + value.slice(prefix.length);
  }
  return value;
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");

  // HTML: href="/ZenitNN/...", src="/ZenitNN/...", action="/ZenitNN/..."
  content = content.replace(
    /(href|src|action)\s*=\s*["']\/ZenitNN\/([^"']+)["']/gi,
    (_, attr, val) => `${attr}="/ZenitNN/${val}"`
  );

  // CSS: url('/ZenitNN/...')
  content = content.replace(
    /url\((['"]?)\/ZenitNN\/([^)'"]+)\1\)/gi,
    (_, quote, val) => `url(${quote}/${val}${quote})`
  );

  // JS: строки "/ZenitNN/..." внутри JS-файлов
  if (filePath.endsWith(".js")) {
    content = content.replace(
      /(["'`])\/ZenitNN\/([^"'`]+?)\1/g,
      (_, quote, val) => `${quote}/${val}${quote}`
    );
  }

  fs.writeFileSync(filePath, content, "utf-8");
  console.log("❌ Префикс удалён в:", filePath);
}

function walk(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (file === "unfix.js") return; // пропуск самого скрипта

    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (exts.includes(path.extname(fullPath))) {
      processFile(fullPath);
    }
  });
}

// Удаление префиксов из файлов
walk(path.resolve(__dirname));

// Удаление префиксов из news.json
if (fs.existsSync(newsPath)) {
  const raw = fs.readFileSync(newsPath, "utf-8");
  const news = JSON.parse(raw);

  news.forEach((item) => {
    if (item.cover && item.cover.startsWith(prefix)) {
      item.cover = removePrefix(item.cover);
    }
    if (Array.isArray(item.photos)) {
      item.photos = item.photos.map((photo) =>
        photo.startsWith(prefix) ? removePrefix(photo) : photo
      );
    }
  });

  fs.writeFileSync(newsPath, JSON.stringify(news, null, 2), "utf-8");
  console.log("❌ Префикс удалён в:", newsPath);
}
