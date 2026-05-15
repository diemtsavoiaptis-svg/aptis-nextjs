const fs = require("fs");
const path = require("path");

const root = process.cwd();

const candidates = [
  "app/dashboard/layout.jsx",
  "app/dashboard/layout.js",
  "app/dashboard/page.jsx",
  "app/dashboard/page.js",
];

const file = candidates
  .map((item) => path.join(root, item))
  .find((item) => fs.existsSync(item) && fs.readFileSync(item, "utf8").includes("Quản trị Aptis"));

if (!file) {
  console.error("Cannot find dashboard sidebar file.");
  process.exit(1);
}

let code = fs.readFileSync(file, "utf8");
const backup = file + ".backup-add-logout-" + Date.now();
fs.copyFileSync(file, backup);

// Bảo đảm client component vì nút logout cần onClick
if (!code.trimStart().startsWith('"use client";') && !code.trimStart().startsWith("'use client';")) {
  code = `"use client";\n\n${code}`;
}

// Thêm hàm logout
if (!code.includes("function handleAdminLogout")) {
  const insertAfterImports = code.lastIndexOf("import ");
  if (insertAfterImports >= 0) {
    const importEnd = code.indexOf("\n", insertAfterImports);
    code =
      code.slice(0, importEnd + 1) +
      `
function handleAdminLogout() {
  try {
    localStorage.removeItem("admin");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("student");
    localStorage.removeItem("studentUser");
    localStorage.removeItem("studentToken");
    sessionStorage.clear();
  } catch (error) {
    console.warn(error);
  }

  window.location.href = "/";
}
` +
      code.slice(importEnd + 1);
  }
}

// Thêm nút vào sidebar, ưu tiên trước thẻ đóng aside
if (!code.includes("adminLogoutBtn")) {
  code = code.replace(
    /<\/aside>/,
    `        <button type="button" className="adminLogoutBtn" onClick={handleAdminLogout}>
          <span>↩</span>
          <div>
            <strong>Đăng xuất</strong>
            <small>Về trang chủ</small>
          </div>
        </button>
      </aside>`
  );
}

// CSS cho nút đăng xuất
if (!code.includes(".adminLogoutBtn")) {
  code = code.replace(
    /<\/style>/,
    `
        .adminLogoutBtn {
          width: calc(100% - 36px);
          min-height: 64px;
          margin: auto 18px 20px;
          border: 1px solid #ffc0cc;
          border-radius: 22px;
          background: #fff4f6;
          color: #9f001f;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 16px;
          font-family: Arial, sans-serif;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .adminLogoutBtn:hover {
          transform: translateY(-2px);
          background: #ffe8ee;
          box-shadow: 0 12px 24px rgba(190, 18, 60, 0.12);
        }

        .adminLogoutBtn span {
          width: 44px;
          height: 44px;
          border-radius: 16px;
          background: #e6003f;
          color: white;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          font-weight: 900;
          flex: 0 0 auto;
        }

        .adminLogoutBtn div {
          display: grid;
          text-align: left;
          line-height: 1.2;
        }

        .adminLogoutBtn strong {
          font-size: 17px;
          font-weight: 900;
        }

        .adminLogoutBtn small {
          margin-top: 4px;
          color: #f35f85;
          font-size: 12px;
          font-weight: 900;
        }

</style>`
  );
}

// Nếu sidebar chưa flex-column thì thêm nhẹ để nút nằm đáy
code = code.replace(
  /(\.adminSidebar\s*\{[^}]*?)\}/,
  (match, body) => {
    let next = body;
    if (!next.includes("display:")) next += "\n          display: flex;";
    if (!next.includes("flex-direction")) next += "\n          flex-direction: column;";
    return `${next}\n        }`;
  }
);

fs.writeFileSync(file, code, "utf8");

console.log("Added admin logout button.");
console.log("File:", path.relative(root, file));
console.log("Backup:", path.relative(root, backup));
