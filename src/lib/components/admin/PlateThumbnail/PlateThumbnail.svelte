<script
	lang='ts'>
	import { picture } from '$lib/media'
	import * as styles from '$lib/styles/admin.css'

	let { imageKey, alt }: { imageKey: string; alt: string } = $props()

	const image = $derived(picture(imageKey, 320))
</script>

<img
	{alt}
	class={styles.thumbnail}
	decoding='async'
	height='320'
	loading='lazy'
	src={image.src}
	srcset={image.srcset}
	width='320' />
