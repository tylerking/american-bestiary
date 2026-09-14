import { describe, expect, it } from 'vitest'
import { ADMIN_NAVIGATION } from './navigation'

describe('the admin navigation', () => {
	const links = ADMIN_NAVIGATION.flatMap((group) => group.links)

	it('links only inside the admin', () => {
		expect(links.every((link) => link.href.startsWith('/admin'))).toBe(true)
	})

	it('gives every link a unique label and destination', () => {
		expect(new Set(links.map((link) => link.label)).size).toBe(links.length)
		expect(new Set(links.map((link) => link.href)).size).toBe(links.length)
	})

	it('covers the dashboard, specimens, themes, and globals', () => {
		expect(links.map((link) => link.href)).toEqual(['/admin', '/admin/specimens', '/admin/themes', '/admin/globals'])
	})
})
