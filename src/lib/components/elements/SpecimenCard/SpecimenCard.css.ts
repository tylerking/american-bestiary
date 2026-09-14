import { style } from '@vanilla-extract/css'
import { theme } from '$lib/styles/theme.css'
import { space } from '$lib/styles/tokens'

export const figure = style({ margin: 0, minWidth: 0 })

export const captionArchive = style({
	marginTop: space[1.5],
	borderTop: `1px solid ${theme.plateRule}`,
	paddingTop: space[1.5]
})

export const captionMember = style({
	marginTop: space[2],
	borderTop: `1px solid ${theme.plateRule}`,
	paddingTop: space[2]
})

export const note = style({ marginTop: space[1] })
