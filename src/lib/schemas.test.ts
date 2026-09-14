import { describe, expect, it } from 'vitest'
import { themeForm } from '../../tests/helpers/themes'
import { DEFAULT_LABELS } from './labels/label-defaults'
import {
	apiListSchema,
	archiveQuerySchema,
	beaconSchema,
	creatureSchema,
	labelsSchema,
	loginSchema,
	settingsSchema,
	themeSchema
} from './schemas'

const creature = {
	slug: 'mothman',
	name: 'Mothman',
	territory: 'West Virginia',
	classification: 'Flying Cryptid / Avian',
	kind: 'bird',
	status: 'misidentification',
	abstract: 'A.',
	gloss: 'G.',
	etymology: 'E.',
	anatomy: 'A.',
	ecology: 'E.',
	behavior: 'B.',
	mythology: 'M.',
	sources: [{ url: 'https://en.wikipedia.org/wiki/Mothman', oldid: '1347926662' }]
}

const ids = ['a', 'b', 'c', 'd'].map((letter) => `0000000${letter}-0000-4000-8000-000000000000`)
const theme = themeForm(ids)

describe('creatureSchema', () => {
	it('coerces each revision id and keeps every source', () => {
		const second = { url: 'https://www.oregonlive.com/story', oldid: '' }
		expect(creatureSchema.parse({ ...creature, sources: [...creature.sources, second] }).sources).toEqual([
			{ url: 'https://en.wikipedia.org/wiki/Mothman', oldid: 1347926662 },
			{ url: 'https://www.oregonlive.com/story', oldid: null }
		])
	})

	it('reads source rows sent as JSON and drops rows left blank', () => {
		const rows = JSON.stringify([{ url: '', oldid: '' }, { url: 'https://example.org/a', oldid: '7' }, { url: ' ' }])
		expect(creatureSchema.parse({ ...creature, sources: rows }).sources).toEqual([
			{ url: 'https://example.org/a', oldid: 7 }
		])
		expect(creatureSchema.parse({ ...creature, sources: undefined }).sources).toEqual([])
	})

	it.each([
		['a state outside the fifty', { territory: 'District of Columbia' }, ['territory']],
		['an unknown kind', { kind: 'fish' }, ['kind']],
		['a slug with spaces', { slug: 'moth man' }, ['slug']],
		['a non-http source', { sources: [{ url: 'ftp://example.org', oldid: '' }] }, ['sources', 0, 'url']],
		['a revision without a source', { sources: [{ url: '', oldid: '12' }] }, ['sources', 0, 'url']],
		['a fractional revision', { sources: [{ url: 'https://example.org', oldid: '1.5' }] }, ['sources', 0, 'oldid']],
		['unreadable source rows', { sources: '{nope' }, ['sources']],
		['an empty rubric', { mythology: '   ' }, ['mythology']]
	])('refuses %s', (_case, changes, path) => {
		const result = creatureSchema.safeParse({ ...creature, ...changes })
		expect(result.success).toBe(false)
		expect(result.error?.issues[0]?.path).toEqual(path)
	})
})

describe('themeSchema', () => {
	it('gathers four ordered slots', () => {
		expect(themeSchema.parse(theme).slots).toEqual(
			ids.map((creatureId, index) => ({ position: index + 1, creatureId, note: `Note ${index + 1}` }))
		)
	})

	it('refuses the same specimen twice and a slot without a specimen', () => {
		expect(themeSchema.safeParse({ ...theme, specimen2: ids[0] }).error?.issues[0]?.message).toBe(
			'appears twice in this theme'
		)
		expect(themeSchema.safeParse({ ...theme, specimen3: '' }).error?.issues[0]?.path).toEqual(['specimen3'])
	})
})

describe('labels and settings', () => {
	it('fills every missing label with its default and trims overrides', () => {
		expect(labelsSchema.parse({})).toEqual(DEFAULT_LABELS)
		expect(labelsSchema.parse({ search: '  Find  ' }).search).toBe('Find')
		expect(labelsSchema.safeParse({ search: 'x'.repeat(31) }).success).toBe(false)
	})

	it('accepts site paths and web links for the credit, nothing else', () => {
		const settings = {
			siteName: 'A',
			tagline: 'B',
			seoDescription: '',
			incipit: 'C',
			footerText: '',
			creditLabel: '',
			creditName: ''
		}
		expect(settingsSchema.safeParse({ ...settings, creditUrl: 'https://tavomontanez.art' }).success).toBe(true)
		expect(settingsSchema.safeParse({ ...settings, creditUrl: '/credits' }).success).toBe(true)
		expect(settingsSchema.safeParse({ ...settings, creditUrl: '' }).success).toBe(true)
		expect(settingsSchema.safeParse({ ...settings, creditUrl: 'javascript:alert(1)' }).success).toBe(false)
		expect(settingsSchema.safeParse({ ...settings, creditUrl: '//evil.example' }).success).toBe(false)
	})
})

describe('loginSchema and beaconSchema', () => {
	it('normalises the email', () => {
		expect(loginSchema.parse({ email: ' Ada@Example.COM ', password: 'x' }).email).toBe('ada@example.com')
		expect(loginSchema.safeParse({ email: 'ada@example.com' }).error?.issues[0]?.message).toBe('is required')
	})

	it('requires site paths for pageviews and web links for outbound clicks', () => {
		expect(beaconSchema.safeParse({ type: 'pageview', path: '/archives' }).success).toBe(true)
		expect(beaconSchema.safeParse({ type: 'outbound', path: 'https://example.org' }).success).toBe(true)
		expect(beaconSchema.safeParse({ type: 'outbound', path: '/archives' }).success).toBe(false)
		expect(beaconSchema.safeParse({ type: 'resume', path: '/' }).success).toBe(false)
	})
})

describe('query schemas', () => {
	it('reads API filters, matching the territory case-insensitively', () => {
		expect(apiListSchema.parse({})).toEqual({ limit: 50, page: 1 })
		expect(
			apiListSchema.parse({ kind: 'bird', status: '', territory: 'west VIRGINIA', limit: '5', page: '2' })
		).toEqual({
			kind: 'bird',
			territory: 'West Virginia',
			limit: 5,
			page: 2
		})
		expect(apiListSchema.safeParse({ territory: 'Atlantis' }).success).toBe(false)
		expect(apiListSchema.safeParse({ limit: '51' }).success).toBe(false)
	})

	it('forgives every bad archive parameter', () => {
		expect(archiveQuerySchema.parse({ q: ' moth ', territory: 'Nowhere', status: 'lies', kind: 'bird' })).toEqual({
			q: 'moth',
			territory: '',
			status: 'all',
			kind: 'bird'
		})
		expect(archiveQuerySchema.parse({})).toEqual({ q: '', territory: '', status: 'all', kind: 'all' })
	})
})
