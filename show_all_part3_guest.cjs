const fs = require("fs");
const path = require("path");

const files = [
  "app/dashboard/listening/part-3/data.json",
  "public/data/part3-admin.json",
  "public/data/part3-full.json",
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
    guestVisible: true,
    showInGuest: true,
  }));

  fs.writeFileSync(full, JSON.stringify(nextRows, null, 2), "utf8");
  console.log("Updated:", file, "rows:", nextRows.length);
}

console.log("All Part 3 rows are now visible for guest.");
