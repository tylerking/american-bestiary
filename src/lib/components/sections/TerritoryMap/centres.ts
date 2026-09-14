import mapData from '$lib/assets/us-map.json'
import { map } from '$lib/styles/tokens'
import { areaCentroid, type Point, samplePathData } from './geometry'

export const CENTRES: ReadonlyMap<string, Point> = new Map(
	mapData.states.map((state) => [state.name, areaCentroid(samplePathData(state.d, map.samples))])
)
