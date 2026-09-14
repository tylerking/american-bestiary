<script
	lang='ts'>
	import { onMount } from 'svelte'
	import { beforeNavigate } from '$app/navigation'
	import Button from '$lib/components/elements/Button'
	import Text from '$lib/components/elements/Text'
	import * as styles from '$lib/styles/admin.css'
	import { flagField } from '$lib/utils/forms'
	import { isApplePlatform } from '$lib/utils/platform'

	interface Props {
		form: string
		label: string
		result?: { success?: boolean; message?: string; field?: string } | null
	}

	let { form, label, result }: Props = $props()

	const statusId = $props.id()
	const errorId = `${statusId}-error`
	let dirty = $state(false)
	let edited = $state(false)
	let saveKey = $state('Ctrl+S')

	$effect(() => {
		if (!result) return
		edited = false
		if (result.success) dirty = false
	})

	$effect(() => {
		const editor = document.getElementById(form)
		if (!editor || !flagField(editor, result?.field, errorId)) return
		return () => {
			flagField(editor, undefined, errorId)
		}
	})

	onMount(() => {
		const keyboard = typeof matchMedia !== 'function' || matchMedia('(any-pointer: fine)').matches
		saveKey = keyboard ? (isApplePlatform() ? '⌘S' : 'Ctrl+S') : ''
		const editor = document.getElementById(form)
		if (!(editor instanceof HTMLFormElement)) return
		const mark = (event: Event) => {
			const target = event.target
			if (!target || !('form' in target) || target.form !== editor) return
			dirty = true
			edited = true
		}
		const onKey = (event: KeyboardEvent) => {
			if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 's') return
			event.preventDefault()
			editor.requestSubmit()
		}
		const onUnload = (event: BeforeUnloadEvent) => {
			if (dirty) event.preventDefault()
		}
		document.addEventListener('input', mark)
		document.addEventListener('change', mark)
		window.addEventListener('keydown', onKey)
		window.addEventListener('beforeunload', onUnload)
		return () => {
			document.removeEventListener('input', mark)
			document.removeEventListener('change', mark)
			window.removeEventListener('keydown', onKey)
			window.removeEventListener('beforeunload', onUnload)
		}
	})

	beforeNavigate((navigation) => {
		if (dirty && navigation.type !== 'form' && !confirm('You have unsaved changes. Leave this page?')) navigation.cancel()
	})

	const unsaved = $derived(saveKey ? `Unsaved changes · ${saveKey} saves` : 'Unsaved changes')
	const outcome = $derived(result?.message ?? (result?.success ? 'Saved.' : ''))
	const failed = $derived(!!result?.message && !result.success)
	const showOutcome = $derived(failed ? !edited : !dirty)
</script>

<div
	class={styles.saveBar}>
	<div>
		<Text
			role='status'
			tone={failed ? 'vermilion' : 'inherit'}
			variant='apparatusValue'>{showOutcome ? outcome : ''}</Text>
		{#if dirty && !showOutcome}
			<Text
				variant='apparatusSmall'>{unsaved}</Text>
		{/if}
		<span
			hidden
			id={errorId}>{result?.field ? result.message : ''}</span>
	</div>
	<Button
		{form}
		type='submit'>{label}</Button>
</div>
