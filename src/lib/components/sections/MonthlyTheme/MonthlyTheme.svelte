<script
	lang='ts'>
	import SpecimenCard from '$lib/components/elements/SpecimenCard'
	import Text from '$lib/components/elements/Text'
	import type { MonthlyTheme } from '$lib/types'
	import { monthName } from '$lib/utils/dates'
	import * as styles from './MonthlyTheme.css'

	let { theme }: { theme: MonthlyTheme } = $props()

</script>

<section
	aria-labelledby='monthly-theme'
	class={styles.section}>
	<Text
		as='p'
		class={styles.month}
		tone='vermilion'
		variant='capsTitulus'>{monthName(theme.month)}</Text>
	<Text
		as='h2'
		class={styles.title}
		id='monthly-theme'
		variant='themeTitle'>{theme.title}</Text>
	<Text
		as='p'
		class={styles.description}>{theme.description}</Text>
	<div
		class={styles.grid}>
		{#each theme.members as member (member.slug)}
			<SpecimenCard
				note={member.note}
				sizes='(max-width: 760px) calc(50vw - 61px), 260px'
				specimen={member}
				variant='member' />
		{/each}
	</div>
</section>
