<script
	lang='ts'>
	import Text from '$lib/components/elements/Text'
	import * as styles from './FilterRow.css'

	interface Props {
		label: string
		name: string
		options: readonly { value: string; label: string }[]
		current: string
		spacing: keyof typeof styles.spacing
		search: (value: string) => string
		onselect: (value: string) => void
	}

	let { label, name, options, current, spacing, search, onselect }: Props = $props()

	const id = $props.id()

	function choose(event: MouseEvent, value: string) {
		if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
		event.preventDefault()
		onselect(value)
	}
</script>

<!-- biome-ignore lint/a11y/useSemanticElements: a legend cannot sit inline in the flex row, so the group is labelled by id instead. -->
<div
	aria-labelledby={id}
	class={styles.spacing[spacing]}
	data-filter={name}
	role='group'>
	<Text
		class={styles.label}
		{id}
		variant='capsApparatus'>{label}</Text>
	{#each options as option (option.value)}
		<Text
			aria-current={option.value === current ? 'true' : undefined}
			as='a'
			class={styles.option}
			href={search(option.value) || '?'}
			onclick={(event: MouseEvent) => choose(event, option.value)}
			variant='filter'>{option.label}</Text>
	{/each}
</div>
