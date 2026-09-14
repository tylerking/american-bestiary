import { style } from '@vanilla-extract/css'
import { theme } from '$lib/styles/theme.css'
import { space } from '$lib/styles/tokens'

export const mapSection = style({ borderTop: `1px solid ${theme.rule}`, paddingTop: space[8] })
