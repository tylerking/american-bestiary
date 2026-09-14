<script
	lang='ts'>
	import type { ClassValue, HTMLInputAttributes } from 'svelte/elements'
	import Field, { coarse, input } from '$lib/components/elements/Field'

	interface Props extends Omit<HTMLInputAttributes, 'class' | 'id' | 'name' | 'value'> {
		label: string
		name?: string
		id?: string
		error?: string
		hint?: string
		invalid?: boolean
		describedBy?: string
		value?: string | number | null
		class?: ClassValue
	}

	let {
		label,
		name,
		id,
		error,
		hint,
		invalid,
		describedBy,
		value = $bindable(''),
		class: className,
		...rest
	}: Props = $props()
</script>

<Field
	class={className}
	{describedBy}
	{error}
	{hint}
	{id}
	{invalid}
	{label}
	{name}
	requiredMark={!!rest.required}>
	{#snippet control(attributes)}
		<input
			{...rest}
			{...attributes}
			bind:value
			class={[input, coarse]}
			{name} />
	{/snippet}
</Field>
