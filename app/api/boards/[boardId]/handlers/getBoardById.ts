import { getSupabase } from '@/lib/supabaseAdmin'
import { getOrigin, jsonResponse } from '@/lib/cors'

export async function handleGetBoardById(
  request: Request,
  params: Promise<{ boardId: string }>,
) {
  try {
    const supabase = getSupabase()
    const { boardId } = await params
    const origin = getOrigin(request)

    const [boardResult, columnsResult, ticketsResult] = await Promise.all([
      supabase.from('boards').select('*').eq('id', boardId).single(),
      supabase.from('columns').select('*').eq('board_id', boardId).order('position'),
      supabase.from('tickets').select('*').eq('board_id', boardId).order('position'),
    ])

    const { data: board, error: boardError } = boardResult
    if (boardError) {
      return jsonResponse({ error: boardError.message }, 404, origin)
    }

    const { data: columns, error: colError } = columnsResult
    if (colError) {
      return jsonResponse({ error: colError.message }, 500, origin)
    }

    const { data: tickets, error: tickError } = ticketsResult
    if (tickError) {
      return jsonResponse({ error: tickError.message }, 500, origin)
    }

    return jsonResponse({ board, columns, tickets }, 200, origin)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return jsonResponse({ error: message }, 500, getOrigin(request))
  }
}
