import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET() {
  try {
    const supabase = createSupabaseAdmin()

    const { data, error } = await supabase
      .from('student_accounts')
      .select('id, student_code, email, full_name, phone, role, status, created_at, approved_at')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ ok: false, message: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, students: data })
  } catch (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 })
  }
}
