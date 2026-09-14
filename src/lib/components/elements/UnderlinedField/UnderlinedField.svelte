<script
	lang='ts'>
	import type { Snippet } from 'svelte'
	import Text from '$lib/components/elements/Text'
	import * as styles from './UnderlinedField.css'

	interface Props {
		label: string
		chevron?: boolean
		children: Snippet
	}

	let { label, chevron = false, children }: Props = $props()
</script>

<!-- biome-ignore lint/a11y/noLabelWithoutControl: the control arrives through the children snippet, which the linter cannot follow. -->
<label
	class={styles.field}>
	<Text
		class={styles.label}
		variant='capsField'>{label}</Text>
	{@render children()}
	{#if chevron}
		<span
			aria-hidden='true'
			class={styles.chevron}></span>
	{/if}
</label>
