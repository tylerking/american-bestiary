import { json } from '@sveltejs/kit'

import type { RequestHandler } from './$types'

export const GET: RequestHandler = () => {
  return json({
    service: 'american-bestiary-api',
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
}
