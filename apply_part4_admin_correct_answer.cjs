const fs = require("fs");
const path = require("path");

const root = process.cwd();

const pageFile = path.join(root, "app", "dashboard", "listening", "part-4", "page.js");
const apiFile = path.join(root, "app", "api", "admin", "part4", "save", "route.js");

const dataFiles = [
  path.join(root, "app", "dashboard", "listening", "part-4", "data.json"),
  path.join(root, "public", "data", "part4-admin.json"),
  path.join(root, "public", "data", "part4-full.json"),
];

function backup(file, label) {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, file + `.backup-${label}-` + Date.now());
  }
}

function clean(value) {
  return String(value ?? "").trim();
}

function extractDriveId(url) {
  const text = clean(url);
  const match = text.match(/\/d\/([^/]+)/);
  return match ? match[1] : "";
}

function normalizeLetter(value) {
  const text = clean(value).toUpperCase();
  return ["A", "B", "C"].includes(text) ? text : "";
}

function normalizeRow(row, index) {
  const stt = clean(row.stt || row.question || row.order) || String(index + 1);
  const audioLink = clean(row.audioLink || row.audio || row.linkAudio);

  const correct16 = normalizeLetter(
    row.correct16 ||
    row.answer16 ||
    row.correctAnswer16 ||
    row["Đáp án đúng 16"]
  );

  const correct17 = normalizeLetter(
    row.correct17 ||
    row.answer17 ||
    row.correctAnswer17 ||
    row["Đáp án đúng 17"]
  );

  return {
    ...row,
    selected: false,
    guestVisible: Boolean(row.guestVisible || row.showInGuest),
    showInGuest: Boolean(row.guestVisible || row.showInGuest),

    stt,
    question: stt,
    order: Number.parseInt(stt, 10) || index + 1,

    audio: audioLink,
    audioLink,
    audio_drive_file_id: clean(row.audio_drive_file_id) || extractDriveId(audioLink),

    topic: clean(row.topic),

    question16: clean(row.question16),
    answer1: clean(row.answer1),
    answer2: clean(row.answer2),
    answer3: clean(row.answer3),

    question17: clean(row.question17),
    choice1: clean(row.choice1),
    choice2: clean(row.choice2),
    choice3: clean(row.choice3),

    correct16,
    answer16: correct16,
    correctAnswer16: correct16,

    correct17,
    answer17: correct17,
    correctAnswer17: correct17,

    paraphrase: clean(row.paraphrase || row.voiceParagraph || row.transcript),
  };
}

// 1) Đồng bộ dữ liệu Part 4 hiện tại
for (const file of dataFiles) {
  if (!fs.existsSync(file)) {
    console.log("Skip missing data:", path.relative(root, file));
    continue;
  }

  backup(file, "part4-admin-correct");

  let rows = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!Array.isArray(rows)) rows = rows.rows || [];

  const nextRows = rows.map(normalizeRow);

  fs.writeFileSync(file, JSON.stringify(nextRows, null, 2), "utf8");
  console.log("Synced:", path.relative(root, file));
  console.log("Rows:", nextRows.length);
}

// 2) Ghi lại API save Part 4
fs.mkdirSync(path.dirname(apiFile), { recursive: true });
backup(apiFile, "part4-save-correct");

