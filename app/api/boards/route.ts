import { handleGetBoards } from './handlers/getBoards'
import { handlePostBoards } from './handlers/postBoards'
import { corsPreflight, withCors } from '@/lib/cors'

/**
 * Lists all boards, newest first.
 * @returns `{ boards: Board[] }` — each board has id, name, created_at
 */
export async function GET(request: Request) {
  const res = await handleGetBoards(request)
  return withCors(request, res, { allowVercelPreview: true })
}

/**
 * Creates a new board and four default columns (To Do, In Progress, Review, Done).
 * @param request - JSON body: `{ name: string }` (required)
 * @returns `{ board }` with status 201, or 400 if name is missing
 */
export async function POST(request: Request) {
  const res = await handlePostBoards(request)
  return withCors(request, res, { allowVercelPreview: true })
}

export function OPTIONS(request: Request) {
  return corsPreflight(request, { allowVercelPreview: true })
}
