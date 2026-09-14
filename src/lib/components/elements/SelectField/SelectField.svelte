<script
	lang='ts'>
	import type { ClassValue } from 'svelte/elements'
	import Field, { coarse, select, selectWrap } from '$lib/components/elements/Field'

	interface Props {
		label: string
		name: string
		options: readonly { value: string; label: string }[]
		id?: string
		required?: boolean
		error?: string
		value?: string
		class?: ClassValue
	}

	let { label, name, options, id, required, error, value = $bindable(''), class: className }: Props = $props()
</script>

<Field
	class={className}
	{error}
	{id}
	{label}
	{name}
	requiredMark={!!required}>
	{#snippet control(attributes)}
		<div
			class={selectWrap}>
			<select
				{...attributes}
				bind:value
				class={[select, coarse]}
				{name}
				{required}>
				{#each options as option (option.value)}
					<option
						value={option.value}>{option.label}</option>
				{/each}
			</select>
		</div>
	{/snippet}
</Field>
