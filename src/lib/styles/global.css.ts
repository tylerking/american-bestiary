import { globalStyle } from '@vanilla-extract/css'
import './fonts.css'
import { base } from './layers.css'
import { theme } from './theme.css'
import { axes, font, space, type } from './tokens'

const inBase = (selector: string, rule: Parameters<typeof globalStyle>[1]) =>
	globalStyle(selector, { '@layer': { [base]: rule } } as Parameters<typeof globalStyle>[1])

inBase('*, *::before, *::after', { boxSizing: 'border-box' })

inBase('html, body', { minHeight: '100%' })

inBase('body', {
	margin: 0,
	background: theme.surround,
	color: theme.ink,
	fontFamily: font.fraunces,
	fontSize: type.base.size,
	lineHeight: type.base.leading,
	fontVariationSettings: axes.base,
	fontWeight: 400,
	'@supports': { '(text-wrap: pretty)': { textWrap: 'pretty' } }
})

inBase('a', { color: theme.vermilion, textDecoration: 'none' })

inBase('a:hover', { textDecoration: 'underline', textUnderlineOffset: space[0.75] })

inBase(':focus-visible', { outline: `2px solid ${theme.vermilion}`, outlineOffset: space[0.75] })

inBase('::selection', { background: theme.shade })

globalStyle('*, *::before, *::after', {
	'@media': {
		'(prefers-reduced-motion: reduce)': { transition: 'none !important', animation: 'none !important' }
	}
})
