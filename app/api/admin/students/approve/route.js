import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(request) {
  try {
    const body = await request.json()
    const id = String(body.id || '').trim()
    const studentCode = String(body.studentCode || '').trim()

    if (!id) {
      return NextResponse.json({ ok: false, message: 'Missing student id.' }, { status: 400 })
    }

    if (!studentCode) {
      return NextResponse.json({ ok: false, message: 'Please enter student code before approval.' }, { status: 400 })
    }

    const supabase = createSupabaseAdmin()

    const { data: duplicated } = await supabase
      .from('student_accounts')
      .select('id')
      .eq('student_code', studentCode)
      .neq('id', id)
      .maybeSingle()

    if (duplicated) {
      return NextResponse.json({ ok: false, message: 'This student code is already used.' }, { status: 409 })
    }

    const { data, error } = await supabase
      .from('student_accounts')
      .update({
        student_code: studentCode,
        status: 'approved',
        approved_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('id, student_code, email, full_name, phone, role, status, created_at, approved_at')
      .single()

    if (error) {
      return NextResponse.json({ ok: false, message: error.message }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      message: 'Student approved successfully.',
      student: data
    })
  } catch (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 })
  }
}
