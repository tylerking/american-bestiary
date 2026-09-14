import { describe, expect, it } from 'vitest'
import { palette } from './theme.css'

const channel = (value: number) => {
	const scaled = value / 255
	return scaled <= 0.04045 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4
}

const luminance = (hex: string) => {
	const [r, g, b] = [1, 3, 5].map((start) => channel(Number.parseInt(hex.slice(start, start + 2), 16)))
	return 0.2126 * (r ?? 0) + 0.7152 * (g ?? 0) + 0.0722 * (b ?? 0)
}

const contrast = (one: string, two: string) => {
	const [light, dark] = [luminance(one), luminance(two)].sort((left, right) => right - left)
	return ((light ?? 0) + 0.05) / ((dark ?? 0) + 0.05)
}

type Role = keyof (typeof palette)['light']

const TEXT: [Role, Role][] = [
	['ink', 'vellum'],
	['vermilion', 'vellum'],
	['faint', 'vellum'],
	['plateVermilion', 'plateMat'],
	['onVermilion', 'vermilion']
]

const GRAPHICS: [Role, Role][] = [
	['mapLine', 'landmass'],
	['vermilion', 'landmass'],
	['dotFill', 'landmass'],
	['gold', 'vellum']
]

describe.each(Object.entries(palette))('the %s palette', (_mode, roles) => {
	it.each(TEXT)('keeps %s text on %s at 4.5:1 or more', (foreground, background) => {
		expect(contrast(roles[foreground], roles[background])).toBeGreaterThanOrEqual(4.5)
	})

	it.each(GRAPHICS)('keeps %s against %s at 3:1 or more', (foreground, background) => {
		expect(contrast(roles[foreground], roles[background])).toBeGreaterThanOrEqual(3)
	})

	it('draws focus and hover rings that stand out from every map fill', () => {
		for (const fill of [roles.landmass, roles.landmassHover, roles.vermilion]) {
			expect(Math.max(contrast(roles.vellum, fill), contrast(roles.ink, fill))).toBeGreaterThanOrEqual(3)
		}
		expect(contrast(roles.ink, roles.vellum)).toBeGreaterThanOrEqual(3)
	})
})
