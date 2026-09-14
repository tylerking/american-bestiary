import { getSettings } from '$lib/server/db/queries'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async () => ({ settings: await getSettings() })
