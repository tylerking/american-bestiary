import { style } from '@vanilla-extract/css'
import { theme } from '$lib/styles/theme.css'
import { space } from '$lib/styles/tokens'

export const footer = style({
	borderTop: `1px solid ${theme.rule}`,
	marginTop: 'auto',
	paddingBlock: `${space[5]} ${space[7.5]}`
})

export const row = style({ display: 'flex', justifyContent: 'space-between', gap: space[6], flexWrap: 'wrap' })
