<script
  lang='ts'>
  import type { Snippet } from 'svelte'

  import '../lib/styles'
  import { page } from '$app/stores'
  import { Footer, Header } from '$lib/components'
  import { global } from '$lib/data/global'

  import { mainContent, skipLink } from '../lib/styles'

  let { children } = $props<{ children: Snippet }>()

  const websiteJsonLdHtml = $derived(
    '<' + 'script type="application/ld+json">' + JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      description: global.site_meta.description,
      name: global.site_meta.title,
      url: $page.url.origin,
    }) + '</' + 'script>',
  )
</script>

<svelte:head>
  <title>{global.site_meta.title}</title>
  <meta
    content='index, follow'
    name='robots' />
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html websiteJsonLdHtml}
</svelte:head>

<a
  class={skipLink}
  href='#main-content'>Skip to content</a>

<Header />

<main
  class={mainContent}
  id='main-content'>
  {@render children()}
</main>

<Footer />
