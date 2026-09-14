import { purgeCache } from '@netlify/functions'

export default async () => {
	await purgeCache({ tags: ['content'] })
}

export const config = { schedule: '0 0 1 * *' }
