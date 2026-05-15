import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { verifyPassword } from '@/lib/password'

const ADMINS = [
  {
    username: 'tshanh',
    password: '2007',
    fullName: 'Admin 1'
  },
  {
    username: 'tshan',
    password: '2014',
    fullName: 'Admin 2'
  }
]

export async function POST(request) {
  try {
    const body = await request.json()
    const username = String(body.username || body.email || '').trim()
    const password = String(body.password || '')

    if (!username || !password) {
      return NextResponse.json({
        ok: false,
        message: 'Please enter username and password.'
      }, { status: 400 })
    }

    const admin = ADMINS.find(item =>
      item.username.toLowerCase() === username.toLowerCase() &&
      item.password === password
    )

    if (admin) {
      return NextResponse.json({
        ok: true,
        message: 'Admin login successful.',
        user: {
          id: `local-admin-${admin.username}`,
          username: admin.username,
          fullName: admin.fullName,
          role: 'admin',
          status: 'approved'
        },
        redirectTo: '/dashboard/admin/students'
      })
    }

    const loginValue = username.toLowerCase()
    const supabase = getSupabaseAdmin()

    const { data: user, error } = await supabase
      .from('student_accounts')
      .select('*')
      .or(`email.eq.${loginValue},phone.eq.${username}`)
      .maybeSingle()

    if (error) {
      return NextResponse.json({
        ok: false,
        message: error.message
      }, { status: 500 })
    }

    if (!user || !verifyPassword(password, user.password_hash || '')) {
      return NextResponse.json({
        ok: false,
        message: 'Invalid email/phone or password.'
      }, { status: 401 })
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
    return NextResponse.json({
      ok: false,
      message: error.message
    }, { status: 500 })
  }
}
