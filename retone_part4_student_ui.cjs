const fs = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "app", "listening", "part-4", "page.js");

if (!fs.existsSync(file)) {
  console.error("Cannot find:", file);
  process.exit(1);
}

let code = fs.readFileSync(file, "utf8");
const backup = file + ".backup-aptis-red-theme-" + Date.now();
fs.writeFileSync(backup, code, "utf8");

const replacements = [
  ["#c91664", "#e6003f"],
  ["#8d0645", "#9f001f"],
  ["#fff7fa", "#fff6f8"],
  ["#fff0f6", "#fff0f3"],
  ["#ffc3d8", "#ffc0cc"],
  ["rgba(199, 22, 100, 0.16)", "rgba(217, 4, 41, 0.16)"],
  ["rgba(199, 22, 100, 0.18)", "rgba(217, 4, 41, 0.18)"],
  ["rgba(199, 18, 92, 0.04)", "rgba(244, 63, 94, 0.06)"],
];

for (const [from, to] of replacements) {
  code = code.split(from).join(to);
}

// Tinh chỉnh thêm một số vùng để đồng bộ với Part 3
code = code
  .replace(
/\.part4PracticePage\s*\{[\s\S]*?\n\s*\}/,
`.part4PracticePage {
          min-height: 100vh;
          padding: 22px 22px 104px;
          background:
            linear-gradient(rgba(255, 246, 248, 0.96), rgba(255, 246, 248, 0.96)),
            repeating-linear-gradient(
              -14deg,
              rgba(244, 63, 94, 0.06) 0,
              rgba(244, 63, 94, 0.06) 2px,
              transparent 2px,
              transparent 86px
            );
          color: #202033;
        }`
  )
  .replace(
/\.audioBar\s*\{[\s\S]*?\n\s*\}/,
`.audioBar {
          min-height: 76px;
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 22px;
          border-radius: 18px;
          background: #e6003f;
          padding: 16px 22px;
          margin-bottom: 28px;
          color: white;
          box-shadow: 0 14px 28px rgba(217, 4, 41, 0.16);
        }`
  )
  .replace(
/\.questionCard\s*\{[\s\S]*?\n\s*\}/,
`.questionCard {
          border: 1px solid #ffc0cc;
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.94);
          padding: 38px 42px;
          margin-bottom: 28px;
          box-shadow: 0 14px 34px rgba(190, 18, 60, 0.08);
        }`
  )
  .replace(
/\.bottomNav\s*\{[\s\S]*?\n\s*\}/,
`.bottomNav {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          min-height: 82px;
          display: grid;
          grid-template-columns: 180px 1fr 180px;
          align-items: center;
          gap: 20px;
          padding: 14px 46px;
          background: rgba(255, 240, 243, 0.96);
          border-top: 1px solid #ffc0cc;
          backdrop-filter: blur(12px);
          z-index: 20;
        }`
  );

fs.writeFileSync(file, code, "utf8");

console.log("Updated Part 4 student UI to Aptis red pastel theme.");
console.log("Backup:", backup);
