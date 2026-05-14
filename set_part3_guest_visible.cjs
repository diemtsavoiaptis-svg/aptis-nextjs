const fs = require("fs");
const path = require("path");
const readline = require("readline");

const files = [
  "app/dashboard/listening/part-3/data.json",
  "public/data/part3-admin.json",
  "public/data/part3-full.json"
];

const mainFile = path.join(process.cwd(), "public/data/part3-admin.json");

if (!fs.existsSync(mainFile)) {
  console.error("Cannot find:", mainFile);
  process.exit(1);
}

const rows = JSON.parse(fs.readFileSync(mainFile, "utf8"));

console.log("");
console.log("Part 3 hiện có", rows.length, "bài.");
console.log("Nhập STT muốn hiện ở giao diện khách.");
console.log("Ví dụ: 1,2,3");
console.log("Hoặc gõ: all");
console.log("");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("STT hiện khách: ", (answer) => {
  const input = String(answer || "").trim().toLowerCase();

  let selectedSet = new Set();

  if (input === "all") {
    rows.forEach((row) => selectedSet.add(String(row.stt || row.order)));
  } else {
    input
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean)
      .forEach((x) => selectedSet.add(x));
  }

  const updatedRows = rows.map((row, index) => {
    const stt = String(row.stt || row.order || index + 1);
    const visible = selectedSet.has(stt);

    return {
      ...row,
      selected: false,
      guestVisible: visible,
      showInGuest: visible,
    };
  });

  for (const file of files) {
    const full = path.join(process.cwd(), file);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, JSON.stringify(updatedRows, null, 2), "utf8");
    console.log("Updated:", file);
  }

  console.log("");
  console.log("Đã cập nhật giao diện khách.");
  console.log("Số bài hiện khách:", updatedRows.filter((row) => row.showInGuest || row.guestVisible).length);
  console.log("Giao diện học viên vẫn giữ đủ:", updatedRows.length, "bài.");

  rl.close();
});
