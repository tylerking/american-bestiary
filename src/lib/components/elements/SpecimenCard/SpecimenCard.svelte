<script
	lang='ts'>
	import { altText } from '$lib/codex'
	import Plate from '$lib/components/elements/Plate'
	import PlateImage from '$lib/components/elements/PlateImage'
	import Text from '$lib/components/elements/Text'
	import { getLabels } from '$lib/labels/labels'
	import { statusLabel } from '$lib/labels/terms'
	import { PLATE } from '$lib/media'
	import type { SpecimenSummary } from '$lib/types'
	import * as styles from './SpecimenCard.css'

	interface Props {
		specimen: SpecimenSummary
		variant: 'archive' | 'member'
		note?: string
		sizes: string
		eager?: boolean
	}

	let { specimen, variant, note, sizes, eager = false }: Props = $props()

	const labels = $derived.by(getLabels())
</script>

<figure
	class={styles.figure}>
	<Plate
		href={`/creatures/${specimen.slug}`}
		shape='square'>
		<PlateImage
			alt={altText(labels.altText, specimen)}
			fit='contain'
			imageKey={specimen.imageKey}
			{eager}
			largest={PLATE.small}
			{sizes} />
	</Plate>
	<figcaption
		class={variant === 'archive' ? styles.captionArchive : styles.captionMember}>
		<Text
			as='div'
			variant={variant === 'archive' ? 'cardName' : 'memberName'}>{specimen.name}</Text>
		<Text
			as='div'
			variant='territory'>{specimen.territory}</Text>
		{#if variant === 'archive'}
			<Text
				as='div'
				tone='vermilion'
				variant='status'>{statusLabel(labels, specimen.status)}</Text>
		{/if}
		{#if note}
			<Text
				as='div'
				class={styles.note}
				tone='vermilion'
				variant='memberNote'>{note}</Text>
		{/if}
	</figcaption>
</figure>
