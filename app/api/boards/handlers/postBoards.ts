import { getSupabase } from '@/lib/supabaseAdmin'
import { getOrigin, jsonResponse } from '@/lib/cors'
import { DEFAULT_COLUMN_TEMPLATES } from '../constants/defaultColumns'

export async function handlePostBoards(request: Request) {
  try {
    const supabase = getSupabase()
    const origin = getOrigin(request)
    const body = await request.json()

    if (!body.name) {
      return jsonResponse({ error: 'Name is required' }, 400, origin)
    }

    const { data: board, error: boardError } = await supabase
      .from('boards')
      .insert({ name: body.name })
      .select()
      .single()

    if (boardError) {
      return jsonResponse({ error: boardError.message }, 500, origin)
    }

    const defaultColumns = DEFAULT_COLUMN_TEMPLATES.map((c) => ({
      board_id: board.id,
      title: c.title,
      position: c.position,
    }))

    const { error: columnsError } = await supabase.from('columns').insert(defaultColumns)
    if (columnsError) {
      return jsonResponse({ error: columnsError.message }, 500, origin)
    }

    return jsonResponse({ board }, 201, origin)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return jsonResponse({ error: message }, 500, getOrigin(request))
  }
}
