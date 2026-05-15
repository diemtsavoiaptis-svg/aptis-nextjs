import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabaseAdmin'

function clean(value) {
  return String(value ?? '').trim()
}

export async function POST(request) {
  try {
    const body = await request.json()

    const id = clean(body.id)
    const studentCode = clean(body.studentCode)
    const fullName = clean(body.fullName)
    const phone = clean(body.phone)
    const email = clean(body.email).toLowerCase()
    const status = clean(body.status) || 'pending'

    if (!id) {
      return NextResponse.json({ ok: false, message: 'Missing student id.' }, { status: 400 })
    }

    if (!fullName || !phone || !email) {
      return NextResponse.json({ ok: false, message: 'Please fill in name, phone and email.' }, { status: 400 })
    }

    const supabase = createSupabaseAdmin()

    if (studentCode) {
      const { data: duplicatedCode } = await supabase
        .from('student_accounts')
        .select('id')
        .eq('student_code', studentCode)
        .neq('id', id)
        .maybeSingle()

      if (duplicatedCode) {
        return NextResponse.json({ ok: false, message: 'This student code is already used.' }, { status: 409 })
      }
    }

    const { data: duplicatedEmail } = await supabase
      .from('student_accounts')
      .select('id')
      .eq('email', email)
      .neq('id', id)
      .maybeSingle()

    if (duplicatedEmail) {
      return NextResponse.json({ ok: false, message: 'This email is already used.' }, { status: 409 })
    }

    const updateData = {
      student_code: studentCode || null,
      full_name: fullName,
      phone,
      email,
      status
    }

    if (status === 'approved') {
      updateData.approved_at = new Date().toISOString()
    }

    if (status !== 'approved') {
      updateData.approved_at = null
    }

    const { data, error } = await supabase
      .from('student_accounts')
      .update(updateData)
      .eq('id', id)
      .select('id, student_code, email, full_name, phone, role, status, created_at, approved_at')
      .single()

    if (error) {
      return NextResponse.json({ ok: false, message: error.message }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      message: 'Student profile saved successfully.',
      student: data
    })
  } catch (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 })
  }
}
