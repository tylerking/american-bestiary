import { z } from 'zod'
import { KINDS, REVISION_ENTITIES, STATUSES, TERRITORIES, THEME_POSITIONS } from './enums'
import { LABEL_FIELD_PREFIX, LABELS, type LabelKey } from './labels/label-defaults'

const string = () => z.string({ error: (issue) => (issue.input === undefined ? 'is required' : undefined) })
const text = (max: number) => string().trim().max(max)
const required = (max: number) => text(max).min(1, 'is required')
const safeUrl = (max: number) =>
	text(max).refine(
		(value) => value === '' || /^\/(?!\/)/.test(value) || /^https?:\/\//i.test(value),
		'must be a /path or an http(s):// URL'
	)
const slug = z
	.string()
	.trim()
	.min(1, 'is required')
	.max(100)
	.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'lowercase letters, numbers and dashes only')
const blankToNull = (value: unknown) => (value === '' || value === undefined ? null : value)

export const kindSchema = z.enum(KINDS)
export const statusSchema = z.enum(STATUSES)
export const territorySchema = z.enum(TERRITORIES, { error: () => 'must be one of the fifty states' })
export const revisionEntitySchema = z.enum(REVISION_ENTITIES)
export const userRoleSchema = z.enum(['admin'])
export const eventTypeSchema = z.enum(['pageview', 'outbound'])
export const uuidSchema = z.uuid()

const blankSource = (row: unknown) =>
	typeof row === 'object' &&
	row !== null &&
	['url', 'oldid'].every((key) => String((row as Record<string, unknown>)[key] ?? '').trim() === '')

const readRows = (value: unknown) => {
	if (typeof value !== 'string') return value
	try {
		return JSON.parse(value)
	} catch {
		return undefined
	}
}

export const sourceSchema = z.object({
	url: required(500).refine((value) => /^https?:\/\//i.test(value), 'must be an http(s):// URL'),
	oldid: z.preprocess(
		blankToNull,
		z.coerce.number({ error: 'must be a number' }).int('must be a whole number').positive('must be positive').nullable()
	)
})

const sourceList = z.preprocess((value) => {
	const rows = readRows(value ?? [])
	return Array.isArray(rows) ? rows.filter((row) => !blankSource(row)) : rows
}, z.array(sourceSchema).max(20))

export const creatureSchema = z.object({
	slug,
	name: required(120),
	territory: territorySchema,
	classification: required(160),
	kind: kindSchema,
	status: statusSchema,
	abstract: required(600),
	gloss: required(400),
	etymology: required(4000),
	anatomy: required(4000),
	ecology: required(4000),
	behavior: required(4000),
	mythology: required(4000),
	sources: sourceList
})

const specimenId = () => z.uuid({ error: 'must be a specimen' })

type ThemePosition = (typeof THEME_POSITIONS)[number]

const slotShape = Object.fromEntries(
	THEME_POSITIONS.flatMap((position) => [
		[`specimen${position}`, specimenId()],
		[`note${position}`, required(300)]
	])
) as Record<`specimen${ThemePosition}`, ReturnType<typeof specimenId>> &
	Record<`note${ThemePosition}`, ReturnType<typeof required>>

export const themeSchema = z
	.object({ slug, title: required(120), description: required(400), ...slotShape })
	.transform((form) => ({
		slug: form.slug,
		title: form.title,
		description: form.description,
		slots: THEME_POSITIONS.map((position) => ({
			position,
			creatureId: form[`specimen${position}`],
			note: form[`note${position}`]
		}))
	}))
	.refine((theme) => new Set(theme.slots.map((slot) => slot.creatureId)).size === theme.slots.length, {
		message: 'appears twice in this theme',
		path: [`specimen${THEME_POSITIONS.length}`]
	})

const labelShape = Object.fromEntries(
	Object.entries(LABELS).map(([key, [value, max]]) => [key, text(max).default(value)])
) as Record<LabelKey, z.ZodDefault<z.ZodString>>

export const labelsSchema = z.object(labelShape)

export const labelsFormSchema = z
	.object(
		Object.fromEntries(
			Object.entries(labelShape).map(([key, schema]) => [`${LABEL_FIELD_PREFIX}${key}`, schema])
		) as Record<string, z.ZodDefault<z.ZodString>>
	)
	.transform(
		(form) =>
			Object.fromEntries(
				Object.entries(form).map(([key, value]) => [key.slice(LABEL_FIELD_PREFIX.length), value])
			) as z.infer<typeof labelsSchema>
	)

export const settingsSchema = z.object({
	siteName: required(80),
	tagline: required(120),
	seoDescription: text(300),
	incipit: required(3000),
	footerText: text(200),
	creditLabel: text(60),
	creditName: text(80),
	creditUrl: safeUrl(300)
})

export const loginSchema = z.object({
	email: string().trim().toLowerCase().pipe(z.email().max(200)),
	password: string().min(1, 'is required')
})

export const beaconSchema = z
	.object({
		type: eventTypeSchema,
		path: string().trim().min(1, 'is required').max(300),
		referrer: string().trim().max(500).default('')
	})
	.refine(
		(beacon) => (beacon.type === 'outbound' ? /^https?:\/\//.test(beacon.path) : beacon.path.startsWith('/')),
		'invalid path'
	)

const loose = <Schema extends z.ZodType>(schema: Schema) =>
	z.preprocess((value) => (value === '' || value === null ? undefined : value), schema.optional())

export const apiListSchema = z.object({
	kind: loose(kindSchema),
	status: loose(statusSchema),
	territory: loose(
		z
			.string()
			.trim()
			.transform((value) => TERRITORIES.find((name) => name.toLowerCase() === value.toLowerCase()) ?? value)
			.pipe(territorySchema)
	),
	limit: z.coerce.number().int().min(1).max(50).default(50),
	page: z.coerce.number().int().min(1).max(1000).default(1)
})

export const archiveQuerySchema = z.object({
	q: z.string().trim().max(80).catch('').default(''),
	territory: territorySchema.or(z.literal('')).catch('').default(''),
	status: statusSchema.or(z.literal('all')).catch('all').default('all'),
	kind: kindSchema.or(z.literal('all')).catch('all').default('all')
})
