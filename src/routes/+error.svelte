<script
  lang='ts'>
  import { page } from '$app/stores'
  import Container from '$lib/components/elements/Container/Container.svelte'
  import Link from '$lib/components/elements/Link/Link.svelte'
  import Typography from '$lib/components/elements/Typography/Typography.svelte'
  import * as styles from '$lib/styles/error.css'
</script>

<Container
  class={styles.root}>
  <Typography
    class={styles.code}
    tag='p'
    variant='h1'>{$page.status}</Typography>
  <Typography
    tag='h1'
    variant='h2'>
    {#if $page.status === 404}
      This creature hasn't been documented yet
    {:else}
      Something went wrong in the archives
    {/if}
  </Typography>
  <Typography
    class={styles.message}
    tag='p'
    variant='body'>
    {#if $page.status === 404}
      The specimen you're looking for doesn't exist in our records. It may have been misclassified or lost to history.
    {:else}
      {$page.error?.message || 'An unexpected error occurred while consulting the archives.'}
    {/if}
  </Typography>
  <nav
    class={styles.links}>
    <Link
      href='/'>Return to the map</Link>
    <Link
      href='/archives'>Browse the archives</Link>
  </nav>
</Container>
