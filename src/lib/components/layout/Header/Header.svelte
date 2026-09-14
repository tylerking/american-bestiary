<script
	lang='ts'>
	import type { Snippet } from 'svelte'
	import Mark from '$lib/components/elements/Mark'
	import Text from '$lib/components/elements/Text'
	import * as styles from './Header.css'

	interface Props {
		siteName: string
		tagline?: string
		homeHref?: string
		actions?: Snippet
	}

	let { siteName, tagline, homeHref = '/', actions }: Props = $props()
</script>

<header
	class={styles.header}>
	<div
		class={styles.row}>
		<a
			class={styles.brand}
			href={homeHref}>
			<Mark />
			<span
				class={styles.titles}>
				<Text
					variant='wordmark'>{siteName}</Text>
				{#if tagline}
					<Text
						variant='tagline'>{tagline}</Text>
				{/if}
			</span>
		</a>
		{@render actions?.()}
	</div>
</header>
