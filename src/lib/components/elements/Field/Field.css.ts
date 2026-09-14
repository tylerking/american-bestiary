import { style } from '@vanilla-extract/css'
import { coarseTouch } from '$lib/styles/rules'
import { theme } from '$lib/styles/theme.css'
import { space } from '$lib/styles/tokens'

export const label = style({ display: 'block' })

export const requiredMark = style({
	selectors: { '&::after': { content: ['"*"', '"*" / ""'], marginInlineStart: space[1], color: theme.vermilion } }
})

export const field = style({
	display: 'flex',
	flexDirection: 'column',
	gap: space[1.5],
	marginBottom: space[3.5],
	minWidth: 0
})

export const coarse = style(coarseTouch)

export const input = style({
	width: '100%',
	padding: `${space[2]} ${space[2.5]}`,
	border: `1px solid ${theme.rule}`,
	borderRadius: 0,
	background: theme.vellum,
	color: theme.ink,
	selectors: {
		'&:focus': { borderColor: theme.vermilion },
		'&[aria-invalid="true"]': { border: `2px solid ${theme.vermilion}` }
	}
})

export const textarea = style([input, { resize: 'vertical', minHeight: '6.5em', lineHeight: 1.5 }])

export const select = style([input, { appearance: 'none', paddingRight: space[8] }])

export const selectWrap = style({
	position: 'relative',
	display: 'block',
	selectors: {
		'&::after': {
			content: '""',
			position: 'absolute',
			right: space[3.5],
			top: '50%',
			width: space[1.5],
			height: space[1.5],
			borderRight: `1px solid ${theme.ink}`,
			borderBottom: `1px solid ${theme.ink}`,
			transform: 'translateY(-75%) rotate(45deg)',
			pointerEvents: 'none'
		}
	}
})

export const message = style({ display: 'block' })
