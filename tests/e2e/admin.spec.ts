import { expect, test } from '@playwright/test'
import { ADMIN_NAVIGATION } from '../../src/lib/components/admin/navigation'
import { ADMIN_STATE, BASE_URL } from './env'
import { expectAccessible, expectNoSidewaysOverflow, repeatedControlNames, signIn, stubTagManager } from './helpers'

test.use({ storageState: ADMIN_STATE })

test.beforeEach(async ({ page }) => {
	await stubTagManager(page)
})

const SCHEMES = ['light', 'dark'] as const

for (const { href, label } of ADMIN_NAVIGATION.flatMap((group) => group.links)) {
	for (const scheme of SCHEMES) {
		test(`${label} passes axe in ${scheme} mode`, async ({ page }) => {
			await page.goto(href)
			await page.emulateMedia({ colorScheme: scheme })
			await expect(page.locator('html')).toHaveCSS('color-scheme', scheme)
			await expect(page.getByRole('link', { name: label, exact: true })).toHaveAttribute('aria-current', 'page')
			await expectAccessible(page)
		})
	}

	test(`${label} keeps everything inside the screen on a phone at 200% text`, async ({ page }) => {
		await page.goto(href)
		await page.evaluate(() => {
			document.documentElement.style.fontSize = '200%'
		})
		for (const width of [320, 390]) {
			await page.setViewportSize({ width, height: 900 })
			await expectNoSidewaysOverflow(page, `${width}px at 200% text`)
		}
	})

	test(`${label} gives every repeated control a distinct name`, async ({ page }) => {
		await page.goto(href)
		expect(await repeatedControlNames(page)).toEqual([])
	})
}

test('a specimen edit goes live, unpublishing hides it, preview still shows it, and restore brings the edit back', async ({
	page,
	request
}) => {
	await page.goto('/admin/specimens')
	await page.getByRole('link', { name: 'Jackalope', exact: true }).click()
	const gloss = page.getByLabel('Gloss')
	const original = await gloss.inputValue()
	const edited = `Edited in review at ${Date.now()}.`

	await gloss.fill(edited)
	await page.getByRole('button', { name: 'Save specimen' }).click()
	await expect(page.getByText('Saved.', { exact: true })).toBeVisible()
	expect(await (await request.get('/creatures/jackalope')).text()).toContain(edited)

	await page.getByRole('button', { name: 'Unpublish' }).click()
	await expect(page.getByRole('button', { name: 'Publish' })).toBeVisible()
	await expect.poll(async () => (await request.get('/creatures/jackalope')).status()).toBe(404)
	await page.getByRole('link', { name: 'Preview' }).click()
	await expect(page.getByRole('heading', { name: 'Jackalope', level: 1 })).toBeVisible()
	await expect(page.getByRole('complementary', { name: 'Preview' })).toContainText('hidden from the public site')
	await page.getByRole('link', { name: 'Back to the editor' }).click()
	await page.getByRole('button', { name: 'Publish' }).click()
	await expect(page.getByRole('button', { name: 'Unpublish' })).toBeVisible()
	await expect.poll(async () => (await request.get('/creatures/jackalope')).status()).toBe(200)

	await page
		.getByRole('link', { name: /Compare and restore/ })
		.last()
		.click()
	await expect(page.getByRole('cell', { name: edited })).toBeVisible()
	await page.getByRole('button', { name: 'Restore this revision' }).click()
	await page.getByRole('button', { name: 'Yes, restore it: Restore this revision' }).click()
	await expect(page).toHaveURL(/restored=1/)
	await expect(page.getByLabel('Gloss')).toHaveValue(original)
})

test('a theme slot edit reaches the current theme, and a duplicate specimen is refused on the field', async ({
	page
}) => {
	await page.goto('/admin/themes')
	const month = new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' }).format(new Date())
	await page
		.getByRole('row', { name: new RegExp(`^${month}`) })
		.getByRole('link')
		.click()
	const note = page.getByLabel('Note for specimen 1')
	const original = await note.inputValue()
	const edited = `A theme note written at ${Date.now()}.`

	await note.fill(edited)
	await page.getByRole('button', { name: 'Save theme' }).click()
	await expect(page.getByText('Saved.', { exact: true })).toBeVisible()
	await page.goto('/')
	await expect(page.getByText(edited)).toBeVisible()

	await page.goBack()
	const first = await page.getByLabel('Specimen 1', { exact: true }).inputValue()
	await page.getByLabel('Specimen 4', { exact: true }).selectOption(first)
	await page.getByRole('button', { name: 'Save theme' }).click()
	await expect(page.getByLabel('Specimen 4', { exact: true })).toHaveAccessibleDescription(/appears twice/)

	await page.reload()
	await page.getByLabel('Note for specimen 1').fill(original)
	await page.getByRole('button', { name: 'Save theme' }).click()
	await expect(page.getByText('Saved.', { exact: true })).toBeVisible()
})

