<script
	lang='ts'>
	import { replaceState } from '$app/navigation'
	import { page } from '$app/state'
	import { type ArchiveQuery, archiveSearch, filterArchive, groupByKind } from '$lib/archive'
	import { altText, fill } from '$lib/codex'
	import FilterRow from '$lib/components/elements/FilterRow'
	import GroupHeading from '$lib/components/elements/GroupHeading'
	import SpecimenCard from '$lib/components/elements/SpecimenCard'
	import Text from '$lib/components/elements/Text'
	import UnderlinedField, { input, select } from '$lib/components/elements/UnderlinedField'
	import { content } from '$lib/components/layout/AppShell/AppShell.css'
	import Seo from '$lib/components/layout/Seo'
	import { KINDS, STATUSES } from '$lib/enums'
	import { getLabels } from '$lib/labels/labels'
	import { groupLabel, kindLabel, specimenCount, statusLabel } from '$lib/labels/terms'
	import { shareImage } from '$lib/media'
	import { screenReaderOnly } from '$lib/styles/recipes.css'
	import type { SiteSettings, SpecimenSummary } from '$lib/types'
	import * as styles from './ArchivePage.css'

	const ROSTER = 50
	const FIRST_ROW = 4

	interface Props {
		settings: SiteSettings
		specimens: SpecimenSummary[]
		query: ArchiveQuery
	}

	let { settings, specimens, query: initial }: Props = $props()

	const labels = $derived.by(getLabels())
	let query = $derived({ ...initial })
	const results = $derived(filterArchive(specimens, query, labels))
	const groups = $derived(groupByKind(results))
	const territories = $derived(specimens.map((specimen) => specimen.territory).sort())
	const statusOptions = $derived([
		{ value: 'all', label: labels.statusAll },
		...STATUSES.map((status) => ({ value: status, label: statusLabel(labels, status) }))
	])
	const kindOptions = $derived([
		{ value: 'all', label: labels.kindAll },
		...KINDS.map((kind) => ({ value: kind, label: kindLabel(labels, kind) }))
	])

	function update(changes: Partial<ArchiveQuery>) {
		query = { ...query, ...changes }
		replaceState(`${page.url.pathname}${archiveSearch(query)}`, page.state)
	}
</script>

<Seo
	description={settings.seoDescription}
	image={specimens[0] ? shareImage(specimens[0].imageKey) : undefined}
	imageAlt={specimens[0] ? altText(labels.altText, specimens[0]) : undefined}
	siteName={settings.siteName}
	structuredData={{ '@type': 'CollectionPage', name: labels.archiveTitle }}
	title={fill(labels.archiveMetaTitle, { siteName: settings.siteName })}
	type='website' />

<main
	class={content}
	id='main-content'
	tabindex='-1'>
	<div
		class={styles.head}>
		<Text
			as='h1'
			variant='archiveTitle'>{labels.archiveTitle}</Text>
		<Text
			aria-live='polite'
			tone='vermilion'
			variant='resultCount'>{results.length === ROSTER ? labels.archiveAll : specimenCount(labels, results.length)}</Text>
	</div>

	<!-- biome-ignore lint/a11y/useSemanticElements: the form is itself the flex row of fields; a <search> wrapper would add a box around it. -->
	<form
		class={styles.fields}
		method='get'
		onsubmit={(event) => event.preventDefault()}
		role='search'>
		<UnderlinedField
			label={labels.search}>
			<input
				aria-label={labels.searchAria}
				class={input}
				name='q'
				oninput={(event) => update({ q: event.currentTarget.value })}
				placeholder={labels.searchPlaceholder}
				type='search'
				value={query.q} />
		</UnderlinedField>
		<UnderlinedField
			chevron
			label={labels.territory}>
			<select
				aria-label={labels.territoryAria}
				class={select}
				name='territory'
				onchange={(event) => update({ territory: event.currentTarget.value })}
				value={query.territory}>
				<option
					value=''>{labels.territoryAll}</option>
				{#each territories as territory (territory)}
					<option
						value={territory}>{territory}</option>
				{/each}
			</select>
		</UnderlinedField>
		<input
			name='status'
			type='hidden'
			value={query.status} />
		<input
			name='kind'
			type='hidden'
			value={query.kind} />
		<noscript>
			<button
				class={screenReaderOnly}
				type='submit'>{labels.filterApply}</button>
		</noscript>
	</form>

	<FilterRow
		current={query.status}
		label={labels.status}
		name='status'
		onselect={(status) => update({ status })}
		options={statusOptions}
		search={(value) => archiveSearch(query, { status: value })}
		spacing='status' />
	<FilterRow
		current={query.kind}
		label={labels.kind}
		name='kind'
		onselect={(kind) => update({ kind })}
		options={kindOptions}
		search={(value) => archiveSearch(query, { kind: value })}
		spacing='kind' />

	{#if groups.length === 0}
		<div
			class={styles.empty}>
			<Text
				as='p'
				class={styles.emptyText}
				tone='vermilion'
				variant='empty'>{labels.archiveEmpty}</Text>
		</div>
	{/if}

	{#each groups as group, index (group.kind)}
		<GroupHeading
			count={specimenCount(labels, group.items.length)}
			first={index === 0}
			label={groupLabel(labels, group.kind)} />
		<div
			class={styles.grid}>
			{#each group.items as specimen, position (specimen.slug)}
				<SpecimenCard
					eager={index === 0 && position < FIRST_ROW}
					sizes='(max-width: 420px) calc(100vw - 58px), (max-width: 760px) calc(50vw - 40px), 200px'
					{specimen}
					variant='archive' />
			{/each}
		</div>
	{/each}
</main>
