const fs = require("fs");
const path = require("path");

const root = process.cwd();

const files = [
  "app/dashboard/listening/part-1/page.js",
  "app/dashboard/listening/part-1/data.json",
  "public/data/part1-admin.json",
  "public/data/part1-full.json",
  "app/api/admin/part1/save/route.js"
];

console.log("");
console.log("CHECK PART 1 FILES");
console.log("==================");

for (const file of files) {
  const full = path.join(root, file);
  console.log("");
  console.log(file, fs.existsSync(full) ? "FOUND" : "MISSING");

  if (fs.existsSync(full) && file.endsWith(".json")) {
    try {
      const data = JSON.parse(fs.readFileSync(full, "utf8"));
      const rows = Array.isArray(data) ? data : data.rows || [];
      console.log("Rows:", rows.length);

      if (rows[0]) {
        console.log("First row keys:");
        console.log(Object.keys(rows[0]).join(", "));
        console.log("");
        console.log("First row preview:");
        console.log(JSON.stringify(rows[0], null, 2).slice(0, 1200));
      }
    } catch (error) {
      console.log("JSON read error:", error.message);
    }
  }

  if (fs.existsSync(full) && file.endsWith("page.js")) {
    const code = fs.readFileSync(full, "utf8");
    console.log("Page size:", code.length, "chars");

    const keywords = [
      "correct",
      "answer",
      "option",
      "Đáp án",
      "dapAn",
      "saveAll",
      "columns"
    ];

    for (const key of keywords) {
      console.log(`Contains ${key}:`, code.includes(key));
    }
  }
}

console.log("");
console.log("Open Admin Part 1...");
