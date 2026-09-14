import { isHttpError } from '@sveltejs/kit'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { beaconSchema, loginSchema, themeSchema } from '$lib/schemas'
import { outcome } from '../../../../tests/helpers/actions'
import { firstIssue, parseForm, parseId, routeId, sourcesFromForm, unique } from './forms'

const ID = '0000000a-0000-4000-8000-000000000000'

const form = (entries: Record<string, string | Blob>) => {
	const data = new FormData()
	for (const [key, value] of Object.entries(entries)) data.append(key, value)
	return data
}

describe('parseForm', () => {
	it('returns the parsed data', () => {
		expect(parseForm(form({ email: 'ada@example.com', password: 'x' }), loginSchema)).toMatchObject({
			ok: true,
			data: { email: 'ada@example.com' }
		})
	})

	it('puts our own messages after the field label', () => {
		expect(parseForm(form({ email: 'ada@example.com' }), loginSchema)).toEqual({
			ok: false,
			field: 'password',
			message: 'Password is required.'
		})
	})

	it("puts Zod's own messages after a colon", () => {
		const result = parseForm(form({ email: 'nope', password: 'x' }), loginSchema)
		expect(result).toMatchObject({ ok: false, field: 'email' })
		expect(!result.ok && result.message).toMatch(/^Email: /)
	})

	it('spaces the number in a numbered field', () => {
		const fields = { slug: 's', title: 'T', description: 'D', specimen1: ID, note1: 'n', specimen2: ID }
		expect(parseForm(form(fields), themeSchema)).toMatchObject({
			ok: false,
			field: 'note2',
			message: 'Note 2 is required.'
		})
	})

	it('numbers array positions from one', () => {
		const schema = z.object({ rows: z.array(z.string().min(1, 'is required')) })
		const result = schema.safeParse({ rows: [''] })
		expect(result.success).toBe(false)
		const parsed = parseForm(
			form({ rows: '' }),
			z.preprocess(() => ({ rows: [''] }), schema)
		)
		expect(parsed).toEqual({ ok: false, field: 'rows', message: 'Rows 1 is required.' })
	})

	it('ignores file entries', () => {
		expect(parseForm(form({ email: new Blob(['x']), password: 'x' }), loginSchema)).toMatchObject({
			ok: false,
			field: 'email'
		})
	})

	it('reports an object-level issue without a field', () => {
		expect(parseForm(form({ type: 'outbound', path: '/relative' }), beaconSchema)).toEqual({
			ok: false,
			message: 'invalid path'
		})
	})
})

describe('sourcesFromForm', () => {
	it('pairs repeated source fields into rows', () => {
		const data = new FormData()
		data.append('sourceUrl', 'https://a.example')
		data.append('sourceOldid', '5')
		data.append('sourceUrl', 'https://b.example')
		expect(JSON.parse(String(sourcesFromForm(data).get('sources')))).toEqual([
			{ url: 'https://a.example', oldid: '5' },
			{ url: 'https://b.example', oldid: '' }
		])
	})

	it('leaves a form without source fields untouched', () => {
		const data = form({ sources: '[]' })
		expect(sourcesFromForm(data).get('sources')).toBe('[]')
	})
})

describe('firstIssue', () => {
	it('falls back when Zod reports no issue', () => {
		expect(firstIssue(new z.ZodError([]))).toEqual({ message: 'Invalid input', path: [] })
	})
})

describe('parseId and routeId', () => {
	it('reads a uuid from a form', () => {
		expect(parseId(form({ id: ID }))).toEqual({ ok: true, value: ID })
		expect(parseId(form({ id: '4' }))).toEqual({ ok: false, message: 'Missing id' })
	})

	it('turns a bad route id into a 404', () => {
		expect(routeId(ID)).toBe(ID)
		try {
			routeId('abc')
			expect.unreachable()
		} catch (error) {
			expect(isHttpError(error, 404)).toBe(true)
		}
	})
})

describe('unique', () => {
	it('passes a successful save through', async () => {
		await expect(unique(async () => 12)).resolves.toBe(12)
	})

	it('names the field a known constraint protects', async () => {
		const result = await unique(() => Promise.reject({ code: '23505', constraint: 'creatures_territory_unique' }))
		expect(outcome(result)).toEqual({
			status: 400,
			field: 'territory',
			message: 'That territory already has a specimen.'
		})
	})

	it('treats any other unique violation as a slug clash', async () => {
		expect(outcome(await unique(() => Promise.reject({ code: '23505' })))).toEqual({
			status: 400,
			field: 'slug',
			message: 'That slug is already used by another entry.'
		})
	})

	it('rethrows anything else', async () => {
		await expect(unique(() => Promise.reject(new Error('boom')))).rejects.toThrow('boom')
	})
})
