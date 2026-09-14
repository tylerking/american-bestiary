import { isHttpError, isRedirect } from '@sveltejs/kit'
import { and, eq } from 'drizzle-orm'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '$lib/server/db'
import { getEntry, getSettings, getThemes } from '$lib/server/db/queries'
import * as tables from '$lib/server/db/schema'
import { load as adminLayout } from '../../src/routes/admin/+layout.server'
import * as dashboard from '../../src/routes/admin/+page.server'
import { load as adminRest } from '../../src/routes/admin/[...rest]/+page.server'
import * as globals from '../../src/routes/admin/globals/+page.server'
import * as globalsRevision from '../../src/routes/admin/globals/revisions/[revisionId]/+page.server'
import * as login from '../../src/routes/admin/login/+page.server'
import { POST as logout } from '../../src/routes/admin/logout/+server'
import * as preview from '../../src/routes/admin/preview/creatures/[slug]/+page.server'
import * as specimenList from '../../src/routes/admin/specimens/+page.server'
import * as specimenEditor from '../../src/routes/admin/specimens/[id]/+page.server'
import * as specimenRevision from '../../src/routes/admin/specimens/[id]/revisions/[revisionId]/+page.server'
import * as themeList from '../../src/routes/admin/themes/+page.server'
import * as themeEditor from '../../src/routes/admin/themes/[id]/+page.server'
import * as themeRevision from '../../src/routes/admin/themes/[id]/revisions/[revisionId]/+page.server'
import { adminEvent, createAdmin, creatureForm, loaded, outcome, run, seedCodex, thrown } from './admin-helpers'

let codex: Awaited<ReturnType<typeof seedCodex>>
let userId: number

beforeEach(async () => {
	codex = await seedCodex()
	userId = (await createAdmin()).id
})

const revisionsOf = (entityType: 'creature' | 'theme' | 'settings', entityId: string) =>
	db
		.select()
		.from(tables.revisions)
		.where(and(eq(tables.revisions.entityType, entityType), eq(tables.revisions.entityId, entityId)))

describe('admin guard', () => {
	it('redirects a signed-out visitor away from the admin layout and lets an admin through', async () => {
		const refused = await thrown(() => adminLayout(adminEvent().event))
		expect(isRedirect(refused) && refused.location).toBe('/admin/login')
		expect(await adminLayout(adminEvent({ userId }).event)).toEqual({
			admin: true,
			settings: expect.objectContaining({ siteName: 'American Bestiary', tagline: 'Fifty cryptids. One per state.' })
		})
		expect(isHttpError(await thrown(() => adminRest(adminEvent({ userId }).event)), 404)).toBe(true)
	})

	it.each([
		['specimen editor', specimenEditor.actions, ['save', 'publish', 'unpublish', 'replacePlate']],
		['specimen revision', specimenRevision.actions, ['restore']],
		['theme editor', themeEditor.actions, ['save']],
		['theme revision', themeRevision.actions, ['restore']],
		['globals', globals.actions, ['update']],
		['globals revision', globalsRevision.actions, ['restore']]
	] as const)('refuses every %s action to a signed-out visitor before touching data', async (_, actions, names) => {
		const mothman = codex.bySlug('mothman')
		for (const name of names) {
			const refused = await thrown(() =>
				run(actions, name, {
					form: creatureForm(mothman, { name: 'Changed' }),
					params: { id: mothman.id, revisionId: mothman.id }
				})
			)
			expect(isRedirect(refused), name).toBe(true)
		}
		expect((await db.select().from(tables.revisions)).length).toBe(0)
		expect(codex.bySlug('mothman').name).toBe('Mothman')
	})
})

