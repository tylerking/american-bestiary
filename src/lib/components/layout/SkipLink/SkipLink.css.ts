import { style } from '@vanilla-extract/css'
import { coarseTouch } from '$lib/styles/rules'
import { theme } from '$lib/styles/theme.css'
import { space, zIndex } from '$lib/styles/tokens'

export const skip = style({
	position: 'absolute',
	left: space[3],
	top: space[3],
	zIndex: zIndex.skip,
	display: 'inline-flex',
	alignItems: 'center',
	...coarseTouch,
	background: theme.vermilion,
	color: theme.onVermilion,
	padding: `${space[2]} ${space[4]}`,
	transform: 'translateY(-200%)',
	selectors: { '&:focus': { transform: 'none' }, '&:hover': { textDecoration: 'none' } }
})
