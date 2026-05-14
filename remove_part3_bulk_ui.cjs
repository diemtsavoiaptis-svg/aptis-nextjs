const fs = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "app", "dashboard", "listening", "part-3", "page.js");

if (!fs.existsSync(file)) {
  console.error("Cannot find:", file);
  process.exit(1);
}

let code = fs.readFileSync(file, "utf8");
const backup = file + ".backup-remove-bulk-ui-" + Date.now();
fs.writeFileSync(backup, code, "utf8");

const before = code;

const patterns = [
  // Remove stats cards area containing these labels
  /<div[^>]*>\s*[\s\S]*?TỔNG DÒNG[\s\S]*?CÓ AUDIO[\s\S]*?HOÀN THIỆN[\s\S]*?ĐÃ CHỌN[\s\S]*?HIỆN KHÁCH[\s\S]*?<\/div>\s*/,

  // Remove bulk update panel
  /<section[^>]*>\s*[\s\S]*?Bảng cập nhật hàng loạt[\s\S]*?Lưu toàn bộ[\s\S]*?<\/section>\s*/,

  // Fallback if the panel is a div, not section
  /<div[^>]*>\s*[\s\S]*?Bảng cập nhật hàng loạt[\s\S]*?Lưu toàn bộ[\s\S]*?<\/div>\s*/
];

for (const pattern of patterns) {
  code = code.replace(pattern, "");
}

if (code === before) {
  console.log("No matching block was removed. Backup created at:", backup);
  console.log("Please check if the Part 3 page structure is different.");
  process.exit(0);
}

fs.writeFileSync(file, code, "utf8");

console.log("Removed Part 3 stats/bulk update UI.");
console.log("Backup:", backup);
