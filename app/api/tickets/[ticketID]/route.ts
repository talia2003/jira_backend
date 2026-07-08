import { handleDeleteTicket } from './handlers/deleteTicket'
import { handlePatchTicket } from './handlers/patchTicket'
import { corsPreflight, withCors } from '@/lib/cors'

/**
 * Partially updates a ticket. Only fields sent in the body are changed.
 * @param params.ticketID - UUID of the ticket from the URL path
 * @param request - JSON body (all optional): `{ title?, columnId?, position? }`
 * @returns `{ ticket }` with the updated row, or 400 if no valid fields were sent
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ ticketID: string }> },
) {
  const res = await handlePatchTicket(request, params)
  return withCors(request, res, { allowVercelPreview: true })
}

/**
 * Permanently deletes a ticket by id.
 * @param params.ticketID - UUID of the ticket from the URL path
 * @returns `{ ok: true }` on success
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ ticketID: string }> },
) {
  const res = await handleDeleteTicket(params)
  return withCors(_request, res, { allowVercelPreview: true })
}

export function OPTIONS(request: Request) {
  return corsPreflight(request, { allowVercelPreview: true })
}
