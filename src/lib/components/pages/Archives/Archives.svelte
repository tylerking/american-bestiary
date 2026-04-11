<script
  lang='ts'>
  import type { TaxonomicCategory } from '$lib/data/archives'
  import type { CreatureData } from '$lib/data/creatures'

  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { archives } from '$lib/data/archives'
  import { filterCreatures } from '$lib/utils/search'

  import Card from '../../elements/Card/Card.svelte'
  import Container from '../../elements/Container/Container.svelte'
  import Input from '../../elements/Input/Input.svelte'
  import Typography from '../../elements/Typography/Typography.svelte'
  import * as styles from './Archives.css'

  let { creatures } = $props<{ creatures: CreatureData[] }>()

  let query = $state($page.url.searchParams.get('q') || '')
  let activeCategory = $state<null | TaxonomicCategory>(null)

  const filtered = $derived.by(() => {
    let results = creatures

    if (activeCategory) {
      results = results.filter((creature: CreatureData) => {
        const cls = (creature.classification || '').toLowerCase()
        return activeCategory!.keywords.some((kw) => cls.includes(kw))
      })
    }

    return filterCreatures(results, query)
  })

  function handleInput() {
    const url = new URL($page.url)
    if (query.trim()) url.searchParams.set('q', query.trim())
    else url.searchParams.delete('q')
    void goto(url.toString(), { keepFocus: true, noScroll: true, replaceState: true })
  }

  function toggleCategory(category: TaxonomicCategory) {
    if (activeCategory?.name === category.name) {
      activeCategory = null
    } else {
      activeCategory = category
    }
  }

  function clearAll() {
    query = ''
    activeCategory = null
    const url = new URL($page.url)
    url.searchParams.delete('q')
    void goto(url.toString(), { keepFocus: true, noScroll: true, replaceState: true })
  }

  const hasActiveFilters = $derived(query.trim() !== '' || activeCategory !== null)
</script>

<Container
  class={styles.root}>
  <header
    class={styles.pageHeader}>
    <Typography
      tag='h1'
      variant='h2'>{archives.heading}</Typography>
    <Typography
      tag='p'
      variant='body'>{archives.description}</Typography>
  </header>

  <div
    class={styles.controls}>
    <Input
      ariaLabel='Filter creatures'
      bind:value={query}
      id='creature-filter'
      oninput={handleInput}
      placeholder='Filter by name, region, or classification…'
    />
    <Typography
      class={styles.count}
      tag='span'
      variant='caption'>
      {filtered.length} specimen{filtered.length !== 1 ? 's' : ''}
    </Typography>
  </div>

  <div
    aria-label='Filter by classification'
    class={styles.categoryRow}
    role='group'>
    {#each archives.categories as category (category.name)}
      <button
        aria-pressed={activeCategory?.name === category.name}
        class='{styles.categoryPill} {activeCategory?.name === category.name ? styles.categoryPillActive : ''}'
        onclick={() => toggleCategory(category)}>
        <Typography
          tag='span'
          variant='label'>{category.name}</Typography>
      </button>
    {/each}
  </div>

  {#if activeCategory}
    <div
      class={styles.activeFilter}>
      <Typography
        tag='p'
        variant='caption'>Showing <strong>{activeCategory.name}</strong> &mdash; {activeCategory.description}</Typography>
    </div>
  {/if}

  <section
    aria-label='Creature cards'
    class={styles.grid}>
    {#if filtered.length === 0}
      <div
        class={styles.empty}>
        <Typography
          tag='p'
          variant='body'>
          No specimens match your current filters.
        </Typography>
        <button
          class={styles.button}
          onclick={clearAll}>Clear all filters</button>
      </div>
    {:else}
      {#each filtered as creature (creature.name)}
        <Card
          {creature} />
      {/each}
    {/if}
  </section>

  {#if hasActiveFilters}
    <div
      class={styles.clearRow}>
      <button
        class={styles.clearButton}
        onclick={clearAll}>Clear all filters</button>
    </div>
  {/if}
</Container>
