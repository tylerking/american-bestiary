import { fireEvent, screen } from '@testing-library/svelte'
import { describe, expect, it, vi } from 'vitest'
import TerritoryMap from '$lib/components/sections/TerritoryMap'
import { renderWithLabels } from '../helpers/labels'

const setup = (selected = 'West Virginia') => {
	const onselect = vi.fn()
	const result = renderWithLabels(TerritoryMap, {
		territories: ['Ohio', 'West Virginia'],
		selected,
		onselect
	})
	return { onselect, ...result }
}

describe('TerritoryMap', () => {
	it('draws every state but makes only the recorded ones controls', () => {
		const { container } = setup()
		expect(container.querySelectorAll('path[data-state]')).toHaveLength(51)
		expect(screen.getAllByRole('button').map((path) => path.getAttribute('aria-label'))).toEqual([
			'Ohio',
			'West Virginia'
		])
		const capital = container.querySelector('path[data-state="District of Columbia"]')
		expect(capital).not.toHaveAttribute('role')
		expect(capital).not.toHaveAttribute('tabindex')
	})

	it('marks the selection and places a dot at each recorded state', () => {
		const { container } = setup()
		expect(screen.getByRole('button', { name: 'West Virginia' })).toHaveAttribute('aria-pressed', 'true')
		expect(screen.getByRole('button', { name: 'Ohio' })).toHaveAttribute('aria-pressed', 'false')
		const dots = [...container.querySelectorAll('circle[data-dot]')]
		expect(dots.map((dot) => [dot.getAttribute('data-dot'), dot.getAttribute('r')])).toEqual([
			['Ohio', '3.6'],
			['West Virginia', '7']
		])
		expect(Number(dots[0]?.getAttribute('cx'))).toBeCloseTo(786.15, 1)
		expect(Number(dots[0]?.getAttribute('cy'))).toBeCloseTo(223.49, 1)
	})

	it('is a single tab stop on the selection, with Home and End jumping to the first and last territory', async () => {
		setup()
		const [ohio, westVirginia] = screen.getAllByRole('button')
		expect(westVirginia).toHaveAttribute('tabindex', '0')
		expect(ohio).toHaveAttribute('tabindex', '-1')
		westVirginia?.focus()
		await fireEvent.keyDown(westVirginia as Element, { key: 'Home' })
		expect(document.activeElement).toBe(ohio)
		expect(ohio).toHaveAttribute('tabindex', '0')
		await fireEvent.keyDown(ohio as Element, { key: 'End' })
		expect(document.activeElement).toBe(westVirginia)
		await fireEvent.keyDown(westVirginia as Element, { key: 'ArrowRight' })
		expect(document.activeElement).toBe(westVirginia)
	})

	it('rings the focused state only when the keyboard put it there', async () => {
		const { container } = setup()
		const ohio = screen.getByRole('button', { name: 'Ohio' })
		await fireEvent.pointerDown(window)
		await fireEvent.focus(ohio)
		expect(container.querySelector('[data-focus-ring]')).toBeNull()
		await fireEvent.keyDown(window, { key: 'Tab' })
		await fireEvent.focus(ohio)
		expect(container.querySelector('[data-focus-ring="Ohio"]')).not.toBeNull()
		await fireEvent.blur(ohio)
		expect(container.querySelector('[data-focus-ring]')).toBeNull()
	})

	it('offers a territory picker that chooses the same way', async () => {
		const { onselect } = setup()
		const picker = screen.getByRole('combobox', { name: 'Territory' })
		expect(picker).toHaveValue('West Virginia')
		await fireEvent.change(picker, { target: { value: 'Ohio' } })
		expect(onselect).toHaveBeenCalledWith('Ohio')
	})

	it('selects with a click, Enter or Space, and ignores other keys', async () => {
		const { onselect } = setup()
		const ohio = screen.getByRole('button', { name: 'Ohio' })
		await fireEvent.click(ohio)
		await fireEvent.keyDown(ohio, { key: 'Enter' })
		await fireEvent.keyDown(ohio, { key: ' ' })
		await fireEvent.keyDown(ohio, { key: 'Tab' })
		expect(onselect.mock.calls).toEqual([['Ohio'], ['Ohio'], ['Ohio']])
	})

	it('names the state under the pointer and beside a focused dot, then clears', async () => {
		const { container } = setup()
		const ohio = screen.getByRole('button', { name: 'Ohio' })
		await fireEvent.mouseMove(ohio, { clientX: 30, clientY: 40 })
		const tooltip = () => container.querySelector('[aria-hidden="true"][style]')
		expect(tooltip()).toHaveTextContent('Ohio')
		expect(tooltip()).toHaveStyle({ left: '42px', top: '52px' })
		expect(container.querySelector('circle[data-dot="Ohio"]')).toHaveAttribute('r', '6')
		expect(container.querySelector('[data-hover-ring="Ohio"]')).not.toBeNull()
		await fireEvent.mouseLeave(ohio)
		expect(tooltip()).toBeNull()
		expect(container.querySelector('[data-hover-ring]')).toBeNull()
		await fireEvent.focus(ohio)
		expect(tooltip()).toHaveTextContent('Ohio')
		await fireEvent.blur(ohio)
		expect(tooltip()).toBeNull()
	})
})
