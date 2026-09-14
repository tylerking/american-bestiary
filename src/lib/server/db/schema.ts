import { sql } from 'drizzle-orm'
import {
	check,
	index,
	integer,
	jsonb,
	pgTable,
	primaryKey,
	serial,
	text,
	timestamp,
	unique,
	uuid
} from 'drizzle-orm/pg-core'
import type { EventType, Kind, Labels, RevisionEntity, Source, Status, UserRole } from '$lib/types'
import { eventTypeSchema, kindSchema, revisionEntitySchema, statusSchema, userRoleSchema } from '../../schemas'

const oneOf = (values: readonly string[]) => sql.raw(values.map((value) => `'${value}'`).join(', '))

const timestamps = {
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
}

export const creatures = pgTable(
	'creatures',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		slug: text('slug').notNull().unique(),
		name: text('name').notNull(),
		territory: text('territory').notNull().unique(),
		classification: text('classification').notNull(),
		kind: text('kind').$type<Kind>().notNull(),
		status: text('status').$type<Status>().notNull(),
		abstract: text('abstract').notNull(),
		gloss: text('gloss').notNull(),
		etymology: text('etymology').notNull(),
		anatomy: text('anatomy').notNull(),
		ecology: text('ecology').notNull(),
		behavior: text('behavior').notNull(),
		mythology: text('mythology').notNull(),
		sources: jsonb('sources').$type<Source[]>().notNull().default([]),
		imageKey: text('image_key').notNull(),
		publishedAt: timestamp('published_at', { withTimezone: true }),
		...timestamps
	},
	(table) => [
		check('creatures_kind_check', sql`${table.kind} in (${oneOf(kindSchema.options)})`),
		check('creatures_status_check', sql`${table.status} in (${oneOf(statusSchema.options)})`)
	]
)

export const themes = pgTable(
	'themes',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		slug: text('slug').notNull().unique(),
		title: text('title').notNull(),
		description: text('description').notNull(),
		month: integer('month').notNull().unique(),
		...timestamps
	},
	(table) => [check('themes_month_check', sql`${table.month} between 1 and 12`)]
)

export const themeCreatures = pgTable(
	'theme_creatures',
	{
		themeId: uuid('theme_id')
			.notNull()
			.references(() => themes.id, { onDelete: 'cascade' }),
		creatureId: uuid('creature_id')
			.notNull()
			.references(() => creatures.id, { onDelete: 'restrict' }),
		position: integer('position').notNull(),
		note: text('note').notNull()
	},
	(table) => [
		primaryKey({ columns: [table.themeId, table.creatureId] }),
		unique('theme_creatures_position_unique').on(table.themeId, table.position),
		check('theme_creatures_position_check', sql`${table.position} between 1 and 4`)
	]
)

export const siteSettings = pgTable('site_settings', {
	id: uuid('id').primaryKey().defaultRandom(),
	siteName: text('site_name').notNull(),
	tagline: text('tagline').notNull(),
	seoDescription: text('seo_description').notNull().default(''),
	incipit: text('incipit').notNull(),
	footerText: text('footer_text').notNull().default(''),
	creditLabel: text('credit_label').notNull().default(''),
	creditName: text('credit_name').notNull().default(''),
	creditUrl: text('credit_url').notNull().default(''),
	labels: jsonb('labels').$type<Partial<Labels>>().notNull().default({}),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
})

export const rateLimits = pgTable('rate_limits', {
	key: text('key').primaryKey(),
	count: integer('count').notNull().default(0),
	expiresAt: timestamp('expires_at', { withTimezone: true }).notNull()
})

export const users = pgTable(
	'users',
	{
		id: serial('id').primaryKey(),
		email: text('email').notNull().unique(),
		passwordHash: text('password_hash').notNull(),
		role: text('role').$type<UserRole>().notNull().default('admin'),
		...timestamps
	},
	(table) => [check('users_role_check', sql`${table.role} in (${oneOf(userRoleSchema.options)})`)]
)

export const sessions = pgTable(
	'sessions',
	{
		id: text('id').primaryKey(),
		userId: integer('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
		lastSeenAt: timestamp('last_seen_at', { withTimezone: true }).notNull().defaultNow(),
		expiresAt: timestamp('expires_at', { withTimezone: true }).notNull()
	},
	(table) => [index('sessions_user_id_index').on(table.userId)]
)

export const events = pgTable(
	'events',
	{
		id: serial('id').primaryKey(),
		type: text('type').$type<EventType>().notNull(),
		path: text('path').notNull().default(''),
		referrer: text('referrer').notNull().default(''),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [
		index('events_type_created_at_index').on(table.type, table.createdAt),
		index('events_created_at_index').on(table.createdAt),
		check('events_type_check', sql`${table.type} in (${oneOf(eventTypeSchema.options)})`)
	]
)

export const revisions = pgTable(
	'revisions',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		entityType: text('entity_type').$type<RevisionEntity>().notNull(),
		entityId: uuid('entity_id').notNull(),
		snapshot: jsonb('snapshot').$type<Record<string, unknown>>().notNull(),
		userId: integer('user_id').references(() => users.id, { onDelete: 'set null' }),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [
		index('revisions_entity_index').on(table.entityType, table.entityId, table.createdAt),
		check('revisions_entity_type_check', sql`${table.entityType} in (${oneOf(revisionEntitySchema.options)})`)
	]
)
