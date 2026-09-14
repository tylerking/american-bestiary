<script
	lang='ts'>
	import Initial from '$lib/components/elements/Initial'
	import Text from '$lib/components/elements/Text'
	import * as styles from './Incipit.css'

	let { text }: { text: string } = $props()
</script>

<section
	class={styles.section}>
	<Text
		as='div'
		class={styles.columns}
		variant='incipit'>
		<p
			class={styles.paragraph}>
			<Initial
				size='incipit'
				{text} />
		</p>
	</Text>
</section>
