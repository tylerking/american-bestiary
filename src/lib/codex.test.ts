import { describe, expect, it } from 'vitest'
import {
	altText,
	codexOrder,
	describeClassification,
	fill,
	neighbours,
	revisionUrl,
	sourceHost,
	sourceLink,
	territoryFromSlug,
	territorySlug
} from './codex'
import { DEFAULT_LABELS } from './labels/label-defaults'

describe('codexOrder', () => {
	const rows = [
		{ name: 'Wendigo', kind: 'other' as const },
		{ name: 'Mothman', kind: 'bird' as const },
		{ name: 'Squonk', kind: 'beast' as const },
		{ name: 'Champy', kind: 'serpent' as const },
		{ name: 'Bigfoot', kind: 'humanoid' as const },
		{ name: 'Chupacabra', kind: 'beast' as const }
	]

	it('orders by kind, then by name, without touching the input', () => {
		expect(codexOrder(rows).map((row) => row.name)).toEqual([
			'Chupacabra',
			'Squonk',
			'Mothman',
			'Champy',
			'Bigfoot',
			'Wendigo'
		])
		expect(rows[0]?.name).toBe('Wendigo')
	})
})

describe('neighbours', () => {
	const rows = [{ slug: 'a' }, { slug: 'b' }, { slug: 'c' }]

	it('wraps around both ends', () => {
		expect(neighbours(rows, 'a')).toEqual({ previous: { slug: 'c' }, next: { slug: 'b' } })
		expect(neighbours(rows, 'c')).toEqual({ previous: { slug: 'b' }, next: { slug: 'a' } })
	})

	it('has none for an unknown slug or an empty codex', () => {
		expect(neighbours(rows, 'z')).toBeNull()
		expect(neighbours([], 'a')).toBeNull()
	})
})

describe('sources', () => {
	it('reads the host without www and tolerates bad input', () => {
		expect(sourceHost('https://www.oregonlive.com/story')).toBe('oregonlive.com')
		expect(sourceHost('https://en.wikipedia.org/wiki/Mothman')).toBe('en.wikipedia.org')
		expect(sourceHost('not a url')).toBeNull()
		expect(sourceHost(null)).toBeNull()
	})

	it('links a source by host, to its permanent revision when it has one', () => {
		expect(sourceLink({ url: 'https://en.wikipedia.org/wiki/Mothman', oldid: 42 })).toEqual({
			host: 'en.wikipedia.org',
			href: 'https://en.wikipedia.org/w/index.php?oldid=42'
		})
		expect(sourceLink({ url: 'https://www.oregonlive.com/story', oldid: null })).toEqual({
			host: 'oregonlive.com',
			href: 'https://www.oregonlive.com/story'
		})
		expect(sourceLink({ url: 'not a url', oldid: null })).toBeNull()
	})

	it('links a revision on the same wiki', () => {
		expect(revisionUrl('https://en.wikipedia.org/w/index.php?title=Mothman&oldid=1', 42)).toBe(
			'https://en.wikipedia.org/w/index.php?oldid=42'
		)
	})
})

describe('fill', () => {
	it('replaces known placeholders and leaves unknown ones visible', () => {
		expect(fill('{name} illustration, {missing}', { name: 'Mothman' })).toBe('Mothman illustration, {missing}')
	})
})

describe('alt text', () => {
	it('turns a classification into prose', () => {
		expect(describeClassification('Terrestrial Mammal / Equine.')).toBe('terrestrial mammal and equine')
		expect(describeClassification('Hominid')).toBe('hominid')
	})

	it('describes the plate with the right article', () => {
		const base = { name: 'Mothman', territory: 'West Virginia' }
		expect(altText(DEFAULT_LABELS.altText, { ...base, classification: 'Flying Cryptid / Avian' })).toBe(
			'The Mothman, drawn as a flying cryptid and avian said to live in West Virginia.'
		)
		expect(altText(DEFAULT_LABELS.altText, { ...base, classification: 'Extraterrestrial' })).toContain(
			'drawn as an extraterrestrial'
		)
	})
})

describe('territory slugs', () => {
	it('round-trips every state name', () => {
		expect(territorySlug('West Virginia')).toBe('west-virginia')
		expect(territoryFromSlug('west-virginia')).toBe('West Virginia')
		expect(territoryFromSlug('district-of-columbia')).toBeNull()
		expect(territoryFromSlug(null)).toBeNull()
	})
})
