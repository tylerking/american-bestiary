<script
  lang='ts'>
  import type { CreatureData } from '$lib/data/creatures'

  import { home } from '$lib/data/home'
  import { slugify } from '$lib/utils/slugify'

  import Container from '../../elements/Container/Container.svelte'
  import Image from '../../elements/Image/Image.svelte'
  import Link from '../../elements/Link/Link.svelte'
  import Typography from '../../elements/Typography/Typography.svelte'
  import Map from '../../sections/Map/Map.svelte'
  import * as styles from './Home.css'

  let { creatures } = $props<{ creatures: CreatureData[] }>()
</script>

<div
  class={styles.root}>
  <section
    class={styles.mapSection}>
    <Map
      {creatures} />
  </section>

  <section
    class={styles.bestiary}>
    <Container>
      <div
        class={styles.bestiaryInner}>
        <div
          class={styles.bestiaryContent}>
          <Typography
            class={styles.bestiaryHeading}
            variant='h2'>{home.modern_bestiary_definition.heading}</Typography>
          <Typography
            variant='body'>{home.modern_bestiary_definition.content}</Typography>
          <Typography
            variant='body'>{home.historical_baseline.description}</Typography>
        </div>

        <div
          class={styles.specimenCard}>
          <div
            class={styles.specimenCardHeader}>
            <Typography
              variant='h3'>{home.historical_baseline.specimen_data.name}</Typography>
            <Typography
              class={styles.specimenCardLabel}
              variant='small'>Archival Specimen</Typography>
          </div>
          <div
            class={styles.specimenCardBody}>
            <figure
              class={styles.specimenCardPlate}>
              <Image
                alt={home.historical_baseline.specimen_data.name}
                class={styles.specimenCardImage}
                src='/images/{home.historical_baseline.specimen_data.visual}' />
              <figcaption
                class={styles.specimenCardCaption}>
                <Typography
                  variant='small'>Fig 1. {home.historical_baseline.specimen_data.name}</Typography>
              </figcaption>
            </figure>

            <div
              class={styles.diagramField}>
              <span
                class={styles.diagramFieldLabel}>Classification</span>
              <span
                class={styles.diagramFieldValue}>{home.historical_baseline.specimen_data.classification}</span>
            </div>

            <div
              class={styles.diagramField}>
              <span
                class={styles.diagramFieldLabel}>Anatomy</span>
              <span
                class={styles.diagramFieldValue}>Physical traits, biological features, and distinguishing characteristics.</span>
            </div>

            <div
              class={styles.diagramField}>
              <span
                class={styles.diagramFieldLabel}>Ecology</span>
              <span
                class={styles.diagramFieldValue}>Habitat, range, and environmental niche.</span>
            </div>

            <div
              class={styles.diagramField}>
              <span
                class={styles.diagramFieldLabel}>Behavior</span>
              <span
                class={styles.diagramFieldValue}>Documented behavioral patterns and interactions with humans.</span>
            </div>

            <div
              class={styles.diagramField}>
              <span
                class={styles.diagramFieldLabel}>Mythology</span>
              <span
                class={styles.diagramFieldValue}>Cultural origins, folklore, and historical significance.</span>
            </div>
          </div>
        </div>
      </div>
    </Container>
  </section>

  <Container>
    <section
      class={styles.specimensSection}>
      <Typography
        class={styles.specimensHeading}
        variant='h2'>{home.notable_specimens.heading}</Typography>
      <Typography
        class={styles.specimensSubheading}
        tag='p'
        variant='caption'>Field notes on six of the continent's most remarkable cryptids</Typography>
      <div
        class={styles.specimenGrid}>
        {#each home.notable_specimens.highlights as highlight (highlight.name)}
          <Link
            class={styles.notableCard}
            href='/creatures/{slugify(highlight.name)}'>
            <p
              class={styles.awardColor[highlight.color as keyof typeof styles.awardColor]}>{highlight.award}</p>
            <div
              class={styles.specimenImage}>
              <Image
                alt={highlight.name}
                class={styles.specimenImg}
                src='/images/{highlight.visual}' />
            </div>
            <div
              class={styles.specimenContent}>
              <div
                class={styles.specimenTitleRow}>
                <Typography
                  class={styles.specimenName}
                  tag='h4'
                  variant='h3'>{highlight.name}</Typography>
                <Typography
                  class='{styles.specimenRegion} {highlight.color && highlight.color in styles.regionColor ? styles.regionColor[highlight.color as keyof typeof styles.regionColor] : ''}'
                  variant='badge'>{highlight.region}</Typography>
              </div>
              <Typography
                variant='caption'>{highlight.description}</Typography>
            </div>
          </Link>
        {/each}
      </div>
    </section>
  </Container>
</div>
