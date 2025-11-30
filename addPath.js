// fix-paths.js
const fs = require("fs");
const path = require("path");

const directory = path.join(__dirname, "out");

function fixFiles(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.lstatSync(filePath);

    if (stat.isDirectory()) {
      fixFiles(filePath);
      continue;
    }

    if (!file.endsWith(".html") && !file.endsWith(".js") && !file.endsWith(".css")) continue;

    let content = fs.readFileSync(filePath, "utf8");

    // Fix absolute /music-sheets-working/ → ./music-sheets-working/
    content = content.replace(/\/music-sheets-working\//g, "./music-sheets-working/");

    fs.writeFileSync(filePath, content, "utf8");
    console.log("Fixed", filePath);
  }
}

fixFiles(directory);
console.log("✔ All asset paths corrected in /out");
