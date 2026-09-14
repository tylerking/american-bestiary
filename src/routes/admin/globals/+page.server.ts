import { labelsFormSchema, settingsSchema } from '$lib/schemas'
import { adminActions } from '$lib/server/auth/auth'
import { listRevisions, saveSettings } from '$lib/server/db/content'
import { getSettings } from '$lib/server/db/queries'
import { failure, parseForm } from '$lib/server/http/forms'
import { revisionSummaries } from '$lib/server/http/revisions'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
	const settings = await getSettings()
	const revisions = settings.id ? await listRevisions('settings', settings.id) : []
	return { settings, revisions: revisionSummaries(revisions), restored: url.searchParams.has('restored') }
}

export const actions: Actions = adminActions({
	update: async ({ request, locals }) => {
		const form = await request.formData()
		const parsed = parseForm(form, settingsSchema)
		if (!parsed.ok) return failure(parsed)
		const labels = parseForm(form, labelsFormSchema)
		if (!labels.ok) return failure(labels)
		await saveSettings({ ...parsed.data, labels: labels.data }, locals.userId)
		return { success: true }
	}
})
