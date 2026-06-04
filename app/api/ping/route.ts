import { handleGetPing } from './handlers/getPing'
import { handlePostPing } from './handlers/postPing'

/**
 * Health check for the API and frontend connectivity.
 */
export function GET() {
  return handleGetPing()
}

/**
 * Echoes the request body back in the response (for testing POST from Postman or the client).
 */
export async function POST(request: Request) {
  return handlePostPing(request)
}
