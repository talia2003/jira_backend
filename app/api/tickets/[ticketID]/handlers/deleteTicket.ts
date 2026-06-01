import { getSupabase } from '@/lib/supabaseAdmin'
import { getOrigin, jsonResponse } from '@/lib/cors'

export async function handleDeleteTicket(
  request: Request,
  params: Promise<{ ticketID: string }>,
) {
  try {
    const supabase = getSupabase()
    const { ticketID } = await params
    const origin = getOrigin(request)

    const { error } = await supabase.from('tickets').delete().eq('id', ticketID)
    if (error) {
      return jsonResponse({ error: error.message }, 500, origin)
    }

    return jsonResponse({ ok: true }, 200, origin)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return jsonResponse({ error: message }, 500, getOrigin(request))
  }
}
