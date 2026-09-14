<script
	lang='ts'>
	import { onMount } from 'svelte'
	import mapData from '$lib/assets/us-map.json'
	import { territorySlug } from '$lib/codex'
	import Text from '$lib/components/elements/Text'
	import UnderlinedField, { select } from '$lib/components/elements/UnderlinedField'
	import { getLabels } from '$lib/labels/labels'
	import { screenReaderOnly } from '$lib/styles/recipes.css'
	import { map } from '$lib/styles/tokens'
	import { CENTRES } from './centres'
	import { type Direction, nearestInDirection, type Point } from './geometry'
	import * as styles from './TerritoryMap.css'

	interface Props {
		territories: readonly string[]
		selected: string
		onselect: (territory: string) => void
	}

	let { territories, selected, onselect }: Props = $props()

	const labels = $derived.by(getLabels())
	const active = $derived(new Set(territories))
	const hintId = $props.id()

	const DIRECTIONS: Record<string, Direction> = {
		ArrowLeft: 'left',
		ArrowRight: 'right',
		ArrowUp: 'up',
		ArrowDown: 'down'
	}

	let frame: HTMLDivElement | undefined = $state()
	let hydrated = $state(false)
	let hovered: string | null = $state(null)
	let pointed: string | null = $state(null)
	let focused: string | null = $state(null)
	let roving: string | null = $state(null)
	let keyboard = $state(false)
	let tooltip: { label: string; x: number; y: number } | null = $state(null)

	const dots = $derived(
		mapData.states.flatMap((state): [string, Point][] => {
			const centre = CENTRES.get(state.name)
			return active.has(state.name) && centre ? [[state.name, centre]] : []
		})
	)
	const tabStop = $derived(
		roving && active.has(roving) ? roving : active.has(selected) ? selected : (territories[0] ?? null)
	)
	const ring = $derived(keyboard && focused ? mapData.states.find((state) => state.name === focused) : undefined)
	const outline = $derived(
		pointed && pointed !== ring?.name ? mapData.states.find((state) => state.name === pointed) : undefined
	)

	onMount(() => {
		hydrated = true
	})

	const offsetFrom = (left: number, top: number) => {
		const box = frame?.getBoundingClientRect()
		return { x: left - (box?.left ?? 0) + map.tooltipOffset, y: top - (box?.top ?? 0) + map.tooltipOffset }
	}

	function point(name: string, event: MouseEvent) {
		hovered = name
		pointed = name
		tooltip = { label: name, ...offsetFrom(event.clientX, event.clientY) }
	}

	function focus(name: string) {
		hovered = name
		focused = name
		roving = name
		const dot = frame?.querySelector(`circle[data-dot="${name}"]`)?.getBoundingClientRect()
		tooltip = dot ? { label: name, ...offsetFrom(dot.left, dot.top) } : null
	}

	function clear() {
		hovered = null
		pointed = null
		tooltip = null
	}

	function blur() {
		focused = null
		clear()
	}

	function moveTo(name: string | null | undefined) {
		if (!name) return
		frame?.querySelector<SVGPathElement>(`path[data-state="${name}"]`)?.focus()
	}

	function press(name: string, event: KeyboardEvent) {
		const direction = DIRECTIONS[event.key]
		if (direction) {
			event.preventDefault()
			moveTo(nearestInDirection(dots, name, direction))
		} else if (event.key === 'Home' || event.key === 'End') {
			event.preventDefault()
			moveTo(event.key === 'Home' ? territories[0] : territories.at(-1))
		} else if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault()
			onselect(name)
		}
	}

	const radius = (name: string) => (name === selected ? map.dotSelected : name === hovered ? map.dotHover : map.dotRest)
</script>

<svelte:window
	onkeydown={() => {
		keyboard = true
	}}
	onpointerdown={() => {
		keyboard = false
	}} />

<figure
	class={styles.figure}>
	<div
		class={styles.outer}>
		<div
			class={styles.inner}>
			<Text
				as='div'
				class={styles.titulus}
				tone='plateVermilion'
				variant='capsTitulus'>{labels.mapTitulus}</Text>
			<div
				bind:this={frame}
				class={styles.frame}>
				<p
					class={screenReaderOnly}
					id={hintId}>{labels.mapKeyboardHint}</p>
				<!-- biome-ignore lint/a11y/useSemanticElements: an <svg> cannot be a <fieldset>; the group names the set of state controls. -->
				<svg
					aria-describedby={hintId}
					aria-hidden={hydrated ? undefined : 'true'}
					aria-label={labels.mapFallbackAria}
					class={styles.svg}
					role='group'
					viewBox={mapData.viewBox}
					xmlns='http://www.w3.org/2000/svg'>
					{#each mapData.states as state (state.code)}
						{#if active.has(state.name)}
							<!-- biome-ignore lint/a11y/useSemanticElements: an SVG path cannot be a <button>, and the state outline itself has to be the control. -->
							<path
								aria-label={state.name}
								aria-pressed={state.name === selected}
								class={styles.state}
								d={state.d}
								data-hovered={state.name === hovered}
								data-selected={state.name === selected}
								data-state={state.name}
								onblur={blur}
								onclick={() => onselect(state.name)}
								onfocus={() => focus(state.name)}
								onkeydown={(event) => press(state.name, event)}
								onmouseleave={clear}
								onmousemove={(event) => point(state.name, event)}
								role='button'
								tabindex={hydrated && state.name === tabStop ? 0 : -1} />
						{:else}
							<path
								class={styles.state}
								d={state.d}
								data-state={state.name} />
						{/if}
					{/each}
					{#each dots as [name, [cx, cy]] (name)}
						<circle
							class={styles.dot}
							{cx}
							{cy}
							data-dot={name}
							data-hovered={name === hovered}
							data-selected={name === selected}
							r={radius(name)} />
					{/each}
					{#if outline}
						<g
							aria-hidden='true'
							data-hover-ring={outline.name}>
							<path
								class={styles.hoverHalo}
								d={outline.d} />
							<path
								class={styles.hoverCore}
								d={outline.d} />
						</g>
					{/if}
					{#if ring}
						<g
							aria-hidden='true'
							data-focus-ring={ring.name}>
							<path
								class={styles.ringHalo}
								d={ring.d} />
							<path
								class={styles.ringCore}
								d={ring.d} />
						</g>
					{/if}
				</svg>
				{#if tooltip}
					<Text
						aria-hidden='true'
						class={styles.tooltip}
						style={`left: ${tooltip.x}px; top: ${tooltip.y}px`}
						variant='tooltip'>{tooltip.label}</Text>
				{/if}
			</div>
			<Text
				class={styles.caption}
				tone='plateVermilion'
				variant='mapCaption'>{labels.mapCaption}</Text>
		</div>
	</div>
	{#if hydrated}
		<div
			class={styles.picker}>
			<UnderlinedField
				chevron
				label={labels.territory}>
				<select
					class={select}
					onchange={(event) => onselect(event.currentTarget.value)}
					value={selected}>
					{#each territories as territory (territory)}
						<option
							value={territory}>{territory}</option>
					{/each}
				</select>
			</UnderlinedField>
		</div>
	{/if}
	<noscript>
		<ul
			aria-label={labels.mapFallbackAria}
			class={styles.fallback}>
			{#each territories as territory (territory)}
				<li>
					<a
						href={`/?territory=${territorySlug(territory)}#specimen`}>{territory}</a>
				</li>
			{/each}
		</ul>
	</noscript>
</figure>
