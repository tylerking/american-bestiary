import { nameToImagePath } from '$lib/utils/slugify'
import { readdirSync } from 'fs'
import { join } from 'path'
import { describe, expect, it } from 'vitest'

import { creatures as creaturesJson } from '../../src/lib/data/creatures'
const imageDir = join(process.cwd(), 'static', 'images')
const imageFiles = new Set(readdirSync(imageDir))

describe('image paths', () => {
  it('nameToImagePath should return .png paths', () => {
    expect(nameToImagePath('Bigfoot')).toBe('/images/bigfoot.png')
    expect(nameToImagePath('The Beast of Bray Road')).toBe('/images/the-beast-of-bray-road.png')
  })

  it('all creatures should have a corresponding image file', () => {
    function normalizeImage(name: string, image?: string): string {
      if (!image) return name.toLowerCase().replaceAll(' ', '-') + '.png'
      return image
    }

    const missing: string[] = []
    for (const c of creaturesJson) {
      const filename = normalizeImage(c.name, c.visual)
      if (!imageFiles.has(filename)) {
        missing.push(`${c.name} -> ${filename}`)
      }
    }
    expect(missing, `Missing image files:\n${missing.join('\n')}`).toEqual([])
  })
})
