const fs = require("fs");
const path = require("path");

const root = process.cwd();

const audioLinks = {
  1: "https://drive.google.com/file/d/1VZ-spVm3bsOIG-Et_V9HNTIkPJpMXsjM/view?usp=drivesdk",
  2: "https://drive.google.com/file/d/1AmzIj0V6biBGfr-sw-ZiwKkbFD91W7rn/view?usp=drivesdk",
  3: "https://drive.google.com/file/d/1vxiup6VwGpk4rSf6wr2-Q8nd90RSAmfZ/view?usp=drivesdk",
  4: "https://drive.google.com/file/d/1lxG3MlbypOEPe99XSHAPwqEZfBsx9mbs/view?usp=drivesdk",
  5: "https://drive.google.com/file/d/1MBds8eRtvZDERHX9MBcx3xdWe1vAdKUN/view?usp=drivesdk",
  6: "https://drive.google.com/file/d/1qxQy3iaxt_ewvmgsQ7Bv2bro031Dkupz/view?usp=drivesdk",
  7: "https://drive.google.com/file/d/1LENG0HZ8RIj-LfVIir0NqFb-Ma_bWoU4/view?usp=drivesdk",
  8: "https://drive.google.com/file/d/15_mie4mhWBeuEpH1QruMtzKwQ3iZjaD7/view?usp=drivesdk",
  9: "https://drive.google.com/file/d/1bZFuRl4GOjKMRLDaQEcASAera2KJa-Lg/view?usp=drivesdk",
  10: "https://drive.google.com/file/d/1XX7L0f72oQdsbZCiwVOscw1nbqRRVHZp/view?usp=drivesdk",
  11: "https://drive.google.com/file/d/1hwLcWinYpOtdmi9pDJEOPTaT_F0Wkxes/view?usp=drivesdk",
  12: "https://drive.google.com/file/d/1VmTWraSZfgitmc9k2I-FEx7iRC2FJ03J/view?usp=drivesdk",
};

function clean(value) {
  return String(value ?? "").trim();
}

function extractDriveId(url) {
  const text = clean(url);
  const match1 = text.match(/\/d\/([^/]+)/);
  if (match1) return match1[1];

  const match2 = text.match(/[?&]id=([^&]+)/);
  if (match2) return match2[1];

  return "";
}

function directDriveUrl(url) {
  const id = extractDriveId(url);
  return id ? `https://drive.google.com/uc?export=download&id=${id}` : url;
}

const dataFiles = [
  "app/dashboard/listening/part-2/data.json",
  "public/data/part2-admin.json",
  "public/data/part2-full.json",
];

for (const relative of dataFiles) {
  const file = path.join(root, relative);

  if (!fs.existsSync(file)) {
    console.log("Missing:", relative);
    continue;
  }

  const backup = file + ".backup-fix-part2-audio-" + Date.now();
  fs.copyFileSync(file, backup);

  let rows = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!Array.isArray(rows)) rows = rows.rows || [];

  rows = rows.map((row, index) => {
    const order = Number(row.order || row.stt || row.question || index + 1);
    const audioLink = audioLinks[order] || clean(row.audioLink || row.audio || row.linkAudio || row["Link Audio"]);

    return {
      ...row,
      stt: clean(row.stt || order),
      order,
      audio: audioLink,
      audioLink,
      linkAudio: audioLink,
      audio_drive_file_id: extractDriveId(audioLink),
      audioUrl: directDriveUrl(audioLink),
    };
  });

  fs.writeFileSync(file, JSON.stringify(rows, null, 2), "utf8");

  const withAudio = rows.filter((row) => clean(row.audioLink || row.audio || row.audioUrl)).length;
  console.log("Updated:", relative);
  console.log("Rows:", rows.length, "| With audio:", withAudio);
  console.log("Backup:", path.relative(root, backup));
}

const pageFile = path.join(root, "app/listening/part-2/page.js");

if (!fs.existsSync(pageFile)) {
  console.error("Cannot find Part 2 student page:", pageFile);
  process.exit(1);
}

let code = fs.readFileSync(pageFile, "utf8");
const pageBackup = pageFile + ".backup-fix-audio-reader-" + Date.now();
fs.copyFileSync(pageFile, pageBackup);

// Replace getAudioUrl function with a stronger version
code = code.replace(
/function getAudioUrl\(row\) \{[\s\S]*?\n\}/,
`function getAudioUrl(row) {
  const candidates = [
    row.audioUrl,
    row.audioLink,
    row.audio,
    row.linkAudio,
    row.audio_file,
    row.audioFile,
    row["Link Audio"],
    row["Audio"],
    row["audio"],
  ];

  const url = candidates.map(clean).find(Boolean) || "";
  const id = clean(row.audio_drive_file_id || row.audioDriveFileId || row.driveId);

  function extractDriveId(value) {
    const text = clean(value);
    const match1 = text.match(/\\\\/d\\\\/([^/]+)/);
    if (match1) return match1[1];

    const match2 = text.match(/[?&]id=([^&]+)/);
    if (match2) return match2[1];

    return "";
  }

  const driveId = extractDriveId(url) || id;

  if (driveId) {
    return \`https://drive.google.com/uc?export=download&id=\${driveId}\`;
  }

  return url;
}`
);

// Add fallback text if audio empty
code = code.replace(
/<div className="audioBar">\s*<audio controls src=\{activeRow\.audioUrl\} \/>\s*<\/div>/,
`<div className="audioBar">
              {activeRow.audioUrl ? (
                <audio controls src={activeRow.audioUrl} preload="metadata" />
              ) : (
                <div className="audioMissing">Chưa có audio cho bài này</div>
              )}
            </div>`
);

if (!code.includes(".audioMissing")) {
  code = code.replace(
/\.audioBar audio\s*\{[\s\S]*?\}/,
`.audioBar audio {
          width: 100%;
          height: 44px;
          border-radius: 999px;
        }

        .audioMissing {
          width: 100%;
          min-height: 44px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.92);
          color: #9f001f;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
        }`
  );
}

fs.writeFileSync(pageFile, code, "utf8");

console.log("");
console.log("Patched:", path.relative(root, pageFile));
console.log("Backup:", path.relative(root, pageBackup));
console.log("");
console.log("Done fixing Part 2 audio.");
