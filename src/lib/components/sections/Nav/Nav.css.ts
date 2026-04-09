import { style } from '@vanilla-extract/css'

import { theme } from '../../../styles/theme.css'

export const root = style({
  display: 'flex',
  gap: theme.spacing[1],
})

export const link = style({
  border: '1.5px solid transparent',
  borderRadius: theme.radius.sm,
  color: theme.colors.neutral[300],
  fontFamily: theme.typography.fontFamily.body,
  fontSize: '0.85rem',
  fontWeight: 500,
  letterSpacing: '0.08em',
  minHeight: '44px',
  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
  selectors: {
    '&:focus-visible': {
      outline: `3px solid ${theme.colors.brand.accent}`,
      outlineOffset: '2px',
    },
    '&:hover': {
      borderColor: theme.colors.brand.secondary,
      color: theme.colors.background.root,
      textDecoration: 'none',
    },
  },
  textDecoration: 'none',
  textTransform: 'uppercase',
  transition: `color ${theme.transition.fast}, border-color ${theme.transition.fast}`,
})

export const active = style({
  borderColor: theme.colors.brand.accent,
  color: theme.colors.brand.accent,
})
