import { style } from '@vanilla-extract/css'
import { theme } from '$lib/styles/theme.css'
import { layout, space } from '$lib/styles/tokens'

export const code = style({ marginBottom: space[3] })

export const body = style({
	margin: `${space[4]} 0 0`,
	maxWidth: layout.abstractMeasure,
	borderTop: `1px solid ${theme.rule}`,
	paddingTop: space[4]
})

export const routes = style({ display: 'flex', flexWrap: 'wrap', gap: space[6], marginTop: space[7] })
