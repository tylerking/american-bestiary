import { createGlobalTheme, createThemeContract, style } from '@vanilla-extract/css'

import { tokens } from './tokens'

export const theme = createThemeContract({
  colors: {
    background: {
      card: null,
      popover: null,
      root: null,
      subtle: null,
      surface: null,
    },
    border: {
      base: null,
      focus: null,
      muted: null,
    },
    brand: {
      accent: null,
      dim: null,
      primary: null,
      secondary: null,
    },
    common: {
      blue: null,
      brown: null,
      green: null,
      orange: null,
      purple: null,
      red: null,
      teal: null,
    },
    foreground: {
      inverse: null,
      mid: null,
      muted: null,
      root: null,
    },
    neutral: {
      100: null, 200: null, 300: null, 400: null, 500: null, 600: null,
    },
    status: {
      error: null,
      info: null,
      success: null,
      warning: null,
    },
  },

  radius: {
    base: null, full: null, lg: null, md: null, none: null, sm: null,
  },

  shadow: {
    base: null, lg: null,
  },

  sizing: {
    wrapper: { maxWidth: null },
  },

  spacing: {
    0: null, 0.5: null, 1: null, 1.5: null, 10: null, 11: null, 12: null, 14: null,
    16: null, 2: null, 2.5: null, 20: null, 24: null, 28: null, '2xl': null, 3: null,
    3.5: null, 32: null, 36: null, '3xl': null, 4: null, 40: null, 44: null,
    48: null, '4xl': null, 5: null, 52: null, 56: null, '5xl': null, 6: null,
    60: null, 64: null, 72: null,
    8: null, 80: null, 9: null, 96: null, full: null, lg: null,
    md: null, px: null, sm: null, vh: null,
    vw: null, xl: null, xs: null,
  },

  transition: {
    base: null, fast: null, slow: null,
  },

  typography: {
    fontFamily: {
      body: null, heading: null, mono: null,
    },
    fontSize: {
      body: null, caption: null, h1: null, h2: null, h3: null,
      h4: null, h5: null, small: null,
    },
    fontWeight: {
      black: null, bold: null, extrabold: null, extralight: null, light: null,
      medium: null, normal: null, semibold: null, thin: null,
    },
    letterSpacing: {
      normal: null, tight: null, tighter: null, wide: null, wider: null, widest: null,
    },
    lineHeight: {
      loose: null, none: null, normal: null, relaxed: null, snug: null, tight: null,
    },
  },

  zIndex: {
    auto: null, banner: null, base: null, docked: null, dropdown: null,
    hide: null, modal: null, overlay: null, popover: null, skipLink: null,
    sticky: null, toast: null, tooltip: null,
  },
})

createGlobalTheme(':root', theme, {
  colors: {
    background: {
      card: tokens.colors.cream[100],
      popover: tokens.colors.cream[100],
      root: tokens.colors.cream[200],
      subtle: tokens.colors.cream[200],
      surface: tokens.colors.cream[100],
    },
    border: {
      base: tokens.colors.neutral[100],
      focus: tokens.colors.brand.accent,
      muted: tokens.colors.neutral[100],
    },
    brand: tokens.colors.brand,
    common: {
      blue: tokens.colors.common.blue,
      brown: tokens.colors.common.brown,
      green: tokens.colors.common.green,
      orange: tokens.colors.common.orange,
      purple: tokens.colors.common.purple,
      red: tokens.colors.common.red,
      teal: tokens.colors.common.teal,
    },
    foreground: {
      inverse: tokens.colors.cream[200],
      mid: tokens.colors.neutral[500],
      muted: tokens.colors.neutral[400],
      root: tokens.colors.neutral[600],
    },
    neutral: tokens.colors.neutral,
    status: {
      error: tokens.colors.common.red,
      info: tokens.colors.common.blue,
      success: tokens.colors.common.green,
      warning: tokens.colors.common.orange,
    },
  },

  radius: tokens.radius,
  shadow: tokens.shadow,

  sizing: {
    wrapper: {
      maxWidth: tokens.sizing.wrapper.maxWidth,
    },
  },

  spacing: tokens.spacing,
  transition: tokens.transition,

  typography: {
    fontFamily: tokens.typography.fontFamily,
    fontSize: tokens.typography.fontSize,
    fontWeight: {
      black: tokens.typography.fontWeight.black.toString(),
      bold: tokens.typography.fontWeight.bold.toString(),
      extrabold: tokens.typography.fontWeight.extrabold.toString(),
      extralight: tokens.typography.fontWeight.extralight.toString(),
      light: tokens.typography.fontWeight.light.toString(),
      medium: tokens.typography.fontWeight.medium.toString(),
      normal: tokens.typography.fontWeight.normal.toString(),
      semibold: tokens.typography.fontWeight.semibold.toString(),
      thin: tokens.typography.fontWeight.thin.toString(),
    },
    letterSpacing: tokens.typography.letterSpacing,
    lineHeight: {
      loose: tokens.typography.lineHeight.loose.toString(),
      none: tokens.typography.lineHeight.none.toString(),
      normal: tokens.typography.lineHeight.normal.toString(),
      relaxed: tokens.typography.lineHeight.relaxed.toString(),
      snug: tokens.typography.lineHeight.snug.toString(),
      tight: tokens.typography.lineHeight.tight.toString(),
    },
  },

  zIndex: {
    auto: tokens.zIndex.auto.toString(),
    banner: tokens.zIndex.banner.toString(),
    base: tokens.zIndex.base.toString(),
    docked: tokens.zIndex.docked.toString(),
    dropdown: tokens.zIndex.dropdown.toString(),
    hide: tokens.zIndex.hide.toString(),
    modal: tokens.zIndex.modal.toString(),
    overlay: tokens.zIndex.overlay.toString(),
    popover: tokens.zIndex.popover.toString(),
    skipLink: tokens.zIndex.skipLink.toString(),
    sticky: tokens.zIndex.sticky.toString(),
    toast: tokens.zIndex.toast.toString(),
    tooltip: tokens.zIndex.tooltip.toString(),
  },
})

export const themeWrapper = style({
  backgroundColor: theme.colors.background.root,
  color: theme.colors.foreground.root,
  fontFamily: theme.typography.fontFamily.body,
  fontSize: theme.typography.fontSize.body,
  lineHeight: theme.typography.lineHeight.normal,
  minHeight: '100vh',
  position: 'relative',
  width: '100%',
})