fs.writeFileSync(apiFile, `import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function clean(value) {
  return String(value ?? "").trim();
}

function extractDriveId(url) {
  const text = clean(url);
  const match = text.match(/\\/d\\/([^/]+)/);
  return match ? match[1] : "";
}

function normalizeLetter(value) {
  const text = clean(value).toUpperCase();
  return ["A", "B", "C"].includes(text) ? text : "";
}

function normalizeRow(row, index) {
  const stt = clean(row.stt || row.question || row.order) || String(index + 1);
  const audioLink = clean(row.audioLink || row.audio || row.linkAudio);

  const correct16 = normalizeLetter(
    row.correct16 ||
    row.answer16 ||
    row.correctAnswer16 ||
    row["Đáp án đúng 16"]
  );

  const correct17 = normalizeLetter(
    row.correct17 ||
    row.answer17 ||
    row.correctAnswer17 ||
    row["Đáp án đúng 17"]
  );

  return {
    ...row,
    selected: false,
    guestVisible: Boolean(row.guestVisible || row.showInGuest),
    showInGuest: Boolean(row.guestVisible || row.showInGuest),

    stt,
    question: stt,
    order: Number.parseInt(stt, 10) || index + 1,

    audio: audioLink,
    audioLink,
    audio_drive_file_id: clean(row.audio_drive_file_id) || extractDriveId(audioLink),

    topic: clean(row.topic),

    question16: clean(row.question16),
    answer1: clean(row.answer1),
    answer2: clean(row.answer2),
    answer3: clean(row.answer3),

    question17: clean(row.question17),
    choice1: clean(row.choice1),
    choice2: clean(row.choice2),
    choice3: clean(row.choice3),

    correct16,
    answer16: correct16,
    correctAnswer16: correct16,

    correct17,
    answer17: correct17,
    correctAnswer17: correct17,

    paraphrase: clean(row.paraphrase || row.voiceParagraph || row.transcript),
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const rows = Array.isArray(body.rows) ? body.rows : [];
    const normalizedRows = rows.map(normalizeRow);

    const root = process.cwd();

    const files = [
      path.join(root, "app", "dashboard", "listening", "part-4", "data.json"),
      path.join(root, "public", "data", "part4-admin.json"),
      path.join(root, "public", "data", "part4-full.json"),
    ];

    for (const file of files) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, JSON.stringify(normalizedRows, null, 2), "utf8");
    }

    return NextResponse.json({
      ok: true,
      count: normalizedRows.length,
      guestCount: normalizedRows.filter((row) => row.showInGuest || row.guestVisible).length,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { ok: false, message: "Cannot save Part 4 data." },
      { status: 500 }
    );
  }
}
`, "utf8");

console.log("Wrote:", path.relative(root, apiFile));

// 3) Patch Admin Part 4: thêm dropdown Đáp án đúng 16 / 17
if (!fs.existsSync(pageFile)) {
  console.error("Cannot find:", path.relative(root, pageFile));
  process.exit(1);
}

backup(pageFile, "part4-correct-dropdown");

let code = fs.readFileSync(pageFile, "utf8");

// Thêm field rỗng vào emptyRow nếu chưa có
if (!code.includes('correct16: ""')) {
  code = code.replace(
    /paraphrase:\s*"",/,
    `paraphrase: "",
    correct16: "",
    correct17: "",`
  );
}

// Thêm cột đáp án đúng sau nhóm lựa chọn
if (!code.includes('key: "correct16"')) {
  code = code.replace(
    `{ key: "answer3", label: "Trả lời 3" },`,
    `{ key: "answer3", label: "Trả lời 3" },
  { key: "correct16", label: "Đáp án đúng 16", type: "letterSelect" },`
  );
}

if (!code.includes('key: "correct17"')) {
  code = code.replace(
    `{ key: "choice3", label: "Lựa chọn 3" },`,
    `{ key: "choice3", label: "Lựa chọn 3" },
  { key: "correct17", label: "Đáp án đúng 17", type: "letterSelect" },`
  );
}

// Render dropdown A/B/C
if (!code.includes('column.type === "letterSelect"')) {
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
`                        ) : column.type === "letterSelect" ? (
                          <select
                            className="letterSelect"
                            value={row[column.key] || ""}
                            onChange={(event) => {
                              updateCell(rowIndex, column.key, event.target.value);

                              if (column.key === "correct16") {
                                updateCell(rowIndex, "answer16", event.target.value);
                                updateCell(rowIndex, "correctAnswer16", event.target.value);
                              }

                              if (column.key === "correct17") {
                                updateCell(rowIndex, "answer17", event.target.value);
                                updateCell(rowIndex, "correctAnswer17", event.target.value);
                              }
                            }}
                          >
                            <option value="">-- Chọn --</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
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
}

// CSS dropdown
if (!code.includes(".letterSelect")) {
  code = code.replace(
`        td textarea,`,
`        .letterSelect {
          width: 120px;
          height: 48px;
          border: 1px solid #ffc6d0;
          border-radius: 14px;
          padding: 0 12px;
          color: #e6003f;
          outline: none;
          font-family: Arial, sans-serif;
          font-size: 14px;
          font-weight: 900;
          background: white;
          cursor: pointer;
        }

        td textarea,`
  );
}

fs.writeFileSync(pageFile, code, "utf8");

console.log("Patched:", path.relative(root, pageFile));
console.log("");
console.log("Done Part 4 only.");
console.log("Rule:");
console.log("Đáp án đúng 16 = correct16");
console.log("Đáp án đúng 17 = correct17");
