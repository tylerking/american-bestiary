<script
  lang='ts'>
  import { page } from '$app/stores'
  import { Creature, Seo } from '$lib/components'
  import { global } from '$lib/data/global'
  import { slugify } from '$lib/utils/slugify'

  import type { PageData } from './$types'

  let { data } = $props<{ data: PageData }>()

  const meta = $derived(global.creature_meta(data.creature.name))
  const image = $derived(`/images/${slugify(data.creature.name)}.png`)
  const canonical = $derived(`${$page.url.origin}/creatures/${slugify(data.creature.name)}`)

  const jsonLd = $derived({
    '@context': 'https://schema.org',
    '@type': 'Article',
    about: {
      '@type': 'Thing',
      description: data.creature.abstract,
      name: data.creature.name,
    },
    author: {
      '@type': 'Organization',
      name: 'American Bestiary',
    },
    description: data.creature.abstract,
    headline: data.creature.name,
    image: `${$page.url.origin}${image}`,
    mainEntityOfPage: canonical,
    publisher: {
      '@type': 'Organization',
      name: 'American Bestiary',
    },
  })
</script>

<Seo
  description={meta.description}
  {image}
  {jsonLd}
  title={meta.title}
  type='article' />

<Creature
  creature={data.creature}
  next={data.next}
  prev={data.prev} />
