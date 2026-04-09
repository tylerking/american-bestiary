import { style } from '@vanilla-extract/css'

import { theme } from '../../../styles/theme.css'

export const root = style({
  background: theme.colors.brand.primary,
  color: theme.colors.neutral[300],
  padding: `${theme.spacing[6]} 0`,
})

export const inner = style({
  '@media': {
    '(max-width: 700px)': {
      alignItems: 'flex-start',
      flexDirection: 'column',
      gap: theme.spacing[3],
    }
  },
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing[5],
  justifyContent: 'space-between'
})

export const brandName = style({
  color: theme.colors.neutral[200],
})

export const link = style({
  selectors: {
    '&&': {
      color: theme.colors.brand.accent,
      textDecoration: 'underline',
    },
  },
})

export const srOnly = style({
  border: 0,
  clip: 'rect(0, 0, 0, 0)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: '1px',
})
