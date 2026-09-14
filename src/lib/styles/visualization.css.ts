import { style } from '@vanilla-extract/css'
import { theme } from './theme.css'
import { font, layout, space, type } from './tokens'
import { visualization } from './visualization-theme.css'

export const svg = style({ display: 'block', width: '100%', height: 'auto', overflow: 'visible' })

export const axisText = style({ fill: visualization.axis, fontFamily: font.fraunces, fontSize: type.axis.size })

export const gridLine = style({ stroke: visualization.grid, strokeWidth: 1 })

export const column = style({ fill: visualization.column })

export const horizontalBarRow = style({
	display: 'grid',
	gridTemplateColumns: 'minmax(0, 1fr) auto',
	gap: `${space[1]} ${space[3]}`,
	alignItems: 'baseline',
	padding: `${space[1.5]} 0`
})

export const horizontalBarLabel = style({ minWidth: 0, overflowWrap: 'anywhere' })

export const horizontalBarTrack = style({
	gridColumn: '1 / -1',
	height: layout.barTrack,
	background: visualization.track
})

export const horizontalBarFill = style({ width: '100%', height: '100%', background: visualization.column })

export const tile = style({
	display: 'flex',
	flexDirection: 'column',
	gap: space[1],
	minWidth: 0,
	padding: `${space[3.5]} ${space[4]}`,
	border: `1px solid ${theme.rule}`,
	background: theme.plateMat,
	overflowWrap: 'anywhere'
})
