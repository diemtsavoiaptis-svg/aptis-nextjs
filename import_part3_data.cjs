const fs = require("fs");
const path = require("path");
const readline = require("readline");

const root = process.cwd();

const outputFiles = [
  path.join(root, "app", "dashboard", "listening", "part-3", "data.json"),
  path.join(root, "public", "data", "part3-admin.json"),
  path.join(root, "public", "data", "part3-full.json"),
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
  return joined.includes("stt") && joined.includes("link audio");
}

function parseRows(lines) {
  const rows = [];
  const rawRows = lines
    .map((line) => line.replace(/\r/g, ""))
    .filter((line) => line.trim())
    .map(splitLine);

  const dataRows = rawRows.length && isHeader(rawRows[0]) ? rawRows.slice(1) : rawRows;

  dataRows.forEach((cells, index) => {
    const stt = clean(cells[0]) || String(index + 1);
    const audioLink = clean(cells[1]);
    const topic = clean(cells[2]);

    const row = {
      selected: false,
      guestVisible: false,
      showInGuest: false,

      stt,
      order: Number.parseInt(stt, 10) || index + 1,

      audio: audioLink,
      audioLink,
      audio_drive_file_id: extractDriveId(audioLink),

      topic,

      question1: clean(cells[3]),
      answer1: clean(cells[4]),

      question2: clean(cells[5]),
      answer2: clean(cells[6]),

      question3: clean(cells[7]),
      answer3: clean(cells[8]),

      question4: clean(cells[9]),
      answer4: clean(cells[10]),

      voiceParagraph: clean(cells.slice(11).join(" ")),
    };

    const hasData =
      row.stt ||
      row.audioLink ||
      row.topic ||
      row.question1 ||
      row.question2 ||
      row.question3 ||
      row.question4 ||
      row.voiceParagraph;

    if (hasData) rows.push(row);
  });

  return rows;
}

function patchAdminPage() {
  const pageFile = path.join(root, "app", "dashboard", "listening", "part-3", "page.js");

  if (!fs.existsSync(pageFile)) {
    console.log("Part 3 admin page not found, skipped page patch.");
    return;
  }

  let code = fs.readFileSync(pageFile, "utf8");
  const original = code;

  if (!code.includes('import part3Rows from "./data.json";')) {
    code = code.replace(
      /import\s+\{\s*useMemo,\s*useState\s*\}\s+from\s+["']react["'];/,
      'import { useMemo, useState } from "react";\nimport part3Rows from "./data.json";'
    );

    code = code.replace(
      /import\s+\{\s*useState,\s*useMemo\s*\}\s+from\s+["']react["'];/,
      'import { useState, useMemo } from "react";\nimport part3Rows from "./data.json";'
    );

    code = code.replace(
      /import\s+\{\s*useState\s*\}\s+from\s+["']react["'];/,
      'import { useState } from "react";\nimport part3Rows from "./data.json";'
    );
  }

  code = code.replace(
    /const\s+\[rows,\s*setRows\]\s*=\s*useState\s*\(\s*starterRows\s*\)\s*;/,
    'const [rows, setRows] = useState(() => Array.isArray(part3Rows) && part3Rows.length ? part3Rows : starterRows);'
  );

  code = code.replace(
    /const\s+\[rows,\s*setRows\]\s*=\s*useState\s*\(\s*\(\)\s*=>\s*starterRows\s*\)\s*;/,
    'const [rows, setRows] = useState(() => Array.isArray(part3Rows) && part3Rows.length ? part3Rows : starterRows);'
  );

  if (code !== original) {
    const backup = pageFile + ".backup-part3-import-" + Date.now();
    fs.writeFileSync(backup, original, "utf8");
    fs.writeFileSync(pageFile, code, "utf8");
    console.log("Patched admin page:", path.relative(root, pageFile));
    console.log("Page backup:", path.relative(root, backup));
  } else {
    console.log("Admin page already uses Part 3 data or no patch needed.");
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

console.log("");
console.log("Please paste your Part 3 data below.");
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
    console.error("No valid Part 3 rows detected.");
    process.exit(1);
  }

  for (const file of outputFiles) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(rows, null, 2), "utf8");
    console.log("Saved:", path.relative(root, file));
  }

  patchAdminPage();

  console.log("");
  console.log("Part 3 import completed.");
  console.log("Rows imported:", rows.length);
  console.log("Rows with audio:", rows.filter((row) => row.audioLink).length);
  console.log("Guest visible rows:", rows.filter((row) => row.guestVisible || row.showInGuest).length);
});
