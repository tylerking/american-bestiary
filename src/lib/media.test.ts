import { afterEach, describe, expect, it, vi } from 'vitest'
import { mediaUrl, picture, shareImage } from './media'

afterEach(() => {
	vi.unstubAllEnvs()
})

describe('picture', () => {
	it('serves the stored original where there is no image CDN', () => {
		vi.stubEnv('VITE_IMAGE_CDN', '')
		expect(picture('cover.png', 1280)).toEqual({ src: '/media/cover.png', href: '/media/cover.png' })
	})

	it('offers resized widths up to the largest the slot needs, and keeps the original for links', () => {
		vi.stubEnv('VITE_IMAGE_CDN', 'true')
		const image = picture('cover.png', 960)
		const at = (width: number) => `/.netlify/images?url=%2Fmedia%2Fcover.png&w=${width}`
		expect(image.href).toBe('/media/cover.png')
		expect(image.src).toBe(at(960))
		expect(image.srcset).toBe(`${at(320)} 320w, ${at(480)} 480w, ${at(640)} 640w, ${at(960)} 960w`)
	})

	it('allows a largest width between the standard steps', () => {
		vi.stubEnv('VITE_IMAGE_CDN', 'true')
		expect(picture('thumbnail.png', 400).srcset).toBe(
			'/.netlify/images?url=%2Fmedia%2Fthumbnail.png&w=320 320w, /.netlify/images?url=%2Fmedia%2Fthumbnail.png&w=400 400w'
		)
	})
})

describe('mediaUrl', () => {
	it('points uploads at the media route', () => {
		expect(mediaUrl('a.webp')).toBe('/media/a.webp')
	})

	it('points the originals at their unaltered files, names intact', () => {
		expect(mediaUrl('images/shunka-warak’in.png')).toBe('/images/shunka-warak%E2%80%99in.png')
		vi.stubEnv('VITE_IMAGE_CDN', 'true')
		expect(picture('images/mothman.png', 640).src).toBe('/.netlify/images?url=%2Fimages%2Fmothman.png&w=640')
	})
})

describe('shareImage', () => {
	it('shares the original where there is no image CDN', () => {
		vi.stubEnv('VITE_IMAGE_CDN', '')
		expect(shareImage('images/mothman.png')).toEqual({ url: '/images/mothman.png' })
	})

	it('shares a square JPEG of known size through the image CDN', () => {
		vi.stubEnv('VITE_IMAGE_CDN', 'true')
		expect(shareImage('images/mothman.png')).toEqual({
			url: '/.netlify/images?url=%2Fimages%2Fmothman.png&w=1200&h=1200&fit=cover&fm=jpg&q=85',
			width: 1200,
			height: 1200
		})
	})
})
