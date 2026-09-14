import { getTableConfig } from 'drizzle-orm/pg-core'
import { describe, expect, it } from 'vitest'
import { creatures, revisions, sessions, themeCreatures, themes, users } from './schema'

const references = (table: Parameters<typeof getTableConfig>[0]) =>
	getTableConfig(table).foreignKeys.map((key) => ({ table: key.reference().foreignTable, onDelete: key.onDelete }))

describe('relations', () => {
	it('delete sessions with their user', () => {
		expect(references(sessions)).toEqual([{ table: users, onDelete: 'cascade' }])
	})

	it('delete a theme line-up with its theme, but never let a slotted specimen be deleted', () => {
		expect(references(themeCreatures)).toEqual([
			{ table: themes, onDelete: 'cascade' },
			{ table: creatures, onDelete: 'restrict' }
		])
	})

	it('keep revisions when their author is deleted', () => {
		expect(references(revisions)).toEqual([{ table: users, onDelete: 'set null' }])
	})
})
