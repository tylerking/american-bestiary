import { describe, expect, it } from 'vitest'
import { announce, live } from './announcer.svelte'

describe('announce', () => {
	it('clears the live region before repeating a message', async () => {
		live.message = 'Saved.'
		const pending = announce('Saved.')
		expect(live.message).toBe('')
		await pending
		expect(live.message).toBe('Saved.')
	})
})
