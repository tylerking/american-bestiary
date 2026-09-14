import { layer, style } from '@vanilla-extract/css'

const resetLayer = layer('reset')

export const bareFieldset = style({
	'@layer': { [resetLayer]: { border: 0, margin: 0, padding: 0, minInlineSize: 'auto' } }
})
