import { fill } from '$lib/codex'
import type { RUBRICS } from '$lib/enums'
import type { Kind, Labels, Status } from '$lib/types'

const capital = <Word extends string>(word: Word) =>
	`${word.charAt(0).toUpperCase()}${word.slice(1)}` as Capitalize<Word>

export const statusLabel = (labels: Labels, status: Status) => labels[`status${capital(status)}`]

export const kindLabel = (labels: Labels, kind: Kind) => labels[`kind${capital(kind)}`]

export const groupLabel = (labels: Labels, kind: Kind) => labels[`group${capital(kind)}`]

export const rubricLabel = (labels: Labels, rubric: (typeof RUBRICS)[number]) => labels[`rubric${capital(rubric)}`]

export function specimenCount(labels: Labels, count: number): string {
	if (count === 0) return labels.specimenCountNone
	if (count === 1) return labels.specimenCountOne
	return fill(labels.specimenCount, { number: count })
}
