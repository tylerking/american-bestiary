<script
  lang='ts'>
  import type { CreatureData } from '$lib/data/creatures'

  import { nameToImagePath, slugify } from '$lib/utils/slugify'

  import Container from '../../elements/Container/Container.svelte'
  import Image from '../../elements/Image/Image.svelte'
  import Link from '../../elements/Link/Link.svelte'
  import Typography from '../../elements/Typography/Typography.svelte'
  import * as styles from './Creature.css'

  let { creature, next, prev } = $props<{
    creature: CreatureData
    next: { name: string } | null
    prev: { name: string } | null
  }>()

  const imgSrc = $derived.by(() => {
    if (creature.visual?.startsWith('http')) return creature.visual
    if (creature.visual) return `/images/${creature.visual}`
    return nameToImagePath(creature.name)
  })

  const sourceDisplay = $derived.by(() => {
    if (!creature.source) return ''
    try {
      return new URL(creature.source).hostname.replace('www.', '')
    } catch {
      return 'Source Link'
    }
  })
</script>

<div
  class={styles.root}>
  <Container>
    <article
      class={styles.article}>
      <header
        class={styles.header}>
        <div
          class={styles.titleRow}>
          <Typography
            class={styles.name}
            tag='h1'
            variant='display'>{creature.name}</Typography>
          {#if creature.region}
            <Typography
              class={styles.regionBadge}
              variant='badge'>{creature.region}</Typography>
          {/if}
        </div>
        {#if creature.classification}
          <Typography
            class={styles.classification}
            variant='label'>{creature.classification}</Typography>
        {/if}
      </header>

      <div
        class={styles.body}>
        <figure
          class={styles.plate}>
          <Image
            alt={creature.name}
            class={styles.image}
            src={imgSrc} />
          <figcaption
            class={styles.plateCaption}>
            <Typography
              variant='small'>Fig 1. {creature.name}</Typography>
          </figcaption>
        </figure>

        {#if creature.abstract}
          <div
            class={styles.abstractSection}>
            <Typography
              variant='prose'>{creature.abstract}</Typography>
          </div>
        {/if}

        {#if creature.etymology}
          <section
            class={styles.section}>
            <Typography
              class={styles.sectionLabel}
              tag='h2'
              variant='label'>Etymology</Typography>
            <Typography
              variant='body'>{creature.etymology}</Typography>
          </section>
        {/if}

        {#if creature.anatomy}
          <section
            class={styles.section}>
            <Typography
              class={styles.sectionLabel}
              tag='h2'
              variant='label'>Anatomy</Typography>
            <Typography
              variant='body'>{creature.anatomy}</Typography>
          </section>
        {/if}

        {#if creature.ecology}
          <section
            class={styles.section}>
            <Typography
              class={styles.sectionLabel}
              tag='h2'
              variant='label'>Ecology</Typography>
            <Typography
              variant='body'>{creature.ecology}</Typography>
          </section>
        {/if}

        {#if creature.behavior}
          <section
            class={styles.section}>
            <Typography
              class={styles.sectionLabel}
              tag='h2'
              variant='label'>Behavior</Typography>
            <Typography
              variant='body'>{creature.behavior}</Typography>
          </section>
        {/if}

        {#if creature.mythology}
          <section
            class={styles.section}>
            <Typography
              class={styles.sectionLabel}
              tag='h2'
              variant='label'>Mythology</Typography>
            <Typography
              variant='body'>{creature.mythology}</Typography>
          </section>
        {/if}

        {#if creature.source}
          <footer
            class={styles.sourceSection}>
            <Typography
              class={styles.sourceLabel}
              tag='h2'
              variant='label'>Primary Source</Typography>
            <Link
              class={styles.sourceLink}
              href={creature.source}
              target='_blank'>
              {sourceDisplay}
              <div
                class={styles.externalIcon}></div>
            </Link>
          </footer>
        {/if}
      </div>

      <nav
        aria-label='Next and previous creatures'
        class={styles.nav}>
        {#if prev}
          <Link
            class={styles.navLink}
            href='/creatures/{slugify(prev.name)}'>
            <Typography
              class={styles.navLabel}
              tag='span'
              variant='small'>Previous</Typography>
            <Typography
              class={styles.navName}
              tag='span'
              variant='body'>{prev.name}</Typography>
          </Link>
        {:else}
          <span></span>
        {/if}
        {#if next}
          <Link
            class='{styles.navLink} {styles.navNext}'
            href='/creatures/{slugify(next.name)}'>
            <Typography
              class={styles.navLabel}
              tag='span'
              variant='small'>Next</Typography>
            <Typography
              class={styles.navName}
              tag='span'
              variant='body'>{next.name}</Typography>
          </Link>
        {:else}
          <span></span>
        {/if}
      </nav>
    </article>
  </Container>
</div>
