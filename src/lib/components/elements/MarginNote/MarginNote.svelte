<script
	lang='ts'>
	import type { Snippet } from 'svelte'
	import Text from '$lib/components/elements/Text'
	import { note } from './MarginNote.css'

	interface Props {
		label: string
		children: Snippet
	}

	let { label, children }: Props = $props()
</script>

<div
	class={note}>
	<Text
		as='div'
		variant='capsApparatus'>{label}</Text>
	{@render children()}
</div>
