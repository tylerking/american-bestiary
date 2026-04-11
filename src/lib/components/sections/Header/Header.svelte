<script
  lang='ts'>
  import { page } from '$app/stores'
  import { global } from '$lib/data/global'

  import Container from '../../elements/Container/Container.svelte'
  import Link from '../../elements/Link/Link.svelte'
  import Logo from '../../elements/Logo/Logo.svelte'
  import Typography from '../../elements/Typography/Typography.svelte'
  import Nav from '../Nav/Nav.svelte'
  import * as styles from './Header.css'

  let menuOpen = $state(false)

  const isHome = $derived($page.url.pathname === '/')

  function toggleMenu() {
    menuOpen = !menuOpen
  }

  function closeMenu() {
    menuOpen = false
  }
</script>

<header
  class={styles.root}>
  <Container
    class={styles.inner}>
    <Link
      class={styles.brand}
      href='/'
      onclick={closeMenu}>
      <Logo />
      <div
        class={styles.text}>
        <Typography
          class={styles.title}
          tag={isHome ? 'h1' : 'span'}
          variant='h1'>{global.header.title}</Typography>
        <Typography
          class={styles.subtitle}
          variant='tagline'>{global.header.subtitle}</Typography>
      </div>
    </Link>

    <button
      aria-expanded={menuOpen}
      aria-label='Toggle navigation menu'
      class={styles.hamburger}
      onclick={toggleMenu}>
      {#if menuOpen}
        <img
          alt=''
          height='24'
          src='/icons/close.svg'
          width='24' />
      {:else}
        <img
          alt=''
          height='24'
          src='/icons/hamburger.svg'
          width='24' />
      {/if}
    </button>

    <Nav
      onNavigate={closeMenu}
      open={menuOpen} />
  </Container>
</header>
