const fs = require("fs");
const path = require("path");
const readline = require("readline");

const root = process.cwd();

const outputFiles = [
  path.join(root, "app", "dashboard", "listening", "part-2", "data.json"),
  path.join(root, "public", "data", "part2-admin.json"),
  path.join(root, "public", "data", "part2-full.json"),
];

function clean(value) {
  return String(value ?? "")
    .replace(/^\uFEFF/, "")
    .replace(/\r/g, "")
    .replace(/^"|"$/g, "")
    .trim();
}

function splitLine(line) {
  return line.split("\t").map(clean);
}

function extractDriveId(url) {
  const text = clean(url);
  const match = text.match(/\/d\/([^/]+)/);
  return match ? match[1] : "";
}

function isHeader(cells) {
  const joined = cells.join(" ").toLowerCase();
  return (
    joined.includes("stt") ||
    joined.includes("topic") ||
    joined.includes("paragraph") ||
    joined.includes("dữ liệu đáp án") ||
    joined.includes("du lieu dap an")
  );
}

function parseAnswerBank(text) {
  return clean(text)
    .replace(/^Lựa chọn:\s*/i, "")
    .replace(/^Lua chon:\s*/i, "")
    .split(",")
    .map((item) => clean(item))
    .filter(Boolean);
}

function loadOldRows() {
  for (const file of outputFiles) {
    if (!fs.existsSync(file)) continue;

    try {
      const data = JSON.parse(fs.readFileSync(file, "utf8"));
      if (Array.isArray(data)) return data;
    } catch {}
  }

  return [];
}

function makeOldMap(rows) {
  const map = new Map();

  rows.forEach((row, index) => {
    const key = String(row.stt || row.question || row.order || index + 1).trim();
    if (key) map.set(key, row);
  });

  return map;
}

function parseRows(lines) {
  const oldRows = loadOldRows();
  const oldMap = makeOldMap(oldRows);

  const rawRows = lines
    .map((line) => line.replace(/\r/g, ""))
    .filter((line) => line.trim())
    .map(splitLine);

  const dataRows = rawRows.length && isHeader(rawRows[0]) ? rawRows.slice(1) : rawRows;

  const rows = [];
  const seenStt = new Set();

  dataRows.forEach((cells, index) => {
    // Format:
    // STT | Audio | Topic | Cột dữ liệu đáp án | Cột Paragraph

    const stt = clean(cells[0]) || String(index + 1);

    // Bỏ dòng trống và bỏ STT lặp
    if (!stt || seenStt.has(stt)) return;
    seenStt.add(stt);

    const old = oldMap.get(stt) || {};

    const audioLink = clean(cells[1]);
    const topic = clean(cells[2]);
    const answerBankText = clean(cells[3]);
    const voiceParagraph = clean(cells.slice(4).join(" "));

    const row = {
      selected: false,
      guestVisible: Boolean(old.guestVisible || old.showInGuest),
      showInGuest: Boolean(old.guestVisible || old.showInGuest),

      stt,
      question: stt,
      order: Number.parseInt(stt, 10) || rows.length + 1,

      audio: audioLink,
      audioLink,
      audio_drive_file_id: extractDriveId(audioLink),

      topic,

      answerBank: answerBankText,
      answers: parseAnswerBank(answerBankText),

      voiceParagraph,
      paragraph: voiceParagraph,
      transcript: voiceParagraph,

      // Không có dữ liệu person 1-4 trong file nguồn, để trống.
      person1: "",
      person2: "",
      person3: "",
      person4: "",

      correct1: clean(old.correct1 || ""),
      correct2: clean(old.correct2 || ""),
      correct3: clean(old.correct3 || ""),
      correct4: clean(old.correct4 || ""),
    };

    const hasData =
      row.stt ||
      row.audioLink ||
      row.topic ||
      row.answerBank ||
      row.voiceParagraph;

    if (hasData) rows.push(row);
  });

  return rows;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

console.log("");
console.log("Please paste your Part 2 data below.");
console.log("Columns:");
console.log("STT | Audio | Topic | Answer Bank | Paragraph");
console.log("");
console.log("When finished, type END on a new line.");
console.log("");

const lines = [];

rl.on("line", (line) => {
  if (line.trim() === "END") {
    rl.close();
    return;
  }

  lines.push(line);
});

rl.on("close", () => {
  const rows = parseRows(lines);

  if (!rows.length) {
    console.error("No valid Part 2 rows detected.");
    process.exit(1);
  }

  for (const file of outputFiles) {
    fs.mkdirSync(path.dirname(file), { recursive: true });

    if (fs.existsSync(file)) {
      const backup = file + ".backup-" + Date.now();
      fs.copyFileSync(file, backup);
      console.log("Backup:", path.relative(root, backup));
    }

    fs.writeFileSync(file, JSON.stringify(rows, null, 2), "utf8");
    console.log("Saved:", path.relative(root, file));
  }

  console.log("");
  console.log("Part 2 import completed.");
  console.log("Rows imported:", rows.length);
  console.log("Rows with audio:", rows.filter((row) => row.audioLink || row.audio_drive_file_id).length);
  console.log("Rows with answer bank:", rows.filter((row) => row.answers && row.answers.length).length);
  console.log("Guest visible rows:", rows.filter((row) => row.guestVisible || row.showInGuest).length);
});
