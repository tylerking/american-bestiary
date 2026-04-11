<script
  lang='ts'>
  import { page } from '$app/stores'
  import { global } from '$lib/data/global'

  import Link from '../../elements/Link/Link.svelte'
  import Typography from '../../elements/Typography/Typography.svelte'
  import * as styles from './Nav.css'

  let { onNavigate = () => {}, open = false } = $props<{ onNavigate?: () => void; open?: boolean }>()

  const isActive = (path: string) => {
    if (path === '/') return $page.url.pathname === '/'
    return $page.url.pathname.startsWith(path)
  }
</script>

<nav
  aria-label='Site navigation'
  class="{styles.root} {open ? styles.mobileOpen : ''}">
  {#each global.header.nav as item (item.href)}
    <Link
      class="{styles.link} {isActive(item.href) && (item.href !== '/' || (!$page.url.pathname.startsWith('/archives') && !$page.url.pathname.startsWith('/creatures'))) ? styles.active : ''}"
      href={item.href}
      onclick={onNavigate}>
      <Typography
        variant='nav'>{item.label}</Typography>
    </Link>
  {/each}
</nav>
