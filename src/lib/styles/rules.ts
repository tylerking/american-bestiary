import type { StyleRule } from '@vanilla-extract/css'
import { breakpoint, touch } from './tokens'

export const below = (size: keyof typeof breakpoint, rule: StyleRule): StyleRule => ({
	'@media': { [`(max-width: ${breakpoint[size]})`]: rule }
})

const coarsePointer = '(any-pointer: coarse)'

export const coarse = (rule: StyleRule): StyleRule => ({ '@media': { [coarsePointer]: rule } })

export const coarseTouch: StyleRule = coarse({ minHeight: touch.min })

export const coarseSquare: StyleRule = coarse({ minWidth: touch.min, minHeight: touch.min })

export const coarseReach: StyleRule = {
	position: 'relative',
	...coarse({
		selectors: {
			'&::after': {
				content: '""',
				position: 'absolute',
				insetInline: 0,
				insetBlock: `min(0px, calc((100% - ${touch.min}) / 2 - ${touch.borderSlack}))`
			}
		}
	})
}

export const visuallyHidden: StyleRule = {
	position: 'absolute',
	width: '1px',
	height: '1px',
	padding: 0,
	margin: '-1px',
	overflow: 'hidden',
	clipPath: 'inset(50%)',
	whiteSpace: 'nowrap',
	border: 0
}
