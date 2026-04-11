<script
  lang='ts'>
  import type { CreatureData } from '$lib/data/creatures'

  import { slugify } from '$lib/utils/slugify'

  import Image from '../Image/Image.svelte'
  import Link from '../Link/Link.svelte'
  import Typography from '../Typography/Typography.svelte'
  import * as styles from './Card.css'

  let { creature } = $props<{ creature: CreatureData }>()
</script>

<Link
  class={styles.root}
  href='/creatures/{slugify(creature.name)}'>
  <div
    class={styles.imageWrapper}>
    <Image
      alt={creature.name}
      class={styles.image}
      src='/images/{creature.visual}' />
  </div>
  <div
    class={styles.content}>
    <div
      class={styles.header}>
      <div
        class={styles.titleRow}>
        <Typography
          class={styles.titleClamping}
          tag='h2'
          variant='h3'>{creature.name || 'Unknown'}</Typography>
        <Typography
          class={styles.regionBadge}
          variant='badge'>{creature.region || ''}</Typography>
      </div>
      <Typography
        class={styles.typeTag}
        variant='label'>{creature.classification}</Typography>
    </div>
    <Typography
      class={styles.descriptionClamping}
      variant='caption'>{creature.abstract || ''}</Typography>
  </div>
</Link>
