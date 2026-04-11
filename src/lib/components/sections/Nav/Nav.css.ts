import { style } from '@vanilla-extract/css'

import { theme } from '../../../styles/theme.css'

export const root = style({
  '@media': {
    '(max-width: 900px)': {
      background: theme.colors.brand.primary,
      borderTop: `1px solid ${theme.colors.brand.accent}`,
      display: 'none',
      flexDirection: 'column',
      gap: 0,
      left: 0,
      padding: `${theme.spacing[4]} ${theme.spacing[6]}`,
      position: 'absolute',
      right: 0,
      top: '100%',
      width: '100%',
      zIndex: 10,
    },
  },
  display: 'flex',
  gap: theme.spacing[1],
})

export const mobileOpen = style({
  '@media': {
    '(max-width: 900px)': {
      display: 'flex',
    },
  },
})

export const link = style({
  '@media': {
    '(max-width: 900px)': {
      borderRadius: 0,
      justifyContent: 'center',
      padding: `${theme.spacing[4]} 0`,
      width: '100%',
    },
  },
  alignItems: 'center',
  border: '1.5px solid transparent',
  borderRadius: theme.radius.sm,
  color: theme.colors.neutral[300],
  display: 'flex',
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
