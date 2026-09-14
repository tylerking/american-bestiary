import { and, desc, eq } from 'drizzle-orm'
import type { z } from 'zod'
import { creatureSchema, labelsSchema, settingsSchema, themeSchema } from '$lib/schemas'
import type { CreatureRow, Labels, Revision, RevisionEntity, ThemeSlot } from '$lib/types'
import { db } from './'
import { getSettings, getThemeById } from './queries'
import * as tables from './schema'
import { creatureSnapshot, settingsSnapshot, themeSnapshot } from './snapshots'

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0]
type CreatureInput = z.infer<typeof creatureSchema>
type ThemeInput = z.infer<typeof themeSchema>
type SettingsInput = z.infer<typeof settingsSchema> & { labels: Labels }

async function record(
	transaction: Transaction,
	entityType: RevisionEntity,
	entityId: string,
	snapshot: Record<string, unknown>,
	userId: number | null
) {
	await transaction.insert(tables.revisions).values({ entityType, entityId, snapshot, userId })
}

async function updateCreature(
	transaction: Transaction,
	id: string,
	data: Partial<typeof tables.creatures.$inferInsert>,
	userId: number | null
): Promise<CreatureRow | null> {
	const [row] = await transaction
		.update(tables.creatures)
		.set({ ...data, updatedAt: new Date() })
		.where(eq(tables.creatures.id, id))
		.returning()
	if (!row) return null
	await record(transaction, 'creature', id, creatureSnapshot(row), userId)
	return row
}

export const saveCreature = (id: string, data: CreatureInput, userId: number | null) =>
	db.transaction((transaction) => updateCreature(transaction, id, data, userId))

export const setPublished = (id: string, published: boolean, userId: number | null) =>
	db.transaction((transaction) =>
		updateCreature(transaction, id, { publishedAt: published ? new Date() : null }, userId)
	)

export const replacePlate = (id: string, imageKey: string, userId: number | null) =>
	db.transaction((transaction) => updateCreature(transaction, id, { imageKey }, userId))

async function writeTheme(
	transaction: Transaction,
	id: string,
	data: { slug: string; title: string; description: string; slots: ThemeSlot[] },
	userId: number | null
) {
	const [row] = await transaction
		.update(tables.themes)
		.set({ slug: data.slug, title: data.title, description: data.description, updatedAt: new Date() })
		.where(eq(tables.themes.id, id))
		.returning()
	if (!row) return null
	await transaction.delete(tables.themeCreatures).where(eq(tables.themeCreatures.themeId, id))
	await transaction.insert(tables.themeCreatures).values(data.slots.map((slot) => ({ ...slot, themeId: id })))
	await record(transaction, 'theme', id, themeSnapshot(row, data.slots), userId)
	return row
}

export const saveTheme = (id: string, data: ThemeInput, userId: number | null) =>
	db.transaction((transaction) => writeTheme(transaction, id, data, userId))

async function writeSettings(transaction: Transaction, data: SettingsInput, userId: number | null) {
	const [existing] = await transaction.select({ id: tables.siteSettings.id }).from(tables.siteSettings).limit(1)
	const values = { ...data, updatedAt: new Date() }
	const rows = existing
		? await transaction
				.update(tables.siteSettings)
				.set(values)
				.where(eq(tables.siteSettings.id, existing.id))
				.returning()
		: await transaction.insert(tables.siteSettings).values(values).returning()
	const row = rows[0] as (typeof rows)[number]
	await record(
		transaction,
		'settings',
		row.id,
		settingsSnapshot({ ...row, labels: labelsSchema.parse(row.labels) }),
		userId
	)
	return row
}

export const saveSettings = (data: SettingsInput, userId: number | null) =>
	db.transaction((transaction) => writeSettings(transaction, data, userId))

const revisionColumns = {
	id: tables.revisions.id,
	entityType: tables.revisions.entityType,
	entityId: tables.revisions.entityId,
	snapshot: tables.revisions.snapshot,
	createdAt: tables.revisions.createdAt,
	author: tables.users.email
}

export const listRevisions = (entityType: RevisionEntity, entityId: string): Promise<Revision[]> =>
	db
		.select(revisionColumns)
		.from(tables.revisions)
		.leftJoin(tables.users, eq(tables.users.id, tables.revisions.userId))
		.where(and(eq(tables.revisions.entityType, entityType), eq(tables.revisions.entityId, entityId)))
		.orderBy(desc(tables.revisions.createdAt), desc(tables.revisions.id))

export async function getRevision(id: string): Promise<Revision | null> {
	const [row] = await db
		.select(revisionColumns)
		.from(tables.revisions)
		.leftJoin(tables.users, eq(tables.users.id, tables.revisions.userId))
		.where(eq(tables.revisions.id, id))
		.limit(1)
	return row ?? null
}

const publishedAtOf = (value: unknown) => (typeof value === 'string' ? new Date(value) : null)

export async function restoreRevision(revision: Revision, userId: number | null): Promise<boolean> {
	const { entityType, entityId, snapshot } = revision
	return db.transaction(async (transaction) => {
		if (entityType === 'creature') {
			const data = creatureSchema.parse(snapshot)
			const row = await updateCreature(
				transaction,
				entityId,
				{ ...data, imageKey: String(snapshot.imageKey), publishedAt: publishedAtOf(snapshot.publishedAt) },
				userId
			)
			return row !== null
		}
		if (entityType === 'theme') {
			const slots = (snapshot.slots as ThemeSlot[]) ?? []
			const form = Object.fromEntries(
				slots.flatMap((slot) => [
					[`specimen${slot.position}`, slot.creatureId],
					[`note${slot.position}`, slot.note]
				])
			)
			const data = themeSchema.parse({ ...snapshot, ...form })
			return (await writeTheme(transaction, entityId, data, userId)) !== null
		}
		const data = settingsSchema.parse(snapshot)
		await writeSettings(transaction, { ...data, labels: labelsSchema.parse(snapshot.labels ?? {}) }, userId)
		return true
	})
}

export async function currentSnapshot(
	entityType: RevisionEntity,
	entityId: string
): Promise<Record<string, unknown> | null> {
	if (entityType === 'creature') {
		const [row] = await db.select().from(tables.creatures).where(eq(tables.creatures.id, entityId)).limit(1)
		return row ? creatureSnapshot(row) : null
	}
	if (entityType === 'theme') {
		const theme = await getThemeById(entityId)
		return theme ? themeSnapshot(theme, theme.slots) : null
	}
	const settings = await getSettings()
	return settings.id === entityId ? settingsSnapshot(settings) : null
}

export async function specimenNames(): Promise<Map<string, string>> {
	const rows = await db.select().from(tables.creatures)
	return new Map(rows.map((row) => [row.id, row.name]))
}
