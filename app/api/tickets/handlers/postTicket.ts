import { getSupabase } from '@/lib/supabaseAdmin'

export async function handlePostTicket(request: Request) {
  try {
    const supabase = getSupabase()
    const body = await request.json()

    if (!body.board_id || !body.column_id || !body.title) {
      return Response.json(
        { error: 'board_id, column_id and title are required' },
        { status: 400 },
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
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ ticket }, { status: 201 })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return Response.json({ error: message }, { status: 500 })
  }
}
