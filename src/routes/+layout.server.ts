import { findAll } from '$lib/server/creatures'

import type { LayoutServerLoad } from './$types'

function normalizeImage(name: string, image?: string): string {
  if (!image) return name.toLowerCase().replaceAll(' ', '-') + '.png'
  if (image.startsWith('http')) return name.toLowerCase().replaceAll(' ', '-') + '.png'
  return image.replace(/\.jpg$/, '.png')
}

export const load: LayoutServerLoad = async () => {
  const creatures = await findAll({ limit: 100 })

  return {
    creatures: creatures.map((c) => ({
      _id: c._id.toString(),
      abstract: c.abstract,
      anatomy: c.anatomy,
      behavior: c.behavior,
      classification: c.classification,
      color: c.color,
      ecology: c.ecology,
      etymology: c.etymology,
      mythology: c.mythology,
      name: c.name,
      region: c.region,
      source: c.source,
      visual: normalizeImage(c.name, c.visual),
    })),
  }
}
