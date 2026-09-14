import { json } from '@sveltejs/kit'
import { apiListSchema } from '$lib/schemas'
import { API_HEADERS, apiError, publicSpecimen } from '$lib/server/api'
import { listSpecimens } from '$lib/server/db/queries'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ url }) => {
	const parsed = apiListSchema.safeParse(Object.fromEntries(url.searchParams))
	if (!parsed.success) {
		const issue = parsed.error.issues[0]
		return apiError(400, `${issue?.path.join('.') || 'query'}: ${issue?.message ?? 'invalid'}`)
	}
	const { data, total } = await listSpecimens(parsed.data)
	return json(
		{
			data: data.map((specimen) => publicSpecimen(specimen, url.origin)),
			page: parsed.data.page,
			limit: parsed.data.limit,
			total
		},
		{ headers: API_HEADERS }
	)
}
