const fs = require("fs");
const path = require("path");

const root = process.cwd();
const appDir = path.join(root, "app");

const keywords = [
  "student",
  "students",
  "user",
  "users",
  "account",
  "register",
  "registration",
  "pending",
  "approve",
  "approval",
  "duyet",
  "duyệt",
  "hoc-vien",
  "học viên",
  "tai-khoan",
  "tài khoản"
];

function walk(dir, results = []) {
  if (!fs.existsSync(dir)) return results;

  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      walk(full, results);
    } else if (/\.(js|jsx|ts|tsx)$/.test(item)) {
      const code = fs.readFileSync(full, "utf8");
      const hit = keywords.some((key) => code.toLowerCase().includes(key.toLowerCase()));

      if (hit) {
        results.push(full);
      }
    }
  }

  return results;
}

const files = walk(appDir);

console.log("");
console.log("Candidate files for student/account approval:");
console.log("============================================");

for (const file of files) {
  const relative = path.relative(root, file);
  const route = "/" + path.dirname(relative)
    .replace(/^app[\\/]/, "")
    .replace(/\\/g, "/")
    .replace(/\/page$/, "");

  console.log("");
  console.log(relative);
  console.log("Possible route:", route);
}

console.log("");
console.log("Total:", files.length);
