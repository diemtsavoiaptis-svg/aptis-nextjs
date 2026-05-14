const fs = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "app", "dashboard", "listening", "part-2", "page.js");

if (!fs.existsSync(file)) {
  console.error("Cannot find:", file);
  process.exit(1);
}

let code = fs.readFileSync(file, "utf8");
const backup = file + ".backup-person-dropdown-" + Date.now();
fs.writeFileSync(backup, code, "utf8");

// Thêm helper lấy đáp án từ kho đáp án nếu chưa có
if (!code.includes("function getAnswerOptions(row)")) {
  code = code.replace(
`function normalizeRow(row, index) {`,
`function getAnswerOptions(row) {
  if (Array.isArray(row.answers) && row.answers.length) {
    return row.answers.map((item) => String(item || "").trim()).filter(Boolean);
  }

  return String(row.answerBank || "")
    .replace(/^Lựa chọn:\\s*/i, "")
    .replace(/^Lua chon:\\s*/i, "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeRow(row, index) {`
  );
}

// Đánh dấu 4 cột người là select
code = code
  .replace(`{ key: "person1", label: "Người 1" },`, `{ key: "person1", label: "Người 1", type: "answerSelect" },`)
  .replace(`{ key: "person2", label: "Người 2" },`, `{ key: "person2", label: "Người 2", type: "answerSelect" },`)
  .replace(`{ key: "person3", label: "Người 3" },`, `{ key: "person3", label: "Người 3", type: "answerSelect" },`)
  .replace(`{ key: "person4", label: "Người 4" },`, `{ key: "person4", label: "Người 4", type: "answerSelect" },`);

// Thay phần render textarea để có thêm select cho Người 1-4
code = code.replace(
`                        ) : (
                          <textarea
                            value={row[column.key] || ""}
                            onChange={(event) =>
                              updateCell(rowIndex, column.key, event.target.value)
                            }
                            placeholder={column.label}
                          />
                        )}`,
`                        ) : column.type === "answerSelect" ? (
                          <select
                            className="answerSelect"
                            value={row[column.key] || ""}
                            onChange={(event) =>
                              updateCell(rowIndex, column.key, event.target.value)
                            }
                          >
                            <option value="">-- Chọn đáp án --</option>
                            {getAnswerOptions(row).map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <textarea
                            value={row[column.key] || ""}
                            onChange={(event) =>
                              updateCell(rowIndex, column.key, event.target.value)
                            }
                            placeholder={column.label}
                          />
                        )}`
);

// Thêm CSS cho select
if (!code.includes(".answerSelect")) {
  code = code.replace(
`        td textarea {
          width: 150px;
          height: 76px;
          border: 1px solid #ffc6d0;
          border-radius: 14px;
          padding: 12px;
          color: #3d0810;
          outline: none;
          resize: vertical;
          font-family: Arial, sans-serif;
          font-size: 14px;
          line-height: 1.35;
        }`,
`        td textarea,
        .answerSelect {
          width: 150px;
          height: 76px;
          border: 1px solid #ffc6d0;
          border-radius: 14px;
          padding: 12px;
          color: #3d0810;
          outline: none;
          resize: vertical;
          font-family: Arial, sans-serif;
          font-size: 14px;
          line-height: 1.35;
          background: white;
        }

        .answerSelect {
          resize: none;
          cursor: pointer;
          font-weight: 800;
          min-width: 190px;
        }`
  );
}

fs.writeFileSync(file, code, "utf8");

console.log("Updated Part 2 person fields to dropdowns from answer bank.");
console.log("Backup:", backup);
