<script
	lang='ts'>
	import type { Snippet } from 'svelte'
	import { page } from '$app/state'
	import { ADMIN_NAVIGATION, live } from '$lib/components/admin'
	import Text from '$lib/components/elements/Text'
	import AppShell from '$lib/components/layout/AppShell'
	import { content } from '$lib/components/layout/AppShell/AppShell.css'
	import Footer from '$lib/components/layout/Footer'
	import { action, actions as actionRow } from '$lib/components/layout/Header/Header.css'
	import RailLayout from '$lib/components/layout/RailLayout'
	import { setLabels } from '$lib/labels/labels'
	import * as styles from '$lib/styles/admin.css'
	import { screenReaderOnly } from '$lib/styles/recipes.css'
	import type { LayoutData } from './$types'

	let { children, data }: { children: Snippet; data: LayoutData } = $props()

	setLabels(() => data.settings.labels)

	const preview = $derived(page.route.id?.startsWith('/admin/preview') ?? false)
	const isActive = (href: string) =>
		href === '/admin' ? page.url.pathname === '/admin' : page.url.pathname.startsWith(href)
</script>

{#if preview}
	{@render children()}
{:else}
	<AppShell
		homeHref='/admin'
		preloadData='tap'
		siteName={data.settings.siteName}
		tagline={data.settings.tagline}>
		{#snippet actions()}
			<div
				class={actionRow}>
				<Text
					as='a'
					class={action}
					href='/'
					rel='noopener'
					target='_blank'
					variant='navigation'>View the site<span
						class={screenReaderOnly}>{` ${data.settings.labels.newTab}`}</span></Text>
				{#if data.admin}
					<form
						action='/admin/logout'
						method='POST'>
						<Text
							as='button'
							class={action}
							type='submit'
							variant='navigation'>Sign out</Text>
					</form>
				{/if}
			</div>
		{/snippet}
		{#snippet footer()}
			<Footer
				settings={data.settings} />
		{/snippet}
		{#if data.admin}
			<RailLayout
				class={content}
				railFirst
				stickyRail>
				{#snippet rail()}
					<nav
						aria-label='Admin'
						class={styles.railNavigation}>
						{#each ADMIN_NAVIGATION as group (group.title)}
							<div
								class={styles.navigationGroup}>
								{#if group.title}
									<Text
										class={styles.navigationGroupTitle}
										variant='capsApparatus'>{group.title}</Text>
								{/if}
								{#each group.links as link (link.href)}
									<Text
										aria-current={isActive(link.href) ? 'page' : undefined}
										as='a'
										class={styles.railLink}
										href={link.href}
										variant='navigation'>{link.label}</Text>
								{/each}
							</div>
						{/each}
					</nav>
					<form
						action='/admin/logout'
						class={styles.railFooter}
						method='POST'>
						<Text
							as='button'
							class={styles.navigationButton}
							name='scope'
							type='submit'
							value='all'
							variant='apparatusValue'>Sign out everywhere</Text>
					</form>
				{/snippet}
				<main
					id='main-content'
					tabindex='-1'>
					{@render children()}
				</main>
			</RailLayout>
		{:else}
			<main
				class={content}
				id='main-content'
				tabindex='-1'>
				{@render children()}
			</main>
		{/if}
	</AppShell>
	{#if data.admin}
		<div
			class={screenReaderOnly}
			role='status'>{live.message}</div>
	{/if}
{/if}
