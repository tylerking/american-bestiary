import { style } from '@vanilla-extract/css'

import { theme } from '../../../styles/theme.css'

export const root = style({
  color: 'inherit',
  selectors: {
    '&:focus-visible': {
      outline: `3px solid ${theme.colors.brand.accent}`,
      outlineOffset: '2px',
    },
    '&:hover': {
      color: theme.colors.brand.accent,
    },
  },
  textDecoration: 'none',
  transition: `color ${theme.transition.fast}`,
})
