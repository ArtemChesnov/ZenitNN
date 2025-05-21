import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "index.html");

let content = fs.readFileSync(filePath, "utf-8");

// Заменяем ссылки вида /pages/xxx.html на /xxx
content = content.replace(/\/pages\/([a-zA-Z0-9_-]+)\.html/g, "/$1");

fs.writeFileSync(filePath, content);

console.log("index.html обновлён");
