import { keyframes, style } from '@vanilla-extract/css'

import { theme } from '../../../styles/theme.css'

export const root = style({
  alignItems: 'center',
  color: theme.colors.foreground.muted,
  display: 'flex',
  flexDirection: 'column',
  fontStyle: 'italic',
  gap: '16px',
  justifyContent: 'center',
  padding: '80px 0',
})

const spin = keyframes({
  to: { transform: 'rotate(360deg)' },
})

export const spinner = style({
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
  animation: `${spin} 0.8s linear infinite`,
  border: `3px solid ${theme.colors.border.base}`,
  borderRadius: '50%',
  borderTopColor: theme.colors.brand.accent,
  height: '40px',
  width: '40px',
})
