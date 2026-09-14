import { style } from '@vanilla-extract/css'
import { below } from '$lib/styles/rules'
import { space } from '$lib/styles/tokens'

export const section = style({ marginBottom: space[12] })

export const columns = style({ columns: 2, columnGap: space[10], ...below('narrow', { columns: 1 }) })

export const paragraph = style({ margin: 0 })
