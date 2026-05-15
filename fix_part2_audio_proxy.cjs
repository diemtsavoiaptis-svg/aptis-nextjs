const fs = require("fs");
const path = require("path");

const root = process.cwd();
const file = path.join(root, "app", "listening", "part-2", "page.js");

if (!fs.existsSync(file)) {
  console.error("Cannot find:", file);
  process.exit(1);
}

let code = fs.readFileSync(file, "utf8");
const backup = file + ".backup-part2-audio-proxy-" + Date.now();
fs.copyFileSync(file, backup);

code = code.replace(
/function getAudioUrl\(row\) \{[\s\S]*?\n\}/,
`function getAudioUrl(row) {
  const candidates = [
    row.audioLink,
    row.audio,
    row.linkAudio,
    row.audioUrl,
    row.audio_file,
    row.audioFile,
    row["Link Audio"],
    row["Audio"],
    row["audio"],
  ];

  const rawUrl = candidates.map(clean).find(Boolean) || "";
  const savedId = clean(row.audio_drive_file_id || row.audioDriveFileId || row.driveId);

  function extractDriveId(value) {
    const text = clean(value);

    const match1 = text.match(/\\/d\\/([^/]+)/);
    if (match1) return match1[1];

    const match2 = text.match(/[?&]id=([^&]+)/);
    if (match2) return match2[1];

    return "";
  }

  const driveId = savedId || extractDriveId(rawUrl);

  if (driveId) {
    return \`/api/audio/drive?id=\${encodeURIComponent(driveId)}\`;
  }

  return rawUrl;
}`
);

code = code.replace(
/<div className="audioBar">[\s\S]*?<\/div>\s*(?=<button|<\/article>)/,
`<div className="audioBar">
              {activeRow.audioUrl ? (
                <audio
                  key={activeRow.audioUrl}
                  controls
                  preload="metadata"
                  src={activeRow.audioUrl}
                />
              ) : (
                <div className="audioMissing">Chưa có audio cho bài này</div>
              )}
            </div>

            `
);

code = code.replace(/audioPreviewUrl:\s*getDrivePreviewUrl\(row\),?\n?/g, "");
code = code.replace(/function getDrivePreviewUrl\(row\) \{[\s\S]*?\n\}\n\n/g, "");
code = code.replace(/\s*\.driveAudioFrame\s*\{[\s\S]*?\}/g, "");

fs.writeFileSync(file, code, "utf8");

console.log("Fixed Part 2 audio to use internal audio proxy.");
console.log("Backup:", path.relative(root, backup));
