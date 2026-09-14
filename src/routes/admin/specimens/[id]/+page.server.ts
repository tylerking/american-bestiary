import { error, fail } from '@sveltejs/kit'
import { creatureSchema } from '$lib/schemas'
import { adminActions } from '$lib/server/auth/auth'
import { listRevisions, replacePlate, saveCreature, setPublished } from '$lib/server/db/content'
import { getSpecimenById } from '$lib/server/db/queries'
import { failure, parseForm, routeId, settle, sourcesFromForm, unique } from '$lib/server/http/forms'
import { revisionSummaries } from '$lib/server/http/revisions'
import { storeUpload } from '$lib/server/media/blobs'
import type { Actions, PageServerLoad } from './$types'

const NOT_FOUND = 'Specimen not found'

export const load: PageServerLoad = async ({ params, url }) => {
	const id = routeId(params.id)
	const [specimen, revisions] = await Promise.all([getSpecimenById(id), listRevisions('creature', id)])
	if (!specimen) throw error(404, NOT_FOUND)
	return { specimen, revisions: revisionSummaries(revisions), restored: url.searchParams.has('restored') }
}

function exists<Row>(row: Row | null): Row {
	if (!row) throw error(404, NOT_FOUND)
	return row
}

const publish =
	(published: boolean) =>
	async ({ params, locals }: { params: { id: string }; locals: App.Locals }) => {
		exists(await setPublished(routeId(params.id), published, locals.userId))
		return { success: true, scope: 'publish', message: published ? 'Published.' : 'Unpublished.' }
	}

export const actions: Actions = adminActions({
	save: async ({ params, request, locals }) => {
		const id = routeId(params.id)
		const parsed = parseForm(sourcesFromForm(await request.formData()), creatureSchema)
		if (!parsed.ok) return failure(parsed)
		return settle(await unique(() => saveCreature(id, parsed.data, locals.userId)), NOT_FOUND)
	},
	publish: publish(true),
	unpublish: publish(false),
	replacePlate: async ({ params, request, locals }) => {
		const id = routeId(params.id)
		const stored = await storeUpload((await request.formData()).get('plate'))
		if ('error' in stored) return fail(400, { message: stored.error, field: 'plate', scope: 'plate' })
		exists(await replacePlate(id, stored.key, locals.userId))
		return { success: true, scope: 'plate', message: 'Plate replaced.' }
	}
})
