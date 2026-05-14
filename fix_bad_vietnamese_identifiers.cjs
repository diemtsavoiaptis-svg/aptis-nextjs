const fs = require("fs");
const path = require("path");

const roots = [
  path.join(process.cwd(), "app", "listening"),
  path.join(process.cwd(), "app", "dashboard"),
];

const exts = new Set([".js", ".jsx", ".ts", ".tsx"]);

function walk(dir) {
  if (!fs.existsSync(dir)) return [];

  const files = [];

  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      files.push(...walk(full));
    } else if (exts.has(path.extname(full))) {
      files.push(full);
    }
  }

  return files;
}

const replacements = [
  ["setĐang hoạt độngIndex", "setActiveIndex"],
  ["Đang hoạt độngIndex", "activeIndex"],
  ["setĐang thiết kếIndex", "setDesignIndex"],
  ["Đang thiết kếIndex", "designIndex"],
  ["setCâuIndex", "setQuestionIndex"],
  ["CâuIndex", "questionIndex"],
  ["setHọc viênIndex", "setStudentIndex"],
  ["Học viênIndex", "studentIndex"],
  ["setKháchIndex", "setGuestIndex"],
  ["KháchIndex", "guestIndex"],
];

const files = roots.flatMap(walk);
const backupDir = path.join(process.cwd(), "backups", "fix-bad-vi-identifiers-" + Date.now());
fs.mkdirSync(backupDir, { recursive: true });

let changed = 0;

for (const file of files) {
  let code = fs.readFileSync(file, "utf8");
  const original = code;

  for (const [from, to] of replacements) {
    code = code.split(from).join(to);
  }

  if (code !== original) {
    const relative = path.relative(process.cwd(), file);
    const backupFile = path.join(backupDir, relative);

    fs.mkdirSync(path.dirname(backupFile), { recursive: true });
    fs.writeFileSync(backupFile, original, "utf8");
    fs.writeFileSync(file, code, "utf8");

    console.log("Fixed:", relative);
    changed++;
  }
}

console.log("Fixed files:", changed);
console.log("Backup:", backupDir);
