import type { z } from 'zod'
import type {
	eventTypeSchema,
	kindSchema,
	labelsSchema,
	revisionEntitySchema,
	sourceSchema,
	statusSchema,
	territorySchema,
	userRoleSchema
} from '$lib/schemas'
import type * as tables from '$lib/server/db/schema'

export type Kind = z.infer<typeof kindSchema>
export type Status = z.infer<typeof statusSchema>
export type Territory = z.infer<typeof territorySchema>
export type RevisionEntity = z.infer<typeof revisionEntitySchema>
export type EventType = z.infer<typeof eventTypeSchema>
export type UserRole = z.infer<typeof userRoleSchema>
export type Labels = z.infer<typeof labelsSchema>
export type Source = z.infer<typeof sourceSchema>

export type CreatureRow = typeof tables.creatures.$inferSelect
export type ThemeRow = typeof tables.themes.$inferSelect
export type SiteSettings = Omit<typeof tables.siteSettings.$inferSelect, 'labels'> & { labels: Labels }

export type Specimen = Omit<CreatureRow, 'createdAt'>

export type SpecimenSummary = Pick<
	Specimen,
	'slug' | 'name' | 'territory' | 'classification' | 'kind' | 'status' | 'abstract' | 'gloss' | 'imageKey'
>

interface ThemeMember extends SpecimenSummary {
	position: number
	note: string
}

export interface MonthlyTheme {
	slug: string
	title: string
	description: string
	month: number
	members: ThemeMember[]
}

export interface ThemeSlot {
	position: number
	creatureId: string
	note: string
}

export type ThemeWithSlots = ThemeRow & { slots: ThemeSlot[] }

export interface SpecimenNeighbours {
	previous: SpecimenSummary
	next: SpecimenSummary
}

export interface Revision {
	id: string
	entityType: RevisionEntity
	entityId: string
	snapshot: Record<string, unknown>
	createdAt: Date
	author: string | null
}

export interface FieldChange {
	field: string
	before: string
	after: string
}

export interface Analytics {
	stats: {
		visitsLast30Days: number
		visitsLast7Days: number
		outboundLast30Days: number
		entryViewsLast30Days: number
	}
	visitsByWeek: { week: string; counts: Record<string, number> }[]
	topEntries: { path: string; title: string; views: number }[]
	referrers: { host: string; views: number }[]
	outbound: { host: string; clicks: number }[]
}
