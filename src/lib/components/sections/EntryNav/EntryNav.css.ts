import { style } from '@vanilla-extract/css'
import { theme } from '$lib/styles/theme.css'
import { space } from '$lib/styles/tokens'

export const nav = style({
	marginTop: space[10],
	borderTop: `1px solid ${theme.rule}`,
	paddingTop: space[4],
	display: 'flex',
	justifyContent: 'space-between',
	gap: space[6],
	flexWrap: 'wrap'
})

export const link = style({ color: theme.ink })

export const next = style([link, { textAlign: 'right' }])

export const line = style({ display: 'block' })
