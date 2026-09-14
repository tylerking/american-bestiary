import { error } from '@sveltejs/kit'
import { getEntry } from '$lib/server/db/queries'
import { PUBLIC_CACHE } from '$lib/server/http/cache'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	const entry = await getEntry(params.slug)
	if (!entry) throw error(404, 'Specimen not found')
	setHeaders(PUBLIC_CACHE)
	return entry
}
