const fs = require("fs");
const path = require("path");

const root = process.cwd();

const candidates = [
  "app/listening/part-1/page.js",
  "app/listening/part-1/page.jsx",
  "app/listening/part-1/page.tsx",
];

const file = candidates
  .map((x) => path.join(root, x))
  .find((x) => fs.existsSync(x));

if (!file) {
  console.error("Cannot find Part 1 listening page.");
  process.exit(1);
}

let code = fs.readFileSync(file, "utf8");
const backup = file + ".backup-suspense-searchparams-" + Date.now();
fs.copyFileSync(file, backup);

if (!code.includes("useSearchParams")) {
  console.log("No useSearchParams found. Nothing to patch.");
  process.exit(0);
}

if (code.includes("function ListeningPart1SuspenseWrapper")) {
  console.log("Already patched.");
  process.exit(0);
}

// Thêm Suspense vào import React
if (/import\s*\{[^}]*\}\s*from\s*["']react["'];/.test(code)) {
  code = code.replace(/import\s*\{([^}]*)\}\s*from\s*["']react["'];/, (match, imports) => {
    const names = imports.split(",").map((x) => x.trim()).filter(Boolean);
    if (!names.includes("Suspense")) names.push("Suspense");
    return `import { ${names.join(", ")} } from "react";`;
  });
} else {
  code = code.replace(/("use client";\s*)/, `$1\nimport { Suspense } from "react";\n`);
}

// Đổi default component thành content component
let originalName = "";

code = code.replace(
  /export\s+default\s+function\s+([A-Za-z0-9_]+)\s*\(/,
  (match, name) => {
    originalName = name;
    return `function ${name}Content(`;
  }
);

if (!originalName) {
  console.error("Cannot find default function component in:", path.relative(root, file));
  console.log("Backup:", path.relative(root, backup));
  process.exit(1);
}

// Thêm wrapper Suspense ở cuối file
code += `

export default function ListeningPart1SuspenseWrapper() {
  return (
    <Suspense
      fallback={
        <main style={{ minHeight: "100vh", padding: 24, background: "#fff6f8", color: "#e6003f", fontWeight: 900 }}>
          Đang tải Part 1...
        </main>
      }
    >
      <${originalName}Content />
    </Suspense>
  );
}
`;

fs.writeFileSync(file, code, "utf8");

console.log("Patched:", path.relative(root, file));
console.log("Backup:", path.relative(root, backup));
