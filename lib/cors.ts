const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://jira-kohl.vercel.app',
  'https://jira.vercel.app',
]

const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/jira(-[a-z0-9-]+)+\.vercel\.app$/,
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
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return headers
}
