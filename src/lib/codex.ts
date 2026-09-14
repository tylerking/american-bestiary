import { KINDS, TERRITORIES } from './enums'
import type { Kind, Source, Territory } from './types'

export const SITE_NAME = 'American Bestiary'

export function codexOrder<Row extends { kind: Kind; name: string }>(rows: readonly Row[]): Row[] {
	return [...rows].sort(
		(left, right) => KINDS.indexOf(left.kind) - KINDS.indexOf(right.kind) || left.name.localeCompare(right.name, 'en')
	)
}

export function neighbours<Row extends { slug: string }>(
	rows: readonly Row[],
	slug: string
): { previous: Row; next: Row } | null {
	const index = rows.findIndex((row) => row.slug === slug)
	const previous = rows[(index - 1 + rows.length) % rows.length]
	const next = rows[(index + 1) % rows.length]
	if (index === -1 || !previous || !next) return null
	return { previous, next }
}

export function sourceHost(url: string | null): string | null {
	if (!url) return null
	try {
		return new URL(url).hostname.replace(/^www\./, '')
	} catch {
		return null
	}
}

export function revisionUrl(url: string, oldid: number): string {
	const base = new URL(url)
	return `${base.origin}/w/index.php?oldid=${oldid}`
}

export function sourceLink(source: Source): { host: string; href: string } | null {
	const host = sourceHost(source.url)
	if (!host) return null
	return { host, href: source.oldid ? revisionUrl(source.url, source.oldid) : source.url }
}

export const fill = (template: string, values: Record<string, string | number>) =>
	template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match))

const article = (word: string) => (/^[aeiou]/i.test(word) ? 'an' : 'a')

export function describeClassification(classification: string): string {
	return classification
		.replace(/\.$/, '')
		.split(/\s*\/\s*/)
		.map((part) => part.trim().toLowerCase())
		.filter(Boolean)
		.join(' and ')
}

export function altText(template: string, entry: { name: string; classification: string; territory: string }): string {
	const classification = describeClassification(entry.classification)
	return fill(template, {
		name: entry.name,
		article: article(classification),
		classification,
		territory: entry.territory
	})
}

export const territorySlug = (territory: string) => territory.toLowerCase().replace(/\s+/g, '-')

export const territoryFromSlug = (slug: string | null): Territory | null =>
	TERRITORIES.find((territory) => territorySlug(territory) === slug) ?? null
