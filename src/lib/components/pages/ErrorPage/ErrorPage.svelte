<script
	lang='ts'>
	import Button from '$lib/components/elements/Button'
	import Text from '$lib/components/elements/Text'
	import { content } from '$lib/components/layout/AppShell/AppShell.css'
	import { getLabels } from '$lib/labels/labels'
	import * as styles from './ErrorPage.css'

	let { status }: { status: number } = $props()

	const labels = $derived.by(getLabels())
	const notFound = $derived(status === 404)
</script>

<svelte:head>
	<title>{status} · {notFound ? labels.errorTitle : labels.errorServerTitle}</title>
</svelte:head>

<main
	class={content}
	id='main-content'
	tabindex='-1'>
	<Text
		as='p'
		class={styles.code}
		tone='vermilion'
		variant='capsEntryNumber'>{status}</Text>
	<Text
		as='h1'
		variant='archiveTitle'>{notFound ? labels.errorTitle : labels.errorServerTitle}</Text>
	<Text
		as='p'
		class={styles.body}>{notFound ? labels.errorBody : labels.errorServerBody}</Text>
	<nav
		aria-label={labels.errorRoutesAria}
		class={styles.routes}>
		<Button
			href='/'>{labels.errorHome}</Button>
		<Button
			href='/archives'
			variant='toggle'>{labels.errorArchive}</Button>
	</nav>
</main>
