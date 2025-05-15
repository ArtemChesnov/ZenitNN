const fs = require("fs");
const path = require("path");

const exts = [".html", ".css", ".js"];
const prefix = "/ZenitNN/";
const newsPath = path.join(__dirname, "data", "news.json");

function removePrefix(value) {
  if (value && value.startsWith(prefix)) {
    return "/" + value.slice(prefix.length);
  }
  return null; // если нечего удалять
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");
  let removed = false;

  // HTML: href, src, action
  content = content.replace(
    /(href|src|action)\s*=\s*["']\/ZenitNN\/([^"']+)["']/gi,
    (_, attr, val) => {
      removed = true;
      return `${attr}="/${val}"`;
    }
  );

  // CSS: url('/ZenitNN/...')
  content = content.replace(
    /url\((['"]?)\/ZenitNN\/([^)'"]+)\1\)/gi,
    (_, quote, val) => {
      removed = true;
      return `url(${quote}/${val}${quote})`;
    }
  );

  // JS: строки "/ZenitNN/..." в кавычках
  if (filePath.endsWith(".js")) {
    content = content.replace(
      /(["'`])\/ZenitNN\/([^"'`]+?)\1/g,
      (_, quote, val) => {
        removed = true;
        return `${quote}/${val}${quote}`;
      }
    );
  }

  fs.writeFileSync(filePath, content, "utf-8");

  if (removed) {
    console.log("🧹 Префикс удалён в:", filePath);
  } else {
    console.log("📄 Префиксов не найдено в:", filePath);
  }
}

function walk(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (["fix.js", "unfix.js"].includes(file)) return;

    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (exts.includes(path.extname(fullPath).toLowerCase())) {
      processFile(fullPath);
    }
  });
}

walk(process.cwd());

// Обработка news.json
if (fs.existsSync(newsPath)) {
  const raw = fs.readFileSync(newsPath, "utf-8");
  const news = JSON.parse(raw);
  let removed = false;

  news.forEach((item) => {
    if (item.cover && item.cover.startsWith(prefix)) {
      item.cover = removePrefix(item.cover);
      removed = true;
    }
    if (Array.isArray(item.photos)) {
      item.photos = item.photos.map((photo) => {
        if (photo.startsWith(prefix)) {
          removed = true;
          return removePrefix(photo);
        }
        return photo;
      });
    }
  });

  fs.writeFileSync(newsPath, JSON.stringify(news, null, 2), "utf-8");

  if (removed) {
    console.log("🧹 Префикс удалён в:", newsPath);
  } else {
    console.log("📄 Префиксов не найдено в:", newsPath);
  }
}
