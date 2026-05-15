import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabaseAdmin'
import { hashPassword } from '@/lib/password'

export async function POST(request) {
  try {
    const body = await request.json()

    const fullName = String(body.fullName || '').trim()
    const phone = String(body.phone || '').trim()
    const email = String(body.email || '').trim().toLowerCase()
    const password = String(body.password || '')

    if (!fullName || !phone || !email || !password) {
      return NextResponse.json({
        ok: false,
        message: 'Please fill in all fields.'
      }, { status: 400 })
    }

    if (password.length < 4) {
      return NextResponse.json({
        ok: false,
        message: 'Password is too short.'
      }, { status: 400 })
    }

    const supabase = createSupabaseAdmin()

    const { data: existing } = await supabase
      .from('student_accounts')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({
        ok: false,
        message: 'This email is already registered.'
      }, { status: 409 })
    }

    const { data, error } = await supabase
      .from('student_accounts')
      .insert({
        student_code: null,
        full_name: fullName,
        phone,
        email,
        password_hash: hashPassword(password),
        role: 'student',
        status: 'pending'
      })
      .select('id, student_code, email, full_name, phone, role, status, created_at')
      .single()

    if (error) {
      return NextResponse.json({
        ok: false,
        message: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      message: 'Registration submitted. Please wait for admin approval.',
      user: data
    })
  } catch (error) {
    return NextResponse.json({
      ok: false,
      message: error.message
    }, { status: 500 })
  }
}
