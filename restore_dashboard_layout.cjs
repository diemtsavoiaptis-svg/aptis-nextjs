const fs = require("fs");
const path = require("path");

const cssFile = path.join(process.cwd(), "app", "globals.css");

if (!fs.existsSync(cssFile)) {
  console.error("Cannot find app/globals.css");
  process.exit(1);
}

let css = fs.readFileSync(cssFile, "utf8");

const backup = cssFile + ".backup-restore-before-sidebar-fix-" + Date.now();
fs.writeFileSync(backup, css, "utf8");

// Xóa block CSS đã thêm sai trước đó
css = css.replace(
  /\/\* DASHBOARD WIDE LEFT SIDEBAR FIX START \*\/[\s\S]*?\/\* DASHBOARD WIDE LEFT SIDEBAR FIX END \*\/\s*/g,
  ""
);

// Xóa thêm nếu còn sót selector lỗi
css = css.replace(
  /@media \(min-width: 1024px\) \{[\s\S]*?body:has\(a\[href="\/dashboard\/listening"\]\)[\s\S]*?\}\s*\}/g,
  ""
);

fs.writeFileSync(cssFile, css, "utf8");

console.log("Restored layout by removing sidebar override CSS.");
console.log("Backup:", backup);
