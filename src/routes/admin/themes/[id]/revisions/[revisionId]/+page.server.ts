import { error } from '@sveltejs/kit'
import { getThemeById } from '$lib/server/db/queries'
import { routeId } from '$lib/server/http/forms'
import { revisionRoute } from '$lib/server/http/revisions'
import type { Actions, PageServerLoad } from './$types'

const route = revisionRoute('theme', async (params) => {
	const id = routeId(params.id)
	const theme = await getThemeById(id)
	if (!theme) throw error(404, 'Theme not found')
	return { id, name: theme.title, href: `/admin/themes/${id}` }
})

export const load: PageServerLoad = route.load
export const actions: Actions = route.actions
