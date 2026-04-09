<script
  lang='ts'>
  import { global } from '$lib/data/global'

  import Container from '../../elements/Container/Container.svelte'
  import Link from '../../elements/Link/Link.svelte'
  import Logo from '../../elements/Logo/Logo.svelte'
  import Typography from '../../elements/Typography/Typography.svelte'
  import Nav from '../Nav/Nav.svelte'
  import * as styles from './Header.css'
</script>

<header
  class={styles.root}>
  <Container
    class={styles.inner}>
    <Link
      class={styles.brand}
      href='/'>
      <Logo />
      <div
        class={styles.text}>
        <Typography
          class={styles.title}
          tag='h1'
          variant='h1'>{global.header.title}</Typography>
        <Typography
          class={styles.subtitle}
          variant='tagline'>{global.header.subtitle}</Typography>
      </div>
    </Link>
    <Nav />
  </Container>
</header>
