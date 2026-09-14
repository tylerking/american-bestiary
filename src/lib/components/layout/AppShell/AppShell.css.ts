import { globalStyle, style } from '@vanilla-extract/css'
import { below } from '$lib/styles/rules'
import { theme } from '$lib/styles/theme.css'
import { layout, space, texture } from '$lib/styles/tokens'

export const surround = style({
	minHeight: '100vh',
	padding: `${space[9]} ${space[6]}`,
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'flex-start',
	background: theme.surround,
	...below('narrow', { padding: `${space[3.5]} ${space[2]}` })
})

export const leaf = style({
	backgroundColor: theme.vellum,
	backgroundImage: texture.leaf,
	color: theme.ink,
	width: '100%',
	maxWidth: layout.leafWidth,
	border: `1px solid ${theme.rule}`,
	boxShadow: theme.leafShadow,
	display: 'flex',
	flexDirection: 'column'
})

globalStyle(`${leaf} > *`, {
	paddingInline: space[11],
	...below('narrow', { paddingInline: space[5] })
})

export const content = style({ flex: 1, paddingBlock: `${space[9]} ${space[20]}` })
