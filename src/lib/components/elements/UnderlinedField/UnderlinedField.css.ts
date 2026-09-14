import { globalStyle, style } from '@vanilla-extract/css'
import { coarse, coarseTouch } from '$lib/styles/rules'
import { theme } from '$lib/styles/theme.css'
import { axes, font, layout, space, type } from '$lib/styles/tokens'

export const field = style({
	position: 'relative',
	display: 'flex',
	alignItems: 'baseline',
	gap: space[2],
	borderBottom: `1px solid ${theme.faint}`,
	paddingBottom: space[1.25]
})

export const label = style({ whiteSpace: 'nowrap' })

const control = style({
	background: 'none',
	border: 'none',
	padding: 0,
	color: theme.ink,
	fontFamily: font.fraunces,
	fontStyle: 'italic',
	fontSize: type.fieldInput.size,
	fontVariationSettings: axes.base,
	...coarseTouch
})

export const input = style([control, { width: layout.searchWidth, maxWidth: '100%' }])

globalStyle(`${input}::placeholder`, { color: theme.faint, opacity: 1 })

export const select = style([control, { appearance: 'none', WebkitAppearance: 'none', paddingRight: space[5] }])

export const chevron = style({
	position: 'absolute',
	right: 0,
	bottom: layout.chevronOffset,
	width: layout.chevron,
	height: layout.chevron,
	borderRight: `1px solid ${theme.ink}`,
	borderBottom: `1px solid ${theme.ink}`,
	transform: 'rotate(45deg)',
	pointerEvents: 'none',
	...coarse({ top: '50%', bottom: 'auto', transform: 'translateY(-75%) rotate(45deg)' })
})
