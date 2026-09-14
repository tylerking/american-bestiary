<script
	lang='ts'>
	import { onMount, type Snippet } from 'svelte'
	import { page } from '$app/state'
	import { SITE_NAME } from '$lib/codex'
	import Text from '$lib/components/elements/Text'
	import * as styles from '$lib/styles/admin.css'
	import { announce } from '../announcer.svelte'

	interface Props {
		title: string
		eyebrow?: string
		notice?: string
		links?: Snippet
		children: Snippet
	}

	let { title, eyebrow, notice, links, children }: Props = $props()

	onMount(() => {
		if (notice) announce(notice)
	})
</script>

<svelte:head><title>{title} · Admin · {page.data.settings?.siteName ?? SITE_NAME}</title></svelte:head>

<div>
	<div
		class={styles.pageHeader}>
		<div>
			{#if eyebrow}
				<Text
					class={styles.eyebrow}
					tone='vermilion'
					variant='capsTitulus'>{eyebrow}</Text>
			{/if}
			<Text
				as='h1'
				variant='archiveTitle'>{title}</Text>
		</div>
		{#if links}
			<div
				class={styles.headerLinks}>{@render links()}</div>
		{/if}
	</div>
	{#if notice}
		<Text
			as='p'
			class={styles.notice}
			variant='apparatusValue'>{notice}</Text>
	{/if}
	{@render children()}
</div>
