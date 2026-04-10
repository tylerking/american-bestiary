import type { Locator, Page } from '@playwright/test'

export class CreaturePage {
  readonly anatomySection: Locator
  readonly backToArchivesLink: Locator
  readonly backToMapLink: Locator
  readonly behaviorSection: Locator
  readonly ecologySection: Locator
  readonly mythologySection: Locator
  readonly region: Locator
  readonly sourceLink: Locator
  readonly title: Locator

  constructor(public readonly page: Page) {
    this.title = page.locator('article h2')
    
    this.region = page.locator('article header span').first()
    
    this.anatomySection = page.getByText('Anatomy', { exact: true })
    this.behaviorSection = page.getByText('Behavior', { exact: true })
    this.ecologySection = page.getByText('Ecology', { exact: true })
    this.mythologySection = page.getByText('Mythology', { exact: true })
    
    this.sourceLink = page.locator('footer').filter({ hasText: /Source/i }).getByRole('link')
    
    this.backToMapLink = page.getByText('Map', { exact: false }).first()
    this.backToArchivesLink = page.getByText('Archives', { exact: false }).first()
  }

  async goto(slug: string) {
    await this.page.goto(`/creatures/${slug}`)
  }
}
