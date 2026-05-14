const fs = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "app", "dashboard", "listening", "part-3", "page.js");

if (!fs.existsSync(file)) {
  console.error("Cannot find file:", file);
  process.exit(1);
}

let code = fs.readFileSync(file, "utf8");
const backup = file + ".backup-remove-part3-bulk-panel-" + Date.now();
fs.writeFileSync(backup, code, "utf8");

const targetText = "Bảng cập nhật hàng loạt";
const targetIndex = code.indexOf(targetText);

if (targetIndex === -1) {
  console.log("Cannot find bulk update panel title. Nothing changed.");
  console.log("Backup:", backup);
  process.exit(0);
}

function findMatchingEnd(source, startIndex, tagName) {
  const re = new RegExp(`<\\/?${tagName}\\b[^>]*>`, "gi");
  re.lastIndex = startIndex;

  let depth = 0;
  let match;

  while ((match = re.exec(source)) !== null) {
    const token = match[0];
    const isClose = token.startsWith(`</${tagName}`);

    if (!isClose) depth++;
    else depth--;

    if (depth === 0) {
      return re.lastIndex;
    }
  }

  return -1;
}

const candidates = [];

for (const tagName of ["section", "div"]) {
  const re = new RegExp(`<${tagName}\\b[^>]*>`, "gi");
  let match;

  while ((match = re.exec(code)) !== null) {
    const start = match.index;
    if (start > targetIndex) break;

    const end = findMatchingEnd(code, start, tagName);
    if (end === -1 || end < targetIndex) continue;

    const block = code.slice(start, end);

    if (
      block.includes("Bảng cập nhật hàng loạt") &&
      block.includes("Lưu toàn bộ") &&
      !block.includes("Link Audio") &&
      !block.includes("Câu hỏi 1")
    ) {
      candidates.push({ start, end, length: end - start, tagName });
    }
  }
}

if (!candidates.length) {
  console.log("Could not safely detect the exact panel. No change made.");
  console.log("Backup:", backup);
  process.exit(0);
}

candidates.sort((a, b) => a.length - b.length);
const picked = candidates[0];

code = code.slice(0, picked.start) + "\n\n" + code.slice(picked.end);
fs.writeFileSync(file, code, "utf8");

console.log("Removed Part 3 bulk update panel.");
console.log("Removed tag:", picked.tagName);
console.log("Backup:", backup);
