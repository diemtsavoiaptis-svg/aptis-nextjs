import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabaseAdmin'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const body = await request.json()
    const studentId = String(body.studentId || '').trim()
    const sessionToken = String(body.sessionToken || '').trim()

    if (!studentId || !sessionToken) {
      return NextResponse.json({
        ok: false,
        active: false,
        message: 'Missing session.'
      }, { status: 401 })
    }

    const supabase = createSupabaseAdmin()

    const { data: session, error } = await supabase
      .from('student_sessions')
      .select('id, is_active')
      .eq('student_id', studentId)
      .eq('session_token', sessionToken)
      .maybeSingle()

    if (error) {
      return NextResponse.json({
        ok: false,
        active: false,
        message: error.message
      }, { status: 500 })
    }

    if (!session || !session.is_active) {
      return NextResponse.json({
        ok: true,
        active: false,
        message: 'Session expired or revoked.'
      })
    }

    await supabase
      .from('student_sessions')
      .update({ last_seen_at: new Date().toISOString() })
      .eq('id', session.id)

    return NextResponse.json({
      ok: true,
      active: true
    })
  } catch (error) {
    return NextResponse.json({
      ok: false,
      active: false,
      message: error.message
    }, { status: 500 })
  }
}
