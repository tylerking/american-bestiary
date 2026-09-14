import { creatureSchema, settingsSchema } from '../../schemas'
import type { CreatureRow, SiteSettings, ThemeRow, ThemeSlot } from '../../types'

export const CREATURE_FIELDS = [...creatureSchema.keyof().options, 'imageKey'] as const

export const SETTINGS_FIELDS = [...settingsSchema.keyof().options, 'labels'] as const

export function creatureSnapshot(row: CreatureRow): Record<string, unknown> {
	return {
		...Object.fromEntries(CREATURE_FIELDS.map((field) => [field, row[field]])),
		publishedAt: row.publishedAt ? row.publishedAt.toISOString() : null
	}
}

export function themeSnapshot(row: ThemeRow, slots: ThemeSlot[]): Record<string, unknown> {
	return {
		slug: row.slug,
		title: row.title,
		description: row.description,
		month: row.month,
		slots: [...slots]
			.sort((left, right) => left.position - right.position)
			.map(({ position, creatureId, note }) => ({ position, creatureId, note }))
	}
}

export function settingsSnapshot(row: Pick<SiteSettings, (typeof SETTINGS_FIELDS)[number]>): Record<string, unknown> {
	return Object.fromEntries(SETTINGS_FIELDS.map((field) => [field, row[field]]))
}
