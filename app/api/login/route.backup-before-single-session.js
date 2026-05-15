import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createSupabaseAdmin } from '@/lib/supabaseAdmin'
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

function getClientIp(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

function getDeviceLabel(userAgent) {
  const ua = String(userAgent || '').toLowerCase()

  if (ua.includes('iphone')) return 'iPhone'
  if (ua.includes('ipad')) return 'iPad'
  if (ua.includes('android')) return 'Android'
  if (ua.includes('windows')) return 'Windows PC'
  if (ua.includes('macintosh') || ua.includes('mac os')) return 'Mac'
  return 'Unknown device'
}

async function createSecurityEvent(supabase, payload) {
  await supabase.from('security_events').insert(payload)
}

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
    const supabase = createSupabaseAdmin()
    const userAgent = request.headers.get('user-agent') || ''
    const ipAddress = getClientIp(request)
    const deviceLabel = getDeviceLabel(userAgent)

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
      await createSecurityEvent(supabase, {
        student_id: user.id,
        email: user.email,
        student_code: user.student_code,
        event_type: 'blocked_pending_login',
        message: 'Student tried to login before admin approval.',
        device_label: deviceLabel,
        user_agent: userAgent,
        ip_address: ipAddress
      })

      return NextResponse.json({
        ok: false,
        status: user.status,
        message: 'Your account is waiting for admin approval.'
      }, { status: 403 })
    }

    const { count: activeSessionCount, error: countError } = await supabase
      .from('student_sessions')
      .select('id', { count: 'exact', head: true })
      .eq('student_id', user.id)
      .eq('is_active', true)

    if (countError) {
      return NextResponse.json({
        ok: false,
        message: countError.message
      }, { status: 500 })
    }

    if ((activeSessionCount || 0) >= 2) {
      await createSecurityEvent(supabase, {
        student_id: user.id,
        email: user.email,
        student_code: user.student_code,
        event_type: 'blocked_third_device',
        message: 'Blocked login because this account already has 2 active devices.',
        device_label: deviceLabel,
        user_agent: userAgent,
        ip_address: ipAddress
      })

      return NextResponse.json({
        ok: false,
        code: 'TOO_MANY_DEVICES',
        message: 'This account is already logged in on 2 devices. Please logout from another device first.'
      }, { status: 403 })
    }

    const sessionToken = crypto.randomBytes(32).toString('hex')

    const { data: session, error: sessionError } = await supabase
      .from('student_sessions')
      .insert({
        student_id: user.id,
        session_token: sessionToken,
        device_label: deviceLabel,
        user_agent: userAgent,
        ip_address: ipAddress,
        is_active: true
      })
      .select('id, session_token, device_label, created_at')
      .single()

    if (sessionError) {
      return NextResponse.json({
        ok: false,
        message: sessionError.message
      }, { status: 500 })
    }

    await createSecurityEvent(supabase, {
      student_id: user.id,
      email: user.email,
      student_code: user.student_code,
      event_type: 'student_login',
      message: 'Student logged in successfully.',
      device_label: deviceLabel,
      user_agent: userAgent,
      ip_address: ipAddress
    })

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
        status: user.status,
        sessionToken: session.session_token,
        deviceLabel: session.device_label
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
