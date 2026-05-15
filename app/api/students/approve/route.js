import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

function clean(value) {
  return String(value ?? "").trim();
}

export async function POST(request) {
  try {
    const body = await request.json();

    const id = clean(body.id);
    const status = clean(body.status);

    if (!id || !["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { ok: false, message: "Thiếu ID học viên hoặc trạng thái không hợp lệ." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("students")
      .update({ status })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("POST /api/students/approve Supabase error:", error);
      return NextResponse.json(
        { ok: false, message: error.message || "Không cập nhật được học viên." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      student: data,
    });
  } catch (error) {
    console.error("POST /api/students/approve error:", error);
    return NextResponse.json(
      { ok: false, message: error.message || "Không cập nhật được học viên." },
      { status: 500 }
    );
  }
}
