const fs = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "app", "dashboard", "listening", "part-4", "page.js");

if (!fs.existsSync(file)) {
  console.error("Cannot find:", file);
  process.exit(1);
}

let code = fs.readFileSync(file, "utf8");
const backup = file + ".backup-add-part4-view-buttons-" + Date.now();
fs.writeFileSync(backup, code, "utf8");

// Thêm 2 nút vào guestCountPanel
code = code.replace(
/<section className="guestCountPanel">\s*<div>Đang tick: \{selectedCount\} bài<\/div>\s*<div>Hiện khách: \{guestCount\} bài<\/div>\s*<\/section>/,
`<section className="guestCountPanel">
          <div className="countPills">
            <div>Đang tick: {selectedCount} bài</div>
            <div>Hiện khách: {guestCount} bài</div>
          </div>

          <div className="viewButtons">
            <Link href="/listening/part-4?mode=student">Giao diện học viên</Link>
            <Link href="/listening/part-4">Giao diện khách</Link>
          </div>
        </section>`
);

// CSS mới cho layout 2 bên
code = code.replace(
/\.guestCountPanel\s*\{[\s\S]*?\n\s*\}\s*\.guestCountPanel div\s*\{[\s\S]*?\n\s*\}/,
`.guestCountPanel {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          border-radius: 24px;
          padding: 18px;
          margin-bottom: 18px;
        }

        .countPills,
        .viewButtons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .countPills div {
          border: 1px solid #ffc0cc;
          background: white;
          color: #9f001f;
          border-radius: 18px;
          padding: 14px 20px;
          font-weight: 900;
        }

        .viewButtons a {
          min-height: 48px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          padding: 0 18px;
          border: 1px solid #ffc0cc;
          background: white;
          color: #9f001f;
          font-weight: 900;
          text-decoration: none;
          box-shadow: 0 8px 18px rgba(190, 18, 60, 0.1);
        }

        .viewButtons a:first-child {
          background: #e6003f;
          color: white;
          border-color: #e6003f;
        }`
);

fs.writeFileSync(file, code, "utf8");

console.log("Added Part 4 student/guest view buttons.");
console.log("Backup:", backup);
