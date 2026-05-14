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

export async function GET() {
  const students = await readStudents();
  return NextResponse.json({ students });
}

export async function POST(request) {
  const body = await request.json();
  const students = await readStudents();

  const student = {
    id: body.studentId?.trim() || `STU-${Date.now()}`,
    name: body.name?.trim() || "No name",
    phone: body.phone?.trim() || "",
    email: body.email?.trim() || "",
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  const existed = students.find((x) => x.id === student.id);
  if (existed) {
    return NextResponse.json({ ok: true, student: existed });
  }

  students.unshift(student);
  await writeStudents(students);

  return NextResponse.json({ ok: true, student });
}



