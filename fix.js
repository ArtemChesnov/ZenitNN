const fs = require("fs");
const path = require("path");

const exts = [".html", ".css", ".js"];
const prefix = "/ZenitNN/";
const newsPath = path.join(__dirname, "data", "news.json");

function addPrefix(value) {
  if (
    !value ||
    value.startsWith("http") ||
    value.startsWith("data:") ||
    value.startsWith("tel:") ||
    value.startsWith("mailto:")
  ) {
    return value;
  }

  if (value.startsWith(prefix)) {
    return null; // префикс уже есть, не трогаем
  }

  if (value.startsWith("/")) {
    return prefix + value.slice(1);
  }

  return value;
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");
  let alreadyPrefixed = false;

  // HTML: href, src, action
  content = content.replace(
    /(href|src|action)\s*=\s*["'](\/[^"']+)["']/gi,
    (_, attr, val) => {
      const updated = addPrefix(val);
      if (updated === null) {
        alreadyPrefixed = true;
        return `${attr}="${val}"`;
      }
      return `${attr}="${updated}"`;
    }
  );

  // CSS: url('/...')
  content = content.replace(
    /url\((['"]?)\/([^)'"]+)\1\)/gi,
    (_, quote, val) => {
      const updated = addPrefix("/" + val);
      if (updated === null) {
        alreadyPrefixed = true;
        return `url(${quote}/${val}${quote})`;
      }
      return `url(${quote}${updated}${quote})`;
    }
  );

  // JS: строки "/..."
  if (filePath.endsWith(".js")) {
    content = content.replace(/(["'`])\/([^"'`]+?)\1/g, (_, quote, val) => {
      const updated = addPrefix("/" + val);
      if (updated === null) {
        alreadyPrefixed = true;
        return `${quote}/${val}${quote}`;
      }
      return `${quote}${updated}${quote}`;
    });
  }

  fs.writeFileSync(filePath, content, "utf-8");

  if (alreadyPrefixed) {
    console.log("📄 Уже содержит префиксы:", filePath);
  } else {
    console.log("✅ Префиксы добавлены в:", filePath);
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

// JSON
if (fs.existsSync(newsPath)) {
  const raw = fs.readFileSync(newsPath, "utf-8");
  const news = JSON.parse(raw);
  let changed = false;

  news.forEach((item) => {
    if (
      item.cover &&
      item.cover.startsWith("/") &&
      !item.cover.startsWith(prefix)
    ) {
      item.cover = prefix + item.cover.slice(1);
      changed = true;
    }
    if (Array.isArray(item.photos)) {
      item.photos = item.photos.map((photo) => {
        if (photo.startsWith("/") && !photo.startsWith(prefix)) {
          changed = true;
          return prefix + photo.slice(1);
        }
        return photo;
      });
    }
  });

  fs.writeFileSync(newsPath, JSON.stringify(news, null, 2), "utf-8");

  if (changed) {
    console.log("✅ Префикс добавлен в:", newsPath);
  } else {
    console.log("📄 Префиксы уже есть в:", newsPath);
  }
}
