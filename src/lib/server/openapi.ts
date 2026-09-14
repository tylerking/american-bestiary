import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { SITE_NAME } from '$lib/codex'
import { KINDS, STATUSES, TERRITORIES } from '$lib/enums'
import { creatures, themeCreatures, themes } from './db/schema'

const creature = createSelectSchema(creatures, {
	kind: z.enum(KINDS),
	status: z.enum(STATUSES),
	territory: z.enum(TERRITORIES)
})
const slot = createSelectSchema(themeCreatures)
const theme = createSelectSchema(themes)

const summary = creature
	.pick({
		slug: true,
		name: true,
		territory: true,
		classification: true,
		kind: true,
		status: true,
		abstract: true,
		gloss: true
	})
	.extend({
		image: z.string().describe('Absolute URL of the plate.'),
		url: z.string().describe('Absolute URL of the entry page.')
	})

const specimen = summary.extend({
	sections: creature.pick({ etymology: true, anatomy: true, ecology: true, behavior: true, mythology: true }),
	sources: z.array(z.object({ url: z.string(), host: z.string(), oldid: z.number().int().nullable() })),
	updatedAt: z.string().describe('ISO 8601 timestamp.')
})

const monthlyTheme = theme.pick({ slug: true, title: true, description: true, month: true }).extend({
	members: z.array(summary.extend({ position: slot.shape.position, note: slot.shape.note }))
})

const page = z.object({ data: z.array(specimen), page: z.number(), limit: z.number(), total: z.number() })
const failure = z.object({ error: z.string() })
const health = z.object({ status: z.enum(['ok', 'degraded']), database: z.enum(['ok', 'unreachable']) })

const schema = (value: z.ZodType) => z.toJSONSchema(value, { target: 'openapi-3.0', io: 'output' })

const reply = (description: string, reference: string) => ({
	description,
	content: { 'application/json': { schema: { $ref: `#/components/schemas/${reference}` } } }
})

const query = (name: string, description: string, values?: readonly string[], type = 'string') => ({
	name,
	in: 'query',
	required: false,
	description,
	schema: values ? { type, enum: values } : { type }
})

export function openApiDocument(origin: string) {
	return {
		openapi: '3.0.3',
		info: {
			title: SITE_NAME,
			version: '4.0.0',
			description: 'Read-only access to the fifty published specimens and the theme of the month.'
		},
		servers: [{ url: origin }],
		paths: {
			'/api/creatures': {
				get: {
					summary: 'List published specimens in codex order',
					parameters: [
						query('kind', 'Filter by kind.', KINDS),
						query('status', 'Filter by verdict.', STATUSES),
						query('territory', 'Filter by state name, case-insensitive.', TERRITORIES),
						query('limit', 'Page size, 1 to 50. Defaults to 50.', undefined, 'integer'),
						query('page', 'Page number, from 1.', undefined, 'integer')
					],
					responses: { 200: reply('A page of specimens.', 'SpecimenPage'), 400: reply('Invalid query.', 'Error') }
				}
			},
			'/api/creatures/{slug}': {
				get: {
					summary: 'Fetch one published specimen',
					parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
					responses: { 200: reply('The specimen.', 'Specimen'), 404: reply('No published specimen.', 'Error') }
				}
			},
			'/api/themes/current': {
				get: {
					summary: 'The theme for the current month (UTC)',
					responses: { 200: reply('The theme.', 'MonthlyTheme'), 404: reply('No theme this month.', 'Error') }
				}
			},
			'/api/health': {
				get: {
					summary: 'Service health',
					responses: { 200: reply('Healthy.', 'Health'), 503: reply('Database unreachable.', 'Health') }
				}
			}
		},
		components: {
			schemas: {
				Specimen: schema(specimen),
				SpecimenPage: schema(page),
				MonthlyTheme: schema(monthlyTheme),
				Health: schema(health),
				Error: schema(failure)
			}
		}
	}
}
