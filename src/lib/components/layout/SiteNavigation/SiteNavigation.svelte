<script
	lang='ts'>
	import { page } from '$app/state'
	import Text from '$lib/components/elements/Text'
	import { action, actions } from '$lib/components/layout/Header/Header.css'
	import { getLabels } from '$lib/labels/labels'

	const labels = $derived.by(getLabels())
	const links = $derived([
		{ href: '/', label: labels.navigationMap, current: page.url.pathname === '/' },
		{ href: '/archives', label: labels.navigationArchive, current: page.url.pathname.startsWith('/archives') }
	])
</script>

<nav
	aria-label={labels.navigationPrimaryAria}
	class={actions}>
	{#each links as link (link.href)}
		<Text
			aria-current={link.current ? 'page' : undefined}
			as='a'
			class={action}
			href={link.href}
			variant='navigation'>{link.label}</Text>
	{/each}
</nav>
