<script
  lang='ts'>
  import { page } from '$app/stores'

  type Props = {
    description: string
    image?: string
    jsonLd?: Record<string, unknown>
    title: string
    type?: 'article' | 'website'
  }

  let {
    description,
    image = '/unicorn.png',
    jsonLd,
    title,
    type = 'website',
  }: Props = $props()

  const origin = $derived($page.url.origin)
  const canonical = $derived(origin + $page.url.pathname)
  const absoluteImage = $derived(image.startsWith('http') ? image : origin + image)
  const jsonLdHtml = $derived(
    jsonLd
      ? '<' + 'script type="application/ld+json">' + JSON.stringify(jsonLd) + '</' + 'script>'
      : null,
  )
</script>

<svelte:head>
  <title>{title}</title>
  <meta
    content={description}
    name='description' />
  <link
    href={canonical}
    rel='canonical' />

  <meta
    content={title}
    property='og:title' />
  <meta
    content={description}
    property='og:description' />
  <meta
    content={type}
    property='og:type' />
  <meta
    content={canonical}
    property='og:url' />
  <meta
    content={absoluteImage}
    property='og:image' />
  <meta
    content='American Bestiary'
    property='og:site_name' />

  <meta
    content='summary_large_image'
    name='twitter:card' />
  <meta
    content={title}
    name='twitter:title' />
  <meta
    content={description}
    name='twitter:description' />
  <meta
    content={absoluteImage}
    name='twitter:image' />

  {#if jsonLdHtml}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html jsonLdHtml}
  {/if}
</svelte:head>
