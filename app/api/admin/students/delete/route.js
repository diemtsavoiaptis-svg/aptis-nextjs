import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(request) {
  try {
    const body = await request.json()
    const id = String(body.id || '').trim()

    if (!id) {
      return NextResponse.json({ ok: false, message: 'Missing student id.' }, { status: 400 })
    }

    const supabase = createSupabaseAdmin()

    const { error } = await supabase
      .from('student_accounts')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ ok: false, message: error.message }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      message: 'Student profile deleted successfully.'
    })
  } catch (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 })
  }
}
