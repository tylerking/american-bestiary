<script
  lang='ts'>
  import * as styles from './Input.css'

  let { ariaLabel = '', id = '', oninput, placeholder = '', value = $bindable('') } = $props<{
    ariaLabel?: string
    id?: string
    oninput?: () => void
    placeholder?: string
    value?: string
  }>()
</script>

<input
  aria-label={ariaLabel || undefined}
  autocomplete='off'
  bind:value
  class={styles.root}
  {id}
  {oninput}
  {placeholder}
  type='text'
/>
