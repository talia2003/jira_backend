import { createSupabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(
    request: Request,
     { params }: { params: Promise<{ boardId: string }> }) {
        try {
            const supabase = createSupabaseAdmin()
            const { boardId } = await params

            // Fetch the board
            const {data: board, error: boardError} = await supabase
            .from('boards')
            .select('*')
            .eq('id', boardId)
            .single()

            if (boardError) {
                return Response.json({ error: boardError.message }, { status: 404 })
        }

        // Fetch the columns for this board, ordered left to right
        const { data: columns, error: colError } = await supabase
        .from('columns')
        .select("*")
        .eq('board_id', boardId)
        .order('position')

        if (colError) {
            return Response.json({ error: colError.message }, { status: 500})
        }

        // Fetch the tickets for this board, ordered top to bottom
        const {data: tickets, error: tickError} = await supabase
        .from('tickets')
        .select('*')
        .eq('board_id', boardId)
        .order('position')

        if (tickError) {
            return Response.json({ error: tickError.message }, {status: 500})
        }

        return Response.json({board, columns, tickets}, {status:200})  
         } catch (e) {
            const message = e instanceof Error ? e.message : 'Unknown error'
            return Response.json({error: message}, {status: 500})
         }
}