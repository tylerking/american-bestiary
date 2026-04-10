import type { CreatureData } from '$lib/data/creatures'

export function filterCreatures(creatures: CreatureData[], query: string): CreatureData[] {
  const val = query.toLowerCase().trim()
  if (!val) return creatures

  return creatures.filter(
    (creature: CreatureData) =>
      creature.name.toLowerCase().includes(val) ||
      (creature.region?.toLowerCase().includes(val)) ||
      (creature.classification?.toLowerCase().includes(val)),
  )
}
