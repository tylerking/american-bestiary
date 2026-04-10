<script
  lang='ts'>
  import type { CreatureData } from '$lib/data/creatures'

  import { goto } from '$app/navigation'
  import { filterCreatures } from '$lib/utils/search'
  import { slugify } from '$lib/utils/slugify'
  import { SvelteMap } from 'svelte/reactivity'

  import Container from '../../elements/Container/Container.svelte'
  import Image from '../../elements/Image/Image.svelte'
  import Link from '../../elements/Link/Link.svelte'
  import Loading from '../../elements/Loading/Loading.svelte'
  import Tooltip from '../../elements/Tooltip/Tooltip.svelte'
  import Typography from '../../elements/Typography/Typography.svelte'
  import * as styles from './Map.css'

  let { creatures } = $props<{ creatures: CreatureData[] }>()

  let svgText = $state('')
  let loading = $state(true)
  let error = $state<null | string>(null)
  let tooltipVisible = $state(false)
  let tooltipStateText = $state('')
  let tooltipNameText = $state('')
  let tooltipX = $state(0)
  let tooltipY = $state(0)
  let searchQuery = $state('')
  let searchOpen = $state(false)

  const searchResults = $derived.by(() => {
    if (!searchQuery.trim() || !creatures) return []
    return filterCreatures(creatures, searchQuery).slice(0, 8)
  })

  const byRegion = $derived.by(() => {
    const map: Record<string, CreatureData> = {}
    if (!creatures) return map
    for (const creature of creatures) {
      if (creature.region) map[creature.region.toLowerCase()] = creature
    }
    return map
  })

  async function loadMap() {
    try {
      const res = await fetch('/us.svg')
      if (!res.ok) throw new Error(`Failed to fetch map SVG: ${res.status} ${res.statusText}`)
      svgText = await res.text()
      if (!svgText.includes('<svg')) throw new Error('Invalid SVG content received')
    } catch (err) {
      console.error('Error loading map SVG:', err)
      error = err instanceof Error ? err.message : 'Unknown error loading map'
    } finally {
      loading = false
    }
  }

  function setupMap(node: HTMLDivElement) {
    if (!svgText) return
    node.innerHTML = svgText
    const svg = node.querySelector('svg')
    if (!svg) return
    svg.classList.add(styles.mapSvg)

    let defs = svg.querySelector('defs')
    if (!defs) {
      defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
      svg.prepend(defs)
    }

    const paths = node.querySelectorAll<SVGPathElement>('path[data-name]')
    const cleanups: (() => void)[] = []

    const bboxes = new SvelteMap<SVGPathElement, SVGRect>()
    paths.forEach((path) => {
      const stateName = path.getAttribute('data-name')!
      if (byRegion[stateName.toLowerCase()]) {
        bboxes.set(path, path.getBBox())
      }
    })

    paths.forEach((path) => {
      const stateName = path.getAttribute('data-name')!
      const creature = byRegion[stateName.toLowerCase()]
      const stateId = stateName.toLowerCase().replace(/\s+/g, '-')

      path.classList.add(styles.mapPath)

      if (creature) {
        const groupElement = document.createElementNS('http://www.w3.org/2000/svg', 'g')
        groupElement.classList.add(styles.stateGroup)
        groupElement.setAttribute('tabindex', '0')
        groupElement.setAttribute('role', 'button')
        groupElement.setAttribute('aria-label', `${stateName}: ${creature.name}`)

        path.parentNode?.insertBefore(groupElement, path)
        groupElement.appendChild(path)
        const color = (creature.color || 'blue') as keyof typeof styles.stateColor
        path.classList.add(styles.hasCreature, styles.stateColor[color], 'has-creature')

        const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath')
        clipPath.setAttribute('id', `clip-${stateId}`)
        const clipClone = path.cloneNode(true) as SVGPathElement
        clipClone.removeAttribute('class')
        clipClone.removeAttribute('style')
        clipPath.appendChild(clipClone)
        defs.appendChild(clipPath)

        const img = document.createElementNS('http://www.w3.org/2000/svg', 'image')
        const imgSrc = creature.visual?.startsWith('http') ? creature.visual : `/images/${creature.visual}`
        img.setAttribute('href', imgSrc)
        img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', imgSrc)
        img.classList.add(styles.creatureImage)
        img.setAttribute('clip-path', `url(#clip-${stateId})`)

        const bbox = bboxes.get(path)!
        const size = Math.max(bbox.width, bbox.height) * 1.6
        const cx = bbox.x + bbox.width / 2
        const cy = bbox.y + bbox.height / 2
        img.setAttribute('x', String(cx - size / 2))
        img.setAttribute('y', String(cy - size / 2))
        img.setAttribute('width', String(size))
        img.setAttribute('height', String(size))
        img.setAttribute('preserveAspectRatio', 'xMidYMid slice')
        img.setAttribute('role', 'presentation')
        img.setAttribute('aria-hidden', 'true')

        groupElement.appendChild(img)

        const strokeClone = path.cloneNode(true) as SVGPathElement
        strokeClone.classList.remove(styles.mapPath, styles.hasCreature, styles.stateColor[color], 'has-creature')
        strokeClone.classList.add(styles.strokeLayer)
        strokeClone.removeAttribute('style')
        groupElement.appendChild(strokeClone)

        function show(e: MouseEvent) {
          img.style.opacity = '1'
          tooltipVisible = true
          tooltipStateText = stateName
          tooltipNameText = creature.name
          tooltipX = e.clientX
          tooltipY = e.clientY
        }

        function hide() {
          img.style.opacity = '0'
          tooltipVisible = false
        }

        function move(e: MouseEvent) {
          tooltipX = e.clientX
          tooltipY = e.clientY
        }

        const navigate = () => void goto(`/creatures/${slugify(creature.name)}`)
        const onKeydown = (e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            navigate()
          }
        }

        const showListener = show as EventListener
        const moveListener = move as EventListener
        const onKeydownListener = onKeydown as EventListener

        groupElement.addEventListener('mouseenter', showListener)
        groupElement.addEventListener('mousemove', moveListener)
        groupElement.addEventListener('mouseleave', hide)
        groupElement.addEventListener('focus', showListener)
        groupElement.addEventListener('blur', hide)
        groupElement.addEventListener('click', navigate)
        groupElement.addEventListener('keydown', onKeydownListener)

        cleanups.push(() => {
          groupElement.removeEventListener('mouseenter', showListener)
          groupElement.removeEventListener('mousemove', moveListener)
          groupElement.removeEventListener('mouseleave', hide)
          groupElement.removeEventListener('focus', showListener)
          groupElement.removeEventListener('blur', hide)
          groupElement.removeEventListener('click', navigate)
          groupElement.removeEventListener('keydown', onKeydownListener)
        })
      } else {
        path.setAttribute('aria-hidden', 'true')
        const onEnter = (e: MouseEvent) => {
          tooltipVisible = true
          tooltipStateText = stateName
          tooltipNameText = '-'
          tooltipX = e.clientX
          tooltipY = e.clientY
        }
        const onLeave = () => {
          tooltipVisible = false
        }
        const onMove = (e: MouseEvent) => {
          tooltipX = e.clientX
          tooltipY = e.clientY
        }

        const onEnterListener = onEnter as EventListener
        const onMoveListener = onMove as EventListener

        path.addEventListener('mouseenter', onEnterListener)
        path.addEventListener('mousemove', onMoveListener)
        path.addEventListener('mouseleave', onLeave)

        cleanups.push(() => {
          path.removeEventListener('mouseenter', onEnterListener)
          path.removeEventListener('mousemove', onMoveListener)
          path.removeEventListener('mouseleave', onLeave)
        })
      }
    })

    return {
      destroy() {
        cleanups.forEach((fn) => fn())
      },
    }
  }

  $effect(() => {
    void loadMap()
  })
