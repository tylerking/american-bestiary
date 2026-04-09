import { style } from '@vanilla-extract/css'

import { theme } from '../../../styles/theme.css'

export const root = style({
  display: 'block',
  height: '100%',
  width: 'auto',
})

export const svg = style({
  display: 'block',
  height: '100%',
  width: 'auto',
})

export const path = style({
  fill: theme.colors.brand.accent,
})

export const badge = style({
  alignSelf: 'flex-start',
  border: `1.5px solid ${theme.colors.status.success}`,
  borderRadius: theme.radius.sm,
  color: theme.colors.status.success,
  display: 'inline-block',
  fontFamily: theme.typography.fontFamily.body,
  fontSize: '0.68rem',
  fontWeight: 600,
  letterSpacing: '0.12em',
  padding: '3px 10px',
  textTransform: 'uppercase',
})
