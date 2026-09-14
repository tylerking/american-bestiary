export type Point = readonly [number, number]

export type Direction = 'left' | 'right' | 'up' | 'down'

type Segment = readonly [from: Point, to: Point, length: number]

export function areaCentroid(points: readonly Point[]): Point {
	let area = 0
	let x = 0
	let y = 0
	for (const [index, [x0, y0]] of points.entries()) {
		const [x1, y1] = points[(index + 1) % points.length] as Point
		const cross = x0 * y1 - x1 * y0
		area += cross
		x += (x0 + x1) * cross
		y += (y0 + y1) * cross
	}
	area /= 2
	if (area !== 0) return [x / (6 * area), y / (6 * area)]
	const count = points.length || 1
	return [
		points.reduce((sum, point) => sum + point[0], 0) / count,
		points.reduce((sum, point) => sum + point[1], 0) / count
	]
}

function segments(d: string): Segment[] {
	const tokens = d.match(/[MmLlZz]|-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/g) ?? []
	const result: Segment[] = []
	let command = 'M'
	let current: Point = [0, 0]
	let start: Point = [0, 0]
	const line = (to: Point) => {
		result.push([current, to, Math.hypot(to[0] - current[0], to[1] - current[1])])
		current = to
	}
	for (let index = 0; index < tokens.length; ) {
		const token = tokens[index] as string
		if (/[a-z]/i.test(token)) {
			command = token
			index += 1
			if (command === 'z' || command === 'Z') line(start)
			continue
		}
		const x = Number(token)
		const y = Number(tokens[index + 1])
		index += 2
		const relative = command === command.toLowerCase()
		const to: Point = relative ? [current[0] + x, current[1] + y] : [x, y]
		if (command === 'm' || command === 'M') {
			current = to
			start = to
			command = relative ? 'l' : 'L'
		} else {
			line(to)
		}
	}
	return result
}

export function samplePathData(d: string, samples: number): Point[] {
	const parts = segments(d)
	const total = parts.reduce((sum, [, , length]) => sum + length, 0)
	const points: Point[] = []
	let walked = 0
	let part = 0
	for (let index = 0; index < samples && parts.length > 0; index++) {
		const target = (total * index) / samples
		while (part < parts.length - 1 && walked + (parts[part] as Segment)[2] < target) {
			walked += (parts[part] as Segment)[2]
			part += 1
		}
		const [[x0, y0], [x1, y1], length] = parts[part] as Segment
		const along = length > 0 ? Math.min(1, (target - walked) / length) : 0
		points.push([x0 + (x1 - x0) * along, y0 + (y1 - y0) * along])
	}
	return points
}

const AXES: Record<Direction, Point> = { left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] }

export function nearestInDirection(
	points: readonly (readonly [string, Point])[],
	from: string,
	direction: Direction
): string | null {
	const origin = points.find(([name]) => name === from)?.[1]
	if (!origin) return null
	const [axisX, axisY] = AXES[direction]
	let best: string | null = null
	let bestScore = Number.POSITIVE_INFINITY
	for (const [name, [x, y]] of points) {
		const dx = x - origin[0]
		const dy = y - origin[1]
		const along = dx * axisX + dy * axisY
		if (name === from || along <= 0) continue
		const score = along + 2 * Math.abs(dx * axisY - dy * axisX)
		if (score < bestScore) {
			best = name
			bestScore = score
		}
	}
	return best
}
