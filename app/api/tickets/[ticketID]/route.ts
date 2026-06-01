import { getOrigin, optionsResponse } from '@/lib/cors'
import { handleDeleteTicket } from './handlers/deleteTicket'
import { handlePatchTicket } from './handlers/patchTicket'

export function OPTIONS(request: Request) {
  return optionsResponse(getOrigin(request))
}

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
  return handlePatchTicket(request, params)
}

/**
 * Permanently deletes a ticket by id.
 * @param params.ticketID - UUID of the ticket from the URL path
 * @returns `{ ok: true }` on success
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ ticketID: string }> },
) {
  return handleDeleteTicket(request, params)
}