describe('sign in and out', () => {
	it('signs in the first admin from the environment and refuses a wrong password', async () => {
		await db.delete(tables.users)
		const wrong = await run(login.actions, 'default', {
			routeId: '/admin/login',
			form: { email: 'first-admin@example.com', password: 'nope' }
		})
		expect(outcome(wrong)).toMatchObject({ status: 401, credentials: true })
		const { event, jar } = adminEvent({
			routeId: '/admin/login',
			form: { email: 'first-admin@example.com', password: 'first-admin-password' }
		})
		const signedIn = await thrown(() => (login.actions.default as (event: never) => unknown)(event as never))
		expect(isRedirect(signedIn) && signedIn.location).toBe('/admin')
		expect(jar.size).toBe(1)
		expect(outcome(await run(login.actions, 'default', { routeId: '/admin/login', form: {} }))).toMatchObject({
			status: 400
		})
	})

	it('sends a signed-in admin from the login page to the dashboard, and signs out', async () => {
		expect(isRedirect(await thrown(() => login.load(adminEvent({ userId }).event)))).toBe(true)
		expect(login.load(adminEvent().event)).toBeUndefined()
		const { event } = adminEvent({ form: { scope: 'all' } })
		const out = await thrown(() => logout(event))
		expect(isRedirect(out) && out.location).toBe('/admin/login')
	})
})

describe('dashboard', () => {
	it('shows the real analytics', async () => {
		await db.insert(tables.events).values([
			{ type: 'pageview', path: '/creatures/mothman' },
			{ type: 'pageview', path: '/', referrer: 'google.com' },
			{ type: 'outbound', path: 'https://en.wikipedia.org/wiki/Mothman' }
		])
		const real = await loaded(dashboard.load(adminEvent({ userId }).event))
		expect(real.counts).toEqual({ specimens: 50, published: 50 })
		expect(real.analytics.stats).toEqual({
			visitsLast30Days: 2,
			visitsLast7Days: 2,
			outboundLast30Days: 1,
			entryViewsLast30Days: 1
		})
		expect(real.analytics.topEntries).toEqual([{ path: '/creatures/mothman', title: 'Mothman', views: 1 }])
		expect(real.analytics.referrers).toContainEqual({ host: 'google.com', views: 1 })
		expect(real.analytics.outbound).toEqual([{ host: 'en.wikipedia.org', clicks: 1 }])
		expect(real.analytics.visitsByWeek.at(-1)?.counts.Visits).toBe(2)
	})
})

describe('specimens list', () => {
	it('lists all fifty in codex order and honours a valid sort', async () => {
		const list = await loaded(specimenList.load(adminEvent({ userId, path: '/admin/specimens' }).event))
		expect(list.specimens).toHaveLength(50)
		expect(list.specimens[0]).toMatchObject({ position: 1, kind: 'beast' })
		expect(list).toMatchObject({ sort: 'name', descending: false })

		const sorted = await loaded(
			specimenList.load(adminEvent({ userId, path: '/admin/specimens?sort=territory&direction=desc' }).event)
		)
		expect(sorted).toMatchObject({ sort: 'territory', descending: true })

		const bogus = await loaded(specimenList.load(adminEvent({ userId, path: '/admin/specimens?sort=password' }).event))
		expect(bogus.sort).toBe('name')
	})
})

