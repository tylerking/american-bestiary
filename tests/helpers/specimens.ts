import type { Specimen, SpecimenSummary } from '$lib/types'

export const specimen = (overrides: Partial<Specimen> = {}): Specimen => ({
	id: '00000000-0000-4000-8000-000000000001',
	slug: 'mothman',
	name: 'Mothman',
	territory: 'West Virginia',
	classification: 'Flying Cryptid / Avian',
	kind: 'bird',
	status: 'misidentification',
	abstract: 'A winged humanoid.',
	gloss: 'Sandhill cranes.',
	etymology: 'The press.',
	anatomy: 'Wings.',
	ecology: 'Point Pleasant.',
	behavior: 'Chases cars.',
	mythology: 'Silver Bridge.',
	sources: [{ url: 'https://en.wikipedia.org/w/index.php?title=Mothman&oldid=1347926662', oldid: 1347926662 }],
	imageKey: 'images/mothman.png',
	publishedAt: new Date('2026-09-01T00:00:00Z'),
	updatedAt: new Date('2026-09-02T00:00:00Z'),
	...overrides
})

export const summary = (overrides: Partial<Specimen> = {}): SpecimenSummary => {
	const { slug, name, territory, classification, kind, status, abstract, gloss, imageKey } = specimen(overrides)
	return { slug, name, territory, classification, kind, status, abstract, gloss, imageKey }
}
