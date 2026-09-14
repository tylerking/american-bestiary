import { globalStyle, style } from '@vanilla-extract/css'
import { below, coarseSquare, coarseTouch } from './rules'
import { theme } from './theme.css'
import { layout, space, touch, zIndex } from './tokens'

export const railNavigation = style({
	display: 'flex',
	flexDirection: 'column',
	gap: space[5],
	...below('narrow', { flexDirection: 'row', flexWrap: 'wrap', gap: `${space[2]} ${space[6]}` })
})

export const navigationGroup = style({
	display: 'flex',
	flexDirection: 'column',
	gap: space[0.5],
	...below('narrow', { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: space[3] })
})

export const navigationGroupTitle = style({
	borderBottom: `1px solid ${theme.rule}`,
	paddingBottom: space[1],
	marginBottom: space[1],
	...below('narrow', { borderBottom: 'none', paddingBottom: 0, marginBottom: 0 })
})

export const railLink = style({
	display: 'flex',
	alignItems: 'center',
	minHeight: touch.fine,
	padding: `${space[1]} 0 ${space[1]} ${space[2.5]}`,
	borderLeft: '2px solid transparent',
	color: theme.ink,
	...coarseTouch,
	selectors: {
		'&:hover': { textDecoration: 'none', borderLeftColor: theme.rule },
		'&[aria-current="page"]': { color: theme.vermilion, borderLeftColor: theme.vermilion }
	}
})

export const navigationButton = style([
	railLink,
	{
		width: '100%',
		background: 'none',
		border: 'none',
		borderLeft: '2px solid transparent',
		cursor: 'pointer',
		textAlign: 'left'
	}
])

export const railFooter = style({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-start',
	marginTop: space[6],
	borderTop: `1px solid ${theme.rule}`,
	paddingTop: space[4],
	...below('narrow', { marginTop: space[3], paddingTop: space[3] })
})

export const pageNarrow = style({ maxWidth: layout.loginWidth, margin: '0 auto' })

export const pageHeader = style({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'flex-end',
	gap: space[4],
	flexWrap: 'wrap',
	borderBottom: `1px solid ${theme.rule}`,
	paddingBottom: space[3.5],
	marginBottom: space[6]
})

export const eyebrow = style({ display: 'block', marginBottom: space[1.5] })

export const headerLinks = style({ display: 'flex', flexWrap: 'wrap', gap: space[4] })

globalStyle(`${headerLinks} > a`, {
	display: 'inline-flex',
	alignItems: 'center',
	minHeight: touch.fine,
	...coarseTouch
})

export const sectionHeading = style({ margin: `${space[8]} 0 ${space[3]}` })

export const subsectionHeading = style({ margin: `${space[5]} 0 ${space[2.5]}` })

export const lead = style({ margin: `0 0 ${space[5]}`, maxWidth: layout.measure })

export const card = style({
	border: `1px solid ${theme.rule}`,
	background: theme.plateMat,
	padding: space[5],
	marginBottom: space[4],
	minWidth: 0,
	...below('small', { padding: space[3.5] })
})

export const twoColumn = style({
	display: 'grid',
	gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
	columnGap: space[4],
	...below('small', { gridTemplateColumns: 'minmax(0, 1fr)' })
})

const row = style({ display: 'flex', gap: space[2.5], alignItems: 'center', flexWrap: 'wrap', minHeight: touch.fine })

export const rowSpread = style([row, { justifyContent: 'space-between' }])

export const notice = style({
	display: 'block',
	borderLeft: `2px solid ${theme.gold}`,
	paddingLeft: space[3],
	margin: `0 0 ${space[4]}`
})

export const error = style({ display: 'block', color: theme.vermilion, margin: `0 0 ${space[3.5]}` })

export const hint = style({ display: 'block', margin: `0 0 ${space[2.5]}` })

export const caption = style({ captionSide: 'top', textAlign: 'left', paddingBottom: space[2.5] })

export const legend = style({ float: 'left', width: '100%', padding: 0, marginBottom: space[2.5] })

globalStyle(`${legend} + *`, { clear: 'both' })

export const slot = style([card, { minInlineSize: 'auto' }])

export const squareTouch = style(coarseSquare)

export const pressable = style({
	selectors: { '&[aria-pressed="true"]': { borderColor: theme.vermilion, color: theme.vermilion } }
})

export const confirmGroup = style({ display: 'inline-flex', flexWrap: 'wrap', gap: space[2], alignItems: 'center' })