describe('specimen editor', () => {
	const params = () => ({ id: codex.bySlug('mothman').id })

	it('loads the specimen with its history, and 404s an unknown or malformed id', async () => {
		const editor = await loaded(specimenEditor.load(adminEvent({ userId, params: params() }).event))
		expect(editor.specimen).toMatchObject({ slug: 'mothman' })
		expect(editor).toMatchObject({ revisions: [], restored: false })
		for (const id of ['not-a-uuid', '00000000-0000-4000-8000-000000000000']) {
			expect(
				isHttpError(await thrown(() => specimenEditor.load(adminEvent({ userId, params: { id } }).event)), 404)
			).toBe(true)
		}
	})

	it('saves every field and records a revision with its author', async () => {
		const mothman = codex.bySlug('mothman')
		const saved = await run(specimenEditor.actions, 'save', {
			userId,
			params: params(),
			form: creatureForm(mothman, { gloss: 'A new gloss.', sources: '[]' })
		})
		expect(saved).toEqual({ success: true })
		const entry = await getEntry('mothman')
		expect(entry?.specimen).toMatchObject({ gloss: 'A new gloss.', sources: [] })
		const [revision] = await revisionsOf('creature', mothman.id)
		expect(revision?.userId).toBe(userId)
		expect(revision?.snapshot).toMatchObject({ gloss: 'A new gloss.' })
	})

	it('names the field that failed validation or collides with another specimen', async () => {
		const mothman = codex.bySlug('mothman')
		expect(
			outcome(
				await run(specimenEditor.actions, 'save', {
					userId,
					params: params(),
					form: creatureForm(mothman, { name: '' })
				})
			)
		).toMatchObject({ status: 400, field: 'name' })
		expect(
			outcome(
				await run(specimenEditor.actions, 'save', {
					userId,
					params: params(),
					form: creatureForm(mothman, { territory: 'Ohio' })
				})
			)
		).toMatchObject({ status: 400, field: 'territory' })
		expect(
			outcome(
				await run(specimenEditor.actions, 'save', {
					userId,
					params: params(),
					form: creatureForm(mothman, { slug: 'bigfoot' })
				})
			)
		).toMatchObject({ status: 400, field: 'slug' })
		const missing = await thrown(() =>
			run(specimenEditor.actions, 'save', {
				userId,
				params: { id: '00000000-0000-4000-8000-000000000000' },
				form: creatureForm(mothman)
			})
		)
		expect(isHttpError(missing, 404)).toBe(true)
	})

	it('unpublishing hides the entry from the public codex and publishing brings it back', async () => {
		expect(await run(specimenEditor.actions, 'unpublish', { userId, params: params() })).toMatchObject({
			success: true,
			scope: 'publish'
		})
		expect(await getEntry('mothman')).toBeNull()
		expect(await getEntry('mothman', { includeUnpublished: true })).not.toBeNull()
		const previewed = await loaded(preview.load(adminEvent({ userId, params: { slug: 'mothman' } }).event))
		expect(previewed.specimen.publishedAt).toBeNull()
		await run(specimenEditor.actions, 'publish', { userId, params: params() })
		expect(await getEntry('mothman')).not.toBeNull()
		expect(
			isHttpError(await thrown(() => preview.load(adminEvent({ userId, params: { slug: 'nope' } }).event)), 404)
		).toBe(true)
	})

	it('refuses a plate that is not an image', async () => {
		const disguised = new File([new TextEncoder().encode('<html></html>')], 'plate.png', { type: 'image/png' })
		expect(
			outcome(
				await run(specimenEditor.actions, 'replacePlate', { userId, params: params(), form: { plate: disguised } })
			)
		).toMatchObject({ status: 400, field: 'plate', scope: 'plate' })
		expect(
			outcome(await run(specimenEditor.actions, 'replacePlate', { userId, params: params(), form: {} }))
		).toMatchObject({ status: 400, message: 'Choose an image to upload.' })
		expect((await getEntry('mothman'))?.specimen.imageKey).toBe('images/mothman.png')
	})
})

