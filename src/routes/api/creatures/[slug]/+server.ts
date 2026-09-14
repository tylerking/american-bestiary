import { json } from '@sveltejs/kit'
import { API_HEADERS, apiError, publicSpecimen } from '$lib/server/api'
import { getEntry } from '$lib/server/db/queries'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ params, url }) => {
	const entry = await getEntry(params.slug)
	if (!entry) return apiError(404, `No published specimen "${params.slug}"`)
	return json(publicSpecimen(entry.specimen, url.origin), { headers: API_HEADERS })
}
