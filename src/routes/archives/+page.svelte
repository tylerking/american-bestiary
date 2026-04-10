<script
  lang='ts'>
  import { page } from '$app/stores'
  import { Archives, Seo } from '$lib/components'
  import { global } from '$lib/data/global'
  import { slugify } from '$lib/utils/slugify'

  import type { PageData } from './$types'

  let { data } = $props<{ data: PageData }>()

  type CreatureItem = PageData['creatures'][number]

  const jsonLd = $derived({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    description: global.archives_meta.description,
    itemListElement: data.creatures.map((creature: CreatureItem, index: number) => ({
      '@type': 'ListItem',
      item: {
        '@type': 'Thing',
        description: creature.abstract,
        name: creature.name,
        url: `${$page.url.origin}/creatures/${slugify(creature.name)}`,
      },
      position: index + 1,
    })),
    name: global.archives_meta.title,
    numberOfItems: data.creatures.length,
  })
</script>

<Seo
  description={global.archives_meta.description}
  {jsonLd}
  title={global.archives_meta.title} />

<Archives
  creatures={data.creatures} />
