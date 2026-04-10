import { style, styleVariants } from '@vanilla-extract/css'

import { theme } from '../../../styles/theme.css'

export const root = style({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[4],
  width: '100%',
})

export const hint = style({
  color: theme.colors.foreground.muted,
  fontSize: '0.85rem',
  fontStyle: 'italic',
})

export const container = style({
  position: 'relative',
  width: '100%',
})

export const mapSvg = style({
  display: 'block',
  height: 'auto',
  overflow: 'visible',
  width: '100%',
})

export const mapPath = style({
  fill: theme.colors.background.subtle,
  stroke: 'none !important',
  transition: `fill ${theme.transition.base}`,
})

export const stateGroup = style({
  cursor: 'pointer',
  outline: 'none',
  selectors: {
    '&:focus-visible': {
      outline: `3px solid ${theme.colors.brand.accent}`,
      outlineOffset: '2px',
    },
  },
})

export const creatureImage = style({
  opacity: 0,
  pointerEvents: 'none',
  transition: `opacity ${theme.transition.slow}`,
})

export const strokeLayer = style({
  fill: 'none !important',
  pointerEvents: 'none',
  stroke: `${theme.colors.background.card} !important`,
  strokeWidth: '1.5px !important',
})

const mapColors = {
  blue: theme.colors.common.blue,
  brown: theme.colors.common.brown,
  green: theme.colors.common.green,
  orange: theme.colors.common.orange,
  purple: theme.colors.common.purple,
  red: theme.colors.common.red,
  teal: theme.colors.common.teal,
} as const

export const hasCreature = style({})

export const stateColor = styleVariants(mapColors, (color) => ({
  fill: `${color} !important`,
}))

export const retryButton = style({
  background: 'none',
  border: `1.5px solid ${theme.colors.brand.dim}`,
  borderRadius: theme.radius.sm,
  color: theme.colors.brand.dim,
  cursor: 'pointer',
  fontFamily: theme.typography.fontFamily.body,
  fontSize: '0.9rem',
  marginTop: theme.spacing[4],
  minHeight: '44px',
  padding: `${theme.spacing[2]} ${theme.spacing[5]}`,
  selectors: {
    '&:focus-visible': {
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

export const mobileSearch = style({
  '@media': {
    '(min-width: 701px)': {
      display: 'none',
    },
  },
  padding: `0 ${theme.spacing[4]}`,
  position: 'relative',
  width: '100%',
})

export const searchWrapper = style({
  position: 'relative',
  width: '100%',
})

export const searchInput = style({
  background: theme.colors.background.card,
  border: `2px solid ${theme.colors.border.base}`,
  borderRadius: theme.radius.sm,
  color: theme.colors.foreground.root,
  fontFamily: theme.typography.fontFamily.body,
  fontSize: '1rem',
  minHeight: '44px',
  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
  selectors: {
    '&:focus-visible': {
      borderColor: theme.colors.brand.accent,
      outline: `3px solid ${theme.colors.border.focus}`,
      outlineOffset: '2px',
    },
  },
  transition: `border-color ${theme.transition.base}`,
  width: '100%',
})

export const searchDropdown = style({
  background: theme.colors.background.card,
  border: `1px solid ${theme.colors.border.base}`,
  borderRadius: theme.radius.sm,
  boxShadow: theme.shadow.lg,
  left: 0,
  listStyle: 'none',
  marginTop: theme.spacing[1],
  maxHeight: '400px',
  overflowY: 'auto',
  position: 'absolute',
  right: 0,
  zIndex: theme.zIndex.dropdown,
})

export const searchResult = style({
  alignItems: 'center',
  color: theme.colors.foreground.root,
  display: 'flex',
  gap: theme.spacing[3],
  minHeight: '44px',
  padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
  selectors: {
    '&:hover': {
      background: theme.colors.background.subtle,
      textDecoration: 'none',
    },
  },
  textDecoration: 'none',
})

export const searchResultImage = style({
  borderRadius: theme.radius.sm,
  flexShrink: 0,
  height: '40px',
  overflow: 'hidden',
  width: '40px',
})

export const searchResultImg = style({
  display: 'block',
  height: '100%',
  objectFit: 'cover',
  width: '100%',
})

export const searchResultInfo = style({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  gap: '2px',
  minWidth: 0,
})

export const searchResultName = style({
  fontWeight: theme.typography.fontWeight.bold,
})
