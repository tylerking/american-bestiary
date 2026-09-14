<script
	lang='ts'>
	import Text from '$lib/components/elements/Text'
	import * as chartStyles from '$lib/styles/visualization.css'

	let { label, value, note }: { label: string; value: string; note?: string } = $props()
</script>

<div
	class={chartStyles.tile}>
	<Text
		variant='capsApparatus'>{label}</Text>
	<Text
		variant='themeTitle'>{value}</Text>
	{#if note}
		<Text
			variant='apparatusSmall'>{note}</Text>
	{/if}
</div>
