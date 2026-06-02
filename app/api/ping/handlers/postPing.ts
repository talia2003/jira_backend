export async function handlePostPing(request: Request) {
  const body = await request.json().catch(() => null)

  return Response.json({
    ok: true,
    message: 'pong',
    youSent: body,
  })
}
