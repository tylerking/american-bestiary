import { style, styleVariants } from '@vanilla-extract/css'
import { below } from '$lib/styles/rules'
import { theme } from '$lib/styles/theme.css'
import { axes, initial as initialSize } from '$lib/styles/tokens'

const letter = style({
	color: theme.gold,
	float: 'left',
	fontVariationSettings: axes.initial,
	fontWeight: 700,
	lineHeight: initialSize.leading,
	margin: initialSize.margin
})

export const initial = styleVariants({
	incipit: [letter, { fontSize: initialSize.incipit, ...below('narrow', { fontSize: initialSize.narrow }) }],
	entry: [letter, { fontSize: initialSize.entry, ...below('narrow', { fontSize: initialSize.narrow }) }]
})
