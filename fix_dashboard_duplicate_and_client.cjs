const fs = require("fs");
const path = require("path");

const root = process.cwd();

function backupAndRemove(relativePath) {
  const file = path.join(root, relativePath);

  if (!fs.existsSync(file)) {
    console.log("Not found:", relativePath);
    return;
  }

  const backup = file + ".backup-duplicate-" + Date.now();
  fs.copyFileSync(file, backup);
  fs.unlinkSync(file);

  console.log("Removed duplicate:", relativePath);
  console.log("Backup:", path.relative(root, backup));
}

function forceUseClient(relativePath) {
  const file = path.join(root, relativePath);

  if (!fs.existsSync(file)) {
    console.log("Missing:", relativePath);
    return;
  }

  let code = fs.readFileSync(file, "utf8");

  const backup = file + ".backup-force-use-client-" + Date.now();
  fs.copyFileSync(file, backup);

  // Xóa mọi "use client" cũ nằm sai vị trí
  code = code
    .replace(/^\uFEFF/, "")
    .replace(/["']use client["'];\s*/g, "")
    .trimStart();

  code = `"use client";\n\n${code}`;

  fs.writeFileSync(file, code, "utf8");

  console.log("Fixed use client:", relativePath);
  console.log("Backup:", path.relative(root, backup));
}

// Fix duplicate /dashboard route
backupAndRemove("app/dashboard/page.jsx");

// Fix styled-jsx Client Component error
forceUseClient("app/dashboard/page.js");
forceUseClient("app/dashboard/students/approval/page.js");

console.log("");
console.log("Done fixing duplicate route and styled-jsx client error.");
