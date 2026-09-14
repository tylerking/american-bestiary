import { style } from '@vanilla-extract/css'
import { below } from '$lib/styles/rules'
import { theme } from '$lib/styles/theme.css'
import { layout, space } from '$lib/styles/tokens'

export const section = style({ marginTop: space[17], borderTop: `1px solid ${theme.rule}`, paddingTop: space[8] })

export const month = style({ marginBottom: space[1.5] })

export const title = style({ margin: `0 0 ${space[2.5]}` })

export const description = style({ margin: `0 0 ${space[7]}`, maxWidth: layout.descriptionMeasure })

export const grid = style({
	display: 'grid',
	gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
	gap: space[7],
	...below('narrow', { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' })
})
