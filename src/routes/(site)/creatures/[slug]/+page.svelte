<script
	lang='ts'>
	import EntryPage from '$lib/components/pages/EntryPage'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()
</script>

<EntryPage
	neighbours={data.neighbours}
	settings={data.settings}
	specimen={data.specimen} />
