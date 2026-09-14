import { describe, expect, it } from 'vitest'
import { isUniqueViolation, violatedConstraint } from './errors'

describe('postgres errors', () => {
	it.each([
		[{ code: '23505' }, true],
		[{ cause: { code: '23505' } }, true],
		[{ code: '23503' }, false],
		[new Error('plain'), false],
		['23505', false],
		[null, false]
	])('%o is a unique violation: %s', (error, expected) => {
		expect(isUniqueViolation(error)).toBe(expected)
	})

	it('finds the violated constraint however deeply it is wrapped', () => {
		expect(violatedConstraint({ cause: { code: '23505', constraint: 'creatures_territory_unique' } })).toBe(
			'creatures_territory_unique'
		)
		expect(violatedConstraint(new Error('plain'))).toBeUndefined()
	})
})
