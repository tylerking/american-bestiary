<script
	lang='ts'>
	import { enhance } from '$app/forms'
	import { AdminPage, RevisionList, SaveBar } from '$lib/components/admin'
	import Text from '$lib/components/elements/Text'
	import TextareaField from '$lib/components/elements/TextareaField'
	import TextField from '$lib/components/elements/TextField'
	import { LABEL_FIELD_PREFIX, LABELS, type LabelKey } from '$lib/labels/label-defaults'
	import * as styles from '$lib/styles/admin.css'
	import { fieldError, keepValues } from '$lib/utils/forms'
	import type { ActionData, PageData } from './$types'

	let { data, form }: { data: PageData; form: ActionData } = $props()

	const settings = $derived(data.settings)
	const error = (name: string) => fieldError(form, name)

	const GROUPS: [name: string, where: string, pattern: RegExp][] = [
		['Navigation', 'Header, skip link and link suffixes.', /^(skip|home|navigation|theme|newTab)/],
		['Map and specimen', 'The tabula, its caption, and the featured specimen on the home page.', /^(map|specimenOf|featured|readEntry|unpublished)/],
		['Archive', 'The archive heading, page title, search, filters, group headings and counts. {siteName} is filled in.', /^(archive|specimenCount|search|territory|filter|status|kind|group)/],
		['Entries', 'Entry pages: captions, rubrics, the margin, neighbours, titles and plate alt text. {name}, {siteName}, {territory}, {classification} and {article} are filled in.', /^(entry|previous|next|margin|rubric|altText)/],
		['Errors', 'The not-found and server error pages.', /^error/],
		['Other', 'Anything not filed above.', /./]
	]
	const keys = Object.keys(LABELS) as LabelKey[]
	const groupOf = (key: string) => GROUPS.find(([, , pattern]) => pattern.test(key))?.[0]
	const grouped = GROUPS.map(([name, where]) => ({ name, where, keys: keys.filter((key) => groupOf(key) === name) })).filter(
		(group) => group.keys.length > 0
	)
	const anchor = (name: string) => `copy-${name.toLowerCase().replace(/[^a-z]+/g, '-')}`
	const humanize = (key: string) =>
		key
			.replace(/([A-Z])/g, ' $1')
			.replace(/^./, (letter) => letter.toUpperCase())
			.replace(/ Aria$/, ' (screen reader)')
</script>

<AdminPage
	eyebrow='Settings'
	notice={data.restored ? 'Restored an earlier revision.' : undefined}
	title='Globals'>
	<form
		action='?/update'
		id='settings-form'
		method='POST'
		use:enhance={keepValues}>
		<Text
			as='h2'
			class={styles.sectionHeading}
			variant='themeTitle'>Site</Text>
		<div
			class={styles.card}>
			<div
				class={styles.twoColumn}>
				<TextField
					error={error('siteName')}
					label='Site name'
					name='siteName'
					required
					value={settings.siteName} />
				<TextField
					error={error('tagline')}
					label='Tagline'
					name='tagline'
					required
					value={settings.tagline} />
			</div>
			<TextareaField
				error={error('seoDescription')}
				hint='Used for search results and share cards on the map and archive.'
				label='SEO description'
				name='seoDescription'
				rows={3}
				value={settings.seoDescription} />
			<TextareaField
				error={error('incipit')}
				hint='The opening passage on the home page. Its first letter is set as the initial.'
				label='Incipit'
				name='incipit'
				required
				rows={7}
				value={settings.incipit} />
		</div>

		<Text
			as='h2'
			class={styles.sectionHeading}
			variant='themeTitle'>Footer and credit</Text>
		<div
			class={styles.card}>
			<TextField
				error={error('footerText')}
				label='Footer text'
				name='footerText'
				value={settings.footerText} />
			<div
				class={styles.twoColumn}>
				<TextField
					error={error('creditLabel')}
					label='Credit label'
					name='creditLabel'
					value={settings.creditLabel} />
				<TextField
					error={error('creditName')}
					label='Credit name'
					name='creditName'
					value={settings.creditName} />
			</div>
			<TextField
				error={error('creditUrl')}
				label='Credit URL'
				name='creditUrl'
				value={settings.creditUrl} />
		</div>

		<Text
			as='h2'
			class={styles.sectionHeading}
			variant='themeTitle'>Interface copy</Text>
		<nav
			aria-label='Interface copy sections'
			class={styles.headerLinks}>
			{#each grouped as group (group.name)}
				<Text
					as='a'
					href={`#${anchor(group.name)}`}
					variant='apparatusValue'>{group.name}</Text>
			{/each}
		</nav>
		{#each grouped as group (group.name)}
			<Text
				as='h3'
				class={styles.subsectionHeading}
				id={anchor(group.name)}
				variant='memberName'>{group.name}</Text>
			<Text
				as='p'
				class={styles.hint}
				variant='apparatusSmall'>{group.where}</Text>
			<div
				class={styles.card}>
				<div
					class={styles.twoColumn}>
					{#each group.keys as key (key)}
						<TextField
							error={error(`label__${key}`)}
							label={humanize(key)}
							maxlength={LABELS[key][1]}
							name={`${LABEL_FIELD_PREFIX}${key}`}
							value={settings.labels[key]} />
					{/each}
				</div>
			</div>
		{/each}
	</form>
	<SaveBar
		form='settings-form'
		label='Save globals'
		result={form} />

	<Text
		as='h2'
		class={styles.sectionHeading}
		variant='themeTitle'>History</Text>
	<div
		class={styles.card}>
		<RevisionList
			basePath='/admin/globals/revisions'
			revisions={data.revisions} />
	</div>
</AdminPage>