describe('specimen revisions', () => {
	it('compares a revision with the current version and restores it as a new revision', async () => {
		const mothman = codex.bySlug('mothman')
		const params = { id: mothman.id }
		await run(specimenEditor.actions, 'save', { userId, params, form: creatureForm(mothman) })
		await run(specimenEditor.actions, 'save', { userId, params, form: creatureForm(mothman, { name: 'Moth Man' }) })
		const history = await loaded(specimenEditor.load(adminEvent({ userId, params }).event))
		const original = history.revisions.at(-1)
		if (!original) throw new Error('No revision')

		const compared = await loaded(
			specimenRevision.load(adminEvent({ userId, params: { ...params, revisionId: original.id } }).event)
		)
		expect(compared.changes).toEqual([{ field: 'name', before: 'Moth Man', after: 'Mothman' }])

		const restored = await thrown(() =>
			run(specimenRevision.actions, 'restore', { userId, params: { ...params, revisionId: original.id } })
		)
		expect(isRedirect(restored) && restored.location).toBe(`/admin/specimens/${mothman.id}?restored=1`)
		expect((await getEntry('mothman'))?.specimen.name).toBe('Mothman')
		expect(await revisionsOf('creature', mothman.id)).toHaveLength(3)
	})

	it('404s a revision that belongs to another specimen', async () => {
		const mothman = codex.bySlug('mothman')
		const bigfoot = codex.bySlug('bigfoot')
		await run(specimenEditor.actions, 'save', { userId, params: { id: bigfoot.id }, form: creatureForm(bigfoot) })
		const [foreign] = await revisionsOf('creature', bigfoot.id)
		for (const revisionId of [foreign?.id ?? '', 'garbage']) {
			const missing = await thrown(() =>
				specimenRevision.load(adminEvent({ userId, params: { id: mothman.id, revisionId } }).event)
			)
			expect(isHttpError(missing, 404)).toBe(true)
		}
	})

	it('refuses to restore a revision that would collide with another specimen', async () => {
		const mothman = codex.bySlug('mothman')
		await run(specimenEditor.actions, 'save', {
			userId,
			params: { id: mothman.id },
			form: creatureForm(mothman, { slug: 'moth' })
		})
		const [revision] = await revisionsOf('creature', mothman.id)
		const bigfoot = codex.bySlug('bigfoot')
		await run(specimenEditor.actions, 'save', {
			userId,
			params: { id: mothman.id },
			form: creatureForm(mothman, { slug: 'mothman' })
		})
		await run(specimenEditor.actions, 'save', {
			userId,
			params: { id: bigfoot.id },
			form: creatureForm(bigfoot, { slug: 'moth' })
		})
		const refused = await run(specimenRevision.actions, 'restore', {
			userId,
			params: { id: mothman.id, revisionId: revision?.id ?? '' }
		})
		expect(outcome(refused)).toMatchObject({ status: 400 })
	})

	it('refuses to restore a snapshot that no longer validates', async () => {
		const mothman = codex.bySlug('mothman')
		const [revision] = await db
			.insert(tables.revisions)
			.values({ entityType: 'creature', entityId: mothman.id, snapshot: { name: '' } })
			.returning()
		expect(
			outcome(
				await run(specimenRevision.actions, 'restore', {
					userId,
					params: { id: mothman.id, revisionId: revision?.id ?? '' }
				})
			)
		).toMatchObject({ status: 400, message: expect.stringMatching(/no longer passes validation/) })
	})
})

describe('themes', () => {
	const themeForm = (theme: Awaited<ReturnType<typeof getThemes>>[number], changes: Record<string, string> = {}) => ({
		slug: theme.slug,
		title: theme.title,
		description: theme.description,
		...Object.fromEntries(
			theme.slots.flatMap((slot) => [
				[`specimen${slot.position}`, slot.creatureId],
				[`note${slot.position}`, slot.note]
			])
		),
		...changes
	})

	it('lists the twelve months with their specimens by name', async () => {
		const list = await loaded(themeList.load(adminEvent({ userId }).event))
		expect(list.themes).toHaveLength(12)
		expect(list.themes[8]).toMatchObject({ month: 9, title: 'It was an animal' })
		expect(list.themes[8]?.members).toContain('Chupacabra')
	})

	it('edits a theme, rejects a specimen twice, and restores the earlier version', async () => {
		const [september] = (await getThemes()).filter((theme) => theme.month === 9)
		if (!september) throw new Error('No September theme')
		const params = { id: september.id }

		const editor = await loaded(themeEditor.load(adminEvent({ userId, params }).event))
		expect(editor.options).toHaveLength(50)
		expect(editor.options[0]?.label).toBe('Beast of Bladenboro (North Carolina)')

		const swap = codex.bySlug('mothman').id
		expect(
			await run(themeEditor.actions, 'save', {
				userId,
				params,
				form: themeForm(september, { specimen1: swap, note1: 'Actually a crane.' })
			})
		).toEqual({ success: true })
		const saved = (await getThemes()).find((theme) => theme.id === september.id)
		expect(saved?.slots[0]).toEqual({ position: 1, creatureId: swap, note: 'Actually a crane.' })

		expect(
			outcome(
				await run(themeEditor.actions, 'save', {
					userId,
					params,
					form: themeForm(september, { specimen4: september.slots[0]?.creatureId ?? '' })
				})
			)
		).toMatchObject({ status: 400, field: 'specimen4' })
		expect(
			outcome(
				await run(themeEditor.actions, 'save', {
					userId,
					params,
					form: themeForm(september, { slug: (await getThemes())[0]?.slug ?? '' })
				})
			)
		).toMatchObject({ status: 400, field: 'slug' })

		await db.insert(tables.revisions).values({
			entityType: 'theme',
			entityId: september.id,
			snapshot: {
				slug: september.slug,
				title: september.title,
				description: september.description,
				month: 9,
				slots: september.slots
			},
			createdAt: new Date(0)
		})
		const history = await loaded(themeEditor.load(adminEvent({ userId, params }).event))
		const original = history.revisions.at(-1)
		const compared = await loaded(
			themeRevision.load(adminEvent({ userId, params: { ...params, revisionId: original?.id ?? '' } }).event)
		)
		expect(compared.changes.map((change: { field: string }) => change.field)).toEqual([
			'slot 1 specimen',
			'slot 1 note'
		])
		expect(compared.changes[0]?.before).toBe('Mothman')

		const restored = await thrown(() =>
			run(themeRevision.actions, 'restore', { userId, params: { ...params, revisionId: original?.id ?? '' } })
		)
		expect(isRedirect(restored)).toBe(true)
		expect((await getThemes()).find((theme) => theme.id === september.id)?.slots).toEqual(september.slots)
	})

	it('404s an unknown theme', async () => {
		const id = '00000000-0000-4000-8000-000000000000'
		expect(isHttpError(await thrown(() => themeEditor.load(adminEvent({ userId, params: { id } }).event)), 404)).toBe(
			true
		)
		expect(
			isHttpError(
				await thrown(() => themeRevision.load(adminEvent({ userId, params: { id, revisionId: id } }).event)),
				404
			)
		).toBe(true)
		const [september] = await getThemes()
		const missing = await thrown(() =>
			run(themeEditor.actions, 'save', { userId, params: { id }, form: themeForm(september as never) })
		)
		expect(isHttpError(missing, 404)).toBe(true)
	})
})

