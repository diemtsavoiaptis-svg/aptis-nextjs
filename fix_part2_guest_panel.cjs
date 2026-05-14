const fs = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "app", "dashboard", "listening", "part-2", "page.js");

if (!fs.existsSync(file)) {
  console.error("Cannot find:", file);
  process.exit(1);
}

let code = fs.readFileSync(file, "utf8");
const backup = file + ".backup-fix-part2-guest-panel-" + Date.now();
fs.writeFileSync(backup, code, "utf8");

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

function removeBlockContaining(labels) {
  const firstLabel = labels[0];
  const targetIndex = code.indexOf(firstLabel);

  if (targetIndex === -1) return false;

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
      const hasAllLabels = labels.every((label) => block.includes(label));

      if (hasAllLabels) {
        candidates.push({ start, end, length: end - start, tagName });
      }
    }
  }

  if (!candidates.length) return false;

  candidates.sort((a, b) => a.length - b.length);
  const picked = candidates[0];

  code = code.slice(0, picked.start) + "\n\n" + code.slice(picked.end);
  return true;
}

// Remove old Part 2 toolbar block from screenshot
removeBlockContaining([
  "Thêm dòng",
  "Nhân bản dòng",
  "Xóa dòng",
  "Dán hàng loạt",
  "Xuất JSON",
  "Xóa tất cả"
]);

// Remove panel if this script was already inserted before
removeBlockContaining([
  "Chọn câu hiển thị giao diện khách",
  "Ẩn câu khỏi giao diện khách",
  "Đang tick",
  "Hiện khách"
]);

const returnIndex = code.indexOf("return (");
if (returnIndex === -1) {
  console.error("Cannot find return block.");
  console.log("Backup:", backup);
  process.exit(1);
}

// Add safe helper functions before return
const helpers = `
  const selectedCount = rows.filter((row) => row.selected).length;
  const guestCount = rows.filter((row) => row.guestVisible || row.showInGuest).length;

  function part2AddOneRow() {
    if (typeof addRow === "function") {
      addRow();
      return;
    }

    if (typeof addRows === "function") {
      addRows(1);
      return;
    }

    setRows((oldRows) => [
      ...oldRows,
      typeof emptyRow === "function"
        ? emptyRow(oldRows.length)
        : {
            selected: false,
            guestVisible: false,
            showInGuest: false,
            stt: String(oldRows.length + 1),
            audio: "",
            audioLink: "",
            topic: "",
            person1: "",
            person2: "",
            person3: "",
            person4: "",
            voiceData: "",
          },
    ]);
  }

  function part2ShowGuestRows() {
    const hasSelected = rows.some((row) => row.selected);

    if (!hasSelected) {
      alert("Vui lòng tick chọn các câu muốn hiển thị ở giao diện khách.");
      return;
    }

    setRows((oldRows) =>
      oldRows.map((row) =>
        row.selected
          ? { ...row, guestVisible: true, showInGuest: true, selected: false }
          : row
      )
    );
  }

  function part2HideGuestRows() {
    const hasSelected = rows.some((row) => row.selected);

    if (!hasSelected) {
      alert("Vui lòng tick chọn các câu muốn ẩn khỏi giao diện khách.");
      return;
    }

    setRows((oldRows) =>
      oldRows.map((row) =>
        row.selected
          ? { ...row, guestVisible: false, showInGuest: false, selected: false }
          : row
      )
    );
  }

  function part2SaveAll() {
    if (typeof saveAll === "function") {
      saveAll();
      return;
    }

    if (typeof handleSave === "function") {
      handleSave();
      return;
    }

    alert("Đã lưu bản thiết kế trên giao diện. Bước sau sẽ nối lưu dữ liệu thật.");
  }

`;

if (!code.includes("function part2AddOneRow")) {
  code = code.slice(0, returnIndex) + helpers + "\n" + code.slice(returnIndex);
}

const panel = `
        <section className="part2GuestControlPanel">
          <div className="part2GuestToolbar">
            <button type="button" className="part2GuestPrimaryBtn" onClick={part2ShowGuestRows}>
              Chọn câu hiển thị giao diện khách
            </button>

            <button type="button" onClick={part2HideGuestRows}>
              Ẩn câu khỏi giao diện khách
            </button>

            <button type="button" onClick={part2AddOneRow}>
              + Thêm dòng
            </button>

            <button type="button" className="part2GuestPrimaryBtn" onClick={part2SaveAll}>
              Lưu toàn bộ
            </button>
          </div>
        </section>

        <section className="part2GuestCountPanel">
          <div>Đang tick: {selectedCount} câu</div>
          <div>Hiện khách: {guestCount} câu</div>
        </section>

`;

// Insert before main information/table panel
const markers = [
  "Nối thông tin",
  "Dòng đang chọn",
  "<table",
];

let inserted = false;

for (const marker of markers) {
  const index = code.indexOf(marker);
  if (index === -1) continue;

  let insertAt = index;

  for (const tagName of ["section", "div"]) {
    const re = new RegExp(`<${tagName}\\b[^>]*>`, "gi");
    let match;
    let bestStart = -1;

    while ((match = re.exec(code)) !== null) {
      if (match.index > index) break;
      const end = findMatchingEnd(code, match.index, tagName);
      if (end !== -1 && end > index) bestStart = match.index;
    }

    if (bestStart !== -1) {
      insertAt = bestStart;
      break;
    }
  }

  code = code.slice(0, insertAt) + panel + code.slice(insertAt);
  inserted = true;
  break;
}

if (!inserted) {
  console.error("Cannot find place to insert new panel.");
  console.log("Backup:", backup);
  process.exit(1);
}

// Add CSS before style end
const cssBlock = `
        .part2GuestControlPanel,
        .part2GuestCountPanel {
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid #ffc0cc;
          box-shadow: 0 14px 34px rgba(190, 18, 60, 0.12);
          border-radius: 24px;
          padding: 18px;
          margin-bottom: 14px;
        }

        .part2GuestToolbar {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .part2GuestToolbar button {
          min-height: 48px;
          padding: 0 18px;
          border-radius: 16px;
          border: 1px solid #ffc0cc;
          background: white;
          color: #9f001f;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 8px 18px rgba(190, 18, 60, 0.1);
        }

        .part2GuestToolbar .part2GuestPrimaryBtn {
          background: #e6003f;
          color: white;
          border-color: #e6003f;
        }

        .part2GuestCountPanel {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 18px;
        }

        .part2GuestCountPanel div {
          border: 1px solid #ffc0cc;
          background: white;
          color: #9f001f;
          border-radius: 18px;
          padding: 14px 20px;
          font-weight: 900;
        }

`;

if (!code.includes(".part2GuestControlPanel")) {
  const styleEnd = code.lastIndexOf("`}</style>");
  if (styleEnd !== -1) {
    code = code.slice(0, styleEnd) + cssBlock + code.slice(styleEnd);
  }
}

fs.writeFileSync(file, code, "utf8");

console.log("Fixed Part 2 toolbar and added guest control panel.");
console.log("Backup:", backup);
