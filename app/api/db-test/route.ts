import { createSupabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET() {
  try {
    const supabase = createSupabaseAdmin()
    const { data, error } = await supabase
      .from('smoke_test')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }
    return Response.json({ rows: data ?? [] })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return Response.json({ error: message }, { status: 500 })
  }
}