import { describe, expect, it } from 'vitest'
import { summary } from '../../tests/helpers/specimens'
import { archiveSearch, EMPTY_QUERY, filterArchive, groupByKind } from './archive'
import { DEFAULT_LABELS } from './labels/label-defaults'

const specimens = [
	summary(),
	summary({ slug: 'jackalope', name: 'Jackalope', territory: 'Wyoming', kind: 'beast', status: 'hoax' }),
	summary({
		slug: 'champy',
		name: 'Champy',
		territory: 'New York',
		kind: 'serpent',
		classification: 'Sea Serpent',
		status: 'unexplained'
	})
]
const run = (changes: Partial<typeof EMPTY_QUERY>) =>
	filterArchive(specimens, { ...EMPTY_QUERY, ...changes }, DEFAULT_LABELS).map((entry) => entry.slug)

describe('filterArchive', () => {
	it('returns everything for the empty query', () => {
		expect(run({})).toEqual(['mothman', 'jackalope', 'champy'])
	})

	it('filters by status, kind and territory together', () => {
		expect(run({ status: 'hoax' })).toEqual(['jackalope'])
		expect(run({ kind: 'serpent' })).toEqual(['champy'])
		expect(run({ territory: 'West Virginia' })).toEqual(['mothman'])
		expect(run({ kind: 'beast', status: 'unexplained' })).toEqual([])
	})

	it('searches name, territory, classification, kind and verdict, ignoring case and padding', () => {
		expect(run({ q: '  MOTH ' })).toEqual(['mothman'])
		expect(run({ q: 'wyoming' })).toEqual(['jackalope'])
		expect(run({ q: 'sea serpent' })).toEqual(['champy'])
		expect(run({ q: 'serpents' })).toEqual(['champy'])
		expect(run({ q: 'birds' })).toEqual(['mothman'])
		expect(run({ q: 'hoax' })).toEqual(['jackalope'])
		expect(run({ q: 'nothing like it' })).toEqual([])
	})
})

describe('groupByKind', () => {
	it('keeps codex kind order and drops empty kinds', () => {
		expect(groupByKind(specimens).map((group) => [group.kind, group.items.length])).toEqual([
			['beast', 1],
			['bird', 1],
			['serpent', 1]
		])
		expect(groupByKind([])).toEqual([])
	})
})

describe('archiveSearch', () => {
	it('writes only what differs from the defaults', () => {
		expect(archiveSearch(EMPTY_QUERY)).toBe('')
		expect(archiveSearch(EMPTY_QUERY, { status: 'hoax', q: 'moth man' })).toBe('?q=moth+man&status=hoax')
		expect(archiveSearch({ ...EMPTY_QUERY, kind: 'bird', territory: 'Ohio' }, { kind: 'all' })).toBe('?territory=Ohio')
	})
})
