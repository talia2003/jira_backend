import { corsHeaders } from './cors'

export function handleOptionsPing(request: Request) {
  const origin = request.headers.get('origin')
  return new Response(null, {
    status: 204,
    headers: corsHeaders(origin ?? undefined),
  })
}
