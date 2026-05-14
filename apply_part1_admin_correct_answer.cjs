const fs = require("fs");
const path = require("path");

const root = process.cwd();

const pageFile = path.join(root, "app", "dashboard", "listening", "part-1", "page.js");
const apiFile = path.join(root, "app", "api", "admin", "part1", "save", "route.js");

const dataFiles = [
  path.join(root, "app", "dashboard", "listening", "part-1", "data.json"),
  path.join(root, "public", "data", "part1-admin.json"),
  path.join(root, "public", "data", "part1-full.json"),
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

function normalizeCorrect(row) {
  const raw = clean(
    row.correctAnswer ||
    row.correct ||
    row.answer ||
    row.answerKey ||
    row.correctOption ||
    row.dapAn ||
    row["Đáp án đúng"]
  ).toUpperCase();

  if (["A", "B", "C"].includes(raw)) return raw;

  return "";
}

// 1) Chuẩn hóa data Part 1: correctAnswer = đáp án admin chọn
for (const file of dataFiles) {
  if (!fs.existsSync(file)) {
    console.log("Skip missing data:", path.relative(root, file));
    continue;
  }

  backup(file, "part1-correct-answer");

  let rows = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!Array.isArray(rows)) rows = rows.rows || [];

  const nextRows = rows.map((row, index) => {
    const correctAnswer = normalizeCorrect(row);

    return {
      ...row,
      selected: false,
      guestVisible: Boolean(row.guestVisible || row.showInGuest),
      showInGuest: Boolean(row.guestVisible || row.showInGuest),

      stt: clean(row.stt || row.question || row.order) || String(index + 1),
      question: clean(row.question || row.stt || row.order) || String(index + 1),
      order: Number.parseInt(clean(row.order || row.stt || row.question) || String(index + 1), 10) || index + 1,

      audio: clean(row.audioLink || row.audio || ""),
      audioLink: clean(row.audioLink || row.audio || ""),
      audio_drive_file_id: clean(row.audio_drive_file_id) || extractDriveId(row.audioLink || row.audio || ""),

      correctAnswer,
      correct: correctAnswer,
      answer: correctAnswer,
      answerKey: correctAnswer,
      correctOption: correctAnswer,
    };
  });

  fs.writeFileSync(file, JSON.stringify(nextRows, null, 2), "utf8");
  console.log("Synced:", path.relative(root, file));
}

// 2) Ghi API save Part 1: lưu đáp án đúng từ admin
fs.mkdirSync(path.dirname(apiFile), { recursive: true });
backup(apiFile, "part1-save-route");

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

function normalizeCorrect(row) {
  const raw = clean(
    row.correctAnswer ||
    row.correct ||
    row.answer ||
    row.answerKey ||
    row.correctOption ||
    row.dapAn ||
    row["Đáp án đúng"]
  ).toUpperCase();

  if (["A", "B", "C"].includes(raw)) return raw;

  return "";
}

function normalizeRow(row, index) {
  const stt = clean(row.stt || row.question || row.order) || String(index + 1);
  const audioLink = clean(row.audioLink || row.audio || "");
  const correctAnswer = normalizeCorrect(row);

  return {
    ...row,
    selected: false,
    guestVisible: Boolean(row.guestVisible || row.showInGuest),
    showInGuest: Boolean(row.guestVisible || row.showInGuest),

    stt,
    question: clean(row.question || row.questionText || row.title || ""),
    order: Number.parseInt(stt, 10) || index + 1,

    audio: audioLink,
    audioLink,
    audio_drive_file_id: clean(row.audio_drive_file_id) || extractDriveId(audioLink),

    correctAnswer,
    correct: correctAnswer,
    answer: correctAnswer,
    answerKey: correctAnswer,
    correctOption: correctAnswer,
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const rows = Array.isArray(body.rows) ? body.rows : [];
    const normalizedRows = rows.map(normalizeRow);

    const root = process.cwd();

    const files = [
      path.join(root, "app", "dashboard", "listening", "part-1", "data.json"),
      path.join(root, "public", "data", "part1-admin.json"),
      path.join(root, "public", "data", "part1-full.json"),
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
      { ok: false, message: "Cannot save Part 1 data." },
      { status: 500 }
    );
  }
}
`, "utf8");

console.log("Wrote:", path.relative(root, apiFile));

// 3) Patch Admin Part 1: thêm cột dropdown Đáp án đúng nếu chưa có
if (!fs.existsSync(pageFile)) {
  console.error("Cannot find:", path.relative(root, pageFile));
  process.exit(1);
}

backup(pageFile, "part1-admin-correct-dropdown");

let code = fs.readFileSync(pageFile, "utf8");

// Thêm correctAnswer vào empty row nếu có
if (!code.includes('correctAnswer: ""')) {
  code = code.replace(
    /(showInGuest:\s*false,\s*)/,
    `$1
    correctAnswer: "",
    correct: "",
    answer: "",
    answerKey: "",
    correctOption: "",
`
  );
}

// Thêm cột Đáp án đúng vào columns
if (!code.includes('key: "correctAnswer"')) {
  const insertColumn = `  { key: "correctAnswer", label: "Đáp án đúng", type: "letterSelect" },
`;

  const columnPatterns = [
    /(\{\s*key:\s*"optionC"[\s\S]*?\},)/,
    /(\{\s*key:\s*"answerC"[\s\S]*?\},)/,
    /(\{\s*key:\s*"choiceC"[\s\S]*?\},)/,
    /(\{\s*key:\s*"option3"[\s\S]*?\},)/,
    /(\{\s*key:\s*"answer3"[\s\S]*?\},)/,
  ];

  let inserted = false;

  for (const pattern of columnPatterns) {
    if (pattern.test(code)) {
      code = code.replace(pattern, `$1
${insertColumn}`);
      inserted = true;
      break;
    }
  }

  if (!inserted) {
    code = code.replace(/(const columns\s*=\s*\[\s*)/, `$1
${insertColumn}`);
  }
}

// Thêm render select A/B/C
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
                              updateCell(rowIndex, "correct", event.target.value);
                              updateCell(rowIndex, "answer", event.target.value);
                              updateCell(rowIndex, "answerKey", event.target.value);
                              updateCell(rowIndex, "correctOption", event.target.value);
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

// Nếu pattern render trên không bắt được, thêm CSS vẫn an toàn
if (!code.includes(".letterSelect")) {
  code = code.replace(
`        td textarea {`,
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

        td textarea {`
  );
}

fs.writeFileSync(pageFile, code, "utf8");

console.log("Patched:", path.relative(root, pageFile));
console.log("");
console.log("Done Part 1 only.");
console.log("Admin Part 1: choose A/B/C in 'Đáp án đúng' => saved as correct answer.");
