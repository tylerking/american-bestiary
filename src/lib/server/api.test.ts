import { describe, expect, it } from 'vitest'
import { specimen, summary } from '../../../tests/helpers/specimens'
import { API_HEADERS, apiError, publicSpecimen, publicSummary, publicTheme } from './api'

const ORIGIN = 'https://bestiary.example'

describe('public API shapes', () => {
	it('links the plate and the entry absolutely', () => {
		expect(publicSummary(summary(), ORIGIN)).toMatchObject({
			slug: 'mothman',
			image: `${ORIGIN}/images/mothman.png`,
			url: `${ORIGIN}/creatures/mothman`
		})
	})

	it('carries the rubrics, the sources and the update time, never internal columns', () => {
		const shaped = publicSpecimen(specimen(), ORIGIN)
		expect(shaped.sections).toEqual({
			etymology: 'The press.',
			anatomy: 'Wings.',
			ecology: 'Point Pleasant.',
			behavior: 'Chases cars.',
			mythology: 'Silver Bridge.'
		})
		expect(shaped.sources).toEqual([
			{
				url: 'https://en.wikipedia.org/w/index.php?title=Mothman&oldid=1347926662',
				host: 'en.wikipedia.org',
				oldid: 1347926662
			}
		])
		expect(shaped.updatedAt).toBe('2026-09-02T00:00:00.000Z')
		expect(shaped).not.toHaveProperty('id')
		expect(shaped).not.toHaveProperty('number')
		expect(shaped).not.toHaveProperty('imageKey')
		expect(shaped).not.toHaveProperty('publishedAt')
	})

	it('lists every readable source and leaves out the rest', () => {
		expect(publicSpecimen(specimen({ sources: [] }), ORIGIN).sources).toEqual([])
		const sources = [
			{ url: 'nonsense', oldid: null },
			{ url: 'https://www.oregonlive.com/story', oldid: null }
		]
		expect(publicSpecimen(specimen({ sources }), ORIGIN).sources).toEqual([
			{ url: 'https://www.oregonlive.com/story', host: 'oregonlive.com', oldid: null }
		])
	})

	it('lists theme members with their slot and note', () => {
		const theme = publicTheme(
			{
				slug: 'the-winged',
				title: 'The winged',
				description: 'Air.',
				month: 7,
				members: [{ ...summary(), position: 2, note: 'Eyeshine.' }]
			},
			ORIGIN
		)
		expect(theme.members).toEqual([expect.objectContaining({ slug: 'mothman', position: 2, note: 'Eyeshine.' })])
	})

	it('answers errors uncached and readable from any origin', async () => {
		const response = apiError(404, 'nope')
		expect(response.status).toBe(404)
		expect(await response.json()).toEqual({ error: 'nope' })
		expect(response.headers.get('cache-control')).toBe('no-store')
		expect(API_HEADERS['access-control-allow-origin']).toBe('*')
	})
})
