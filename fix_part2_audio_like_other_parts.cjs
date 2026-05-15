const fs = require("fs");
const path = require("path");

const root = process.cwd();
const pageFile = path.join(root, "app", "listening", "part-2", "page.js");

if (!fs.existsSync(pageFile)) {
  console.error("Cannot find:", pageFile);
  process.exit(1);
}

let code = fs.readFileSync(pageFile, "utf8");
const backup = pageFile + ".backup-match-working-audio-parts-" + Date.now();
fs.copyFileSync(pageFile, backup);

// 1. Ghi lại hàm getAudioUrl giống logic Part 1/3/4: lấy Drive ID -> uc download link
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
    return \`https://drive.google.com/uc?export=download&id=\${driveId}\`;
  }

  return rawUrl;
}`
);

// 2. Bỏ iframe / API proxy, chỉ dùng audio tag giống các part đã chạy
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

// 3. Xóa mọi dấu vết iframe Drive preview nếu còn
code = code.replace(/audioPreviewUrl:\s*getDrivePreviewUrl\(row\),?\n?/g, "");
code = code.replace(/function getDrivePreviewUrl\(row\) \{[\s\S]*?\n\}\n\n/g, "");
code = code.replace(/\s*\.driveAudioFrame\s*\{[\s\S]*?\}/g, "");

// 4. Đảm bảo CSS audio giống thanh nghe bình thường
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

console.log("Fixed Part 2 audio to match working Part 1/3/4 style.");
console.log("Backup:", path.relative(root, backup));
