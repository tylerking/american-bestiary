import { describe, expect, it } from 'vitest'
import { SORT_COLUMNS, sortSpecimens } from './sort'

const rows = [
	{
		position: 1,
		name: 'Squonk',
		territory: 'Pennsylvania',
		status: 'folkloric' as const,
		publishedAt: new Date('2026-01-01'),
		updatedAt: new Date('2026-03-01')
	},
	{
		position: 2,
		name: 'Chessie',
		territory: 'Maryland',
		status: 'misidentification' as const,
		publishedAt: null,
		updatedAt: new Date('2026-01-01')
	},
	{
		position: 3,
		name: 'Momo',
		territory: 'Missouri',
		status: 'hoax' as const,
		publishedAt: new Date('2026-01-01'),
		updatedAt: new Date('2026-02-01')
	}
]

const names = (column: (typeof SORT_COLUMNS)[number], descending = false) =>
	sortSpecimens(rows, column, descending).map((row) => row.name)

describe('sortSpecimens', () => {
	it('offers every sortable column', () => {
		expect(SORT_COLUMNS).toEqual(['name', 'territory', 'status', 'published', 'updated'])
	})

	it.each([
		['name', ['Chessie', 'Momo', 'Squonk']],
		['territory', ['Chessie', 'Momo', 'Squonk']],
		['status', ['Squonk', 'Momo', 'Chessie']],
		['published', ['Chessie', 'Squonk', 'Momo']],
		['updated', ['Chessie', 'Momo', 'Squonk']]
	] as const)('sorts by %s ascending', (column, expected) => {
		expect(names(column)).toEqual(expected)
	})

	it('reverses the order when descending', () => {
		expect(names('name', true)).toEqual(['Squonk', 'Momo', 'Chessie'])
	})

	it('breaks ties by codex position in either direction', () => {
		expect(names('published', true)).toEqual(['Squonk', 'Momo', 'Chessie'])
	})

	it('leaves the input untouched', () => {
		sortSpecimens(rows, 'name', false)
		expect(rows.map((row) => row.position)).toEqual([1, 2, 3])
	})
})
