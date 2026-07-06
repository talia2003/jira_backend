import { getSupabase } from '@/lib/supabaseAdmin'
import { getUserId } from '@/lib/getUserId'

export async function handleGetBoardById(request: Request, params: Promise<{ boardId: string }>) {
  try {
    const userId = getUserId(request)
    const supabase = getSupabase()
    const { boardId } = await params

    const { data: board, error: boardError } = await supabase
      .from('boards')
      .select('*')
      .eq('id', boardId)
      .eq('owner_id', userId)
      .single()

    if (boardError || !board) {
      return Response.json({ error: 'Board not found' }, { status: 404 })
    }

    const [columnsResult, ticketsResult] = await Promise.all([
      supabase.from('columns').select('*').eq('board_id', boardId).order('position'),
      supabase.from('tickets').select('*').eq('board_id', boardId).order('position'),
    ])

    const { data: columns, error: colError } = columnsResult
    if (colError) {
      return Response.json({ error: colError.message }, { status: 500 })
    }

    const { data: tickets, error: tickError } = ticketsResult
    if (tickError) {
      return Response.json({ error: tickError.message }, { status: 500 })
    }

    return Response.json({ board, columns: columns ?? [], tickets: tickets ?? [] })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return Response.json({ error: message }, { status: 500 })
  }
}
