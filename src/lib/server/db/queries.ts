import { asc, eq } from 'drizzle-orm'
import { codexOrder, neighbours, SITE_NAME } from '$lib/codex'
import { labelsSchema } from '$lib/schemas'
import type {
	Kind,
	MonthlyTheme,
	SiteSettings,
	Specimen,
	SpecimenNeighbours,
	SpecimenSummary,
	Status,
	Territory,
	ThemeWithSlots
} from '$lib/types'
import { db } from './'
import * as tables from './schema'

const defaultSettings = (): SiteSettings => ({
	id: '',
	siteName: SITE_NAME,
	tagline: '',
	seoDescription: '',
	incipit: '',
	footerText: '',
	creditLabel: '',
	creditName: '',
	creditUrl: '',
	labels: labelsSchema.parse({}),
	updatedAt: new Date(0)
})

export async function getSettings(): Promise<SiteSettings> {
	const [row] = await db.select().from(tables.siteSettings).limit(1)
	if (!row) return defaultSettings()
	return { ...row, labels: labelsSchema.parse(row.labels ?? {}) }
}

const isPublished = (specimen: Pick<Specimen, 'publishedAt'>) => specimen.publishedAt !== null

export const summarize = (specimen: Specimen): SpecimenSummary => ({
	slug: specimen.slug,
	name: specimen.name,
	territory: specimen.territory,
	classification: specimen.classification,
	kind: specimen.kind,
	status: specimen.status,
	abstract: specimen.abstract,
	gloss: specimen.gloss,
	imageKey: specimen.imageKey
})

export async function getCodex(): Promise<Specimen[]> {
	const rows = await db.select().from(tables.creatures)
	return codexOrder(rows).map(({ createdAt: _createdAt, ...specimen }) => specimen)
}

export async function getPublishedCodex(): Promise<Specimen[]> {
	return (await getCodex()).filter(isPublished)
}

export async function getEntry(
	slug: string,
	{ includeUnpublished = false } = {}
): Promise<{ specimen: Specimen; neighbours: SpecimenNeighbours } | null> {
	const codex = await getCodex()
	const specimen = codex.find((entry) => entry.slug === slug)
	if (!specimen || (!includeUnpublished && !isPublished(specimen))) return null
	const around = neighbours(
		codex.filter((entry) => isPublished(entry) || entry.slug === slug),
		slug
	)
	return around
		? { specimen, neighbours: { previous: summarize(around.previous), next: summarize(around.next) } }
		: null
}

export const currentMonth = (now = new Date()) => now.getUTCMonth() + 1

export async function getMonthlyTheme(
	month = currentMonth(),
	published?: Promise<Specimen[]>
): Promise<MonthlyTheme | null> {
	const [theme] = await db.select().from(tables.themes).where(eq(tables.themes.month, month)).limit(1)
	if (!theme) return null
	const [slots, codex] = await Promise.all([
		db
			.select()
			.from(tables.themeCreatures)
			.where(eq(tables.themeCreatures.themeId, theme.id))
			.orderBy(asc(tables.themeCreatures.position)),
		published ?? getCodex()
	])
	const members = slots.flatMap((slot) => {
		const specimen = codex.find((entry) => entry.id === slot.creatureId)
		return specimen && isPublished(specimen)
			? [{ ...summarize(specimen), position: slot.position, note: slot.note }]
			: []
	})
	return { slug: theme.slug, title: theme.title, description: theme.description, month: theme.month, members }
}

export interface SpecimenFilters {
	kind?: Kind
	status?: Status
	territory?: Territory
	limit: number
	page: number
}

export async function listSpecimens(filters: SpecimenFilters): Promise<{ data: Specimen[]; total: number }> {
	const matching = (await getPublishedCodex()).filter(
		(specimen) =>
			(!filters.kind || specimen.kind === filters.kind) &&
			(!filters.status || specimen.status === filters.status) &&
			(!filters.territory || specimen.territory === filters.territory)
	)
	const start = (filters.page - 1) * filters.limit
	return { data: matching.slice(start, start + filters.limit), total: matching.length }
}

export async function getThemes(): Promise<ThemeWithSlots[]> {
	const [themes, slots] = await Promise.all([
		db.select().from(tables.themes).orderBy(asc(tables.themes.month)),
		db.select().from(tables.themeCreatures).orderBy(asc(tables.themeCreatures.position))
	])
	return themes.map((theme) => ({
		...theme,
		slots: slots
			.filter((slot) => slot.themeId === theme.id)
			.map(({ position, creatureId, note }) => ({ position, creatureId, note }))
	}))
}

export async function getSpecimenById(id: string): Promise<Specimen | null> {
	return (await getCodex()).find((specimen) => specimen.id === id) ?? null
}

export async function getThemeById(id: string): Promise<ThemeWithSlots | null> {
	const [[theme], slots] = await Promise.all([
		db.select().from(tables.themes).where(eq(tables.themes.id, id)).limit(1),
		db
			.select({
				position: tables.themeCreatures.position,
				creatureId: tables.themeCreatures.creatureId,
				note: tables.themeCreatures.note
			})
			.from(tables.themeCreatures)
			.where(eq(tables.themeCreatures.themeId, id))
			.orderBy(asc(tables.themeCreatures.position))
	])
	return theme ? { ...theme, slots } : null
}
