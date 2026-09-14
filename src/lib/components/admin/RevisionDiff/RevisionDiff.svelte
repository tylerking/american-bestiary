<script
	lang='ts'>
	import Text from '$lib/components/elements/Text'
	import * as styles from '$lib/styles/admin.css'
	import type { FieldChange } from '$lib/types'

	let { changes }: { changes: FieldChange[] } = $props()

	const humanize = (field: string) =>
		field.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase())
</script>

{#if changes.length === 0}
	<Text
		as='p'
		class={styles.empty}
		variant='apparatusValue'>This revision matches the current version.</Text>
{:else}
	<div
		class={styles.tableScroll}>
		<table
			class={styles.diffTable}>
			<caption
				class={styles.caption}><Text
					variant='apparatusSmall'>{changes.length} {changes.length === 1 ? 'field differs' : 'fields differ'}</Text></caption>
			<thead>
				<tr>
					<th
						class={[styles.tableHeader, styles.diffFieldColumn]}
						scope='col'><Text
							variant='capsApparatus'>Field</Text></th>
					<th
						class={styles.tableHeader}
						scope='col'><Text
							variant='capsApparatus'>Current</Text></th>
					<th
						class={styles.tableHeader}
						scope='col'><Text
							variant='capsApparatus'>This revision</Text></th>
				</tr>
			</thead>
			<tbody>
				{#each changes as change (change.field)}
					<tr>
						<th
							class={styles.rowHeader}
							scope='row'><Text
								variant='apparatusValue'>{humanize(change.field)}</Text></th>
						<td
							class={styles.tableCellWrap}><Text
								variant='apparatusSmall'>{change.before || '(empty)'}</Text></td>
						<td
							class={styles.tableCellWrap}><Text
								tone='vermilion'
								variant='apparatusSmall'>{change.after || '(empty)'}</Text></td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
