import { getSupabase } from '@/lib/supabaseAdmin'
import { getOrigin, jsonResponse } from '@/lib/cors'

export async function handlePatchTicket(
  request: Request,
  params: Promise<{ ticketID: string }>,
) {
  try {
    const supabase = getSupabase()
    const { ticketID } = await params
    const origin = getOrigin(request)
    const body = await request.json()

    const updates: Record<string, unknown> = {}
    if (body.title !== undefined) updates.title = body.title
    if (body.columnId !== undefined) updates.column_id = body.columnId
    if (body.position !== undefined) updates.position = body.position

    if (Object.keys(updates).length === 0) {
      return jsonResponse({ error: 'No valid fields to update' }, 400, origin)
    }

    const { data: ticket, error } = await supabase
      .from('tickets')
      .update(updates)
      .eq('id', ticketID)
      .select()
      .single()

    if (error) {
      return jsonResponse({ error: error.message }, 500, origin)
    }

    return jsonResponse({ ticket }, 200, origin)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return jsonResponse({ error: message }, 500, getOrigin(request))
  }
}
