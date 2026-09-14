<script
	lang='ts'>
	import Text from '$lib/components/elements/Text'
	import * as styles from '$lib/styles/admin.css'
	import * as chartStyles from '$lib/styles/visualization.css'

	interface Props {
		items: { key: string; label: string; value: number }[]
		empty: string
	}

	let { items, empty }: Props = $props()

	const max = $derived(Math.max(1, ...items.map((item) => item.value)))
</script>

{#if items.length === 0}
	<Text
		as='p'
		class={styles.empty}
		variant='apparatusValue'>{empty}</Text>
{:else}
	<ul
		class={styles.list}>
		{#each items as item (item.key)}
			<li
				class={chartStyles.horizontalBarRow}>
				<Text
					class={chartStyles.horizontalBarLabel}
					variant='apparatusValue'>{item.label}</Text>
				<Text
					variant='apparatusValue'>{item.value}</Text>
				<div
					aria-hidden='true'
					class={chartStyles.horizontalBarTrack}>
					<div
						class={chartStyles.horizontalBarFill}
						style:clip-path={`inset(0 ${(1 - Math.max(0.02, item.value / max)) * 100}% 0 0)`}></div>
				</div>
			</li>
		{/each}
	</ul>
{/if}
