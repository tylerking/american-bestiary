import { describe, expect, it } from 'vitest'
import { DEFAULT_LABELS } from './label-defaults'
import { groupLabel, kindLabel, rubricLabel, specimenCount, statusLabel } from './terms'

describe('terms', () => {
	it('names verdicts, kinds, groups and rubrics from the labels', () => {
		expect(statusLabel(DEFAULT_LABELS, 'misidentification')).toBe('Misidentification')
		expect(kindLabel(DEFAULT_LABELS, 'serpent')).toBe('Serpents')
		expect(groupLabel(DEFAULT_LABELS, 'serpent')).toBe('Serpents and water beasts')
		expect(rubricLabel(DEFAULT_LABELS, 'etymology')).toBe('Etymology')
	})

	it('counts specimens in words', () => {
		expect(specimenCount(DEFAULT_LABELS, 0)).toBe('No specimens')
		expect(specimenCount(DEFAULT_LABELS, 1)).toBe('1 specimen')
		expect(specimenCount(DEFAULT_LABELS, 12)).toBe('12 specimens')
	})
})
