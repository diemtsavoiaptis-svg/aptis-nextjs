import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function clean(value) {
  return String(value ?? "").trim();
}

function extractDriveId(url) {
  const text = clean(url);
  const match = text.match(/\/d\/([^/]+)/);
  return match ? match[1] : "";
}

function normalizeRow(row, index) {
  const stt = clean(row.stt || row.question || row.order) || String(index + 1);
  const audioLink = clean(row.audioLink || row.audio || "");

  return {
    selected: false,
    guestVisible: Boolean(row.guestVisible || row.showInGuest),
    showInGuest: Boolean(row.guestVisible || row.showInGuest),

    stt,
    question: stt,
    order: Number.parseInt(stt, 10) || index + 1,

    audio: audioLink,
    audioLink,
    audio_drive_file_id: clean(row.audio_drive_file_id) || extractDriveId(audioLink),

    topic: clean(row.topic),
    answerBank: clean(row.answerBank),
    answers: Array.isArray(row.answers)
      ? row.answers.map(clean).filter(Boolean)
      : clean(row.answerBank)
          .replace(/^Lựa chọn:\s*/i, "")
          .split(",")
          .map(clean)
          .filter(Boolean),

    person1: clean(row.person1),
    person2: clean(row.person2),
    person3: clean(row.person3),
    person4: clean(row.person4),

    voiceParagraph: clean(row.voiceParagraph || row.paragraph || row.transcript),
    paragraph: clean(row.voiceParagraph || row.paragraph || row.transcript),
    transcript: clean(row.voiceParagraph || row.paragraph || row.transcript),

    correct1: clean(row.correct1),
    correct2: clean(row.correct2),
    correct3: clean(row.correct3),
    correct4: clean(row.correct4),
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const rows = Array.isArray(body.rows) ? body.rows : [];
    const normalizedRows = rows.map(normalizeRow);

    const root = process.cwd();

    const files = [
      path.join(root, "app", "dashboard", "listening", "part-2", "data.json"),
      path.join(root, "public", "data", "part2-admin.json"),
      path.join(root, "public", "data", "part2-full.json"),
    ];

    for (const file of files) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, JSON.stringify(normalizedRows, null, 2), "utf8");
    }

    return NextResponse.json({
      ok: true,
      count: normalizedRows.length,
      guestCount: normalizedRows.filter((row) => row.showInGuest || row.guestVisible).length,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, message: "Cannot save Part 2 data." },
      { status: 500 }
    );
  }
}
