const fs = require("fs");
const path = require("path");

const cssFile = path.join(process.cwd(), "app", "globals.css");

if (!fs.existsSync(cssFile)) {
  console.error("Cannot find app/globals.css");
  process.exit(1);
}

let css = fs.readFileSync(cssFile, "utf8");
const backup = cssFile + ".backup-remove-bad-sidebar-fix-" + Date.now();
fs.writeFileSync(backup, css, "utf8");

const start = "/* DASHBOARD WIDE LEFT SIDEBAR FIX START */";
const end = "/* DASHBOARD WIDE LEFT SIDEBAR FIX END */";

const regex = new RegExp(`${start}[\\s\\S]*?${end}\\s*`, "g");
css = css.replace(regex, "");

fs.writeFileSync(cssFile, css, "utf8");

console.log("Removed bad global sidebar CSS.");
console.log("Backup:", backup);
