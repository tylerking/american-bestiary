<script
  lang='ts'>
  import Typography from '../Typography/Typography.svelte'
  import * as styles from './Tooltip.css'

  let { nameText, stateText, visible, x = 0, y = 0 } = $props<{
    nameText: string;
    stateText: string;
    visible: boolean;
    x?: number;
    y?: number;
  }>()
</script>

{#if visible}
  <div
    aria-live='polite'
    class={styles.root}
    style='left: {x}px; top: {y}px;'>
    <Typography
      class={styles.subtitle}
      tag='span'
      variant='small'>{stateText}&nbsp;</Typography>
    <Typography
      class={styles.title}
      tag='span'
      variant='h5'>{nameText}&nbsp;</Typography>
  </div>
{/if}
