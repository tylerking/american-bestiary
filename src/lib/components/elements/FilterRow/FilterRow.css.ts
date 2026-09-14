import { style, styleVariants } from '@vanilla-extract/css'
import { coarse, coarseReach } from '$lib/styles/rules'
import { theme } from '$lib/styles/theme.css'
import { space } from '$lib/styles/tokens'

const row = style({
	display: 'flex',
	flexWrap: 'wrap',
	alignItems: 'baseline',
	gap: space[1.5],
	...coarse({ rowGap: space[6] })
})

export const spacing = styleVariants({
	status: [row, { padding: `${space[4]} 0 ${space[1]}`, ...coarse({ paddingBottom: space[3] }) }],
	kind: [row, { padding: `${space[1.5]} 0 ${space[6.5]}`, ...coarse({ paddingTop: space[3] }) }]
})

export const label = style({ marginRight: space[1] })

export const option = style({
	padding: `${space[0.5]} ${space[0.25]} ${space[0.75]}`,
	color: theme.ink,
	whiteSpace: 'nowrap',
	fontStyle: 'italic',
	...coarseReach,
	selectors: {
		'&:hover': { textDecoration: 'none' },
		'&[aria-current="true"]': { fontStyle: 'normal', fontWeight: 700, borderBottom: `2px solid ${theme.gold}` }
	}
})
