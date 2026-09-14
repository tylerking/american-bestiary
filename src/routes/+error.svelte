<script
	lang='ts'>
	import { page } from '$app/state'
	import { SITE_NAME } from '$lib/codex'
	import AppShell from '$lib/components/layout/AppShell'
	import Footer from '$lib/components/layout/Footer'
	import SiteNavigation from '$lib/components/layout/SiteNavigation'
	import ErrorPage from '$lib/components/pages/ErrorPage'
	import { DEFAULT_LABELS } from '$lib/labels/label-defaults'
	import { setLabels } from '$lib/labels/labels'
	import type { SiteSettings } from '$lib/types'

	const settings = $derived(page.data.settings as SiteSettings | undefined)

	setLabels(() => settings?.labels ?? DEFAULT_LABELS)
</script>

<AppShell
	siteName={settings?.siteName ?? SITE_NAME}
	tagline={settings?.tagline}>
	{#snippet actions()}
		<SiteNavigation />
	{/snippet}
	{#snippet footer()}
		{#if settings}
			<Footer
				{settings} />
		{/if}
	{/snippet}
	<ErrorPage
		status={page.status} />
</AppShell>
