import { fireEvent, screen } from '@testing-library/svelte'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { EMPTY_QUERY } from '$lib/archive'
import ArchivePage from '$lib/components/pages/ArchivePage'
import { TERRITORIES } from '$lib/enums'
import { renderWithLabels } from '../helpers/labels'
import { summary } from '../helpers/specimens'

const replaceState = vi.hoisted(() => vi.fn())
vi.mock('$app/navigation', () => ({ replaceState }))
vi.mock('$app/state', () => ({ page: { url: new URL('http://localhost/archives'), state: {} } }))

afterEach(() => replaceState.mockReset())

const settings = {
	id: '',
	siteName: 'American Bestiary',
	tagline: '',
	seoDescription: 'Fifty cryptids.',
	incipit: '',
	footerText: '',
	creditLabel: '',
	creditName: '',
	creditUrl: '',
	labels: {} as never,
	updatedAt: new Date()
}

const specimens = [
	summary(),
	summary({ slug: 'jackalope', name: 'Jackalope', territory: 'Wyoming', kind: 'beast', status: 'hoax' }),
	summary({ slug: 'squonk', name: 'Squonk', territory: 'Pennsylvania', kind: 'beast', status: 'folkloric' })
]

const setup = (query = EMPTY_QUERY, list = specimens) =>
	renderWithLabels(ArchivePage, { settings, specimens: list, query })

describe('ArchivePage', () => {
	it('groups the specimens by kind and counts them', () => {
		setup()
		expect(screen.getByRole('heading', { level: 1, name: 'The Archive' })).toBeInTheDocument()
		expect(screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)).toEqual([
			'Beasts',
			'Birds'
		])
		expect(screen.getByText('3 specimens')).toBeInTheDocument()
		expect(screen.getByText('2 specimens')).toBeInTheDocument()
	})

	it('calls the full roster fifty specimens', () => {
		const roster = TERRITORIES.map((territory, index) => summary({ slug: `s-${index}`, name: `S ${index}`, territory }))
		setup(EMPTY_QUERY, roster)
		expect(screen.getByText('Fifty specimens')).toBeInTheDocument()
	})

	it('filters live as the search is typed and keeps the address in step', async () => {
		setup()
		await fireEvent.input(screen.getByRole('searchbox', { name: 'Search the archive' }), {
			target: { value: 'wyoming' }
		})
		expect(screen.getByRole('link', { name: /Jackalope/ })).toBeInTheDocument()
		expect(screen.queryByRole('link', { name: /Mothman/ })).toBeNull()
		expect(screen.getAllByText('1 specimen')).toHaveLength(2)
		expect(replaceState).toHaveBeenLastCalledWith('/archives?q=wyoming', {})
	})

	it('filters by territory and verdict', async () => {
		setup()
		await fireEvent.change(screen.getByRole('combobox', { name: 'Filter by territory' }), {
			target: { value: 'Pennsylvania' }
		})
		expect(replaceState).toHaveBeenLastCalledWith('/archives?territory=Pennsylvania', {})
		expect(screen.getByRole('link', { name: /Squonk/ })).toBeInTheDocument()
		await fireEvent.click(screen.getByRole('link', { name: 'Hoax' }))
		expect(screen.getByText(/Nothing in the archive answers to that/)).toBeInTheDocument()
		expect(screen.getByText('No specimens')).toBeInTheDocument()
		await fireEvent.click(screen.getByRole('link', { name: 'Birds' }))
		expect(replaceState).toHaveBeenLastCalledWith('/archives?territory=Pennsylvania&status=hoax&kind=bird', {})
	})

	it('starts from the query in the address', () => {
		setup({ ...EMPTY_QUERY, kind: 'bird' })
		expect(screen.getByRole('link', { name: 'Birds' })).toHaveAttribute('aria-current', 'true')
		expect(screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)).toEqual(['Birds'])
	})

	it('never lets the search form reload the page', async () => {
		const { container } = setup()
		const form = container.querySelector('form[role="search"]') as HTMLFormElement
		expect(await fireEvent.submit(form)).toBe(false)
	})
})
