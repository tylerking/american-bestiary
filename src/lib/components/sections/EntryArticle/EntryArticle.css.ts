import { style } from '@vanilla-extract/css'
import { layout, space } from '$lib/styles/tokens'

export const article = style({ minWidth: 0 })

export const figure = style({ margin: `0 0 ${space[7]}` })

export const enlarge = style({ cursor: 'zoom-in' })

export const caption = style({ marginTop: space[2.5] })

export const classification = style({ marginTop: space[2] })

export const body = style({ marginTop: space[6], maxWidth: layout.measure })

export const paragraph = style({ margin: '0 0 0.85em' })
