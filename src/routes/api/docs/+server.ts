import { SITE_NAME } from '$lib/codex'
import scalar from '../../../../node_modules/@scalar/api-reference/dist/browser/standalone.js?url'
import type { RequestHandler } from './$types'

const CONFIGURATION = JSON.stringify({
	withDefaultFonts: false,
	hideClientButton: true,
	showDeveloperTools: 'never',
	agent: { disabled: true },
	mcp: { disabled: true },
	theme: 'default'
})

const PAGE = `<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title>API reference · ${SITE_NAME}</title>
	</head>
	<body>
		<main>
			<h1 style="position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap">API reference</h1>
			<script id="api-reference" data-url="/api/openapi.json" data-configuration='${CONFIGURATION}'></script>
		</main>
		<script src="${scalar}"></script>
	</body>
</html>
`

export const GET: RequestHandler = () =>
	new Response(PAGE, {
		headers: {
			'content-type': 'text/html; charset=utf-8',
			'cache-control': 'public, max-age=3600',
			'content-security-policy':
				"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'"
		}
	})
