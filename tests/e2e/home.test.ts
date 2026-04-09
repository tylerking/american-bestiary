import { expect, test } from './fixtures'

test.describe('Home Page', () => {
  test.beforeEach(async ({ homePage }) => {
    await test.step('Navigate to home page', async () => {
      await homePage.goto()
    })
  })

  test('should load the map page', async ({ page }) => {
    await test.step('Check page title and header', async () => {
      await expect(page).toHaveTitle('American Bestiary: 50 Cryptids. One State.')
      await expect(page.locator('header')).toContainText('American Bestiary')
    })
  })

  test('should display the interactive SVG map', async ({ homePage, page }) => {
    await test.step('Check map container visibility', async () => {
      await expect(homePage.mapContainer).toBeVisible()
    })
    
    await test.step('Wait for SVG injection', async () => {
      await page.waitForSelector('svg', { timeout: 10000 })
      await expect(homePage.mapContainer.locator('svg')).toBeVisible()
    })
  })

  test('should navigate to creature detail when clicking a state', async ({ page }) => {
    await test.step('Wait for interactive map paths', async () => {
      await page.waitForSelector('svg path.has-creature', { timeout: 10000 })
    })

    await test.step('Click a state and verify navigation', async () => {
      const statePath = page.locator('svg path.has-creature').first()
      await statePath.click()
      await expect(page).toHaveURL(/.*\/creatures\/.*/)
    })
  })

  test('should show search dropdown when typing in search input on mobile', async ({ homePage, isMobile, testCreature }) => {
    test.skip(!isMobile, 'Search input is only visible on mobile')
    
    await test.step('Perform search', async () => {
      await homePage.search(testCreature.name)
    })
    
    await test.step('Verify search results', async () => {
      await expect(homePage.searchDropdown).toBeVisible()
      await expect(homePage.searchDropdown.locator('li')).toHaveCount(1)
      await expect(homePage.searchDropdown).toContainText(testCreature.name)
    })
  })
})
