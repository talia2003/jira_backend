import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { corsHeaders } from '@/lib/cors'
import { getAuthUser } from './lib/getAuthUser'

const PUBLIC_PATHS =  ['/api/ping', '/api/db-test']

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname.startsWith(path))
}

function applyCors(response: NextResponse, origin: string | undefined) {
  for (const [key, value] of corsHeaders(origin, { allowVercelPreview: true })) {
    response.headers.set(key, value)
  }
  return response
}

export async function proxy(request: NextRequest) {
  const origin = request.headers.get('origin') ?? undefined

  if (request.method === 'OPTIONS') {
    const headers: Record<string, string> = {}
    for (const [key, value] of corsHeaders(origin, { allowVercelPreview: true })) {
      headers[key] = value
    }
    return NextResponse.json({}, { headers })
  }

  const {pathname} = request.nextUrl

  if (!isPublicPath(pathname)) {
    const {user, error} = await getAuthUser(request)

    if (!user) {
      return applyCors(
        NextResponse.json({error: error ?? 'Unauthorized'}, { status: 401}),
        origin
      )
    }

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', user.id)

    return applyCors(
      NextResponse.next({
        request: { headers: requestHeaders},
      }),
      origin,
    )
  }

  return applyCors(NextResponse.next(), origin)
}

export const config = {
  matcher: '/api/:path*',
}
