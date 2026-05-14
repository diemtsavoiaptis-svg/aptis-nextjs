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

function normalizeLetter(value) {
  const text = clean(value).toUpperCase();
  return ["A", "B", "C"].includes(text) ? text : "";
}

function normalizeRow(row, index) {
  const stt = clean(row.stt || row.question || row.order) || String(index + 1);
  const audioLink = clean(row.audioLink || row.audio || row.linkAudio);

  const correct16 = normalizeLetter(
    row.correct16 ||
    row.answer16 ||
    row.correctAnswer16 ||
    row["Đáp án đúng 16"]
  );

  const correct17 = normalizeLetter(
    row.correct17 ||
    row.answer17 ||
    row.correctAnswer17 ||
    row["Đáp án đúng 17"]
  );

  return {
    ...row,
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

    question16: clean(row.question16),
    answer1: clean(row.answer1),
    answer2: clean(row.answer2),
    answer3: clean(row.answer3),

    question17: clean(row.question17),
    choice1: clean(row.choice1),
    choice2: clean(row.choice2),
    choice3: clean(row.choice3),

    correct16,
    answer16: correct16,
    correctAnswer16: correct16,

    correct17,
    answer17: correct17,
    correctAnswer17: correct17,

    paraphrase: clean(row.paraphrase || row.voiceParagraph || row.transcript),
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const rows = Array.isArray(body.rows) ? body.rows : [];
    const normalizedRows = rows.map(normalizeRow);

    const root = process.cwd();

    const files = [
      path.join(root, "app", "dashboard", "listening", "part-4", "data.json"),
      path.join(root, "public", "data", "part4-admin.json"),
      path.join(root, "public", "data", "part4-full.json"),
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
      { ok: false, message: "Cannot save Part 4 data." },
      { status: 500 }
    );
  }
}
