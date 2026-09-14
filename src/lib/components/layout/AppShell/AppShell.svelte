<script
	lang='ts'>
	import '$lib/styles/global.css'
	import type { Snippet } from 'svelte'
	import Header from '$lib/components/layout/Header'
	import SkipLink from '$lib/components/layout/SkipLink'
	import ThemeColor from '$lib/components/layout/ThemeColor'
	import * as styles from './AppShell.css'

	interface Props {
		siteName: string
		tagline?: string
		homeHref?: string
		preloadData?: 'hover' | 'tap'
		actions?: Snippet
		banner?: Snippet
		footer?: Snippet
		children: Snippet
	}

	let { siteName, tagline, homeHref, preloadData, actions, banner, footer, children }: Props = $props()
</script>

<ThemeColor />

<SkipLink />
{@render banner?.()}
<div
	class={styles.surround}
	data-sveltekit-preload-data={preloadData}>
	<div
		class={styles.leaf}>
		<Header
			{actions}
			{homeHref}
			{siteName}
			{tagline} />
		{@render children()}
		{@render footer?.()}
	</div>
</div>
