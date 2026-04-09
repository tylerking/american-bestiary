<script
  lang='ts'>
  import type { Snippet } from 'svelte'

  import * as styles from './Typography.css'

  type Variant = 'badge' | 'body' | 'caption' | 'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'label' | 'nav' | 'prose' | 'small' | 'tagline'

  let {
    children,
    class: className = '',
    tag = '',
    variant = 'body'
  } = $props<{
    children: Snippet
    class?: string
    tag?: string
    variant?: Variant
  }>()

  const mapping: Record<Variant, string> = {
    badge: 'span',
    body: 'p',
    caption: 'p',
    display: 'h1',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    label: 'span',
    nav: 'span',
    prose: 'div',
    small: 'small',
    tagline: 'span',
  }

  const element = $derived(tag || (mapping[variant as Variant] || 'p'))
  const variantClass = $derived((styles as Record<string, string>)[variant as string] || '')
</script>

<svelte:element
  class='{variantClass} {className}'
  this={element}>
  {@render children()}
</svelte:element>
