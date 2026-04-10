import { keyframes, style, styleVariants } from '@vanilla-extract/css'

import { theme } from '../../../styles/theme.css'

const cardEnter = keyframes({
  from: { opacity: 0, transform: 'translateY(20px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
})

export const root = style({
  '@media': {
    '(max-width: 1100px)': {
      flexDirection: 'column',
      minHeight: 'auto',
    },
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
      transition: 'none',
    },
  },
  animation: `${cardEnter} 0.45s ease-out both`,
  background: theme.colors.background.card,
  border: `1px solid ${theme.colors.border.base}`,
  borderRadius: theme.radius.sm,
  boxShadow: theme.shadow.base,
  display: 'flex',
  minHeight: '200px',
  overflow: 'hidden',
  selectors: {
    '&:hover': {
      boxShadow: theme.shadow.lg,
      transform: 'translateY(-2px)',
    },
  },
  textDecoration: 'none',
  transition: `box-shadow ${theme.transition.slow}, transform ${theme.transition.slow}`,
})

export const imageWrapper = style({
  '@media': {
    '(max-width: 1100px)': {
      aspectRatio: '16 / 9',
      height: 'auto',
      width: '100%',
    },
  },
  flexShrink: 0,
  overflow: 'hidden',
  width: '35%',
})

export const image = style({
  display: 'block',
  height: '100%',
  objectFit: 'cover',
  selectors: {
    [`${root}:hover &`]: {
      transform: 'scale(1.05)',
    }
  },
  transition: `transform ${theme.transition.slow}`,
  width: '100%'
})

export const content = style({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  gap: theme.spacing[3],
  justifyContent: 'center',
  padding: `${theme.spacing[5]} ${theme.spacing[5]} ${theme.spacing[5]} ${theme.spacing[1]}`,
})

export const header = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[1],
})

export const titleRow = style({
  alignItems: 'baseline',
  display: 'flex',
  gap: theme.spacing[3],
  justifyContent: 'space-between',
})

export const titleClamping = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const regionBadge = style({
  color: theme.colors.common.green,
})

export const typeTag = style({
  color: theme.colors.common.brown,
})

export const descriptionClamping = style({
  color: theme.colors.foreground.mid,
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 3,
})
