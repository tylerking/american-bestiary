import { describe, expect, it } from 'vitest'
import { DEFAULT_LABELS } from '$lib/labels/label-defaults'
import {
	currentMonth,
	getCodex,
	getEntry,
	getMonthlyTheme,
	getPublishedCodex,
	getSettings,
	getSpecimenById,
	getThemes,
	listSpecimens,
	summarize
} from '$lib/server/db/queries'
import { insertCreature, insertSettings, insertTheme } from '../helpers/factories'

async function roster() {
	const squonk = await insertCreature({ slug: 'squonk', name: 'Squonk', territory: 'Pennsylvania', kind: 'beast' })
	const chupacabra = await insertCreature({
		slug: 'chupacabra',
		name: 'Chupacabra',
		territory: 'Texas',
		kind: 'beast',
		status: 'hoax'
	})
	const mothman = await insertCreature({ slug: 'mothman', name: 'Mothman', territory: 'West Virginia', kind: 'bird' })
	const hidden = await insertCreature({
		slug: 'champy',
		name: 'Champy',
		territory: 'New York',
		kind: 'serpent',
		publishedAt: null
	})
	const wendigo = await insertCreature({ slug: 'wendigo', name: 'Wendigo', territory: 'Minnesota', kind: 'other' })
	return { squonk, chupacabra, mothman, hidden, wendigo }
}

describe('settings', () => {
	it('fall back to defaults before anything is saved', async () => {
		const settings = await getSettings()
		expect(settings.siteName).toBe('American Bestiary')
		expect(settings.labels).toEqual(DEFAULT_LABELS)
	})

	it('complete saved labels with the defaults', async () => {
		await insertSettings({ tagline: 'Fifty.', labels: { search: 'Find' } })
		const settings = await getSettings()
		expect(settings.tagline).toBe('Fifty.')
		expect(settings.labels.search).toBe('Find')
		expect(settings.labels.archiveTitle).toBe(DEFAULT_LABELS.archiveTitle)
	})
})

describe('the codex', () => {
	it('orders every specimen by kind and name, published or not', async () => {
		await roster()
		expect((await getCodex()).map((entry) => entry.slug)).toEqual([
			'chupacabra',
			'squonk',
			'mothman',
			'champy',
			'wendigo'
		])
		const published = await getPublishedCodex()
		expect(published.map((entry) => entry.slug)).toEqual(['chupacabra', 'squonk', 'mothman', 'wendigo'])
		expect(published[0]).not.toHaveProperty('createdAt')
	})

	it('finds a published entry with neighbours that wrap and skip unpublished specimens', async () => {
		await roster()
		const entry = await getEntry('mothman')
		expect(entry?.specimen).toMatchObject({ slug: 'mothman' })
		expect(entry?.neighbours.previous.slug).toBe('squonk')
		expect(entry?.neighbours.next.slug).toBe('wendigo')
		expect((await getEntry('wendigo'))?.neighbours.next.slug).toBe('chupacabra')
		expect((await getEntry('chupacabra'))?.neighbours.previous.slug).toBe('wendigo')
	})

	it('hides an unpublished entry unless asked, and has nothing for an unknown slug', async () => {
		await roster()
		expect(await getEntry('champy')).toBeNull()
		const preview = await getEntry('champy', { includeUnpublished: true })
		expect(preview?.specimen.slug).toBe('champy')
		expect(preview?.neighbours).toMatchObject({ previous: { slug: 'mothman' }, next: { slug: 'wendigo' } })
		expect(await getEntry('bigfoot')).toBeNull()
	})

	it('summarises only the public fields', async () => {
		await roster()
		const [first] = await getCodex()
		expect(Object.keys(summarize(first as NonNullable<typeof first>)).sort()).toEqual(
			['abstract', 'classification', 'gloss', 'imageKey', 'kind', 'name', 'slug', 'status', 'territory'].sort()
		)
	})

	it('looks a specimen up by id', async () => {
		const { mothman } = await roster()
		expect((await getSpecimenById(mothman.id))?.slug).toBe('mothman')
		expect(await getSpecimenById('00000000-0000-4000-8000-000000000000')).toBeNull()
	})
})

describe('listSpecimens', () => {
	it('filters published specimens and pages through them', async () => {
		await roster()
		expect(await listSpecimens({ limit: 50, page: 1 })).toMatchObject({ total: 4 })
		expect((await listSpecimens({ kind: 'beast', limit: 50, page: 1 })).data.map((entry) => entry.slug)).toEqual([
			'chupacabra',
			'squonk'
		])
		expect((await listSpecimens({ status: 'hoax', limit: 50, page: 1 })).total).toBe(1)
		expect((await listSpecimens({ territory: 'New York', limit: 50, page: 1 })).total).toBe(0)
		const second = await listSpecimens({ limit: 2, page: 2 })
		expect(second.total).toBe(4)
		expect(second.data.map((entry) => entry.slug)).toEqual(['mothman', 'wendigo'])
	})
})

describe('themes', () => {
	it('uses the UTC month', () => {
		expect(currentMonth(new Date('2026-01-31T23:30:00-05:00'))).toBe(2)
		expect(currentMonth()).toBe(new Date().getUTCMonth() + 1)
	})

	it('returns the month theme in slot order without unpublished members', async () => {
		const { mothman, hidden, squonk } = await roster()
		await insertTheme([squonk.id, hidden.id, mothman.id], { month: 7 })
		const theme = await getMonthlyTheme(7)
		expect(theme).toMatchObject({ slug: 'theme', month: 7 })
		expect(theme?.members.map((member) => [member.position, member.slug, member.note])).toEqual([
			[1, 'squonk', 'Note 1'],
			[3, 'mothman', 'Note 3']
		])
		expect(await getMonthlyTheme(8)).toBeNull()
	})

	it('lists every theme by month with its slots', async () => {
		const { mothman, squonk } = await roster()
		await insertTheme([mothman.id], { month: 5, slug: 'may' })
		await insertTheme([squonk.id, mothman.id], { month: 2, slug: 'february' })
		const themes = await getThemes()
		expect(themes.map((theme) => [theme.slug, theme.slots.length])).toEqual([
			['february', 2],
			['may', 1]
		])
		expect(themes[0]?.slots[1]).toEqual({ position: 2, creatureId: mothman.id, note: 'Note 2' })
	})
})
