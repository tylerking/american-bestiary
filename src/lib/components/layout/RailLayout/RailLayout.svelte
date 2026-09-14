<script
	lang='ts'>
	import type { Snippet } from 'svelte'
	import type { ClassValue } from 'svelte/elements'
	import * as styles from './RailLayout.css'

	interface Props {
		rail: Snippet
		children: Snippet
		railFirst?: boolean
		stickyRail?: boolean
		class?: ClassValue
	}

	let { rail, children, railFirst = false, stickyRail = false, class: className }: Props = $props()
</script>

{#snippet railCell()}
	<div
		class={styles.rail[railFirst ? 'before' : 'after']}>
		{#if stickyRail}
			<div
				class={styles.sticky}>{@render rail()}</div>
		{:else}
			{@render rail()}
		{/if}
	</div>
{/snippet}

<div
	class={[styles.grid, className]}>
	{#if railFirst}
		{@render railCell()}
	{/if}
	<div
		class={styles.content}>{@render children()}</div>
	{#if !railFirst}
		{@render railCell()}
	{/if}
</div>
