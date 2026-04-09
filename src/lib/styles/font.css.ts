import { globalFontFace } from '@vanilla-extract/css'

globalFontFace('Fraunces', {
  fontDisplay: 'swap',
  fontStyle: 'normal',
  fontWeight: '100 900',
  src: 'url(\'/fonts/Fraunces-Variable.woff2\') format(\'woff2-variations\')',
})

globalFontFace('Fraunces', {
  fontDisplay: 'swap',
  fontStyle: 'italic',
  fontWeight: '100 900',
  src: 'url(\'/fonts/Fraunces-Italic-Variable.woff2\') format(\'woff2-variations\')',
})
