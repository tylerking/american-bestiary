<script
	lang='ts'>
	import { onMount } from 'svelte'
	import { enhance } from '$app/forms'
	import { altText } from '$lib/codex'
	import { AdminPage, FileField, PlateThumbnail, PublishControl, RevisionList, SaveBar } from '$lib/components/admin'
	import Button from '$lib/components/elements/Button'
	import SelectField from '$lib/components/elements/SelectField'
	import Text from '$lib/components/elements/Text'
	import TextareaField from '$lib/components/elements/TextareaField'
	import TextField from '$lib/components/elements/TextField'
	import { KINDS, RUBRICS, STATUSES, TERRITORIES } from '$lib/enums'
	import { getLabels } from '$lib/labels/labels'
	import { groupLabel, rubricLabel, statusLabel } from '$lib/labels/terms'
	import * as styles from '$lib/styles/admin.css'
	import { screenReaderOnly } from '$lib/styles/recipes.css'
	import { fieldError, keepValues } from '$lib/utils/forms'
	import type { ActionData, PageData } from './$types'

	let { data, form }: { data: PageData; form: ActionData } = $props()

	const labels = $derived.by(getLabels())
	const specimen = $derived(data.specimen)
	const scoped = $derived(form && 'scope' in form ? form : null)
	const saveResult = $derived(form && !('scope' in form) ? form : null)
	const plateError = $derived(scoped?.scope === 'plate' && !('success' in scoped) ? scoped.message : undefined)
	const error = (name: string) => fieldError(saveResult, name)
	const territories = TERRITORIES.map((territory) => ({ value: territory, label: territory }))
	const kinds = $derived(KINDS.map((kind) => ({ value: kind, label: groupLabel(labels, kind) })))
	const statuses = $derived(STATUSES.map((status) => ({ value: status, label: statusLabel(labels, status) })))
	let scripted = $state(false)
	let sourceRows = $derived([
		...specimen.sources.map((source, index) => ({
			id: index,
			url: source.url,
			oldid: source.oldid === null ? '' : String(source.oldid)
		})),
		{ id: specimen.sources.length, url: '', oldid: '' }
	])

	onMount(() => {
		scripted = true
	})

	const addSource = () => {
		sourceRows = [...sourceRows, { id: Math.max(...sourceRows.map((entry) => entry.id)) + 1, url: '', oldid: '' }]
	}

	const removeSource = (id: number) => {
		sourceRows = sourceRows.filter((entry) => entry.id !== id)
	}

	const notice = $derived(
		data.restored ? 'Restored an earlier revision.' : scoped && 'success' in scoped ? scoped.message : undefined
	)
</script>

