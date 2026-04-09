import { openApiSpec } from '$lib/server/openapi'

import type { RequestHandler } from './$types'

export const GET: RequestHandler = ({ url }) => {
  if (url.searchParams.get('json') !== null) {
    return new Response(JSON.stringify(openApiSpec), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>American Bestiary - API Docs</title>
</head>
<body>
  <script id="api-reference" data-url="/api/docs?json" type="application/json"></script>
  <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
</body>
</html>`

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  })
}
