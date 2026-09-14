import { style } from '@vanilla-extract/css'
import { layout, space } from '$lib/styles/tokens'

export const label = style({ marginTop: space[7], marginBottom: space[3] })

export const row = style({ display: 'flex', gap: space[10], alignItems: 'flex-start', flexWrap: 'wrap' })

export const plate = style({ maxWidth: layout.plateWidth, width: '100%', flexShrink: 0 })

export const text = style({
	flex: 1,
	minWidth: layout.textColumnMinimum,
	display: 'flex',
	flexDirection: 'column',
	gap: space[2.5]
})

export const abstract = style({ margin: 0, maxWidth: layout.abstractMeasure })

export const read = style({ alignSelf: 'flex-start', marginTop: space[1] })
