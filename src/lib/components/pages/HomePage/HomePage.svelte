<script
	lang='ts'>
	import { replaceState } from '$app/navigation'
	import { page } from '$app/state'
	import { altText, territorySlug } from '$lib/codex'
	import Text from '$lib/components/elements/Text'
	import { content } from '$lib/components/layout/AppShell/AppShell.css'
	import Seo from '$lib/components/layout/Seo'
	import Incipit from '$lib/components/sections/Incipit'
	import MonthlyTheme from '$lib/components/sections/MonthlyTheme'
	import Specimen from '$lib/components/sections/Specimen'
	import TerritoryMap from '$lib/components/sections/TerritoryMap'
	import { getLabels } from '$lib/labels/labels'
	import { shareImage } from '$lib/media'
	import { screenReaderOnly } from '$lib/styles/recipes.css'
	import type { MonthlyTheme as MonthlyThemeData, SiteSettings, SpecimenSummary } from '$lib/types'
	import * as styles from './HomePage.css'

	interface Props {
		settings: SiteSettings
		specimens: SpecimenSummary[]
		territory: string
		theme: MonthlyThemeData | null
	}

	let { settings, specimens, territory, theme }: Props = $props()

	const labels = $derived.by(getLabels())
	let selected = $derived(territory)
	const specimen = $derived(specimens.find((entry) => entry.territory === selected) ?? null)
	const territories = $derived(specimens.map((entry) => entry.territory).sort())

	function select(name: string) {
		selected = name
		const url = new URL(page.url)
		url.searchParams.set('territory', territorySlug(name))
		replaceState(url, page.state)
	}
</script>

<Seo
	description={settings.seoDescription}
	image={specimen ? shareImage(specimen.imageKey) : undefined}
	imageAlt={specimen ? altText(labels.altText, specimen) : undefined}
	siteName={settings.siteName}
	structuredData={{ '@type': 'WebSite', name: settings.siteName, description: settings.seoDescription }}
	title={settings.siteName}
	type='website' />

<main
	class={content}
	id='main-content'
	tabindex='-1'>
	<Text
		as='h1'
		class={screenReaderOnly}>{settings.siteName}</Text>
	<Incipit
		text={settings.incipit} />
	<section
		class={styles.mapSection}>
		<TerritoryMap
			onselect={select}
			{selected}
			{territories} />
		<Specimen
			{specimen}
			territory={selected} />
	</section>
	{#if theme && theme.members.length > 0}
		<MonthlyTheme
			{theme} />
	{/if}
</main>
