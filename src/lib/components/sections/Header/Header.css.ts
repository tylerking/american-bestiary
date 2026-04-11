import { style } from '@vanilla-extract/css'

import { theme } from '../../../styles/theme.css'

export const root = style({
  background: theme.colors.brand.primary,
  borderBottom: `5px solid ${theme.colors.brand.accent}`,
  color: theme.colors.background.root,
  padding: `${theme.spacing[5]} 0`,
  position: 'sticky',
  top: 0,
  zIndex: theme.zIndex.sticky,
})

export const inner = style({
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing[5],
  justifyContent: 'space-between',
  position: 'relative',
})

export const hamburger = style({
  '@media': {
    '(max-width: 900px)': {
      display: 'flex',
    },
  },
  alignItems: 'center',
  background: 'none',
  border: 'none',
  color: theme.colors.background.root,
  cursor: 'pointer',
  display: 'none',
  height: '44px',
  justifyContent: 'center',
  padding: 0,
  width: '44px',
})

export const brand = style({
  alignItems: 'center',
  color: 'inherit',
  display: 'flex',
  gap: '14px',
  minWidth: 0,
  selectors: {
    '&:hover': {
      textDecoration: 'none',
    },
  },
  textDecoration: 'none',
})

export const text = style({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
})

export const title = style({
  color: theme.colors.background.root,
  fontFamily: theme.typography.fontFamily.heading,
  fontSize: theme.typography.fontSize.h1,
  fontWeight: 900,
  letterSpacing: '0.01em',
  lineHeight: 1.1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const subtitle = style({
  '@media': {
    '(max-width: 700px)': {
      display: 'none',
    },
  },
  color: theme.colors.neutral[200],
  fontSize: '0.82rem',
  fontStyle: 'italic',
  marginTop: '2px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})
