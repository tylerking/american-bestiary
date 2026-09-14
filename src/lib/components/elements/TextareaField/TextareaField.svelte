<script
	lang='ts'>
	import type { ClassValue, HTMLTextareaAttributes } from 'svelte/elements'
	import Field, { textarea } from '$lib/components/elements/Field'

	interface Props extends Omit<HTMLTextareaAttributes, 'class' | 'id' | 'name' | 'value'> {
		label: string
		name?: string
		id?: string
		error?: string
		hint?: string
		value?: string
		class?: ClassValue
	}

	let { label, name, id, error, hint, value = $bindable(''), class: className, ...rest }: Props = $props()
</script>

<Field
	class={className}
	{error}
	{hint}
	{id}
	{label}
	{name}
	requiredMark={!!rest.required}>
	{#snippet control(attributes)}
		<textarea
			{...rest}
			{...attributes}
			bind:value
			class={textarea}
			{name}></textarea>
	{/snippet}
</Field>
