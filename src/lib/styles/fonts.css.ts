import { globalFontFace } from '@vanilla-extract/css'
import { fontFile } from './tokens'

globalFontFace('Fraunces', {
	fontDisplay: 'optional',
	fontStyle: 'normal',
	fontWeight: '100 900',
	src: `url('${fontFile.frauncesRoman}') format('woff2-variations')`
})

globalFontFace('Fraunces', {
	fontDisplay: 'optional',
	fontStyle: 'italic',
	fontWeight: '100 900',
	src: `url('${fontFile.frauncesItalic}') format('woff2-variations')`
})

globalFontFace('Fraunces Fallback', {
	src: "local('Georgia')",
	sizeAdjust: '102%',
	ascentOverride: '97.8%',
	descentOverride: '25.5%',
	lineGapOverride: '0%'
})
