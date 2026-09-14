<script
	lang='ts'>
	import { groupByKind } from '$lib/archive'
	import Text from '$lib/components/elements/Text'
	import { getLabels } from '$lib/labels/labels'
	import { groupLabel, statusLabel } from '$lib/labels/terms'
	import * as styles from '$lib/styles/admin.css'
	import { screenReaderOnly } from '$lib/styles/recipes.css'
	import type { Specimen } from '$lib/types'
	import { formatTimestamp } from '$lib/utils/dates'
	import { SORT_COLUMNS, type SortColumn, sortSpecimens } from './sort'

	interface Props {
		specimens: (Specimen & { position: number })[]
		sort: SortColumn
		descending: boolean
	}

	let { specimens, sort, descending }: Props = $props()

	const labels = $derived.by(getLabels())
	const HEADINGS: Record<SortColumn, string> = {
		name: 'Name',
		territory: 'Territory',
		status: 'Verdict',
		published: 'Published',
		updated: 'Updated'
	}
	const groups = $derived(groupByKind(sortSpecimens(specimens, sort, descending)))
	const href = (column: SortColumn) =>
		`?sort=${column}${column === sort && !descending ? '&direction=desc' : ''}`
	const ariaSort = (column: SortColumn) => (column === sort ? (descending ? 'descending' : 'ascending') : undefined)
</script>

<Text
	as='p'
	class={styles.hint}
	variant='apparatusSmall'>{labels.archiveAll}, grouped by kind. Select a column heading to sort within each kind.</Text>
<div
	class={styles.tableScroll}>
	<table
		class={styles.wideTable}>
		<caption
			class={screenReaderOnly}>{labels.archiveAll}, grouped by kind</caption>
		<thead>
			<tr>
				{#each SORT_COLUMNS as column (column)}
					<th
						aria-sort={ariaSort(column)}
						class={styles.tableHeader}
						scope='col'>
						<a
							class={styles.sortLink}
							href={href(column)}><Text
								variant='capsApparatus'>{HEADINGS[column]}</Text><span
								aria-hidden='true'>{column === sort ? (descending ? '↓' : '↑') : ''}</span></a>
					</th>
				{/each}
			</tr>
		</thead>
		{#each groups as group (group.kind)}
			<tbody>
				<tr>
					<th
						class={styles.groupRow}
						colspan={SORT_COLUMNS.length}
						scope='colgroup'><Text
							variant='capsGroup'>{groupLabel(labels, group.kind)}</Text></th>
				</tr>
				{#each group.items as specimen (specimen.id)}
					<tr>
						<th
							class={styles.rowHeader}
							scope='row'><Text
								as='a'
								href={`/admin/specimens/${specimen.id}`}
								variant='apparatusValue'>{specimen.name}</Text></th>
						<td
							class={styles.tableCell}><Text
								variant='apparatusValue'>{specimen.territory}</Text></td>
						<td
							class={styles.tableCell}><Text
								variant='apparatusValue'>{statusLabel(labels, specimen.status)}</Text></td>
						<td
							class={styles.tableCell}><Text
								tone={specimen.publishedAt ? 'inherit' : 'vermilion'}
								variant='apparatusValue'>{specimen.publishedAt ? 'Published' : 'Hidden'}</Text></td>
						<td
							class={styles.tableCellNowrap}><Text
								variant='apparatusSmall'><time
									datetime={specimen.updatedAt.toISOString()}>{formatTimestamp(specimen.updatedAt)}</time></Text></td>
					</tr>
				{/each}
			</tbody>
		{/each}
	</table>
</div>
