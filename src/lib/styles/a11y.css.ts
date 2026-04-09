import { globalStyle, style } from '@vanilla-extract/css'

globalStyle('*, *::before, *::after', {
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animationDuration: '0.01ms !important',
      animationIterationCount: '1 !important',
      transitionDuration: '0.01ms !important'
    }
  }
})

export const visuallyHidden = style({
  border: 0,
  clip: 'rect(0, 0, 0, 0)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  selectors: {
    '&:focus': {
      clip: 'auto',
      height: 'auto',
      margin: 'inherit',
      overflow: 'visible',
      padding: 'inherit',
      position: 'static',
      whiteSpace: 'normal',
      width: 'auto'
    }
  },
  whiteSpace: 'nowrap',
  width: '1px'
})
