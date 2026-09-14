import { isHttpError } from '@sveltejs/kit'
import { describe, expect, it } from 'vitest'
import { clientKey } from '$lib/server/auth/rate-limit'
import { db } from '$lib/server/db'
import { currentMonth } from '$lib/server/db/queries'
import * as tables from '$lib/server/db/schema'
import { PUBLIC_CACHE } from '$lib/server/http/cache'
import { storeUpload } from '$lib/server/media/blobs'
import { load as layout } from '../../src/routes/(site)/+layout.server'
import { load as home } from '../../src/routes/(site)/+page.server'
import { load as rest } from '../../src/routes/(site)/[...rest]/+page.server'
import { load as archives } from '../../src/routes/(site)/archives/+page.server'
import { load as entry } from '../../src/routes/(site)/creatures/[slug]/+page.server'
import { POST as beacon } from '../../src/routes/api/event/+server'
import { GET as media } from '../../src/routes/media/[...key]/+server'
import { GET as robots } from '../../src/routes/robots.txt/+server'
import { GET as sitemap } from '../../src/routes/sitemap.xml/+server'
import { loaded, ORIGIN, requestEvent, thrown } from '../helpers/event'
import { insertCreature, insertSettings, insertTheme, pngFile } from '../helpers/factories'

async function roster() {
	const mothman = await insertCreature({ slug: 'mothman', name: 'Mothman', territory: 'West Virginia', kind: 'bird' })
	const frog = await insertCreature({
		slug: 'loveland-frogmen',
		name: 'Loveland Frogmen',
		territory: 'Ohio',
		kind: 'humanoid'
	})
	const hidden = await insertCreature({
		slug: 'champy',
		name: 'Champy',
		territory: 'New York',
		kind: 'serpent',
		publishedAt: null
	})
	return { mothman, frog, hidden }
}

describe('site loads', () => {
	it('shares the settings', async () => {
		await insertSettings({ tagline: 'Fifty cryptids.' })
		const data = await loaded(layout(requestEvent().event))
		expect(data.settings.tagline).toBe('Fifty cryptids.')
	})

	it('opens the map on West Virginia with the month theme and the CDN cache headers', async () => {
		const { mothman, hidden } = await roster()
		await insertTheme([mothman.id, hidden.id], { month: currentMonth() })
		const { event, responseHeaders } = requestEvent()
		const data = await loaded(home(event))
		expect(data.territory).toBe('West Virginia')
		expect(data.specimens.map((specimen: { slug: string }) => specimen.slug)).toEqual(['mothman', 'loveland-frogmen'])
		expect(data.theme?.members.map((member: { slug: string }) => member.slug)).toEqual(['mothman'])
		expect(responseHeaders).toEqual(PUBLIC_CACHE)
	})

	it('selects the territory named in the address, ignoring unknown ones', async () => {
		await roster()
		expect((await loaded(home(requestEvent({ path: '/?territory=ohio' }).event))).territory).toBe('Ohio')
		expect((await loaded(home(requestEvent({ path: '/?territory=atlantis' }).event))).territory).toBe('West Virginia')
	})

	it('reads the archive filters from the address', async () => {
		await roster()
		const { event, responseHeaders } = requestEvent({ path: '/archives?q=moth&status=nonsense&kind=bird' })
		const data = await loaded(archives(event))
		expect(data.query).toEqual({ q: 'moth', territory: '', status: 'all', kind: 'bird' })
		expect(data.specimens).toHaveLength(2)
		expect(responseHeaders).toEqual(PUBLIC_CACHE)
	})

	it('serves a published entry and 404s anything else', async () => {
		await roster()
		const { event, responseHeaders } = requestEvent({ params: { slug: 'mothman' } })
		const data = await loaded(entry(event))
		expect(data.specimen).toMatchObject({ slug: 'mothman' })
		expect(data.neighbours.next.slug).toBe('loveland-frogmen')
		expect(responseHeaders).toEqual(PUBLIC_CACHE)
		for (const slug of ['champy', 'nope']) {
			expect(isHttpError(await thrown(() => entry(requestEvent({ params: { slug } }).event)), 404)).toBe(true)
		}
		expect(isHttpError(await thrown(() => rest(requestEvent().event)), 404)).toBe(true)
	})
})

