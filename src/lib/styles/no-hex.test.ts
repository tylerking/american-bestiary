import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

const ROOT = new URL('../..', import.meta.url).pathname
const ALLOWED = new Set(['lib/styles/tokens.ts', 'error.html'])
const HEX = /#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})\b/gi

function files(directory: string): string[] {
	return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		const path = join(directory, entry.name)
		if (entry.isDirectory()) return files(path)
		return /\.(ts|svelte|html|css|js)$/.test(entry.name) && !/\.test\.ts$/.test(entry.name) ? [path] : []
	})
}

describe('colour literals', () => {
	it('appear only in tokens.ts and the static error page', () => {
		const offenders = files(ROOT).flatMap((path) => {
			const name = relative(ROOT, path)
			if (ALLOWED.has(name)) return []
			return (readFileSync(path, 'utf8').match(HEX) ?? []).map((hex) => `${name}: ${hex}`)
		})
		expect(offenders).toEqual([])
	})
})