describe('globals', () => {
	const settingsForm = (changes: Record<string, string> = {}) => ({
		siteName: 'American Bestiary',
		tagline: 'Fifty cryptids. One per state.',
		seoDescription: '',
		incipit: 'Each entry in this codex treats its subject as a specimen.',
		footerText: 'Footer',
		creditLabel: 'Illustrations by',
		creditName: 'Tavo Montañez',
		creditUrl: 'https://tavomontanez.art/the-american-bestiary',
		...changes
	})

	it('saves settings and labels with a revision, and restores an earlier version', async () => {
		expect(
			await run(globals.actions, 'update', {
				userId,
				form: settingsForm({ label__readEntry: 'Open the entry', tagline: 'Fifty states.' })
			})
		).toEqual({ success: true })
		const settings = await getSettings()
		expect(settings.labels.readEntry).toBe('Open the entry')
		expect(settings.tagline).toBe('Fifty states.')

		await run(globals.actions, 'update', { userId, form: settingsForm({ tagline: 'Later.' }) })
		const page = await loaded(globals.load(adminEvent({ userId, path: '/admin/globals?restored=1' }).event))
		expect(page.restored).toBe(true)
		const earlier = page.revisions.at(-1)

		const compared = await loaded(
			globalsRevision.load(adminEvent({ userId, params: { revisionId: earlier?.id ?? '' } }).event)
		)
		expect(compared.changes).toContainEqual({ field: 'tagline', before: 'Later.', after: 'Fifty states.' })
		expect(compared.changes).toContainEqual({
			field: 'label readEntry',
			before: 'Read the entry',
			after: 'Open the entry'
		})

		const restored = await thrown(() =>
			run(globalsRevision.actions, 'restore', { userId, params: { revisionId: earlier?.id ?? '' } })
		)
		expect(isRedirect(restored) && restored.location).toBe('/admin/globals?restored=1')
		expect((await getSettings()).tagline).toBe('Fifty states.')
	})

	it('names an invalid setting or an over-long label', async () => {
		expect(
			outcome(await run(globals.actions, 'update', { userId, form: settingsForm({ siteName: '' }) }))
		).toMatchObject({
			status: 400,
			field: 'siteName'
		})
		expect(
			outcome(await run(globals.actions, 'update', { userId, form: settingsForm({ label__search: 'x'.repeat(31) }) }))
		).toMatchObject({ status: 400, field: 'label__search' })
	})

	it('shows no history before the first save', async () => {
		await db.delete(tables.siteSettings)
		const page = await loaded(globals.load(adminEvent({ userId }).event))
		expect(page.revisions).toEqual([])
	})
})
