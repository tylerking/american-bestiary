import { eq } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'
import { DEFAULT_LABELS } from '$lib/labels/label-defaults'
import { creatureSchema, themeSchema } from '$lib/schemas'
import { db } from '$lib/server/db'
import {
	currentSnapshot,
	getRevision,
	listRevisions,
	replacePlate,
	restoreRevision,
	saveCreature,
	saveSettings,
	saveTheme,
	setPublished,
	specimenNames
} from '$lib/server/db/content'
import * as tables from '$lib/server/db/schema'
import { unique } from '$lib/server/http/forms'
import { outcome } from '../helpers/actions'
import { createUser, creatureValues, insertCreature, insertTheme, onlyRow } from '../helpers/factories'
import { themeForm } from '../helpers/themes'

const MISSING = '00000000-0000-4000-8000-000000000000'

const edit = (overrides: Record<string, unknown> = {}) => creatureSchema.parse({ ...creatureValues(), ...overrides })

const settings = {
	siteName: 'American Bestiary',
	tagline: 'Fifty cryptids.',
	seoDescription: '',
	incipit: 'Each entry.',
	footerText: '',
	creditLabel: '',
	creditName: '',
	creditUrl: '',
	labels: DEFAULT_LABELS
}

describe('specimens', () => {
	it('saves an edit and records who made it', async () => {
		const user = await createUser()
		const creature = await insertCreature()
		const saved = await saveCreature(creature.id, edit({ name: 'Jackalope, horned' }), user.id)
		expect(saved?.name).toBe('Jackalope, horned')
		expect(saved?.updatedAt.getTime()).toBeGreaterThanOrEqual(creature.updatedAt.getTime())
		const [revision] = await listRevisions('creature', creature.id)
		expect(revision).toMatchObject({ entityType: 'creature', author: 'admin@example.com' })
		expect(revision?.snapshot).toMatchObject({ name: 'Jackalope, horned', imageKey: 'images/jackalope.png' })
	})

	it('writes nothing for a specimen that does not exist', async () => {
		expect(await saveCreature(MISSING, edit(), null)).toBeNull()
		expect(await db.$count(tables.revisions)).toBe(0)
	})

	it('publishes, unpublishes and replaces the plate, each as a revision', async () => {
		const creature = await insertCreature({ publishedAt: null })
		expect((await setPublished(creature.id, true, null))?.publishedAt).toBeInstanceOf(Date)
		expect((await setPublished(creature.id, false, null))?.publishedAt).toBeNull()
		expect((await replacePlate(creature.id, 'new-plate.png', null))?.imageKey).toBe('new-plate.png')
		const history = await listRevisions('creature', creature.id)
		expect(history).toHaveLength(3)
		expect(history[0]?.snapshot).toMatchObject({ imageKey: 'new-plate.png', publishedAt: null })
		expect(history[0]?.author).toBeNull()
	})

	it('refuses a second specimen for the same territory', async () => {
		await insertCreature()
		const other = await insertCreature({ slug: 'bigfoot', name: 'Bigfoot', territory: 'Washington' })
		expect(outcome(await unique(() => saveCreature(other.id, edit({ slug: 'bigfoot' }), null)))).toMatchObject({
			status: 400,
			field: 'territory'
		})
	})

	it('restores an earlier revision as a new revision', async () => {
		const creature = await insertCreature()
		await saveCreature(creature.id, edit({ gloss: 'First gloss.' }), null)
		await saveCreature(creature.id, edit({ gloss: 'Second gloss.' }), null)
		const history = await listRevisions('creature', creature.id)
		const first = history.at(-1)
		expect(first?.snapshot.gloss).toBe('First gloss.')
		expect(await restoreRevision(first as NonNullable<typeof first>, null)).toBe(true)
		const row = onlyRow(await db.select().from(tables.creatures).where(eq(tables.creatures.id, creature.id)))
		expect(row.gloss).toBe('First gloss.')
		expect(await listRevisions('creature', creature.id)).toHaveLength(3)
	})

	it('reports a restore whose specimen has gone', async () => {
		const creature = await insertCreature()
		await saveCreature(creature.id, edit(), null)
		const [revision] = await listRevisions('creature', creature.id)
		await db.delete(tables.creatures)
		expect(await restoreRevision(revision as NonNullable<typeof revision>, null)).toBe(false)
	})
})

