const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.join(__dirname, "_next"); // scan your entire out folder
const FIND = /\/_next\//g;
const REPLACE = "./_next/";

// rewrite only .html files
const EXT = [".html"];

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      walk(filePath);
      return;
    }

    if (!EXT.includes(path.extname(file))) return;

    let content = fs.readFileSync(filePath, "utf8");

    if (FIND.test(content)) {
      const fixed = content.replace(FIND, REPLACE);
      fs.writeFileSync(filePath, fixed, "utf8");
      console.log("✔ Fixed:", filePath);
    }
  });
}

console.log("🔧 Rewriting asset paths in /_next ...");
walk(ROOT_DIR);
console.log("✅ Done!");
