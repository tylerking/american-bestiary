import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { umber, vellum, vermilion } from './tokens'

const page = readFileSync(new URL('../../error.html', import.meta.url), 'utf8')

const block = (selector: string) => {
	const start = page.indexOf(`${selector} {`)
	expect(start).toBeGreaterThan(-1)
	return page.slice(start, page.indexOf('}', start))
}

describe('the static error page', () => {
	it.each([
		[':root', vellum[100], umber[850], vellum[300], vermilion[700]],
		['@media (prefers-color-scheme: dark)', umber[850], vellum[100], umber[500], vermilion[400]]
	])('%s repeats the theme roles', (selector, ground, ink, rule, accent) => {
		const rules = block(selector)
		expect(rules).toContain(`--vellum: ${ground};`)
		expect(rules).toContain(`--ink: ${ink};`)
		expect(rules).toContain(`--rule: ${rule};`)
		expect(rules).toContain(`--vermilion: ${accent};`)
	})

	it.each([
		['light', vellum[300]],
		['dark', umber[950]]
	])('colours the %s browser chrome with the surround', (scheme, surround) => {
		expect(page).toContain(
			`<meta name='theme-color' content='${surround}' media='(prefers-color-scheme: ${scheme})' />`
		)
	})
})
