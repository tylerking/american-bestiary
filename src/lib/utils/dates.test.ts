import { describe, expect, it } from 'vitest'
import { formatTimestamp, monthName } from './dates'

describe('admin time formatting', () => {
	it('formats a timestamp in UTC and says so', () => {
		expect(formatTimestamp(new Date(Date.UTC(2026, 8, 13, 23, 5)))).toMatch(/^Sep 13, 2026.*11:05\sPM UTC$/u)
	})

	it.each([
		[1, 'January'],
		[9, 'September'],
		[12, 'December']
	])('names month %i', (value, expected) => {
		expect(monthName(value)).toBe(expected)
	})
})
