import { createHmac } from 'node:crypto'
import { isIPv6 } from 'node:net'
import { and, eq, gt, lt, sql } from 'drizzle-orm'
import { db } from '../db'
import { rateLimits } from '../db/schema'
import { env } from '../env'

const IPV4_MAPPED = /^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/i

function networkOf(address: string): string {
	const mapped = address.match(IPV4_MAPPED)?.[1]
	if (mapped) return mapped
	if (!isIPv6(address)) return address
	const [head = '', tail = ''] = address.split('::')
	const left = head ? head.split(':') : []
	const right = tail ? tail.split(':') : []
	const groups = address.includes('::')
		? [...left, ...Array<string>(8 - left.length - right.length).fill('0'), ...right]
		: left
	return `${groups
		.slice(0, 4)
		.map((group) => group.toLowerCase().replace(/^0+(?=.)/, ''))
		.join(':')}::/64`
}

export function clientKey(scope: string, address: string): string {
	const secret = env.appSecret()
	if (!secret.success) throw new Error('APP_SECRET must be set and at least 32 characters')
	return `${scope}:${createHmac('sha256', secret.data).update(networkOf(address)).digest('base64url')}`
}

async function count(key: string, windowSeconds: number): Promise<number> {
	const expired = sql`${rateLimits.expiresAt} < now()`
	const [row] = await db
		.insert(rateLimits)
		.values({ key, count: 1, expiresAt: sql`now() + make_interval(secs => ${windowSeconds})` })
		.onConflictDoUpdate({
			target: rateLimits.key,
			set: {
				count: sql`case when ${expired} then 1 else ${rateLimits.count} + 1 end`,
				expiresAt: sql`case when ${expired} then excluded.expires_at else ${rateLimits.expiresAt} end`
			}
		})
		.returning({ count: rateLimits.count })
	if (row?.count === 1) await db.delete(rateLimits).where(lt(rateLimits.expiresAt, sql`now()`))
	return row?.count ?? 0
}

export async function allow(key: string, limit: number, windowSeconds: number): Promise<boolean> {
	return (await count(key, windowSeconds)) <= limit
}

export async function recordFailure(key: string, windowSeconds: number): Promise<void> {
	await count(key, windowSeconds)
}

export async function failures(key: string): Promise<number> {
	const [row] = await db
		.select({ count: rateLimits.count })
		.from(rateLimits)
		.where(and(eq(rateLimits.key, key), gt(rateLimits.expiresAt, sql`now()`)))
		.limit(1)
	return row?.count ?? 0
}

export async function reset(key: string): Promise<void> {
	await db.delete(rateLimits).where(eq(rateLimits.key, key))
}
