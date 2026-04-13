import { expect, test } from './fixtures'

test.describe('Archives Page', () => {
  test.beforeEach(async ({ archivesPage }) => {
    await test.step('Navigate to archives page', async () => {
      await archivesPage.goto()
    })
  })

  test('should display creature cards', async ({ archivesPage, creatures, page }) => {
    await test.step('Verify page title and card count', async () => {
      await expect(page).toHaveTitle('Cryptid Archives | American Bestiary')
      await expect(archivesPage.cards.first()).toBeVisible()
      await expect(archivesPage.cards).toHaveCount(creatures.length)
    })
  })

  test('should filter creatures by name', async ({ archivesPage, testCreature }) => {
    await test.step('Apply name filter', async () => {
      await archivesPage.filter(testCreature.name)
    })
    
    await test.step('Verify filtered results', async () => {
      await expect(archivesPage.cards).toHaveCount(1)
      await expect(archivesPage.cards).toContainText(testCreature.name)
    })
  })

  test('should show no results message for invalid filter', async ({ archivesPage }) => {
    await test.step('Apply invalid filter', async () => {
      await archivesPage.filter('zzzznonexistent')
    })
    
    await test.step('Verify empty state', async () => {
      await expect(archivesPage.emptyState).toBeVisible()
      await expect(archivesPage.cards).toHaveCount(0)
    })
  })

  test('should navigate to creature detail from card', async ({ archivesPage, page }) => {
    let creatureName = ''
    
    await test.step('Click first card', async () => {
      const firstCard = archivesPage.cards.first()
      creatureName = await firstCard.locator('h2').innerText()
      await firstCard.click()
    })
    
    await test.step('Verify navigation to detail page', async () => {
      await expect(page).toHaveURL(/.*\/creatures\/.*/)
      await expect(page.locator('article h1')).toContainText(creatureName)
    })
  })
})
