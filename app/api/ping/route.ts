import { handleGetPing } from './handlers/getPing'
import { handlePostPing } from './handlers/postPing'
import { corsPreflight, withCors } from '@/lib/cors'

/**
 * Health check for the API and frontend connectivity.
 */
export function GET(request: Request) {
  const res = handleGetPing()
  return withCors(request, res, { allowVercelPreview: true })
}

/**
 * Echoes the request body back in the response (for testing POST from Postman or the client).
 */
export async function POST(request: Request) {
  const res = await handlePostPing(request)
  return withCors(request, res, { allowVercelPreview: true })
}

export function OPTIONS(request: Request) {
  return corsPreflight(request, { allowVercelPreview: true })
}
