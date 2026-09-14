import { readdirSync } from 'node:fs'

const PLATES = readdirSync(new URL('../../static/images', import.meta.url))

export function plateKey(slug: string): string {
	const file = PLATES.find((name) => name.replace(/’/g, '-') === `${slug}.png`)
	if (!file) throw new Error(`No original plate in static/images for ${slug}`)
	return `images/${file}`
}
