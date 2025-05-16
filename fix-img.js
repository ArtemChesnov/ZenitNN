const fs = require("fs");
const path = require("path");

const rootDir = "."; // Корневая папка (можно изменить на нужную)

function processHtmlFile(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");

  const updated = content.replace(
    /(<img[^>]+src=["'][^"']+)\.png(["'][^>]*>)/gi,
    "$1.webp$2"
  );

  if (content !== updated) {
    fs.writeFileSync(filePath, updated, "utf-8");
    console.log(`Обновлено: ${filePath}`);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (path.extname(fullPath) === ".html") {
      processHtmlFile(fullPath);
    }
  }
}

walk(rootDir);
