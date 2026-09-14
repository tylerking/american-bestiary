import { type ActionFailure, error, fail, isActionFailure } from '@sveltejs/kit'
import type { z } from 'zod'
import { uuidSchema } from '$lib/schemas'
import { isUniqueViolation, violatedConstraint } from '../db/errors'

type Parsed<Schema extends z.ZodTypeAny> =
	| { ok: true; data: z.infer<Schema> }
	| { ok: false; message: string; field?: string }

function toObject(form: FormData): Record<string, unknown> {
	const out: Record<string, unknown> = {}
	for (const [key, value] of form) if (typeof value === 'string') out[key] = value
	return out
}

export function firstIssue(error: z.ZodError): { message: string; path: PropertyKey[] } {
	return error.issues[0] ?? { message: 'Invalid input', path: [] }
}

function fieldLabel(path: PropertyKey[]): string {
	const words = path.map((segment) =>
		typeof segment === 'number'
			? String(segment + 1)
			: String(segment)
					.replace(/__/g, ' ')
					.replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`)
					.replace(/(\d+)/g, ' $1')
	)
	const label = words.join(' ').trim()
	return label.charAt(0).toUpperCase() + label.slice(1)
}

export function parseForm<Schema extends z.ZodTypeAny>(form: FormData, schema: Schema): Parsed<Schema> {
	const result = schema.safeParse(toObject(form))
	if (result.success) return { ok: true, data: result.data }
	const issue = firstIssue(result.error)
	if (issue.path.length === 0) return { ok: false, message: issue.message }
	const label = fieldLabel(issue.path)
	// Our own messages start lowercase ("is required"); nothing else tells them apart from Zod's.
	const ours = /^[a-z]/.test(issue.message)
	const field = String(issue.path[0])
	return { ok: false, field, message: ours ? `${label} ${issue.message}.` : `${label}: ${issue.message}` }
}

export const failure = (parsed: { message: string; field?: string }) =>
	fail(400, { message: parsed.message, field: parsed.field })

export function settle<Result>(saved: Result | ActionFailure<{ message: string; field: string }>, notFound: string) {
	if (isActionFailure(saved)) return saved
	if (!saved) throw error(404, notFound)
	return { success: true as const }
}

export function sourcesFromForm(form: FormData): FormData {
	if (!form.has('sourceUrl')) return form
	const oldids = form.getAll('sourceOldid')
	const rows = form.getAll('sourceUrl').map((url, index) => ({ url: String(url), oldid: String(oldids[index] ?? '') }))
	form.set('sources', JSON.stringify(rows))
	return form
}

export function parseId(form: FormData): { ok: true; value: string } | { ok: false; message: string } {
	const parsed = uuidSchema.safeParse(form.get('id'))
	return parsed.success ? { ok: true, value: parsed.data } : { ok: false, message: 'Missing id' }
}

export function routeId(raw: string | undefined): string {
	const parsed = uuidSchema.safeParse(raw)
	if (!parsed.success) throw error(404, 'Not found')
	return parsed.data
}

const UNIQUE_MESSAGES: Record<string, { field: string; message: string }> = {
	creatures_territory_unique: { field: 'territory', message: 'That territory already has a specimen.' },
	themes_slug_unique: { field: 'slug', message: 'That slug is already used by another theme.' }
}

export async function unique<Result>(
	save: () => Promise<Result>
): Promise<Result | ActionFailure<{ message: string; field: string }>> {
	try {
		return await save()
	} catch (caught) {
		if (!isUniqueViolation(caught)) throw caught
		const known = UNIQUE_MESSAGES[String(violatedConstraint(caught))]
		return fail(400, known ?? { field: 'slug', message: 'That slug is already used by another entry.' })
	}
}
