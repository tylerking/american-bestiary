<script
	lang='ts'>
	import { AdminPage, ChartCard, HorizontalBars, StatTile, WeeklyColumns } from '$lib/components/admin'
	import Text from '$lib/components/elements/Text'
	import * as styles from '$lib/styles/admin.css'
	import { screenReaderOnly } from '$lib/styles/recipes.css'
	import { formatCompact, formatShortDate } from '$lib/utils/format'
	import type { PageData } from './$types'

	interface Row {
		key: string
		label: string
		value: number
	}

	let { data }: { data: PageData } = $props()

	const analytics = $derived(data.analytics)
	const weeks = $derived(analytics.visitsByWeek.map(({ week, counts }) => ({ week, value: counts.Visits ?? 0 })))
	const entries = $derived<Row[]>(
		analytics.topEntries.map((entry) => ({ key: entry.path, label: entry.title, value: entry.views }))
	)
	const referrers = $derived<Row[]>(
		analytics.referrers.map((referrer) => ({ key: referrer.host, label: referrer.host, value: referrer.views }))
	)
	const outbound = $derived<Row[]>(
		analytics.outbound.map((host) => ({ key: host.host, label: host.host, value: host.clicks }))
	)
</script>

{#snippet rowsTable(caption: string, column: string, unit: string, rows: Row[])}
	<div
		class={styles.tableScroll}>
		<table
			class={styles.table}>
			<caption
				class={screenReaderOnly}>{caption}</caption>
			<thead>
				<tr>
					<th
						class={styles.tableHeader}
						scope='col'><Text
							variant='capsApparatus'>{column}</Text></th>
					<th
						class={styles.tableHeaderNumeric}
						scope='col'><Text
							variant='capsApparatus'>{unit}</Text></th>
				</tr>
			</thead>
			<tbody>
				{#each rows as row (row.key)}
					<tr>
						<th
							class={styles.rowHeader}
							scope='row'><Text
								variant='apparatusValue'>{row.label}</Text></th>
						<td
							class={styles.tableCellNumeric}><Text
								variant='apparatusValue'>{row.value}</Text></td>
					</tr>
				{:else}
					<tr>
						<td
							class={styles.tableCell}
							colspan='2'><Text
								variant='apparatusValue'>Nothing recorded yet.</Text></td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/snippet}

<AdminPage
	eyebrow={`${data.counts.published} of ${data.counts.specimens} specimens published`}
	title='Dashboard'>

	<div
		class={styles.statisticsRow}>
		<StatTile
			label='Visits'
			note='last 30 days'
			value={formatCompact(analytics.stats.visitsLast30Days)} />
		<StatTile
			label='Visits this week'
			note='last 7 days'
			value={formatCompact(analytics.stats.visitsLast7Days)} />
		<StatTile
			label='Entry views'
			note='last 30 days'
			value={formatCompact(analytics.stats.entryViewsLast30Days)} />
		<StatTile
			label='Outbound clicks'
			note='last 30 days'
			value={formatCompact(analytics.stats.outboundLast30Days)} />
	</div>

	<ChartCard
		heading='Visits by week'
		subtitle='Pageviews, last 12 weeks'>
		{#snippet chart()}
			<WeeklyColumns
				data={weeks}
				empty='No visits recorded in the last 12 weeks.'
				label='Visits per week over the last 12 weeks' />
		{/snippet}
		{#snippet table()}
			{@render rowsTable(
				'Visits by week',
				'Week of',
				'Visits',
				weeks.map((week) => ({ key: week.week, label: formatShortDate(week.week), value: week.value }))
			)}
		{/snippet}
	</ChartCard>

	<ChartCard
		heading='Most-read entries'
		subtitle='Entry views, last 30 days'>
		{#snippet chart()}
			<HorizontalBars
				empty='No entry views recorded yet.'
				items={entries} />
		{/snippet}
		{#snippet table()}
			{@render rowsTable('Most-read entries by views', 'Entry', 'Views', entries)}
		{/snippet}
	</ChartCard>

	<div
		class={styles.chartsRow}>
		<ChartCard
			heading='Referrers'
			subtitle='Where visits came from, last 30 days'>
			{#snippet chart()}
				<HorizontalBars
					empty='No referrers recorded yet.'
					items={referrers} />
			{/snippet}
			{#snippet table()}
				{@render rowsTable('Referrers by visits', 'Source', 'Visits', referrers)}
			{/snippet}
		</ChartCard>

		<ChartCard
			heading='Outbound clicks'
			subtitle='Sources and credits followed, last 30 days'>
			{#snippet chart()}
				<HorizontalBars
					empty='No outbound clicks recorded yet.'
					items={outbound} />
			{/snippet}
			{#snippet table()}
				{@render rowsTable('Outbound clicks by host', 'Host', 'Clicks', outbound)}
			{/snippet}
		</ChartCard>
	</div>
</AdminPage>
