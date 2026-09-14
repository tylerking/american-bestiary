import { expect, type Page, test } from '@playwright/test'
import { BASE_URL } from './env'
import { expectAccessible, expectNoSidewaysOverflow, stubTagManager } from './helpers'

const PAGES = [
	{ name: 'home', path: '/', status: 200 },
	{ name: 'archive', path: '/archives', status: 200 },
	{ name: 'entry', path: '/creatures/mothman', status: 200 },
	{ name: 'not found', path: '/no-such-page', status: 404 }
]

const SCHEMES = ['light', 'dark'] as const

const WIDTHS = [320, 390, 760, 1180, 1440]

test.beforeEach(async ({ page }) => {
	await page.route('**/api/event', (route) => route.fulfill({ status: 204 }))
	await stubTagManager(page)
})

for (const { name, path, status } of PAGES) {
	test.describe(`${name} page`, () => {
		for (const scheme of SCHEMES) {
			test.describe(`in ${scheme} mode`, () => {
				test.use({ reducedMotion: 'reduce' })

				test('passes axe', async ({ page }) => {
					expect((await page.goto(path))?.status()).toBe(status)
					await page.emulateMedia({ colorScheme: scheme })
					await expect(page.locator('html')).toHaveCSS('color-scheme', scheme)
					await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
					await page.waitForLoadState('networkidle')
					await expectAccessible(page)
				})
			})
		}

		test('never scrolls sideways', async ({ page }) => {
			await page.goto(path)
			for (const width of WIDTHS) {
				await page.setViewportSize({ width, height: 900 })
				const overflow = await page.evaluate(
					() => document.documentElement.scrollWidth - document.documentElement.clientWidth
				)
				expect(overflow, `${width}px`).toBeLessThanOrEqual(0)
				await expectNoSidewaysOverflow(page, `${width}px`)
			}
		})

		test('loads without console errors', async ({ page }) => {
			const errors: string[] = []
			page.on('console', (message) => {
				if (message.type() === 'error' && message.location().url !== page.url()) errors.push(message.text())
			})
			page.on('pageerror', (error) => errors.push(error.message))
			await page.goto(path)
			await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
			await page.waitForLoadState('networkidle')
			expect(errors).toEqual([])
		})
	})
}

test.describe('colour mode', () => {
	test('follows the operating system, with no toggle and nothing stored', async ({ page, context }) => {
		await page.goto('/')
		const root = page.locator('html')
		await page.emulateMedia({ colorScheme: 'dark' })
		await expect(root).toHaveCSS('color-scheme', 'dark')
		await page.emulateMedia({ colorScheme: 'light' })
		await expect(root).toHaveCSS('color-scheme', 'light')
		await expect(root).not.toHaveAttribute('data-theme')
		await expect(page.getByRole('link', { name: /reading/i })).toHaveCount(0)
		expect(await context.cookies()).toEqual([])
		expect(await page.evaluate(() => localStorage.length)).toBe(0)
	})
})

