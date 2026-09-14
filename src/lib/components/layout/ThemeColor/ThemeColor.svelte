<script
	lang='ts'>
	import { themeSurround } from '$lib/styles/theme.css'
</script>

<svelte:head>
	<meta
		content={themeSurround.light}
		media='(prefers-color-scheme: light)'
		name='theme-color' />
	<meta
		content={themeSurround.dark}
		media='(prefers-color-scheme: dark)'
		name='theme-color' />
</svelte:head>
