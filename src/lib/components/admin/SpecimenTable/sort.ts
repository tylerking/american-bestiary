import type { Specimen } from '$lib/types'

export const SORT_COLUMNS = ['name', 'territory', 'status', 'published', 'updated'] as const

export type SortColumn = (typeof SORT_COLUMNS)[number]

type Row = Pick<Specimen, 'name' | 'territory' | 'status' | 'publishedAt' | 'updatedAt'> & { position: number }

const compare: Record<SortColumn, (left: Row, right: Row) => number> = {
	name: (left, right) => left.name.localeCompare(right.name, 'en'),
	territory: (left, right) => left.territory.localeCompare(right.territory, 'en'),
	status: (left, right) => left.status.localeCompare(right.status, 'en'),
	published: (left, right) => Number(left.publishedAt !== null) - Number(right.publishedAt !== null),
	updated: (left, right) => left.updatedAt.getTime() - right.updatedAt.getTime()
}

export function sortSpecimens<Item extends Row>(
	rows: readonly Item[],
	column: SortColumn,
	descending: boolean
): Item[] {
	const direction = descending ? -1 : 1
	return [...rows].sort((left, right) => compare[column](left, right) * direction || left.position - right.position)
}
