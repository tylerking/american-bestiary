import { json } from '@sveltejs/kit'
import { API_HEADERS, apiError, publicTheme } from '$lib/server/api'
import { getMonthlyTheme } from '$lib/server/db/queries'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ url }) => {
	const theme = await getMonthlyTheme()
	if (!theme) return apiError(404, 'No theme is set for this month')
	return json(publicTheme(theme, url.origin), { headers: API_HEADERS })
}
