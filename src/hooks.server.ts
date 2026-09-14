import { createHash } from 'node:crypto'
import type { Handle, HandleServerError } from '@sveltejs/kit'
import { requireAdmin } from '$lib/server/auth/auth'
import { SESSION_COOKIE, sessionUser } from '$lib/server/auth/sessions'
import { globalHeaders } from '$lib/server/http/headers'
import headersFile from '../_headers?raw'

// Netlify applies _headers to static files only; anything rendered here has to carry them itself.
const SECURITY_HEADERS = globalHeaders(headersFile)

const TAG_MANAGER = /<!-- tag-manager -->[\s\S]*?<!-- \/tag-manager -->\s*/g

const STYLESHEET = /<link href="([^"]*_app\/immutable\/assets\/[^"]+\.css)" rel="stylesheet">/g

const RELATIVE_URL = /url\((['"]?)(?!data:|https?:|\/)([^'")]+)\1\)/g

const stylesheets = new Map<string, Promise<string | null>>()

// A single client bundle ships its CSS as a render-blocking file; inlining it saves the round trip on first paint.
function stylesheet(url: URL): Promise<string | null> {
	const cached = stylesheets.get(url.href)
	if (cached) return cached
	const css = fetch(url)
		.then((response) => (response.ok ? response.text() : null))
		.then(
			(text) =>
				text?.replace(RELATIVE_URL, (_, quote, path) => `url(${quote}${new URL(path, url).pathname}${quote})`) ?? null
		)
		.catch(() => null)
	stylesheets.set(url.href, css)
	void css.then((text) => {
		if (text === null) stylesheets.delete(url.href)
	})
	return css
}

const STRUCTURED_DATA = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g

// SvelteKit only hashes its own inline scripts; Firefox also enforces script-src on JSON-LD data blocks.
function allowScripts(policy: string | null, hashes: string[]): string | null {
	if (!policy || hashes.length === 0) return policy
	return policy.replace(
		/script-src [^;]*/,
		(directive) => `${directive} ${hashes.map((hash) => `'sha256-${hash}'`).join(' ')}`
	)
}

export const handle: Handle = async ({ event, resolve }) => {
	// Guard on route.id, never url.pathname: the router matches the decoded path, so /%61dmin reaches /admin.
	const adminRoute = event.route.id?.startsWith('/admin') ?? false
	event.locals.userId = adminRoute ? await sessionUser(event.cookies.get(SESSION_COOKIE)) : null
	event.locals.admin = event.locals.userId !== null
	if (adminRoute) requireAdmin(event)

	const hashes: string[] = []
	const response = await resolve(event, {
		// The stylesheet is inlined below; a preload header for it would still download the file.
		preload: ({ type }) => type !== 'css',
		transformPageChunk: async ({ html }) => {
			let page = adminRoute ? html.replace(TAG_MANAGER, '') : html
			for (const [tag, href = ''] of page.matchAll(STYLESHEET)) {
				const css = await stylesheet(new URL(href, event.url))
				if (css !== null) page = page.replace(tag, `<style>${css}</style>`)
			}
			for (const [, json = ''] of page.matchAll(STRUCTURED_DATA))
				hashes.push(createHash('sha256').update(json).digest('base64'))
			return page
		}
	})
	const policy = allowScripts(response.headers.get('content-security-policy'), hashes)
	if (policy) response.headers.set('content-security-policy', policy)
	for (const [name, value] of SECURITY_HEADERS) response.headers.set(name, value)
	if (adminRoute) response.headers.set('X-Robots-Tag', 'noindex, nofollow')
	return response
}

export const handleError: HandleServerError = ({ error, event, status, message }) => {
	const id = crypto.randomUUID()
	if (status >= 500) console.error(`[${id}] ${event.request.method} ${event.url.pathname}`, error)
	return { message: status >= 500 ? 'Something went wrong on our side.' : message, id }
}
