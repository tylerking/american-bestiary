import { style } from '@vanilla-extract/css'

import { theme } from '../../../styles/theme.css'

export const root = style({
  '@media': {
    '(max-width: 700px)': {
      maxWidth: '100%',
    },
  },
  background: theme.colors.background.card,
  border: `2px solid ${theme.colors.border.base}`,
  borderRadius: theme.radius.sm,
  color: theme.colors.foreground.root,
  flex: 1,
  fontFamily: theme.typography.fontFamily.body,
  fontSize: '1rem',
  maxWidth: '420px',
  padding: `${theme.spacing[3]} 18px`,
  selectors: {
    '&:focus-visible': {
      borderColor: theme.colors.brand.accent,
      outline: `3px solid ${theme.colors.border.focus}`,
      outlineOffset: '2px',
    },
  },
  transition: `border-color ${theme.transition.base}`,
})
