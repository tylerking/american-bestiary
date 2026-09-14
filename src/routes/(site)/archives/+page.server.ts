import { archiveQuerySchema } from '$lib/schemas'
import { getPublishedCodex, summarize } from '$lib/server/db/queries'
import { PUBLIC_CACHE } from '$lib/server/http/cache'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url, setHeaders }) => {
	const codex = await getPublishedCodex()
	setHeaders(PUBLIC_CACHE)
	return {
		specimens: codex.map(summarize),
		query: archiveQuerySchema.parse(Object.fromEntries(url.searchParams))
	}
}
