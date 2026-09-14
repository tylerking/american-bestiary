<script
	lang='ts'>
	import { altText, fill } from '$lib/codex'
	import Gloss from '$lib/components/elements/Gloss'
	import Initial from '$lib/components/elements/Initial'
	import Plate from '$lib/components/elements/Plate'
	import PlateImage from '$lib/components/elements/PlateImage'
	import Text from '$lib/components/elements/Text'
	import EntryNav from '$lib/components/sections/EntryNav'
	import { RUBRICS } from '$lib/enums'
	import { getLabels } from '$lib/labels/labels'
	import { rubricLabel } from '$lib/labels/terms'
	import { mediaUrl, PLATE } from '$lib/media'
	import type { Specimen, SpecimenNeighbours } from '$lib/types'
	import * as styles from './EntryArticle.css'

	interface Props {
		specimen: Specimen
		neighbours: SpecimenNeighbours
	}

	let { specimen, neighbours }: Props = $props()

	const labels = $derived.by(getLabels())
</script>

<article
	class={styles.article}>
	<figure
		class={styles.figure}>
		<Plate
			class={styles.enlarge}
			href={mediaUrl(specimen.imageKey)}
			newTabLabel={labels.plateFullSize}>
			<PlateImage
				alt={altText(labels.altText, specimen)}
				eager
				fit='fill'
				imageKey={specimen.imageKey}
				largest={PLATE.large}
				sizes='(max-width: 760px) calc(100vw - 58px), 820px' />
		</Plate>
		<Text
			as='figcaption'
			class={styles.caption}
			tone='vermilion'
			variant='caption'>{fill(labels.entryCaption, { name: specimen.name })}</Text>
	</figure>
	<Text
		as='h1'
		variant='entryTitle'>{specimen.name}</Text>
	<Text
		as='p'
		class={styles.classification}
		variant='capsClassification'>{specimen.classification}</Text>
	<Gloss
		placement='inline'
		text={specimen.gloss} />
	<div
		class={styles.body}>
		<Text
			as='p'
			class={styles.paragraph}
			variant='abstract'><Initial
				size='entry'
				text={specimen.abstract} /></Text>
		{#each RUBRICS as rubric (rubric)}
			<Text
				as='p'
				class={styles.paragraph}
				variant='rubricBody'><Text
					tone='vermilion'
					variant='rubric'>{`${rubricLabel(labels, rubric)}. `}</Text>{specimen[rubric]}</Text>
		{/each}
	</div>
	<EntryNav
		{neighbours} />
</article>
