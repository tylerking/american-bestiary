<script
  lang='ts'>
  import { page } from '$app/stores'
  import { Home, Seo } from '$lib/components'
  import { global } from '$lib/data/global'

  import type { PageData } from './$types'

  let { data } = $props<{ data: PageData }>()

  const jsonLd = $derived({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    description: global.site_meta.description,
    logo: `${$page.url.origin}/logo.svg`,
    name: 'American Bestiary',
    url: $page.url.origin,
  })
</script>

<Seo
  description={global.home_meta.description}
  {jsonLd}
  title={global.home_meta.title} />

<Home
  creatures={data.creatures} />
