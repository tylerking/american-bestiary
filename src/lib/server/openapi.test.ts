import { describe, expect, it } from 'vitest'
import { KINDS } from '$lib/enums'
import { openApiDocument } from './openapi'

describe('openApiDocument', () => {
	const document = openApiDocument('https://bestiary.example')

	it('documents every read-only route and nothing that writes', () => {
		expect(document.openapi).toMatch(/^3\./)
		expect(document.servers).toEqual([{ url: 'https://bestiary.example' }])
		expect(Object.keys(document.paths).sort()).toEqual([
			'/api/creatures',
			'/api/creatures/{slug}',
			'/api/health',
			'/api/themes/current'
		])
		for (const path of Object.values(document.paths)) expect(Object.keys(path)).toEqual(['get'])
	})

	it('derives the specimen schema from the database table', () => {
		const specimen = document.components.schemas.Specimen as {
			type: string
			properties: Record<string, { enum?: string[]; type?: string }>
			required: string[]
		}
		expect(specimen.type).toBe('object')
		expect(specimen.properties.kind?.enum).toEqual([...KINDS])
		expect(specimen.required).toEqual(expect.arrayContaining(['slug', 'name', 'sections', 'sources']))
		expect(specimen.properties).not.toHaveProperty('imageKey')
	})

	it('points every response at a defined schema', () => {
		const references = JSON.stringify(document.paths).match(/#\/components\/schemas\/\w+/g) ?? []
		for (const reference of references) {
			expect(document.components.schemas).toHaveProperty(reference.split('/').at(-1) ?? '')
		}
	})
})
