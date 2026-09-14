import { fireEvent, render, screen } from '@testing-library/svelte'
import { describe, expect, it, vi } from 'vitest'
import FilterRow from '$lib/components/elements/FilterRow'

const options = [
	{ value: 'all', label: 'All statuses' },
	{ value: 'hoax', label: 'Hoax' }
]

const setup = () => {
	const onselect = vi.fn()
	render(FilterRow, {
		props: {
			label: 'Status',
			name: 'status',
			options,
			current: 'all',
			spacing: 'status',
			search: (value: string) => (value === 'all' ? '' : `?status=${value}`),
			onselect
		}
	})
	return onselect
}

describe('FilterRow', () => {
	it('groups the options under their label and marks the current one', () => {
		setup()
		const group = screen.getByRole('group', { name: 'Status' })
		expect(group).toBeInTheDocument()
		expect(screen.getByRole('link', { name: 'All statuses' })).toHaveAttribute('aria-current', 'true')
		expect(screen.getByRole('link', { name: 'Hoax' })).not.toHaveAttribute('aria-current')
	})

	it('links each option so it works without scripts', () => {
		setup()
		expect(screen.getByRole('link', { name: 'All statuses' })).toHaveAttribute('href', '?')
		expect(screen.getByRole('link', { name: 'Hoax' })).toHaveAttribute('href', '?status=hoax')
	})

	it('filters in place on a plain click but lets a modified click open a tab', async () => {
		const onselect = setup()
		const hoax = screen.getByRole('link', { name: 'Hoax' })
		expect(await fireEvent.click(hoax)).toBe(false)
		expect(onselect).toHaveBeenCalledWith('hoax')
		onselect.mockClear()
		expect(await fireEvent.click(hoax, { ctrlKey: true })).toBe(true)
		expect(onselect).not.toHaveBeenCalled()
	})
})