export const saveBar = style({
	position: 'sticky',
	bottom: 0,
	zIndex: zIndex.saveBar,
	display: 'flex',
	flexWrap: 'wrap',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: space[4],
	marginTop: space[3],
	padding: `${space[3]} 0`,
	background: theme.vellum,
	borderTop: `1px solid ${theme.rule}`
})

globalStyle(`html:has(${saveBar})`, { scrollPaddingBottom: space[20] })

export const fileField = style({ display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', gap: space[2.5] })

export const fileLabel = style({ cursor: 'pointer' })

globalStyle(`${fileField}:has(input:focus-visible) > label`, {
	outline: `2px solid ${theme.vermilion}`,
	outlineOffset: space[0.75]
})

export const plateRow = style({
	display: 'grid',
	gridTemplateColumns: `${layout.thumbnailColumn} minmax(0, 1fr)`,
	gap: space[4],
	alignItems: 'start',
	...below('small', { gridTemplateColumns: 'minmax(0, 1fr)' })
})

export const thumbnail = style({
	display: 'block',
	width: '100%',
	maxWidth: layout.thumbnailColumn,
	height: 'auto',
	aspectRatio: '1',
	objectFit: 'contain',
	padding: space[1.5],
	border: `1px solid ${theme.rule}`,
	background: theme.plateMat
})

export const stack = style({ display: 'flex', flexDirection: 'column', gap: space[3], alignItems: 'flex-start' })

export const statisticsRow = style([
	{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: space[3], marginBottom: space[4] },
	below('narrow', { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }),
	below('small', { gridTemplateColumns: 'minmax(0, 1fr)' })
])

export const chartsRow = style({
	display: 'grid',
	gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
	gap: space[3],
	...below('narrow', { gridTemplateColumns: 'minmax(0, 1fr)' })
})

export const chartHead = style({
	display: 'flex',
	alignItems: 'flex-start',
	justifyContent: 'space-between',
	gap: space[3],
	marginBottom: space[3.5]
})

export const tableScroll = style({ maxWidth: '100%', overflowX: 'auto' })

export const table = style({ width: '100%', borderCollapse: 'collapse' })

const cell = {
	padding: `${space[2]} ${space[2.5]}`,
	borderBottom: `1px solid ${theme.shade}`,
	verticalAlign: 'top'
} as const

export const tableHeader = style({ ...cell, textAlign: 'left', borderBottomColor: theme.rule, whiteSpace: 'nowrap' })

export const tableHeaderNumeric = style([tableHeader, { textAlign: 'right' }])

export const rowHeader = style({ ...cell, textAlign: 'left', fontWeight: 'inherit' })

globalStyle(`${rowHeader} > a`, { display: 'inline-flex', alignItems: 'center', minHeight: touch.fine, ...coarseTouch })

export const tableCell = style(cell)

export const tableCellNumeric = style({ ...cell, textAlign: 'right', fontVariantNumeric: 'tabular-nums' })

export const tableCellNowrap = style({ ...cell, whiteSpace: 'nowrap' })

export const tableCellWrap = style({ ...cell, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' })

export const diffTable = style([table, { tableLayout: 'fixed' }])

export const wideTable = style([table, { minWidth: '44rem' }])

export const diffFieldColumn = style({ width: '24%' })

export const groupRow = style({ ...cell, paddingTop: space[5], borderBottomColor: theme.rule, textAlign: 'left' })

export const sortLink = style({
	color: 'inherit',
	display: 'inline-flex',
	alignItems: 'center',
	gap: space[1],
	minHeight: touch.fine,
	...coarseTouch,
	selectors: { '&:hover': { color: theme.vermilion, textDecoration: 'none' } }
})

export const list = style({ listStyle: 'none', margin: 0, padding: 0 })

export const listRow = style({
	display: 'flex',
	flexWrap: 'wrap',
	alignItems: 'baseline',
	justifyContent: 'space-between',
	gap: `${space[1]} ${space[4]}`,
	padding: `${space[2.5]} 0`,
	borderBottom: `1px solid ${theme.shade}`
})

export const empty = style({ padding: `${space[4]} 0`, margin: 0 })

export const previewBanner = style({
	display: 'flex',
	flexWrap: 'wrap',
	justifyContent: 'center',
	gap: space[3],
	padding: `${space[2]} ${space[4]}`,
	background: theme.vermilion,
	color: theme.onVermilion
})

globalStyle(`${previewBanner} a`, {
	display: 'inline-flex',
	alignItems: 'center',
	minHeight: touch.fine,
	color: 'inherit',
	textDecoration: 'underline',
	...coarseTouch
})
