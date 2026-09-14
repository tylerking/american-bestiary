import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import { BASE_URL } from './env'

test('an encoded admin path is still guarded', async ({ request }) => {
	const page = await request.get('/%61dmin', { maxRedirects: 0 })
	expect(page.status()).toBe(303)
	expect(page.headers().location).toBe('/admin/login')
	expect(await (await request.get('/%61dmin/__data.json')).text()).toContain('"type":"redirect"')
})

test('a signed-out post to an admin action is redirected without running', async ({ request }) => {
	const response = await request.post('/admin?/anything', {
		form: { id: '1' },
		headers: { origin: BASE_URL, accept: 'text/html' },
		maxRedirects: 0
	})
	expect(response.status()).toBe(303)
	expect(response.headers().location).toBe('/admin/login')
})

test('rendered pages carry the security headers, and admin is kept out of search', async ({ request }) => {
	for (const path of ['/', '/archives', '/creatures/mothman', '/no-such-page']) {
		const headers = (await request.get(path)).headers()
		expect(headers['x-frame-options'], path).toBe('DENY')
		expect(headers['x-content-type-options'], path).toBe('nosniff')
		expect(headers['strict-transport-security'], path).toBeTruthy()
		expect(headers['content-security-policy'], path).toContain("frame-ancestors 'none'")
	}
	expect((await request.get('/admin/login')).headers()['x-robots-tag']).toBe('noindex, nofollow')
})

test('public pages vary the CDN cache by their filters', async ({ request }) => {
	const headers = (await request.get('/archives')).headers()
	expect(headers['netlify-vary']).toContain('query=territory')
	expect(headers['netlify-cache-tag']).toBe('content')
})

test('the original plates are served byte for byte, and media refuses path traversal', async ({ request }) => {
	for (const file of ['mothman.png', 'shunka-warak’in.png']) {
		const image = await request.get(`/images/${encodeURIComponent(file)}`)
		expect(image.status()).toBe(200)
		expect(image.headers()['content-type']).toBe('image/png')
		expect((await image.body()).equals(readFileSync(`static/images/${file}`))).toBe(true)
	}
	expect((await request.get('/media/..%2F..%2F.env')).status()).toBe(404)
})

test('the event beacon only accepts same-origin JSON', async ({ request }) => {
	const data = { type: 'pageview', path: '/', referrer: '' }
	const post = (headers: Record<string, string>, body: unknown = data) =>
		request.post('/api/event', { data: body, headers }).then((response) => response.status())
	expect(await post({ origin: 'https://example.com' })).toBe(403)
	expect(await post({ origin: BASE_URL, 'content-type': 'text/plain' }, 'x')).toBe(415)
	expect(await post({ origin: BASE_URL })).toBe(204)
})

test('the API is read-only', async ({ request }) => {
	expect((await request.post('/api/creatures', { data: {}, headers: { origin: BASE_URL } })).status()).toBe(405)
	expect((await request.patch('/api/creatures/mothman', { data: {}, headers: { origin: BASE_URL } })).status()).toBe(
		405
	)
	expect((await request.delete('/api/creatures/mothman', { headers: { origin: BASE_URL } })).status()).toBe(405)
	const list = await request.get('/api/creatures?kind=bird')
	expect(list.headers()['access-control-allow-origin']).toBe('*')
	expect((await list.json()).total).toBe(5)
})

test('the API reference runs under its own locked-down policy', async ({ request }) => {
	const docs = await request.get('/api/docs')
	expect(docs.headers()['content-security-policy']).toContain("script-src 'self'")
	expect(docs.headers()['x-frame-options']).toBe('DENY')
})

test('robots.txt and the sitemap point crawlers at published pages only', async ({ request }) => {
	expect(await (await request.get('/robots.txt')).text()).toContain(`Sitemap: ${BASE_URL}/sitemap.xml`)
	const sitemap = await (await request.get('/sitemap.xml')).text()
	expect(sitemap).toContain(`${BASE_URL}/creatures/mothman`)
	expect(sitemap.match(/<loc>/g)).toHaveLength(52)
	expect(sitemap).not.toContain('/admin')
})
