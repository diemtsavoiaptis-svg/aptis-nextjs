const fs = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "app", "listening", "part-3", "page.js");

if (!fs.existsSync(file)) {
  console.error("Cannot find:", file);
  process.exit(1);
}

let code = fs.readFileSync(file, "utf8");
const backup = file + ".backup-compact-answer-panel-" + Date.now();
fs.writeFileSync(backup, code, "utf8");

// Xóa header trong answer panel: ANSWER SHEET / Chọn đáp án phù hợp / 4 câu
code = code.replace(
/\s*<div className="answerHeader">\s*<div>\s*<p>ANSWER SHEET<\/p>\s*<h2>Chọn đáp án phù hợp<\/h2>\s*<\/div>\s*<span>\{statements\.length\} câu<\/span>\s*<\/div>/,
""
);

// Nếu file đang dùng text khác một chút thì fallback xóa block answerHeader
code = code.replace(
/\s*<div className="answerHeader">[\s\S]*?<\/div>\s*<\/div>\s*<div className="answerList">/,
'\n          <div className="answerList">'
);

// Tối ưu CSS cho gọn diện tích
code = code
  .replace(
/\.answerPanel\s*\{[\s\S]*?\n\s*\}/,
`.answerPanel {
          border-radius: 26px;
          background: #f7f7fa;
          padding: 18px;
          margin-bottom: 18px;
          box-shadow: inset 0 0 0 1px #eeeeF3;
        }`
  )
  .replace(
/\.answerList\s*\{[\s\S]*?\n\s*\}/,
`.answerList {
          display: grid;
          gap: 10px;
        }`
  )
  .replace(
/\.answerRow\s*\{[\s\S]*?\n\s*\}/,
`.answerRow {
          display: grid;
          grid-template-columns: 1fr 220px;
          gap: 16px;
          align-items: center;
          min-height: 72px;
          border-radius: 18px;
          border: 1px solid #eeeeF3;
          background: white;
          padding: 12px 16px;
        }`
  )
  .replace(
/\.questionInfo p\s*\{[\s\S]*?\n\s*\}/,
`.questionInfo p {
          margin: 0;
          color: #303044;
          font-size: 16px;
          font-weight: 800;
          line-height: 1.28;
        }`
  )
  .replace(
/\.answerRow select\s*\{[\s\S]*?\n\s*\}/,
`.answerRow select {
          width: 100%;
          height: 46px;
          border-radius: 14px;
          border: 1px solid #e3e3ea;
          background: white;
          color: #303044;
          padding: 0 14px;
          font-weight: 800;
          outline: none;
        }`
  )
  .replace(
/\.bottomActions\s*\{[\s\S]*?\n\s*\}/,
`.bottomActions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          margin-top: 6px;
        }`
  );

fs.writeFileSync(file, code, "utf8");

console.log("Compacted Part 3 answer panel.");
console.log("Backup:", backup);
