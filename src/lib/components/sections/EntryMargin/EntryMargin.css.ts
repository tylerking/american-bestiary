import { style } from '@vanilla-extract/css'
import { coarse, coarseReach } from '$lib/styles/rules'
import { space } from '$lib/styles/tokens'

export const margin = style({ display: 'flex', flexDirection: 'column', gap: space[5] })

export const first = style({ margin: `${space[1.25]} 0 0` })

export const second = style({ margin: `${space[0.5]} 0 0` })

export const sourceLink = style({
	display: 'inline-block',
	paddingBlock: space[0.75],
	marginBlock: `-${space[0.75]}`,
	...coarseReach
})

export const sourceLine = style(coarse({ marginTop: space[7.5] }))
