import { describe, expect, it, vi } from 'vitest'

const execute = vi.hoisted(() => vi.fn())
vi.mock('$lib/server/db', () => ({ db: { execute } }))

const { GET } = await import('./+server')

const call = () => GET({} as Parameters<typeof GET>[0]) as Promise<Response>

describe('GET /api/health', () => {
	it('reports a reachable database, uncached', async () => {
		execute.mockResolvedValueOnce({ rows: [] })
		const response = await call()
		expect(response.status).toBe(200)
		expect(response.headers.get('cache-control')).toBe('no-store')
		expect(await response.json()).toEqual({ status: 'ok', database: 'ok' })
	})

	it('reports a degraded service when the database is unreachable', async () => {
		execute.mockRejectedValueOnce(new Error('down'))
		const response = await call()
		expect(response.status).toBe(503)
		expect(await response.json()).toEqual({ status: 'degraded', database: 'unreachable' })
	})
})
