import { screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'
import EntryMargin from '$lib/components/sections/EntryMargin'
import { renderWithLabels } from '../helpers/labels'
import { specimen } from '../helpers/specimens'

describe('EntryMargin', () => {
	it('gives the verdict, kind and territory', () => {
		renderWithLabels(EntryMargin, { specimen: specimen() })
		expect(screen.getByText('Misidentification')).toBeInTheDocument()
		expect(screen.getByText('Birds')).toBeInTheDocument()
		expect(screen.getByText('West Virginia')).toBeInTheDocument()
	})

	it('links a Wikipedia source to its permanent revision in a new tab', () => {
		renderWithLabels(EntryMargin, { specimen: specimen() })
		const link = screen.getByRole('link', { name: /^en\.wikipedia\.org/ })
		expect(link.textContent).toBe('en.wikipedia.org (opens in new tab)')
		expect(link).toHaveAttribute('href', 'https://en.wikipedia.org/w/index.php?oldid=1347926662')
		expect(link).toHaveAttribute('target', '_blank')
		expect(link).toHaveAttribute('rel', 'noopener noreferrer')
		expect(screen.getByText('Sources')).toBeInTheDocument()
		expect(screen.queryByText(/revision/i)).toBeNull()
	})

	it('lists every source under the Sources note', () => {
		renderWithLabels(EntryMargin, {
			specimen: specimen({
				sources: [
					{ url: 'https://en.wikipedia.org/wiki/Mothman', oldid: 1347926662 },
					{ url: 'https://www.oregonlive.com/story', oldid: null },
					{ url: 'not a url', oldid: null }
				]
			})
		})
		expect(screen.getByText('Sources')).toBeInTheDocument()
		expect(screen.getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual([
			'https://en.wikipedia.org/w/index.php?oldid=1347926662',
			'https://www.oregonlive.com/story'
		])
	})

	it('leaves out the source note when there is no source', () => {
		renderWithLabels(EntryMargin, { specimen: specimen({ sources: [] }) })
		expect(screen.queryByText('Source')).toBeNull()
		expect(screen.queryByText('Sources')).toBeNull()
	})
})
