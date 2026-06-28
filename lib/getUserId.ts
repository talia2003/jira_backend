export function getUserId(request: Request) : string {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
        throw new Error('User ID is required')
    }
    return userId
}