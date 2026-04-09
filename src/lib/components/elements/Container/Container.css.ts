import { style } from '@vanilla-extract/css'

import { theme } from '../../../styles/theme.css'

export const root = style({
  margin: '0 auto',
  maxWidth: theme.sizing.wrapper.maxWidth,
  padding: `0 ${theme.spacing[6]}`,
  width: '100%',
})
