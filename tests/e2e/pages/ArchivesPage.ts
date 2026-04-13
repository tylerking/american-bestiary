import type { Locator, Page } from '@playwright/test'

export class ArchivesPage {
  readonly cards: Locator
  readonly emptyState: Locator
  readonly filterInput: Locator

  constructor(public readonly page: Page) {
    this.cards = page.locator('section[aria-label="Creature cards"] > a')
    this.filterInput = page.locator('input[aria-label="Filter creatures"]')
    this.emptyState = page.getByText('No specimens match your current filters')
  }

  async filter(query: string) {
    await this.filterInput.fill(query)
  }

  async goto() {
    await this.page.goto('/archives')
  }
}
