<script
  lang='ts'>
  import { Archives } from '$lib/components'
  import { global } from '$lib/data/global'

  import type { PageData } from './$types'

  let { data } = $props<{ data: PageData }>()
</script>

<svelte:head>
  <title>{global.archives_meta.title}</title>
  <meta
    content={global.archives_meta.description}
    name='description' />
</svelte:head>

<Archives
  creatures={data.creatures} />
