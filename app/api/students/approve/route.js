import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "public", "data", "students.json");

async function readStudents() {
  try {
    const text = await fs.readFile(filePath, "utf8");
    return JSON.parse(text || "[]");
  } catch {
    return [];
  }
}

async function writeStudents(students) {
  await fs.writeFile(filePath, JSON.stringify(students, null, 2), "utf8");
}

export async function POST(request) {
  const body = await request.json();
  const students = await readStudents();

  const id = body.id;
  const status = body.status === "approved" ? "approved" : "pending";

  const nextStudents = students.map((student) =>
    student.id === id
      ? { ...student, status, approvedAt: status === "approved" ? new Date().toISOString() : null }
      : student
  );

  await writeStudents(nextStudents);

  return NextResponse.json({ ok: true });
}



