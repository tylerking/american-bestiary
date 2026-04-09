import { style } from '@vanilla-extract/css'

import { theme } from '../../../styles/theme.css'

export const root = style({
  alignItems: 'baseline',
  background: theme.colors.brand.primary,
  borderLeft: `3px solid ${theme.colors.brand.accent}`,
  borderRadius: theme.radius.sm,
  boxShadow: theme.shadow.lg,
  color: theme.colors.background.root,
  display: 'flex',
  fontSize: '0.9rem',
  gap: theme.spacing[2.5],
  padding: '10px 18px',
  pointerEvents: 'none',
  position: 'fixed',
  transform: 'translate(10px, 10px)',
  whiteSpace: 'nowrap',
  zIndex: theme.zIndex.tooltip,
})

export const subtitle = style({
  color: theme.colors.neutral[300],
  fontSize: '0.72rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
})

export const title = style({
  color: theme.colors.brand.accent,
  fontFamily: theme.typography.fontFamily.heading,
  fontSize: '1rem',
  fontWeight: 700,
})
