import { error } from '@sveltejs/kit'
import { getEntry, getSettings } from '$lib/server/db/queries'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	const [entry, settings] = await Promise.all([getEntry(params.slug, { includeUnpublished: true }), getSettings()])
	if (!entry) throw error(404, 'Specimen not found')
	setHeaders({ 'cache-control': 'private, no-store' })
	return { ...entry, settings }
}
