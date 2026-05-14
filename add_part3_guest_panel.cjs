const fs = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "app", "dashboard", "listening", "part-3", "page.js");

if (!fs.existsSync(file)) {
  console.error("Cannot find:", file);
  process.exit(1);
}

let code = fs.readFileSync(file, "utf8");
const backup = file + ".backup-add-part3-guest-panel-" + Date.now();
fs.writeFileSync(backup, code, "utf8");

if (code.includes("part3-guest-control-panel")) {
  console.log("Part 3 guest control panel already exists. Nothing changed.");
  console.log("Backup:", backup);
  process.exit(0);
}

// Remove old bulk update panel if it still exists
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
    if (depth === 0) return re.lastIndex;
  }

  return -1;
}

const bulkTitle = "Bảng cập nhật hàng loạt";
const bulkIndex = code.indexOf(bulkTitle);

if (bulkIndex !== -1) {
  const candidates = [];

  for (const tagName of ["section", "div"]) {
    const re = new RegExp(`<${tagName}\\b[^>]*>`, "gi");
    let match;

    while ((match = re.exec(code)) !== null) {
      const start = match.index;
      if (start > bulkIndex) break;

      const end = findMatchingEnd(code, start, tagName);
      if (end === -1 || end < bulkIndex) continue;

      const block = code.slice(start, end);
      if (
        block.includes("Bảng cập nhật hàng loạt") &&
        block.includes("Lưu toàn bộ") &&
        !block.includes("Link Audio") &&
        !block.includes("Câu hỏi 1")
      ) {
        candidates.push({ start, end, length: end - start });
      }
    }
  }

  if (candidates.length) {
    candidates.sort((a, b) => a.length - b.length);
    const picked = candidates[0];
    code = code.slice(0, picked.start) + "\n\n" + code.slice(picked.end);
  }
}

// Try to normalize common state/function names from older files
const helpers = `
  const selectedCount = rows.filter((row) => row.selected).length;
  const guestCount = rows.filter((row) => row.showInGuest).length;

  const selectGuestRows = () => {
    setRows((prev) =>
      prev.map((row) =>
        row.selected ? { ...row, showInGuest: true, selected: false } : row
      )
    );
  };

  const hideGuestRows = () => {
    setRows((prev) =>
      prev.map((row) =>
        row.selected ? { ...row, showInGuest: false, selected: false } : row
      )
    );
  };
`;

// Add helpers only if missing
if (!code.includes("const selectedCount = rows.filter")) {
  const returnIndex = code.indexOf("return (");
  if (returnIndex === -1) {
    console.error("Cannot find return block in Part 3 page.");
    process.exit(1);
  }
  code = code.slice(0, returnIndex) + helpers + "\n" + code.slice(returnIndex);
}

const panel = `
        <section className="part3-guest-control-panel rounded-[28px] border border-[#ffc9d2] bg-[#fff7f7] p-5 shadow-sm">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={selectGuestRows}
              className="rounded-2xl bg-[#e9003f] px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#c80035]"
            >
              Chọn câu hiển thị giao diện khách
            </button>

            <button
              type="button"
              onClick={hideGuestRows}
              className="rounded-2xl border border-[#ffc0cb] bg-white px-5 py-3 text-sm font-bold text-[#b00030] hover:bg-[#fff0f3]"
            >
              Ẩn câu khỏi giao diện khách
            </button>

            <button
              type="button"
              onClick={addRow}
              className="rounded-2xl border border-[#ffc0cb] bg-white px-5 py-3 text-sm font-bold text-[#b00030] hover:bg-[#fff0f3]"
            >
              + Thêm dòng
            </button>

            <button
              type="button"
              onClick={saveAll}
              className="rounded-2xl bg-[#e9003f] px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#c80035]"
            >
              Lưu toàn bộ
            </button>
          </div>
        </section>

        <section className="rounded-[28px] border border-[#ffc9d2] bg-[#fff7f7] p-5 shadow-sm">
          <div className="flex flex-wrap gap-3">
            <div className="rounded-2xl border border-[#ffc0cb] bg-white px-5 py-3 text-sm font-bold text-[#b00030]">
              Đang tick: {selectedCount} câu
            </div>
            <div className="rounded-2xl border border-[#ffc0cb] bg-white px-5 py-3 text-sm font-bold text-[#b00030]">
              Hiện khách: {guestCount} câu
            </div>
          </div>
        </section>
`;

// Insert before table/data area
const insertMarkers = [
  '<div className="overflow-x-auto"',
  '<div className="overflow-auto"',
  '<table',
];

let inserted = false;

for (const marker of insertMarkers) {
  const index = code.indexOf(marker);
  if (index !== -1) {
    code = code.slice(0, index) + panel + "\n" + code.slice(index);
    inserted = true;
    break;
  }
}

if (!inserted) {
  console.error("Cannot find table area to insert panel.");
  console.log("Backup:", backup);
  process.exit(1);
}

// Add compatibility aliases if your current functions use different names
code = code
  .replace(/onClick=\{addRow\}/g, code.includes("function addRow") || code.includes("const addRow") ? "onClick={addRow}" : "onClick={handleAddRow}")
  .replace(/onClick=\{saveAll\}/g, code.includes("function saveAll") || code.includes("const saveAll") ? "onClick={saveAll}" : "onClick={handleSave}");

fs.writeFileSync(file, code, "utf8");

console.log("Added Part 3 guest control panel.");
console.log("Backup:", backup);
