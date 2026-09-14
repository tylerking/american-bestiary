import { isActionFailure, type RequestEvent, type ServerLoadEvent } from '@sveltejs/kit'
import { hashPassword } from '$lib/server/auth/password'
import { db } from '$lib/server/db'
import * as tables from '$lib/server/db/schema'
import { CREATURES } from '../../scripts/seed-content/creatures'
import { plateKey } from '../../scripts/seed-content/plates'
import { SETTINGS } from '../../scripts/seed-content/settings'
import { THEMES } from '../../scripts/seed-content/themes'
import { requestEvent } from '../helpers/event'

export { loaded, thrown } from '../helpers/event'

interface EventInit {
	path?: string
	form?: Record<string, string | Blob>
	params?: Record<string, string>
	routeId?: string
	cookies?: Record<string, string>
	userId?: number | null
	ip?: string
}

export function adminEvent(init: EventInit = {}) {
	const userId = init.userId ?? null
	const { event, jar } = requestEvent({
		...init,
		path: init.path ?? '/admin',
		routeId: init.routeId ?? '/admin',
		admin: userId !== null,
		userId
	})
	return { event: event as unknown as ServerLoadEvent<never, never, never> & RequestEvent<never, never>, jar }
}

type Handler = (event: never) => unknown

export async function run(actions: Record<string, Handler>, name: string, init: EventInit) {
	const handler = actions[name]
	if (!handler) throw new Error(`No action named "${name}"`)
	return handler(adminEvent(init).event as never)
}

export const outcome = (result: unknown) =>
	isActionFailure(result) ? Object.assign({ status: result.status }, result.data) : result

export async function createAdmin(email = 'curator@example.com') {
	const passwordHash = await hashPassword('correct-horse-battery')
	const [user] = await db.insert(tables.users).values({ email, passwordHash }).returning()
	if (!user) throw new Error('No user inserted')
	return user
}

export async function seedCodex() {
	const creatures = await db
		.insert(tables.creatures)
		.values(CREATURES.map((creature) => ({ ...creature, imageKey: plateKey(creature.slug), publishedAt: new Date() })))
		.returning()
	const ids = new Map(creatures.map((creature) => [creature.slug, creature.id]))
	const themes = []
	for (const seed of THEMES) {
		const [theme] = await db
			.insert(tables.themes)
			.values({ month: seed.month, slug: seed.slug, title: seed.title, description: seed.description })
			.returning()
		if (!theme) throw new Error('No theme inserted')
		await db.insert(tables.themeCreatures).values(
			seed.members.map((member, index) => ({
				themeId: theme.id,
				creatureId: ids.get(member.slug) ?? '',
				position: index + 1,
				note: member.note
			}))
		)
		themes.push(theme)
	}
	const [settings] = await db.insert(tables.siteSettings).values(SETTINGS).returning()
	if (!settings) throw new Error('No settings inserted')
	const bySlug = (slug: string) => {
		const creature = creatures.find((row) => row.slug === slug)
		if (!creature) throw new Error(`No specimen ${slug}`)
		return creature
	}
	return { creatures, themes, settings, bySlug }
}

export function creatureForm(creature: typeof tables.creatures.$inferSelect, changes: Record<string, string> = {}) {
	return {
		slug: creature.slug,
		name: creature.name,
		territory: creature.territory,
		classification: creature.classification,
		kind: creature.kind,
		status: creature.status,
		abstract: creature.abstract,
		gloss: creature.gloss,
		etymology: creature.etymology,
		anatomy: creature.anatomy,
		ecology: creature.ecology,
		behavior: creature.behavior,
		mythology: creature.mythology,
		sources: JSON.stringify(creature.sources),
		...changes
	}
}
