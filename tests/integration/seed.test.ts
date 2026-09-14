import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { db } from '$lib/server/db'
import * as tables from '$lib/server/db/schema'

describe('the seed', () => {
	it('fills an empty database with the full roster', { timeout: 60_000 }, async () => {
		const run = () =>
			execFileSync('pnpm', ['exec', 'tsx', 'scripts/seed.ts'], {
				stdio: 'pipe'
			})
		run()
		run()
		expect(await db.$count(tables.creatures)).toBe(50)
		expect(await db.$count(tables.themes)).toBe(12)
		expect(await db.$count(tables.themeCreatures)).toBe(48)
		expect(await db.$count(tables.siteSettings)).toBe(1)
		expect(await db.$count(tables.revisions)).toBe(63)
		const keys = (await db.select({ imageKey: tables.creatures.imageKey }).from(tables.creatures)).map(
			(row) => row.imageKey
		)
		expect(keys.every((key) => existsSync(`static/${key}`))).toBe(true)
		expect(keys).toContain('images/shunka-warak’in.png')
	})

	it('refuses a remote database without the production flag', () => {
		expect(() =>
			execFileSync('pnpm', ['exec', 'tsx', 'scripts/seed.ts'], {
				env: { ...process.env, DATABASE_URL: 'postgresql://user:pass@db.example.com:5432/bestiary' },
				stdio: 'pipe'
			})
		).toThrow(/Refusing to overwrite content on db\.example\.com/)
	})
})
