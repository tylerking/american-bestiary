import { describe, expect, it } from 'vitest'
import { CENTRES } from './centres'

describe('CENTRES', () => {
	it.each([
		['Ohio', 786.1504719734855, 223.48634902486253],
		['Michigan', 734.5458997220472, 150.38076190032294],
		['Hawaii', 421.6042591494467, 523.2003299812386]
	] as const)('places the %s dot where the browser path sampling put it', (name, x, y) => {
		const [cx, cy] = CENTRES.get(name) ?? [Number.NaN, Number.NaN]
		expect(cx).toBeCloseTo(x, 2)
		expect(cy).toBeCloseTo(y, 2)
	})

	it('has a centre for every state on the map', () => {
		expect(CENTRES.size).toBe(51)
	})
})
