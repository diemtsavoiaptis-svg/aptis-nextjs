const fs = require("fs");
const path = require("path");

const files = [
  "app/dashboard/page.js",
  "app/dashboard/students/approval/page.js"
];

for (const relative of files) {
  const file = path.join(process.cwd(), relative);

  if (!fs.existsSync(file)) {
    console.log("Missing:", relative);
    continue;
  }

  let code = fs.readFileSync(file, "utf8");

  if (!code.startsWith('"use client";') && !code.startsWith("'use client';")) {
    const backup = file + ".backup-add-use-client-" + Date.now();
    fs.copyFileSync(file, backup);

    code = `"use client";\n\n${code}`;
    fs.writeFileSync(file, code, "utf8");

    console.log("Fixed:", relative);
    console.log("Backup:", backup);
  } else {
    console.log("Already fixed:", relative);
  }
}
