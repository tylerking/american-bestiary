<script
	lang='ts'>
	import type { Snippet } from 'svelte'
	import type { ClassValue } from 'svelte/elements'
	import { screenReaderOnly } from '$lib/styles/recipes.css'
	import * as styles from './Plate.css'

	interface Props {
		href?: string
		newTabLabel?: string
		shape?: 'frame' | 'square'
		class?: ClassValue
		children: Snippet
	}

	let { href, newTabLabel, shape = 'frame', class: className, children }: Props = $props()

	const classes = $derived([shape === 'square' ? styles.square : styles.frame, className])
</script>

{#if href}
	<a
		class={classes}
		{href}
		rel={newTabLabel ? 'noopener noreferrer' : undefined}
		target={newTabLabel ? '_blank' : undefined}>{@render children()}{#if newTabLabel}<span
				class={screenReaderOnly}>{` ${newTabLabel}`}</span>{/if}</a>
{:else}
	<div
		class={classes}>{@render children()}</div>
{/if}
