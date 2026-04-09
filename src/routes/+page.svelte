<script
  lang='ts'>
  import { Home } from '$lib/components'
  import { global } from '$lib/data/global'

  import type { PageData } from './$types'

  let { data } = $props<{ data: PageData }>()
</script>

<svelte:head>
  <title>{global.home_meta.title}</title>
  <meta
    content={global.home_meta.description}
    name='description' />
</svelte:head>

<Home
  creatures={data.creatures} />
