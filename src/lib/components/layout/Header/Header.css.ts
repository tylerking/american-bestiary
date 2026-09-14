import { style } from '@vanilla-extract/css'
import { coarseReach } from '$lib/styles/rules'
import { theme } from '$lib/styles/theme.css'
import { space } from '$lib/styles/tokens'

export const header = style({ borderBottom: `1px solid ${theme.rule}`, paddingBlock: space[4.5] })

export const row = style({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: space[6],
	flexWrap: 'wrap'
})

export const brand = style({
	display: 'flex',
	alignItems: 'center',
	gap: space[3.75],
	minWidth: 0,
	color: 'inherit',
	selectors: { '&:hover': { textDecoration: 'none' } }
})

export const titles = style({ display: 'flex', flexDirection: 'column', minWidth: 0 })

export const actions = style({ display: 'flex', flexWrap: 'wrap', gap: space[5.5], alignItems: 'center' })

export const action = style({
	display: 'inline-block',
	color: theme.ink,
	background: 'none',
	borderInline: 0,
	borderTop: 0,
	cursor: 'pointer',
	padding: `${space[1.25]} 0`,
	borderBottom: '1px solid transparent',
	...coarseReach,
	selectors: {
		'&:hover': { textDecoration: 'none', borderBottomColor: theme.rule },
		'&[aria-current="page"]': { color: theme.vermilion, borderBottomColor: theme.vermilion }
	}
})
