import { style } from '@vanilla-extract/css'

import { theme } from './theme.css'

export const root = style({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[4],
  justifyContent: 'center',
  minHeight: '60vh',
  padding: `${theme.spacing[8]} ${theme.spacing[4]}`,
  textAlign: 'center',
})

export const code = style({
  color: theme.colors.foreground.muted,
  fontSize: '5rem',
  fontWeight: theme.typography.fontWeight.bold,
  letterSpacing: '-0.04em',
  lineHeight: 1,
})

export const message = style({
  color: theme.colors.foreground.mid,
  maxWidth: '36ch',
})

export const links = style({
  display: 'flex',
  gap: theme.spacing[4],
  marginTop: theme.spacing[2],
})
