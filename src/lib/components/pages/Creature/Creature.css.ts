import { style, styleVariants } from '@vanilla-extract/css'

import { theme } from '../../../styles/theme.css'

export const root = style({
  padding: `${theme.spacing[10]} 0 ${theme.spacing[20]}`,
})

export const back = style({
  margin: '0 auto 1rem',
  maxWidth: '860px',
})

export const article = style({
  background: theme.colors.background.card,
  border: `1px solid ${theme.colors.border.base}`,
  boxShadow: theme.shadow.base,
  margin: '0 auto',
  maxWidth: '860px',
  padding: 'clamp(1.5rem, 5vw, 3.5rem) clamp(1.25rem, 6vw, 4rem)',
})

export const header = style({
  borderBottom: `1.5px solid ${theme.colors.brand.accent}`,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[1],
  paddingBottom: '1.25rem',
})

export const titleRow = style({
  alignItems: 'center',
  display: 'flex',
  flexWrap: 'nowrap',
  gap: theme.spacing[4],
  justifyContent: 'space-between',
  width: '100%',
})

export const name = style({
  margin: 0,
  minWidth: 0,
})

export const classification = style({
  color: theme.colors.foreground.muted,
  margin: 0,
})

export const regionBadge = style({
  color: theme.colors.common.green,
  flexShrink: 0,
  whiteSpace: 'nowrap',
})

export const plate = style({
  '@media': {
    '(max-width: 700px)': {
      float: 'none',
      margin: `${theme.spacing[6]} auto`,
      maxWidth: '360px',
      width: '100%',
    },
  },
  float: 'right',
  margin: `${theme.spacing[5]} 0 ${theme.spacing[5]} ${theme.spacing[8]}`,
  width: 'clamp(240px, 44%, 380px)',
})

export const image = style({
  border: `1px solid ${theme.colors.border.base}`,
  display: 'block',
  height: 'auto',
  width: '100%',
})

export const plateCaption = style({
  color: theme.colors.foreground.muted,
  fontSize: '0.8rem',
  fontStyle: 'italic',
  marginTop: theme.spacing[2],
  paddingTop: theme.spacing[2],
  textAlign: 'center',
})

export const body = style({
  paddingTop: theme.spacing[6],
  selectors: {
    '&::after': {
      clear: 'both',
      content: '\'\'',
      display: 'table',
    },
  },
})

export const section = style({
  borderLeft: `2px solid ${theme.colors.brand.accent}`,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[3],
  marginBottom: '2.5rem',
  paddingLeft: theme.spacing[5],
})

export const abstractSection = style({
  marginBottom: '2.5rem',
})

export const sectionLabel = style({
  color: theme.colors.brand.primary,
  fontSize: '0.72rem',
  fontWeight: theme.typography.fontWeight.bold,
  letterSpacing: theme.typography.letterSpacing.wider,
  textTransform: 'uppercase',
})

export const sourceSection = style({
  background: theme.colors.background.subtle,
  border: `1px solid ${theme.colors.border.base}`,
  borderRadius: theme.radius.sm,
  marginTop: '4rem',
  padding: `${theme.spacing[4]} ${theme.spacing[5]}`,
})

export const sourceLabel = style([sectionLabel, {
  color: theme.colors.foreground.muted,
  display: 'block',
  fontSize: '0.65rem',
  marginBottom: theme.spacing[1],
}])

export const sourceLink = style({
  alignItems: 'center',
  color: theme.colors.brand.primary,
  display: 'inline-flex',
  fontFamily: theme.typography.fontFamily.body,
  fontSize: '0.9rem',
  fontWeight: 600,
  gap: theme.spacing[2],
  selectors: {
    '&:hover': {
      color: theme.colors.brand.accent,
      textDecoration: 'underline',
    },
  },
  textDecoration: 'none',
})

export const nav = style({
  '@media': {
    '(max-width: 700px)': {
      alignItems: 'flex-start',
      flexDirection: 'column',
    },
  },
  alignItems: 'center',
  borderTop: `1.5px solid ${theme.colors.brand.accent}`,
  clear: 'both',
  display: 'flex',
  gap: theme.spacing[4],
  justifyContent: 'space-between',
  marginTop: '3rem',
  paddingTop: '1.5rem',
  width: '100%',
})

export const navLink = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[1],
  minHeight: '44px',
  padding: `${theme.spacing[2]} 0`,
  selectors: {
    '&:hover': {
      textDecoration: 'none',
    },
  },
  textDecoration: 'none',
})

export const navLabel = style({
  color: theme.colors.foreground.muted,
  fontSize: '0.75rem',
  fontWeight: 600,
  letterSpacing: theme.typography.letterSpacing.wider,
  textTransform: 'uppercase',
})

export const navName = style({
  color: theme.colors.brand.primary,
  fontFamily: theme.typography.fontFamily.heading,
  fontSize: '1.1rem',
  fontVariationSettings: '\'SOFT\' 50, \'WONK\' 1',
  fontWeight: 700,
  selectors: {
    [`${navLink}:hover &`]: {
      color: theme.colors.brand.accent,
    },
  },
  transition: `color ${theme.transition.fast}`,
})

export const navNext = style({
  '@media': {
    '(max-width: 700px)': {
      marginLeft: 0,
    },
  },
  marginLeft: 'auto',
  textAlign: 'right',
})
