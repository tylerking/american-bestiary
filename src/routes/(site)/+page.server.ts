import { territoryFromSlug } from '$lib/codex'
import { DEFAULT_TERRITORY } from '$lib/enums'
import { currentMonth, getMonthlyTheme, getPublishedCodex, summarize } from '$lib/server/db/queries'
import { PUBLIC_CACHE } from '$lib/server/http/cache'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url, setHeaders }) => {
	const published = getPublishedCodex()
	const [codex, theme] = await Promise.all([published, getMonthlyTheme(currentMonth(), published)])
	setHeaders(PUBLIC_CACHE)
	return {
		specimens: codex.map(summarize),
		territory: territoryFromSlug(url.searchParams.get('territory')) ?? DEFAULT_TERRITORY,
		theme
	}
}
