const fs = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "app", "listening", "part-4", "page.js");

if (!fs.existsSync(file)) {
  console.error("Cannot find:", file);
  process.exit(1);
}

let code = fs.readFileSync(file, "utf8");
const backup = file + ".backup-remove-play-limit-text-" + Date.now();
fs.writeFileSync(backup, code, "utf8");

// Xoá text giới hạn lượt nghe
code = code.replace(/\s*<strong>2 of 2 plays remaining<\/strong>/g, "");

// Đổi audioBar từ 2 cột về 1 cột để audio chiếm hết ngang
code = code.replace(
/\.audioBar\s*\{[\s\S]*?\n\s*\}/,
`.audioBar {
          min-height: 76px;
          display: grid;
          grid-template-columns: 1fr;
          align-items: center;
          gap: 22px;
          border-radius: 18px;
          background: #e6003f;
          padding: 16px 22px;
          margin-bottom: 28px;
          color: white;
          box-shadow: 0 14px 28px rgba(217, 4, 41, 0.16);
        }`
);

// Xoá CSS thừa nếu có
code = code.replace(
/\s*\.audioBar strong\s*\{[\s\S]*?\n\s*\}/g,
""
);

fs.writeFileSync(file, code, "utf8");

console.log("Removed Part 4 audio play limit text.");
console.log("Backup:", backup);
