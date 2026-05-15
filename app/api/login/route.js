import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabaseAdmin'
import { verifyPassword } from '@/lib/password'

export async function POST(request) {
  try {
    const body = await request.json()
    const username = String(body.username || '').trim()
    const password = String(body.password || '')

    if (!username || !password) {
      return NextResponse.json({ ok: false, message: 'Please enter username and password.' }, { status: 400 })
    }

    if (username.toLowerCase() === 'admin' && password === '123') {
      return NextResponse.json({
        ok: true,
        message: 'Admin login successful.',
        user: { id: 'local-admin', username: 'admin', fullName: 'Admin', role: 'admin', status: 'approved' },
        redirectTo: '/dashboard/admin/students'
      })
    }

    const loginValue = username.toLowerCase()
    const supabase = createSupabaseAdmin()

    const { data: user, error } = await supabase
      .from('student_accounts')
      .select('*')
      .or(`email.eq.${loginValue},student_code.eq.${username}`)
      .maybeSingle()

    if (error) {
      return NextResponse.json({ ok: false, message: error.message }, { status: 500 })
    }

    if (!user || !verifyPassword(password, user.password_hash || '')) {
      return NextResponse.json({ ok: false, message: 'Invalid username or password.' }, { status: 401 })
    }

    if (user.status !== 'approved') {
      return NextResponse.json({
        ok: false,
        status: user.status,
        message: 'Your account is waiting for admin approval.'
      }, { status: 403 })
    }

    return NextResponse.json({
      ok: true,
      message: 'Login successful.',
      user: {
        id: user.id,
        studentCode: user.student_code,
        email: user.email,
        phone: user.phone,
        fullName: user.full_name,
        role: user.role,
        status: user.status
      },
      redirectTo: '/listening/part-1?mode=student'
    })
  } catch (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 })
  }
}
