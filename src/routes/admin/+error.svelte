<script
	lang='ts'>
	import { page } from '$app/state'
	import { AdminPage } from '$lib/components/admin'
	import Button from '$lib/components/elements/Button'
	import Text from '$lib/components/elements/Text'
	import * as styles from '$lib/styles/admin.css'

	const TITLES: Record<number, string> = { 403: 'Not allowed', 404: 'Not in the codex' }

	const title = $derived(`${TITLES[page.status] ?? 'Something went wrong'} (${page.status})`)
</script>

<AdminPage
	{title}>
	<Text
		as='p'
		class={styles.lead}
		variant='apparatusValue'>{page.error?.message ?? 'Something went wrong.'}</Text>
	{#if page.error?.id}
		<Text
			as='p'
			class={styles.hint}
			variant='apparatusSmall'>Reference {page.error.id}</Text>
	{/if}
	<Button
		href='/admin'
		variant='outline'>Back to the dashboard</Button>
</AdminPage>