<AdminPage
	eyebrow={specimen.territory}
	{notice}
	title={specimen.name}>
	{#snippet links()}
		<Text
			as='a'
			href='/admin/specimens'
			variant='apparatusValue'>All specimens</Text>
		<Text
			as='a'
			href={`/admin/preview/creatures/${specimen.slug}`}
			variant='apparatusValue'>Preview</Text>
		{#if specimen.publishedAt}
			<Text
				as='a'
				href={`/creatures/${specimen.slug}`}
				rel='noopener'
				target='_blank'
				variant='apparatusValue'>View on the site<span
					class={screenReaderOnly}>{` ${labels.newTab}`}</span></Text>
		{/if}
	{/snippet}

	<section
		aria-labelledby='publication'
		class={styles.card}>
		<Text
			as='h2'
			class={styles.hint}
			id='publication'
			variant='memberName'>Publication</Text>
		<PublishControl
			name={specimen.name}
			published={specimen.publishedAt !== null} />
	</section>

	<section
		aria-labelledby='plate'
		class={styles.card}>
		<Text
			as='h2'
			class={styles.hint}
			id='plate'
			variant='memberName'>Plate</Text>
		<div
			class={styles.plateRow}>
			<PlateThumbnail
				alt={altText(labels.altText, specimen)}
				imageKey={specimen.imageKey} />
			<form
				action='?/replacePlate'
				class={styles.stack}
				enctype='multipart/form-data'
				method='POST'
				use:enhance={keepValues}>
				<Text
					as='p'
					variant='apparatusValue'>Replacing the plate keeps the previous file, so an earlier revision can still restore it.</Text>
				<FileField
					error={plateError}
					id='plate-file'
					label='Choose a new plate'
					name='plate' />
				<Button
					type='submit'
					variant='outline'>Upload plate</Button>
			</form>
		</div>
	</section>

	<form
		action='?/save'
		id='specimen-form'
		method='POST'
		use:enhance={keepValues}>
		<Text
			as='h2'
			class={styles.sectionHeading}
			variant='themeTitle'>Record</Text>
		<div
			class={styles.card}>
			<div
				class={styles.twoColumn}>
				<TextField
					error={error('name')}
					label='Name'
					name='name'
					required
					value={specimen.name} />
				<TextField
					error={error('slug')}
					hint='Changing it changes the entry URL.'
					label='Slug'
					name='slug'
					required
					value={specimen.slug} />
				<SelectField
					error={error('territory')}
					label='Territory'
					name='territory'
					options={territories}
					required
					value={specimen.territory} />
				<TextField
					error={error('classification')}
					label='Classification'
					name='classification'
					required
					value={specimen.classification} />
				<SelectField
					error={error('kind')}
					label='Kind'
					name='kind'
					options={kinds}
					required
					value={specimen.kind} />
				<SelectField
					error={error('status')}
					label='Verdict'
					name='status'
					options={statuses}
					required
					value={specimen.status} />
			</div>
			<TextareaField
				error={error('abstract')}
				label='Abstract'
				name='abstract'
				required
				value={specimen.abstract} />
			<TextareaField
				error={error('gloss')}
				hint='The verdict note set in the margin.'
				label='Gloss'
				name='gloss'
				required
				value={specimen.gloss} />
		</div>

		<Text
			as='h2'
			class={styles.sectionHeading}
			variant='themeTitle'>Rubrics</Text>
		<div
			class={styles.card}>
			{#each RUBRICS as rubric (rubric)}
				<TextareaField
					error={error(rubric)}
					label={rubricLabel(labels, rubric)}
					name={rubric}
					required
					rows={5}
					value={specimen[rubric]} />
			{/each}
		</div>

		<Text
			as='h2'
			class={styles.sectionHeading}
			variant='themeTitle'>Sources</Text>
		<div
			class={styles.card}>
			{#if error('sources')}
				<Text
					as='p'
					class={styles.error}
					variant='apparatusValue'>{error('sources')}</Text>
			{/if}
			{#each sourceRows as source, index (source.id)}
				<div
					class={styles.twoColumn}>
					<TextField
						data-field='sources'
						id={`source-${source.id}-url`}
						label={`Source ${index + 1} URL`}
						name='sourceUrl'
						type='url'
						value={source.url} />
					<TextField
						id={`source-${source.id}-oldid`}
						inputmode='numeric'
						label={`Source ${index + 1} revision id`}
						name='sourceOldid'
						value={source.oldid} />
				</div>
				{#if scripted}
					<Button
						aria-label={`Remove source ${index + 1}`}
						onclick={() => removeSource(source.id)}
						type='button'
						variant='outline'>Remove</Button>
				{/if}
			{/each}
			<Text
				as='p'
				class={styles.hint}
				variant='apparatusSmall'>Leave both fields of a row empty to drop it. A Wikipedia revision id makes the link permanent.</Text>
			{#if scripted}
				<Button
					onclick={addSource}
					type='button'
					variant='outline'>Add source</Button>
			{/if}
		</div>
	</form>
	<SaveBar
		form='specimen-form'
		label='Save specimen'
		result={saveResult} />

	<Text
		as='h2'
		class={styles.sectionHeading}
		variant='themeTitle'>History</Text>
	<div
		class={styles.card}>
		<RevisionList
			basePath={`/admin/specimens/${specimen.id}/revisions`}
			revisions={data.revisions} />
	</div>
</AdminPage>
