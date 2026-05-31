import { handleGetPing } from './handlers/getPing'
import { handleOptionsPing } from './handlers/optionsPing'
import { handlePostPing } from './handlers/postPing'

  /**
   * Handles CORS preflight requests from the browser.
   * Returns allowed methods and headers for cross-origin calls from the frontend.
   */
  export function OPTIONS(request: Request) {
    return handleOptionsPing(request)
  }

  /**
   * Health check for the API and frontend connectivity.
   * Returns a pong message and timestamp; includes CORS headers for allowed origins.
   */
  export function GET(request: Request) {
    return handleGetPing(request)
  }

  /**
   * Echoes the request body back in the response (for testing POST from Postman or the client).
   * Useful to verify JSON parsing and CORS on write requests.
   */
  export async function POST(request: Request) {
    return handlePostPing(request)
  }
