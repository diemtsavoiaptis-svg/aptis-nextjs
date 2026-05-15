import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET() {
  try {
    const supabase = createSupabaseAdmin()

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(5)

    if (error) {
      return NextResponse.json({
        ok: false,
        message: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      message: 'Supabase connected successfully.',
      data
    })
  } catch (error) {
    return NextResponse.json({
      ok: false,
      message: error.message
    }, { status: 500 })
  }
}
