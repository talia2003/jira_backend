import { corsHeaders } from './cors'

export function handleGetPing(request: Request) {
  const origin = request.headers.get('origin')
  return Response.json(
    { ok: true, message: 'pong', timestamp: new Date().toISOString() },
    { headers: corsHeaders(origin ?? undefined) },
  )
}

