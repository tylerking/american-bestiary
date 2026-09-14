import { assignVars, createGlobalTheme, createGlobalThemeContract, globalStyle } from '@vanilla-extract/css'
import { gold, shadow, surroundDay, translucent, umber, vellum, vermilion, white } from './tokens'

export const theme = createGlobalThemeContract(
	{
		vellum: 'vellum',
		ink: 'ink',
		faint: 'faint',
		shade: 'shade',
		rule: 'rule',
		vermilion: 'vermilion',
		gold: 'gold',
		surround: 'surround',
		plateMat: 'plate-mat',
		plateRule: 'plate-rule',
		plateGold: 'plate-gold',
		plateVermilion: 'plate-vermilion',
		landmass: 'landmass',
		landmassHover: 'landmass-hover',
		dotFill: 'dot-fill',
		mapLine: 'map-line',
		onVermilion: 'on-vermilion',
		leafShadow: 'leaf-shadow'
	},
	(value) => `theme-${value}`
)

export const themeSurround = { light: vellum[300], dark: umber[950] } as const

const day = {
	vellum: vellum[100],
	ink: umber[850],
	faint: umber[500],
	shade: vellum[200],
	rule: vellum[300],
	vermilion: vermilion[700],
	gold: gold[700],
	surround: surroundDay,
	plateMat: vellum[100],
	plateRule: translucent.umberRule,
	plateGold: gold[700],
	plateVermilion: vermilion[700],
	landmass: vellum[400],
	landmassHover: vellum[600],
	dotFill: gold[800],
	mapLine: umber[800],
	onVermilion: white,
	leafShadow: shadow.leafDay
}

const night = {
	vellum: umber[850],
	ink: vellum[100],
	faint: vellum[300],
	shade: umber[700],
	rule: umber[500],
	vermilion: vermilion[400],
	gold: gold[400],
	surround: umber[950],
	plateMat: umber[850],
	plateRule: translucent.vellumRule,
	plateGold: umber[600],
	plateVermilion: vermilion[400],
	landmass: umber[650],
	landmassHover: umber[450],
	dotFill: gold[400],
	mapLine: vellum[450],
	onVermilion: umber[850],
	leafShadow: shadow.leafNight
}

export const palette = { light: day, dark: night } as const

createGlobalTheme(':root', theme, day)

globalStyle(':root', {
	colorScheme: 'light',
	'@media': { '(prefers-color-scheme: dark)': { colorScheme: 'dark', vars: assignVars(theme, night) } }
})
