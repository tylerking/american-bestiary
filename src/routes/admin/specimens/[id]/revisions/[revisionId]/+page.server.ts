import { error } from '@sveltejs/kit'
import { getSpecimenById } from '$lib/server/db/queries'
import { routeId } from '$lib/server/http/forms'
import { revisionRoute } from '$lib/server/http/revisions'
import type { Actions, PageServerLoad } from './$types'

const route = revisionRoute('creature', async (params) => {
	const id = routeId(params.id)
	const specimen = await getSpecimenById(id)
	if (!specimen) throw error(404, 'Specimen not found')
	return { id, name: specimen.name, href: `/admin/specimens/${id}` }
})

export const load: PageServerLoad = route.load
export const actions: Actions = route.actions
