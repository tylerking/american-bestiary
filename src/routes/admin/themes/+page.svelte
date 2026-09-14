<script
	lang='ts'>
	import { AdminPage } from '$lib/components/admin'
	import Text from '$lib/components/elements/Text'
	import * as styles from '$lib/styles/admin.css'
	import { monthName } from '$lib/utils/dates'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()
</script>

<AdminPage
	eyebrow='The codex'
	title='Themes'>
	<Text
		as='p'
		class={styles.lead}
		variant='apparatusValue'>One theme per month, four specimens each. The home page shows the theme for the current month (UTC).</Text>
	<div
		class={styles.tableScroll}>
		<table
			class={styles.table}>
			<caption
				class={styles.caption}><Text
					variant='apparatusSmall'>Twelve themes, January to December.</Text></caption>
			<thead>
				<tr>
					<th
						class={styles.tableHeader}
						scope='col'><Text
							variant='capsApparatus'>Month</Text></th>
					<th
						class={styles.tableHeader}
						scope='col'><Text
							variant='capsApparatus'>Theme</Text></th>
					<th
						class={styles.tableHeader}
						scope='col'><Text
							variant='capsApparatus'>Specimens</Text></th>
				</tr>
			</thead>
			<tbody>
				{#each data.themes as theme (theme.id)}
					<tr>
						<td
							class={styles.tableCell}><Text
								variant='apparatusValue'>{monthName(theme.month)}</Text></td>
						<th
							class={styles.rowHeader}
							scope='row'><Text
								as='a'
								href={`/admin/themes/${theme.id}`}
								variant='apparatusValue'>{theme.title}</Text></th>
						<td
							class={styles.tableCell}><Text
								variant='apparatusSmall'>{theme.members.join(', ')}</Text></td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</AdminPage>
