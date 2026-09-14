<script
	lang='ts'>
	import Text from '$lib/components/elements/Text'
	import * as styles from '$lib/styles/admin.css'
	import { button, screenReaderOnly } from '$lib/styles/recipes.css'
	import { IMAGE_ACCEPT, IMAGE_TOO_LARGE, MAX_IMAGE_BYTES } from '$lib/uploads'

	interface Props {
		name: string
		label: string
		id: string
		error?: string
	}

	let { name, label, id, error }: Props = $props()

	let files = $state<FileList | null>(null)
	let input = $state<HTMLInputElement>()
	const file = $derived(files?.[0])
	const problem = $derived(file && file.size > MAX_IMAGE_BYTES ? IMAGE_TOO_LARGE : '')
	const statusId = $derived(`${id}-status`)

	$effect(() => {
		input?.setCustomValidity(problem)
	})
</script>

<span
	class={styles.fileField}>
	<Text
		as='label'
		class={[button({ variant: 'outline' }), styles.fileLabel]}
		for={id}
		variant='button'>{label}</Text>
	<input
		accept={IMAGE_ACCEPT}
		aria-describedby={problem || error ? statusId : undefined}
		aria-invalid={problem || error ? 'true' : undefined}
		bind:files
		bind:this={input}
		class={screenReaderOnly}
		{id}
		{name}
		required
		type='file' />
	<Text
		aria-live='polite'
		id={statusId}
		tone={problem || error ? 'vermilion' : 'inherit'}
		variant='apparatusSmall'>{problem || error || file?.name || ''}</Text>
</span>
