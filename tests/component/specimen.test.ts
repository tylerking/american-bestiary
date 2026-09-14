import { screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'
import Specimen from '$lib/components/sections/Specimen'
import { renderWithLabels } from '../helpers/labels'
import { summary } from '../helpers/specimens'

describe('Specimen', () => {
	it('features the specimen of the chosen territory with a way into its entry', () => {
		renderWithLabels(Specimen, { specimen: summary(), territory: 'West Virginia' })
		expect(screen.getByText('Specimen of West Virginia: Mothman.')).toHaveAttribute('aria-live', 'polite')
		expect(screen.getByText('Specimen of West Virginia')).toHaveAttribute('aria-hidden', 'true')
		expect(screen.getByRole('heading', { level: 2, name: 'Mothman' })).toBeInTheDocument()
		expect(screen.queryByText(/illustration by/)).toBeNull()
		expect(screen.getByRole('link', { name: 'Read the entry' })).toHaveAttribute('href', '/creatures/mothman')
		expect(screen.getByRole('img')).toHaveAccessibleName(
			'The Mothman, drawn as a flying cryptid and avian said to live in West Virginia.'
		)
	})

	it('says so when a territory has no published specimen', () => {
		renderWithLabels(Specimen, { specimen: null, territory: 'Ohio' })
		const notes = screen.getAllByText('Ohio has no published specimen yet.')
		expect(notes).toHaveLength(2)
		expect(notes[0]).toHaveAttribute('aria-live', 'polite')
		expect(screen.queryByRole('link')).toBeNull()
	})
})
