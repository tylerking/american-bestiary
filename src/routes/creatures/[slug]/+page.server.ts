import { error } from '@sveltejs/kit'
import { slugify } from '$lib/utils/slugify'

import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params, parent }) => {
  const { creatures } = await parent()
  const foundCreature = creatures.find((creature) => slugify(creature.name) === params.slug)

  if (!foundCreature) {
    throw error(404, 'Creature not found') as unknown as Error
  }

  const index = creatures.findIndex((creature) => creature._id === foundCreature._id)
  const prev = index > 0 ? creatures[index - 1] : null
  const next = index < creatures.length - 1 ? creatures[index + 1] : null

  return { creature: foundCreature, next, prev }
}
