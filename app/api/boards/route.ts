import { createSupabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET() {
    try{
        const supabase = createSupabaseAdmin()
        const {data, error} = await supabase
        .from('boards')
        .select('*')
        .order('created_at', { ascending: false })

        if (error) {
            return Response.json({ error: error.message }, { status: 500 })
        }

        return Response.json({boards: data ?? []})
    }  catch (e) {
        const message = e instanceof Error ? e.message : 'Unknown error'
        return Response.json({ error: message }, { status: 500 })
      }
}

export async function POST(request: Request) {
    try {
        const supabase = createSupabaseAdmin()
        const body = await request.json()

        if(!body.name){
            return Response.json({ error: 'Name is required' }, { status: 400 })
        }

        const {data: board, error: boardError} = await supabase
            .from('boards')
            .insert({name: body.name})
            .select()
            .single()

        if (boardError) {
            return Response.json({ error: boardError.message }, { status: 500 })
        }

        const defaultColumns = [
            {board_id: board.id, title: 'To Do', position: 0},
            {board_id: board.id, title: 'In Progress', position: 1},
            {board_id: board.id, title: 'Review', position: 2},
            {board_id: board.id, title: 'Done', position: 3},
        ]

        const {error: columnsError} = await supabase
            .from('columns')
            .insert(defaultColumns)

        if (columnsError) {
            return Response.json({ error: columnsError.message }, { status: 500 })
        }

        return Response.json({board}, { status: 201 })
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Unknown error'
        return Response.json({ error: message }, { status: 500 })
    }
}

