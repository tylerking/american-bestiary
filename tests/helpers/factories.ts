import { hashPassword } from '$lib/server/auth/password'
import { SESSION_COOKIE, startSession } from '$lib/server/auth/sessions'
import { db } from '$lib/server/db'
import * as tables from '$lib/server/db/schema'
import { cookieJar } from './cookies'

export const PASSWORD = 'correct-horse-battery'

export function onlyRow<Row>(rows: Row[]): Row {
	const [row] = rows
	if (!row) throw new Error('Expected a row')
	return row
}

const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0])
export const pngFile = (name = 'image.png') => new File([PNG], name, { type: 'image/png' })

export async function createUser(email = 'admin@example.com', password = PASSWORD) {
	const passwordHash = await hashPassword(password)
	return onlyRow(await db.insert(tables.users).values({ email, passwordHash }).returning())
}

export async function signedIn(userId?: number) {
	const id = userId ?? (await createUser()).id
	const { cookies, jar } = cookieJar()
	await startSession(cookies, id)
	const token = jar.get(SESSION_COOKIE)?.value
	if (!token) throw new Error('No session cookie was set')
	return { userId: id, token, cookies: { [SESSION_COOKIE]: token } }
}

export const creatureValues = (
	overrides: Partial<typeof tables.creatures.$inferInsert> = {}
): typeof tables.creatures.$inferInsert => ({
	slug: 'jackalope',
	name: 'Jackalope',
	territory: 'Wyoming',
	classification: 'Terrestrial Mammal / Lagomorph',
	kind: 'beast',
	status: 'misidentification',
	abstract: 'A rabbit with antlers.',
	gloss: 'Taxidermy, mostly.',
	etymology: 'Jackrabbit and antelope.',
	anatomy: 'Antlers.',
	ecology: 'Wyoming.',
	behavior: 'Sings along.',
	mythology: 'Douglas, 1930s.',
	sources: [{ url: 'https://en.wikipedia.org/w/index.php?title=Jackalope&oldid=1', oldid: 1 }],
	imageKey: 'images/jackalope.png',
	publishedAt: new Date(),
	...overrides
})

export const insertCreature = async (overrides: Partial<typeof tables.creatures.$inferInsert> = {}) =>
	onlyRow(await db.insert(tables.creatures).values(creatureValues(overrides)).returning())

export async function insertTheme(creatureIds: string[], overrides: Partial<typeof tables.themes.$inferInsert> = {}) {
	const theme = onlyRow(
		await db
			.insert(tables.themes)
			.values({ slug: 'theme', title: 'Theme', description: 'About.', month: 1, ...overrides })
			.returning()
	)
	if (creatureIds.length) {
		await db.insert(tables.themeCreatures).values(
			creatureIds.map((creatureId, index) => ({
				themeId: theme.id,
				creatureId,
				position: index + 1,
				note: `Note ${index + 1}`
			}))
		)
	}
	return theme
}

export const insertSettings = async (overrides: Partial<typeof tables.siteSettings.$inferInsert> = {}) =>
	onlyRow(
		await db
			.insert(tables.siteSettings)
			.values({ siteName: 'American Bestiary', tagline: 'Fifty.', incipit: 'Each entry.', ...overrides })
			.returning()
	)
