import { createGlobalTheme, createGlobalThemeContract } from '@vanilla-extract/css'
import { theme } from './theme.css'

export const visualization = createGlobalThemeContract(
	{ column: 'column', grid: 'grid', track: 'track', fill: 'fill', axis: 'axis' },
	(value) => `visualization-${value}`
)

createGlobalTheme(':root', visualization, {
	column: theme.vermilion,
	grid: theme.shade,
	track: theme.shade,
	fill: theme.gold,
	axis: theme.ink
})
