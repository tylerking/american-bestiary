<script
	lang='ts'>
	import type { Snippet } from 'svelte'
	import { onMount } from 'svelte'
	import { afterNavigate } from '$app/navigation'
	import AppShell from '$lib/components/layout/AppShell'
	import Footer from '$lib/components/layout/Footer'
	import SiteNavigation from '$lib/components/layout/SiteNavigation'
	import { setLabels } from '$lib/labels/labels'
	import { initClickTracking, trackPageview } from '$lib/utils/track'
	import type { LayoutData } from './$types'

	let { children, data }: { children: Snippet; data: LayoutData } = $props()

	setLabels(() => data.settings.labels)

	onMount(() => initClickTracking())

	afterNavigate((navigation) => {
		trackPageview(navigation.to?.url.pathname ?? location.pathname, navigation.type === 'enter' ? document.referrer : '')
	})
</script>

<AppShell
	siteName={data.settings.siteName}
	tagline={data.settings.tagline}>
	{#snippet actions()}
		<SiteNavigation />
	{/snippet}
	{#snippet footer()}
		<Footer
			settings={data.settings} />
	{/snippet}
	{@render children()}
</AppShell>
