const fs = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "app", "listening", "part-3", "page.js");

if (!fs.existsSync(file)) {
  console.error("Cannot find:", file);
  process.exit(1);
}

let code = fs.readFileSync(file, "utf8");
const backup = file + ".backup-compact-transcript-like-input-" + Date.now();
fs.writeFileSync(backup, code, "utf8");

// Thêm helper transcript dạng text gọn
if (!code.includes("function compactTranscript")) {
  const helper = `
function compactTranscript(text) {
  return String(text || "")
    .trim()
    .replace(/\\s+/g, " ")
    .replace(/\\b(W|Woman)\\s*:/g, "\\nW:")
    .replace(/\\b(M|Man)\\s*:/g, "\\nM:")
    .replace(/^\\n/, "");
}

`;
  code = code.replace(
    /function formatTranscript\(text\)\s*\{/,
    helper + "\nfunction formatTranscript(text) {"
  );

  if (!code.includes("function formatTranscript")) {
    code = code.replace(
      /function getStatements\(row\)\s*\{/,
      helper + "\nfunction getStatements(row) {"
    );
  }
}

// Thay voiceBox dạng nhiều card về 1 khung text gọn
code = code.replace(
/<section className="voiceBox">[\s\S]*?<\/section>\s*(?=<section className="answerPanel"|<section className="topicSection"|<section className="bottomActions")/,
`<section className="voiceBox">
            {compactTranscript(currentRow.voiceParagraph) || "Chưa có dữ liệu lời thoại."}
          </section>

        `
);

// CSS khung lời thoại gọn như ô nhập liệu
code = code.replace(
/\.voiceBox\s*\{[\s\S]*?\n\s*\}/,
`.voiceBox {
          max-height: 160px;
          overflow-y: auto;
          white-space: pre-wrap;
          border-radius: 16px;
          border: 1px solid #ffd0dc;
          background: #fff7f9;
          color: #4d4d62;
          font-size: 15px;
          line-height: 1.55;
          padding: 14px 16px;
          margin-bottom: 12px;
        }`
);

// Xóa CSS voiceLine cũ nếu có
code = code.replace(
/\s*\.voiceLine\s*\{[\s\S]*?\n\s*\}\s*\.voiceLine span\s*\{[\s\S]*?\n\s*\}\s*\.voiceLine\.man span\s*\{[\s\S]*?\n\s*\}\s*\.voiceLine\.woman span\s*\{[\s\S]*?\n\s*\}\s*\.voiceLine p\s*\{[\s\S]*?\n\s*\}\s*/g,
"\n"
);

fs.writeFileSync(file, code, "utf8");

console.log("Changed transcript to compact input-like block.");
console.log("Backup:", backup);
