<script
  lang='ts'>
  import { global } from '$lib/data/global'

  import Container from '../../elements/Container/Container.svelte'
  import Link from '../../elements/Link/Link.svelte'
  import Typography from '../../elements/Typography/Typography.svelte'
  import * as styles from './Footer.css'
</script>

<footer
  class={styles.root}>
  <Container
    class={styles.inner}>
    <Typography
      tag='p'
      variant='tagline'>
      <span
        class={styles.brandName}>{global.footer.brandName}</span> &mdash; {global.footer.tagline}
      {#each global.footer.links as link, i (link.href)}
        <Link
          class={styles.link}
          href={link.href}>
          <Typography
            variant='tagline'>{link.label}</Typography>
        </Link>
        {i < global.footer.links.length - 1 ? ' · ' : ''}
      {/each}
    </Typography>
    <Typography
      tag='p'
      variant='tagline'>
      {global.footer.credits.label}
      <Link
        class={styles.link}
        href={global.footer.credits.href}
        rel='noopener'
        target='_blank'>
        <Typography
          variant='tagline'>{global.footer.credits.author}<span
          class={styles.srOnly}> (opens in new window)</span></Typography>
      </Link>
    </Typography>
  </Container>
</footer>
