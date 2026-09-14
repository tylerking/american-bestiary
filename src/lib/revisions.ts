import type { FieldChange } from './types'

const display = (value: unknown): string => {
	if (value === null || value === undefined) return ''
	if (typeof value === 'object') return JSON.stringify(value)
	return String(value)
}

function flatten(snapshot: Record<string, unknown>, names: ReadonlyMap<string, string>): Map<string, string> {
	const out = new Map<string, string>()
	for (const [field, value] of Object.entries(snapshot)) {
		if (field === 'slots' && Array.isArray(value)) {
			for (const slot of value as { position: number; creatureId: string; note: string }[]) {
				out.set(`slot ${slot.position} specimen`, names.get(slot.creatureId) ?? slot.creatureId)
				out.set(`slot ${slot.position} note`, slot.note)
			}
		} else if (field === 'sources' && Array.isArray(value)) {
			for (const [index, source] of (value as { url: string; oldid: number | null }[]).entries()) {
				out.set(`source ${index + 1} url`, source.url)
				out.set(`source ${index + 1} revision`, display(source.oldid))
			}
		} else if (field === 'labels' && value && typeof value === 'object') {
			for (const [key, label] of Object.entries(value)) out.set(`label ${key}`, display(label))
		} else {
			out.set(field, display(value))
		}
	}
	return out
}

export function diffSnapshots(
	before: Record<string, unknown>,
	after: Record<string, unknown>,
	names: ReadonlyMap<string, string> = new Map()
): FieldChange[] {
	const left = flatten(before, names)
	const right = flatten(after, names)
	const fields = [...new Set([...left.keys(), ...right.keys()])]
	return fields.flatMap((field) => {
		const was = left.get(field) ?? ''
		const now = right.get(field) ?? ''
		return was === now ? [] : [{ field, before: was, after: now }]
	})
}
