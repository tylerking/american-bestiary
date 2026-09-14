import { error } from '@sveltejs/kit'
import { themeSchema } from '$lib/schemas'
import { adminActions } from '$lib/server/auth/auth'
import { listRevisions, saveTheme } from '$lib/server/db/content'
import { getCodex, getThemeById } from '$lib/server/db/queries'
import { failure, parseForm, routeId, settle, unique } from '$lib/server/http/forms'
import { revisionSummaries } from '$lib/server/http/revisions'
import type { Actions, PageServerLoad } from './$types'

const NOT_FOUND = 'Theme not found'

export const load: PageServerLoad = async ({ params, url }) => {
	const id = routeId(params.id)
	const [theme, codex, revisions] = await Promise.all([getThemeById(id), getCodex(), listRevisions('theme', id)])
	if (!theme) throw error(404, NOT_FOUND)
	return {
		theme,
		options: codex.map((specimen) => ({
			value: specimen.id,
			label: `${specimen.name} (${specimen.territory})`
		})),
		revisions: revisionSummaries(revisions),
		restored: url.searchParams.has('restored')
	}
}

export const actions: Actions = adminActions({
	save: async ({ params, request, locals }) => {
		const id = routeId(params.id)
		const parsed = parseForm(await request.formData(), themeSchema)
		if (!parsed.ok) return failure(parsed)
		return settle(await unique(() => saveTheme(id, parsed.data, locals.userId)), NOT_FOUND)
	}
})
