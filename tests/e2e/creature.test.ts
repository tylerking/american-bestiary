import { slugify } from '../../src/lib/utils/slugify'
import { expect, test } from './fixtures'

test.describe('Creature Detail Page', () => {
  test('should display creature details for test creature', async ({ creaturePage, page, testCreature }) => {
    await test.step('Navigate to creature detail page', async () => {
      await creaturePage.goto(slugify(testCreature.name))
    })
    
    await test.step('Verify header information', async () => {
      await expect(page).toHaveTitle(new RegExp(testCreature.name))
      await expect(creaturePage.title).toContainText(testCreature.name)
      await expect(creaturePage.region).toContainText(testCreature.region)
    })
    
    await test.step('Verify content sections visibility', async () => {
      await expect(creaturePage.anatomySection).toBeVisible()
      await expect(creaturePage.behaviorSection).toBeVisible()
      await expect(creaturePage.ecologySection).toBeVisible()
      await expect(creaturePage.mythologySection).toBeVisible()
      await expect(creaturePage.sourceLink).toBeVisible()
    })
  })

  test('should have working navigation links', async ({ creaturePage, page, testCreature }) => {
    await test.step('Navigate to creature page', async () => {
      await creaturePage.goto(slugify(testCreature.name))
    })
    
    await test.step('Test Back to Map navigation', async () => {
      await creaturePage.openMenu()
      await creaturePage.backToMapLink.click()
      await expect(page).toHaveURL('/')
    })
    
    await test.step('Go back and test Back to Archives navigation', async () => {
      await page.goBack()
      await creaturePage.openMenu()
      await creaturePage.backToArchivesLink.click()
      await expect(page).toHaveURL('/archives')
    })
  })

  test('should return 404 for unknown creature', async ({ page }) => {
    await test.step('Navigate to non-existent creature', async () => {
      const response = await page.goto('/creatures/nonexistent-creature')
      expect(response?.status()).toBe(404)
    })
    
    await test.step('Verify 404 error message', async () => {
      await expect(page.getByText('404')).toBeVisible()
    })
  })
})
