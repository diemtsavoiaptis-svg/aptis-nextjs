const fs = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "app", "listening", "part-3", "page.js");

if (!fs.existsSync(file)) {
  console.error("Cannot find:", file);
  process.exit(1);
}

let code = fs.readFileSync(file, "utf8");
const backup = file + ".backup-compact-audio-bar-" + Date.now();
fs.writeFileSync(backup, code, "utf8");

code = code
  .replace(
/\.audioSection\s*\{[\s\S]*?\n\s*\}/,
`.audioSection {
          display: grid;
          grid-template-columns: 1fr 170px;
          gap: 12px;
          margin-bottom: 12px;
        }`
  )
  .replace(
/\.audioMain\s*\{[\s\S]*?\n\s*\}/,
`.audioMain {
          display: grid;
          grid-template-columns: 76px 1fr;
          align-items: center;
          gap: 10px;
          border-radius: 20px;
          background: #f21858;
          padding: 10px 14px;
          box-shadow: 0 10px 20px rgba(242, 24, 88, 0.16);
        }`
  )
  .replace(
/\.audioLabel\s*\{[\s\S]*?\n\s*\}/,
`.audioLabel {
          color: white;
          font-weight: 900;
          font-size: 15px;
          text-align: center;
        }`
  )
  .replace(
/\.audioPlayerBox\s*\{[\s\S]*?\n\s*\}/,
`.audioPlayerBox {
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.22);
          padding: 6px 10px;
        }`
  )
  .replace(
/\.audioPlayerBox audio\s*\{[\s\S]*?\n\s*\}/,
`.audioPlayerBox audio {
          width: 100%;
          height: 30px;
        }`
  )
  .replace(
/\.transcriptBtn\s*\{[\s\S]*?\n\s*\}/,
`.transcriptBtn {
          min-height: 52px;
          border-radius: 18px;
          border: 2px solid #f21858;
          background: white;
          color: #f21858;
          font-weight: 900;
          cursor: pointer;
          font-size: 15px;
        }`
  );

fs.writeFileSync(file, code, "utf8");

console.log("Compacted Part 3 audio bar.");
console.log("Backup:", backup);
