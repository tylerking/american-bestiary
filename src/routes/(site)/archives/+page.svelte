<script
	lang='ts'>
	import ArchivePage from '$lib/components/pages/ArchivePage'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()
</script>

<ArchivePage
	query={data.query}
	settings={data.settings}
	specimens={data.specimens} />
