import { json } from '@sveltejs/kit'
import { API_HEADERS } from '$lib/server/api'
import { openApiDocument } from '$lib/server/openapi'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = ({ url }) => json(openApiDocument(url.origin), { headers: API_HEADERS })