describe('event beacon', () => {
	const post = (body: string, headers: Record<string, string> = {}, ip?: string) =>
		beacon(
			requestEvent({
				path: '/api/event',
				method: 'POST',
				body,
				ip,
				headers: { origin: ORIGIN, 'content-type': 'application/json', ...headers }
			}).event
		)
	const pageview = (path: string, referrer = '') => JSON.stringify({ type: 'pageview', path, referrer })

	it('records a pageview, keeping only the referring host', async () => {
		expect((await post(pageview('/creatures/mothman', 'https://www.example.org/feed?id=1'))).status).toBe(204)
		expect(await db.select().from(tables.events)).toMatchObject([
			{ type: 'pageview', path: '/creatures/mothman', referrer: 'www.example.org' }
		])
	})

	it('records an outbound click', async () => {
		await post(JSON.stringify({ type: 'outbound', path: 'https://tavomontanez.art/the-american-bestiary' }))
		expect(await db.select().from(tables.events)).toMatchObject([{ type: 'outbound' }])
	})

	it('drops own-site and unparseable referrers', async () => {
		await post(pageview('/', `${ORIGIN}/creatures/mothman`))
		await post(pageview('/', 'not a url'))
		expect((await db.select().from(tables.events)).map((row) => row.referrer)).toEqual(['', ''])
	})

	it.each([
		['a cross-origin request', { origin: 'https://evil.example' }, 403],
		['a non-JSON body', { 'content-type': 'text/plain' }, 415],
		['a declared oversized body', { 'content-length': '5000' }, 413]
	])('rejects %s', async (_case, headers, status) => {
		expect((await post(pageview('/'), headers)).status).toBe(status)
		expect(await db.$count(tables.events)).toBe(0)
	})

	it('rejects an oversized body that did not declare its length', async () => {
		expect((await post(`{"type":"pageview","path":"/${'x'.repeat(2100)}"}`)).status).toBe(413)
	})

	it.each([
		['a bot', pageview('/'), { 'user-agent': 'Googlebot/2.1' }],
		['an admin path', pageview('/admin/specimens'), {}],
		['malformed JSON', '{nope', {}],
		['an invalid event', JSON.stringify({ type: 'resume', path: '/' }), {}]
	])('accepts but ignores %s', async (_case, body, headers) => {
		expect((await post(body, headers)).status).toBe(204)
		expect(await db.$count(tables.events)).toBe(0)
	})

	it('rate-limits a flooding client', async () => {
		await db
			.insert(tables.rateLimits)
			.values({ key: clientKey('event', '203.0.113.30'), count: 120, expiresAt: new Date(Date.now() + 60_000) })
		expect((await post(pageview('/'), {}, '203.0.113.30')).status).toBe(429)
	})
})

describe('media, robots and sitemap', () => {
	it('serves a stored image with a locked-down sandbox policy', async () => {
		const stored = await storeUpload(pngFile())
		const key = 'key' in stored ? stored.key : ''
		const response = await media(requestEvent({ params: { key } }).event)
		expect(response.headers.get('content-type')).toBe('image/png')
		expect(response.headers.get('content-security-policy')).toBe("default-src 'none'; sandbox")
		expect(response.headers.get('netlify-cache-tag')).toBe('media')
		expect(isHttpError(await thrown(() => media(requestEvent({ params: { key: '../.env' } }).event)), 404)).toBe(true)
	})

	it('keeps crawlers out of admin and the API, except its docs', async () => {
		const text = await (await robots(requestEvent().event)).text()
		expect(text).toBe(
			`User-agent: *\nDisallow: /admin\nDisallow: /api/\nAllow: /api/docs\n\nSitemap: ${ORIGIN}/sitemap.xml\n`
		)
	})

	it('lists the map, the archive and every published entry', async () => {
		await roster()
		const response = await sitemap(requestEvent().event)
		const xml = await response.text()
		expect(response.headers.get('content-type')).toBe('application/xml; charset=utf-8')
		expect(xml).toContain(`<loc>${ORIGIN}/</loc>`)
		expect(xml).toContain(`<loc>${ORIGIN}/archives</loc>`)
		expect(xml).toContain(`<loc>${ORIGIN}/creatures/mothman</loc><lastmod>`)
		expect(xml).not.toContain('champy')
	})
})
