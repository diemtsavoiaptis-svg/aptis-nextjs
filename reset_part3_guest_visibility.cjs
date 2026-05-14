const fs = require("fs");
const path = require("path");

const files = [
  "app/dashboard/listening/part-3/data.json",
  "public/data/part3-admin.json",
  "public/data/part3-full.json"
];

for (const file of files) {
  const full = path.join(process.cwd(), file);

  if (!fs.existsSync(full)) {
    console.log("Skip missing:", file);
    continue;
  }

  const rows = JSON.parse(fs.readFileSync(full, "utf8"));

  const nextRows = rows.map((row) => ({
    ...row,
    selected: false,
    guestVisible: false,
    showInGuest: false
  }));

  fs.writeFileSync(full, JSON.stringify(nextRows, null, 2), "utf8");
  console.log("Hidden from guest:", file, "rows:", nextRows.length);
}

console.log("Part 3 guest view reset. Student mode still keeps all data.");
