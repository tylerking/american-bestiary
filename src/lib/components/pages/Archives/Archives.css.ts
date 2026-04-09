import { style } from '@vanilla-extract/css'

import { theme } from '../../../styles/theme.css'

export const root = style({
  paddingTop: theme.spacing[6],
})

export const pageHeader = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[2],
  marginBottom: theme.spacing[6],
})

export const categoryRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing[2],
  marginBottom: theme.spacing[6],
})

export const categoryPill = style({
  background: 'none',
  border: `1.5px solid ${theme.colors.border.base}`,
  borderRadius: theme.radius.sm,
  color: theme.colors.foreground.mid,
  cursor: 'pointer',
  fontFamily: theme.typography.fontFamily.body,
  minHeight: '44px',
  padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
  selectors: {
    '&:focus-visible': {
      outline: `3px solid ${theme.colors.brand.accent}`,
      outlineOffset: '2px',
    },
    '&:hover': {
      borderColor: theme.colors.brand.dim,
      color: theme.colors.brand.primary,
    },
  },
  transition: `color ${theme.transition.fast}, border-color ${theme.transition.fast}, background ${theme.transition.fast}`,
})

export const categoryPillActive = style({
  background: theme.colors.brand.primary,
  borderColor: theme.colors.brand.primary,
  color: theme.colors.background.root,
  selectors: {
    '&:hover': {
      borderColor: theme.colors.brand.secondary,
      color: theme.colors.background.root,
    },
  },
})

export const controls = style({
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing[3],
  marginBottom: theme.spacing[4],
})

export const filterLabel = style({
  color: theme.colors.foreground.muted,
  flexShrink: 0,
})

export const count = style({
  color: theme.colors.foreground.muted,
  fontSize: '0.875rem',
  fontStyle: 'italic',
  whiteSpace: 'nowrap',
})

export const activeFilter = style({
  borderLeft: `3px solid ${theme.colors.brand.accent}`,
  marginBottom: theme.spacing[4],
  padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
})

export const grid = style({
  '@media': {
    '(max-width: 700px)': {
      gap: theme.spacing[5],
      gridTemplateColumns: '1fr',
    },
  },
  display: 'grid',
  gap: '28px',
  gridTemplateColumns: 'repeat(2, 1fr)',
  paddingBottom: '4.5rem',
})

export const empty = style({
  alignItems: 'center',
  color: theme.colors.foreground.muted,
  display: 'flex',
  flexDirection: 'column',
  fontSize: '1.1rem',
  fontStyle: 'italic',
  gap: theme.spacing[4],
  gridColumn: '1 / -1',
  padding: '60px 0',
  textAlign: 'center',
})

export const button = style({
  background: 'none',
  border: `1.5px solid ${theme.colors.brand.dim}`,
  borderRadius: theme.radius.sm,
  color: theme.colors.brand.dim,
  cursor: 'pointer',
  fontFamily: theme.typography.fontFamily.body,
  fontSize: '0.9rem',
  fontStyle: 'normal',
  minHeight: '44px',
  padding: `${theme.spacing[2]} ${theme.spacing[5]}`,
  selectors: {
    '&:focus-visible': {
      borderColor: theme.colors.brand.accent,
      color: theme.colors.brand.accent,
      outline: `3px solid ${theme.colors.brand.accent}`,
      outlineOffset: '2px',
    },
    '&:hover': {
      borderColor: theme.colors.brand.accent,
      color: theme.colors.brand.accent,
    },
  },
  transition: `color ${theme.transition.fast}, border-color ${theme.transition.fast}`,
})

export const clearRow = style({
  display: 'flex',
  justifyContent: 'center',
  paddingBottom: theme.spacing[8],
})

export const clearButton = style({
  background: 'none',
  border: 'none',
  color: theme.colors.brand.dim,
  cursor: 'pointer',
  fontFamily: theme.typography.fontFamily.body,
  fontSize: '0.85rem',
  minHeight: '44px',
  padding: theme.spacing[2],
  selectors: {
    '&:focus-visible': {
      outline: `3px solid ${theme.colors.brand.accent}`,
      outlineOffset: '2px',
    },
    '&:hover': {
      color: theme.colors.brand.primary,
      textDecoration: 'underline',
    },
  },
  transition: `color ${theme.transition.fast}`,
})
