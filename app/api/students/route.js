import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

function clean(value) {
  return String(value ?? "").trim();
}

function makeStudentId(phone, email) {
  const raw = clean(phone) || clean(email).split("@")[0] || Date.now().toString();
  return raw.replace(/[^0-9a-zA-Z]/g, "").slice(0, 24);
}

function normalizeStudent(row) {
  return {
    id: row.id,
    student_id: row.student_id || row.studentId || row.code || row.id,
    full_name: row.full_name || row.fullName || row.name || "",
    name: row.full_name || row.fullName || row.name || "",
    phone: row.phone || row.phoneNumber || row.sdt || "",
    email: row.email || "",
    status: row.status || "pending",
    created_at: row.created_at || row.createdAt || "",
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = clean(searchParams.get("q")).toLowerCase();

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GET /api/students Supabase error:", error);
      return NextResponse.json(
        { ok: false, message: error.message || "Không tải được danh sách học viên." },
        { status: 500 }
      );
    }

    const students = (Array.isArray(data) ? data : []).map(normalizeStudent);

    const filtered = q
      ? students.filter((student) => {
          return (
            String(student.student_id || "").toLowerCase().includes(q) ||
            String(student.phone || "").toLowerCase().includes(q) ||
            String(student.email || "").toLowerCase().includes(q)
          );
        })
      : students;

    return NextResponse.json({
      ok: true,
      students: filtered,
      pending: filtered.filter((x) => x.status === "pending").length,
      approved: filtered.filter((x) => x.status === "approved").length,
      rejected: filtered.filter((x) => x.status === "rejected").length,
    });
  } catch (error) {
    console.error("GET /api/students error:", error);
    return NextResponse.json(
      { ok: false, message: error.message || "Không tải được danh sách học viên." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const student_id = clean(body.student_id || body.studentId || body.id) || makeStudentId(body.phone, body.email);
    const full_name = clean(body.full_name || body.fullName || body.name);
    const phone = clean(body.phone || body.phoneNumber || body.sdt);
    const email = clean(body.email).toLowerCase();
    const password = clean(body.password);

    if (!full_name || !email) {
      return NextResponse.json(
        { ok: false, message: "Vui lòng nhập đầy đủ họ tên và email." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("students")
      .insert({
        student_id,
        full_name,
        phone,
        email,
        password,
        status: "pending",
      })
      .select("*")
      .single();

    if (error) {
      console.error("POST /api/students Supabase error:", error);

      if (error.code === "23505" || String(error.message || "").toLowerCase().includes("duplicate")) {
        return NextResponse.json(
          { ok: false, message: "Tài khoản/email này đã đăng ký." },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { ok: false, message: error.message || "Đăng ký thất bại. Vui lòng thử lại." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Đã gửi đăng ký. Vui lòng chờ quản trị viên duyệt.",
      student: normalizeStudent(data),
    });
  } catch (error) {
    console.error("POST /api/students error:", error);
    return NextResponse.json(
      { ok: false, message: error.message || "Đăng ký thất bại. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
