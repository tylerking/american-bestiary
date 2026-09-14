import { getAnalytics, pruneEvents } from '$lib/server/analytics/analytics'
import { getCodex } from '$lib/server/db/queries'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	const [codex] = await Promise.all([getCodex(), pruneEvents()])
	const entries = codex.map((specimen) => ({ path: `/creatures/${specimen.slug}`, title: specimen.name }))
	return {
		analytics: await getAnalytics(entries),
		counts: {
			specimens: codex.length,
			published: codex.filter((specimen) => specimen.publishedAt !== null).length
		}
	}
}
