import { style } from '@vanilla-extract/css'
import { theme } from '$lib/styles/theme.css'
import { layout } from '$lib/styles/tokens'

export const mark = style({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	flexShrink: 0,
	width: layout.mark,
	height: layout.mark,
	background: theme.vellum,
	border: `1px solid ${theme.rule}`,
	color: theme.ink
})
