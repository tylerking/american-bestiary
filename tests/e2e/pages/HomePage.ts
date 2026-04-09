import type { Locator, Page } from '@playwright/test'

export class HomePage {
  readonly mapContainer: Locator
  readonly searchDropdown: Locator
  readonly searchInput: Locator

  constructor(public readonly page: Page) {
    this.mapContainer = page.locator('[role="group"]')
    this.searchInput = page.locator('input[aria-label="Search for a creature"]')
    this.searchDropdown = page.locator('ul[role="listbox"]')
  }

  async goto() {
    await this.page.goto('/')
  }

  async search(query: string) {
    await this.searchInput.fill(query)
  }
}
