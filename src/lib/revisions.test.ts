import { describe, expect, it } from 'vitest'
import { diffSnapshots } from './revisions'

describe('diffSnapshots', () => {
	it('lists only the fields that changed, blanks for missing and null', () => {
		expect(
			diffSnapshots({ name: 'Mothman', slug: null, same: 'x' }, { name: 'Moth Man', gloss: 'new', same: 'x' })
		).toEqual([
			{ field: 'name', before: 'Mothman', after: 'Moth Man' },
			{ field: 'gloss', before: '', after: 'new' }
		])
	})

	it('names each source by its position', () => {
		expect(
			diffSnapshots(
				{ sources: [{ url: 'https://a.example', oldid: 1 }] },
				{
					sources: [
						{ url: 'https://a.example', oldid: 2 },
						{ url: 'https://b.example', oldid: null }
					]
				}
			)
		).toEqual(
			[
				{ field: 'source 1 revision', before: '1', after: '2' },
				{ field: 'source 2 url', before: '', after: 'https://b.example' },
				{ field: 'source 2 revision', before: '', after: '' }
			].filter((change) => change.before !== change.after)
		)
	})

	it('expands theme slots by position and names the specimen when it can', () => {
		const names = new Map([['a', 'Mothman']])
		expect(
			diffSnapshots(
				{ slots: [{ position: 1, creatureId: 'a', note: 'old' }] },
				{ slots: [{ position: 1, creatureId: 'b', note: 'new' }] },
				names
			)
		).toEqual([
			{ field: 'slot 1 specimen', before: 'Mothman', after: 'b' },
			{ field: 'slot 1 note', before: 'old', after: 'new' }
		])
	})

	it('expands labels key by key and serialises any other object', () => {
		expect(
			diffSnapshots({ labels: { search: 'Search' }, extra: { a: 1 } }, { labels: { search: 'Find' }, extra: { a: 2 } })
		).toEqual([
			{ field: 'label search', before: 'Search', after: 'Find' },
			{ field: 'extra', before: '{"a":1}', after: '{"a":2}' }
		])
	})
})
