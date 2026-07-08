type CorsOptions = {
  allowOrigins?: string[]
  allowVercelPreview?: boolean
}

function isAllowedOrigin(origin: string, options?: CorsOptions) {
  if (options?.allowOrigins?.includes(origin)) return true
  if (options?.allowVercelPreview && /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) {
    return true
  }
  if (/^http:\/\/localhost(:\d+)?$/i.test(origin)) return true
  return false
}

function resolveAllowedOriginsFromEnv(): string[] {
  const raw = process.env.CORS_ORIGINS
  if (!raw) return []
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export function withCors(request: Request, response: Response, options?: CorsOptions): Response {
  const origin = request.headers.get('origin')
  const allowOrigins = options?.allowOrigins ?? resolveAllowedOriginsFromEnv()

  const headers = new Headers(response.headers)

  if (origin && isAllowedOrigin(origin, { ...options, allowOrigins })) {
    headers.set('Access-Control-Allow-Origin', origin)
    headers.set('Vary', 'Origin')
  }

  headers.set('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS')
  headers.set('Access-Control-Allow-Headers', 'Authorization,Content-Type')
  headers.set('Access-Control-Max-Age', '86400')

  return new Response(response.body, { status: response.status, statusText: response.statusText, headers })
}

export function corsPreflight(request: Request, options?: CorsOptions): Response {
  return withCors(request, new Response(null, { status: 204 }), options)
}

// Used by `proxy.ts` (Next middleware) which needs an iterable of header pairs.
export function corsHeaders(origin: string | undefined, options?: CorsOptions) {
  const headers = new Headers()
  const allowOrigins = options?.allowOrigins ?? resolveAllowedOriginsFromEnv()

  if (origin && isAllowedOrigin(origin, { ...options, allowOrigins })) {
    headers.set('Access-Control-Allow-Origin', origin)
    headers.set('Vary', 'Origin')
  }

  headers.set('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS')
  headers.set('Access-Control-Allow-Headers', 'Authorization,Content-Type')
  headers.set('Access-Control-Max-Age', '86400')

  return headers
}
