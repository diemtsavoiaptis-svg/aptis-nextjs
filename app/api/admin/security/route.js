import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabaseAdmin'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createSupabaseAdmin()

    const { data: sessions, error: sessionError } = await supabase
      .from('student_sessions')
      .select(`
        id,
        student_id,
        device_label,
        ip_address,
        is_active,
        created_at,
        last_seen_at,
        revoked_at,
        student_accounts (
          full_name,
          email,
          student_code,
          phone
        )
      `)
      .order('created_at', { ascending: false })
      .limit(100)

    if (sessionError) {
      return NextResponse.json({
        ok: false,
        message: sessionError.message
      }, { status: 500 })
    }

    const { data: events, error: eventError } = await supabase
      .from('security_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (eventError) {
      return NextResponse.json({
        ok: false,
        message: eventError.message
      }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      sessions: sessions || [],
      events: events || []
    })
  } catch (error) {
    return NextResponse.json({
      ok: false,
      message: error.message
    }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const sessionId = String(body.sessionId || '').trim()

    if (!sessionId) {
      return NextResponse.json({
        ok: false,
        message: 'Missing session id.'
      }, { status: 400 })
    }

    const supabase = createSupabaseAdmin()

    const { error } = await supabase
      .from('student_sessions')
      .update({
        is_active: false,
        revoked_at: new Date().toISOString()
      })
      .eq('id', sessionId)

    if (error) {
      return NextResponse.json({
        ok: false,
        message: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      message: 'Session revoked successfully.'
    })
  } catch (error) {
    return NextResponse.json({
      ok: false,
      message: error.message
    }, { status: 500 })
  }
}
