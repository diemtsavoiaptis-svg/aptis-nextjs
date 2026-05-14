const fs = require("fs");
const path = require("path");

const root = process.cwd();

const files = [
  path.join(root, "app", "dashboard", "listening", "part-2", "data.json"),
  path.join(root, "public", "data", "part2-admin.json"),
  path.join(root, "public", "data", "part2-full.json"),
];

const audioMap = {
  "1": "https://drive.google.com/file/d/1VZ-spVm3bsOIG-Et_V9HNTIkPJpMXsjM/view?usp=drivesdk",
  "2": "https://drive.google.com/file/d/1AmzIj0V6biBGfr-sw-ZiwKkbFD91W7rn/view?usp=drivesdk",
  "3": "https://drive.google.com/file/d/1vxiup6VwGpk4rSf6wr2-Q8nd90RSAmfZ/view?usp=drivesdk",
  "4": "https://drive.google.com/file/d/1lxG3MlbypOEPe99XSHAPwqEZfBsx9mbs/view?usp=drivesdk",
  "5": "https://drive.google.com/file/d/1MBds8eRtvZDERHX9MBcx3xdWe1vAdKUN/view?usp=drivesdk",
  "6": "https://drive.google.com/file/d/1qxQy3iaxt_ewvmgsQ7Bv2bro031Dkupz/view?usp=drivesdk",
  "7": "https://drive.google.com/file/d/1LENG0HZ8RIj-LfVIir0NqFb-Ma_bWoU4/view?usp=drivesdk",
  "8": "https://drive.google.com/file/d/15_mie4mhWBeuEpH1QruMtzKwQ3iZjaD7/view?usp=drivesdk",
  "9": "https://drive.google.com/file/d/1bZFuRl4GOjKMRLDaQEcASAera2KJa-Lg/view?usp=drivesdk",
  "10": "https://drive.google.com/file/d/1XX7L0f72oQdsbZCiwVOscw1nbqRRVHZp/view?usp=drivesdk",
  "11": "https://drive.google.com/file/d/1hwLcWinYpOtdmi9pDJEOPTaT_F0Wkxes/view?usp=drivesdk",
  "12": "https://drive.google.com/file/d/1VmTWraSZfgitmc9k2I-FEx7iRC2FJ03J/view?usp=drivesdk",
};

function extractDriveId(url) {
  const text = String(url || "").trim();
  const match = text.match(/\/d\/([^/]+)/);
  return match ? match[1] : "";
}

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.log("Skip missing:", path.relative(root, file));
    continue;
  }

  const backup = file + ".backup-before-part2-audio-" + Date.now();
  fs.copyFileSync(file, backup);

  const rows = JSON.parse(fs.readFileSync(file, "utf8"));

  const nextRows = rows.map((row, index) => {
    const stt = String(row.stt || row.question || row.order || index + 1).trim();
    const audioLink = audioMap[stt] || row.audioLink || row.audio || "";

    return {
      ...row,
      audio: audioLink,
      audioLink,
      audio_drive_file_id: extractDriveId(audioLink),
    };
  });

  fs.writeFileSync(file, JSON.stringify(nextRows, null, 2), "utf8");

  console.log("Updated:", path.relative(root, file));
  console.log("Backup:", path.relative(root, backup));
  console.log("Rows:", nextRows.length);
  console.log("Rows with audio:", nextRows.filter((row) => row.audioLink || row.audio_drive_file_id).length);
}

console.log("");
console.log("Part 2 audio merge completed.");
