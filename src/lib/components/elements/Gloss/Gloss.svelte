<script
	lang='ts'>
	import Text from '$lib/components/elements/Text'
	import * as styles from './Gloss.css'

	interface Props {
		text: string
		placement: 'featured' | 'inline' | 'margin'
		statusLabel?: string
	}

	let { text, placement, statusLabel }: Props = $props()
</script>

{#if placement === 'margin'}
	<div
		class={styles.margin}>
		<Text
			as='div'
			variant='capsApparatus'>{statusLabel}</Text>
		<Text
			as='p'
			class={styles.marginText}
			tone='vermilion'
			variant='gloss'>{text}</Text>
	</div>
{:else}
	<Text
		as='p'
		class={placement === 'featured' ? styles.featured : styles.inline}
		tone='vermilion'
		variant='gloss'>{text}</Text>
{/if}
