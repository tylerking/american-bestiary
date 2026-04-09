<script
  lang='ts'>
  import type { Snippet } from 'svelte'
  import type { HTMLAnchorAttributes } from 'svelte/elements'

  import * as styles from './Link.css'

  let {
    children,
    class: className = '',
    href,
    ...rest
  } = $props<{
    children: Snippet
    class?: string
    href: string
  } & HTMLAnchorAttributes>()
</script>

<a
  class='{styles.root} {className}'
  {href}
  {...rest}>
  {@render children()}
</a>
