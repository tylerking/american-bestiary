<script
	lang='ts'>
	import { tick } from 'svelte'
	import Button from '$lib/components/elements/Button'
	import * as styles from '$lib/styles/admin.css'
	import { bareFieldset } from '$lib/styles/reset.css'

	interface Props {
		label: string
		confirmLabel: string
		formaction: string
	}

	let { label, confirmLabel, formaction }: Props = $props()

	let armed = $state(false)
	let trigger = $state<HTMLElement>()
	let confirmElement = $state<HTMLElement>()

	async function arm() {
		armed = true
		await tick()
		confirmElement?.focus()
	}

	async function cancel() {
		armed = false
		await tick()
		trigger?.focus()
	}

	function onKey(event: KeyboardEvent) {
		if (event.key === 'Escape') cancel()
	}
</script>

{#if armed}
	<fieldset
		aria-label={`Confirm: ${label}`}
		class={[bareFieldset, styles.confirmGroup]}>
		<Button
			aria-label={`${confirmLabel}: ${label}`}
			bind:element={confirmElement}
			class={styles.squareTouch}
			{formaction}
			onkeydown={onKey}
			type='submit'
			variant='vermilion'>{confirmLabel}</Button>
		<Button
			class={styles.squareTouch}
			onclick={cancel}
			onkeydown={onKey}
			variant='outline'>Cancel</Button>
	</fieldset>
{:else}
	<Button
		bind:element={trigger}
		class={styles.squareTouch}
		onclick={arm}
		variant='danger'>{label}</Button>
{/if}
