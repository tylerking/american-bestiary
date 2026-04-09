<script
  lang='ts'>
  import type { Snippet } from 'svelte'

  import * as styles from './Container.css'

  let { children, class: className = '' } = $props<{
    children: Snippet
    class?: string
  }>()
</script>

<div
  class='{styles.root} {className}'>
  {@render children()}
</div>
