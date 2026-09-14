<script
	lang='ts'>
	import { sourceLink } from '$lib/codex'
	import Gloss from '$lib/components/elements/Gloss'
	import MarginNote from '$lib/components/elements/MarginNote'
	import Text from '$lib/components/elements/Text'
	import { getLabels } from '$lib/labels/labels'
	import { groupLabel, statusLabel } from '$lib/labels/terms'
	import { screenReaderOnly } from '$lib/styles/recipes.css'
	import type { Specimen } from '$lib/types'
	import * as styles from './EntryMargin.css'

	let { specimen }: { specimen: Specimen } = $props()

	const labels = $derived.by(getLabels())
	const links = $derived(specimen.sources.flatMap((source) => sourceLink(source) ?? []))
</script>

<aside
	class={styles.margin}>
	<Gloss
		placement='margin'
		statusLabel={statusLabel(labels, specimen.status)}
		text={specimen.gloss} />
	<MarginNote
		label={labels.marginClassification}>
		<Text
			as='p'
			class={styles.first}
			variant='apparatusValue'>{groupLabel(labels, specimen.kind)}</Text>
		<Text
			as='p'
			class={styles.second}
			variant='apparatusNote'>{specimen.classification}</Text>
	</MarginNote>
	<MarginNote
		label={labels.marginTerritory}>
		<Text
			as='p'
			class={styles.first}
			variant='apparatusValue'>{specimen.territory}</Text>
	</MarginNote>
	{#if links.length > 0}
		<MarginNote
			label={labels.marginSources}>
			{#each links as link, index (index)}
				<Text
					as='p'
					class={index === 0 ? styles.first : [styles.first, styles.sourceLine]}
					variant='apparatusLink'><a
						class={styles.sourceLink}
						href={link.href}
						rel='noopener noreferrer'
						target='_blank'>{link.host}<span
							class={screenReaderOnly}>{` ${labels.newTab}`}</span></a></Text>
			{/each}
		</MarginNote>
	{/if}
</aside>
