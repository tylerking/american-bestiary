import { style } from '@vanilla-extract/css'
import { theme } from '$lib/styles/theme.css'
import { layout, space } from '$lib/styles/tokens'

export const head = style({
	display: 'flex',
	alignItems: 'baseline',
	justifyContent: 'space-between',
	gap: space[6],
	flexWrap: 'wrap',
	borderBottom: `1px solid ${theme.rule}`,
	paddingBottom: space[3.5]
})

export const fields = style({
	display: 'flex',
	flexWrap: 'wrap',
	gap: space[7],
	alignItems: 'baseline',
	padding: `${space[5.5]} 0 ${space[2.5]}`
})

export const empty = style({
	borderTop: `1px solid ${theme.rule}`,
	paddingTop: space[7],
	maxWidth: layout.abstractMeasure
})

export const emptyText = style({ margin: 0 })

export const grid = style({
	display: 'grid',
	gridTemplateColumns: `repeat(auto-fill, minmax(${layout.cardMinimum}, 1fr))`,
	gap: `${space[7.5]} ${space[5.5]}`
})
