const fs = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "app", "listening", "part-2", "page.js");

if (!fs.existsSync(file)) {
  console.error("Cannot find:", file);
  process.exit(1);
}

let code = fs.readFileSync(file, "utf8");
const backup = file + ".backup-audio-only-no-drive-frame-" + Date.now();
fs.copyFileSync(file, backup);

// Xóa hàm preview iframe nếu có
code = code.replace(
/function getDrivePreviewUrl\(row\) \{[\s\S]*?\n\}\n\nfunction getAudioUrl\(row\) \{/,
`function getAudioUrl(row) {`
);

// Xóa audioPreviewUrl khỏi normalizeRow
code = code.replace(/\s*audioPreviewUrl:\s*getDrivePreviewUrl\(row\),/g, "");

// Ghi lại hàm getAudioUrl an toàn: Drive -> API nội bộ, không hiện link Drive
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

    const match1 = text.match(/\\/d\\/([^/]+)/);
    if (match1) return match1[1];

    const match2 = text.match(/[?&]id=([^&]+)/);
    if (match2) return match2[1];

    return "";
  }

  const driveId = extractDriveId(url) || id;

  if (driveId) {
    return \`/api/audio/drive?id=\${encodeURIComponent(driveId)}\`;
  }

  return url;
}`
);

// Đổi player về audio only
code = code.replace(
/<div className="audioBar">\s*\{activeRow\.audioPreviewUrl \? \([\s\S]*?\) : activeRow\.audioUrl \? \(\s*<audio controls src=\{activeRow\.audioUrl\} preload="metadata" \/>\s*\) : \(\s*<div className="audioMissing">Chưa có audio cho bài này<\/div>\s*\)\}\s*<\/div>/,
`<div className="audioBar">
              {activeRow.audioUrl ? (
                <audio controls controlsList="nodownload noplaybackrate" src={activeRow.audioUrl} preload="metadata" />
              ) : (
                <div className="audioMissing">Chưa có audio cho bài này</div>
              )}
            </div>`
);

// Nếu còn iframe driveAudioFrame thì xóa CSS
code = code.replace(
/\s*\.driveAudioFrame\s*\{[\s\S]*?\}/g,
""
);

// Nếu còn JSX iframe rơi rớt thì thay bằng audio
code = code.replace(
/\{activeRow\.audioPreviewUrl \? \([\s\S]*?<iframe[\s\S]*?\/>\s*\) : activeRow\.audioUrl \? \([\s\S]*?<audio controls src=\{activeRow\.audioUrl\} preload="metadata" \/>\s*\) : \([\s\S]*?<div className="audioMissing">Chưa có audio cho bài này<\/div>\s*\)\}/g,
`{activeRow.audioUrl ? (
                <audio controls controlsList="nodownload noplaybackrate" src={activeRow.audioUrl} preload="metadata" />
              ) : (
                <div className="audioMissing">Chưa có audio cho bài này</div>
              )}`
);

fs.writeFileSync(file, code, "utf8");

console.log("Updated Part 2: audio-only player, no Google Drive iframe/link UI.");
console.log("Backup:", backup);
