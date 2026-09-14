import { json } from '@sveltejs/kit'
import { sql } from 'drizzle-orm'
import { db } from '$lib/server/db'
import type { RequestHandler } from './$types'

const headers = { 'cache-control': 'no-store' }

export const GET: RequestHandler = async () => {
	try {
		await db.execute(sql`select 1`)
		return json({ status: 'ok', database: 'ok' }, { headers })
	} catch {
		return json({ status: 'degraded', database: 'unreachable' }, { status: 503, headers })
	}
}
