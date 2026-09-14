import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { coarseTouch, visuallyHidden } from './rules'
import { theme } from './theme.css'
import { space } from './tokens'

export const button = recipe({
	base: {
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		cursor: 'pointer',
		whiteSpace: 'nowrap',
		textAlign: 'center',
		selectors: { '&:hover': { textDecoration: 'none' }, '&:disabled': { cursor: 'default', opacity: 0.5 } }
	},
	variants: {
		variant: {
			vermilion: {
				background: theme.vermilion,
				border: `1px solid ${theme.vermilion}`,
				color: theme.onVermilion,
				padding: `${space[2]} ${space[4]}`,
				...coarseTouch
			},
			toggle: {
				background: 'none',
				border: `1px solid ${theme.shade}`,
				color: theme.ink,
				padding: `${space[1.25]} 11px`,
				...coarseTouch
			},
			outline: {
				background: 'none',
				border: `1px solid ${theme.rule}`,
				color: theme.ink,
				padding: `${space[1.5]} ${space[3]}`,
				...coarseTouch,
				selectors: { '&:hover': { borderColor: theme.vermilion } }
			},
			danger: {
				background: 'none',
				border: `1px solid ${theme.vermilion}`,
				color: theme.vermilion,
				padding: `${space[1.5]} ${space[3]}`,
				...coarseTouch
			}
		}
	},
	defaultVariants: { variant: 'vermilion' }
})

export const screenReaderOnly = style(visuallyHidden)
