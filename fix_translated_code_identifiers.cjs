const fs = require("fs");
const path = require("path");

const roots = [
  path.join(process.cwd(), "app"),
];

const exts = new Set([".js", ".jsx", ".ts", ".tsx"]);

function walk(dir) {
  if (!fs.existsSync(dir)) return [];

  const files = [];

  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      if (
        item === "node_modules" ||
        item === ".next" ||
        item === ".git" ||
        item === "backups"
      ) {
        continue;
      }

      files.push(...walk(full));
    } else if (exts.has(path.extname(full))) {
      files.push(full);
    }
  }

  return files;
}

const replacements = [
  // Broken component/function names
  ["function Bảng điều khiểnLayout", "function DashboardLayout"],
  ["function Bảng điều khiểnPage", "function DashboardPage"],
  ["function Bảng điều khiển", "function Dashboard"],
  ["Bảng điều khiểnLayout", "DashboardLayout"],
  ["Bảng điều khiểnPage", "DashboardPage"],

  // Broken identifier fragments from Vietnamese UI conversion
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

  // Other likely broken function names
  ["function Luyện nghe", "function Listening"],
  ["function Bảng điều khiển Listening", "function ListeningDashboard"],
  ["function Quản lý Listening", "function ListeningManagement"],

  // Broken component names if they appeared in imports/exports
  ["ListeningBảng điều khiển", "ListeningDashboard"],
  ["Bảng điều khiểnListening", "DashboardListening"],
];

const files = roots.flatMap(walk);
const backupDir = path.join(process.cwd(), "backups", "fix-translated-code-identifiers-" + Date.now());
fs.mkdirSync(backupDir, { recursive: true });

let changed = 0;

for (const file of files) {
  let code = fs.readFileSync(file, "utf8");
  const original = code;

  for (const [from, to] of replacements) {
    code = code.split(from).join(to);
  }

  // Fix any remaining invalid export default function names with spaces/accents before Layout/Page
  code = code.replace(
    /export\s+default\s+function\s+[A-Za-zÀ-ỹ\s]+Layout\s*\(/g,
    "export default function DashboardLayout("
  );

  code = code.replace(
    /export\s+default\s+function\s+[A-Za-zÀ-ỹ\s]+Page\s*\(/g,
    "export default function Page("
  );

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

console.log("");
console.log("Fixed files:", changed);
console.log("Backup:", backupDir);
