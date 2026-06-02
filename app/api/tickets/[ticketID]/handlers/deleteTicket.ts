import { getSupabase } from '@/lib/supabaseAdmin'

export async function handleDeleteTicket(params: Promise<{ ticketID: string }>) {
  try {
    const supabase = getSupabase()
    const { ticketID } = await params

    const { error } = await supabase.from('tickets').delete().eq('id', ticketID)
    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ ok: true })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return Response.json({ error: message }, { status: 500 })
  }
}
