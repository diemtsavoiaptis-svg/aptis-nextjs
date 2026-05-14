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
  const stt = clean(row.stt) || String(index + 1);
  const audioLink = clean(row.audioLink || row.audio);

  return {
    selected: false,
    guestVisible: Boolean(row.guestVisible || row.showInGuest),
    showInGuest: Boolean(row.guestVisible || row.showInGuest),

    stt,
    order: Number.parseInt(stt, 10) || index + 1,

    audio: audioLink,
    audioLink,
    audio_drive_file_id: clean(row.audio_drive_file_id) || extractDriveId(audioLink),

    topic: clean(row.topic),

    question1: clean(row.question1),
    answer1: clean(row.answer1),

    question2: clean(row.question2),
    answer2: clean(row.answer2),

    question3: clean(row.question3),
    answer3: clean(row.answer3),

    question4: clean(row.question4),
    answer4: clean(row.answer4),

    voiceParagraph: clean(row.voiceParagraph),
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const rows = Array.isArray(body.rows) ? body.rows : [];

    const normalizedRows = rows.map(normalizeRow);

    const root = process.cwd();

    const files = [
      path.join(root, "app", "dashboard", "listening", "part-3", "data.json"),
      path.join(root, "public", "data", "part3-admin.json"),
      path.join(root, "public", "data", "part3-full.json"),
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
      {
        ok: false,
        message: "Cannot save Part 3 data.",
      },
      { status: 500 }
    );
  }
}
