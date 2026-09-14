export const PLATE = { small: 640, medium: 960, large: 1200 } as const

const WIDTHS = [320, 480, PLATE.small, PLATE.medium] as const

export interface Picture {
	src: string
	srcset?: string
	href: string
}

export interface SharedImage {
	url: string
	width?: number
	height?: number
}

const ORIGINALS = 'images/'

export const mediaUrl = (key: string) => (key.startsWith(ORIGINALS) ? `/${encodeURI(key)}` : `/media/${key}`)

const resized = (key: string, width: number) => `/.netlify/images?url=${encodeURIComponent(mediaUrl(key))}&w=${width}`

const imageCdn = () => import.meta.env.VITE_IMAGE_CDN === 'true'

export function picture(key: string, largest: number): Picture {
	const href = mediaUrl(key)
	if (!imageCdn()) return { src: href, href }
	const widths = WIDTHS.filter((width) => width < largest)
	return {
		href,
		src: resized(key, largest),
		srcset: [...widths, largest].map((width) => `${resized(key, width)} ${width}w`).join(', ')
	}
}

export function shareImage(key: string): SharedImage {
	if (!imageCdn()) return { url: mediaUrl(key) }
	const size = PLATE.large
	return { url: `${resized(key, size)}&h=${size}&fit=cover&fm=jpg&q=85`, width: size, height: size }
}
