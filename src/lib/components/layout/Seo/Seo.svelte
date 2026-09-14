<script
	lang='ts'>
	import { page } from '$app/state'
	import type { SharedImage } from '$lib/media'

	interface Props {
		title: string
		description: string
		siteName: string
		type: 'website' | 'article'
		image?: SharedImage
		imageAlt?: string
		structuredData: Record<string, unknown>
	}

	let { title, description, siteName, type, image, imageAlt, structuredData }: Props = $props()

	const url = $derived(`${page.url.origin}${page.url.pathname}`)
	const imageUrl = $derived(image ? new URL(image.url, page.url.origin).href : undefined)
	const jsonLd = $derived(
		JSON.stringify({ '@context': 'https://schema.org', url, ...structuredData }).replace(/</g, '\\u003c')
	)
</script>

<svelte:head>
	<title>{title}</title>
	<meta
		content={description}
		name='description' />
	<link
		href={url}
		rel='canonical' />
	<meta
		content={type}
		property='og:type' />
	<meta
		content={url}
		property='og:url' />
	<meta
		content={siteName}
		property='og:site_name' />
	<meta
		content={title}
		property='og:title' />
	<meta
		content={description}
		property='og:description' />
	{#if imageUrl}
		<meta
			content={imageUrl}
			property='og:image' />
		{#if image?.width && image.height}
			<meta
				content={String(image.width)}
				property='og:image:width' />
			<meta
				content={String(image.height)}
				property='og:image:height' />
		{/if}
		{#if imageAlt}
			<meta
				content={imageAlt}
				property='og:image:alt' />
		{/if}
	{/if}
	<meta
		content={imageUrl ? 'summary_large_image' : 'summary'}
		name='twitter:card' />
	<meta
		content={title}
		name='twitter:title' />
	<meta
		content={description}
		name='twitter:description' />
	{@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>
