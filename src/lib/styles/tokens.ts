export const vellum = {
	100: '#E9DDC0',
	200: '#D8C9A6',
	300: '#C9B78D',
	400: '#C2AD82',
	450: '#B7A27A',
	500: '#AD9668',
	600: '#8F7850'
} as const

export const umber = {
	400: '#78603A',
	450: '#806842',
	500: '#6B5A3C',
	550: '#5C4A2E',
	600: '#5C4526',
	650: '#4F3F27',
	700: '#4A3D2A',
	800: '#3B2A18',
	850: '#2E2519',
	900: '#241A0F',
	950: '#1B140C'
} as const

export const vermilion = { 400: '#E2705C', 700: '#9E2F1E' } as const

export const gold = { 400: '#C6A04A', 700: '#86631D', 800: '#6E5114' } as const

export const white = '#FFFFFF'

export const translucent = {
	umberRule: 'rgba(46, 37, 25, 0.28)',
	vellumRule: 'rgba(233, 221, 192, 0.3)'
} as const

export const surroundDay = `color-mix(in oklch, black 14%, ${vellum[100]})`

export const shadow = {
	leafDay: '2px 10px 0 rgba(0,0,0,0.05), -6px 24px 34px rgba(0,0,0,0.38)',
	leafNight: '0 0 0 1px rgba(255,244,222,0.06), 0 18px 40px rgba(0,0,0,0.55)'
} as const

export const texture = {
	leaf: [
		'radial-gradient(ellipse at 12% 16%, rgba(0,0,0,0.05), transparent 52%)',
		'radial-gradient(ellipse at 88% 10%, rgba(0,0,0,0.045), transparent 48%)',
		'radial-gradient(ellipse at 30% 94%, rgba(0,0,0,0.055), transparent 58%)',
		'radial-gradient(ellipse at 78% 70%, rgba(0,0,0,0.03), transparent 50%)',
		'repeating-linear-gradient(0deg, rgba(0,0,0,0.02) 0px, transparent 1px, transparent 34px, rgba(0,0,0,0.02) 35px)',
		'repeating-linear-gradient(115deg, rgba(0,0,0,0.022) 0px, rgba(0,0,0,0.022) 1px, transparent 1px, transparent 3px)'
	].join(', ')
} as const

export const font = {
	fraunces: "'Fraunces', 'Fraunces Fallback', Georgia, serif"
} as const

export const fontFile = {
	frauncesRoman: '/fonts/Fraunces-Variable-Latin.woff2',
	frauncesItalic: '/fonts/Fraunces-Italic-Variable-Latin.woff2'
} as const

export const axes = {
	base: "'opsz' 14, 'SOFT' 0, 'WONK' 0",
	wordmark: "'opsz' 144, 'SOFT' 50, 'WONK' 1",
	entryTitle: "'opsz' 144, 'SOFT' 45, 'WONK' 1",
	display: "'opsz' 144, 'SOFT' 40, 'WONK' 1",
	member: "'opsz' 90, 'SOFT' 30, 'WONK' 1",
	card: "'opsz' 60, 'SOFT' 20, 'WONK' 1",
	mark: "'opsz' 90, 'SOFT' 20, 'WONK' 0",
	initial: "'opsz' 144, 'SOFT' 90, 'WONK' 1"
} as const

export interface TypeRole {
	size?: string
	leading?: string
	tracking?: string
	weight?: number
	axes?: keyof typeof axes
	italic?: boolean
	caps?: boolean
}

