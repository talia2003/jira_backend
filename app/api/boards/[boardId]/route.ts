import { handleGetBoardById } from './handlers/getBoardById'

/**
 * Fetches a single board with all its columns and tickets.
 * Columns are ordered by position (left to right); tickets by position within each column.
 * @param params.boardId - UUID of the board from the URL path
 * @returns `{ board, columns, tickets }` or 404 if the board does not exist
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ boardId: string }> },
) {
  return handleGetBoardById(_request, params)
}
