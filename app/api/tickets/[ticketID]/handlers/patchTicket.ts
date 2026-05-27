import { getSupabase } from '@/lib/supabaseAdmin'

export async function handlePatchTicket(
  request: Request,
  params: Promise<{ ticketID: string }>,
) {
  try {
    const supabase = getSupabase()
    const { ticketID } = await params
    const body = await request.json()

    const updates: Record<string, unknown> = {}
    if (body.title !== undefined) updates.title = body.title
    if (body.columnId !== undefined) updates.column_id = body.columnId
    if (body.position !== undefined) updates.position = body.position

    if (Object.keys(updates).length === 0) {
      return Response.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const { data: ticket, error } = await supabase
      .from('tickets')
      .update(updates)
      .eq('id', ticketID)
      .select()
      .single()

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ ticket }, { status: 200 })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return Response.json({ error: message }, { status: 500 })
  }
}

