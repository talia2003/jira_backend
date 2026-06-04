import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { corsHeaders } from '@/lib/cors'

function applyCors(response: NextResponse, origin: string | undefined) {
  for (const [key, value] of corsHeaders(origin)) {
    response.headers.set(key, value)
  }
  return response
}

export function proxy(request: NextRequest) {
  const origin = request.headers.get('origin') ?? undefined

  if (request.method === 'OPTIONS') {
    const headers: Record<string, string> = {}
    for (const [key, value] of corsHeaders(origin)) {
      headers[key] = value
    }
    return NextResponse.json({}, { headers })
  }

  return applyCors(NextResponse.next(), origin)
}

export const config = {
  matcher: '/api/:path*',
}
