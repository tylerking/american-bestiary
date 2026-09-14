<script
	lang='ts'>
	import type { Snippet } from 'svelte'
	import type { ClassValue } from 'svelte/elements'
	import type { TextAttributes } from './attributes'
	import { tone as tones, variant as variants } from './Text.css'

	type Props = TextAttributes & {
		as?:
			| 'span'
			| 'a'
			| 'aside'
			| 'button'
			| 'div'
			| 'p'
			| 'h1'
			| 'h2'
			| 'h3'
			| 'label'
			| 'figcaption'
			| 'dd'
			| 'dt'
			| 'td'
			| 'th'
			| 'li'
		variant?: keyof typeof variants
		tone?: keyof typeof tones
		class?: ClassValue
		element?: HTMLElement
		children: Snippet
	}

	let {
		as = 'span',
		variant = 'body',
		tone = 'inherit',
		class: className,
		element = $bindable(),
		children,
		...rest
	}: Props = $props()
</script>

<svelte:element
	bind:this={element}
	class={[variants[variant], tones[tone], className]}
	this={as}
	{...rest}>{@render children()}</svelte:element>
