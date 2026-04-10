import { test as base } from '@playwright/test'

import type { CreatureData } from '../../src/lib/data/creatures'

import { creatures } from '../../src/lib/data/creatures'
import { ArchivesPage } from './pages/ArchivesPage'
import { CreaturePage } from './pages/CreaturePage'
import { HomePage } from './pages/HomePage'

type MyFixtures = {
  archivesPage: ArchivesPage
  creaturePage: CreaturePage
  creatures: CreatureData[]
  homePage: HomePage
  testCreature: CreatureData
}

export const test = base.extend<MyFixtures>({
  archivesPage: async ({ page }, use) => {
    await use(new ArchivesPage(page))
  },
  creaturePage: async ({ page }, use) => {
    await use(new CreaturePage(page))
  },
  creatures: async (_, use) => {
    await use(creatures)
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page))
  },
  testCreature: async (_, use) => {
    const creature = creatures.find(c => c.name === 'White Thang') || creatures[0]
    await use(creature)
  },
})

export { expect } from '@playwright/test'
