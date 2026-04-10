import { findAll } from '$lib/server/creatures'
import { slugify } from '$lib/utils/slugify'

import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ url }) => {
  const creatures = await findAll({ limit: 100 })
  const origin = url.origin

  const staticPaths = ['/', '/archives']
  const creaturePaths = creatures.map((c) => `/creatures/${slugify(c.name)}`)

  const urls = [...staticPaths, ...creaturePaths]
    .map(
      (path) => `  <url>
    <loc>${origin}${path}</loc>
    <changefreq>weekly</changefreq>
  </url>`,
    )
    .join('\n')

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
