import { describe, expect, it } from 'vitest'
import { currentMonth } from '$lib/server/db/queries'
import { GET as list } from '../../src/routes/api/creatures/+server'
import { GET as detail } from '../../src/routes/api/creatures/[slug]/+server'
import { GET as docs } from '../../src/routes/api/docs/+server'
import { GET as openapi } from '../../src/routes/api/openapi.json/+server'
import { GET as current } from '../../src/routes/api/themes/current/+server'
import { ORIGIN, requestEvent } from '../helpers/event'
import { insertCreature, insertTheme } from '../helpers/factories'

async function roster() {
	const mothman = await insertCreature({ slug: 'mothman', name: 'Mothman', territory: 'West Virginia', kind: 'bird' })
	const squonk = await insertCreature({
		slug: 'squonk',
		name: 'Squonk',
		territory: 'Pennsylvania',
		kind: 'beast',
		status: 'folkloric'
	})
	const hidden = await insertCreature({
		slug: 'champy',
		name: 'Champy',
		territory: 'New York',
		kind: 'serpent',
		publishedAt: null
	})
	return { mothman, squonk, hidden }
}

const get = (path: string) => requestEvent({ path }).event

describe('GET /api/creatures', () => {
	it('lists published specimens in codex order, readable from anywhere', async () => {
		await roster()
		const response = await list(get('/api/creatures'))
		expect(response.headers.get('access-control-allow-origin')).toBe('*')
		const body = await response.json()
		expect(body).toMatchObject({ page: 1, limit: 50, total: 2 })
		expect(body.data.map((entry: { slug: string }) => entry.slug)).toEqual(['squonk', 'mothman'])
		expect(body.data[0].image).toBe(`${ORIGIN}/images/jackalope.png`)
	})

	it('filters and pages', async () => {
		await roster()
		expect((await (await list(get('/api/creatures?kind=bird'))).json()).data).toHaveLength(1)
		expect((await (await list(get('/api/creatures?territory=pennsylvania'))).json()).total).toBe(1)
		const page = await (await list(get('/api/creatures?limit=1&page=2'))).json()
		expect(page).toMatchObject({ page: 2, limit: 1, total: 2 })
		expect(page.data[0].slug).toBe('mothman')
	})

	it('explains an invalid query', async () => {
		const response = await list(get('/api/creatures?limit=500'))
		expect(response.status).toBe(400)
		expect((await response.json()).error).toMatch(/^limit: /)
		expect((await (await list(get('/api/creatures?kind=fish'))).json()).error).toMatch(/^kind: /)
	})
})

describe('GET /api/creatures/[slug]', () => {
	it('returns one published specimen and 404s the rest', async () => {
		await roster()
		const found = await detail(requestEvent({ params: { slug: 'mothman' } }).event)
		expect(await found.json()).toMatchObject({ slug: 'mothman', sections: { etymology: expect.any(String) } })
		for (const slug of ['champy', 'bigfoot']) {
			const missing = await detail(requestEvent({ params: { slug } }).event)
			expect(missing.status).toBe(404)
			expect((await missing.json()).error).toContain(slug)
		}
	})
})

describe('GET /api/themes/current', () => {
	it('returns this month theme, or a 404 when none is set', async () => {
		expect((await current(get('/api/themes/current'))).status).toBe(404)
		const { mothman, squonk } = await roster()
		await insertTheme([squonk.id, mothman.id], { month: currentMonth(), slug: 'this-month' })
		const body = await (await current(get('/api/themes/current'))).json()
		expect(body).toMatchObject({ slug: 'this-month', month: currentMonth() })
		expect(body.members.map((member: { slug: string; position: number }) => [member.position, member.slug])).toEqual([
			[1, 'squonk'],
			[2, 'mothman']
		])
	})
})

describe('documentation', () => {
	it('serves the OpenAPI document for this origin', async () => {
		const body = await (await openapi(get('/api/openapi.json'))).json()
		expect(body.servers).toEqual([{ url: ORIGIN }])
		expect(body.paths).toHaveProperty('/api/creatures')
	})

	it('serves the reference page under its own strict policy, with a self-hosted script', async () => {
		const page = await docs(get('/api/docs'))
		expect(page.headers.get('content-security-policy')).toContain("script-src 'self'")
		const html = await page.text()
		expect(html).toContain('data-url="/api/openapi.json"')
		expect(html).toMatch(/<script src="\/[^"]*standalone[^"]*\.js"><\/script>/)
	})
})
