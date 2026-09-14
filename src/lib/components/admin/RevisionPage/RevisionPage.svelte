<script
	lang='ts'>
	import { enhance } from '$app/forms'
	import Text from '$lib/components/elements/Text'
	import * as styles from '$lib/styles/admin.css'
	import type { FieldChange } from '$lib/types'
	import { formatTimestamp } from '$lib/utils/dates'
	import AdminPage from '../AdminPage'
	import ConfirmButton from '../ConfirmButton'
	import FormError from '../FormError'
	import RevisionDiff from '../RevisionDiff'

	interface Props {
		data: {
			subject: { name: string; href: string }
			revision: { createdAt: Date; author: string | null }
			changes: FieldChange[]
		}
		form?: { message?: string } | null
	}

	let { data, form }: Props = $props()

	const subject = $derived(data.subject)
	const revision = $derived(data.revision)
	const changes = $derived(data.changes)
</script>

<AdminPage
	eyebrow={subject.name}
	title='Compare revision'>
	{#snippet links()}
		<Text
			as='a'
			href={subject.href}
			variant='apparatusValue'>Back to {subject.name}</Text>
	{/snippet}
	<Text
		as='p'
		class={styles.lead}
		variant='apparatusValue'>Saved {formatTimestamp(revision.createdAt)} by {revision.author ?? 'the seed script'}. Restoring
		writes this version back and records it as a new revision, so the restore can be undone.</Text>
	<FormError
		message={form?.message} />
	<div
		class={styles.card}>
		<RevisionDiff
			{changes} />
	</div>
	{#if changes.length > 0}
		<form
			method='POST'
			use:enhance>
			<ConfirmButton
				confirmLabel='Yes, restore it'
				formaction='?/restore'
				label='Restore this revision' />
		</form>
	{/if}
</AdminPage>
