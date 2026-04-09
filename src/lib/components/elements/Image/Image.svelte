<script
  lang='ts'>
  import * as styles from './Image.css'

  let { alt, class: className = '', src } = $props<{
    alt: string
    class?: string
    src: string
  }>()

  let hasError = $state(false)

  function handleError() {
    hasError = true
  }
</script>

{#if !hasError}
  <img
    {alt}
    class='{styles.root} {className}'
    loading='lazy'
    onerror={handleError}
    {src}
  />
{/if}
