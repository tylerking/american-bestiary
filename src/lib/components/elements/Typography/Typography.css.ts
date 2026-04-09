import { style } from '@vanilla-extract/css'

import { theme } from '../../../styles/theme.css'

export const h1 = style({
  color: theme.colors.brand.primary,
  fontFamily: theme.typography.fontFamily.heading,
  fontSize: theme.typography.fontSize.h1,
  fontVariationSettings: '\'SOFT\' 100, \'WONK\' 1',
  fontWeight: 900,
  letterSpacing: '0.01em',
  lineHeight: 1.1,
})

export const h2 = style({
  color: theme.colors.brand.primary,
  fontFamily: theme.typography.fontFamily.heading,
  fontSize: theme.typography.fontSize.h2,
  fontVariationSettings: '\'SOFT\' 50, \'WONK\' 1',
  fontWeight: 800,
  lineHeight: 1.2,
})

export const h3 = style({
  color: theme.colors.brand.primary,
  fontFamily: theme.typography.fontFamily.heading,
  fontSize: theme.typography.fontSize.h3,
  fontVariationSettings: '\'SOFT\' 20, \'WONK\' 1',
  fontWeight: 700,
  lineHeight: 1.3,
})

export const h4 = style({
  color: theme.colors.brand.primary,
  fontFamily: theme.typography.fontFamily.heading,
  fontSize: theme.typography.fontSize.h4,
  fontWeight: 700,
  lineHeight: 1.4,
})

export const h5 = style({
  color: theme.colors.brand.primary,
  fontFamily: theme.typography.fontFamily.heading,
  fontSize: theme.typography.fontSize.h5,
  fontWeight: 600,
  lineHeight: 1.5,
})

export const body = style({
  color: theme.colors.foreground.root,
  fontFamily: theme.typography.fontFamily.body,
  fontSize: theme.typography.fontSize.body,
  fontVariationSettings: '\'SOFT\' 0, \'WONK\' 0',
  lineHeight: 1.65,
})

export const caption = style({
  color: theme.colors.foreground.mid,
  fontFamily: theme.typography.fontFamily.body,
  fontSize: theme.typography.fontSize.caption,
  lineHeight: 1.5,
})

export const small = style({
  color: theme.colors.foreground.muted,
  fontFamily: theme.typography.fontFamily.body,
  fontSize: theme.typography.fontSize.small,
  lineHeight: 1.4,
})

export const display = style([h1, {
  fontSize: 'clamp(2rem, 5vw, 3.25rem)',
}])

export const prose = style([body, {
  '@media': {
    '(max-width: 700px)': {
      selectors: {
        '&::first-letter': {
          fontSize: '3em',
        },
      },
    },
  },
  fontSize: '1.1rem',
  lineHeight: '1.8',
  selectors: {
    '&::first-letter': {
      color: theme.colors.brand.dim,
      float: 'left',
      fontFamily: theme.typography.fontFamily.heading,
      fontSize: '3.6em',
      fontVariationSettings: '\'SOFT\' 100, \'WONK\' 1',
      fontWeight: 900,
      lineHeight: '0.78',
      margin: '0.08em 0.08em 0 0',
    },
  },
}])

export const badge = style({
  border: '1.5px solid currentColor',
  borderRadius: theme.radius.sm,
  display: 'inline-block',
  fontFamily: theme.typography.fontFamily.body,
  fontSize: '0.68rem',
  fontWeight: 600,
  letterSpacing: '0.12em',
  padding: '2px 8px',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
})

export const label = style({
  fontFamily: theme.typography.fontFamily.body,
  fontSize: '0.75rem',
  fontWeight: 500,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
})

export const nav = style({
  fontFamily: theme.typography.fontFamily.body,
  fontSize: '0.85rem',
  fontWeight: 500,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
})

export const tagline = style({
  fontSize: '0.82rem',
  fontStyle: 'italic',
})
