<script
	lang='ts'>
	import HomePage from '$lib/components/pages/HomePage'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()
</script>

<HomePage
	settings={data.settings}
	specimens={data.specimens}
	territory={data.territory}
	theme={data.theme} />
