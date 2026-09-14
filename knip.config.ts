import type { KnipConfig } from 'knip'
import { compile, parse } from 'svelte/compiler'

export default {
	entry: ['tests/e2e/serve.ts', 'tests/e2e/*.setup.ts', 'netlify/functions/*.mts'],
	compilers: {
		svelte: (text: string, filename: string) => {
			const ast = parse(text, { modern: true })
			const scripts = [ast.module, ast.instance]
				.flatMap((script) => {
					if (!script) return []
					const body = text.indexOf('>', script.attributes.at(-1)?.end ?? script.start) + 1
					return [text.slice(body, text.lastIndexOf('</script', script.end))]
				})
				.join('\n')
			// The server build is compiled too: the client build drops <noscript> content, and styles used only there would read as unused.
			const template = (['client', 'server'] as const)
				.map((generate) =>
					compile(text, { filename, generate })
						.js.code.replace(/^import\b[^;]*;/gm, '')
						.replace(/^export (default )?/gm, '')
				)
				.join('\n}\n{\n')
			return `${scripts}\n{\n${template}\n}`
		}
	}
} satisfies KnipConfig
