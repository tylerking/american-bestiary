<script
	lang='ts'>
	import { altText, fill } from '$lib/codex'
	import { content } from '$lib/components/layout/AppShell/AppShell.css'
	import RailLayout from '$lib/components/layout/RailLayout'
	import Seo from '$lib/components/layout/Seo'
	import EntryArticle from '$lib/components/sections/EntryArticle'
	import EntryMargin from '$lib/components/sections/EntryMargin'
	import { getLabels } from '$lib/labels/labels'
	import { shareImage } from '$lib/media'
	import type { SiteSettings, Specimen, SpecimenNeighbours } from '$lib/types'

	interface Props {
		settings: SiteSettings
		specimen: Specimen
		neighbours: SpecimenNeighbours
	}

	let { settings, specimen, neighbours }: Props = $props()

	const labels = $derived.by(getLabels())
</script>

<Seo
	description={specimen.abstract}
	image={shareImage(specimen.imageKey)}
	imageAlt={altText(labels.altText, specimen)}
	siteName={settings.siteName}
	structuredData={{
		'@type': 'Article',
		headline: specimen.name,
		description: specimen.abstract,
		about: specimen.classification,
		contentLocation: specimen.territory
	}}
	title={fill(labels.entryTitle, { name: specimen.name, siteName: settings.siteName })}
	type='article' />

<main
	class={content}
	id='main-content'
	tabindex='-1'>
	<RailLayout>
		{#snippet rail()}
			<EntryMargin
				{specimen} />
		{/snippet}
		<EntryArticle
			{neighbours}
			{specimen} />
	</RailLayout>
</main>
