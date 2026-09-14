<script
	lang='ts'>
	import { altText, fill } from '$lib/codex'
	import Button from '$lib/components/elements/Button'
	import Gloss from '$lib/components/elements/Gloss'
	import Plate from '$lib/components/elements/Plate'
	import PlateImage from '$lib/components/elements/PlateImage'
	import Text from '$lib/components/elements/Text'
	import { getLabels } from '$lib/labels/labels'
	import { PLATE } from '$lib/media'
	import { screenReaderOnly } from '$lib/styles/recipes.css'
	import type { SpecimenSummary } from '$lib/types'
	import * as styles from './Specimen.css'

	interface Props {
		specimen: SpecimenSummary | null
		territory: string
	}

	let { specimen, territory }: Props = $props()

	const labels = $derived.by(getLabels())
	const announcement = $derived(
		specimen
			? `${fill(labels.specimenOf, { territory })}: ${specimen.name}.`
			: fill(labels.unpublishedTerritory, { territory })
	)
</script>

<div
	id='specimen'>
	<p
		aria-live='polite'
		class={screenReaderOnly}>{announcement}</p>
	<Text
		aria-hidden='true'
		as='p'
		class={styles.label}
		tone='vermilion'
		variant='capsTitulus'>{fill(labels.specimenOf, { territory })}</Text>
	{#if specimen}
		<div
			class={styles.row}>
			<Plate
				class={styles.plate}>
				<PlateImage
					alt={altText(labels.altText, specimen)}
					fit='fill'
					imageKey={specimen.imageKey}
					largest={PLATE.medium}
					sizes='(max-width: 760px) calc(100vw - 58px), 460px' />
			</Plate>
			<div
				class={styles.text}>
				<Text
					as='h2'
					variant='featuredTitle'>{specimen.name}</Text>
				<Text
					as='p'
					variant='capsFeatured'>{specimen.classification}</Text>
				<Text
					as='p'
					class={styles.abstract}>{specimen.abstract}</Text>
				<Gloss
					placement='featured'
					text={specimen.gloss} />
				<Button
					class={styles.read}
					href={`/creatures/${specimen.slug}`}>{labels.readEntry}</Button>
			</div>
		</div>
	{:else}
		<Text
			as='p'>{fill(labels.unpublishedTerritory, { territory })}</Text>
	{/if}
</div>
