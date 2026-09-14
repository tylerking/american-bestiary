<script
	lang='ts'>
	import Text from '$lib/components/elements/Text'
	import AppShell from '$lib/components/layout/AppShell'
	import Footer from '$lib/components/layout/Footer'
	import SiteNavigation from '$lib/components/layout/SiteNavigation'
	import EntryPage from '$lib/components/pages/EntryPage'
	import { setLabels } from '$lib/labels/labels'
	import { previewBanner } from '$lib/styles/admin.css'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()

	setLabels(() => data.settings.labels)
</script>

<svelte:head>
	<meta
		content='noindex, nofollow'
		name='robots' />
</svelte:head>

<AppShell
	siteName={data.settings.siteName}
	tagline={data.settings.tagline}>
	{#snippet banner()}
		<Text
			aria-label='Preview'
			as='aside'
			class={previewBanner}
			variant='apparatusValue'>
			<span>Preview of {data.specimen.name}: {data.specimen.publishedAt ? 'published' : 'hidden from the public site'}.</span>
			<a
				href={`/admin/specimens/${data.specimen.id}`}>Back to the editor</a>
		</Text>
	{/snippet}
	{#snippet actions()}
		<SiteNavigation />
	{/snippet}
	{#snippet footer()}
		<Footer
			settings={data.settings} />
	{/snippet}
	<EntryPage
		neighbours={data.neighbours}
		settings={data.settings}
		specimen={data.specimen} />
</AppShell>
