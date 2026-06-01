import { corsHeaders } from './cors'

export async function handlePostPing(request: Request) {
  const origin = request.headers.get('origin')
  const body = await request.json().catch(() => null)

  return Response.json(
    { ok: true, message: 'pong', youSent: body },
    { headers: corsHeaders(origin ?? undefined) },
  )
}
