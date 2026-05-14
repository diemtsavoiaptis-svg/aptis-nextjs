const fs = require("fs");
const path = require("path");

const cssFile = path.join(process.cwd(), "app", "globals.css");

if (!fs.existsSync(cssFile)) {
  console.error("Cannot find app/globals.css");
  process.exit(1);
}

let css = fs.readFileSync(cssFile, "utf8");
const backup = cssFile + ".backup-dashboard-wide-layout-" + Date.now();
fs.writeFileSync(backup, css, "utf8");

const start = "/* DASHBOARD WIDE LEFT SIDEBAR FIX START */";
const end = "/* DASHBOARD WIDE LEFT SIDEBAR FIX END */";

const block = `
${start}
@media (min-width: 1024px) {
  body:has(a[href="/dashboard/listening"]) aside {
    position: fixed !important;
    left: 0 !important;
    top: 0 !important;
    bottom: 0 !important;
    width: 300px !important;
    margin: 0 !important;
    border-radius: 0 28px 28px 0 !important;
    z-index: 50 !important;
  }

  body:has(a[href="/dashboard/listening"]) main {
    width: calc(100vw - 300px) !important;
    max-width: none !important;
    margin-left: 300px !important;
    margin-right: 0 !important;
    padding-left: 24px !important;
    padding-right: 32px !important;
  }

  body:has(a[href="/dashboard/listening"]) .shell,
  body:has(a[href="/dashboard/listening"]) .page > .shell,
  body:has(a[href="/dashboard/listening"]) main > .shell {
    width: 100% !important;
    max-width: none !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }

  body:has(a[href="/dashboard/listening"]) .tablePanel {
    width: 100% !important;
  }

  body:has(a[href="/dashboard/listening"]) table {
    min-width: 100% !important;
  }
}

@media (max-width: 1023px) {
  body:has(a[href="/dashboard/listening"]) aside {
    position: relative !important;
    width: 100% !important;
    border-radius: 24px !important;
  }

  body:has(a[href="/dashboard/listening"]) main {
    width: 100% !important;
    margin-left: 0 !important;
    padding-left: 12px !important;
    padding-right: 12px !important;
  }
}
${end}
`;

const oldBlockRegex = new RegExp(`${start}[\\s\\S]*?${end}`, "g");

if (oldBlockRegex.test(css)) {
  css = css.replace(oldBlockRegex, block.trim());
} else {
  css = css.trimEnd() + "\n\n" + block.trim() + "\n";
}

fs.writeFileSync(cssFile, css, "utf8");

console.log("Updated dashboard wide layout.");
console.log("Backup:", backup);
