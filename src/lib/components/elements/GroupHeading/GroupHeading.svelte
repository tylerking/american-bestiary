<script
	lang='ts'>
	import Text from '$lib/components/elements/Text'
	import * as styles from './GroupHeading.css'

	interface Props {
		label: string
		count: string
		first?: boolean
	}

	let { label, count, first = false }: Props = $props()
</script>

<div
	class={[styles.row, first && styles.first]}>
	<span
		aria-hidden='true'
		class={styles.lozenge}></span>
	<Text
		as='h2'
		class={styles.nowrap}
		variant='capsGroup'>{label}</Text>
	<Text
		class={styles.nowrap}
		tone='vermilion'
		variant='groupCount'>{count}</Text>
	<span
		aria-hidden='true'
		class={styles.rule}></span>
</div>
