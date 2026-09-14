import { style } from '@vanilla-extract/css'
import { theme } from '$lib/styles/theme.css'
import { layout, space } from '$lib/styles/tokens'

export const row = style({
	display: 'flex',
	flexWrap: 'wrap',
	alignItems: 'center',
	gap: space[2.5],
	margin: `${space[12]} 0 ${space[4]}`
})

export const first = style({ marginTop: 0 })

export const lozenge = style({
	width: layout.lozenge,
	height: layout.lozenge,
	background: theme.gold,
	transform: 'rotate(45deg)',
	flexShrink: 0
})

export const nowrap = style({ whiteSpace: 'nowrap' })

export const rule = style({ flex: 1, borderTop: `1px solid ${theme.shade}` })
