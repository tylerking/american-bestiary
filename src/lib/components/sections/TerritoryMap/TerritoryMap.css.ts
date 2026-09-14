import { style } from '@vanilla-extract/css'
import { theme } from '$lib/styles/theme.css'
import { map, space, zIndex } from '$lib/styles/tokens'

export const figure = style({ margin: 0 })

export const outer = style({ border: `1px solid ${theme.rule}`, padding: space[2], background: theme.plateMat })

export const inner = style({
	border: `1px solid ${theme.plateRule}`,
	padding: `${space[3]} ${space[4]} ${space[5.5]}`,
	position: 'relative'
})

export const titulus = style({ textAlign: 'center' })

export const frame = style({ position: 'relative', marginTop: space[1.5] })

export const svg = style({ display: 'block', width: '100%', height: 'auto', overflow: 'visible' })

export const state = style({
	fill: theme.landmass,
	stroke: theme.mapLine,
	strokeWidth: map.stroke,
	selectors: {
		'&[role="button"]': { cursor: 'pointer' },
		'&[data-hovered="true"]': { fill: theme.landmassHover },
		'&[data-selected="true"]': { fill: theme.vermilion },
		'&:focus': { outline: 'none' }
	}
})

export const dot = style({
	pointerEvents: 'none',
	fill: theme.dotFill,
	stroke: 'none',
	selectors: {
		'&[data-hovered="true"]': { fill: theme.vermilion, stroke: theme.mapLine, strokeWidth: map.dotStroke },
		'&[data-selected="true"]': { fill: theme.vellum, stroke: theme.mapLine, strokeWidth: map.dotStroke }
	}
})

const ring = style({
	fill: 'none',
	pointerEvents: 'none',
	strokeLinejoin: 'round',
	vectorEffect: 'non-scaling-stroke'
})

export const ringHalo = style([ring, { stroke: theme.vellum, strokeWidth: map.focusHalo }])

export const ringCore = style([ring, { stroke: theme.ink, strokeWidth: map.focusStroke }])

export const hoverHalo = style([ring, { stroke: theme.vellum, strokeWidth: map.hoverHalo }])

export const hoverCore = style([ring, { stroke: theme.ink, strokeWidth: map.hoverStroke }])

export const picker = style({ display: 'flex', marginTop: space[4] })

export const tooltip = style({
	position: 'absolute',
	zIndex: zIndex.tooltip,
	background: theme.vellum,
	border: `1px solid ${theme.rule}`,
	color: theme.ink,
	padding: space[1.5],
	pointerEvents: 'none',
	whiteSpace: 'nowrap'
})

export const caption = style({ position: 'absolute', right: space[4], bottom: space[1.5] })

export const fallback = style({
	display: 'flex',
	flexWrap: 'wrap',
	gap: `${space[1]} ${space[3]}`,
	listStyle: 'none',
	margin: `${space[4]} 0 0`,
	padding: 0
})
