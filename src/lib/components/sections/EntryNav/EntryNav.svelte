<script
	lang='ts'>
	import Text from '$lib/components/elements/Text'
	import { getLabels } from '$lib/labels/labels'
	import type { SpecimenNeighbours } from '$lib/types'
	import * as styles from './EntryNav.css'

	let { neighbours }: { neighbours: SpecimenNeighbours } = $props()

	const labels = $derived.by(getLabels())
	const links = $derived([
		{ rel: 'prev', label: labels.previousEntry, specimen: neighbours.previous, class: styles.link },
		{ rel: 'next', label: labels.nextEntry, specimen: neighbours.next, class: styles.next }
	])
</script>

<nav
	aria-label={labels.entryNavAria}
	class={styles.nav}>
	{#each links as link (link.rel)}
		<a
			class={link.class}
			href={`/creatures/${link.specimen.slug}`}
			rel={link.rel}>
			<Text
				class={styles.line}
				tone='vermilion'
				variant='entryNavLabel'>{link.label}</Text>
			<Text
				class={styles.line}
				variant='entryNavName'>{link.specimen.name}</Text>
		</a>
	{/each}
</nav>
