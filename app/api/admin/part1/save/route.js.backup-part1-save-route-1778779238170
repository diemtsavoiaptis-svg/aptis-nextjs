import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request) {
  try {
    const rows = await request.json();

    if (!Array.isArray(rows)) {
      return NextResponse.json(
        { ok: false, message: "Invalid data. Expected array." },
        { status: 400 }
      );
    }

    const cleanRows = rows.map((row, index) => {
      const answerA = row.answerA || "";
      const answerB = row.answerB || "";
      const answerC = row.answerC || "";

      return {
        selected: false,
        showInGuest: Boolean(row.showInGuest),
        audio: row.audio || "",
        audio_drive_file_id: row.audio_drive_file_id || "",
        stt: row.stt || String(index + 1),
        order: Number(row.order || row.stt || index + 1),
        question: row.question || "",
        answerA,
        answerB,
        answerC,
        options: [answerA, answerB, answerC],
        voiceData: row.voiceData || "",
      };
    });

    const root = process.cwd();
    const json = JSON.stringify(cleanRows, null, 2);

    const files = [
      path.join(root, "app", "dashboard", "listening", "part-1", "data.json"),
      path.join(root, "public", "data", "part1-admin.json"),
      path.join(root, "public", "data", "part1-full.json"),
    ];

    for (const file of files) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, json, "utf8");
    }

    return NextResponse.json({
      ok: true,
      count: cleanRows.length,
      guestCount: cleanRows.filter((row) => row.showInGuest).length,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error.message || "Save failed." },
      { status: 500 }
    );
  }
}
