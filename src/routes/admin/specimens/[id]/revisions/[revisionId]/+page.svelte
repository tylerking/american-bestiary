<script
	lang='ts'>
	import { RevisionPage } from '$lib/components/admin'
	import type { ActionData, PageData } from './$types'

	let { data, form }: { data: PageData; form: ActionData } = $props()
</script>

<RevisionPage
	{data}
	{form} />
