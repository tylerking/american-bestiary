import { getCodex, getThemes } from '$lib/server/db/queries'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	const [themes, codex] = await Promise.all([getThemes(), getCodex()])
	const names = new Map(codex.map((specimen) => [specimen.id, specimen.name]))
	return {
		themes: themes.map((theme) => ({
			id: theme.id,
			month: theme.month,
			title: theme.title,
			members: theme.slots.map((slot) => names.get(slot.creatureId) ?? slot.creatureId)
		}))
	}
}