export const type = {
	base: { size: '18px', leading: '1.56' },
	wordmark: { size: '26px', leading: '1.15', weight: 600, axes: 'wordmark' },
	tagline: { size: '14px', leading: '1.4' },
	entryTitle: { size: '48px', leading: '1', weight: 700, axes: 'entryTitle' },
	featuredTitle: { size: '38px', leading: '1.05', weight: 700, axes: 'display' },
	archiveTitle: { size: '34px', leading: '1.05', weight: 700, axes: 'display' },
	themeTitle: { size: '28px', leading: '1.15', weight: 700, axes: 'display' },
	memberName: { size: '19px', leading: '1.2', axes: 'member' },
	entryNavName: { size: '19px', axes: 'member' },
	cardName: { size: '16px', leading: '1.25', axes: 'card' },
	incipit: { size: '19px', leading: '1.6' },
	abstract: { size: '19px', leading: '1.58' },
	rubricBody: { size: '18px', leading: '1.58' },
	markLetter: { size: '17px', weight: 700, axes: 'mark' },
	capsTitulus: { size: '14px', tracking: '0.17em', caps: true },
	capsGroup: { size: '15px', tracking: '0.15em', weight: 600, caps: true },
	capsEntryNumber: { size: '13px', tracking: '0.16em', caps: true },
	capsApparatus: { size: '12px', tracking: '0.14em', caps: true },
	capsField: { size: '13px', tracking: '0.12em', caps: true },
	capsClassification: { size: '16px', tracking: '0.12em', caps: true },
	capsFeatured: { size: '15px', tracking: '0.1em', caps: true },
	rubric: { tracking: '0.06em', caps: true },
	caption: { size: '15px', italic: true },
	gloss: { size: '16px', leading: '1.5', italic: true },
	mapCaption: { size: '13px', italic: true },
	resultCount: { size: '16px', italic: true },
	memberNote: { size: '13px', italic: true },
	fieldInput: { size: '16px', italic: true },
	groupCount: { size: '13px', italic: true },
	navigation: { size: '16px' },
	toggle: { size: '13px' },
	filter: { size: '15px' },
	button: { size: '15px' },
	footer: { size: '14px' },
	entryNavLabel: { size: '14px' },
	apparatusValue: { size: '15px', leading: '1.4' },
	apparatusNote: { size: '14px', leading: '1.4', italic: true },
	apparatusLink: { size: '14px', leading: '1.4' },
	apparatusSmall: { size: '13px', leading: '1.4' },
	territory: { size: '13px' },
	status: { size: '12px' },
	empty: { size: '19px', leading: '1.6', italic: true },
	tooltip: { size: '13px' },
	axis: { size: '12px' },
	body: {}
} as const satisfies Record<string, TypeRole>

export const initial = {
	incipit: '4.6em',
	entry: '5.2em',
	narrow: '3.2em',
	leading: '0.78',
	margin: '0.02em 0.08em -0.12em 0'
} as const

export const space = {
	0.25: '1px',
	0.5: '2px',
	0.75: '3px',
	1: '4px',
	1.25: '5px',
	1.5: '6px',
	2: '8px',
	2.5: '10px',
	3: '12px',
	3.5: '14px',
	3.75: '15px',
	4: '16px',
	4.5: '18px',
	5: '20px',
	5.5: '22px',
	6: '24px',
	6.5: '26px',
	7: '28px',
	7.5: '30px',
	8: '32px',
	9: '36px',
	10: '40px',
	11: '44px',
	12: '48px',
	17: '68px',
	18: '72px',
	20: '80px'
} as const

export const layout = {
	leafWidth: '1180px',
	rail: '224px',
	measure: '58ch',
	abstractMeasure: '52ch',
	descriptionMeasure: '58ch',
	plateWidth: '460px',
	cardMinimum: '170px',
	textColumnMinimum: '260px',
	searchWidth: '200px',
	mark: '32px',
	chevron: '6px',
	chevronOffset: '9px',
	barTrack: '8px',
	lozenge: '8px',
	loginWidth: '380px',
	thumbnailColumn: '160px'
} as const

export const breakpoint = {
	narrow: '760px',
	small: '560px'
} as const

export const map = {
	stroke: '0.6px',
	focusStroke: '2px',
	focusHalo: '5px',
	hoverStroke: '1.25px',
	hoverHalo: '3px',
	dotRest: 3.6,
	dotHover: 6,
	dotSelected: 7,
	dotStroke: 1.2,
	samples: 160,
	tooltipOffset: 12
} as const

export const zIndex = {
	skip: 100,
	tooltip: 10,
	saveBar: 2
} as const

export const touch = {
	fine: '24px',
	min: '44px',
	borderSlack: '3px'
} as const
