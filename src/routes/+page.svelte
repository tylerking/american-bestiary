<script
  lang='ts'>
  import { Home, Seo } from '$lib/components'
  import { global } from '$lib/data/global'

  import type { PageData } from './$types'

  let { data } = $props<{ data: PageData }>()
</script>

<Seo
  description={global.home_meta.description}
  title={global.home_meta.title} />

<Home
  creatures={data.creatures} />
