const fs = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "app", "dashboard", "listening", "part-4", "page.js");

if (!fs.existsSync(file)) {
  console.error("Cannot find:", file);
  process.exit(1);
}

let code = fs.readFileSync(file, "utf8");
const backup = file + ".backup-part4-toolbar-like-part3-" + Date.now();
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

  if (targetIndex === -1) return null;

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
        candidates.push({ start, end, length: end - start });
      }
    }
  }

  if (!candidates.length) return null;

  candidates.sort((a, b) => a.length - b.length);
  const picked = candidates[0];

  code = code.slice(0, picked.start) + "\n\n" + code.slice(picked.end);

  return picked.start;
}

const oldToolbarStart = removeBlockContaining([
  "Thêm dòng",
  "Nhân bản dòng",
  "Xóa dòng",
  "Dán hàng loạt",
  "Xuất JSON",
  "Xóa tất cả"
]);

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

const helpers = `
  const part4SelectedCount = rows.filter((row) => row.selected).length;
  const part4GuestCount = rows.filter((row) => row.guestVisible || row.showInGuest).length;

  function part4AddOneRow() {
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
            question: String(oldRows.length + 1),
            topic: "",
            question16: "",
            answer1: "",
            answer2: "",
            answer3: "",
            question17: "",
            choice1: "",
            choice2: "",
            choice3: "",
            paraphrase: "",
          },
    ]);
  }

  function part4ShowGuestRows() {
    const hasSelected = rows.some((row) => row.selected);

    if (!hasSelected) {
      alert("Vui lòng tick chọn các bài muốn hiển thị ở giao diện khách.");
      return;
    }

    setRows((oldRows) =>
      oldRows.map((row) =>
        row.selected
          ? { ...row, selected: false, guestVisible: true, showInGuest: true }
          : row
      )
    );
  }

  function part4HideGuestRows() {
    const hasSelected = rows.some((row) => row.selected);

    if (!hasSelected) {
      alert("Vui lòng tick chọn các bài muốn ẩn khỏi giao diện khách.");
      return;
    }

    setRows((oldRows) =>
      oldRows.map((row) =>
        row.selected
          ? { ...row, selected: false, guestVisible: false, showInGuest: false }
          : row
      )
    );
  }

  async function part4SaveAll() {
    try {
      const res = await fetch("/api/admin/part4/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rows }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Save failed");
      }

      alert(\`Đã lưu Part 4 thành công. Hiện khách: \${data.guestCount}/\${data.count} bài.\`);
    } catch (error) {
      console.error(error);
      alert("Không lưu được Part 4. Vui lòng xem lỗi trong terminal.");
    }
  }

`;

if (!code.includes("part4ShowGuestRows")) {
  code = code.slice(0, returnIndex) + helpers + "\n" + code.slice(returnIndex);
}

const newPanel = `
        <section className="part4GuestControlPanel">
          <div className="part4GuestToolbar">
            <button type="button" className="part4PrimaryBtn" onClick={part4ShowGuestRows}>
              Chọn câu hiển thị giao diện khách
            </button>

            <button type="button" onClick={part4HideGuestRows}>
              Ẩn câu khỏi giao diện khách
            </button>

            <button type="button" onClick={part4AddOneRow}>
              + Thêm dòng
            </button>

            <button type="button" className="part4PrimaryBtn" onClick={part4SaveAll}>
              Lưu toàn bộ
            </button>
          </div>
        </section>

        <section className="part4GuestCountPanel">
          <div>Đang tick: {part4SelectedCount} bài</div>
          <div>Hiện khách: {part4GuestCount} bài</div>
        </section>

`;

let insertAt = oldToolbarStart;

if (insertAt === null || insertAt === undefined) {
  const markers = ["Độc thoại", "Tóm tắt", "<table"];
  insertAt = -1;

  for (const marker of markers) {
    const index = code.indexOf(marker);
    if (index !== -1) {
      insertAt = index;
      break;
    }
  }

  if (insertAt !== -1) {
    for (const tagName of ["section", "div"]) {
      const re = new RegExp(`<${tagName}\\b[^>]*>`, "gi");
      let match;
      let bestStart = -1;

      while ((match = re.exec(code)) !== null) {
        if (match.index > insertAt) break;
        const end = findMatchingEnd(code, match.index, tagName);
        if (end !== -1 && end > insertAt) bestStart = match.index;
      }

      if (bestStart !== -1) {
        insertAt = bestStart;
        break;
      }
    }
  }
}

if (insertAt === -1 || insertAt === null || insertAt === undefined) {
  console.error("Cannot find a safe place to insert Part 4 panel.");
  console.log("Backup:", backup);
  process.exit(1);
}

code = code.slice(0, insertAt) + newPanel + code.slice(insertAt);

const cssBlock = `
        .part4GuestControlPanel,
        .part4GuestCountPanel {
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid #ffc0cc;
          box-shadow: 0 14px 34px rgba(190, 18, 60, 0.12);
          border-radius: 24px;
          padding: 18px;
          margin-bottom: 14px;
        }

        .part4GuestToolbar {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .part4GuestToolbar button {
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

        .part4GuestToolbar .part4PrimaryBtn {
          background: #e6003f;
          color: white;
          border-color: #e6003f;
        }

        .part4GuestCountPanel {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 18px;
        }

        .part4GuestCountPanel div {
          border: 1px solid #ffc0cc;
          background: white;
          color: #9f001f;
          border-radius: 18px;
          padding: 14px 20px;
          font-weight: 900;
        }

`;

if (!code.includes(".part4GuestControlPanel")) {
  const styleEnd = code.lastIndexOf("`}</style>");

  if (styleEnd !== -1) {
    code = code.slice(0, styleEnd) + cssBlock + code.slice(styleEnd);
  }
}

fs.writeFileSync(file, code, "utf8");

console.log("Updated Part 4 toolbar like Part 3.");
console.log("Backup:", backup);
