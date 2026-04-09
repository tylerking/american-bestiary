<script
  lang='ts'>
  import type { Snippet } from 'svelte'

  import '../lib/styles'
  import { Footer, Header } from '$lib/components'
  import { global } from '$lib/data/global'

  import { mainContent, skipLink } from '../lib/styles'

  let { children } = $props<{ children: Snippet }>()
</script>

<svelte:head>
  <title>{global.site_meta.title}</title>
  <meta
    content={global.site_meta.description}
    name='description' />
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
