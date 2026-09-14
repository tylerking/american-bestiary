import { getSettings } from '$lib/server/db/queries'
import { revisionRoute } from '$lib/server/http/revisions'
import type { Actions, PageServerLoad } from './$types'

const route = revisionRoute('settings', async () => ({
	id: (await getSettings()).id,
	name: 'Globals',
	href: '/admin/globals'
}))

export const load: PageServerLoad = route.load
export const actions: Actions = route.actions
