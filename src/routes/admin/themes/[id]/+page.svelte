<script
	lang='ts'>
	import { enhance } from '$app/forms'
	import { AdminPage, RevisionList, SaveBar } from '$lib/components/admin'
	import SelectField from '$lib/components/elements/SelectField'
	import Text from '$lib/components/elements/Text'
	import TextareaField from '$lib/components/elements/TextareaField'
	import TextField from '$lib/components/elements/TextField'
	import { THEME_POSITIONS } from '$lib/enums'
	import * as styles from '$lib/styles/admin.css'
	import { monthName } from '$lib/utils/dates'
	import { fieldError, keepValues } from '$lib/utils/forms'
	import type { ActionData, PageData } from './$types'

	let { data, form }: { data: PageData; form: ActionData } = $props()

	const theme = $derived(data.theme)
	const error = (name: string) => fieldError(form, name)
	const slot = (position: number) => theme.slots.find((entry) => entry.position === position)
</script>

<AdminPage
	eyebrow={monthName(theme.month)}
	notice={data.restored ? 'Restored an earlier revision.' : undefined}
	title={theme.title}>
	{#snippet links()}
		<Text
			as='a'
			href='/admin/themes'
			variant='apparatusValue'>All themes</Text>
	{/snippet}
	<form
		action='?/save'
		id='theme-form'
		method='POST'
		use:enhance={keepValues}>
		<div
			class={styles.card}>
			<div
				class={styles.twoColumn}>
				<TextField
					error={error('title')}
					label='Title'
					name='title'
					required
					value={theme.title} />
				<TextField
					error={error('slug')}
					label='Slug'
					name='slug'
					required
					value={theme.slug} />
			</div>
			<TextareaField
				error={error('description')}
				label='Description'
				name='description'
				required
				rows={3}
				value={theme.description} />
		</div>
		{#each THEME_POSITIONS as position (position)}
			<fieldset
				class={styles.slot}>
				<legend
					class={styles.legend}><Text
						variant='memberName'>Slot {position}</Text></legend>
				<SelectField
					error={error(`specimen${position}`)}
					label={`Specimen ${position}`}
					name={`specimen${position}`}
					options={data.options}
					required
					value={slot(position)?.creatureId ?? ''} />
				<TextareaField
					error={error(`note${position}`)}
					hint='Shown under the plate, only in this theme.'
					label={`Note for specimen ${position}`}
					name={`note${position}`}
					required
					rows={2}
					value={slot(position)?.note ?? ''} />
			</fieldset>
		{/each}
	</form>
	<SaveBar
		form='theme-form'
		label='Save theme'
		result={form} />

	<Text
		as='h2'
		class={styles.sectionHeading}
		variant='themeTitle'>History</Text>
	<div
		class={styles.card}>
		<RevisionList
			basePath={`/admin/themes/${theme.id}/revisions`}
			revisions={data.revisions} />
	</div>
</AdminPage>
