import { describe, expect, it } from 'vitest'
import { DEFAULT_LABELS } from '$lib/labels/label-defaults'
import { specimen } from '../../../../tests/helpers/specimens'
import { CREATURE_FIELDS, creatureSnapshot, settingsSnapshot, themeSnapshot } from './snapshots'

describe('snapshots', () => {
	it('captures every editable specimen field and the publish time as ISO text', () => {
		const row = specimen()
		const snapshot = creatureSnapshot({ ...row, createdAt: new Date() })
		expect(Object.keys(snapshot)).toEqual([...CREATURE_FIELDS, 'publishedAt'])
		expect(snapshot.publishedAt).toBe('2026-09-01T00:00:00.000Z')
		expect(creatureSnapshot({ ...row, publishedAt: null, createdAt: new Date() }).publishedAt).toBeNull()
	})

	it('orders theme slots by position', () => {
		const theme = {
			id: 't',
			slug: 's',
			title: 'T',
			description: 'D',
			month: 3,
			createdAt: new Date(),
			updatedAt: new Date()
		}
		const snapshot = themeSnapshot(theme, [
			{ position: 2, creatureId: 'b', note: 'two' },
			{ position: 1, creatureId: 'a', note: 'one' }
		])
		expect(snapshot).toEqual({
			slug: 's',
			title: 'T',
			description: 'D',
			month: 3,
			slots: [
				{ position: 1, creatureId: 'a', note: 'one' },
				{ position: 2, creatureId: 'b', note: 'two' }
			]
		})
	})

	it('captures settings with their labels', () => {
		const settings = {
			siteName: 'A',
			tagline: 'B',
			seoDescription: 'C',
			incipit: 'D',
			footerText: 'E',
			creditLabel: 'F',
			creditName: 'G',
			creditUrl: '/h',
			labels: DEFAULT_LABELS
		}
		expect(settingsSnapshot(settings)).toEqual(settings)
	})
})