test.describe('the map', () => {
	const specimen = (page: Page) => page.locator('#specimen').getByRole('heading', { level: 2 })

	test('opens on West Virginia and moves between states with the arrow keys', async ({ page }) => {
		await page.goto('/')
		await expect(specimen(page)).toHaveText('Mothman')
		const westVirginia = page.getByRole('button', { name: 'West Virginia', exact: true })
		await expect(page.locator('svg [role="button"][tabindex="0"]')).toHaveCount(1)
		await expect(westVirginia).toHaveAttribute('tabindex', '0')
		await westVirginia.focus()
		await page.keyboard.press('ArrowUp')
		const moved = page.locator('svg [role="button"]:focus')
		const name = await moved.getAttribute('aria-label')
		expect(name).not.toBe('West Virginia')
		await expect(page.locator(`[data-focus-ring="${name}"]`)).toHaveCount(1)
		await page.keyboard.press('Enter')
		await expect(page.getByRole('button', { name: name ?? '', exact: true })).toHaveAttribute('aria-pressed', 'true')
		await expect(specimen(page)).not.toHaveText('Mothman')
		await page.getByRole('button', { name: 'Texas', exact: true }).focus()
		await page.keyboard.press(' ')
		await expect(specimen(page)).toHaveText('Chupacabra')
		await expect(page.getByText('Specimen of Texas', { exact: true })).toBeVisible()
	})

	test('offers a territory picker beside the map on every screen', async ({ page }) => {
		await page.goto('/')
		const picker = page.getByRole('combobox', { name: 'Territory' })
		await picker.selectOption('Delaware')
		await expect(specimen(page)).toHaveText('Swamp Monster')
		await expect(page).toHaveURL(/\?territory=delaware$/)
	})

	test('names a state beside the pointer', async ({ page, isMobile }) => {
		test.skip(isMobile, 'touch screens have no hover')
		await page.goto('/')
		const texas = page.getByRole('button', { name: 'Texas', exact: true })
		await texas.hover()
		await expect(page.locator('figure [aria-hidden="true"]').filter({ hasText: /^Texas$/ })).toBeVisible()
		await texas.click()
		await expect(specimen(page)).toHaveText('Chupacabra')
	})

	test('a shared address opens on its territory', async ({ page }) => {
		await page.goto('/?territory=maine')
		await expect(specimen(page)).toHaveText('Specter Moose')
	})

	test.describe('without scripts', () => {
		test.use({ javaScriptEnabled: false })

		test('lists every territory as a link to its specimen', async ({ page }) => {
			await page.goto('/')
			await page.getByRole('link', { name: 'Ohio', exact: true }).click()
			await expect(page).toHaveURL(/\?territory=ohio#specimen$/)
			await expect(specimen(page)).toHaveText('Loveland Frogmen')
		})
	})
})

test.describe('the archive', () => {
	const cards = (page: Page) => page.locator('main figure')

	test('filters live and keeps the address shareable', async ({ page }) => {
		await page.goto('/archives', { waitUntil: 'networkidle' })
		await expect(page.getByText('Fifty specimens')).toBeVisible()
		await expect(cards(page)).toHaveCount(50)
		await page.getByRole('searchbox', { name: 'Search the archive' }).fill('moth')
		await expect(cards(page)).toHaveCount(1)
		await expect(page).toHaveURL(/\?q=moth$/)
		await page.getByRole('searchbox', { name: 'Search the archive' }).fill('')
		await page.getByRole('group', { name: 'Status' }).getByRole('link', { name: 'Hoax' }).click()
		await expect(page.getByText('8 specimens', { exact: true })).toBeVisible()
		await page.getByRole('group', { name: 'Kind' }).getByRole('link', { name: 'Birds' }).click()
		await expect(cards(page)).toHaveCount(1)
		await expect(page).toHaveURL(/status=hoax&kind=bird$/)
		await page.getByRole('combobox', { name: 'Filter by territory' }).selectOption('Ohio')
		await expect(page.getByText(/Nothing in the archive answers to that/)).toBeVisible()
	})

	test.describe('without scripts', () => {
		test.use({ javaScriptEnabled: false })

		test('filters through links and the search form', async ({ page }) => {
			await page.goto('/archives')
			await page.getByRole('group', { name: 'Kind' }).getByRole('link', { name: 'Serpents' }).click()
			await expect(page).toHaveURL(/\?kind=serpent$/)
			await expect(cards(page)).toHaveCount(12)
			const search = page.getByRole('searchbox', { name: 'Search the archive' })
			await search.fill('lake')
			await search.press('Enter')
			await expect(page).toHaveURL(/q=lake/)
			await expect(page).toHaveURL(/kind=serpent/)
			await expect(cards(page)).toHaveCount(4)
		})
	})
})

test.describe('an entry', () => {
	test('describes itself to search engines and share cards', async ({ page }) => {
		await page.goto('/creatures/mothman')
		await expect(page).toHaveTitle('Mothman · American Bestiary')
		await expect(page.locator('meta[name="description"]')).toHaveAttribute(
			'content',
			/^A winged, glowing-eyed humanoid/
		)
		await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', `${BASE_URL}/images/mothman.png`)
		await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${BASE_URL}/creatures/mothman`)
		await expect(page.getByText('Mothman illustration by Tavo Montañez.', { exact: true })).toBeVisible()
	})

	test('walks the codex in a circle', async ({ page }) => {
		await page.goto('/creatures/beast-of-bladenboro')
		const navigation = page.getByRole('navigation', { name: 'Neighbouring entries' })
		await expect(navigation.getByRole('link', { name: /Previous entry/ })).toHaveAttribute('href', '/creatures/wendigo')
		await navigation.getByRole('link', { name: /Next entry/ }).click()
		await expect(page.getByRole('heading', { level: 1 })).toHaveText('Beast of Bray Road')
	})

	test('serves its plate', async ({ page }) => {
		await page.goto('/creatures/mothman')
		const plate = page.getByRole('img', { name: /^The Mothman, drawn as/ })
		await expect.poll(() => plate.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)
	})

	test('keeps the article first and draws its margin on the left', async ({ page, isMobile }) => {
		test.skip(isMobile, 'phones stack the margin under the article')
		await page.goto('/creatures/mothman')
		await expect(page.locator('main')).toHaveCount(1)
		const articleFirst = await page.evaluate(() => {
			const article = document.querySelector('main article')
			const margin = document.querySelector('main aside')
			return Boolean(article && margin && article.compareDocumentPosition(margin) & Node.DOCUMENT_POSITION_FOLLOWING)
		})
		expect(articleFirst).toBe(true)
		const article = await page.locator('main article').boundingBox()
		const margin = await page.locator('main aside').boundingBox()
		expect(margin?.x ?? Number.POSITIVE_INFINITY).toBeLessThan(article?.x ?? 0)
	})
})

test('the skip link is the first stop and lands on the content', async ({ page }) => {
	await page.goto('/archives', { waitUntil: 'networkidle' })
	const first = page.locator('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])').first()
	await expect(first).toHaveAccessibleName('Skip to content')
	await first.focus()
	await expect(first).toBeFocused()
	await expect(first).toBeInViewport()
	await page.keyboard.press('Enter')
	await expect(page).toHaveURL(/#main-content$/)
})

test('renders without waiting on a stylesheet request, with the fonts still loading', async ({ page }) => {
	await page.goto('/creatures/mothman', { waitUntil: 'networkidle' })
	await expect(page.locator('link[rel="stylesheet"]')).toHaveCount(0)
	const fontsLoaded = await page.evaluate(async () => {
		await document.fonts.ready
		return document.fonts.check('16px Fraunces')
	})
	expect(fontsLoaded).toBe(true)
})

test('loads Google Tag Manager on the first interaction, not during page load', async ({ page }) => {
	await page.goto('/archives', { waitUntil: 'networkidle' })
	expect(await page.evaluate(() => 'dataLayer' in window)).toBe(false)
	const loader = page.waitForRequest('https://www.googletagmanager.com/gtm.js?id=GTM-5F34B659')
	await page.keyboard.press('Tab')
	await loader
	expect(await page.evaluate(() => 'dataLayer' in window)).toBe(true)
})

test('a visit sends a pageview beacon', async ({ page }) => {
	await page.unroute('**/api/event')
	const beacon = page.waitForRequest('**/api/event')
	await page.goto('/archives')
	expect((await beacon).method()).toBe('POST')
})

test('the API reference renders from the OpenAPI document', async ({ page }) => {
	await page.goto('/api/docs')
	await expect(page.getByText('American Bestiary').first()).toBeVisible({ timeout: 30_000 })
})
