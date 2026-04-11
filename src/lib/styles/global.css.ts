import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from './theme.css'

globalStyle('[hidden]', { display: 'none !important' })

globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box',
  margin: 0,
  padding: 0,
})

globalStyle('html', {
  overflowX: 'hidden',
  scrollBehavior: 'smooth',
  width: '100%',
})

globalStyle('body', {
  background: theme.colors.background.root,
  color: theme.colors.foreground.root,
  display: 'flex',
  flexDirection: 'column',
  fontFamily: theme.typography.fontFamily.body,
  fontSize: '100%',
  lineHeight: theme.typography.lineHeight.normal,
  minHeight: '100vh',
  MozOsxFontSmoothing: 'grayscale',
  overflowX: 'hidden',
  WebkitFontSmoothing: 'antialiased',
  width: '100%',
})

globalStyle('h1, h2, h3, h4, h5, h6', {
  fontFamily: theme.typography.fontFamily.heading,
  lineHeight: theme.typography.lineHeight.tight,
  scrollMarginTop: '2rem',
})

globalStyle('a', {
  color: theme.colors.brand.dim,
  textDecoration: 'none',
})

globalStyle('a:hover', {
  textDecoration: 'underline',
})

globalStyle(':focus-visible', {
  outline: `3px solid ${theme.colors.brand.accent}`,
  outlineOffset: '2px',
})

globalStyle(':focus:not(:focus-visible)', {
  outline: 'none',
})

globalStyle('strong', {
  fontWeight: theme.typography.fontWeight.bold,
})

globalStyle('p br, div br', {
  content: '\'\'',
  display: 'block',
  marginBottom: '8px',
})

export const skipLink = style({
  background: theme.colors.brand.accent,
  borderRadius: `0 0 ${theme.radius.base} ${theme.radius.base}`,
  color: theme.colors.foreground.root,
  fontFamily: theme.typography.fontFamily.body,
  fontSize: '0.95rem',
  fontWeight: theme.typography.fontWeight.medium,
  left: '1rem',
  padding: `${theme.spacing[3]} ${theme.spacing[6]}`,
  position: 'absolute',
  selectors: {
    '&:focus-visible': {
      textDecoration: 'none',
      top: '0',
    },
  },
  top: '-100%',
  transition: `top ${theme.transition.fast}`,
  zIndex: theme.zIndex.skipLink,
})

export const mainContent = style({
  flex: 1,
})
