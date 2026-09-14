import { styleVariants } from '@vanilla-extract/css'

export const fit = styleVariants({
	fill: { display: 'block', width: '100%', height: 'auto', aspectRatio: '1', objectFit: 'contain' },
	contain: {
		display: 'block',
		maxWidth: '100%',
		maxHeight: '100%',
		width: 'auto',
		height: 'auto',
		objectFit: 'contain'
	}
})
