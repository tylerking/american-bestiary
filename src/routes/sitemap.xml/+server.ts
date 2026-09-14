import { getPublishedCodex } from '$lib/server/db/queries'
import { PUBLIC_CACHE } from '$lib/server/http/cache'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ url }) => {
	const codex = await getPublishedCodex()
	const entries = [
		`<url><loc>${url.origin}/</loc></url>`,
		`<url><loc>${url.origin}/archives</loc></url>`,
		...codex.map(
			(specimen) =>
				`<url><loc>${url.origin}/creatures/${specimen.slug}</loc><lastmod>${specimen.updatedAt.toISOString()}</lastmod></url>`
		)
	]
	const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`
	return new Response(xml, { headers: { ...PUBLIC_CACHE, 'content-type': 'application/xml; charset=utf-8' } })
}
