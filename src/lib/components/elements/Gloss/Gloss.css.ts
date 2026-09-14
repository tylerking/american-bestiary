import { style } from '@vanilla-extract/css'
import { below } from '$lib/styles/rules'
import { theme } from '$lib/styles/theme.css'
import { layout, space, type } from '$lib/styles/tokens'

const bar = { borderLeft: `2px solid ${theme.vermilion}` }

export const featured = style({
	...bar,
	margin: 0,
	maxWidth: layout.abstractMeasure,
	paddingLeft: space[3.5],
	lineHeight: type.base.leading
})

export const inline = style({
	...bar,
	display: 'none',
	margin: `${space[4.5]} 0 0`,
	paddingLeft: space[3],
	...below('narrow', { display: 'block' })
})

export const margin = style(below('narrow', { display: 'none' }))

export const marginText = style({ margin: `${space[1.5]} 0 0` })