describe('themes', () => {
	const form = (ids: string[], overrides: Record<string, string> = {}) => themeSchema.parse(themeForm(ids, overrides))

	async function four() {
		return Promise.all(
			['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California'].map((territory, index) =>
				insertCreature({ slug: `specimen-${index}`, name: `Specimen ${index}`, territory })
			)
		)
	}

	it('replaces all four slots and records the theme', async () => {
		const creatures = await four()
		const ids = creatures.map((creature) => creature.id)
		const theme = await insertTheme(ids.slice(0, 4))
		await saveTheme(theme.id, form([ids[4], ids[3], ids[2], ids[1]] as string[], { note1: 'Changed' }), null)
		const slots = await db.select().from(tables.themeCreatures).where(eq(tables.themeCreatures.themeId, theme.id))
		expect(
			slots.sort((left, right) => left.position - right.position).map((slot) => [slot.creatureId, slot.note])
		).toEqual([
			[ids[4], 'Changed'],
			[ids[3], 'Note 2'],
			[ids[2], 'Note 3'],
			[ids[1], 'Note 4']
		])
		const [revision] = await listRevisions('theme', theme.id)
		expect(revision?.snapshot).toMatchObject({ slug: 'the-winged', month: 1, slots: expect.any(Array) })
	})

	it('writes nothing for a theme that does not exist', async () => {
		const ids = (await four()).map((creature) => creature.id)
		expect(await saveTheme(MISSING, form(ids.slice(0, 4)), null)).toBeNull()
		expect(await db.$count(tables.themeCreatures)).toBe(0)
	})

	it('restores an earlier line-up', async () => {
		const ids = (await four()).map((creature) => creature.id)
		const theme = await insertTheme(ids.slice(0, 4))
		await saveTheme(theme.id, form(ids.slice(0, 4), { title: 'Before' }), null)
		await saveTheme(theme.id, form(ids.slice(1, 5), { title: 'After' }), null)
		const before = (await listRevisions('theme', theme.id)).at(-1)
		expect(await restoreRevision(before as NonNullable<typeof before>, null)).toBe(true)
		const row = onlyRow(await db.select().from(tables.themes).where(eq(tables.themes.id, theme.id)))
		expect(row.title).toBe('Before')
		expect((await db.select().from(tables.themeCreatures)).map((slot) => slot.creatureId).sort()).toEqual(
			ids.slice(0, 4).sort()
		)
	})
})

describe('settings', () => {
	it('inserts once, then updates the same row, recording both', async () => {
		const first = await saveSettings(settings, null)
		const second = await saveSettings({ ...settings, tagline: 'Changed.' }, null)
		expect(second.id).toBe(first.id)
		expect(await db.$count(tables.siteSettings)).toBe(1)
		const history = await listRevisions('settings', first.id)
		expect(history.map((revision) => revision.snapshot.tagline)).toEqual(['Changed.', 'Fifty cryptids.'])
	})

	it('restores earlier settings and labels', async () => {
		const row = await saveSettings({ ...settings, labels: { ...DEFAULT_LABELS, search: 'Find' } }, null)
		await saveSettings({ ...settings, tagline: 'Later.' }, null)
		const earliest = (await listRevisions('settings', row.id)).at(-1)
		expect(await restoreRevision(earliest as NonNullable<typeof earliest>, null)).toBe(true)
		const restored = onlyRow(await db.select().from(tables.siteSettings))
		expect(restored.tagline).toBe('Fifty cryptids.')
		expect(restored.labels).toMatchObject({ search: 'Find' })
	})

	it('fetches one revision by id, or nothing', async () => {
		const row = await saveSettings(settings, null)
		const [revision] = await listRevisions('settings', row.id)
		expect(await getRevision(revision?.id ?? '')).toMatchObject({ entityId: row.id })
		expect(await getRevision(MISSING)).toBeNull()
	})
})

describe('current state for comparison', () => {
	it('snapshots the live specimen, theme and settings, or nothing when they are gone', async () => {
		const creature = await insertCreature()
		expect(await currentSnapshot('creature', creature.id)).toMatchObject({
			slug: 'jackalope',
			publishedAt: expect.any(String)
		})
		expect(await currentSnapshot('creature', MISSING)).toBeNull()
		const theme = await insertTheme([creature.id])
		expect(await currentSnapshot('theme', theme.id)).toMatchObject({
			slots: [{ position: 1, creatureId: creature.id }]
		})
		expect(await currentSnapshot('theme', MISSING)).toBeNull()
		const row = await saveSettings(settings, null)
		expect(await currentSnapshot('settings', row.id)).toMatchObject({ tagline: 'Fifty cryptids.' })
		expect(await currentSnapshot('settings', MISSING)).toBeNull()
	})

	it('names every specimen for the diff', async () => {
		const creature = await insertCreature()
		const other = await insertCreature({ slug: 'mothman', name: 'Mothman', territory: 'West Virginia', kind: 'bird' })
		expect(await specimenNames()).toEqual(
			new Map([
				[creature.id, 'Jackalope'],
				[other.id, 'Mothman']
			])
		)
	})
})
