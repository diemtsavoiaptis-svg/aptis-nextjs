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

function normalizeCorrect(row) {
  const raw = clean(
    row.correctAnswer ||
    row.correct ||
    row.answer ||
    row.answerKey ||
    row.correctOption ||
    row.dapAn ||
    row["Đáp án đúng"]
  ).toUpperCase();

  if (["A", "B", "C"].includes(raw)) return raw;

  return "";
}

function normalizeRow(row, index) {
  const stt = clean(row.stt || row.question || row.order) || String(index + 1);
  const audioLink = clean(row.audioLink || row.audio || "");
  const correctAnswer = normalizeCorrect(row);

  return {
    ...row,
    selected: false,
    guestVisible: Boolean(row.guestVisible || row.showInGuest),
    showInGuest: Boolean(row.guestVisible || row.showInGuest),

    stt,
    question: clean(row.question || row.questionText || row.title || ""),
    order: Number.parseInt(stt, 10) || index + 1,

    audio: audioLink,
    audioLink,
    audio_drive_file_id: clean(row.audio_drive_file_id) || extractDriveId(audioLink),

    correctAnswer,
    correct: correctAnswer,
    answer: correctAnswer,
    answerKey: correctAnswer,
    correctOption: correctAnswer,
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const rows = Array.isArray(body.rows) ? body.rows : [];
    const normalizedRows = rows.map(normalizeRow);

    const root = process.cwd();

    const files = [
      path.join(root, "app", "dashboard", "listening", "part-1", "data.json"),
      path.join(root, "public", "data", "part1-admin.json"),
      path.join(root, "public", "data", "part1-full.json"),
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
      { ok: false, message: "Cannot save Part 1 data." },
      { status: 500 }
    );
  }
}
