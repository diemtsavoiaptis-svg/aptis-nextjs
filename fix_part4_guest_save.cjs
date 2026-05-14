const fs = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "app", "dashboard", "listening", "part-4", "page.js");

if (!fs.existsSync(file)) {
  console.error("Cannot find:", file);
  process.exit(1);
}

let code = fs.readFileSync(file, "utf8");
const backup = file + ".backup-fix-part4-guest-save-" + Date.now();
fs.writeFileSync(backup, code, "utf8");

// Sửa showGuestRows: dòng đang tick sẽ thành hiện khách, không phụ thuộc state chậm
code = code.replace(
/function showGuestRows\(\) \{[\s\S]*?\n  \}/,
`function showGuestRows() {
    const hasSelected = rows.some((row) => row.selected);

    if (!hasSelected) {
      alert("Vui lòng tick chọn các bài muốn hiển thị ở giao diện khách.");
      return;
    }

    setRows((oldRows) =>
      oldRows.map((row) =>
        row.selected
          ? {
              ...row,
              selected: false,
              guestVisible: true,
              showInGuest: true,
            }
          : row
      )
    );
  }`
);

// Sửa saveAll: nếu còn dòng đang tick thì tự chuyển thành hiện khách trước khi lưu
code = code.replace(
/async function saveAll\(\) \{[\s\S]*?\n  \}/,
`async function saveAll() {
    try {
      setSaving(true);

      const rowsToSave = rows.map((row) =>
        row.selected
          ? {
              ...row,
              selected: false,
              guestVisible: true,
              showInGuest: true,
            }
          : {
              ...row,
              guestVisible: Boolean(row.guestVisible || row.showInGuest),
              showInGuest: Boolean(row.guestVisible || row.showInGuest),
            }
      );

      setRows(rowsToSave);

      const res = await fetch("/api/admin/part4/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rows: rowsToSave }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Save failed");
      }

      alert(\`Đã lưu Part 4 thành công. Hiện khách: \${data.guestCount}/\${data.count} bài.\`);
    } catch (error) {
      console.error(error);
      alert("Không lưu được Part 4. Vui lòng xem lỗi trong terminal.");
    } finally {
      setSaving(false);
    }
  }`
);

fs.writeFileSync(file, code, "utf8");

console.log("Fixed Part 4 guest visibility saving.");
console.log("Backup:", backup);
