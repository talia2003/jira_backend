import { getSupabase } from '@/lib/supabaseAdmin'
import { getOrigin, jsonResponse } from '@/lib/cors'

export async function handlePostTicket(request: Request) {
  try {
    const supabase = getSupabase()
    const origin = getOrigin(request)
    const body = await request.json()

    if (!body.board_id || !body.column_id || !body.title) {
      return jsonResponse(
        { error: 'board_id, column_id and title are required' },
        400,
        origin,
      )
    }

    const { data: existing } = await supabase
      .from('tickets')
      .select('position')
      .eq('column_id', body.column_id)
      .order('position', { ascending: false })
      .limit(1)

    const nextPosition =
      existing && existing.length > 0 ? existing[0].position + 1 : 0

    const { data: ticket, error } = await supabase
      .from('tickets')
      .insert({
        board_id: body.board_id,
        column_id: body.column_id,
        title: body.title,
        position: nextPosition,
      })
      .select()
      .single()

    if (error) {
      return jsonResponse({ error: error.message }, 500, origin)
    }

    return jsonResponse({ ticket }, 201, origin)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return jsonResponse({ error: message }, 500, getOrigin(request))
  }
}
