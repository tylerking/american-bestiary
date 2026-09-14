<script
	lang='ts'>
	import type { Snippet } from 'svelte'
	import type { ClassValue } from 'svelte/elements'
	import Text from '$lib/components/elements/Text'
	import * as styles from './Field.css'

	interface Control {
		id: string
		'aria-invalid': 'true' | undefined
		'aria-describedby': string | undefined
	}

	interface Props {
		label: string
		name?: string
		id?: string
		requiredMark?: boolean
		invalid?: boolean
		error?: string
		hint?: string
		describedBy?: string
		class?: ClassValue
		control: Snippet<[Control]>
	}

	let {
		label,
		name,
		id: idProperty,
		requiredMark = false,
		invalid = false,
		error,
		hint,
		describedBy: extraDescription,
		class: className,
		control
	}: Props = $props()

	const id = $derived(idProperty ?? `field-${name}`)
	const errorId = $derived(`${id}-error`)
	const hintId = $derived(`${id}-hint`)
	const describedBy = $derived(
		[error && errorId, hint && hintId, extraDescription].filter(Boolean).join(' ') || undefined
	)
</script>

<div
	class={[styles.field, className]}>
	<Text
		as='label'
		class={[styles.label, requiredMark && styles.requiredMark]}
		for={id}
		variant='capsField'>{label}</Text>
	{@render control({ id, 'aria-invalid': error || invalid ? 'true' : undefined, 'aria-describedby': describedBy })}
	{#if error}
		<Text
			class={styles.message}
			id={errorId}
			tone='vermilion'
			variant='apparatusSmall'>{error}</Text>
	{/if}
	{#if hint}
		<Text
			class={styles.message}
			id={hintId}
			variant='apparatusSmall'>{hint}</Text>
	{/if}
</div>
