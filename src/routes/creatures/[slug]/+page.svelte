<script
  lang='ts'>
  import { Detail } from '$lib/components'
  import { global } from '$lib/data/global'

  import type { PageData } from './$types'

  let { data } = $props<{ data: PageData }>()
  const meta = $derived(global.detail_meta(data.creature.name))
</script>

<svelte:head>
  <title>{meta.title}</title>
  <meta
    content={meta.description}
    name='description' />
</svelte:head>

<Detail
  creature={data.creature}
  next={data.next}
  prev={data.prev} />
