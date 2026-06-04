export function handleGetPing() {
  return Response.json({
    ok: true,
    message: 'pong',
    timestamp: new Date().toISOString(),
  })
}
