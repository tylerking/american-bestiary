<script
  lang='ts'>
  import Typography from '../Typography/Typography.svelte'
  import * as styles from './Loading.css'

  let { message = 'Loading...' } = $props<{ message?: string }>()
</script>

<div
  class={styles.root}>
  <div
    class={styles.spinner}></div>
  <Typography
    tag='p'
    variant='caption'>{message}</Typography>
</div>
