const fs = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "app", "listening", "part-3", "page.js");

if (!fs.existsSync(file)) {
  console.error("Cannot find:", file);
  process.exit(1);
}

let code = fs.readFileSync(file, "utf8");
const backup = file + ".backup-format-transcript-" + Date.now();
fs.writeFileSync(backup, code, "utf8");

// 1. Thêm helper formatTranscript trước component nếu chưa có
if (!code.includes("function formatTranscript")) {
  const helper = `
function formatTranscript(text) {
  const raw = String(text || "").trim();

  if (!raw) return [];

  const normalized = raw
    .replace(/\\s+/g, " ")
    .replace(/\\b(W|Woman)\\s*:/g, "|||W:")
    .replace(/\\b(M|Man)\\s*:/g, "|||M:")
    .replace(/^\\|\\|\\|/, "");

  return normalized
    .split("|||")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const speakerMatch = line.match(/^(W|M):\\s*/);
      const speaker = speakerMatch ? speakerMatch[1] : "";
      const content = speakerMatch ? line.replace(/^(W|M):\\s*/, "").trim() : line;

      return {
        id: index,
        speaker,
        content,
      };
    });
}

`;
  code = code.replace(
    /function getStatements\(row\)\s*\{/,
    helper + "\nfunction getStatements(row) {"
  );
}

// 2. Thay phần voiceBox text thô bằng transcript rows
code = code.replace(
/<section className="voiceBox">\s*\{currentRow\.voiceParagraph \|\| "Chưa có dữ liệu lời thoại\."\}\s*<\/section>/,
`<section className="voiceBox">
            {formatTranscript(currentRow.voiceParagraph).length ? (
              formatTranscript(currentRow.voiceParagraph).map((item) => (
                <div key={item.id} className={item.speaker === "W" ? "voiceLine woman" : "voiceLine man"}>
                  <span>{item.speaker || "Text"}</span>
                  <p>{item.content}</p>
                </div>
              ))
            ) : (
              <div className="voiceLine">
                <span>Text</span>
                <p>Chưa có dữ liệu lời thoại.</p>
              </div>
            )}
          </section>`
);

// 3. Fallback nếu voiceBox đang có nội dung khác
code = code.replace(
/<section className="voiceBox">\s*\{currentRow\.voiceParagraph[\s\S]*?\}\s*<\/section>/,
`<section className="voiceBox">
            {formatTranscript(currentRow.voiceParagraph).length ? (
              formatTranscript(currentRow.voiceParagraph).map((item) => (
                <div key={item.id} className={item.speaker === "W" ? "voiceLine woman" : "voiceLine man"}>
                  <span>{item.speaker || "Text"}</span>
                  <p>{item.content}</p>
                </div>
              ))
            ) : (
              <div className="voiceLine">
                <span>Text</span>
                <p>Chưa có dữ liệu lời thoại.</p>
              </div>
            )}
          </section>`
);

// 4. Cập nhật CSS voiceBox + thêm voiceLine
code = code.replace(
/\.voiceBox\s*\{[\s\S]*?\n\s*\}/,
`.voiceBox {
          max-height: 260px;
          overflow-y: auto;
          border-radius: 22px;
          border: 1px solid #ffd0dc;
          background: #fff7f9;
          padding: 14px;
          margin-bottom: 14px;
          display: grid;
          gap: 10px;
        }`
);

if (!code.includes(".voiceLine {")) {
  const css = `
        .voiceLine {
          display: grid;
          grid-template-columns: 44px 1fr;
          gap: 12px;
          align-items: start;
          border-radius: 16px;
          background: white;
          border: 1px solid #ffe1e8;
          padding: 12px 14px;
        }

        .voiceLine span {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f21858;
          color: white;
          font-weight: 900;
          font-size: 14px;
        }

        .voiceLine.man span {
          background: #f21858;
        }

        .voiceLine.woman span {
          background: #b91c4a;
        }

        .voiceLine p {
          margin: 0;
          color: #4d4d62;
          font-size: 15px;
          line-height: 1.55;
        }

`;
  code = code.replace(/@media \(max-width: 900px\)/, css + "\n        @media (max-width: 900px)");
}

fs.writeFileSync(file, code, "utf8");

console.log("Formatted Part 3 transcript by speaker.");
console.log("Backup:", backup);
