import { eq } from 'drizzle-orm'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { clientKey } from '$lib/server/auth/rate-limit'
import { db } from '$lib/server/db'
import * as tables from '$lib/server/db/schema'
import { env } from '$lib/server/env'
import { actions as login } from '../../src/routes/admin/login/+page.server'
import { actions as specimenEditor } from '../../src/routes/admin/specimens/[id]/+page.server'
import { load as revisionLoad } from '../../src/routes/admin/specimens/[id]/revisions/[revisionId]/+page.server'
import { pngFile } from '../helpers/factories'
import { adminEvent, createAdmin, creatureForm, outcome, run, seedCodex, thrown } from './admin-helpers'

vi.mock('$lib/server/media/blobs', async (original) => ({
	...(await original<object>()),
	storeUpload: vi.fn(async () => ({ key: 'replacement-plate.png' }))
}))

const MISSING = '00000000-0000-4000-8000-000000000000'
const EDITOR = '/admin/specimens/[id]'

afterEach(() => {
	vi.restoreAllMocks()
})

describe('specimen editor actions on a specimen that does not exist', () => {
	it.each(['publish', 'unpublish', 'replacePlate'])('%s answers 404', async (name) => {
		const admin = await createAdmin()
		const error = await thrown(() =>
			run(specimenEditor, name, { params: { id: MISSING }, routeId: EDITOR, userId: admin.id, form: {} })
		)
		expect(error).toMatchObject({ status: 404 })
	})

	it('save answers 404 for a valid form', async () => {
		const admin = await createAdmin()
		const { bySlug } = await seedCodex()
		const error = await thrown(() =>
			run(specimenEditor, 'save', {
				params: { id: MISSING },
				routeId: EDITOR,
				userId: admin.id,
				form: creatureForm(bySlug('mothman'))
			})
		)
		expect(error).toMatchObject({ status: 404 })
	})

	it('the revision page answers 404', async () => {
		const { event } = adminEvent({
			params: { id: MISSING, revisionId: MISSING },
			routeId: `${EDITOR}/revisions/[revisionId]`,
			userId: 1
		})
		expect(await thrown(() => revisionLoad(event))).toMatchObject({ status: 404 })
	})
})

describe('replacing a plate', () => {
	it('stores the upload and points the specimen at it', async () => {
		const admin = await createAdmin()
		const { bySlug } = await seedCodex()
		const mothman = bySlug('mothman')
		const result = outcome(
			await run(specimenEditor, 'replacePlate', {
				params: { id: mothman.id },
				routeId: EDITOR,
				userId: admin.id,
				form: { plate: pngFile() }
			})
		)
		expect(result).toMatchObject({ success: true, scope: 'plate' })
		const [row] = await db.select().from(tables.creatures).where(eq(tables.creatures.id, mothman.id))
		expect(row?.imageKey).toBe('replacement-plate.png')
	})
})

describe('signing in', () => {
	it('refuses a client that has used up its attempts', async () => {
		const ip = '203.0.113.9'
		await db
			.insert(tables.rateLimits)
			.values({ key: clientKey('login', ip), count: 99, expiresAt: new Date(Date.now() + 60_000) })
		const result = outcome(
			await run(login, 'default', {
				path: '/admin/login',
				routeId: '/admin/login',
				ip,
				form: { email: 'curator@example.com', password: 'anything' }
			})
		)
		expect(result).toMatchObject({ status: 429, email: 'curator@example.com' })
	})

	it('slows repeated failures for one account instead of locking it', async () => {
		await createAdmin()
		const account = clientKey('login-account', 'curator@example.com')
		await db.insert(tables.rateLimits).values({ key: account, count: 12, expiresAt: new Date(Date.now() + 60_000) })
		const realTimeout = globalThis.setTimeout
		const timeout = vi.spyOn(globalThis, 'setTimeout').mockImplementation(((
			callback: () => void,
			delay?: number,
			...rest: unknown[]
		) => {
			if (delay !== 2000) return realTimeout(callback, delay, ...rest)
			callback()
			return 0
		}) as typeof setTimeout)
		const result = outcome(
			await run(login, 'default', {
				path: '/admin/login',
				routeId: '/admin/login',
				ip: '198.51.100.4',
				form: { email: 'curator@example.com', password: 'not-the-password' }
			})
		)
		expect(result).toMatchObject({ status: 401 })
		expect(timeout).toHaveBeenCalledWith(expect.any(Function), 2000)
		const [row] = await db.select().from(tables.rateLimits).where(eq(tables.rateLimits.key, account))
		expect(row?.count).toBe(13)
	})

	it('explains when no admin exists and none can be created', async () => {
		vi.spyOn(env, 'firstAdmin').mockReturnValue(null)
		const result = outcome(
			await run(login, 'default', {
				path: '/admin/login',
				routeId: '/admin/login',
				form: { email: 'curator@example.com', password: 'anything' }
			})
		)
		expect(result).toMatchObject({ status: 503 })
	})
})
