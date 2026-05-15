import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

function clean(value) {
  return String(value ?? "").trim();
}

export async function POST(request) {
  try {
    const body = await request.json();

    const account = clean(body.account || body.email || body.phone || body.student_code).toLowerCase();
    const password = clean(body.password);

    if (!account || !password) {
      return NextResponse.json(
        { ok: false, message: "Please enter your account and password." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("student_accounts")
      .select("id, student_code, full_name, phone, email, password, status, created_at")
      .or(`email.eq.${account},phone.eq.${account},student_code.eq.${account}`)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Login Supabase error:", error);
      return NextResponse.json(
        { ok: false, message: error.message || "Login failed." },
        { status: 500 }
      );
    }

    if (!data || clean(data.password) !== password) {
      return NextResponse.json(
        { ok: false, message: "Incorrect account or password." },
        { status: 401 }
      );
    }

    if (data.status !== "approved") {
      return NextResponse.json(
        {
          ok: false,
          status: data.status,
          message:
            data.status === "rejected"
              ? "Your account has been rejected by admin."
              : "Your account is waiting for admin approval.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Login successful.",
      student: {
        id: data.id,
        student_code: data.student_code,
        full_name: data.full_name,
        phone: data.phone,
        email: data.email,
        status: data.status,
      },
    });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { ok: false, message: error.message || "Login failed." },
      { status: 500 }
    );
  }
}
