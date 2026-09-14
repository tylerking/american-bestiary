import { SORT_COLUMNS, type SortColumn } from '$lib/components/admin/SpecimenTable/sort'
import { getCodex } from '$lib/server/db/queries'
import type { PageServerLoad } from './$types'

const isColumn = (value: string | null): value is SortColumn => SORT_COLUMNS.some((column) => column === value)

export const load: PageServerLoad = async ({ url }) => {
	const requested = url.searchParams.get('sort')
	const codex = await getCodex()
	return {
		specimens: codex.map((specimen, index) => ({ ...specimen, position: index + 1 })),
		sort: isColumn(requested) ? requested : 'name',
		descending: url.searchParams.get('direction') === 'desc'
	}
}
