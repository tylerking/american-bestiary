import { json } from '@sveltejs/kit'
import { sourceHost } from '$lib/codex'
import { mediaUrl } from '$lib/media'
import type { MonthlyTheme, Specimen, SpecimenSummary } from '$lib/types'
import { PUBLIC_CACHE } from './http/cache'

export const API_HEADERS = { ...PUBLIC_CACHE, 'access-control-allow-origin': '*' }

export const apiError = (status: number, message: string) =>
	json({ error: message }, { status, headers: { 'access-control-allow-origin': '*', 'cache-control': 'no-store' } })

export function publicSummary(specimen: SpecimenSummary, origin: string) {
	return {
		slug: specimen.slug,
		name: specimen.name,
		territory: specimen.territory,
		classification: specimen.classification,
		kind: specimen.kind,
		status: specimen.status,
		abstract: specimen.abstract,
		gloss: specimen.gloss,
		image: `${origin}${mediaUrl(specimen.imageKey)}`,
		url: `${origin}/creatures/${specimen.slug}`
	}
}

export function publicSpecimen(specimen: Specimen, origin: string) {
	return {
		...publicSummary(specimen, origin),
		sections: {
			etymology: specimen.etymology,
			anatomy: specimen.anatomy,
			ecology: specimen.ecology,
			behavior: specimen.behavior,
			mythology: specimen.mythology
		},
		sources: specimen.sources.flatMap((source) => {
			const host = sourceHost(source.url)
			return host ? [{ url: source.url, host, oldid: source.oldid }] : []
		}),
		updatedAt: specimen.updatedAt.toISOString()
	}
}

export function publicTheme(theme: MonthlyTheme, origin: string) {
	return {
		slug: theme.slug,
		title: theme.title,
		description: theme.description,
		month: theme.month,
		members: theme.members.map((member) => ({
			...publicSummary(member, origin),
			position: member.position,
			note: member.note
		}))
	}
}
