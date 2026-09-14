import { style, styleVariants } from '@vanilla-extract/css'
import { below } from '$lib/styles/rules'
import { theme } from '$lib/styles/theme.css'
import { layout, space } from '$lib/styles/tokens'

export const grid = style({
	display: 'grid',
	gridTemplateColumns: `${layout.rail} minmax(0, 1fr)`,
	gridTemplateAreas: '"rail content"',
	gap: space[12],
	...below('narrow', { gridTemplateColumns: 'minmax(0, 1fr)', gridTemplateAreas: 'none', gap: space[6.5] })
})

export const content = style({ gridArea: 'content', minWidth: 0, ...below('narrow', { gridArea: 'auto' }) })

const cell = style({
	gridArea: 'rail',
	minWidth: 0,
	paddingInlineEnd: space[5],
	borderInlineEnd: `1px solid ${theme.rule}`,
	...below('narrow', { gridArea: 'auto', paddingInlineEnd: 0, borderInlineEnd: 'none' })
})

export const rail = styleVariants({
	before: [cell, below('narrow', { borderBottom: `1px solid ${theme.rule}`, paddingBottom: space[4] })],
	after: [cell, below('narrow', { borderTop: `1px solid ${theme.rule}`, paddingTop: space[4] })]
})

export const sticky = style({ '@media': { '(min-height: 36rem)': { position: 'sticky', top: space[6] } } })
