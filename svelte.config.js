import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import adapter from '@sveltejs/adapter-netlify'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

// SvelteKit hashes only the scripts it renders; the Google Tag Manager loader lives in app.html.
const template = readFileSync(new URL('./src/app.html', import.meta.url), 'utf8')
const templateScripts = [...template.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(
	([, body = '']) => /** @type {`sha256-${string}`} */ (`sha256-${createHash('sha256').update(body).digest('base64')}`)
)

const TAG_MANAGER = /** @type {const} */ ('https://www.googletagmanager.com')
const GOOGLE_ANALYTICS = /** @type {const} */ ([
	'https://*.google-analytics.com',
	'https://*.analytics.google.com',
	'https://*.googletagmanager.com'
])

/** @type {import('@sveltejs/kit').KitConfig['csp']} */
const csp = {
	mode: 'hash',
	directives: {
		'default-src': ['self'],
		'script-src': ['self', ...templateScripts, TAG_MANAGER],
		// 'unsafe-inline' stays for styles: inline style="" attributes cannot be hashed or nonced.
		'style-src': ['self', 'unsafe-inline'],
		'font-src': ['self'],
		'img-src': ['self', 'data:', 'https://*.google-analytics.com', 'https://*.googletagmanager.com'],
		'connect-src': ['self', ...GOOGLE_ANALYTICS],
		'frame-src': [TAG_MANAGER],
		'base-uri': ['self'],
		'form-action': ['self'],
		'frame-ancestors': ['none'],
		'object-src': ['none']
	}
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		csp,
		output: { bundleStrategy: 'single' },
		typescript: {
			config: (config) => ({ ...config, include: [...config.include, '../*.ts', '../*.js', '../scripts/**/*.ts'] })
		}
	}
}

export default config
