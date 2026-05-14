const fs = require("fs");
const path = require("path");
const readline = require("readline");

const root = process.cwd();

const outputFiles = [
  path.join(root, "app", "dashboard", "listening", "part-4", "data.json"),
  path.join(root, "public", "data", "part4-admin.json"),
  path.join(root, "public", "data", "part4-full.json"),
];

function clean(value) {
  return String(value ?? "")
    .replace(/^\uFEFF/, "")
    .replace(/\r/g, "")
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
    joined.includes("audio") &&
    joined.includes("question") &&
    joined.includes("topic") &&
    (joined.includes("câu hỏi 16") || joined.includes("cau hoi 16"))
  );
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

  dataRows.forEach((cells, index) => {
    const audioLink = clean(cells[0]);
    const stt = clean(cells[1]) || String(index + 1);
    const old = oldMap.get(stt) || {};

    const row = {
      selected: false,
      guestVisible: Boolean(old.guestVisible || old.showInGuest),
      showInGuest: Boolean(old.guestVisible || old.showInGuest),

      stt,
      question: stt,
      order: Number.parseInt(stt, 10) || index + 1,

      audio: audioLink,
      audioLink,
      audio_drive_file_id: extractDriveId(audioLink),

      topic: clean(cells[2]),

      question16: clean(cells[3]),
      answer1: clean(cells[4]),
      answer2: clean(cells[5]),
      answer3: clean(cells[6]),

      question17: clean(cells[7]),
      choice1: clean(cells[8]),
      choice2: clean(cells[9]),
      choice3: clean(cells[10]),

      paraphrase: clean(cells.slice(11).join(" ")),

      correct16: clean(old.correct16 || old.answer16 || ""),
      correct17: clean(old.correct17 || old.answer17 || ""),
    };

    const hasData =
      row.audioLink ||
      row.stt ||
      row.topic ||
      row.question16 ||
      row.answer1 ||
      row.answer2 ||
      row.answer3 ||
      row.question17 ||
      row.choice1 ||
      row.choice2 ||
      row.choice3 ||
      row.paraphrase;

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
console.log("Please paste your Part 4 data with audio below.");
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
    console.error("No valid Part 4 rows detected.");
    process.exit(1);
  }

  for (const file of outputFiles) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(rows, null, 2), "utf8");
    console.log("Saved:", path.relative(root, file));
  }

  console.log("");
  console.log("Part 4 import completed.");
  console.log("Rows imported:", rows.length);
  console.log("Rows with audio:", rows.filter((row) => row.audioLink || row.audio_drive_file_id).length);
  console.log("Guest visible rows:", rows.filter((row) => row.guestVisible || row.showInGuest).length);
});
