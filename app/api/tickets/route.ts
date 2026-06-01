import { handlePostTicket } from './handlers/postTicket'
import { getOrigin, optionsResponse } from '@/lib/cors'

/**
 * Creates a new ticket in the given column at the bottom of that column's list.
 * Assigns position automatically (max existing position + 1, or 0 if empty).
 * @param request - JSON body: `{ board_id, column_id, title }` (all required)
 * @returns `{ ticket }` with status 201, or 400 if any field is missing
 */
export async function POST(request: Request) {
  return handlePostTicket(request)
}

export function OPTIONS(request: Request) {
  return optionsResponse(getOrigin(request))
}