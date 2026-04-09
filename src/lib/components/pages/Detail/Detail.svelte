<script
  lang='ts'>
  import type { CreatureData } from '$lib/data/creatures'

  import { nameToImagePath, slugify } from '$lib/utils/slugify'

  import Container from '../../elements/Container/Container.svelte'
  import Image from '../../elements/Image/Image.svelte'
  import Link from '../../elements/Link/Link.svelte'
  import State from '../../elements/State/State.svelte'
  import Typography from '../../elements/Typography/Typography.svelte'
  import * as styles from './Detail.css'

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
</script>

<div
  class={styles.root}>
  <Container>
    <article
      class={styles.article}>
      <header
        class={styles.header}>
        <div
          class={styles.headerLeft}>
          <Typography
            tag='h2'
            variant='display'>{creature.name}</Typography>
          {#if creature.classification}
            <Typography
              class={styles.classification}
              variant='label'>{creature.classification}</Typography>
          {/if}
        </div>
        {#if creature.region}
          <div
            class={styles.headerRight}>
            <div
              class={styles.stateIcon}>
              <State
                stateName={creature.region} />
            </div>
            <Typography
              variant='badge'>{creature.region}</Typography>
          </div>
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
            <span
              class={styles.sectionLabel}>Etymology</span>
            <Typography
              variant='body'>{creature.etymology}</Typography>
          </section>
        {/if}

        {#if creature.anatomy}
          <section
            class={styles.section}>
            <span
              class={styles.sectionLabel}>Anatomy</span>
            <Typography
              variant='body'>{creature.anatomy}</Typography>
          </section>
        {/if}

        {#if creature.ecology}
          <section
            class={styles.section}>
            <span
              class={styles.sectionLabel}>Ecology</span>
            <Typography
              variant='body'>{creature.ecology}</Typography>
          </section>
        {/if}

        {#if creature.behavior}
          <section
            class={styles.section}>
            <span
              class={styles.sectionLabel}>Behavior</span>
            <Typography
              variant='body'>{creature.behavior}</Typography>
          </section>
        {/if}

        {#if creature.mythology}
          <section
            class={styles.section}>
            <span
              class={styles.sectionLabel}>Mythology</span>
            <Typography
              variant='body'>{creature.mythology}</Typography>
          </section>
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
