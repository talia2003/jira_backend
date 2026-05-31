import { getSupabase } from '@/lib/supabaseAdmin'

export async function handleGetBoardById(params: Promise<{ boardId: string }>) {
  try {
    const supabase = getSupabase()
    const { boardId } = await params

    const [boardResult, columnsResult, ticketsResult] = await Promise.all([
      supabase.from('boards').select('*').eq('id', boardId).single(),
      supabase.from('columns').select('*').eq('board_id', boardId).order('position'),
      supabase.from('tickets').select('*').eq('board_id', boardId).order('position'),
    ])

    const { data: board, error: boardError } = boardResult
    if (boardError) {
      return Response.json({ error: boardError.message }, { status: 404 })
    }

    const { data: columns, error: colError } = columnsResult
    if (colError) {
      return Response.json({ error: colError.message }, { status: 500 })
    }

    const { data: tickets, error: tickError } = ticketsResult
    if (tickError) {
      return Response.json({ error: tickError.message }, { status: 500 })
    }

    return Response.json({ board, columns, tickets }, { status: 200 })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return Response.json({ error: message }, { status: 500 })
  }
}

