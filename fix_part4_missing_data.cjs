const fs = require("fs");
const path = require("path");

const root = process.cwd();

const target = path.join(root, "app", "dashboard", "listening", "part-4", "data.json");

const candidates = [
  path.join(root, "public", "data", "part4-admin.json"),
  path.join(root, "public", "data", "part4-full.json"),
  path.join(root, "app", "dashboard", "listening", "part-4", "data.json"),
];

let rows = null;

for (const file of candidates) {
  if (!fs.existsSync(file)) continue;

  try {
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    if (Array.isArray(data)) {
      rows = data;
      console.log("Loaded existing Part 4 data from:", path.relative(root, file));
      break;
    }
  } catch (error) {
    console.log("Skip invalid JSON:", path.relative(root, file));
  }
}

if (!rows) {
  rows = [];
  console.log("No existing Part 4 data found. Created empty data.json.");
}

fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, JSON.stringify(rows, null, 2), "utf8");

fs.mkdirSync(path.join(root, "public", "data"), { recursive: true });
fs.writeFileSync(path.join(root, "public", "data", "part4-admin.json"), JSON.stringify(rows, null, 2), "utf8");
fs.writeFileSync(path.join(root, "public", "data", "part4-full.json"), JSON.stringify(rows, null, 2), "utf8");

console.log("Saved:", path.relative(root, target));
console.log("Saved: public/data/part4-admin.json");
console.log("Saved: public/data/part4-full.json");
console.log("Rows:", rows.length);
