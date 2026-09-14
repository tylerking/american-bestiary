import { style } from '@vanilla-extract/css'
import { theme } from '$lib/styles/theme.css'
import { space } from '$lib/styles/tokens'

export const frame = style({
	display: 'block',
	padding: space[2],
	border: `1px solid ${theme.rule}`,
	background: theme.plateMat,
	selectors: { '&:hover, &:focus-visible': { borderColor: theme.plateVermilion } }
})

export const square = style([
	frame,
	{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', aspectRatio: '1' }
])
