import { createHash } from 'node:crypto'
import type { ResolveOptions } from '@sveltejs/kit'
import { isRedirect } from '@sveltejs/kit'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { handle, handleError } from '../../src/hooks.server'
import { requestEvent, thrown } from '../helpers/event'
import { signedIn } from '../helpers/factories'

const PAGE = "<html lang='en'>"

const resolve = vi.fn(
	async (_event: unknown, options?: ResolveOptions) =>
		new Response((await options?.transformPageChunk?.({ html: PAGE, done: true })) ?? PAGE)
)

afterEach(() => {
	vi.restoreAllMocks()
	resolve.mockClear()
})

describe('handle', () => {
	it('guards every admin route by its resolved id, whatever the raw path looked like', async () => {
		const { event } = requestEvent({ path: '/%61dmin/specimens', routeId: '/admin/specimens' })
		const error = await thrown(() => handle({ event, resolve }))
		expect(isRedirect(error) && error.location).toBe('/admin/login')
		expect(event.locals).toMatchObject({ admin: false, userId: null })
		expect(resolve).not.toHaveBeenCalled()
	})

	it('lets a signed-in admin through as that user and marks the page noindex', async () => {
		const { cookies, userId } = await signedIn()
		const { event } = requestEvent({ path: '/admin/specimens', routeId: '/admin/specimens', cookies })
		const response = await handle({ event, resolve })
		expect(event.locals).toMatchObject({ admin: true, userId })
		expect(response.headers.get('x-robots-tag')).toBe('noindex, nofollow')
	})

	it('adds the security headers to every response and never checks sessions on public routes', async () => {
		const { cookies } = await signedIn()
		const { event } = requestEvent({ path: '/', routeId: '/(site)', cookies })
		const response = await handle({ event, resolve })
		expect(event.locals).toMatchObject({ admin: false, userId: null })
		expect(response.headers.get('x-robots-tag')).toBeNull()
		expect(response.headers.get('strict-transport-security')).toMatch(/max-age=\d+/)
		expect(response.headers.get('x-content-type-options')).toBe('nosniff')
		expect(response.headers.get('x-frame-options')).toBe('DENY')
		expect(response.headers.get('referrer-policy')).toBeTruthy()
		expect(response.headers.get('permissions-policy')).toBeTruthy()
		expect(response.headers.get('cross-origin-opener-policy')).toBe('same-origin')
	})

	it('allows the page structured data under the script policy', async () => {
		const json = '{"@type":"WebSite"}'
		const page = `<head><script type="application/ld+json">${json}</script></head>`
		const withPolicy = vi.fn(
			async (_event: unknown, options?: ResolveOptions) =>
				new Response(await options?.transformPageChunk?.({ html: page, done: true }), {
					headers: { 'content-security-policy': "default-src 'self'; script-src 'self' 'sha256-kit'; style-src 'self'" }
				})
		)
		const { event } = requestEvent({ path: '/', routeId: '/(site)' })
		const response = await handle({ event, resolve: withPolicy })
		const hash = createHash('sha256').update(json).digest('base64')
		expect(response.headers.get('content-security-policy')).toBe(
			`default-src 'self'; script-src 'self' 'sha256-kit' 'sha256-${hash}'; style-src 'self'`
		)
	})

	it('loads Google Tag Manager on public pages and never on admin pages', async () => {
		const page = '<head><!-- tag-manager --><script>gtm()</script><!-- /tag-manager --></head>'
		const withTags = vi.fn(
			async (_event: unknown, options?: ResolveOptions) =>
				new Response(await options?.transformPageChunk?.({ html: page, done: true }))
		)
		const { event: site } = requestEvent({ path: '/', routeId: '/(site)' })
		expect(await (await handle({ event: site, resolve: withTags })).text()).toContain('gtm()')
		const { cookies } = await signedIn()
		const { event: admin } = requestEvent({ path: '/admin', routeId: '/admin', cookies })
		expect(await (await handle({ event: admin, resolve: withTags })).text()).toBe('<head></head>')
	})

	it('inlines the built stylesheet with its font paths made absolute, and keeps the link if it cannot be fetched', async () => {
		const css =
			'@font-face{src:url(../../../fonts/Fraunces-Variable.woff2)}body{background:url(data:image/png;base64,AA)}'
		const fetcher = vi
			.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(new Response(css))
			.mockResolvedValueOnce(new Response('', { status: 404 }))
		const render = (href: string) =>
			vi.fn(
				async (_event: unknown, options?: ResolveOptions) =>
					new Response(
						await options?.transformPageChunk?.({
							html: `<head><link href="${href}" rel="stylesheet"></head>`,
							done: true
						})
					)
			)
		const { event } = requestEvent({ path: '/creatures/mothman', routeId: '/(site)/creatures/[slug]' })
		const inlined = await (await handle({ event, resolve: render('../_app/immutable/assets/bundle.one.css') })).text()
		expect(fetcher.mock.calls[0]?.[0]).toMatchObject({ pathname: '/_app/immutable/assets/bundle.one.css' })
		expect(inlined).toBe(
			'<head><style>@font-face{src:url(/fonts/Fraunces-Variable.woff2)}body{background:url(data:image/png;base64,AA)}</style></head>'
		)
		await handle({ event, resolve: render('../_app/immutable/assets/bundle.one.css') })
		expect(fetcher).toHaveBeenCalledTimes(1)

		const missing = await (await handle({ event, resolve: render('../_app/immutable/assets/bundle.two.css') })).text()
		expect(missing).toBe('<head><link href="../_app/immutable/assets/bundle.two.css" rel="stylesheet"></head>')

		fetcher.mockRejectedValueOnce(new Error('offline'))
		const offline = await (await handle({ event, resolve: render('../_app/immutable/assets/bundle.three.css') })).text()
		expect(offline).toBe('<head><link href="../_app/immutable/assets/bundle.three.css" rel="stylesheet"></head>')
	})

	it('never preloads the stylesheet it inlines', async () => {
		const { event } = requestEvent({ path: '/', routeId: '/(site)' })
		await handle({ event, resolve })
		const options = resolve.mock.calls[0]?.[1]
		expect(options?.preload?.({ type: 'css', path: '/bundle.css' })).toBe(false)
		expect(options?.preload?.({ type: 'js', path: '/bundle.js' })).toBe(true)
	})

	it('treats a path that matches no route as public', async () => {
		const { event } = requestEvent({ path: '/nowhere' })
		const response = await handle({ event, resolve })
		expect(event.locals.admin).toBe(false)
		expect(response.headers.get('x-frame-options')).toBe('DENY')
	})
})

describe('handleError', () => {
	it('hides server errors behind a generic message with a reference id', () => {
		const log = vi.spyOn(console, 'error').mockImplementation(() => {})
		const result = handleError({
			error: new Error('secret detail'),
			event: requestEvent().event,
			status: 500,
			message: 'Internal Error'
		})
		expect(result).toEqual({
			message: 'Something went wrong on our side.',
			id: expect.stringMatching(/^[0-9a-f-]{36}$/)
		})
		expect(log).toHaveBeenCalledOnce()
	})

	it('passes client errors through without logging', () => {
		const log = vi.spyOn(console, 'error').mockImplementation(() => {})
		expect(handleError({ error: null, event: requestEvent().event, status: 404, message: 'Not Found' })).toMatchObject({
			message: 'Not Found'
		})
		expect(log).not.toHaveBeenCalled()
	})
})
