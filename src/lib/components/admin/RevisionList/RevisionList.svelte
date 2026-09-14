<script
	lang='ts'>
	import Text from '$lib/components/elements/Text'
	import * as styles from '$lib/styles/admin.css'
	import { formatTimestamp } from '$lib/utils/dates'

	interface Props {
		revisions: { id: string; createdAt: Date; author: string | null }[]
		basePath: string
	}

	let { revisions, basePath }: Props = $props()
</script>

{#if revisions.length === 0}
	<Text
		as='p'
		class={styles.empty}
		variant='apparatusValue'>No revisions yet. The first save starts the history.</Text>
{:else}
	<ol
		class={styles.list}>
		{#each revisions as revision, index (revision.id)}
			<li
				class={styles.listRow}>
				<span>
					<Text
						variant='apparatusValue'><time
							datetime={revision.createdAt.toISOString()}>{formatTimestamp(revision.createdAt)}</time></Text>
					<Text
						variant='apparatusSmall'> · {revision.author ?? 'Seed'}{index === 0 ? ' · current' : ''}</Text>
				</span>
				{#if index > 0}
					<Text
						aria-label={`Compare and restore the revision of ${formatTimestamp(revision.createdAt)}`}
						as='a'
						href={`${basePath}/${revision.id}`}
						variant='apparatusValue'>Compare and restore</Text>
				{/if}
			</li>
		{/each}
	</ol>
{/if}
