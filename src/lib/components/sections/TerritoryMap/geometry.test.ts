import { describe, expect, it } from 'vitest'
import { areaCentroid, nearestInDirection, samplePathData } from './geometry'

describe('areaCentroid', () => {
	it('finds the middle of a square in either winding', () => {
		expect(
			areaCentroid([
				[0, 0],
				[4, 0],
				[4, 4],
				[0, 4]
			])
		).toEqual([2, 2])
		expect(
			areaCentroid([
				[0, 4],
				[4, 4],
				[4, 0],
				[0, 0]
			])
		).toEqual([2, 2])
	})

	it('stays on the bulk of a shape with a long thin panhandle', () => {
		const panhandle = [
			[0, 0],
			[10, 0],
			[10, 10],
			[1, 10],
			[1, 40],
			[0, 40]
		] as const
		const [, y] = areaCentroid(panhandle)
		const average = panhandle.reduce((sum, point) => sum + point[1], 0) / panhandle.length
		expect(y).toBeLessThan(average)
	})

	it('falls back to the plain average for a shape with no area, and the origin for none', () => {
		expect(
			areaCentroid([
				[0, 0],
				[2, 2],
				[4, 4]
			])
		).toEqual([2, 2])
		expect(areaCentroid([])).toEqual([0, 0])
	})
})

describe('samplePathData', () => {
	it('samples evenly along the outline, closing each ring', () => {
		expect(samplePathData('M0 0L4 0L4 4L0 4z', 4)).toEqual([
			[0, 0],
			[4, 0],
			[4, 4],
			[0, 4]
		])
	})

	it('reads relative moves and lines and skips the jump between rings', () => {
		expect(samplePathData('m0 0l4 0z m10 10l4 0', 6)).toEqual([
			[0, 0],
			[2, 0],
			[4, 0],
			[2, 0],
			[0, 0],
			[12, 10]
		])
	})

	it('returns nothing for an empty path', () => {
		expect(samplePathData('', 4)).toEqual([])
	})
})

describe('nearestInDirection', () => {
	const grid = [
		['centre', [10, 10]],
		['east', [20, 11]],
		['far east', [40, 10]],
		['north east', [18, 2]],
		['west', [0, 10]],
		['south', [10, 20]]
	] as const

	it.each([
		['right', 'east'],
		['left', 'west'],
		['up', 'north east'],
		['down', 'south']
	] as const)('moves %s to the closest state that way, preferring the straightest line', (direction, expected) => {
		expect(nearestInDirection(grid, 'centre', direction)).toBe(expected)
	})

	it('stays put at the edge and for an unknown start', () => {
		expect(nearestInDirection(grid, 'far east', 'right')).toBeNull()
		expect(nearestInDirection(grid, 'atlantis', 'left')).toBeNull()
	})
})
