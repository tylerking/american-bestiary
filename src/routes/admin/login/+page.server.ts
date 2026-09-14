import { fail, redirect } from '@sveltejs/kit'
import { loginSchema } from '$lib/schemas'
import { verifyLogin } from '$lib/server/auth/auth'
import { clientKey, failures, recordFailure, reset } from '$lib/server/auth/rate-limit'
import { startSession } from '$lib/server/auth/sessions'
import { parseForm } from '$lib/server/http/forms'
import type { Actions, PageServerLoad } from './$types'

const WINDOW_SECONDS = 900
const FAILURES_PER_NETWORK = 8
const FAILURES_BEFORE_DELAY = 10
const DELAY_STEP_MS = 1000
const MAX_DELAY_MS = 5000

const pause = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds))

export const load: PageServerLoad = ({ locals }) => {
	if (locals.admin) throw redirect(303, '/admin')
}

export const actions: Actions = {
	default: async ({ request, cookies, getClientAddress }) => {
		const form = await request.formData()
		const email = String(form.get('email') ?? '')

		const network = clientKey('login', getClientAddress())
		if ((await failures(network)) >= FAILURES_PER_NETWORK) {
			return fail(429, { message: 'Too many attempts. Try again in a few minutes.', email })
		}

		const parsed = parseForm(form, loginSchema)
		if (!parsed.ok) return fail(400, { message: 'Enter your email and password.', email, credentials: true })

		// A per-account lockout would let anyone lock the admin out, so repeated failures only slow each attempt.
		const account = clientKey('login-account', parsed.data.email)
		const excess = (await failures(account)) - FAILURES_BEFORE_DELAY
		if (excess > 0) await pause(Math.min(excess * DELAY_STEP_MS, MAX_DELAY_MS))

		const result = await verifyLogin(parsed.data.email, parsed.data.password)
		if (result === 'unconfigured') return fail(503, { message: 'Sign-in is not configured on this server.', email })
		if (result === 'wrong') {
			await Promise.all([recordFailure(network, WINDOW_SECONDS), recordFailure(account, WINDOW_SECONDS)])
			return fail(401, { message: 'Incorrect email or password.', email, credentials: true })
		}

		await Promise.all([reset(network), reset(account)])
		await startSession(cookies, result.userId)
		throw redirect(303, '/admin')
	}
}
