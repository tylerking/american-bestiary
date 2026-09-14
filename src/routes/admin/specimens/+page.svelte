<script
	lang='ts'>
	import { AdminPage, SpecimenTable } from '$lib/components/admin'
	import Text from '$lib/components/elements/Text'
	import * as styles from '$lib/styles/admin.css'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()
</script>

<AdminPage
	eyebrow='The codex'
	title='Specimens'>
	<Text
		as='p'
		class={styles.lead}
		variant='apparatusValue'>The roster is fixed at fifty, one per territory.</Text>
	<SpecimenTable
		descending={data.descending}
		sort={data.sort}
		specimens={data.specimens} />
</AdminPage>
