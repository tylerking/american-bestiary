import { sql } from 'drizzle-orm'
import type { Analytics } from '$lib/types'
import { db } from '../db'
import { lastMondays } from './calendar'

type Row = Record<string, unknown>
const rows = async (query: ReturnType<typeof sql>) => (await db.execute<Row>(query)).rows
const toInteger = (value: unknown) => Number(value ?? 0) || 0

export async function pruneEvents(): Promise<void> {
	await db.execute(sql`delete from events where created_at < now() - interval '13 months'`)
}

export async function getAnalytics(entries: { path: string; title: string }[]): Promise<Analytics> {
	const [statistics, weekly, content, referrers, outbound] = await Promise.all([
		rows(sql`
			select
				(select count(*) from events where type = 'pageview' and created_at >= now() - interval '30 days')::int as visits_30,
				(select count(*) from events where type = 'pageview' and created_at >= now() - interval '7 days')::int as visits_7,
				(select count(*) from events where type = 'outbound' and created_at >= now() - interval '30 days')::int as outbound_30,
				(select count(*) from events where type = 'pageview' and path like '/creatures/%' and created_at >= now() - interval '30 days')::int as entries_30`),
		rows(sql`
			select to_char(date_trunc('week', created_at), 'YYYY-MM-DD') as week, count(*)::int as total
			from events where type = 'pageview' and created_at >= now() - interval '12 weeks' group by 1`),
		rows(sql`
			select path, count(*)::int as views from events
			where type = 'pageview' and path like '/creatures/%' and created_at >= now() - interval '30 days'
			group by path order by views desc, path limit 8`),
		rows(sql`
			select coalesce(nullif(referrer, ''), 'direct') as host, count(*)::int as views from events
			where type = 'pageview' and created_at >= now() - interval '30 days'
			group by 1 order by 2 desc, 1 limit 8`),
		rows(sql`
			select coalesce(substring(path from '^https?://([^/]+)'), path) as host, count(*)::int as clicks from events
			where type = 'outbound' and created_at >= now() - interval '30 days'
			group by 1 order by 2 desc, 1 limit 8`)
	])

	const titles = new Map(entries.map((entry) => [entry.path, entry.title]))
	const totals = statistics[0] ?? {}
	return {
		stats: {
			visitsLast30Days: toInteger(totals.visits_30),
			visitsLast7Days: toInteger(totals.visits_7),
			outboundLast30Days: toInteger(totals.outbound_30),
			entryViewsLast30Days: toInteger(totals.entries_30)
		},
		visitsByWeek: lastMondays(12).map((week) => ({
			week,
			counts: { Visits: toInteger(weekly.find((row) => row.week === week)?.total) }
		})),
		topEntries: content.map((row) => ({
			path: String(row.path),
			title: titles.get(String(row.path)) ?? String(row.path),
			views: toInteger(row.views)
		})),
		referrers: referrers.map((row) => ({ host: String(row.host), views: toInteger(row.views) })),
		outbound: outbound.map((row) => ({ host: String(row.host), clicks: toInteger(row.clicks) }))
	}
}
