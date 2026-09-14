<script
	lang='ts'>
	import Text from '$lib/components/elements/Text'
	import { getLabels } from '$lib/labels/labels'
	import { screenReaderOnly } from '$lib/styles/recipes.css'
	import type { SiteSettings } from '$lib/types'
	import * as styles from './Footer.css'

	let { settings }: { settings: SiteSettings } = $props()

	const labels = $derived.by(getLabels())
</script>

<footer
	class={styles.footer}>
	<Text
		as='div'
		class={styles.row}
		variant='footer'>
		<span>{settings.footerText}</span>
		{#if settings.creditName}
			<span>{settings.creditLabel}
				<a
					href={settings.creditUrl}
					rel='noopener noreferrer'
					target='_blank'>{settings.creditName}<span
						class={screenReaderOnly}>{` ${labels.newTab}`}</span></a>.</span>
		{/if}
	</Text>
</footer>
