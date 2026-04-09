<script
  lang='ts'
  module>
  let cachedSvgText: null | string = null
  let fetchPromise: null | Promise<string> = null

  function fetchSvgText(): Promise<string> {
    if (cachedSvgText) return Promise.resolve(cachedSvgText)
    if (!fetchPromise) {
      fetchPromise = fetch('/us.svg')
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch SVG')
          return res.text()
        })
        .then((text) => {
          cachedSvgText = text
          return text
        })
    }
    return fetchPromise
  }
</script>

<script
  lang='ts'>
  import Typography from '../Typography/Typography.svelte'
  import * as styles from './State.css'

  let { class: className = '', stateName } = $props<{ class?: string; stateName: string, }>()
  
  let pathData = $state('')
  let viewBox = $state('')

  async function loadStateSvg(name: string) {
    try {
      const svgText = await fetchSvgText()
      const result = buildStateSvg(svgText, name)
      if (result) {
        pathData = result.pathData
        viewBox = result.viewBox
      }
    } catch (error) {
      console.error(error)
    }
  }

  function buildStateSvg(svgString: string, name: string) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(svgString, 'image/svg+xml')
    const sourcePath = doc.querySelector(`path[data-name='${name}']`)
    if (!sourcePath) return null

    const pathD = sourcePath.getAttribute('d')!

    const probe = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;width:0;height:0'
    const probePath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    probePath.setAttribute('d', pathD)
    probe.appendChild(probePath)
    document.body.appendChild(probe)
    const bb = probePath.getBBox()
    document.body.removeChild(probe)

    const pad = Math.max(bb.width, bb.height) * 0.08
    const vb = `${bb.x - pad} ${bb.y - pad} ${bb.width + pad * 2} ${bb.height + pad * 2}`

    return { pathData: pathD, viewBox: vb }
  }

  $effect(() => {
    if (stateName) {
      void loadStateSvg(stateName)
    }
  })
</script>

<div
  class='{styles.root} {className}'>
  {#if pathData && viewBox}
    <svg 
      aria-hidden='true' 
      class={styles.svg} 
      focusable='false' 
      {viewBox} 
      xmlns='http://www.w3.org/2000/svg'>
      <path
        class={styles.path}
        d={pathData}/>
    </svg>
  {:else}
    <Typography
      class={styles.badge}
      tag='span'
      variant='small'>{stateName}</Typography>
  {/if}
</div>