test('a label edit in globals goes live on the site', async ({ page }) => {
	const save = async (text: string) => {
		await page.goto('/admin/globals')
		await page.getByLabel('Read Entry', { exact: true }).fill(text)
		await page.getByRole('button', { name: 'Save globals' }).click()
		await expect(page.getByText('Saved.', { exact: true })).toBeVisible()
	}
	await save('Open the entry')
	await page.goto('/')
	await expect(page.getByRole('link', { name: 'Open the entry' })).toBeVisible()
	await save('Read the entry')
})

test('a disguised plate upload is refused', async ({ page }) => {
	await page.goto('/admin/specimens')
	await page.getByRole('link', { name: 'Squonk', exact: true }).click()
	await page
		.locator('input[type="file"]')
		.setInputFiles({ name: 'plate.png', mimeType: 'image/png', buffer: Buffer.from('<html></html>') })
	await page.getByRole('button', { name: 'Upload plate' }).click()
	await expect(page.getByText('Only PNG, JPEG, WebP, GIF, or AVIF images are allowed.')).toBeVisible()
})

test.describe('the shared shell', () => {
	test('matches the public site width and header', async ({ page }) => {
		await page.setViewportSize({ width: 1440, height: 900 })
		await page.goto('/')
		const site = await page.locator('header').first().boundingBox()
		await page.goto('/admin')
		const admin = await page.locator('header').first().boundingBox()
		expect(admin?.width).toBe(site?.width)
		expect(admin?.x).toBe(site?.x)
		await expect(page.getByRole('link', { name: 'View the site (opens in new tab)' })).toBeVisible()
		await expect(page.getByRole('button', { name: 'Sign out', exact: true })).toBeVisible()
	})

	test('never loads Google Tag Manager', async ({ page }) => {
		await page.goto('/admin', { waitUntil: 'networkidle' })
		expect(await page.evaluate(() => 'dataLayer' in window)).toBe(false)
		await expect(page.locator('iframe[src*="googletagmanager"]')).toHaveCount(0)
	})

	test('starts with the skip link, which lands on the content', async ({ page }) => {
		await page.goto('/admin/specimens', { waitUntil: 'networkidle' })
		const first = page.locator('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])').first()
		await expect(first).toHaveAccessibleName('Skip to content')
		await first.focus()
		await page.keyboard.press('Enter')
		await expect(page).toHaveURL(/#main-content$/)
	})

	test('keeps every admin link visible on a phone', async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 })
		await page.goto('/admin')
		const navigation = page.getByRole('navigation', { name: 'Admin' })
		for (const { label } of ADMIN_NAVIGATION.flatMap((group) => group.links)) {
			await expect(navigation.getByRole('link', { name: label, exact: true })).toBeVisible()
		}
	})

	test('sends no analytics from a preview', async ({ page }) => {
		const events: string[] = []
		page.on('request', (request) => {
			if (request.url().includes('/api/event')) events.push(request.url())
		})
		await page.goto('/admin/preview/creatures/mothman', { waitUntil: 'networkidle' })
		await expect(page.getByRole('complementary', { name: 'Preview' })).toBeVisible()
		expect(events).toEqual([])
	})
})

test.describe('signing in and out', () => {
	test.use({ storageState: { cookies: [], origins: [] } })

	test('the sign-in page is only as tall as its content', async ({ page }) => {
		await page.setViewportSize({ width: 1440, height: 1200 })
		await page.goto('/admin/login')
		const footer = await page.locator('footer').boundingBox()
		expect((footer?.y ?? 0) + (footer?.height ?? 0)).toBeLessThan(900)
	})

	test('a wrong password is refused on the field', async ({ page }) => {
		await signIn(page, 'not-the-password')
		await expect(page.getByLabel('Password')).toHaveAccessibleDescription('Incorrect email or password.')
	})

	test('signing out revokes the old session cookie', async ({ page, browser }) => {
		await signIn(page)
		await expect(page).toHaveURL(/\/admin$/)
		const cookies = await page.context().cookies()
		await page.getByRole('button', { name: 'Sign out', exact: true }).click()
		await expect(page).toHaveURL(/\/admin\/login$/)

		const replay = await browser.newContext({ baseURL: BASE_URL })
		await replay.addCookies(cookies)
		const stale = await replay.newPage()
		await stale.goto('/admin')
		await expect(stale).toHaveURL(/\/admin\/login$/)
		await replay.close()
	})
})
