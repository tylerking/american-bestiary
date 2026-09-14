<script
	lang='ts'>
	import Text from '$lib/components/elements/Text'
	import * as styles from '$lib/styles/admin.css'
	import * as chartStyles from '$lib/styles/visualization.css'
	import { formatShortDate } from '$lib/utils/format'

	interface Props {
		data: { week: string; value: number }[]
		label: string
		empty: string
	}

	let { data, label, empty }: Props = $props()

	const WIDTH = 720
	const HEIGHT = 220
	const PADDING = { top: 20, right: 8, bottom: 28, left: 44 }

	const descriptionId = $props.id()
	const peak = $derived(Math.max(0, ...data.map((datum) => datum.value)))
	const step = $derived([1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000].find((size) => peak / size <= 5) ?? 10000)
	const top = $derived(Math.max(step, Math.ceil(peak / step) * step))
	const ticks = $derived(Array.from({ length: top / step + 1 }, (_, index) => index * step))
	const plotWidth = WIDTH - PADDING.left - PADDING.right
	const plotHeight = HEIGHT - PADDING.top - PADDING.bottom
	const slot = $derived(plotWidth / Math.max(1, data.length))
	const barWidth = $derived(Math.min(28, slot * 0.6))
	const yFor = (value: number) => PADDING.top + plotHeight - (value / top) * plotHeight
	const total = $derived(data.reduce((sum, datum) => sum + datum.value, 0))
	const peakWeek = $derived(data.find((datum) => datum.value === peak)?.week ?? '')
</script>

{#if total === 0}
	<Text
		as='p'
		class={styles.empty}
		variant='apparatusValue'>{empty}</Text>
{:else}
	<svg
		aria-describedby={descriptionId}
		aria-label={label}
		class={chartStyles.svg}
		role='img'
		viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
		<desc
			id={descriptionId}>Peak of {peak} in the week of {formatShortDate(peakWeek)}; {total} across {data.length}
			weeks.</desc>
		{#each ticks as tick (tick)}
			<line
				class={chartStyles.gridLine}
				x1={PADDING.left}
				x2={WIDTH - PADDING.right}
				y1={yFor(tick)}
				y2={yFor(tick)} />
			<text
				class={chartStyles.axisText}
				text-anchor='end'
				x={PADDING.left - 8}
				y={yFor(tick) + 4}>{tick}</text>
		{/each}
		{#each data as datum, index (datum.week)}
			<rect
				class={chartStyles.column}
				height={Math.max(0, yFor(0) - yFor(datum.value))}
				width={barWidth}
				x={PADDING.left + slot * index + (slot - barWidth) / 2}
				y={yFor(datum.value)} />
			{#if index % 2 === 0}
				<text
					class={chartStyles.axisText}
					text-anchor='middle'
					x={PADDING.left + slot * index + slot / 2}
					y={HEIGHT - 8}>{formatShortDate(datum.week)}</text>
			{/if}
		{/each}
	</svg>
{/if}
