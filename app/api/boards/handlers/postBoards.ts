import { getSupabase } from '@/lib/supabaseAdmin'
import { DEFAULT_COLUMN_TEMPLATES } from '../constants/defaultColumns'
import { getUserId } from '@/lib/getUserId'

export async function handlePostBoards(request: Request) {
  try {
    const userId = getUserId(request)
    const supabase = getSupabase()
    const body = await request.json()

    if (!body.name) {
      return Response.json({ error: 'Name is required' }, { status: 400 })
    }

    const { data: board, error: boardError } = await supabase
      .from('boards')
      .insert({ name: body.name, owner_id: userId })
      .select()
      .single()

    if (boardError) {
      return Response.json({ error: boardError.message }, { status: 500 })
    }

    const defaultColumns = DEFAULT_COLUMN_TEMPLATES.map((c) => ({
      board_id: board.id,
      title: c.title,
      position: c.position,
    }))

    const { error: columnsError } = await supabase.from('columns').insert(defaultColumns)
    if (columnsError) {
      return Response.json({ error: columnsError.message }, { status: 500 })
    }

    return Response.json({ board }, { status: 201 })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return Response.json({ error: message }, { status: 500 })
  }
}
