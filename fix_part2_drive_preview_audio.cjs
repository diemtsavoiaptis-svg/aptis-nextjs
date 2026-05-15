const fs = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "app", "listening", "part-2", "page.js");

if (!fs.existsSync(file)) {
  console.error("Cannot find:", file);
  process.exit(1);
}

let code = fs.readFileSync(file, "utf8");
const backup = file + ".backup-drive-preview-audio-" + Date.now();
fs.copyFileSync(file, backup);

// 1. Thêm hàm lấy link preview Google Drive
if (!code.includes("function getDrivePreviewUrl")) {
  code = code.replace(
`function getAudioUrl(row) {`,
`function getDrivePreviewUrl(row) {
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
    const match1 = text.match(/\\/d\\/([^/]+)/);
    if (match1) return match1[1];

    const match2 = text.match(/[?&]id=([^&]+)/);
    if (match2) return match2[1];

    return "";
  }

  const driveId = extractDriveId(url) || id;

  return driveId ? \`https://drive.google.com/file/d/\${driveId}/preview\` : "";
}

function getAudioUrl(row) {`
  );
}

// 2. Thêm audioPreviewUrl vào normalizeRow
if (!code.includes("audioPreviewUrl: getDrivePreviewUrl(row)")) {
  code = code.replace(
    /audioUrl:\s*getAudioUrl\(row\),/,
    `audioUrl: getAudioUrl(row),
    audioPreviewUrl: getDrivePreviewUrl(row),`
  );
}

// 3. Đổi audio player: ưu tiên iframe Google Drive preview
code = code.replace(
/<div className="audioBar">\s*\{activeRow\.audioUrl \? \(\s*<audio controls src=\{activeRow\.audioUrl\} preload="metadata" \/>\s*\) : \(\s*<div className="audioMissing">Chưa có audio cho bài này<\/div>\s*\)\}\s*<\/div>/,
`<div className="audioBar">
              {activeRow.audioPreviewUrl ? (
                <iframe
                  className="driveAudioFrame"
                  src={activeRow.audioPreviewUrl}
                  allow="autoplay"
                />
              ) : activeRow.audioUrl ? (
                <audio controls src={activeRow.audioUrl} preload="metadata" />
              ) : (
                <div className="audioMissing">Chưa có audio cho bài này</div>
              )}
            </div>`
);

// Nếu file vẫn còn audioBar dạng cũ thì thay tiếp
code = code.replace(
/<div className="audioBar">\s*<audio controls src=\{activeRow\.audioUrl\}[^>]*\/>\s*<\/div>/,
`<div className="audioBar">
              {activeRow.audioPreviewUrl ? (
                <iframe
                  className="driveAudioFrame"
                  src={activeRow.audioPreviewUrl}
                  allow="autoplay"
                />
              ) : activeRow.audioUrl ? (
                <audio controls src={activeRow.audioUrl} preload="metadata" />
              ) : (
                <div className="audioMissing">Chưa có audio cho bài này</div>
              )}
            </div>`
);

// 4. CSS cho iframe audio
if (!code.includes(".driveAudioFrame")) {
  code = code.replace(
/\.audioBar audio\s*\{[\s\S]*?\}/,
`.audioBar audio {
          width: 100%;
          height: 44px;
          border-radius: 999px;
        }

        .driveAudioFrame {
          width: 100%;
          height: 76px;
          border: 0;
          border-radius: 18px;
          background: white;
        }`
  );
}

fs.writeFileSync(file, code, "utf8");

console.log("Part 2 audio now uses Google Drive preview iframe first.");
console.log("Backup:", backup);
