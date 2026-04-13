import { keyframes, style } from '@vanilla-extract/css'

import { theme } from '../../../styles/theme.css'

const cardEnter = keyframes({
  from: { opacity: 0, transform: 'translateY(20px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
})

export const root = style({
  '@media': {
    '(max-width: 700px)': {
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
  flexDirection: 'row',
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
    '(max-width: 700px)': {
      order: 3,
      width: '100%',
    },
    '(min-width: 701px) and (max-width: 1100px)': {
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
  '@media': {
    '(max-width: 700px)': {
      height: 'auto',
      objectFit: 'contain',
    },
  },
  display: 'block',
  height: '100%',
  objectFit: 'cover',
  selectors: {
    [`${root}:hover &`]: {
      transform: 'scale(1.05)',
    },
  },
  transition: `transform ${theme.transition.slow}`,
  width: '100%',
})

export const content = style({
  '@media': {
    '(max-width: 700px)': {
      display: 'contents',
    },
  },
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  gap: theme.spacing[3],
  justifyContent: 'center',
  padding: `${theme.spacing[5]} ${theme.spacing[6]}`,
})

export const header = style({
  '@media': {
    '(max-width: 700px)': {
      display: 'contents',
    },
  },
  display: 'grid',
  gap: theme.spacing[1],
  gridTemplateAreas: '"title region" "type type"',
  gridTemplateColumns: '1fr auto',
})

export const cardTitle = style({
  '@media': {
    '(max-width: 700px)': {
      order: 1,
      padding: `${theme.spacing[5]} ${theme.spacing[6]} 0`,
    },
  },
  fontSize: 'clamp(1.1rem, 2vw + 0.5rem, 1.42em)',
  gridArea: 'title',
  lineHeight: 1.2,
})

export const typeTag = style({
  '@media': {
    '(max-width: 700px)': {
      order: 2,
      padding: `0 ${theme.spacing[6]} ${theme.spacing[2]}`,
    },
  },
  color: theme.colors.common.brown,
  gridArea: 'type',
})

export const regionBadge = style({
  '@media': {
    '(max-width: 700px)': {
      alignSelf: 'flex-start',
      margin: `${theme.spacing[3]} ${theme.spacing[6]}`,
      order: 4,
    },
  },
  color: theme.colors.common.green,
  gridArea: 'region',
})

export const descriptionClamping = style({
  '@media': {
    '(max-width: 700px)': {
      display: 'block',
      order: 5,
      padding: `0 ${theme.spacing[6]} ${theme.spacing[14]}`,
      WebkitLineClamp: 'initial',
    },
  },
  color: theme.colors.foreground.mid,
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 3,
})
