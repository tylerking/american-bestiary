import 'dotenv/config'
import { inArray } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import { labelsSchema } from '../src/lib/schemas'
import * as tables from '../src/lib/server/db/schema'
import { creatureSnapshot, settingsSnapshot, themeSnapshot } from '../src/lib/server/db/snapshots'
import { CREATURES } from './seed-content/creatures'
import { plateKey } from './seed-content/plates'
import { SETTINGS } from './seed-content/settings'
import { THEMES } from './seed-content/themes'

const url = process.env.DATABASE_URL
if (!url) throw new Error('Set DATABASE_URL to seed')

const host = new URL(url).hostname
if (!['localhost', '127.0.0.1', '[::1]'].includes(host) && !process.argv.includes('--force-production')) {
	throw new Error(`Refusing to overwrite content on ${host}. Pass --force-production to seed a remote database.`)
}

const pool = new pg.Pool({ connectionString: url })
const base = drizzle(pool, { schema: tables })
type Transaction = Parameters<Parameters<typeof base.transaction>[0]>[0]

async function main(db: Transaction) {
	await db.delete(tables.revisions).where(inArray(tables.revisions.entityType, ['creature', 'theme', 'settings']))
	await db.delete(tables.themeCreatures)
	await db.delete(tables.themes)
	await db.delete(tables.creatures)
	await db.delete(tables.siteSettings)

	const publishedAt = new Date()
	const creatures = await db
		.insert(tables.creatures)
		.values(CREATURES.map((creature) => ({ ...creature, imageKey: plateKey(creature.slug), publishedAt })))
		.returning()
	const ids = new Map(creatures.map((creature) => [creature.slug, creature.id]))

	const revisions: (typeof tables.revisions.$inferInsert)[] = creatures.map((creature) => ({
		entityType: 'creature',
		entityId: creature.id,
		snapshot: creatureSnapshot(creature)
	}))

	for (const seed of THEMES) {
		const [theme] = await db
			.insert(tables.themes)
			.values({ month: seed.month, slug: seed.slug, title: seed.title, description: seed.description })
			.returning()
		if (!theme) throw new Error(`Theme ${seed.slug} was not inserted`)
		const slots = seed.members.map((member, index) => {
			const creatureId = ids.get(member.slug)
			if (!creatureId) throw new Error(`Theme ${seed.slug} names unknown specimen ${member.slug}`)
			return { position: index + 1, creatureId, note: member.note }
		})
		await db.insert(tables.themeCreatures).values(slots.map((slot) => ({ ...slot, themeId: theme.id })))
		revisions.push({ entityType: 'theme', entityId: theme.id, snapshot: themeSnapshot(theme, slots) })
	}

	const [settings] = await db
		.insert(tables.siteSettings)
		.values({ ...SETTINGS, labels: labelsSchema.parse({}) })
		.returning()
	if (!settings) throw new Error('Settings were not inserted')
	revisions.push({
		entityType: 'settings',
		entityId: settings.id,
		snapshot: settingsSnapshot({ ...settings, labels: labelsSchema.parse(settings.labels) })
	})

	await db.insert(tables.revisions).values(revisions)
	console.log(`Seeded ${creatures.length} specimens and ${THEMES.length} themes.`)
}

base.transaction(main).finally(() => pool.end())
