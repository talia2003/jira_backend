const ALLOWED_ORIGINS = [
    'http://localhost:5173', // your React dev server (Vite default)
    'http://localhost:3000', // optional if you test same-origin
    'https://jira-kohl.vercel.app', // production client on Vercel
  ]
  
  const ALLOWED_ORIGIN_PATTERNS = [
    // Vercel preview deployments for this project (any branch / PR)
    /^https:\/\/jira-kohl-[a-z0-9-]+\.vercel\.app$/,
  ]
  
  function isAllowedOrigin(origin: string) {
    if (ALLOWED_ORIGINS.includes(origin)) return true
    return ALLOWED_ORIGIN_PATTERNS.some((pattern) => pattern.test(origin))
  }
  
  export function corsHeaders(origin: string | undefined) {
    const headers = new Headers()
    if (origin && isAllowedOrigin(origin)) {
      headers.set('Access-Control-Allow-Origin', origin)
      headers.set('Vary', 'Origin')
    }
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
    headers.set('Access-Control-Allow-Headers', 'Content-Type')
    return headers
  }

  export function jsonResponse(data: unknown, status: number, origin?: string) {
    const headers = corsHeaders(origin)
    headers.set('Content-Type', 'application/json')
    return Response.json(data, { status, headers })
  }
  export function optionsResponse(origin?: string) {
    return new Response(null, { status: 204, headers: corsHeaders(origin) })
  }
  export function getOrigin(request: Request) {
    return request.headers.get('origin') ?? undefined
  }
  
  