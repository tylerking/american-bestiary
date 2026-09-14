<script
	lang='ts'>
	import type { Snippet } from 'svelte'
	import Button from '$lib/components/elements/Button'
	import Text from '$lib/components/elements/Text'
	import * as styles from '$lib/styles/admin.css'

	interface Props {
		heading: string
		subtitle?: string
		chart: Snippet
		table: Snippet
	}

	let { heading, subtitle, chart, table }: Props = $props()

	const headingId = $props.id()
	let showTable = $state(false)
</script>

<section
	aria-labelledby={headingId}
	class={styles.card}>
	<div
		class={styles.chartHead}>
		<div>
			<Text
				as='h2'
				id={headingId}
				variant='memberName'>{heading}</Text>
			{#if subtitle}
				<Text
					as='p'
					variant='apparatusSmall'>{subtitle}</Text>
			{/if}
		</div>
		<Button
			aria-label={`Table of ${heading}`}
			aria-pressed={showTable}
			class={[styles.pressable, styles.squareTouch]}
			onclick={() => (showTable = !showTable)}
			variant='outline'>Table</Button>
	</div>
	{#if showTable}
		{@render table()}
	{:else}
		{@render chart()}
	{/if}
</section>
