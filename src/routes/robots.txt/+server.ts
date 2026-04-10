import type { RequestHandler } from './$types'

export const GET: RequestHandler = ({ url }) => {
  const body = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${url.origin}/sitemap.xml
`

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
