const fs = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "app", "listening", "part-2", "page.js");

if (!fs.existsSync(file)) {
  console.error("Cannot find:", file);
  process.exit(1);
}

let code = fs.readFileSync(file, "utf8");
const backup = file + ".backup-fix-regex-unicode-escape-" + Date.now();
fs.copyFileSync(file, backup);

code = code
  .split(/\r?\n/)
  .map((line) => {
    if (line.includes("const match1 = text.match") && line.includes("d") && line.includes("([^/]+)")) {
      return '    const match1 = text.match(/\\/d\\/([^/]+)/);';
    }
    return line;
  })
  .join("\n");

fs.writeFileSync(file, code, "utf8");

console.log("Fixed regex in Part 2 page.");
console.log("Backup:", backup);
