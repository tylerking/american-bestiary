<script
	lang='ts'>
	import { picture } from '$lib/media'
	import { fit as fits } from './PlateImage.css'

	interface Props {
		imageKey: string
		alt: string
		largest: number
		sizes: string
		fit: keyof typeof fits
		eager?: boolean
	}

	let { imageKey, alt, largest, sizes, fit, eager = false }: Props = $props()

	const image = $derived(picture(imageKey, largest))
</script>

<img
	{alt}
	class={fits[fit]}
	decoding='async'
	fetchpriority={eager ? 'high' : undefined}
	height={largest}
	loading={eager ? 'eager' : 'lazy'}
	{sizes}
	src={image.src}
	srcset={image.srcset}
	width={largest} />
