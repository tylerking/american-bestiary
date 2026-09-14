import type { StyleRule } from '@vanilla-extract/css'
import { globalStyle, style, styleVariants } from '@vanilla-extract/css'
import { textControl, textReset, textTone, textVariant } from '$lib/styles/layers.css'
import { theme } from '$lib/styles/theme.css'
import { axes, font, type TypeRole, type } from '$lib/styles/tokens'

const base = style({ '@layer': { [textReset]: { margin: 0 } } })

function typeset(role: TypeRole): StyleRule {
	return {
		'@layer': {
			[textVariant]: {
				fontFamily: font.fraunces,
				fontStyle: role.italic ? 'italic' : 'normal',
				fontWeight: role.weight ?? 400,
				fontVariationSettings: axes[role.axes ?? 'base'],
				fontVariant: role.caps ? 'small-caps' : 'normal',
				letterSpacing: role.tracking ?? 'normal',
				...(role.size && { fontSize: role.size }),
				...(role.leading && { lineHeight: role.leading })
			}
		}
	}
}

export const variant = styleVariants(type, (role: TypeRole) => [base, typeset(role)])

globalStyle('input, textarea, select, button', {
	'@layer': { [textControl]: { font: 'inherit', color: 'inherit', fontVariationSettings: 'inherit' } }
})

const inLayer = (color: string) => ({ '@layer': { [textTone]: { color } } })

export const tone = styleVariants({
	inherit: inLayer('inherit'),
	ink: inLayer(theme.ink),
	vermilion: inLayer(theme.vermilion),
	gold: inLayer(theme.gold),
	plateVermilion: inLayer(theme.plateVermilion)
})
