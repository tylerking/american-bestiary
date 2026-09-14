import { style } from '@vanilla-extract/css'
import { theme } from '$lib/styles/theme.css'
import { space } from '$lib/styles/tokens'

export const note = style({ borderTop: `1px solid ${theme.rule}`, paddingTop: space[3.5] })