</script>

{#if loading}
  <Loading
    message='Loading map…' />
{:else if error}
  <div
    class={styles.root}>
    <Typography
      tag='p'
      variant='body'>Failed to load the map archives.</Typography>
    <Typography
      class={styles.hint}
      tag='p'
      variant='caption'>{error}</Typography>
    <button
      class={styles.retryButton}
      onclick={() => { loading = true; error = null; void loadMap() }}>Try again</button>
  </div>
{:else}
  <div
    class={styles.root}>
    <Tooltip
      nameText={tooltipNameText}
      stateText={tooltipStateText}
      visible={tooltipVisible}
      x={tooltipX}
      y={tooltipY} />

    <div
      class={styles.mobileSearch}>
      <div
        class={styles.searchWrapper}>
        <input
          aria-label='Search for a creature'
          autocomplete='off'
          bind:value={searchQuery}
          class={styles.searchInput}
          onblur={() => setTimeout(() => searchOpen = false, 200)}
          onfocus={() => searchOpen = true}
          placeholder='Search for a creature…'
          type='text'
        />
        {#if searchOpen && searchResults.length > 0}
          <ul
            class={styles.searchDropdown}
            role='listbox'>
            {#each searchResults as creature (creature.name)}
              <li
                aria-selected='false'
                role='option'>
                <Link
                  class={styles.searchResult}
                  href='/creatures/{slugify(creature.name)}'>
                  <div
                    class={styles.searchResultImage}>
                    <Image
                      alt={creature.name}
                      class={styles.searchResultImg}
                      src='/images/{creature.visual}' />
                  </div>
                  <div
                    class={styles.searchResultInfo}>
                    <Typography
                      class={styles.searchResultName}
                      tag='span'
                      variant='body'>{creature.name}</Typography>
                    <Typography
                      tag='span'
                      variant='caption'>{creature.classification}</Typography>
                    <Typography
                      tag='span'
                      variant='badge'>{creature.region}</Typography>
                  </div>
                </Link>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    </div>

    <Container
      class={styles.container}>
      <div
        aria-label='Map of the United States - click a state to see its cryptid'
        role='group'
        use:setupMap
      ></div>
    </Container>
  </div>
{/if}
