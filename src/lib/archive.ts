import { KINDS } from './enums'
import { kindLabel, statusLabel } from './labels/terms'
import type { Kind, Labels, SpecimenSummary } from './types'

export interface ArchiveQuery {
	q: string
	territory: string
	status: string
	kind: string
}

export const EMPTY_QUERY: ArchiveQuery = { q: '', territory: '', status: 'all', kind: 'all' }

export function filterArchive<Specimen extends SpecimenSummary>(
	specimens: readonly Specimen[],
	query: ArchiveQuery,
	labels: Labels
): Specimen[] {
	const needle = query.q.trim().toLowerCase()
	return specimens.filter((specimen) => {
		if (query.status !== 'all' && specimen.status !== query.status) return false
		if (query.kind !== 'all' && specimen.kind !== query.kind) return false
		if (query.territory && specimen.territory !== query.territory) return false
		if (!needle) return true
		const haystack = [
			specimen.name,
			specimen.territory,
			specimen.classification,
			kindLabel(labels, specimen.kind),
			statusLabel(labels, specimen.status)
		]
		return haystack.join(' ').toLowerCase().includes(needle)
	})
}

export function groupByKind<Specimen extends { kind: Kind }>(
	specimens: readonly Specimen[]
): { kind: Kind; items: Specimen[] }[] {
	return KINDS.map((kind) => ({ kind, items: specimens.filter((specimen) => specimen.kind === kind) })).filter(
		(group) => group.items.length > 0
	)
}

export function archiveSearch(query: ArchiveQuery, changes: Partial<ArchiveQuery> = {}): string {
	const next = { ...query, ...changes }
	const params = new URLSearchParams()
	for (const key of ['q', 'territory', 'status', 'kind'] as const) {
		if (next[key] !== EMPTY_QUERY[key]) params.set(key, next[key])
	}
	const search = params.toString()
	return search ? `?${search}` : ''
}
